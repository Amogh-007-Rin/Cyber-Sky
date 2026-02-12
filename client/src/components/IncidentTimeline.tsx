import React, { useEffect, useState } from 'react';
import api from '../api';
import { Activity, ShieldAlert, Clock, Zap, Trash2 } from 'lucide-react';

interface Log {
    id: number;
    ip: string;
    eventType: string;
    timestamp: string;
}

interface Incident {
    id: number;
    title: string;
    description: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    decision: string;
    createdAt: string;
    mitreTechnique?: string;
    remediationSteps?: string[];
}

export function IncidentTimeline({ incidents = [], onRefresh, onSimulationComplete }: { incidents?: Incident[], onRefresh?: () => void, onSimulationComplete?: () => void }) {
    const [simulating, setSimulating] = useState(false);

    const runSimulation = async (type: "BRUTE_FORCE" | "SQL_INJECTION" | "DDOS") => {
        setSimulating(true);
        try {
            const ip = `192.168.1.${Math.floor(Math.random() * 200) + 10}`;

            if (type === "BRUTE_FORCE") {
                // 1. Send 5 failed logins
                for (let i = 0; i < 6; i++) {
                    await api.post('/logs', {
                        ip: ip,
                        eventType: "LOGIN_FAIL",
                        details: { method: "password", user: "admin" }
                    });
                }
                // 2. Send 1 success (Trigger Incident)
                await api.post('/logs', {
                    ip: ip,
                    eventType: "LOGIN_SUCCESS",
                    details: { method: "password", user: "admin" }
                });
            } 
            else if (type === "SQL_INJECTION") {
                await api.post('/logs', {
                    ip: ip,
                    eventType: "SQL_QUERY",
                    details: { 
                        query: "SELECT * FROM users WHERE username = 'admin' OR 1=1 --",
                        source: "search_bar"
                    }
                });
            }
            else if (type === "DDOS") {
                // Send 25 requests rapidly
                const promises = [];
                for (let i = 0; i < 25; i++) {
                    promises.push(api.post('/logs', {
                        ip: ip,
                        eventType: "HTTP_REQUEST",
                        details: { path: "/api/login", method: "GET" }
                    }));
                }
                await Promise.all(promises);
            }
            
            // 3. Refresh incidents and logs
            if (onRefresh) {
                setTimeout(onRefresh, 1000);
            }
            if (onSimulationComplete) {
                setTimeout(onSimulationComplete, 500); // Trigger log refresh slightly earlier
            }
        } catch (error) {
            console.error("Simulation failed", error);
        } finally {
            setSimulating(false);
        }
    };

    const handleClear = async () => {
        try {
            await api.delete('/logs/incidents');
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Failed to clear incidents", error);
        }
    };

    return (
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 h-full flex flex-col">
             <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
                <div className="flex items-center gap-2">
                    <Activity className="text-purple-400" size={20} />
                    <span className="font-semibold text-gray-200">Live Incident Feed</span>
                </div>
                <div className="flex gap-1">
                    <button 
                        onClick={() => runSimulation("BRUTE_FORCE")}
                        disabled={simulating}
                        title="Simulate Brute Force"
                        className="text-xs bg-red-900/30 hover:bg-red-800 text-red-300 border border-red-800/50 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                    >
                        <Zap size={10} /> BF
                    </button>
                    <button 
                        onClick={() => runSimulation("SQL_INJECTION")}
                        disabled={simulating}
                        title="Simulate SQL Injection"
                        className="text-xs bg-orange-900/30 hover:bg-orange-800 text-orange-300 border border-orange-800/50 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                    >
                        <Zap size={10} /> SQL
                    </button>
                    <button 
                        onClick={() => runSimulation("DDOS")}
                        disabled={simulating}
                        title="Simulate DDoS"
                        className="text-xs bg-purple-900/30 hover:bg-purple-800 text-purple-300 border border-purple-800/50 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                    >
                        <Zap size={10} /> DDoS
                    </button>
                    <button 
                        onClick={handleClear}
                        title="Clear all incidents"
                        className="text-xs bg-gray-800 hover:bg-red-900/50 text-gray-300 hover:text-red-300 px-2 py-1 rounded flex items-center gap-1 transition-colors border border-gray-700 hover:border-red-800/50"
                    >
                        <Trash2 size={12} /> Clear
                    </button>
                </div>
            </div>
            
            <div className="relative pl-4 border-l border-gray-700 space-y-8 overflow-y-auto flex-1">
                {incidents.length === 0 && (
                    <div className="text-gray-500 text-sm italic pl-2 pt-4">No active incidents detected.</div>
                )}
                
                {incidents.map((incident) => (
                    <div key={incident.id} className="relative group animate-in fade-in slide-in-from-left-4 duration-500">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-gray-900
                            ${incident.severity === 'CRITICAL' ? 'bg-red-500' : 
                              incident.severity === 'HIGH' ? 'bg-orange-500' : 
                              'bg-yellow-500'}`}>
                        </div>

                        {/* Content */}
                        <div className="bg-gray-950 p-3 rounded border border-gray-800 hover:border-gray-600 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-white font-medium text-sm">{incident.title}</h4>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(incident.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                            
                            <p className="text-gray-400 text-xs mb-2 leading-relaxed">
                                {incident.description}
                            </p>
                            
                            {incident.remediationSteps && incident.remediationSteps.length > 0 && (
                                <div className="mb-2 bg-gray-900/50 p-2 rounded border border-gray-800">
                                    <h5 className="text-[10px] uppercase font-bold text-blue-400 mb-1">Automated Playbook</h5>
                                    <ul className="list-disc list-inside text-[10px] text-gray-400 space-y-0.5">
                                        {incident.remediationSteps.slice(0, 3).map((step, i) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex gap-2 text-xs flex-wrap">
                                <span className={`px-2 py-0.5 rounded bg-opacity-20 
                                    ${incident.severity === 'CRITICAL' ? 'bg-red-500 text-red-400' : 'bg-orange-500 text-orange-400'}`}>
                                    {incident.severity}
                                </span>
                                {incident.mitreTechnique && (
                                    <span className="px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-900/50">
                                        MITRE {incident.mitreTechnique}
                                    </span>
                                )}
                                <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                                    {incident.decision}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
