'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Sun,
    Briefcase,
    GraduationCap,
    Euro,
    CheckCircle2,
    Hotel,
    Palmtree,
    Globe2
} from 'lucide-react';
import ConsultationButton from '@/components/ConsultationButton';

export default function CyprusClient() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={containerRef} className="bg-orange-50/30 min-h-screen font-sans selection:bg-orange-200 selection:text-orange-900">
            {/* Hero Section - Mediterranean Sunshine Theme */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590523741831-ab7f41e93c13?q=80&w=2069&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-900/40 via-blue-900/40 to-slate-900/60 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
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
                        <div className="inline-flex items-center space-x-2 bg-orange-500/20 backdrop-blur-md px-6 py-2 rounded-full border border-orange-200/20 mb-8 shadow-lg shadow-orange-500/10">
                            <Sun className="w-5 h-5 text-orange-300 animate-pulse" />
                            <span className="font-medium text-orange-100 tracking-wider uppercase text-sm">Earn While You Study</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight drop-shadow-xl">
                            Golden <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-200 to-amber-300 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]">Opportunity</span> In Cyprus
                        </h1>

                        <p className="text-xl md:text-2xl text-orange-50 mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
                            Start your career in 5-star luxury hotels. Earn up to €18,000 per year with guaranteed paid internships.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <ConsultationButton
                                text="Start Earning Now"
                                source="cyprus_hero_primary"
                                className="px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] transition-all transform hover:-translate-y-1 w-full sm:w-auto"
                            />
                            <ConsultationButton
                                text="Calculate Earnings"
                                source="cyprus_hero_secondary"
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-full font-bold text-lg transition-all w-full sm:w-auto"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Glassmorphism Stats Bar */}
            <div className="relative z-30 -mt-24 px-4 container mx-auto">
                <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-4 gap-8 md:divide-x divide-orange-100">
                    {[
                        { icon: <Euro className="w-8 h-8 text-orange-500" />, value: "€18k", label: "Yearly Earnings", sub: "Paid Internships" },
                        { icon: <CheckCircle2 className="w-8 h-8 text-green-500" />, value: "100%", label: "Visa Success", sub: "Guaranteed Approval" },
                        { icon: <GraduationCap className="w-8 h-8 text-blue-500" />, value: "Double", label: "Degree Awarded", sub: "Cyprus & UK" },
                        { icon: <Briefcase className="w-8 h-8 text-purple-500" />, value: "4+4", label: "Years Work Permit", sub: "Post-Study Route" },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-transform duration-300">
                            <div className="mb-4 p-4 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors shadow-sm">
                                {stat.icon}
                            </div>
                            <span className="text-4xl font-bold text-slate-800 mb-1">{stat.value}</span>
                            <span className="text-base font-bold text-slate-700">{stat.label}</span>
                            <span className="text-xs text-slate-500 mt-1">{stat.sub}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Cyprus: Career x Lifestyle */}
            <section className="py-24 px-6 container mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-40" />
                            <div
                                className="h-[400px] md:h-[600px] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1966&auto=format&fit=crop')" }}
                            />
                            <div className="absolute bottom-8 left-8 z-20 text-white">
                                <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3 shadow-lg">LIFESTYLE</div>
                                <h3 className="text-3xl font-bold mb-2 text-shadow-lg">Island Paradise</h3>
                                <p className="text-orange-50 max-w-sm drop-shadow-md">300+ days of sunshine a year. Study where others vacation.</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2">
                        <span className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-2 block">Why Study in Cyprus?</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                            A Gateway to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Global Careers</span>
                        </h2>

                        <div className="space-y-8">
                            {[
                                { title: "Five-Star Experience", desc: "Gain hands-on experience in world-class luxury hotels and resorts. Your classroom is the real world.", icon: <Hotel className="w-6 h-6 text-orange-500" /> },
                                { title: "Affordable Mediterranean Life", desc: "Enjoy a high quality of life with low living costs (approx. €300/month). Safe, welcoming, and vibrant.", icon: <Palmtree className="w-6 h-6 text-green-500" /> },
                                { title: "Gateway to Europe", desc: "Cyprus is your stepping stone to the EU. Gain a globally recognized degree and open doors worldwide.", icon: <Globe2 className="w-6 h-6 text-blue-500" /> }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="flex gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-100"
                                >
                                    <div className="shrink-0 mt-1 p-3 bg-white rounded-xl shadow-md border border-orange-50 h-fit">
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

            {/* Internship & Earnings Section */}
            <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Earn While You Learn</h2>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Our unique program structure allows you to offset your tuition fees and living expenses through guaranteed paid internships.
                        </p>
                    </div>

                    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-12 rounded-3xl border border-slate-700 shadow-2xl max-w-4xl mx-auto">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Euro className="w-64 h-64 text-white" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 relative z-10">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-orange-400 mb-2">Yearly Potential</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl md:text-6xl font-bold text-white">€18,000</span>
                                        <span className="text-slate-400">/ year</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex justify-between items-center text-slate-300 border-b border-slate-700 pb-2">
                                        <span>Monthly Internship Pay</span>
                                        <span className="font-bold text-white">€1,500 - €1,800</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-300 border-b border-slate-700 pb-2">
                                        <span>Living Cost</span>
                                        <span className="font-bold text-green-400">- €300</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-300 border-b border-slate-700 pb-2">
                                        <span>Tuition Saving</span>
                                        <span className="font-bold text-orange-400">Significant</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center space-y-4">
                                <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-blue-400" />
                                        Hospitality & Tourism
                                    </h4>
                                    <p className="text-sm text-slate-400">High demand in 5-star hotels over summer season (6 months).</p>
                                </div>
                                <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-purple-400" />
                                        Business & Culinary
                                    </h4>
                                    <p className="text-sm text-slate-400">Paid training positions in top international companies.</p>
                                </div>

                                <ConsultationButton
                                    text="Check Your Eligibility"
                                    source="cyprus_earnings_calculator"
                                    className="mt-4 py-4 w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Universities Carousel */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="container mx-auto px-6 mb-12 text-center">
                    <h2 className="text-3xl font-bold text-slate-900">Partner Institutions</h2>
                    <p className="text-slate-500 mt-2">Study at top-tier universities with UK accreditations</p>
                </div>
                <div className="flex animate-marquee space-x-8 w-max">
                    {[
                        "University of Cyprus", "European University Cyprus", "University of Nicosia",
                        "Frederick University", "Neapolis University", "Cyprus College",
                        "Intercollege", "Casa College", "University of Cyprus", "European University Cyprus"
                    ].map((uni, idx) => (
                        <div key={idx} className="bg-slate-50 px-8 py-6 rounded-2xl shadow-sm border border-slate-100 text-slate-700 font-bold whitespace-nowrap hover:shadow-md hover:border-orange-200 transition-all">
                            {uni}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-slate-900 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 to-red-900/80 z-10" />
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549144499-24756b107c80?q=80&w=2070&auto=format&fit=crop')" }}
                    />
                </div>

                <div className="container mx-auto px-6 relative z-20 text-center">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight drop-shadow-lg">
                        Your Future <span className="text-orange-400">Starts Here</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-orange-50 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Secure your future with a European degree and financial independence. The next intake is filling up fast.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <ConsultationButton
                            text="Apply for Next Intake"
                            source="cyprus_footer_cta_primary"
                            className="px-12 py-5 bg-white text-orange-600 rounded-full font-bold text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:scale-105 transition-all w-full sm:w-auto"
                        />
                        <ConsultationButton
                            text="Get Free Guidance"
                            source="cyprus_footer_cta_secondary"
                            className="px-12 py-5 bg-transparent border-2 border-orange-400/50 text-orange-100 rounded-full font-bold text-xl hover:bg-orange-950/30 hover:border-orange-400 transition-all w-full sm:w-auto"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
