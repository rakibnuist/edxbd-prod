'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Globe,
    Wallet,
    Award,
    BookOpen,
    MapPin,
    CheckCircle2,
    ArrowRight,
    School,
    Landmark,
    Languages,
    FileCheck,
    Cpu,
    MonitorSmartphone,
    Plane,
    Clock,
    Sparkles,
    Scroll,
    GraduationCap
} from 'lucide-react';
import ConsultationButton from '@/components/ConsultationButton';

// --- Data ---

const universities = [
    { name: 'Seoul National Univ.', logo: Landmark, color: 'bg-blue-50 text-blue-800' },
    { name: 'KAIST', logo: Cpu, color: 'bg-teal-50 text-teal-700' },
    { name: 'Yonsei University', logo: School, color: 'bg-indigo-50 text-indigo-800' },
    { name: 'Korea University', logo: BookOpen, color: 'bg-red-50 text-red-800' },
    { name: 'Hanyang University', logo: Building2, color: 'bg-orange-50 text-orange-700' },
    { name: 'POSTECH', logo: MonitorSmartphone, color: 'bg-slate-100 text-slate-800' }
];

const scholarships = [
    { name: 'Global Korea Scholarship (GKS/KGSP)', amount: 'Full Tuition + Monthly Stipend + Airfare', deadline: 'Feb / Sept', icon: Award },
    { name: 'University-Specific Support', amount: '30% - 100% Tuition Waiver', deadline: 'Varies', icon: School },
    { name: 'Professor Scholarships', amount: 'Research Funding & Stipend', deadline: 'Rolling', icon: Cpu },
    { name: 'External Foundations', amount: 'Partial Funding', deadline: 'Varies', icon: Wallet }
];

const degrees = [
    { title: 'Language Program', duration: '6 Months - 1 Year', desc: 'Intensive Korean language (Hangul) training.', icon: Languages, color: 'bg-pink-50 text-pink-600' },
    { title: 'Associate Degree', duration: '2-3 Years', desc: 'Vocational training in technology and skills.', icon: Scroll, color: 'bg-teal-50 text-teal-600' },
    { title: 'Bachelor Degree', duration: '4 Years', desc: 'Comprehensive undergraduate education.', icon: GraduationCap, color: 'bg-blue-50 text-blue-600' },
    { title: 'Masters Degree', duration: '2 Years', desc: 'Advanced specialization & research focus.', icon: Award, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'PhD / Doctoral', duration: '3-4 Years', desc: 'Deep research and academic contribution.', icon: Landmark, color: 'bg-slate-50 text-slate-700' },
    { title: 'Combined (MS+PhD)', duration: '5 Years', desc: 'Integrated track for research excellence.', icon: Sparkles, color: 'bg-purple-50 text-purple-600' }
];

const popularPrograms = [
    { name: 'Technology & IT', programs: ['Computer Science', 'AI & Robotics', 'Semiconductors', 'Data Science'], icon: Cpu },
    { name: 'Engineering', programs: ['Mechanical', 'Civil', 'Electrical', 'Biotech'], icon: MonitorSmartphone },
    { name: 'Business & Management', programs: ['Global MBA', 'Intl. Trade', 'Finance', 'Logistics'], icon: Wallet },
    { name: 'Arts & Media', programs: ['K-Content/Media', 'Design', 'Film Studies', 'Journalism'], icon: BookOpen }
];

const cities = [
    { name: 'Seoul', stats: '9.7M Pop • Capital', highlights: ['Tech Hub', 'K-Culture Center', 'Top Universities'], icon: Building2 },
    { name: 'Busan', stats: '3.4M Pop • Port City', highlights: ['Logistics Hub', 'Coastal Life', 'Film Festivals'], icon: Globe },
    { name: 'Daejeon', stats: '1.5M Pop • Science City', highlights: ['R&D Center', 'KAIST Location', 'Innovation'], icon: Cpu },
    { name: 'Incheon', stats: '2.9M Pop • Global Gateway', highlights: ['Intl. Airport', 'Smart City', 'Global Campus'], icon: Plane }
];

// --- Animations ---

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function SouthKoreaClient() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
                {/* Abstract Background - Taegeuk Colors */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-red-950 z-0"></div>
                <div className="absolute inset-0 opacity-10 z-0 bg-[url('https://www.transparenttextures.com/patterns/circuit.png')]"></div>

                {/* Animated Orbs */}
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-20 w-96 h-96 bg-red-600 rounded-full blur-[120px] opacity-20 z-0"
                />
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-20 z-0"
                />

                <div className="container mx-auto px-6 relative z-10 pt-32">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-center max-w-5xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 bg-black/60 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full mb-8 shadow-lg">
                            <span className="text-2xl">🇰🇷</span>
                            <span className="text-sm font-bold tracking-wide text-blue-100 uppercase">Fast-Track Education Pathways</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight">
                            Study in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400">South Korea</span>
                        </motion.h1>

                        <motion.div variants={fadeInUp} className="space-y-4 mb-10">
                            <h2 className="text-2xl md:text-4xl text-white font-bold">
                                Masters E-VISA & EAP Program
                            </h2>
                            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
                                <span className="text-blue-400 font-semibold">No IELTS Required.</span> Fast-track your career with our specialized Masters E-VISA pathway and English for Academic Purposes (EAP) program.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <ConsultationButton
                                text="Apply for Masters E-VISA"
                                source="korea_hero_evisa"
                                className="group relative px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all hover:scale-105 active:scale-95"
                            />
                            <ConsultationButton
                                text="Join EAP Program (No IELTS)"
                                source="korea_hero_eap"
                                className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-xl font-medium text-lg hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                            />
                        </motion.div>

                        {/* Hero Stats */}
                        <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-left">
                            {[
                                { label: 'Visa Priority', value: 'E-VISA', sub: 'Fast Track Processing' },
                                { label: 'IELTS Added', value: 'Not Required', sub: 'With EAP Program' },
                                { label: 'Intakes', value: 'Multiple', sub: 'Year-Round Entry' },
                                { label: 'Visa Success', value: '98%', sub: 'Expert Guidance' }
                            ].map((stat, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm font-medium text-blue-200">{stat.label}</div>
                                    <div className="text-xs text-slate-400 mt-1">{stat.sub}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Professional Status Bar (Static) */}
            {/* Intakes Banner / Ticker */}
            <div className="bg-slate-900 border-y border-slate-800 text-white py-4 overflow-hidden shadow-2xl relative z-20">
                <div className="container mx-auto px-6 flex items-center justify-center space-x-12 animate-marquee whitespace-nowrap">
                    {/* Group 1: Visa Status */}
                    <div className="flex items-center space-x-3">
                        <FileCheck className="w-5 h-5 text-blue-400" />
                        <span className="font-bold tracking-wide text-slate-300">VISA STATUS:</span>
                        <span className="font-bold text-white">MASTERS E-VISA</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span className="font-medium text-slate-300">PRIORITY PROCESSING</span>
                    </div>

                    <div className="w-2 h-2 rounded-full bg-white/10"></div>

                    {/* Group 2: Language Req */}
                    <div className="flex items-center space-x-3">
                        <Languages className="w-5 h-5 text-red-400" />
                        <span className="font-bold tracking-wide text-slate-300">LANGUAGE REQ:</span>
                        <span className="font-bold text-white">NO IELTS NEEDED</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span className="font-medium text-slate-300">WITH EAP PROGRAM</span>
                    </div>

                    <div className="w-2 h-2 rounded-full bg-white/10"></div>

                    {/* Group 3: Admissions */}
                    <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-green-400" />
                        <span className="font-bold tracking-wide text-slate-300">ADMISSIONS:</span>
                        <span className="font-bold text-white">MULTIPLE INTAKES</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span className="font-medium text-slate-300">OPEN NOW</span>
                    </div>
                </div>
            </div>

            {/* Special Pathways Focus Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Your Direct Pathways</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            We specialize in simplified entry routes for international students.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* E-VISA Card */}
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 lg:p-12 relative overflow-hidden group hover:shadow-xl transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FileCheck className="w-40 h-40 text-blue-600" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                    <FileCheck className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-4">Masters E-VISA</h3>
                                <div className="flex items-center space-x-2 text-blue-600 font-semibold mb-6">
                                    <span className="bg-blue-100 px-3 py-1 rounded-full text-sm">Fast Track</span>
                                    <span className="bg-blue-100 px-3 py-1 rounded-full text-sm">Priority</span>
                                </div>
                                <p className="text-slate-600 mb-8 leading-relaxed">
                                    The E-VISA program is designed for students pursuing their Masters in South Korea. It offers a streamlined application process with higher approval rates and priority processing.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                        <span className="text-slate-700 font-medium">Simplified documentation requirements</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                        <span className="text-slate-700 font-medium">Faster decision times from immigration</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                        <span className="text-slate-700 font-medium">High visa issuance success rate</span>
                                    </li>
                                </ul>
                                <ConsultationButton
                                    text="Check E-VISA Eligibility"
                                    source="korea_pathway_evisa"
                                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-center hover:bg-blue-700 transition-colors"
                                />
                            </div>
                        </div>

                        {/* EAP Program Card */}
                        <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-8 lg:p-12 relative overflow-hidden group hover:shadow-xl transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Languages className="w-40 h-40 text-red-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                                    <Languages className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">EAP Program</h3>
                                <div className="flex items-center space-x-2 text-red-400 font-semibold mb-6">
                                    <span className="bg-red-500/20 px-3 py-1 rounded-full text-sm">No IELTS</span>
                                    <span className="bg-red-500/20 px-3 py-1 rounded-full text-sm">EAP Track</span>
                                </div>
                                <p className="text-slate-300 mb-8 leading-relaxed">
                                    Don&apos;t let language scores hold you back. Our English for Academic Purposes (EAP) program allows you to start your journey immediately without an IELTS score.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-red-500 mr-3 shrink-0" />
                                        <span className="text-slate-200 font-medium">No IELTS or TOPIK initially required</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-red-500 mr-3 shrink-0" />
                                        <span className="text-slate-200 font-medium">Learn Korean/English on campus</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-red-500 mr-3 shrink-0" />
                                        <span className="text-slate-200 font-medium">Direct progression to Degree programs</span>
                                    </li>
                                </ul>
                                <ConsultationButton
                                    text="Apply for EAP Track"
                                    source="korea_pathway_eap"
                                    className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-center hover:bg-red-700 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Korea - Quick Hits */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why South Korea?</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-blue-600 mx-auto rounded-full mb-6"></div>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            A global leader in technology, culture, and high-quality education at an affordable cost.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Masters E-VISA', desc: 'Specialized visa pathway for Masters students with simplified requirements.', icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { title: 'No IELTS Needed', desc: 'Join our EAP (English for Academic Purposes) program to start without IELTS.', icon: Languages, color: 'text-red-600', bg: 'bg-red-50' },
                            { title: 'Affordable Living', desc: 'High quality of life with reasonable monthly costs.', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { title: 'Cultural Hub', desc: 'Immerse in K-Pop, K-Drama, and a vibrant modern lifestyle.', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100"
                            >
                                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Available Degrees */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Available Degrees</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Pathways for every educational background.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {degrees.map((degree, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -4 }}
                                className="group relative overflow-hidden bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-start space-x-4">
                                    <div className={`w-12 h-12 ${degree.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <degree.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{degree.title}</h3>
                                        <div className="flex items-center text-xs font-semibold text-slate-400 mb-2">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {degree.duration}
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed">{degree.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Universities Carousel */}
            <section className="py-24 bg-slate-50 border-b border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">SKY Universities & More</h2>
                            <p className="text-slate-600 max-w-xl">Study at prestigious institutions known as &quot;SKY&quot; (Seoul National, Korea, Yonsei) and top tech institutes.</p>
                        </div>
                        <div className="hidden md:block">
                            <ArrowRight className="w-8 h-8 text-slate-300" />
                        </div>
                    </div>

                    <div className="overflow-x-auto pb-8 hide-scrollbar">
                        <div className="flex space-x-6 min-w-max">
                            {universities.map((uni, idx) => (
                                <div key={idx} className={`w-72 p-8 rounded-2xl ${uni.color} hover:shadow-lg transition-all cursor-default`}>
                                    <div className="bg-white/80 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                        <uni.logo className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{uni.name}</h3>
                                    <div className="h-1 w-10 bg-current opacity-20 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Layout */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Left Column (Content) */}
                        <div className="lg:col-span-2 space-y-16">

                            {/* Popular Programs */}
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                                    <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
                                    Popular Majors
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {popularPrograms.map((cat, idx) => (
                                        <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center mb-4">
                                                <div className="p-2 bg-white text-blue-600 rounded-lg mr-3 shadow-sm">
                                                    <cat.icon className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-bold text-slate-900">{cat.name}</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {cat.programs.map((p, i) => (
                                                    <li key={i} className="flex items-center text-sm text-slate-600">
                                                        <span className="w-1.5 h-1.5 bg-blue-300 rounded-full mr-2"></span>
                                                        {p}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cities */}
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                                    <MapPin className="w-6 h-6 mr-3 text-blue-600" />
                                    Top Cities
                                </h3>
                                <div className="space-y-4">
                                    {cities.map((city, idx) => (
                                        <div key={idx} className="group flex flex-col md:flex-row items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                            <div className="w-full md:w-32 h-24 bg-slate-100 rounded-lg flex-shrink-0 mb-4 md:mb-0 md:mr-6 flex items-center justify-center">
                                                <city.icon className="w-8 h-8 text-slate-400 opacity-50" />
                                            </div>
                                            <div className="flex-grow text-center md:text-left">
                                                <h4 className="text-xl font-bold text-slate-900">{city.name}</h4>
                                                <p className="text-sm text-slate-500 mb-2">{city.stats}</p>
                                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                                    {city.highlights.map((h, i) => (
                                                        <span key={i} className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200">
                                                            {h}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Admission & Docs */}
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                                    <FileCheck className="w-6 h-6 mr-3 text-blue-600" />
                                    Requirements
                                </h3>
                                <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
                                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-lg mb-4 text-blue-200">Documents</h4>
                                            <ul className="space-y-3">
                                                {['Passport Copy', 'Academic Transcripts (Apostilled)', 'Bank Statement ($20k)', 'Study Plan', 'Language Score'].map((item, i) => (
                                                    <li key={i} className="flex items-center text-slate-300 text-sm">
                                                        <CheckCircle2 className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-4 text-blue-200">Language</h4>
                                            <ul className="space-y-3">
                                                {[
                                                    'TOPIK Level 3+ (For most degrees)',
                                                    'IELTS 5.5+ / TOEFL 80+ (Methods vary)',
                                                    'Korean Program: No initial requirement'
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-center text-slate-300 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column (Sticky Sidebar) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">

                                {/* Scholarship Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-lg text-slate-900">Scholarships</h3>
                                        <Award className="w-6 h-6 text-yellow-500" />
                                    </div>

                                    <div className="space-y-4">
                                        {scholarships.map((s, idx) => (
                                            <div key={idx} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                                <div className="font-bold text-slate-800 text-sm mb-1">{s.name}</div>
                                                <div className="text-xs text-slate-500">{s.amount}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <ConsultationButton
                                            text="Check Eligibility"
                                            source="korea_sidebar_scholarship"
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors mt-2 text-center block"
                                        />
                                    </div>
                                </div>

                                {/* Quick Contact */}
                                <div className="bg-slate-900 rounded-2xl p-6 shadow-lg text-white">
                                    <h3 className="font-bold mb-4">Dreaming of Korea?</h3>
                                    <p className="text-slate-400 text-sm mb-6">
                                        Let our experts guide you through the GKS and University application process.
                                    </p>
                                    <div className="space-y-3">
                                        <ConsultationButton
                                            text="Book Free Consultation"
                                            source="korea_sidebar_book"
                                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-sm transition-colors"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Start Your Korean Journey</h2>
                    <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                        From K-Pop to Cutting-Edge Tech—Your future awaits.
                    </p>
                    <ConsultationButton
                        text="Get Started Now"
                        source="korea_footer_cta"
                        className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-xl shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-transform"
                    />
                </div>
            </section>
        </div>
    );
}
