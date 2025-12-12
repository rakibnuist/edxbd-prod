'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Stethoscope,
    GraduationCap,
    Briefcase,
    Laptop,
    DollarSign,
    CheckCircle2,
    Building2,
    Globe2,
    BookOpen
} from 'lucide-react';
import ConsultationButton from '@/components/ConsultationButton';

export default function GeorgiaClient() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={containerRef} className="bg-slate-50 min-h-screen font-sans selection:bg-red-100 selection:text-red-900">
            {/* Hero Section - Medical Excellence Theme */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?q=80&w=2070&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 via-red-800/60 to-transparent" />
                </div>

                <motion.div
                    style={{ y, opacity }}
                    className="relative z-20 container mx-auto px-6 text-white"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center space-x-2 bg-red-600/90 backdrop-blur-md px-6 py-2 rounded-full border border-red-400/30 mb-8 shadow-lg">
                            <GraduationCap className="w-5 h-5 text-white animate-pulse" />
                            <span className="font-medium tracking-wider uppercase text-sm">Global Education Destination</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-tight">
                            Medical, Business <br />
                            <span className="text-red-200">& Tech Education</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-red-50 mb-12 max-w-2xl font-light leading-relaxed">
                            Pursue WHO-recognized Medical degrees or globally accredited Bachelor&apos;s & Master&apos;s in Business, IT, and Engineering. Starting from $3,000/year.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            <ConsultationButton
                                text="Start Your Application"
                                source="georgia_hero_primary"
                                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-lg shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] transition-all transform hover:-translate-y-1 w-full sm:w-auto"
                            />
                            <ConsultationButton
                                text="View All Programs"
                                source="georgia_hero_secondary"
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-full font-bold text-lg transition-all w-full sm:w-auto"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Glassmorphism Stats Bar */}
            <div className="relative z-30 -mt-24 px-4 container mx-auto">
                <div className="bg-white border-b-4 border-red-600 rounded-2xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-4 gap-8 md:divide-x divide-slate-100">
                    {[
                        { icon: <DollarSign className="w-8 h-8 text-green-600" />, value: "$3,000", label: "Starting Tuition", sub: "Very Affordable" },
                        { icon: <Globe2 className="w-8 h-8 text-blue-600" />, value: "Global", label: "Recognition", sub: "EU/US Accepted" },
                        { icon: <CheckCircle2 className="w-8 h-8 text-red-600" />, value: "100%", label: "English Medium", sub: "All Programs" },
                        { icon: <Building2 className="w-8 h-8 text-purple-600" />, value: "50+", label: "Programs", sub: "Med, Biz, Tech" },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-transform duration-300">
                            <div className="mb-4 p-4 bg-red-50 rounded-2xl group-hover:bg-red-100 transition-colors shadow-sm">
                                {stat.icon}
                            </div>
                            <span className="text-4xl font-bold text-slate-800 mb-1">{stat.value}</span>
                            <span className="text-base font-bold text-slate-700">{stat.label}</span>
                            <span className="text-xs text-slate-500 mt-1">{stat.sub}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Georgia Section */}
            <section className="py-24 px-6 container mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="w-full md:w-1/2">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent z-10" />
                            <div
                                className="h-[400px] md:h-[600px] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')" }}
                            />
                            <div className="absolute bottom-8 left-8 z-20 text-white">
                                <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3 shadow-lg">MODERN CAMPUS</div>
                                <h3 className="text-3xl font-bold mb-2">Academic Excellence</h3>
                                <p className="text-slate-100 max-w-sm drop-shadow-md">From modern medical labs to high-tech computer centers, experience world-class learning facilities.</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-sm mb-2 block">Why Choose Georgia?</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                            Your Gateway to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">European Education</span>
                        </h2>

                        <div className="space-y-8">
                            {[
                                { title: "Diverse Program Options", desc: "Choose from Medicine (MBBS), Business Administration (BBA/MBA), Computer Science, Law, and Engineering.", icon: <BookOpen className="w-6 h-6 text-blue-600" /> },
                                { title: "Affordable Excellence", desc: "Tuition fees are a fraction of the cost in Western Europe or the US, starting at $3,000 for Business & $4,500 for Medicine.", icon: <DollarSign className="w-6 h-6 text-green-600" /> },
                                { title: "Hassle-Free Admission", desc: "No difficult entrance exams. Admission based on academic background and interview. 98% Visa Success Rate.", icon: <CheckCircle2 className="w-6 h-6 text-red-600" /> }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="flex gap-4 p-4 rounded-xl hover:bg-red-50/50 transition-colors border border-transparent hover:border-red-100"
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

            {/* Program Cost Table Section */}
            <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
                {/* Abstract shapes */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Popular Programs</h2>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Choose from a wide range of Bachelor&apos;s and Master&apos;s degrees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { name: "General Medicine (MBBS)", duration: "6 Years", cost: "$4,500 - $7,000", icon: <Stethoscope className="w-10 h-10 text-red-400" />, popular: true },
                            { name: "Business (BBA/MBA)", duration: "4/2 Years", cost: "$3,000 - $5,000", icon: <Briefcase className="w-10 h-10 text-cyan-400" />, popular: false },
                            { name: "Computer Science", duration: "4 Years", cost: "$3,500 - $5,000", icon: <Laptop className="w-10 h-10 text-green-400" />, popular: false }
                        ].map((program, idx) => (
                            <div key={idx} className={`relative bg-slate-800/50 border ${program.popular ? 'border-red-500 shadow-red-900/20 shadow-xl scale-105 z-10' : 'border-slate-700'} p-8 rounded-3xl hover:bg-slate-800 transition-all duration-300`}>
                                {program.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">MOST POPULAR</div>
                                )}
                                <div className="flex flex-col items-center text-center">
                                    <div className="p-4 bg-slate-700/50 rounded-2xl mb-6">
                                        {program.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{program.name}</h3>
                                    <span className="text-slate-400 mb-6">{program.duration}</span>

                                    <div className="w-full h-px bg-slate-700 mb-6" />

                                    <p className="text-sm text-slate-400 mb-1">Annual Tuition Approx.</p>
                                    <p className="text-3xl font-bold text-white mb-8">{program.cost}</p>

                                    <ConsultationButton
                                        text="Get Details"
                                        source={`georgia_program_${idx}`}
                                        className={`w-full py-3 rounded-xl font-bold transition-all ${program.popular ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 bg-slate-800/80 rounded-2xl p-8 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
                        <div>
                            <h4 className="text-xl font-bold text-white mb-2">Living Expenses Estimate</h4>
                            <p className="text-slate-400">Accommodation, food, and transport in Tbilisi or Batumi</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-4xl font-bold text-green-400">$300 - $500</span>
                            <span className="text-sm text-slate-500">per month</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Universities Carousel */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="container mx-auto px-6 mb-12 text-center">
                    <h2 className="text-3xl font-bold text-slate-900">Top Accredited Universities</h2>
                    <p className="text-slate-500 mt-2">Partnered with the best institutions in Georgia</p>
                </div>
                <div className="flex animate-marquee space-x-8 w-max">
                    {[
                        "Tbilisi State Medical University", "Caucasus International University", "University of Georgia",
                        "European University", "Geomedi Medical University", "Batumi Shota Rustaveli State University",
                        "Tbilisi State Medical University", "Caucasus International University"
                    ].map((uni, idx) => (
                        <div key={idx} className="bg-red-50/50 px-8 py-6 rounded-2xl shadow-sm border border-red-100 text-slate-700 font-bold whitespace-nowrap hover:shadow-md hover:bg-red-50 transition-all">
                            {uni}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-red-900 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-slate-900 z-10" />
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop')" }}
                    />
                </div>

                <div className="container mx-auto px-6 relative z-20 text-center">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                        Ready to Become a <span className="text-red-300">Doctor?</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-red-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Secure your medical career with world-class education at an affordable price. Applications are open for the next intake.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <ConsultationButton
                            text="Free Eligibility Check"
                            source="georgia_footer_cta_primary"
                            className="px-12 py-5 bg-white text-red-900 rounded-full font-bold text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:scale-105 transition-all w-full sm:w-auto"
                        />
                        <ConsultationButton
                            text="Download Guide"
                            source="georgia_footer_cta_secondary"
                            className="px-12 py-5 bg-transparent border-2 border-red-300/50 text-red-100 rounded-full font-bold text-xl hover:bg-red-900/30 hover:border-red-300 transition-all w-full sm:w-auto"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
