import React, { useState, useEffect } from 'react';
import { Download, Server, RefreshCw } from 'lucide-react';
import api from '../api';

interface Log {
    id: number;
    ip: string;
    eventType: string;
    timestamp: string;
    details: any;
}

export function ServerLogsViewer({ refreshTrigger }: { refreshTrigger?: number }) {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        // Silent loading if just refreshing in background
        // setLoading(true); 
        try {
            const res = await api.get('/logs');
            setLogs(res.data);
        } catch (err) {
            console.error("Failed to fetch logs", err);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [refreshTrigger]);

    useEffect(() => {
        const interval = setInterval(fetchLogs, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const handleDownload = async () => {
        try {
            const response = await api.get('/logs/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `server_logs_dataset_${new Date().toISOString()}.json`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download dataset", error);
        }
    };

    return (
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mt-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-100">
                    <Server size={20} className="text-blue-400"/>
                    Server Request Logs
                </h2>
                <div className="flex gap-2">
                     <button 
                        onClick={fetchLogs}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded border border-gray-700 transition-colors"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 text-xs rounded border border-blue-800/50 transition-colors"
                    >
                        <Download size={14} />
                        Download Dataset
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto border border-gray-800 rounded-lg bg-black/20">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-gray-800 text-gray-200 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">Event Type</th>
                            <th className="px-4 py-3">IP Address</th>
                            <th className="px-4 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic">
                                    No logs recorded yet.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-4 py-2 font-mono text-xs text-gray-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                            log.eventType === 'LOGIN_SUCCESS' ? 'bg-green-900/20 text-green-400 border-green-900/50' :
                                            log.eventType === 'LOGIN_FAIL' ? 'bg-red-900/20 text-red-400 border-red-900/50' :
                                            log.eventType === 'SQL_QUERY' ? 'bg-orange-900/20 text-orange-400 border-orange-900/50' :
                                            'bg-gray-800 text-gray-300 border-gray-700'
                                        }`}>
                                            {log.eventType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 font-mono text-xs">{log.ip}</td>
                                    <td className="px-4 py-2 text-xs font-mono text-gray-500 truncate max-w-xs">
                                        {JSON.stringify(log.details)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-2 text-right text-xs text-gray-600">
                Showing last {logs.length} records
            </div>
        </div>
    );
}
