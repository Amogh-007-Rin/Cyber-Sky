import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Activity, Cpu, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 p-1">
                                <img src="/cyber-sky-logo.png" alt="Cyber Sky Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                Cyber Sky
                            </span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                <a href="#features" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Features</a>
                                <button onClick={() => navigate('/about')} className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">About</button>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center gap-2"
                                >
                                    <Lock size={16} />
                                    Cyber Security Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                {/* Background Grid Animation */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-sm font-semibold mb-6">
                            Next-Gen Cybersecurity Platform
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                            Defend Your Infrastructure <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                With AI Precision
                            </span>
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
                            Cyber Sky integrates advanced AI threat detection, real-time DLP, and automated incident response to secure your organization against evolving digital threats.
                        </p>
                        
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-lg transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] flex items-center gap-2"
                            >
                                Enter Command Center <ChevronRight size={20} />
                            </button>
                            <button className="px-8 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg font-bold text-lg transition-all">
                                View Documentation
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-24 bg-gray-900/30 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Protection</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Our platform combines multiple layers of security to provide comprehensive coverage for your critical assets.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<Cpu className="text-blue-400" size={40} />}
                            title="AI Threat Detection"
                            description="Leverages Gemini AI to analyze patterns and detect anomalies in real-time, identifying threats before they escalate."
                        />
                        <FeatureCard 
                            icon={<Activity className="text-green-400" size={40} />}
                            title="Live Incident Response"
                            description="Monitor brute force, SQL injection, and DDoS attacks as they happen with our interactive threat timeline."
                        />
                        <FeatureCard 
                            icon={<Lock className="text-purple-400" size={40} />}
                            title="DLP & Output Filtering"
                            description="Advanced Data Loss Prevention ensures sensitive information never leaves your secure environment."
                        />
                    </div>
                </div>
            </div>

            {/* Stats / Trust Section */}
            <div className="py-20 border-y border-gray-800 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <Stat number="99.9%" label="Uptime Monitor" />
                        <Stat number="<10ms" label="Latency Analysis" />
                        <Stat number="24/7" label="AI Surveillance" />
                        <Stat number="Zero" label="False Positives" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black py-12 border-t border-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <ShieldCheck size={24} className="text-blue-600" />
                        <span className="text-xl font-bold text-gray-200">Cyber Sky</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        &copy; 2026 Cyber Sky Security. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
        >
            <div className="mb-6 p-4 bg-gray-800 rounded-xl inline-block">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}

function Stat({ number, label }: { number: string, label: string }) {
    return (
        <div>
            <div className="text-4xl font-bold text-white mb-2">{number}</div>
            <div className="text-blue-500 font-medium uppercase text-sm tracking-wider">{label}</div>
        </div>
    );
}
