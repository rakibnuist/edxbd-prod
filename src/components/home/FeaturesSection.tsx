'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, GraduationCap, Globe, BadgeCheck, Users, HeartHandshake, TrendingUp } from 'lucide-react';
import React from 'react';

const FeaturesSection = () => {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
                    >
                        Why Choose <span className="text-blue-600 relative">
                            EduExpress
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5 L 100 0 L 0 0 Z" fill="currentColor" />
                            </svg>
                        </span>?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 leading-relaxed"
                    >
                        Not just an agency, but your strategic partner in building a global career.
                    </motion.p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                    {/* Feature 1: Success Rate (Big Block) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                <TrendingUp className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-bold mb-2">98%</h3>
                                <p className="text-blue-100 font-medium text-lg">Visa Success Rate</p>
                            </div>
                        </div>
                        <p className="mt-6 text-blue-50/90 text-lg leading-relaxed max-w-sm">
                            Our rigorous document vetting process ensures your application is flawless, drastically minimizing rejection risks.
                        </p>
                    </motion.div>

                    {/* Feature 2: Scholarship (Tall Block) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="md:row-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-[100px] -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />

                        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                            <GraduationCap className="w-7 h-7 text-amber-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">Scholarship <br /> Guidance</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            We don&apos;t just apply; we strategist. Our team helps clarify your SOPs and profiles to unlock hidden funding opportunities and grants that make education affordable.
                        </p>
                        <div className="mt-auto">
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-amber-400 rounded-full" />
                            </div>
                            <p className="text-xs text-amber-700 mt-2 font-bold uppercase tracking-wider">$5M+ Secured</p>
                        </div>
                    </motion.div>

                    {/* Feature 3: Direct Partners */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Globe className="w-7 h-7 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Direct Partners</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Official representatives for top universities in Europe & Asia. No middlemen.
                        </p>
                    </motion.div>

                    {/* Feature 4: No Hidden Fees */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <BadgeCheck className="w-7 h-7 text-rose-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Hidden Fees</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            100% transparent pricing structure. You pay what we promise.
                        </p>
                    </motion.div>

                    {/* Feature 5: Expert Team (Wide) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="md:col-span-3 bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-xl group"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex -space-x-4 shrink-0">
                                {/* Avatars for "Expert Team" visual */}
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className={`w-14 h-14 rounded-full border-4 border-slate-800 bg-slate-700 flex items-center justify-center text-xs font-bold relative z-${30 - i * 10}`}>
                                        <Users className="w-6 h-6 text-slate-400" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2 text-white">Expert Counselors</h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                                    Our team consists of former international students who have &quot;been there, done that&quot;. We guide you based on real-world experience, not just brochures.
                                </p>
                            </div>
                            <button aria-label="Contact our expert team" className="ml-auto bg-slate-800 p-3 rounded-full hover:bg-blue-600 transition-colors cursor-pointer text-white">
                                <HeartHandshake className="w-6 h-6" />
                            </button>
                        </div>
                    </motion.div>

                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;
