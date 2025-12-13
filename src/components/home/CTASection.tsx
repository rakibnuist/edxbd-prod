'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const CTASection = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* ... (existing content) ... */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">

                    <GlassCard className="p-16 md:p-24 overflow-hidden relative bg-white/60 border-white/80 !shadow-2xl">
                        {/* Flight Path Pattern */}
                        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            <pattern id="flight-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-blue-900" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#flight-grid)" />
                        </svg>

                        <div className="relative z-10">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center justify-center p-2.5 bg-white/80 border border-white rounded-2xl mb-8 shadow-sm backdrop-blur-md"
                            >
                                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-amber-500/20">
                                    <Zap className="w-6 h-6 text-white text-glow" />
                                </div>
                                <div className="text-left pr-4">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1.5">Approaching Deadline</div>
                                    <div className="text-slate-900 font-black text-lg leading-none">2026 Intake</div>
                                </div>
                            </motion.div>

                            <h2 className="text-4xl md:text-6xl font-heading font-black text-slate-900 mb-6 leading-tight tracking-tighter drop-shadow-md">
                                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Boarding Pass</span> <br />
                                is Waiting.
                            </h2>

                            <p className="text-xl text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed font-medium">
                                Stop dreaming about studying abroad. Start packing. We handle the paperwork, you handle the farewell party.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                                <button
                                    onClick={() => window.dispatchEvent(new CustomEvent('openQuickForm'))}
                                    className="w-full sm:w-auto px-12 py-6 bg-blue-600 text-white font-black text-xl rounded-full hover:bg-blue-700 transition-all shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 border-4 border-white/20 hover:scale-105 active:scale-95"
                                >
                                    Start Free Application <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </GlassCard>

                </div>
            </div>
        </section>
    );
};

export default CTASection;
