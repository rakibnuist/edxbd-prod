'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    CheckCircle2,
    Euro,
    GraduationCap,
    Plane,
    FileCheck,
    Globe
} from 'lucide-react';
import ConsultationButton from '@/components/ConsultationButton';

export default function HungaryClient() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={containerRef} className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-slate-900/60 to-green-900/40 z-10" />
                    {/* Placeholder for a real video or high-quality image of Budapest Parliament */}
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110 motion-safe:animate-slow-zoom"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565426873118-a1dfa295552b?q=80&w=2070&auto=format&fit=crop')" }}
                    />
                </div>

                <motion.div
                    style={{ y, opacity }}
                    className="relative z-20 container mx-auto px-6 text-center text-white"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center space-x-2 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 mb-8 hover:bg-black/50 transition-colors shadow-lg">
                            <span className="text-2xl">🇭🇺</span>
                            <span className="font-medium text-amber-300 tracking-wide uppercase text-sm">Heart of Europe</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 font-serif tracking-tight drop-shadow-2xl">
                            Study in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-green-400">Hungary</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-100 mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-lg">
                            World-class education in the heart of Europe. Experience EU degree recognition, affordable living, and rich history.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <ConsultationButton
                                text="Apply for Fall 2025"
                                source="hungary_hero_primary"
                                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-red-600/30 transition-all transform hover:-translate-y-1 w-full sm:w-auto"
                            />
                            <ConsultationButton
                                text="Scholarship Check"
                                source="hungary_hero_secondary"
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md rounded-full font-bold text-lg transition-all w-full sm:w-auto"
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                        <div className="w-1 h-3 bg-white rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Intakes Banner */}
            <div className="bg-red-900 border-t border-red-800 text-white py-4 overflow-hidden relative z-30">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-center space-x-8 animate-marquee whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-amber-400" />
                            <span className="font-bold tracking-wide">INTAKE 2026: FALL AND SPRING</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-amber-400" />
                            <span className="font-bold tracking-wide">STIPENDIUM HUNGARICUM OPEN</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-amber-400" />
                            <span className="font-bold tracking-wide">APPLY NOW FOR BEST SCHOLARSHIPS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="bg-white relative z-30 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-4 gap-8 md:divide-x divide-slate-100 mt-8">
                {[
                    { icon: <Euro className="w-8 h-8 text-green-500" />, value: "€3,000+", label: "Annual Tuition" },
                    { icon: <Globe className="w-8 h-8 text-blue-500" />, value: "27", label: "Schengen Countries" },
                    { icon: <FileCheck className="w-8 h-8 text-amber-500" />, value: "95%", label: "Visa Success" },
                    { icon: <GraduationCap className="w-8 h-8 text-red-500" />, value: "Top 500", label: "Global Rankings" },
                ].map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center group">
                        <div className="mb-3 p-3 bg-slate-50 rounded-full group-hover:bg-slate-100 transition-colors">
                            {stat.icon}
                        </div>
                        <span className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</span>
                        <span className="text-sm text-slate-500 uppercase tracking-wider font-medium">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Why Hungary Section */}
            <section className="py-24 px-6 container mx-auto">
                <div className="text-center mb-16">
                    <span className="text-red-500 font-bold tracking-widest uppercase text-sm">Why Choose Hungary?</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-6 font-serif">Academic Excellence Meets Heritage</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Hungary combines centuries of academic tradition with modern innovation, offering high-quality education at a fraction of Western European costs.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "EU Degree & Schengen Visa",
                            description: "Gain a globally recognized European degree and travel freely across 27 Schengen countries during your studies.",
                            icon: "🇪🇺",
                            color: "bg-blue-50 border-blue-100"
                        },
                        {
                            title: "Stipendium Hungaricum",
                            description: "Fully funded government scholarships covering tuition, accommodation, health insurance, and monthly stipend.",
                            icon: "🎓",
                            color: "bg-green-50 border-green-100"
                        },
                        {
                            title: "Affordable Excellence",
                            description: "Tuition fees from €3,000/year and living costs around €500/month make it one of Europe's best value destinations.",
                            icon: "💰",
                            color: "bg-amber-50 border-amber-100"
                        }
                    ].map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-8 rounded-2xl border ${card.color} hover:shadow-lg transition-all hover:-translate-y-1`}
                        >
                            <div className="text-4xl mb-6">{card.icon}</div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-serif">{card.title}</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {card.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Scholarship Highlight */}
            <section className="bg-slate-900 py-24 relative overflow-hidden text-white">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-900/20 to-transparent"></div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="inline-block bg-amber-500/20 text-amber-400 px-4 py-1 rounded-full text-sm font-bold mb-6">Most Popular</div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 font-serif">Stipendium Hungaricum Scholarship</h2>
                        <div className="space-y-6 text-lg text-slate-300">
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-1" />
                                <p><strong className="text-white block">Full Tuition Coverage</strong> No tuition fees for the entire duration of studies.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-1" />
                                <p><strong className="text-white block">Monthly Stipend</strong> Contribution to living expenses for degree students.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-1" />
                                <p><strong className="text-white block">Accommodation & Health</strong> Dormitory placement or housing allowance + insurance.</p>
                            </div>
                        </div>
                        <div className="mt-10">
                            <ConsultationButton
                                text="Check Eligibility Now"
                                source="hungary_scholarship_section"
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-900/50 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-red-500 rounded-3xl blur-2xl opacity-20 transform rotate-6"></div>
                        <div className="relative bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🏆</div>
                                <h3 className="text-2xl font-bold mb-2">5,000+ Students</h3>
                                <p className="text-slate-400 mb-8">Awarded annually from 90 countries</p>
                                <div className="bg-slate-700/50 rounded-xl p-4 text-sm text-slate-300">
                                    &quot;This scholarship changed my life. I studied Engineering in Budapest with zero debt.&quot;
                                    <div className="mt-2 text-amber-400 font-bold">- Alumni Review</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Programs */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16 font-serif text-slate-900">Popular Fields of Study</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Medicine", icon: "🩺", color: "bg-red-50 text-red-600" },
                            { name: "Engineering", icon: "⚙️", color: "bg-blue-50 text-blue-600" },
                            { name: "Business", icon: "💼", color: "bg-amber-50 text-amber-600" },
                            { name: "Computer Science", icon: "💻", color: "bg-purple-50 text-purple-600" },
                            { name: "Psychology", icon: "🧠", color: "bg-pink-50 text-pink-600" },
                            { name: "Architecture", icon: "🏛️", color: "bg-stone-50 text-stone-600" },
                            { name: "Dentistry", icon: "🦷", color: "bg-cyan-50 text-cyan-600" },
                            { name: "International Rel.", icon: "🌐", color: "bg-green-50 text-green-600" },
                        ].map((program, idx) => (
                            <div key={idx} className={`${program.color} rounded-2xl p-6 text-center hover:scale-105 transition-transform cursor-pointer border border-transparent hover:border-current/20`}>
                                <div className="text-4xl mb-3">{program.icon}</div>
                                <h3 className="font-bold text-lg">{program.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Universities Carousel */}
            <section className="py-20 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-6 mb-12 text-center">
                    <h2 className="text-3xl font-bold font-serif text-slate-900">Top Partner Universities</h2>
                </div>
                <div className="flex animate-marquee space-x-8 w-max">
                    {[
                        "Semmelweis University", "Eötvös Loránd University", "University of Debrecen",
                        "University of Szeged", "University of Pécs", "Corvinus University",
                        "Budapest Univ. of Tech.", "Széchenyi István University",
                        "Semmelweis University", "Eötvös Loránd University", "University of Debrecen"
                    ].map((uni, idx) => (
                        <div key={idx} className="bg-white px-8 py-6 rounded-xl shadow-sm border border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                            {uni}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-red-700 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-red-700 via-red-600 to-red-800"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="inline-block p-4 rounded-full bg-white/10 mb-8 border border-white/20 backdrop-blur-sm">
                        <Plane className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-serif">
                        Begin Your European Journey
                    </h2>

                    <p className="text-xl text-red-100 mb-12 max-w-2xl mx-auto leading-relaxed">
                        From application to visa, we guide you every step of the way. Secure your future in the heart of Europe.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <ConsultationButton
                            text="Start Free Assessment"
                            source="hungary_footer_cta_primary"
                            className="px-10 py-5 bg-white text-red-700 rounded-xl font-bold text-xl shadow-2xl hover:bg-slate-50 hover:scale-105 transition-all w-full sm:w-auto"
                        />
                        <ConsultationButton
                            text="Talk to a Counselor"
                            source="hungary_footer_cta_secondary"
                            className="px-10 py-5 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold text-xl hover:bg-white/10 hover:border-white transition-all w-full sm:w-auto"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
