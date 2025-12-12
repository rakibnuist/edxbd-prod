'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Smile,
    Smartphone,
    Cpu,
    GraduationCap,
    Euro,
    Snowflake,
    Trees,
    CheckCircle2
} from 'lucide-react';
import ConsultationButton from '@/components/ConsultationButton';

export default function FinlandClient() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={containerRef} className="bg-slate-50 min-h-screen font-sans selection:bg-cyan-200 selection:text-cyan-900">
            {/* Hero Section - Aurora Borealis Theme */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    {/* Aurora Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-10" />
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-400 via-cyan-500 to-transparent blur-3xl transform -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-500 via-blue-500 to-transparent blur-3xl transform translate-y-1/4" />

                    {/* Snowy Landscape Overlay (Optional subtle texture) */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/snow.png')]" />
                </div>

                <motion.div
                    style={{ y, opacity }}
                    className="relative z-20 container mx-auto px-6 text-center text-white"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 mb-8 shadow-lg shadow-cyan-500/20">
                            <Snowflake className="w-5 h-5 text-cyan-300 animate-spin-slow" />
                            <span className="font-medium text-cyan-100 tracking-wider uppercase text-sm">The Nordic Innovation Hub</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
                            Future is <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">Finland</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                            Study in the world&apos;s happiest country. Where nature meets technology, and education is free for EU citizens.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <ConsultationButton
                                text="Apply for 2026 Intake"
                                source="finland_hero_primary"
                                className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-1 w-full sm:w-auto"
                            />
                            <ConsultationButton
                                text="Free Assessment"
                                source="finland_hero_secondary"
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-full font-bold text-lg transition-all w-full sm:w-auto"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Glassmorphism Stats Bar */}
            <div className="relative z-30 -mt-24 px-4 container mx-auto">
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-4 gap-8 md:divide-x divide-slate-200">
                    {[
                        { icon: <Smile className="w-8 h-8 text-yellow-500" />, value: "#1", label: "Happiest Country", sub: "For 7 years running" },
                        { icon: <Euro className="w-8 h-8 text-green-500" />, value: "€8,000", label: "Starting Tuition", sub: "Free for EU/EEA" },
                        { icon: <BriefcaseIcon className="w-8 h-8 text-blue-500" />, value: "2 Years", label: "Post-Study Visa", sub: "Path to Residence" },
                        { icon: <Cpu className="w-8 h-8 text-purple-500" />, value: "500+", label: "English Programs", sub: "Tech, Business, Arts" },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-transform duration-300">
                            <div className="mb-4 p-4 bg-slate-50 rounded-2xl group-hover:bg-cyan-50 transition-colors shadow-sm">
                                {stat.icon}
                            </div>
                            <span className="text-4xl font-bold text-slate-800 mb-1">{stat.value}</span>
                            <span className="text-base font-bold text-slate-700">{stat.label}</span>
                            <span className="text-xs text-slate-500 mt-1">{stat.sub}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Finland: Tech x Nature */}
            <section className="py-24 px-6 container mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-60" />
                            {/* Placeholder for Helsinki Landscape or Tech Hub */}
                            <div
                                className="h-[400px] md:h-[600px] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')" }}
                            />
                            <div className="absolute bottom-8 left-8 z-20 text-white">
                                <div className="bg-cyan-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">LIFESTYLE</div>
                                <h3 className="text-3xl font-bold mb-2">Nature at Your Doorstep</h3>
                                <p className="text-slate-200 max-w-sm">From the Archipelago to Lapland, experience the cleanest air and purest nature in the world.</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2">
                        <span className="text-cyan-600 font-bold tracking-widest uppercase text-sm mb-2 block">Why Study in Finland?</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Innovation</span> Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Sustainability</span>
                        </h2>

                        <div className="space-y-8">
                            {[
                                { title: "Silicon Valley of Europe", desc: "Home to Nokia, Rovio (Angry Birds), and Supercell. A booming startup ecosystem hungry for international talent.", icon: <Smartphone className="w-6 h-6 text-blue-500" /> },
                                { title: "Work-Life Balance", desc: "Flat hierarchies, flexible hours, and a culture that respects your personal time. Enjoy 4-6 weeks of paid vacation.", icon: <Smile className="w-6 h-6 text-yellow-500" /> },
                                { title: "Safe & Stable", desc: "Consistently ranked as one of the safest, most stable, and least corrupt countries in the world.", icon: <Trees className="w-6 h-6 text-green-500" /> }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    <div className="shrink-0 mt-1 p-3 bg-white rounded-xl shadow-md border border-slate-100 h-fit">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Scholarship & Cost Section */}
            <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Affordable Excellence</h2>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            World-class education shouldn&apos;t break the bank. Finland offers generous scholarships and reasonable living costs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Scholarship Card */}
                        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-cyan-500/50 transition-colors duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-cyan-500/20 rounded-xl">
                                    <GraduationCap className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h3 className="text-2xl font-bold">Finland Scholarships</h3>
                            </div>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-1" />
                                    <span><strong>50% to 100% Tuition Waiver</strong> based on academic merit.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-1" />
                                    <span><strong>€5,000 Relocation Grant</strong> for top-tier master&apos;s applicants.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-1" />
                                    <span>Automatically considered during application process.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Living Cost Card */}
                        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-green-500/50 transition-colors duration-300">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-green-500/20 rounded-xl">
                                    <Euro className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold">Living Expenses</h3>
                            </div>
                            <div className="mb-6">
                                <div className="text-4xl font-bold text-white mb-2">€700 - €900<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                                <p className="text-slate-400 text-sm">Including accommodation, food, and transport.</p>
                            </div>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                                    <span><strong>Student Discounts</strong> on trains, buses, and meals (-50%).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                                    <span><strong>Part-time Work</strong> allowed (30h/week) to support yourself.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <ConsultationButton
                            text="Calculate My Budget"
                            source="finland_budget_calculator"
                            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold border border-white/20 backdrop-blur-sm transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* Universities Carousel */}
            <section className="py-20 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-6 mb-12 text-center">
                    <h2 className="text-3xl font-bold text-slate-900">Top Research Universities</h2>
                    <p className="text-slate-500 mt-2">Ranked among the top 1% globally</p>
                </div>
                <div className="flex animate-marquee space-x-8 w-max">
                    {[
                        "University of Helsinki", "Aalto University", "Tampere University",
                        "University of Oulu", "University of Turku", "LUT University",
                        "University of Vaasa", "University of Eastern Finland",
                        "University of Helsinki", "Aalto University", "Tampere University"
                    ].map((uni, idx) => (
                        <div key={idx} className="bg-white px-8 py-6 rounded-2xl shadow-sm border border-slate-100 text-slate-700 font-bold whitespace-nowrap hover:shadow-md transition-shadow">
                            {uni}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 overflow-hidden flex items-center justify-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 bg-slate-900 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-cyan-900/90 z-10" />
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512413914633-b5043f4041ea?q=80&w=2031&auto=format&fit=crop')" }}
                    />
                </div>

                <div className="container mx-auto px-6 relative z-20 text-center">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                        Ready for a <span className="text-cyan-400">Nordic Adventure?</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                        The application period for 2025 is opening soon. Don&apos;t miss your chance to study in the happiest country on Earth.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <ConsultationButton
                            text="Start Your Application"
                            source="finland_footer_cta_primary"
                            className="px-12 py-5 bg-white text-blue-900 rounded-full font-bold text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:scale-105 transition-all w-full sm:w-auto"
                        />
                        <ConsultationButton
                            text="Download Guide"
                            source="finland_footer_cta_secondary"
                            className="px-12 py-5 bg-transparent border-2 border-cyan-400/50 text-cyan-100 rounded-full font-bold text-xl hover:bg-cyan-950/30 hover:border-cyan-400 transition-all w-full sm:w-auto"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

// Icon component helper
function BriefcaseIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}
