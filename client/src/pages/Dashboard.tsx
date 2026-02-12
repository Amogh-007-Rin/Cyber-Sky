import React, { useState, useEffect } from 'react';
import { ThreatMap } from '../components/ThreatMap';
import { AISandbox } from '../components/AISandbox';
import { ServerLogsViewer } from '../components/ServerLogsViewer';
import { IncidentTimeline } from '../components/IncidentTimeline';
import { ServerSafe } from '../components/ServerSafe';
import { LayoutDashboard, ShieldCheck, Home, Info, LogOut } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export function Dashboard() {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);
    const [logRefreshTrigger, setLogRefreshTrigger] = useState(0);

    const fetchIncidents = async () => {
        try {
            const res = await api.get('/logs/incidents');
            setIncidents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSimulationComplete = () => {
        // Trigger a refresh of the logs viewer
        setLogRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        fetchIncidents();
        // Poll every 5 seconds
        const interval = setInterval(fetchIncidents, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        // Clear any auth tokens if stored
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 p-6 font-sans">
            {/* Header / Navbar */}
            <header className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 p-1">
                        <img src="/cyber-sky-logo.png" alt="Cyber Sky Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Cyber Sky</h1>
                        <p className="text-sm text-gray-400">Advanced AI Defense & Orchestration</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-6 bg-gray-900/50 px-6 py-2 rounded-full border border-gray-800">
                    <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        <Home size={16} /> Home
                    </Link>
                    <Link to="/about" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        <Info size={16} /> About
                    </Link>
                    <a href="#server-safe" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        <ShieldCheck size={16} /> Server Safe
                    </a>
                    <div className="w-px h-4 bg-gray-700"></div>
                    <span className="text-sm font-medium text-blue-400 cursor-default">Dashboard</span>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 text-green-400 rounded-full border border-green-900/50 text-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        System Operational
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-gray-800"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-6">
                
                {/* Top Row: Threat Map (8) & Timeline (4) */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <LayoutDashboard size={20} className="text-blue-400"/>
                            Network Topology & Threat Map
                        </h2>
                        <ThreatMap activeIncidents={incidents} />
                    </div>
                    
                    {/* Bottom Row: AI Sandbox */}
                    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-green-400"/>
                            SentinelGuard Sandbox
                        </h2>
                        <AISandbox />
                    </div>

                    {/* Server Logs Viewer */}
                    <ServerLogsViewer refreshTrigger={logRefreshTrigger} />

                    {/* Server-Safe Section */}
                    <div id="server-safe" className="mt-6 scroll-mt-24">
                        <ServerSafe />
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 h-full">
                     <IncidentTimeline 
                        incidents={incidents} 
                        onRefresh={fetchIncidents} 
                        onSimulationComplete={handleSimulationComplete}
                     />
                </div>
            </div>
        </div>
    );
}
