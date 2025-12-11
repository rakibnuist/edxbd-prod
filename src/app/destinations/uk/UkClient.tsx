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
    Clock,
    Sparkles,
    Scroll,
    GraduationCap,
    Crown,
    Briefcase
} from 'lucide-react';
import ConsultationButton from '@/components/ConsultationButton';

// --- Data ---

const universities = [
    { name: 'University of Oxford', logo: Landmark, color: 'bg-blue-900 text-white' },
    { name: 'University of Cambridge', logo: Scroll, color: 'bg-red-900 text-white' },
    { name: 'Imperial College', logo: BookOpen, color: 'bg-blue-800 text-white' },
    { name: 'UCL', logo: Building2, color: 'bg-indigo-900 text-white' },
    { name: 'LSE', logo: Globe, color: 'bg-red-800 text-white' },
    { name: 'King\'s College', logo: Crown, color: 'bg-red-700 text-white' },
    { name: 'Edinburgh', logo: School, color: 'bg-blue-700 text-white' },
    { name: 'Manchester', logo: Building2, color: 'bg-purple-900 text-white' }
];

const scholarships = [
    { name: 'Chevening Scholarship', amount: 'Full Funding + Flights + Stipend', deadline: 'Nov', icon: Crown },
    { name: 'Commonwealth Masters', amount: 'Full Tuition + Living (+ Flights)', deadline: 'Dec', icon: Globe },
    { name: 'GREAT Scholarships', amount: '£10,000 Minimum', deadline: 'Varies', icon: Award },
    { name: 'Global Excellence', amount: '£2,000 - £5,000', deadline: 'Automatic', icon: Sparkles }
];

const degrees = [
    { title: 'International Foundation', duration: '9 Months', desc: 'Pathway to undergraduate study for high school leavers.', icon: BookOpen, color: 'bg-blue-50 text-blue-800' },
    { title: 'Bachelor (Hons)', duration: '3 Years', desc: 'Standard undergraduate degree (BA, BSc, BEng).', icon: GraduationCap, color: 'bg-red-50 text-red-800' },
    { title: 'Masters (Taught)', duration: '1 Year', desc: 'Intensive specialization. Fast-track your career.', icon: Award, color: 'bg-amber-50 text-amber-700' },
    { title: 'Integrated Masters', duration: '4 Years', desc: 'Combine undergrad + postgrad study (MEng, MSci).', icon: Scroll, color: 'bg-indigo-50 text-indigo-800' },
    { title: 'Pre-Masters', duration: '3-6 Months', desc: 'Preparation for postgraduate study.', icon: Languages, color: 'bg-emerald-50 text-emerald-700' },
    { title: 'PhD / Research', duration: '3-4 Years', desc: 'Highest level of academic achievement.', icon: Landmark, color: 'bg-slate-100 text-slate-800' }
];

const popularPrograms = [
    { name: 'Business & Finance', programs: ['MBA', 'Finance', 'Management', 'Marketing'], icon: Wallet },
    { name: 'Law & Politics', programs: ['LLM', 'International Law', 'Human Rights', 'Politics'], icon: Landmark },
    { name: 'Engineering', programs: ['Computer Science', 'Data Science', 'Civil', 'Electrical'], icon: CpuIcon },
    { name: 'Healthcare', programs: ['Nursing', 'Public Health', 'Pharmacy', 'Psychology'], icon: HeartPulseIcon }
];

/* Helper icons just for this file if not imported */
function CpuIcon(props: React.SVGProps<SVGSVGElement>) {
    return <Building2 {...props} />; // Placeholder if Lucide icon missing, but Building2 is imported
}
function HeartPulseIcon(props: React.SVGProps<SVGSVGElement>) {
    return <Award {...props} />; // Placeholder
}


const cities = [
    { name: 'London', stats: 'Global Financial Hub', highlights: ['Top Universities', 'Multicultural', 'Career Opportunities'], icon: Crown },
    { name: 'Manchester', stats: 'Student Favorite', highlights: ['Affordable', 'Vibrant Nightlife', 'Tech Hub'], icon: Building2 },
    { name: 'Edinburgh', stats: 'Historic Capital', highlights: ['Academic Excellence', 'Beautiful City', 'Culture'], icon: Scroll },
    { name: 'Birmingham', stats: 'Central Hub', highlights: ['Low Cost of Living', 'Transport Link', 'Industry'], icon: MapPin }
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

export default function UkClient() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-100 selection:text-red-900">

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-blue-950 text-white">
                {/* Background - Royal Theme */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900 z-0"></div>
                <div className="absolute inset-0 opacity-20 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                {/* Animated Abstracts */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] border border-white/5 rounded-full z-0"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] border border-white/5 rounded-full z-0"
                />

                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-center max-w-5xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 bg-red-900/80 backdrop-blur-md border border-red-500/30 px-6 py-2 rounded-full mb-8 shadow-lg shadow-red-900/20">
                            <Crown className="w-5 h-5 text-amber-400" />
                            <span className="text-sm font-bold tracking-widest text-white uppercase">Home of Academic Excellence</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight font-serif">
                            Study in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-blue-400">United Kingdom</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                            Home to <span className="text-amber-400 font-semibold font-serif">Russell Group</span> universities. Master your future with a <span className="text-white font-semibold">1-Year Masters</span> degree.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <ConsultationButton
                                text="Apply for 2026/27 Intake"
                                source="uk_hero_primary"
                                className="group px-8 py-4 bg-red-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-red-900/50 hover:bg-red-600 transition-all hover:scale-105 active:scale-95"
                            />
                            <ConsultationButton
                                text="Explore Scholarships"
                                source="uk_hero_secondary"
                                className="px-8 py-4 bg-white/5 border border-white/30 text-white rounded-xl font-medium text-lg hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                            />
                        </motion.div>

                        {/* Hero Stats */}
                        <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-left">
                            {[
                                { label: 'Masters Duration', value: '1 Year', sub: 'Fast Track your career' },
                                { label: 'Post-Study Work', value: '2 Years', sub: 'Graduate Route Visa' },
                                { label: 'World Ranking', value: '#1', sub: 'Education System' },
                                { label: 'Intakes', value: 'Jan & Sept', sub: 'Key Entry Points' }
                            ].map((stat, i) => (
                                <div key={i} className="p-4 rounded-xl bg-blue-900/40 border border-white/10 backdrop-blur-sm hover:bg-blue-900/60 transition-colors">
                                    <div className="text-3xl font-bold text-white mb-1 font-serif">{stat.value}</div>
                                    <div className="text-sm font-medium text-amber-200 uppercase tracking-wide">{stat.label}</div>
                                    <div className="text-xs text-slate-400 mt-1">{stat.sub}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Intakes Banner */}
            <div className="bg-red-900 border-t border-red-800 text-white py-4 overflow-hidden shadow-inner">
                <div className="container mx-auto px-6 flex items-center justify-center space-x-8 animate-marquee whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        <span className="font-bold tracking-wide">NEXT INTAKE: SEPTEMBER 2026</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        <span className="font-bold tracking-wide">CHEVENING APPLICATIONS NOW OPEN</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-amber-400" />
                        <span className="font-bold tracking-wide">JANUARY INTAKE APPLICATIONS CLOSING</span>
                    </div>
                </div>
            </div>

            {/* Why UK - Modern Grid */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">Why Study in UK?</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-700 via-red-600 to-white mx-auto rounded-full mb-6"></div>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Unlock your potential with a British degree, recognized and respected by employers worldwide.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Academic Prestige', desc: 'Home to 4 of the world’s top 10 universities. A degree of distinction.', icon: Crown, color: 'text-amber-600', bg: 'bg-amber-50' },
                            { title: '1-Year Masters', desc: 'Save time and money with intensive 1-year postgraduate degrees.', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { title: 'Graduate Route Visa', desc: 'Stay and work in the UK for 2 years (3 years for PhD) after graduation.', icon: Briefcase, color: 'text-red-600', bg: 'bg-red-50' },
                            { title: 'Global Network', desc: 'Join a global alumni network of leaders, thinkers, and innovators.', icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50' }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-200"
                            >
                                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-6 border border-current opacity-90`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Available Degrees */}
            <section className="py-20 bg-white border-y border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">Degree Levels</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            From pathway programs to world-leading research degrees.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {degrees.map((degree, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -4 }}
                                className="group relative overflow-hidden bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-start space-x-4">
                                    <div className={`w-12 h-12 ${degree.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <degree.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 font-serif">{degree.title}</h3>
                                        <div className="flex items-center text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {degree.duration}
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">{degree.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Universities Carousel */}
            <section className="py-24 bg-blue-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <div className="inline-block px-3 py-1 bg-amber-500 text-blue-900 font-bold text-xs rounded mb-3">ELITE INSTITUTIONS</div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">Russell Group & Partners</h2>
                            <p className="text-blue-200 max-w-xl">Representing the UK&apos;s leading research-intensive universities.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto pb-8 hide-scrollbar">
                        <div className="flex space-x-6 min-w-max">
                            {universities.map((uni, idx) => (
                                <div key={idx} className={`w-72 p-8 rounded-2xl ${uni.color} hover:shadow-2xl transition-all cursor-default relative overflow-hidden group`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <uni.logo className="w-24 h-24" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                                            <uni.logo className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 font-serif leading-tight">{uni.name}</h3>
                                        <div className="h-0.5 w-10 bg-amber-400 opacity-60"></div>
                                    </div>
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
                                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center font-serif">
                                    <BookOpen className="w-6 h-6 mr-3 text-red-700" />
                                    Popular Majors
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {popularPrograms.map((cat, idx) => (
                                        <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center mb-4">
                                                <div className="p-2 bg-white text-red-700 rounded-lg mr-3 shadow-sm border border-slate-100">
                                                    <cat.icon className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-bold text-slate-900">{cat.name}</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {cat.programs.map((p, i) => (
                                                    <li key={i} className="flex items-center text-sm text-slate-600">
                                                        <span className="w-1.5 h-1.5 bg-blue-800 rounded-full mr-2"></span>
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
                                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center font-serif">
                                    <MapPin className="w-6 h-6 mr-3 text-blue-700" />
                                    Student Cities
                                </h3>
                                <div className="space-y-4">
                                    {cities.map((city, idx) => (
                                        <div key={idx} className="group flex flex-col md:flex-row items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:bg-slate-50">
                                            <div className="w-full md:w-32 h-24 bg-slate-100 rounded-lg flex-shrink-0 mb-4 md:mb-0 md:mr-6 flex items-center justify-center text-slate-300">
                                                <city.icon className="w-10 h-10" />
                                            </div>
                                            <div className="flex-grow text-center md:text-left">
                                                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                                    <h4 className="text-xl font-bold text-slate-900">{city.name}</h4>
                                                    {city.name === 'London' && <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">#1 STUDENT CITY</span>}
                                                </div>
                                                <p className="text-sm text-slate-500 mb-2 font-medium">{city.stats}</p>
                                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                                    {city.highlights.map((h, i) => (
                                                        <span key={i} className="text-xs px-2 py-1 bg-white text-slate-600 rounded border border-slate-200">
                                                            {h}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Right Column (Sticky Sidebar) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">

                                {/* Scholarship Card */}
                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-1 shadow-xl">
                                    <div className="bg-slate-900 rounded-xl p-6 h-full relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500 blur-3xl opacity-10"></div>
                                        <div className="flex items-center justify-between mb-6 relative z-10">
                                            <h3 className="font-bold text-lg text-white font-serif">Prestigious Scholarships</h3>
                                            <div className="bg-amber-500 text-slate-900 p-1.5 rounded-lg">
                                                <Award className="w-5 h-5" />
                                            </div>
                                        </div>

                                        <div className="space-y-4 relative z-10">
                                            {scholarships.map((s, idx) => (
                                                <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <s.icon className="w-3 h-3 text-amber-400" />
                                                        <div className="font-bold text-white text-sm">{s.name}</div>
                                                    </div>
                                                    <div className="text-xs text-slate-400 pl-5">{s.amount}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-white/10">
                                            <ConsultationButton
                                                text="Scholarship Assessment"
                                                source="uk_sidebar_scholarship"
                                                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg font-bold text-sm transition-colors mt-2 text-center block"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Contact */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                                    <h3 className="font-bold mb-4 text-slate-900 font-serif">Begin Your UK Journey</h3>
                                    <p className="text-slate-500 text-sm mb-6">
                                        Expert guidance for UCAS applications, Personal Statements, and Tier 4 Visas.
                                    </p>
                                    <div className="space-y-3">
                                        <ConsultationButton
                                            text="Book Free Consultation"
                                            source="uk_sidebar_book"
                                            className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-bold text-sm transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Fact Card */}
                                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-red-100 p-2 rounded-lg text-red-600">
                                            <GraduationCap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-red-900 text-sm mb-1">Did you know?</div>
                                            <p className="text-xs text-red-800 leading-relaxed">
                                                UK Masters degrees are typically 1 year, allowing you to re-enter the workforce faster than in other countries.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-blue-950 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-blue-900/90 to-blue-950"></div>

                {/* Decorative Glow */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="mb-10 flex justify-center">
                        <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            <Crown className="w-10 h-10 text-amber-500" />
                        </div>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-serif tracking-tight">
                        Your Gateway to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">Great Britain</span>
                    </h2>

                    <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                        Don&apos;t navigate the complex UK admissions process alone. Get expert guidance for Russell Group universities and Tier 4 visas.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
                        <ConsultationButton
                            text="Start Your Application"
                            source="uk_footer_cta_primary"
                            className="px-10 py-5 bg-amber-500 text-blue-950 rounded-xl font-bold text-xl shadow-lg hover:bg-amber-400 hover:scale-105 transition-all w-full sm:w-auto min-w-[200px]"
                        />
                        <ConsultationButton
                            text="Free Assessment"
                            source="uk_footer_cta_secondary"
                            className="px-10 py-5 bg-transparent border-2 border-slate-600 text-white rounded-xl font-bold text-xl hover:bg-white/5 hover:border-white transition-all w-full sm:w-auto min-w-[200px]"
                        />
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto border-t border-white/10 pt-10">
                        <div className="flex items-center justify-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span className="text-slate-300 font-medium">98% Visa Success Rate</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-amber-400" />
                            <span className="text-slate-300 font-medium">Russell Group Experts</span>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-400" />
                            <span className="text-slate-300 font-medium">No Hidden Fees</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
