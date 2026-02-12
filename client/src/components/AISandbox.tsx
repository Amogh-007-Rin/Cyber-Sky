import React, { useState } from 'react';
import { aiEngineApi } from '../api';
import { Send, Shield, AlertTriangle, CheckCircle, XCircle, Lock, MessageSquare } from 'lucide-react';

interface SecurityContract {
    decision: "ALLOW" | "BLOCK" | "FLAG" | "SUSPICIOUS";
    confidence_score: number;
    reasoning: string;
    consensus_note?: string;
}

interface DLPResponse {
    original_response: string;
    safe_response: string;
    is_safe: boolean;
    triggered_rules: string[];
}

export function AISandbox() {
    const [prompt, setPrompt] = useState("");
    const [inputResult, setInputResult] = useState<SecurityContract | null>(null);
    const [dlpResult, setDlpResult] = useState<DLPResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState<"IDLE" | "SCANNING_INPUT" | "GENERATING_OUTPUT" | "SCANNING_OUTPUT" | "DONE">("IDLE");

    const handleAnalyze = async () => {
        if (!prompt) return;
        setLoading(true);
        setStage("SCANNING_INPUT");
        setInputResult(null);
        setDlpResult(null);

        try {
            // Step 1: Input Analysis
            const response = await aiEngineApi.post('/analyze', { prompt });
            setInputResult(response.data);

            if (response.data.decision === "ALLOW" || response.data.decision === "FLAG" || response.data.decision === "SUSPICIOUS") {
                // Step 2: Generate & Check Output (DLP)
                setStage("GENERATING_OUTPUT");
                // Short delay to simulate generation time
                await new Promise(r => setTimeout(r, 800)); 
                
                setStage("SCANNING_OUTPUT");
                const dlpResponse = await aiEngineApi.post('/simulate_chat', { prompt });
                setDlpResult(dlpResponse.data);
            }
            
            setStage("DONE");
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] text-white">
            {/* Left: Input Terminal */}
            <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 flex flex-col shadow-xl">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-sm font-mono text-gray-400">user@cybersky:~/prompt</span>
                </div>
                <textarea
                    className="flex-1 bg-transparent border-none outline-none font-mono text-green-400 resize-none p-2"
                    placeholder="Enter prompt to test SentinelGuard... (Try asking for secrets!)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-mono text-sm transition-colors shadow-lg shadow-blue-900/20"
                    >
                        {loading ? "Processing..." : <><Send size={16} /> Run Simulation</>}
                    </button>
                </div>
            </div>

            {/* Right: Defense Middleware Output */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 overflow-y-auto flex flex-col gap-4">
                
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
                    <Shield className="text-blue-400" size={20} />
                    <span className="font-semibold text-gray-200">Cyber Sky Middleware</span>
                </div>

                {stage === "IDLE" && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <Shield size={48} className="mb-2 opacity-20" />
                        <p>Ready to analyze traffic...</p>
                    </div>
                )}

                {/* Step 1: Input Analysis Result */}
                {(inputResult || stage === "SCANNING_INPUT") && (
                    <div className={`p-4 rounded border ${stage === "SCANNING_INPUT" ? "border-blue-500/50 bg-blue-900/10 animate-pulse" : "border-gray-700 bg-gray-800"}`}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-gray-400 uppercase">Step 1: Input Guard</h3>
                            {stage === "SCANNING_INPUT" && <span className="text-xs text-blue-400">Scanning...</span>}
                        </div>
                        
                        {inputResult && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1
                                        ${inputResult.decision === 'ALLOW' ? 'bg-green-900/50 text-green-400' : 
                                          inputResult.decision === 'BLOCK' ? 'bg-red-900/50 text-red-400' : 
                                          'bg-yellow-900/50 text-yellow-400'}`}>
                                        {inputResult.decision}
                                    </span>
                                    <span className="text-xs text-gray-500">Risk: {(inputResult.confidence_score * 100).toFixed(0)}%</span>
                                </div>
                                <p className="text-xs text-gray-300 font-mono">{inputResult.reasoning}</p>
                                {inputResult.consensus_note && (
                                    <div className="mt-2 text-[10px] text-gray-500 font-mono border-t border-gray-700/50 pt-1">
                                        <span className="text-blue-500 font-semibold">Multi-Agent Consensus:</span> {inputResult.consensus_note}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Output Analysis Result (Only if Input was Allowed) */}
                {(dlpResult || stage === "GENERATING_OUTPUT" || stage === "SCANNING_OUTPUT") && (
                    <div className={`p-4 rounded border flex-1 ${stage === "SCANNING_OUTPUT" || stage === "GENERATING_OUTPUT" ? "border-purple-500/50 bg-purple-900/10 animate-pulse" : "border-gray-700 bg-gray-800"}`}>
                         <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-bold text-gray-400 uppercase">Step 2: Output Guard (DLP)</h3>
                            {stage === "GENERATING_OUTPUT" && <span className="text-xs text-purple-400">Generating Response...</span>}
                            {stage === "SCANNING_OUTPUT" && <span className="text-xs text-purple-400">Scanning for PII...</span>}
                        </div>

                        {dlpResult && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    {dlpResult.is_safe ? (
                                        <span className="bg-green-900/50 text-green-400 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                            <CheckCircle size={12} /> SAFE
                                        </span>
                                    ) : (
                                        <span className="bg-red-900/50 text-red-400 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                            <Lock size={12} /> {dlpResult.triggered_rules.some(r => r.includes("Honeytoken")) ? "HONEYTOKEN TRAP TRIGGERED" : "DATA LEAK PREVENTED"}
                                        </span>
                                    )}
                                </div>

                                {!dlpResult.is_safe && (
                                    <div className={`text-xs p-2 rounded border ${dlpResult.triggered_rules.some(r => r.includes("Honeytoken")) ? "text-orange-300 bg-orange-950/30 border-orange-900/50" : "text-red-300 bg-red-950/30 border-red-900/50"}`}>
                                        Detected: {dlpResult.triggered_rules.join(", ")}
                                    </div>
                                )}

                                <div className="bg-black/50 p-3 rounded font-mono text-sm text-gray-300 h-32 overflow-y-auto border border-gray-700">
                                    {dlpResult.safe_response}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

