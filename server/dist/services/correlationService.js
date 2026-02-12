"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrelationService = void 0;
const prisma_1 = require("../lib/prisma");
const axios_1 = __importDefault(require("axios"));
// Configuration
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:8000";
class CorrelationService {
    /**
     * Ingests a log and checks for incident patterns.
     */
    static async ingestLog(data) {
        // 1. Save Log
        const log = await prisma_1.prisma.log.create({
            data: {
                ip: data.ip,
                eventType: data.eventType,
                details: data.details || {}
            }
        });
        // 2. Check for Correlations (Real-time)
        // Check 1: Brute Force
        if (data.eventType === "LOGIN_SUCCESS") {
            await this.checkBruteForce(data.ip);
        }
        // Check 2: Prompt Injection (if event comes from AI Guard)
        if (data.eventType === "PROMPT_INJECTION_ATTEMPT") {
            // For simplicity, treat every injection attempt as a potential incident or flag it
            // Real logic might aggregate them.
            await this.createIncident("Prompt Injection Detected", "User attempted to bypass safety guardrails.", "HIGH", "BLOCK", [log.id], "Prompt Injection", "T1059" // Command and Scripting Interpreter
            );
        }
        // Check 3: Honeytoken Triggered (Critical)
        if (data.eventType === "HONEYTOKEN_TRIGGERED") {
            await this.createIncident("Honeytoken Leak Detected (Critical)", "The AI model outputted a secret honeytoken, indicating a successful prompt injection and data exfiltration attempt.", "CRITICAL", "BLOCK", [log.id], "Data Exfiltration", "T1560" // Archive Collected Data (closest fit for exfiltration)
            );
        }
        // Check 4: SQL Injection
        if (data.eventType === "SQL_QUERY" || data.eventType === "HTTP_REQUEST") {
            await this.checkSqlInjection(data, log.id);
        }
        // Check 4: DDoS (Volume Check)
        await this.checkDDoS(data.ip);
        return log;
    }
    /**
     * Checks if a successful login was preceded by multiple failures.
     */
    static async checkBruteForce(ip) {
        const TIME_WINDOW_MINUTES = 15;
        const THRESHOLD = 5;
        const timeWindowStart = new Date(Date.now() - TIME_WINDOW_MINUTES * 60 * 1000);
        // Count failed logins from this IP in the window
        const failedLogins = await prisma_1.prisma.log.findMany({
            where: {
                ip: ip,
                eventType: "LOGIN_FAIL",
                timestamp: {
                    gte: timeWindowStart
                }
            },
            orderBy: { timestamp: 'desc' }
        });
        if (failedLogins.length >= THRESHOLD) {
            // Found a correlation!
            // Create Incident
            const logIds = failedLogins.map(l => l.id);
            // Add the current success log (we'd need the ID, but let's just use the failures for now or fetch the latest success)
            await this.createIncident("Brute Force Success", `Detected ${failedLogins.length} failed logins followed by a success from IP ${ip}.`, "CRITICAL", "FLAG", logIds, "Brute Force Success", "T1110" // MITRE ID
            );
        }
    }
    /**
     * Checks for common SQL Injection patterns in query or parameters.
     */
    static async checkSqlInjection(data, logId) {
        const payload = JSON.stringify(data.details || "").toLowerCase();
        // Common SQLi signatures
        const signatures = [
            "union select",
            "or 1=1",
            "drop table",
            "--",
            ";--",
            "insert into",
            "xp_cmdshell"
        ];
        const detected = signatures.find(sig => payload.includes(sig));
        if (detected) {
            await this.createIncident("SQL Injection Attempt", `Detected SQL Injection pattern '${detected}' in request from ${data.ip}.`, "HIGH", "BLOCK", [logId], "SQL Injection", "T1190" // Exploit Public-Facing Application
            );
        }
    }
    /**
     * Checks for high volume of requests from a single IP (DDoS / DoS).
     */
    static async checkDDoS(ip) {
        const TIME_WINDOW_SECONDS = 10;
        const THRESHOLD = 20; // 20 requests in 10 seconds is suspicious for this MVP
        const timeWindowStart = new Date(Date.now() - TIME_WINDOW_SECONDS * 1000);
        const recentLogs = await prisma_1.prisma.log.count({
            where: {
                ip: ip,
                timestamp: {
                    gte: timeWindowStart
                }
            }
        });
        if (recentLogs >= THRESHOLD) {
            // Check if we already have an open incident for this to avoid spamming?
            // For MVP, just create one. Ideally we would deduplicate.
            // We need to fetch the logs to link them
            const logs = await prisma_1.prisma.log.findMany({
                where: {
                    ip: ip,
                    timestamp: {
                        gte: timeWindowStart
                    }
                },
                take: 10 // Just link the last 10
            });
            await this.createIncident("DDoS Attack Detected", `High traffic volume detected from IP ${ip}: ${recentLogs} requests in ${TIME_WINDOW_SECONDS}s.`, "CRITICAL", "BLOCK", logs.map(l => l.id), "DDoS Attack", "T1498" // Network Denial of Service
            );
        }
    }
    /**
     * Creates an incident, maps to MITRE, and gets AI Summary.
     */
    static async createIncident(title, description, severity, decision, logIds, incidentType, mitreTechnique) {
        // 1. Get AI Summary
        let aiSummary = description;
        let remediationSteps = [];
        try {
            // Fetch logs to send to AI
            const logs = await prisma_1.prisma.log.findMany({
                where: { id: { in: logIds } }
            });
            const aiResponse = await axios_1.default.post(`${AI_ENGINE_URL}/summarize`, {
                logs: logs.map(l => ({
                    timestamp: l.timestamp.toISOString(),
                    eventType: l.eventType,
                    details: l.details || {}
                })),
                incidentType: incidentType
            });
            if (aiResponse.data.summary) {
                aiSummary = aiResponse.data.summary;
            }
            if (aiResponse.data.remediation_steps) {
                remediationSteps = aiResponse.data.remediation_steps;
            }
        }
        catch (error) {
            console.error("Failed to get AI summary:", error);
        }
        // 2. Persist Incident
        const incident = await prisma_1.prisma.incident.create({
            data: {
                title,
                description: aiSummary, // Use the AI enhanced summary
                severity,
                decision,
                mitreTechnique,
                remediationSteps,
                logs: {
                    connect: logIds.map(id => ({ id }))
                }
            }
        });
        console.log(`Incident Created: ${incident.id} - ${incident.title}`);
        return incident;
    }
}
exports.CorrelationService = CorrelationService;
