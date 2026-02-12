import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [orgId, setOrgId] = useState('cyberadmin123@gmail.com');
    const [password, setPassword] = useState('cyberadmin123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            if (orgId === 'cyberadmin123@gmail.com' && password === 'cyberadmin123') {
                navigate('/dashboard');
            } else {
                setError('Invalid Organization ID or Password');
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gray-700">
                        <ShieldCheck className="text-blue-500" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                    <p className="text-gray-400 text-sm mt-2">Secure Access for Organization Admins</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Organization ID</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={orgId}
                                onChange={(e) => setOrgId(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Enter Org ID"
                            />
                            <ShieldCheck className="absolute left-3 top-3.5 text-gray-600" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Password</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-3 top-3.5 text-gray-600" size={16} />
                        </div>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-900/20 border border-red-900/50 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2"
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : (
                            <>
                                Access Dashboard <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Restricted Access. All activities are monitored and logged.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
