
import React, { useState } from 'react';
import { aiEngineApi } from '../api';
import { Shield, Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function ServerSafe() {
    const [file, setFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        setAnalysis(null);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await aiEngineApi.post('/analyze-logs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAnalysis(res.data.analysis);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || "Failed to analyze logs. Ensure AI Engine is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mt-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-100">
                <Shield className="text-blue-400" />
                Server-Safe: AI Log Analysis & Hardening
            </h2>
            <p className="text-gray-400 text-sm mb-6">
                Upload your server logs (CSV/JSON) to receive an AI-powered security audit, 
                vulnerability assessment, and concrete hardening strategies.
            </p>

            <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-1/3">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">CSV or JSON (MAX. 5MB)</p>
                        </div>
                        <input type="file" className="hidden" accept=".csv,.json,.txt" onChange={handleFileChange} />
                    </label>
                    
                    {file && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 p-2 rounded">
                            <FileText size={16} />
                            <span className="truncate">{file.name}</span>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={loading || !file}
                        className={`mt-4 w-full py-2 px-4 rounded font-medium transition-colors flex items-center justify-center gap-2
                            ${loading || !file 
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        {loading ? (
                            <>Processing...</>
                        ) : (
                            <>Analyze Logs</>
                        )}
                    </button>

                    {error && (
                        <div className="mt-4 p-3 bg-red-900/20 border border-red-800/50 text-red-300 text-sm rounded flex items-start gap-2">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                <div className="w-full md:w-2/3 bg-black/30 rounded-lg border border-gray-800 p-4 min-h-[200px]">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <p>Gemini AI is analyzing your logs for threats...</p>
                        </div>
                    ) : analysis ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{analysis}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600">
                            <Shield size={48} className="mb-2 opacity-20" />
                            <p>Upload a file to see the security analysis report here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
