"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const correlationService_1 = require("../services/correlationService");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
// Ingest a new log
router.post("/", async (req, res) => {
    try {
        const { ip, eventType, details } = req.body;
        if (!ip || !eventType) {
            return res.status(400).json({ message: "Missing required fields: ip, eventType" });
        }
        const log = await correlationService_1.CorrelationService.ingestLog({
            ip,
            eventType,
            details
        });
        res.status(201).json(log);
    }
    catch (error) {
        console.error("Error ingesting log:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// Get recent logs (visualization)
router.get("/", async (req, res) => {
    try {
        const logs = await prisma_1.prisma.log.findMany({
            orderBy: { timestamp: 'desc' },
            take: 50 // Limit to last 50 for visualization performance
        });
        res.json(logs);
    }
    catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// Export all logs (dataset download)
router.get("/export", async (req, res) => {
    try {
        const logs = await prisma_1.prisma.log.findMany({
            orderBy: { timestamp: 'desc' }
        });
        // Return as downloadable JSON file
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=server_logs_dataset.json');
        res.json(logs);
    }
    catch (error) {
        console.error("Error exporting logs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// Get Incidents (for Dashboard)
router.get("/incidents", async (req, res) => {
    try {
        const incidents = await prisma_1.prisma.incident.findMany({
            orderBy: { createdAt: 'desc' },
            include: { logs: true }
        });
        res.json(incidents);
    }
    catch (error) {
        console.error("Error fetching incidents:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// Clear all incidents (Reset for demo)
router.delete("/incidents", async (req, res) => {
    try {
        await prisma_1.prisma.incident.deleteMany({});
        res.status(200).json({ message: "All incidents cleared" });
    }
    catch (error) {
        console.error("Error clearing incidents:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = router;
