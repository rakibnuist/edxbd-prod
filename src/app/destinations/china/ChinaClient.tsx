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
    School,
    Landmark,
    Languages,
    FileCheck,
    Scroll,
    GraduationCap,
    Clock,
    Sparkles
} from 'lucide-react';
import ConsultationButton from '@/components/ConsultationButton';
import Ticker from '@/components/ui/Ticker';

// --- Data ---

const universities = [
    'Tsinghua University', 'Peking University', 'Fudan University',
    'Shanghai Jiao Tong University', 'Zhejiang University', 'University of Science and Technology of China (USTC)',
    'Nanjing University', 'Wuhan University', 'Harbin Institute of Technology', 'Xi\'an Jiaotong University'
];

const scholarships = [
    { name: 'Chinese Government Scholarship (CSC)', amount: 'Full Tuition + Living Allowance', deadline: 'March 31st', icon: Award },
    { name: 'Confucius Institute Scholarship', amount: 'Full Coverage', deadline: 'April 20th', icon: Languages },
    { name: 'Provincial Government Scholarships', amount: 'Partial to Full Coverage', deadline: 'Varies', icon: MapPin },
    { name: 'University-specific Scholarships', amount: '10% - 100% Tuition Waiver', deadline: 'Varies', icon: School }
];

const degrees = [
    { title: 'Foundation Program', duration: '1 Year', desc: 'Pre-university preparation for students who need to bridge the gap.', icon: Sparkles, color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Diploma', duration: '2-3 Years', desc: 'Vocational and technical training focused on practical skills.', icon: Scroll, color: 'bg-teal-50 text-teal-600' },
    { title: 'Bachelor Degree', duration: '4-6 Years', desc: 'Undergraduate programs in Engineering, Medicine, Business, etc.', icon: GraduationCap, color: 'bg-red-50 text-red-600' },
    { title: 'Masters Degree', duration: '2-3 Years', desc: 'Postgraduate specialization with research opportunities.', icon: Award, color: 'bg-purple-50 text-purple-600' },
    { title: 'PhD / Doctoral', duration: '3-4 Years', desc: 'Advanced research degrees and academic excellence.', icon: Landmark, color: 'bg-amber-50 text-amber-600' },
    { title: 'Language Program', duration: '6 Months - 2 Years', desc: 'Intensive Chinese language courses (Non-degree).', icon: Languages, color: 'bg-pink-50 text-pink-600' }
];

const popularPrograms = [
    { name: 'Engineering & Technology', programs: ['Computer Science', 'AI', 'Mechanical', 'Civil'], icon: Building2 },
    { name: 'Business & Economics', programs: ['MBA', 'Finance', 'Marketing', 'Intl. Business'], icon: Wallet },
    { name: 'Medicine & Health', programs: ['Medicine', 'Dentistry', 'Pharmacy', 'Nursing'], icon: CheckCircle2 },
    { name: 'Arts & Humanities', programs: ['Law', 'Literature', 'History', 'Psychology'], icon: BookOpen }
];

const cities = [
    { name: 'Beijing', stats: '21.5M Pop • 39 Univ.', highlights: ['Capital City', 'Cultural Hub', 'Top Ranking Univ.'], imageQuery: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Shanghai', stats: '24.3M Pop • 64 Univ.', highlights: ['Financial Hub', 'Global City', 'Modern Lifestyle'], imageQuery: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?q=80&w=2069&auto=format&fit=crop' },
    { name: 'Guangzhou', stats: '15.3M Pop • 83 Univ.', highlights: ['Trade Hub', 'Cantonese Culture', 'Key Business Center'], imageQuery: 'https://images.unsplash.com/photo-1583491470868-8772074815d0?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Hangzhou', stats: '10.4M Pop • 47 Univ.', highlights: ['Tech Hub', 'Scenic Beauty', 'Alibaba HQ'], imageQuery: 'https://images.unsplash.com/photo-1568222629618-9366c8f94cb4?q=80&w=2070&auto=format&fit=crop' }
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

export default function ChinaClient() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-100 selection:text-red-900">

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 text-white">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 z-0"></div>
                <div className="absolute inset-0 opacity-20 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                {/* Animated Orbs */}
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-20 w-96 h-96 bg-red-600 rounded-full blur-[120px] opacity-30 z-0"
                />
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500 rounded-full blur-[100px] opacity-20 z-0"
                />

                <div className="container mx-auto px-6 relative z-10 pt-36">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-center max-w-5xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                            <span className="text-xl">🇨🇳</span>
                            <span className="text-sm font-medium tracking-wide text-red-100">PREMIER EDUCATION DESTINATION</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight">
                            Study in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">China</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                            Experience world-class education with <span className="text-white font-semibold">100% Full Scholarships</span> and immerse yourself in a rich cultural heritage.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <ConsultationButton
                                text="Apply for Full Scholarships"
                                source="china_hero_primary"
                                className="group relative px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-900/40 hover:bg-red-500 transition-all hover:scale-105 active:scale-95"
                            />
                            <ConsultationButton
                                text="Free Consultation"
                                source="china_hero_secondary"
                                className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-xl font-medium text-lg hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                            />
                        </motion.div>

                        {/* Hero Stats */}
                        <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-left">
                            {[
                                { label: 'Free Tuition', value: '100%', sub: 'Scholarship Coverage' },
                                { label: 'Universities', value: '150+', sub: 'Partner Institutions' },
                                { label: 'Stipend', value: '¥3.5k', sub: 'Monthly Allowance' },
                                { label: 'Visa Success', value: '98%', sub: 'Proven Track Record' }
                            ].map((stat, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm font-medium text-red-200">{stat.label}</div>
                                    <div className="text-xs text-slate-400 mt-1">{stat.sub}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Intakes Banner */}
            <div className="bg-red-900 text-white py-4 overflow-hidden">
                <div className="container mx-auto px-6 flex items-center justify-center space-x-8 animate-marquee whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        <span className="font-medium tracking-wide">MULTIPLE INTAKES: MARCH & SEPTEMBER</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        <span className="font-medium tracking-wide">SCHOLARSHIP DEADLINES APPROACHING SOON</span>
                    </div>
                </div>
            </div>

            {/* Why China - Modern Grid */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why China?</h2>
                        <div className="w-20 h-1 bg-red-600 mx-auto rounded-full mb-6"></div>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            A perfect blend of academic excellence, technological innovation, and cultural richness.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: '100% Free Tuition', desc: 'Full coverage for tuition fees at prestigious universities.', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { title: 'Free Accommodation', desc: 'Modern dormitories included in scholarship packages.', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50' },
                            { title: 'Monthly Stipend', desc: 'Up to ¥3,500/month for living expenses.', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
                            { title: 'English Programs', desc: '1000+ courses taught entirely in English.', icon: Languages, color: 'text-blue-600', bg: 'bg-blue-50' }
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

            {/* Degree Levels Section */}
            <section className="py-20 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Available Degrees & Levels</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Choose from a wide range of academic levels suitable for your career goals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {degrees.map((degree, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -4 }}
                                className="group relative overflow-hidden bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
            <section className="py-24 bg-white border-y border-slate-100 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Partner Universities</h2>
                            <p className="text-slate-600 max-w-xl">We work with China&apos;s most prestigious institutions.</p>
                        </div>
                    </div>

                    <Ticker items={universities} speed="normal" />
                </div>
            </section>

            {/* Main Content Layout */}
            <section className="py-12 md:py-24 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Left Column (Content) */}
                        <div className="lg:col-span-2 space-y-16">

                            {/* Popular Programs */}
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                                    <BookOpen className="w-6 h-6 mr-3 text-red-600" />
                                    Popular Programs
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {popularPrograms.map((cat, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center mb-4">
                                                <div className="p-2 bg-red-50 text-red-600 rounded-lg mr-3">
                                                    <cat.icon className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-bold text-slate-900">{cat.name}</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {cat.programs.map((p, i) => (
                                                    <li key={i} className="flex items-center text-sm text-slate-600">
                                                        <span className="w-1.5 h-1.5 bg-red-200 rounded-full mr-2"></span>
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
                                    <MapPin className="w-6 h-6 mr-3 text-red-600" />
                                    Top Study Destinations
                                </h3>
                                <div className="space-y-4">
                                    {cities.map((city, idx) => (
                                        <div key={idx} className="group flex flex-col md:flex-row items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                            <div className="w-full md:w-32 h-40 md:h-24 bg-slate-200 rounded-lg flex-shrink-0 mb-4 md:mb-0 md:mr-6 overflow-hidden relative">
                                                <img
                                                    src={city.imageQuery}
                                                    alt={city.name}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="flex-grow text-center md:text-left">
                                                <h4 className="text-xl font-bold text-slate-900">{city.name}</h4>
                                                <p className="text-sm text-slate-500 mb-2">{city.stats}</p>
                                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                                    {city.highlights.map((h, i) => (
                                                        <span key={i} className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded border border-slate-100">
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
                                    <FileCheck className="w-6 h-6 mr-3 text-red-600" />
                                    Admission Requirements
                                </h3>
                                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-lg mb-4 text-slate-800">Documents Needed</h4>
                                            <ul className="space-y-3">
                                                {['Passport Copy', 'Academic Transcripts', 'Passport Photo', 'Physical Exam Form', 'Police Clearance'].map((item, i) => (
                                                    <li key={i} className="flex items-center text-slate-600 text-sm">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-4 text-slate-800">Eligibility</h4>
                                            <ul className="space-y-3">
                                                {['High School / Bachelor Degree', 'Age: 18-35 (Varies)', 'Good Health Status', 'No Criminal Record'].map((item, i) => (
                                                    <li key={i} className="flex items-center text-slate-600 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-2"></div>
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
                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-lg">Scholarships</h3>
                                        <Award className="w-6 h-6 text-amber-400" />
                                    </div>

                                    <div className="space-y-4">
                                        {scholarships.map((s, idx) => (
                                            <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                                <div className="font-medium text-amber-200 text-sm mb-1">{s.name}</div>
                                                <div className="text-xs text-slate-300">{s.amount}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <div className="flex justify-between items-center text-sm mb-2">
                                            <span className="text-slate-400">Next Deadline:</span>
                                            <span className="font-bold text-red-400">March 31st</span>
                                        </div>
                                        <ConsultationButton
                                            text="Check Eligibility"
                                            source="china_sidebar_scholarship"
                                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold text-sm transition-colors mt-2 text-center block"
                                        />
                                    </div>
                                </div>

                                {/* Quick Contact */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-4">Start Your Journey</h3>
                                    <p className="text-slate-500 text-sm mb-6">
                                        Get a free assessment of your scholarship chances today.
                                    </p>
                                    <div className="space-y-3">
                                        <ConsultationButton
                                            text="Book Free Consultation"
                                            source="china_sidebar_book"
                                            className="w-full py-3 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 rounded-lg font-bold text-sm transition-colors"
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
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to Study in China?</h2>
                    <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                        Take the first step towards your global education with 100% scholarship support.
                    </p>
                    <ConsultationButton
                        text="Get Started Now"
                        source="china_footer_cta"
                        className="px-10 py-5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full font-bold text-xl shadow-lg hover:shadow-red-500/30 hover:scale-105 transition-transform"
                    />
                </div>
            </section>
        </div>
    );
}
