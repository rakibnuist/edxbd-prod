'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Handshake, Globe, Briefcase, Building2 } from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';

const PartnershipSection = () => {
    return (
        <section className="py-24 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <GlassCard className="p-0 border-white/60 bg-white/40">
                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-0">

                        {/* Left Content */}
                        <div className="p-12 md:p-20 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/60 shadow-sm mb-8 backdrop-blur-md">
                                    <Handshake className="w-4 h-4 text-amber-500" />
                                    <span className="text-slate-800 text-xs font-bold uppercase tracking-widest">B2B Partnership Program</span>
                                </div>

                                <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-slate-900 mb-8 leading-[1]">
                                    Scale Your Business <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Without Limits.</span>
                                </h2>

                                <p className="text-lg text-slate-700 mb-10 max-w-lg leading-relaxed font-medium">
                                    Join our global network of educational agents and institutions. Access exclusive university contracts, high commission rates, and 24/7 processing support.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <Link href="/partnership" className="px-10 py-5 bg-slate-900 text-white font-bold rounded-full hover:bg-blue-800 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 group/btn border border-white/20">
                                        Become a Partner <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Trust Indicators */}
                            <div className="mt-16 flex items-center gap-12 border-t border-slate-900/10 pt-8">
                                <div>
                                    <div className="text-3xl font-black text-slate-900">50+</div>
                                    <div className="text-xs text-slate-600 uppercase tracking-wider font-bold">Active Partners</div>
                                </div>
                                <div className="w-px h-12 bg-slate-300"></div>
                                <div>
                                    <div className="text-3xl font-black text-slate-900">24h</div>
                                    <div className="text-xs text-slate-600 uppercase tracking-wider font-bold">Response Time</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual: Network Graph */}
                        <div className="relative min-h-[400px] lg:min-h-auto bg-white/20 border-t lg:border-t-0 lg:border-l border-white/40 flex items-center justify-center overflow-hidden">
                            {/* Interactive Map Visual (Simulated) */}
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Noise Overlay */}
                                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                                {/* Central Node */}
                                <div className="absolute z-20 w-28 h-28 bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(37,99,235,0.2)] border border-white/60 group-hover:scale-110 transition-transform duration-700">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-inner">
                                        <Globe className="w-10 h-10 text-white" />
                                    </div>
                                </div>

                                {/* Orbiting Nodes */}
                                <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                                    <div className="absolute top-1/4 left-1/4 p-5 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl -rotate-[45deg]">
                                        <Briefcase className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="absolute bottom-1/4 right-1/4 p-5 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl -rotate-[45deg]">
                                        <Building2 className="w-6 h-6 text-emerald-600" />
                                    </div>
                                </div>

                                {/* Connecting Lines (SVG) */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                                    <circle cx="50%" cy="50%" r="120" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" className="text-blue-400 animate-[spin_30s_linear_infinite_reverse]" />
                                    <circle cx="50%" cy="50%" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" className="text-indigo-400 animate-[spin_40s_linear_infinite]" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </section>
    );
};

export default PartnershipSection;
