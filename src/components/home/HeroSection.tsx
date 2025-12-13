'use client';

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Globe, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// --- 3D PRISM HERO CARD ---
const HeroCard = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    return (
        <div style={{ perspective: 2000 }} className="hidden lg:flex justify-center items-center">
            <motion.div
                style={{ rotateX, rotateY, z: 100 }}
                drag
                dragElastic={0.10}
                dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                whileHover={{ cursor: "grab" }}
                whileTap={{ cursor: "grabbing" }}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const width = rect.width;
                    const height = rect.height;
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;
                    const xPct = mouseX / width - 0.5;
                    const yPct = mouseY / height - 0.5;
                    x.set(xPct * 400);
                    y.set(yPct * 400);
                }}
                onMouseLeave={() => {
                    x.set(0);
                    y.set(0);
                }}
                className="relative w-full max-w-md aspect-[3/4] rounded-[2.5rem] bg-white/10 backdrop-blur-3xl border-2 border-white/30 shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] p-8 flex flex-col overflow-hidden group transition-all duration-300 ease-out"
            >
                {/* Holographic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 via-purple-400/10 to-amber-400/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                {/* Prismatic Edge Shine */}
                <div className="absolute -inset-[2px] rounded-[2.5rem] bg-gradient-to-br from-white/80 via-transparent to-white/20 opacity-100 pointer-events-none z-50 mix-blend-overlay"></div>

                {/* Inner Glass Thickness */}
                <div className="absolute inset-[1px] rounded-[2.5rem] bg-white/20 backdrop-blur-md z-0"></div>

                {/* Content */}
                <div className="relative z-20 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 pointer-events-none">
                        <div className="w-16 h-16 rounded-2xl bg-white/40 flex items-center justify-center border border-white/50 shadow-inner backdrop-blur-md">
                            <Globe className="w-8 h-8 text-blue-600 drop-shadow-sm" />
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-blue-800 uppercase tracking-widest font-black mb-1">Your Future</div>
                            <div className="text-3xl font-black text-slate-800 font-heading tracking-tight drop-shadow-sm">Secured</div>
                        </div>
                    </div>

                    {/* Middle: Checklist */}
                    <div className="space-y-4 flex-grow pointer-events-none">
                        {[
                            { label: "Profile Evaluation", checked: true },
                            { label: "Check Eligibility", checked: true },
                            { label: "Scholarship Search", checked: true },
                            { label: "Visa Approval", checked: false, highlight: true }
                        ].map((item, i) => (
                            <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 backdrop-blur-md ${item.highlight ? 'bg-blue-500/10 border-blue-400/30' : 'bg-white/30 border-white/40'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 backdrop-blur-sm ${item.checked ? 'bg-green-500 text-white scale-110' : (item.highlight ? 'bg-blue-600 shadow-blue-500/50 animate-pulse text-white' : 'border-2 border-white/50 text-transparent')}`}>
                                    {(item.checked || item.highlight) && <CheckCircle className="w-5 h-5" />}
                                </div>
                                <span className={`font-bold text-lg drop-shadow-sm ${item.highlight ? 'text-blue-900' : 'text-slate-700'}`}>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Bottom: Action */}
                    <div className="mt-auto pt-6">
                        <button
                            onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('openQuickForm')); }}
                            className="w-full py-4 bg-slate-900/90 hover:bg-blue-700/90 backdrop-blur-md text-white font-black rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 border border-white/20 flex items-center justify-center gap-2 group/btn"
                        >
                            <Sparkles className="w-4 h-4 text-amber-300 group-hover/btn:animate-spin" />
                            <span>Verify Now</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const HeroSection = () => {
    const [tickerIndex, setTickerIndex] = useState(0);

    // REALISTIC Ticker Data
    const tickerItems = [
        "🎉 Visa Granted: China (X1 Student Visa)",
        "🎉 Scholarship Won: Stipendium Hungaricum (Hungary)",
        "🎉 Visa Granted: UK (University of Portsmouth)",
        "🎉 Admission Offer: GKS Scholarship (South Korea)"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setTickerIndex((prev) => (prev + 1) % tickerItems.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [tickerItems.length]);

    return (
        <>
            {/* --- BACKGROUND AURORA (FIXED) --- */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                {/* Noise Overlay */}
                <div className="absolute inset-0 opacity-[0.4] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-[1]"></div>

                {/* Aurora Blobs - CSS Animation Optimized */}
                <div className="absolute -top-[20%] -left-[20%] w-[80vw] h-[80vw] rounded-full bg-blue-300/30 blur-[120px] mix-blend-multiply animate-aurora-1" />
                <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-rose-300/30 blur-[120px] mix-blend-multiply animate-aurora-2" />
                <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-amber-200/30 blur-[100px] mix-blend-multiply animate-aurora-3" />
            </div>

            {/* --- HERO SECTION: CRYSTAL CLEAR --- */}
            <section className="relative min-h-[100vh] flex items-center pt-32 pb-20 relative z-10 overflow-hidden">

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* LEFT: Text Content */}
                    <div className="max-w-2xl relative">
                        {/* Glass Ticker */}
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-2xl border border-white/60 shadow-lg shadow-blue-500/5 mb-10 overflow-hidden hover:scale-105 transition-all cursor-default relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-lg shadow-green-500/50"></span>
                            </span>
                            <AnimatePresence mode='wait'>
                                <motion.span
                                    key={tickerIndex}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-sm font-bold tracking-wide text-green-800 whitespace-nowrap drop-shadow-sm"
                                >
                                    {tickerItems[tickerIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </div>

                        <h1 className="text-5xl lg:text-8xl font-black font-heading leading-[1.05] mb-8 tracking-tighter text-slate-900 drop-shadow-lg">
                            <span className="block mb-2">Crafting</span>
                            <span className="relative inline-block">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 pb-2">Global</span>
                                {/* Text Glint Effect */}
                                <div className="absolute -inset-1 bg-blue-400/20 blur-xl -z-10 rounded-full"></div>
                            </span>
                            <span className="block mt-2">Success.</span>
                        </h1>

                        <p className="text-xl text-slate-700 mb-12 leading-relaxed font-semibold max-w-lg drop-shadow-sm">
                            Unlock prestigious, fully funded opportunities in <span className="bg-white/50 px-2 py-1 rounded-lg border border-white/40 text-blue-700 shadow-sm">China</span>, <span className="bg-white/50 px-2 py-1 rounded-lg border border-white/40 text-blue-700 shadow-sm">Europe</span> & <span className="bg-white/50 px-2 py-1 rounded-lg border border-white/40 text-blue-700 shadow-sm">UK</span> with our precision-matched consultancy.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <motion.button
                                suppressHydrationWarning
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.dispatchEvent(new CustomEvent('openQuickForm'))}
                                className="px-10 py-5 bg-slate-900 text-white font-black text-lg rounded-full shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] transition-all flex items-center justify-center gap-3 group relative overflow-hidden ring-4 ring-white/30 backdrop-blur-sm"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                <span className="relative z-10">Start Your Journey</span>
                                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <Link href="/destinations/china" className="px-10 py-5 bg-white/50 backdrop-blur-lg border border-white/60 text-slate-800 font-bold text-lg rounded-full hover:bg-white/80 transition-all flex items-center justify-center shadow-lg shadow-slate-200/50 hover:shadow-xl">
                                Explore Destinations
                            </Link>
                        </div>

                        {/* Stats Strip - Glass Style */}
                        <div className="mt-20 pt-10 border-t border-slate-900/10 w-full flex gap-12">
                            <div className="group cursor-default">
                                <div className="text-5xl font-black font-heading text-slate-900 mb-1 drop-shadow-sm group-hover:text-blue-600 transition-colors">100%</div>
                                <div className="text-xs text-slate-600 uppercase tracking-widest font-bold">Visa Success Rate</div>
                            </div>
                            <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-400/50 to-transparent"></div>
                            <div className="group cursor-default">
                                <div className="text-5xl font-black font-heading text-slate-900 mb-1 drop-shadow-sm group-hover:text-amber-500 transition-colors">$5M+</div>
                                <div className="text-xs text-slate-600 uppercase tracking-widest font-bold">Scholarships Secured</div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT: Interactive 3D Card */}
                    <HeroCard />

                </div>
            </section>
        </>
    );
};

export default HeroSection;
