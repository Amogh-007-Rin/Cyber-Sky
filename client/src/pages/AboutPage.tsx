import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Users, Code, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div 
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 p-1">
                                <img src="/cyber-sky-logo.png" alt="Cyber Sky Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                Cyber Sky
                            </span>
                        </div>
                        <button 
                            onClick={() => navigate('/')}
                            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft size={20} />
                            Back to Home
                        </button>
                    </div>
                </div>
            </nav>

            <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Securing the <span className="text-blue-500">Future</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            We are building the next generation of autonomous cyber defense systems, powered by advanced AI to predict, detect, and neutralize threats in real-time.
                        </p>
                    </motion.div>

                    {/* Mission Section */}
                    <motion.div variants={itemVariants} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-12">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-900/30 rounded-lg text-blue-400">
                                <Target size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    In an era where digital threats are evolving faster than human defenders can react, our mission is to level the playing field. Cyber Sky was born from the idea that security should be proactive, not reactive. By leveraging Large Language Models (LLMs) and behavioral analytics, we provide an intelligent shield that adapts to new attack vectors instantly.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Team/Story Section */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Code className="text-purple-400" size={24} />
                                <h3 className="text-xl font-bold">The Technology</h3>
                            </div>
                            <p className="text-gray-400">
                                Built on a modern stack utilizing React, Node.js, and Python, integrated with Gemini AI. Our engine processes thousands of signals per second to distinguish between legitimate traffic and malicious intent with near-zero latency.
                            </p>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="text-green-400" size={24} />
                                <h3 className="text-xl font-bold">For Builders</h3>
                            </div>
                            <p className="text-gray-400">
                                Designed for developers and security operations centers (SOCs) who need visibility without the noise. Cyber Sky provides actionable intelligence, automating the tedious parts of security so you can focus on what matters.
                            </p>
                        </div>
                    </motion.div>

                    {/* Footer Note */}
                    <motion.div variants={itemVariants} className="text-center border-t border-gray-800 pt-12">
                        <p className="text-gray-500 italic">
                            "Security is not a product, but a process."
                        </p>
                        <p className="text-gray-600 mt-2 text-sm">
                            - Bruce Schneier
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
