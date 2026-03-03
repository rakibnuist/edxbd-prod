'use client';
import type { ReactElement } from 'react';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap,
    MapPin,
    BookOpen,
    DollarSign,
    Calendar,
    FileText,
    CheckCircle,
    CheckCircle2,
    AlertCircle,
    Clock,
    Wallet,
    ArrowLeft,
    Languages,
    Globe,
    Trophy,
    School,
    Star,
    Check,
    Info,
    Award,
    Palette,
    Building2,
    Stethoscope,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import UniversityWhatsApp from '@/components/UniversityWhatsApp';
import CTALeadForm from '@/components/CTALeadForm';
import { IUniversity } from '@/types/university';

interface UniversityDetailClientProps {
    initialData: IUniversity;
}

const UniversityDetailClient = ({ initialData }: UniversityDetailClientProps) => {
    const uni = initialData;

    if (!uni) {
        notFound();
    }

    const initialTab = useMemo(() => {
        if (uni.programs?.mbbs) return 'mbbs';
        if (uni.programs?.masters) return 'masters';

        // Check heuristics if no programs object
        const degrees = uni.degree?.map(d => d.toLowerCase()) || [];
        if (degrees.some(d => d.includes('mbbs') || d.includes('medicine')) ||
            uni.details?.majors?.some(m => m.toLowerCase().includes('mbbs') || m.toLowerCase().includes('clinical medicine'))) {
            return 'mbbs';
        }
        if (degrees.some(d => d.includes('master'))) return 'masters';

        return 'bachelor';
    }, [uni]);

    const [activeTab, setActiveTab] = useState<'bachelor' | 'mbbs' | 'masters'>(initialTab);

    // Ensure we sync tab if initialData changes (though rare in this view)
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const availableTabs = useMemo(() => {
        const tabs: ('bachelor' | 'mbbs' | 'masters')[] = [];

        // Add bachelor if it has bachelor programs OR if it's explicitly in degrees
        const hasBachelor = uni.programs?.bachelor || uni.degree?.some(d => d.toLowerCase().includes('bachelor'));
        if (hasBachelor) tabs.push('bachelor');

        // Add mbbs if it has mbbs programs OR if it's explicitly in degrees
        const hasMbbs = uni.programs?.mbbs || uni.degree?.some(d => d.toLowerCase().includes('mbbs') || d.toLowerCase().includes('medicine'));
        if (hasMbbs) tabs.push('mbbs');

        // Add masters if it has masters programs OR if it's explicitly in degrees
        const hasMasters = uni.programs?.masters || uni.degree?.some(d => d.toLowerCase().includes('master'));
        if (hasMasters) tabs.push('masters');

        // Fallback to bachelor if no tabs found
        if (tabs.length === 0) return ['bachelor'];

        // Sort to ensure consistent order: Bachelor, then MBBS, then Masters
        const order = ['bachelor', 'mbbs', 'masters'];
        return tabs.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    }, [uni]);

    const activeProgram = useMemo(() => {
        if (uni.programs?.[activeTab]) return uni.programs[activeTab];

        // Fallback for non-categorized data
        return {
            majors: uni.details.majors,
            tuition: uni.details.tuition,
            tuitionDetails: uni.details.tuitionDetails,
            fees: uni.fees
        };
    }, [uni, activeTab]);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CollegeOrUniversity",
        "name": uni.name,
        "url": `https://www.eduexpressint.com/universities/${uni.slug}`,
        "logo": uni.logo,
        "image": uni.logo,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": uni.city,
            "addressRegion": uni.location,
            "addressCountry": uni.country
        },
        "description": `Study at ${uni.name}. Explore tuition fees, scholarships, and admission details for international students.`,
        "offers": {
            "@type": "Offer",
            "price": uni.details?.tuition ? uni.details.tuition.replace(/[^0-9]/g, '') || "0" : "0",
            "priceCurrency": "CNY",
            "description": uni.details?.tuition || "Contact for tuition fees"
        }
    };

    return (
        <div className="min-h-screen text-slate-900" style={{ background: 'linear-gradient(180deg, #f1f5f9 0%, #f8fafc 40%, #f0f4ff 100%)' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            {/* ═══════════════════════════════════════════ */}
            {/*  PREMIUM HERO BANNER                        */}
            {/* ═══════════════════════════════════════════ */}
            <div className="relative overflow-hidden bg-[#050c1a]" style={{ minHeight: '560px' }}>

                {/* Grid pattern */}
                <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

                {/* Glow orbs */}
                <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-blue-700/20 rounded-full blur-[130px] -translate-y-1/2 pointer-events-none z-0" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-700/15 rounded-full blur-[100px] translate-y-1/3 pointer-events-none z-0" />

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent z-10" />

                <div className="container mx-auto px-6 pt-28 pb-16 relative z-10">

                    {/* Back link */}
                    <Link href="/universities" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold mb-12 group transition-colors">
                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 group-hover:bg-white/10 transition-all">
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span>Back to Universities</span>
                    </Link>

                    {/* Hero Grid */}
                    <div className="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-12 items-start">

                        {/* LEFT: White Logo Card — hidden on mobile */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex-shrink-0 hidden lg:block">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-3xl bg-blue-500/30 blur-2xl scale-105" />
                                <div className="relative bg-white rounded-3xl shadow-[0_0_80px_rgba(59,130,246,0.3)] p-8 w-full aspect-square flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                                    {uni.logo ? (
                                        <img src={uni.logo} alt={`${uni.name} logo`} className="w-full h-full object-contain relative z-10 drop-shadow-sm" />
                                    ) : (
                                        /* Premium text fallback when no logo */
                                        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mb-4 shadow-lg">
                                                <span className="text-white font-extrabold text-xl">
                                                    {uni.name.split(' ').filter((w: string) => w.length > 2).map((w: string) => w[0]).slice(0, 3).join('')}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 font-extrabold text-sm leading-tight text-center">{uni.name}</p>
                                            {uni.city && <p className="text-slate-400 text-xs font-semibold mt-1">{uni.city}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>


                        {/* RIGHT: University Info */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-white">

                            {/* Meta Badges */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                {uni.country && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30 uppercase tracking-wider">
                                        <Globe className="w-3 h-3" />{uni.country}
                                    </span>
                                )}
                                {uni.taught?.map(lang => (
                                    <span key={lang} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/30 uppercase tracking-wider">
                                        <Languages className="w-3 h-3" />{lang} Medium
                                    </span>
                                ))}
                                {uni.intake?.slice(0, 1).map(intake => (
                                    <span key={intake} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-bold border border-amber-400/30 uppercase tracking-wider">
                                        <Calendar className="w-3 h-3" />{intake}
                                    </span>
                                ))}
                            </div>

                            {/* Name */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white mb-3 tracking-tight">
                                {uni.name}
                            </h1>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-slate-400 mb-8 text-base font-medium">
                                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                {uni.location}
                            </div>

                            <div className="h-px bg-white/10 mb-6" />

                            {/* Rankings */}
                            {(uni.rankings?.world || uni.rankings?.national || uni.badges?.some(b => b.toLowerCase().match(/rank|news|edu|qs|times|cwur/))) && (
                                <div className="mb-6">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/70 mb-3">Global Rankings</p>
                                    <div className="flex flex-wrap gap-3">
                                        {uni.rankings?.world && (
                                            <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/30 rounded-2xl px-4 py-2.5 transition-all cursor-default">
                                                <Globe className="w-4 h-4 text-blue-400" />
                                                <div>
                                                    <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">World</p>
                                                    <p className="text-white font-extrabold text-base leading-none">#{uni.rankings.world}</p>
                                                </div>
                                            </div>
                                        )}
                                        {uni.rankings?.national && (
                                            <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/30 rounded-2xl px-4 py-2.5 transition-all cursor-default">
                                                <MapPin className="w-4 h-4 text-emerald-400" />
                                                <div>
                                                    <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">National</p>
                                                    <p className="text-white font-extrabold text-base leading-none">#{uni.rankings.national}</p>
                                                </div>
                                            </div>
                                        )}
                                        {uni.badges?.map((badge, i) => {
                                            if (!badge.toLowerCase().match(/rank|news|edu|qs|times|cwur/)) return null;
                                            const parts = badge.split(':');
                                            const label = parts[0]?.trim();
                                            const value = parts[1]?.trim() || '';
                                            return (
                                                <div key={i} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/30 rounded-2xl px-4 py-2.5 transition-all cursor-default">
                                                    <Trophy className="w-4 h-4 text-amber-400" />
                                                    <div>
                                                        <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">{label}</p>
                                                        <p className="text-white font-extrabold text-base leading-none">{value.startsWith('#') ? value : `#${value}`}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Deadline */}
                            {uni.deadlines?.application && (
                                <div className="inline-flex items-center gap-3 bg-amber-400/10 border border-amber-400/30 rounded-2xl px-5 py-3">
                                    <Clock className="w-5 h-5 text-amber-400 animate-pulse flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-amber-300/80 font-bold uppercase tracking-widest">Application Deadline</p>
                                        <p className="text-amber-200 font-black text-sm">{uni.deadlines.application}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Bottom fade to page bg */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none" />
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/*  DEGREE PROGRAM SELECTOR — full-width card-style tabs      */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
                <div className="container mx-auto px-6">
                    {availableTabs.length > 1 ? (
                        <div className={`grid divide-x divide-slate-100 ${availableTabs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                            {availableTabs.map((tab) => {
                                const isActive = activeTab === tab;
                                const cfgMap: Record<string, { label: string; sub: string; icon: ReactElement; activeGrad: string; activeText: string; dot: string }> = {
                                    bachelor: { label: 'Bachelor', sub: 'Undergraduate', icon: <GraduationCap className="w-5 h-5" />, activeGrad: 'from-emerald-500 to-teal-500', activeText: 'text-emerald-600', dot: 'bg-emerald-500' },
                                    mbbs: { label: 'Medical / MBBS', sub: 'Clinical Program', icon: <Stethoscope className="w-5 h-5" />, activeGrad: 'from-rose-500 to-red-500', activeText: 'text-rose-600', dot: 'bg-rose-500' },
                                    masters: { label: 'Masters', sub: 'Postgraduate', icon: <School className="w-5 h-5" />, activeGrad: 'from-violet-500 to-indigo-500', activeText: 'text-violet-600', dot: 'bg-violet-500' },
                                };
                                const cfg = cfgMap[tab];
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as 'mbbs' | 'masters' | 'bachelor')}
                                        className={`relative flex items-center gap-4 px-8 py-5 transition-all duration-200 group text-left
                                            ${isActive ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/60'}`}
                                    >
                                        {/* Active indicator bottom bar */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="tabUnderline"
                                                className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${cfg.activeGrad}`}
                                                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                            />
                                        )}
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                                            ${isActive ? `bg-gradient-to-br ${cfg.activeGrad} text-white shadow-md` : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'}`}>
                                            {cfg.icon}
                                        </div>
                                        {/* Labels */}
                                        <div>
                                            <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${isActive ? cfg.activeText : 'text-slate-400'}`}>
                                                {cfg.sub}
                                            </p>
                                            <p className={`text-base font-extrabold leading-tight ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                                                {cfg.label}
                                            </p>
                                        </div>
                                        {/* Active dot */}
                                        {isActive && <div className={`ml-auto w-2 h-2 rounded-full ${cfg.dot}`} />}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-4 flex items-center gap-3 text-slate-600">
                            <GraduationCap className="w-5 h-5 text-blue-500" />
                            <span className="font-bold capitalize text-slate-800">{availableTabs[0]}</span>
                            <span className="text-slate-400">Program</span>
                        </div>
                    )}
                </div>
            </section>

            <section className="container mx-auto px-4 md:px-6 pt-10 pb-28 relative z-20">
                <div className="grid lg:grid-cols-12 gap-6 xl:gap-10">

                    {/* LEFT COLUMN: Main Information */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Quick Highlights Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Program Card */}
                            <motion.div
                                key={`degree-${activeTab}`}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                                className={`bg-white rounded-2xl border-l-4 border border-slate-100 px-6 py-5 flex items-center gap-5 shadow-sm transition-all duration-300 cursor-default
                                    ${activeTab === 'mbbs' ? 'border-l-rose-400' : activeTab === 'masters' ? 'border-l-violet-400' : 'border-l-emerald-400'}`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                                    ${activeTab === 'mbbs' ? 'bg-gradient-to-br from-rose-400 to-red-500 text-white shadow-lg shadow-rose-200' :
                                        activeTab === 'masters' ? 'bg-gradient-to-br from-violet-400 to-indigo-500 text-white shadow-lg shadow-violet-200' :
                                            'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-200'}`}
                                >
                                    {activeTab === 'mbbs' ? <Stethoscope className="w-5 h-5" /> : activeTab === 'masters' ? <School className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Program</p>
                                    <p className="text-lg font-extrabold text-slate-900 capitalize leading-tight">{activeTab === 'mbbs' ? 'Medical / MBBS' : activeTab}</p>
                                </div>
                            </motion.div>

                            {/* Language Card */}
                            <motion.div
                                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                                className="bg-white rounded-2xl border-l-4 border-l-sky-400 border border-slate-100 px-6 py-5 flex items-center gap-5 shadow-sm transition-all duration-300 cursor-default"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-200 flex items-center justify-center flex-shrink-0">
                                    <Languages className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Taught In</p>
                                    <p className="text-lg font-extrabold text-slate-900 leading-tight">{uni.taught?.join(' & ')}</p>
                                </div>
                            </motion.div>

                            {/* Intake Card */}
                            <motion.div
                                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                                className="bg-white rounded-2xl border-l-4 border-l-amber-400 border border-slate-100 px-6 py-5 flex items-center gap-5 shadow-sm transition-all duration-300 cursor-default"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Intake</p>
                                    <p className="text-lg font-extrabold text-slate-900 leading-tight">{uni.intake?.join(', ')}</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Scholarship Card - Highly Highlighted & Interactive */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-950 rounded-3xl p-1 text-white shadow-2xl shadow-blue-900/40 overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay pointer-events-none"></div>
                            <div className="relative bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900 rounded-[22px] p-8 h-full">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/30">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-inner group-hover:bg-white/30 transition-colors">
                                                {activeTab === 'mbbs' ? <BookOpen className="w-7 h-7" /> : <DollarSign className="w-7 h-7" />}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black tracking-tight text-white mb-0.5">
                                                    {activeTab === 'mbbs' ? 'Program Overview' : 'Scholarships'}
                                                </h3>
                                                <div className="flex items-center bg-white/20 px-3 py-1 rounded-full w-fit">
                                                    <span className={`w-2.5 h-2.5 rounded-full mr-2 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse ${activeTab === 'mbbs' ? 'bg-rose-400' : 'bg-cyan-400'}`}></span>
                                                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                                                        {activeTab === 'mbbs' ? 'Official Admission Info' : 'Highly Recommended'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {uni.slug === 'njtech' ? (
                                        <div className="space-y-6">
                                            {/* First Year Policy */}
                                            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-3 text-lg tracking-tight flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2"></span>
                                                    First Year Scholarship
                                                </h4>
                                                <ul className="space-y-2.5 ml-3">
                                                    <li className="text-[14px] font-bold text-blue-50 leading-relaxed flex items-start">
                                                        <CheckCircle className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="flex-1">Tuition Fee: 100% Free</span>
                                                    </li>
                                                    <li className="text-[14px] font-bold text-blue-50 leading-relaxed flex items-start">
                                                        <CheckCircle className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="flex-1">Stipend: 400 CNY/Month</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Second Year Onwards Policy */}
                                            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg overflow-hidden">
                                                <h4 className="font-extrabold text-white mb-4 text-lg tracking-tight flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2"></span>
                                                    From Second Year:
                                                </h4>
                                                <div className="overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0">
                                                    <table className="w-full text-left border-collapse min-w-[300px]">
                                                        <thead>
                                                            <tr className="border-b border-white/20 text-[12px] uppercase tracking-wider text-cyan-200">
                                                                <th className="py-2 pr-4 font-bold">Fees</th>
                                                                <th className="py-2 px-3 font-bold text-center">Type A (10%)</th>
                                                                <th className="py-2 px-3 font-bold text-center">Type B (30%)</th>
                                                                <th className="py-2 pl-3 font-bold text-center">Type C (60%)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[13px] font-semibold text-white/90">
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Tuition Fee</td>
                                                                <td className="py-3 px-3 text-center">100% Free</td>
                                                                <td className="py-3 px-3 text-center">100% Free</td>
                                                                <td className="py-3 pl-3 text-center">8,000 CNY/Year</td>
                                                            </tr>
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Accommodation</td>
                                                                <td className="py-3 px-3 text-center">Self-Paid</td>
                                                                <td className="py-3 px-3 text-center">Self-Paid</td>
                                                                <td className="py-3 pl-3 text-center">Self-Paid</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Stipend</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">400 CNY/Month</td>
                                                                <td className="py-3 px-3 text-center text-white/50">N/A</td>
                                                                <td className="py-3 pl-3 text-center text-white/50">N/A</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'npu' ? (
                                        <div className="space-y-6">
                                            {/* The Belt & Road Scholarship */}
                                            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg overflow-hidden">
                                                <h4 className="font-extrabold text-white mb-4 text-lg tracking-tight flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2"></span>
                                                    The Belt & Road Scholarship (Only 1st Year):
                                                </h4>
                                                <div className="overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0">
                                                    <table className="w-full text-left border-collapse min-w-[300px]">
                                                        <thead>
                                                            <tr className="border-b border-white/20 text-[12px] uppercase tracking-wider text-cyan-200">
                                                                <th className="py-2 pr-4 font-bold">Fees</th>
                                                                <th className="py-2 px-3 font-bold text-center">Type A</th>
                                                                <th className="py-2 px-3 font-bold text-center">Type B</th>
                                                                <th className="py-2 pl-3 font-bold text-center">Type C</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[13px] font-semibold text-white/90">
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Tuition Fee</td>
                                                                <td className="py-3 px-3 text-center">100% Free</td>
                                                                <td className="py-3 px-3 text-center">100% Free</td>
                                                                <td className="py-3 pl-3 text-center">50% Free</td>
                                                            </tr>
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Accommodation</td>
                                                                <td className="py-3 px-3 text-center">100% Free</td>
                                                                <td className="py-3 px-3 text-center">Self-Paid</td>
                                                                <td className="py-3 pl-3 text-center">Self-Paid</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Stipend</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">1500 CNY/Month</td>
                                                                <td className="py-3 px-3 text-center text-white/50">N/A</td>
                                                                <td className="py-3 pl-3 text-center text-white/50">N/A</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* NPU President Scholarship */}
                                            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg overflow-hidden">
                                                <h4 className="font-extrabold text-white mb-4 text-lg tracking-tight flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2"></span>
                                                    NPU President Scholarship (All Years):
                                                </h4>
                                                <div className="overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0">
                                                    <table className="w-full text-left border-collapse min-w-[300px]">
                                                        <thead>
                                                            <tr className="border-b border-white/20 text-[12px] uppercase tracking-wider text-cyan-200">
                                                                <th className="py-2 pr-4 font-bold">Fees</th>
                                                                <th className="py-2 px-3 font-bold text-center">Excellence</th>
                                                                <th className="py-2 px-3 font-bold text-center">Full</th>
                                                                <th className="py-2 pl-3 font-bold text-center">Partial</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[13px] font-semibold text-white/90">
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Tuition Fee</td>
                                                                <td className="py-3 px-3 text-center">100% Free</td>
                                                                <td className="py-3 px-3 text-center">100% Free</td>
                                                                <td className="py-3 pl-3 text-center">50% Free</td>
                                                            </tr>
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Accommodation</td>
                                                                <td className="py-3 px-3 text-center">100% Free</td>
                                                                <td className="py-3 px-3 text-center">100% Free</td>
                                                                <td className="py-3 pl-3 text-center">Self-Paid</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Stipend</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">1500 CNY/Month</td>
                                                                <td className="py-3 px-3 text-center text-white/50">N/A</td>
                                                                <td className="py-3 pl-3 text-center text-white/50">N/A</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'xsyu' ? (
                                        <div className="space-y-6">
                                            {/* XSYU Belt and Road Scholarship */}
                                            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg overflow-hidden">
                                                <h4 className="font-extrabold text-white mb-4 text-lg tracking-tight flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2"></span>
                                                    Belt and Road International Students Scholarship
                                                </h4>
                                                <div className="overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0">
                                                    <table className="w-full text-left border-collapse min-w-[300px]">
                                                        <thead>
                                                            <tr className="border-b border-white/20 text-[12px] uppercase tracking-wider text-cyan-200">
                                                                <th className="py-2 pr-4 font-bold">Fees</th>
                                                                <th className="py-2 px-3 font-bold text-center">1st Type</th>
                                                                <th className="py-2 px-3 font-bold text-center">2nd Type</th>
                                                                <th className="py-2 pl-3 font-bold text-center">3rd Type</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[13px] font-semibold text-white/90">
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Tuition Fee</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 pl-3 text-center text-white/50">50% Free<br /><span className="text-[10px]">(Pay 9,250 CNY)</span></td>
                                                            </tr>
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Accommodation</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 px-3 text-center text-white/50">Self-Paid</td>
                                                                <td className="py-3 pl-3 text-center text-cyan-300">50% Free</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Stipend</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">1500 CNY/Month</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">1500 CNY/Month</td>
                                                                <td className="py-3 pl-3 text-center text-cyan-300">1500 CNY/Month</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-sm text-red-200/90 font-medium">All scholarship winners must pass an annual review. The Level of scholarship will be adjusted according strictly to their academic performance.</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'sbs' ? (
                                        <div className="space-y-6">
                                            {/* SBS Scholarship Table */}
                                            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg overflow-hidden">
                                                <h4 className="font-extrabold text-white mb-4 text-lg tracking-tight flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2"></span>
                                                    Scholarship Policy
                                                </h4>
                                                <div className="overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0">
                                                    <table className="w-full text-left border-collapse min-w-[500px]">
                                                        <thead>
                                                            <tr className="border-b border-white/20 text-[12px] uppercase tracking-wider text-cyan-200">
                                                                <th className="py-2 pr-4 font-bold">Fees</th>
                                                                <th className="py-2 px-3 font-bold text-center">Type A</th>
                                                                <th className="py-2 px-3 font-bold text-center">Type B</th>
                                                                <th className="py-2 px-3 font-bold text-center">Type C</th>
                                                                <th className="py-2 px-3 font-bold text-center">Type D</th>
                                                                <th className="py-2 pl-3 font-bold text-center">Type E</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[13px] font-semibold text-white/90">
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Tuition Fee</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 pl-3 text-center text-white/40">N/A</td>
                                                            </tr>
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Insurance Fee</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 pl-3 text-center text-white/40">N/A</td>
                                                            </tr>
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Accommodation</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 px-3 text-center text-white/50 font-normal">Self-Paid</td>
                                                                <td className="py-3 px-3 text-center text-white/50 font-normal">Self-Paid</td>
                                                                <td className="py-3 px-3 text-center text-white/50 font-normal">Self-Paid</td>
                                                                <td className="py-3 pl-3 text-center text-white/50 font-normal">Self-Paid</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Monthly Stipend</td>
                                                                <td className="py-3 px-3 text-center font-bold">1200 CNY</td>
                                                                <td className="py-3 px-3 text-center font-bold">1200 CNY</td>
                                                                <td className="py-3 px-3 text-center font-bold">600 CNY</td>
                                                                <td className="py-3 px-3 text-center text-white/40">N/A</td>
                                                                <td className="py-3 pl-3 text-center font-bold">1200 CNY</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mt-5 text-center italic text-blue-100/70 text-sm border-t border-white/10 pt-4">
                                                    &quot;All scholarship winners must pass an annual review.&quot;
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'ahut' ? (
                                        <div className="space-y-6">
                                            {/* AHUT Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    Scholarship Policy
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Type A */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-cyan-400/30 transition-colors">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-4">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            Type A
                                                        </h5>
                                                        <ul className="space-y-3">
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Tuition Fee: 100% Free</span>
                                                            </li>
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Accommodation Fee: 100% Free</span>
                                                            </li>
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Stipend: 3000 CNY/Year</span>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    {/* Type B */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-cyan-400/30 transition-colors">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-4">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            Type B
                                                        </h5>
                                                        <ul className="space-y-3">
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Tuition Fee: 100% Free</span>
                                                            </li>
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Accommodation Fee: 3,000 CNY/Year</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10 text-center italic text-blue-200/60 text-sm">
                                                    &quot;(University will review the scholarship every year)&quot;
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'njit' ? (
                                        <div className="space-y-6">
                                            {/* NJIT Scholarship Table */}
                                            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg overflow-hidden">
                                                <h4 className="font-extrabold text-white mb-4 text-lg tracking-tight flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2"></span>
                                                    Scholarship Policy
                                                </h4>
                                                <div className="overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0">
                                                    <table className="w-full text-left border-collapse min-w-[500px]">
                                                        <thead>
                                                            <tr className="border-b border-white/20 text-[12px] uppercase tracking-wider text-cyan-200">
                                                                <th className="py-2 pr-4 font-bold">Fees</th>
                                                                <th className="py-2 px-3 font-bold text-center">Type A</th>
                                                                <th className="py-2 px-3 font-bold text-center">Type B</th>
                                                                <th className="py-2 pl-3 font-bold text-center">Type C</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[13px] font-semibold text-white/90">
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Tuition Fee</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 pl-3 text-center text-cyan-300">100% Free</td>
                                                            </tr>
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Insurance Fee</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 pl-3 text-center text-cyan-300">100% Free</td>
                                                            </tr>
                                                            <tr className="border-b border-white/10">
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Accommodation</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-3 pl-3 text-center text-white/50 font-normal">Self-Paid</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="py-3 pr-4 text-blue-100 font-bold whitespace-nowrap">Stipend</td>
                                                                <td className="py-3 px-3 text-center font-bold">500 CNY/Month</td>
                                                                <td className="py-3 px-3 text-center text-white/40">N/A</td>
                                                                <td className="py-3 pl-3 text-center text-white/40">N/A</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mt-5 text-center italic text-blue-100/70 text-sm border-t border-white/10 pt-4">
                                                    &quot;All scholarship winners must pass an annual review.&quot;
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'sxu' ? (
                                        <div className="space-y-6">
                                            {/* SXU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    Scholarship Policy
                                                </h4>

                                                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-400/30 transition-colors">
                                                    <ul className="space-y-4">
                                                        <li className="flex items-center text-blue-50">
                                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center mr-4">
                                                                <Check className="w-5 h-5 text-cyan-400" />
                                                            </div>
                                                            <span className="text-lg font-semibold text-white">Tuition Fee: <span className="text-cyan-300 ml-1">100% Free</span></span>
                                                        </li>
                                                        <li className="flex items-center text-blue-50">
                                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center mr-4">
                                                                <Check className="w-5 h-5 text-cyan-400" />
                                                            </div>
                                                            <span className="text-lg font-semibold text-white">Accommodation Fee: <span className="text-cyan-300 ml-1">100% Free</span></span>
                                                        </li>
                                                        <li className="flex items-center text-blue-50">
                                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center mr-4">
                                                                <Check className="w-5 h-5 text-cyan-400" />
                                                            </div>
                                                            <span className="text-lg font-semibold text-white">Stipend: <span className="text-cyan-300 ml-1">500 CNY/Month</span></span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10 text-center italic text-blue-200/60 text-sm font-medium">
                                                    &quot;(University will review the scholarship every year)&quot;
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'hitsz' ? (
                                        <div className="space-y-6">
                                            {/* HITSZ Scholarship Table */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg overflow-hidden">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <Trophy className="w-5 h-5 text-cyan-400 mr-2" />
                                                    HITSZ Entrance Scholarship
                                                </h4>
                                                <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
                                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                                        <thead>
                                                            <tr className="border-b border-white/20 text-[11px] uppercase tracking-widest text-cyan-200">
                                                                <th className="py-3 pr-4 font-bold">Fees</th>
                                                                <th className="py-3 px-3 font-bold text-center bg-cyan-500/10 rounded-t-lg">Major Award</th>
                                                                <th className="py-3 px-3 font-bold text-center">First Award</th>
                                                                <th className="py-3 px-3 font-bold text-center">Second Award</th>
                                                                <th className="py-3 pl-3 font-bold text-center">Third Award</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[13px] font-semibold text-white/90">
                                                            <tr className="border-b border-white/10 group/row hover:bg-white/5 transition-colors">
                                                                <td className="py-4 pr-4 text-blue-100 font-bold whitespace-nowrap">Tuition Fee</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300 bg-cyan-500/5">100% Free</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-4 px-3 text-center">6,000 CNY/Year</td>
                                                                <td className="py-4 pl-3 text-center">9,000 CNY/Year</td>
                                                            </tr>
                                                            <tr className="group/row hover:bg-white/5 transition-colors">
                                                                <td className="py-4 pr-4 text-blue-100 font-bold whitespace-nowrap">Stipend</td>
                                                                <td className="py-4 px-3 text-center font-bold text-amber-300 bg-cyan-500/5 rounded-b-lg">1,000 CNY/Month</td>
                                                                <td className="py-4 px-3 text-center text-white/40">N/A</td>
                                                                <td className="py-4 px-3 text-center text-white/40">N/A</td>
                                                                <td className="py-4 pl-3 text-center text-white/40">N/A</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="mt-8 space-y-3">
                                                    <div className="flex items-center gap-3 bg-blue-500/10 p-4 rounded-xl border border-blue-400/20">
                                                        <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                                        <p className="text-sm text-blue-50 font-medium">Shenzhen Universiade International Scholarship: <span className="text-blue-300 font-bold ml-1">35,000 CNY/Year</span></p>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-emerald-500/10 p-4 rounded-xl border border-emerald-400/20">
                                                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                                        <p className="text-sm text-emerald-50 font-medium">Guangdong Government Scholarship: <span className="text-emerald-300 font-bold ml-1">10,000 RMB/Year</span></p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10 text-center italic text-blue-200/60 text-sm">
                                                    &quot;All scholarship winners must pass an annual review.&quot;
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'tyut' ? (
                                        <div className="space-y-6">
                                            {/* TYUT Scholarship Table */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg overflow-hidden">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <Trophy className="w-5 h-5 text-cyan-400 mr-2" />
                                                    Scholarship Policy
                                                </h4>
                                                <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
                                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                                        <thead>
                                                            <tr className="border-b border-white/20 text-[11px] uppercase tracking-widest text-cyan-200">
                                                                <th className="py-3 pr-4 font-bold">Fees</th>
                                                                <th className="py-3 px-3 font-bold text-center">Type B</th>
                                                                <th className="py-3 px-3 font-bold text-center">Type C</th>
                                                                <th className="py-3 px-3 font-bold text-center">Type D</th>
                                                                <th className="py-3 pl-3 font-bold text-center">Type E</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[13px] font-semibold text-white/90">
                                                            <tr className="border-b border-white/10 group/row hover:bg-white/5 transition-colors">
                                                                <td className="py-4 pr-4 text-blue-100 font-bold whitespace-nowrap">Tuition Fee</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-4 pl-3 text-center">10,000 CNY/Year</td>
                                                            </tr>
                                                            <tr className="border-b border-white/10 group/row hover:bg-white/5 transition-colors">
                                                                <td className="py-4 pr-4 text-blue-100 font-bold whitespace-nowrap">Hostel Fee</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-4 pl-3 text-center text-cyan-300">100% Free</td>
                                                            </tr>
                                                            <tr className="border-b border-white/10 group/row hover:bg-white/5 transition-colors">
                                                                <td className="py-4 pr-4 text-blue-100 font-bold whitespace-nowrap">Stipend</td>
                                                                <td className="py-4 px-3 text-center font-bold text-amber-300">800 CNY/Month</td>
                                                                <td className="py-4 px-3 text-center font-bold text-amber-300">500 CNY/Month</td>
                                                                <td className="py-4 px-3 text-center text-white/40">N/A</td>
                                                                <td className="py-4 pl-3 text-center text-white/40">N/A</td>
                                                            </tr>
                                                            <tr className="group/row hover:bg-white/5 transition-colors bg-white/5">
                                                                <td className="py-4 pr-4 text-cyan-200 font-bold whitespace-nowrap">Requirements</td>
                                                                <td className="py-4 px-3 text-center text-[11px] leading-relaxed">
                                                                    CSCA (M+P: 50+)<br />IELTS 6.5+
                                                                </td>
                                                                <td className="py-4 px-3 text-center text-[11px] leading-relaxed">
                                                                    CSCA (M+P: 45+)<br />IELTS 6.5+
                                                                </td>
                                                                <td className="py-4 px-3 text-center text-[11px] leading-relaxed">
                                                                    CSCA (M+P: 40+)<br />IELTS 6.5+
                                                                </td>
                                                                <td className="py-4 pl-3 text-center text-[11px] leading-relaxed">
                                                                    CSCA (M+P: 40+)<br />EFSET 65+
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (uni.slug === 'ntu' && activeTab !== 'mbbs') ? (
                                        <div className="space-y-6">
                                            {/* NTU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    NTU University Scholarship
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Type A */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-cyan-400/20 hover:border-cyan-400/40 transition-colors">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-4">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            Type A Scholarship
                                                        </h5>
                                                        <ul className="space-y-3">
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Tuition Fee: 100% Free</span>
                                                            </li>
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Hostel Fee: 100% Free</span>
                                                            </li>
                                                            {activeTab === 'masters' && (
                                                                <li className="flex items-start text-sm text-blue-50">
                                                                    <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                    <span>Stipend: 500 CNY/Month</span>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>

                                                    {/* Type B */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-cyan-400/30 transition-colors">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-4 whitespace-nowrap">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            Type B Scholarship
                                                        </h5>
                                                        <ul className="space-y-3">
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Tuition Fee: 100% Free</span>
                                                            </li>
                                                            {activeTab === 'masters' && (
                                                                <li className="flex items-start text-sm text-blue-50">
                                                                    <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                    <span>Hostel Fee: 100% Free</span>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10 text-center italic text-blue-200/60 text-sm font-medium">
                                                    &quot;All scholarship winners must pass an annual review.&quot;
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'gzu' ? (
                                        <div className="space-y-6">
                                            {/* GZU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    GZU University Scholarship
                                                </h4>

                                                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-400/30 transition-colors">
                                                    <ul className="space-y-4">
                                                        <li className="flex items-center text-blue-50">
                                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center mr-4">
                                                                <Check className="w-5 h-5 text-cyan-400" />
                                                            </div>
                                                            <span className="text-lg font-semibold text-white">Tuition Fee: <span className="text-cyan-300 ml-1">100% Free</span></span>
                                                        </li>
                                                        <li className="flex items-center text-blue-50">
                                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center mr-4">
                                                                <Check className="w-5 h-5 text-cyan-400" />
                                                            </div>
                                                            <span className="text-lg font-semibold text-white">Hostel Fee: <span className="text-cyan-300 ml-1">100% Free</span></span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'hit-harbin' ? (
                                        <div className="space-y-6">
                                            {/* HIT Harbin Scholarship Table */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg overflow-hidden">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <Trophy className="w-5 h-5 text-cyan-400 mr-2" />
                                                    HIT Scholarship
                                                </h4>
                                                <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
                                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                                        <thead>
                                                            <tr className="border-b border-white/20 text-[11px] uppercase tracking-widest text-cyan-200">
                                                                <th className="py-3 pr-4 font-bold">Category</th>
                                                                <th className="py-3 px-3 font-bold text-center bg-cyan-500/10 rounded-t-lg">Elite Class</th>
                                                                <th className="py-3 px-3 font-bold text-center">First Class</th>
                                                                <th className="py-3 px-3 font-bold text-center">Second Class</th>
                                                                <th className="py-3 pl-3 font-bold text-center">Third Class</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[13px] font-semibold text-white/90">
                                                            <tr className="border-b border-white/10 group/row hover:bg-white/5 transition-colors">
                                                                <td className="py-4 pr-4 text-blue-100 font-bold whitespace-nowrap">Tuition Coverage</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300 bg-cyan-500/5">100% Free</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">50% Free</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">30% Free</td>
                                                                <td className="py-4 pl-3 text-center text-cyan-300">20% Free</td>
                                                            </tr>
                                                            <tr className="group/row hover:bg-white/5 transition-colors">
                                                                <td className="py-4 pr-4 text-blue-100 font-bold whitespace-nowrap">Payable Amount</td>
                                                                <td className="py-4 px-3 text-center font-bold text-amber-300 bg-cyan-500/5 rounded-b-lg">0 CNY/Year</td>
                                                                <td className="py-4 px-3 text-center text-amber-300 font-bold">13,000 CNY/Year</td>
                                                                <td className="py-4 px-3 text-center text-amber-300 font-bold">18,200 CNY/Year</td>
                                                                <td className="py-4 pl-3 text-center text-amber-300 font-bold">20,800 CNY/Year</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'jxu' ? (
                                        <div className="space-y-6">
                                            {/* JXU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    Scholarship Policy
                                                </h4>

                                                <div className="space-y-4">
                                                    {/* Friendship Scholarship */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-4">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            Friendship Scholarship (100% Coverage)
                                                        </h5>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {[
                                                                'Tuition Fee: 100% Free',
                                                                'Accommodation Fee: 100% Free',
                                                                'Residence Permit Fee: 100% Free',
                                                                'Insurance Fee: 100% Free',
                                                                'Textbooks Fee: 100% Free',
                                                                'Physical Exam Fee: 100% Free'
                                                            ].map((item, idx) => (
                                                                <div key={item} className="flex items-center text-blue-50 text-sm">
                                                                    <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0" />
                                                                    {item}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Other Scholarships */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 italic text-sm text-blue-100">
                                                            <span className="font-bold text-white block mb-1">Excellent Degree Freshman:</span>
                                                            100% Tuition Free + 5,475 CNY/Year Accommodation
                                                        </div>
                                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 italic text-sm text-blue-100">
                                                            <span className="font-bold text-white block mb-1">Zhejiang Provincial:</span>
                                                            20,000 CNY/Year
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10 text-center italic text-blue-200/60 text-sm font-medium">
                                                    &quot;(University will review the scholarship every year)&quot;
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'zjut' ? (
                                        <div className="space-y-6">
                                            {/* ZJUT Scholarship Table */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg overflow-hidden">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    Scholarship Policy
                                                </h4>
                                                <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
                                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                                        <thead>
                                                            <tr className="border-b border-white/20 text-[11px] uppercase tracking-widest text-cyan-200">
                                                                <th className="py-3 pr-4 font-bold">Category</th>
                                                                <th className="py-3 px-3 font-bold text-center bg-cyan-500/10 rounded-t-lg">Type A</th>
                                                                <th className="py-3 px-3 font-bold text-center">Type B</th>
                                                                <th className="py-3 px-3 font-bold text-center">Type C</th>
                                                                <th className="py-3 pl-3 font-bold text-center">Type D</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[13px] font-semibold text-white/90">
                                                            <tr className="border-b border-white/10 group/row hover:bg-white/5 transition-colors">
                                                                <td className="py-4 pr-4 text-blue-100 font-bold whitespace-nowrap">1st Year Tuition</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300 bg-cyan-500/5">100% Free</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">50% Free</td>
                                                                <td className="py-4 pl-3 text-center text-cyan-300">Self-Funded</td>
                                                            </tr>
                                                            <tr className="border-b border-white/10 group/row hover:bg-white/5 transition-colors">
                                                                <td className="py-4 pr-4 text-blue-100 font-bold whitespace-nowrap">Accommodation</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300 bg-cyan-500/5">Self-Funded</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">Self-Funded</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">Self-Funded</td>
                                                                <td className="py-4 pl-3 text-center text-cyan-300">100% Free</td>
                                                            </tr>
                                                            <tr className="group/row hover:bg-white/5 transition-colors">
                                                                <td className="py-4 pr-4 text-blue-100 font-bold whitespace-nowrap">Payable (Tuition)</td>
                                                                <td className="py-4 px-3 text-center font-bold text-amber-300 bg-cyan-500/5 rounded-b-lg">0 CNY/Year</td>
                                                                <td className="py-4 px-3 text-center text-amber-300 font-bold">0 CNY/Year</td>
                                                                <td className="py-4 px-3 text-center text-amber-300 font-bold">8,900 CNY/Year</td>
                                                                <td className="py-4 pl-3 text-center text-amber-300 font-bold">17,800 CNY/Year</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mt-6 pt-4 border-t border-white/10 italic text-blue-200/60 text-[12px] leading-relaxed">
                                                    Note: Type A is for 4 years. For Type B, C and D, the university provides subsequent scholarships (Years 2-4) based on performance reviews.
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'fuist' ? (
                                        <div className="space-y-6">
                                            {/* FUIST Scholarship Table */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg overflow-hidden">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    Scholarship Policy
                                                </h4>
                                                <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
                                                    <table className="w-full text-left border-collapse min-w-[700px]">
                                                        <thead>
                                                            <tr className="border-b border-white/20 text-[11px] uppercase tracking-widest text-cyan-200">
                                                                <th className="py-3 pr-4 font-bold">Category</th>
                                                                <th className="py-3 px-3 font-bold text-center bg-cyan-500/10 rounded-t-lg">Type A</th>
                                                                <th className="py-3 px-3 font-bold text-center">Type B</th>
                                                                <th className="py-3 px-3 font-bold text-center">Type C</th>
                                                                <th className="py-3 pl-3 font-bold text-center">Type D</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-[13px] font-semibold text-white/90">
                                                            <tr className="border-b border-white/10 group/row hover:bg-white/5 transition-colors">
                                                                <td className="py-4 pr-4 text-blue-100 font-bold whitespace-nowrap">Tuition Fee</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300 bg-cyan-500/5">100% Free</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">100% Free</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">6,000 CNY/Year</td>
                                                                <td className="py-4 pl-3 text-center text-cyan-300">6,000 CNY/Year</td>
                                                            </tr>
                                                            <tr className="group/row hover:bg-white/5 transition-colors">
                                                                <td className="py-4 pr-4 text-blue-100 font-bold whitespace-nowrap">Accommodation</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300 bg-cyan-500/5 rounded-b-lg">100% Free</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300">3,200 CNY/Year</td>
                                                                <td className="py-4 px-3 text-center text-cyan-300 font-bold">100% Free</td>
                                                                <td className="py-4 pl-3 text-center text-amber-300 font-bold">3,200 CNY/Year</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="mt-6 pt-4 border-t border-white/10 italic text-blue-200/60 text-sm font-medium text-center">
                                                    &quot;(University will review the scholarship every year)&quot;
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'jit' ? (
                                        <div className="space-y-6">
                                            {/* JIT Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    JIT Scholarship Policy
                                                </h4>

                                                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-400/30 transition-colors">
                                                    <ul className="space-y-4">
                                                        <li className="flex items-center text-blue-50">
                                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center mr-4">
                                                                <Check className="w-5 h-5 text-cyan-400" />
                                                            </div>
                                                            <span className="text-lg font-semibold text-white">Tuition Fee: <span className="text-cyan-300 ml-1">100% Free</span></span>
                                                        </li>
                                                        <li className="flex items-center text-blue-50">
                                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center mr-4">
                                                                <Check className="w-5 h-5 text-cyan-400" />
                                                            </div>
                                                            <span className="text-lg font-semibold text-white">Accommodation Fee: <span className="text-cyan-300 ml-1">100% Free</span></span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10 text-center italic text-blue-200/60 text-sm font-medium">
                                                    &quot;(University will review the scholarship every year)&quot;
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'smu' ? (
                                        <div className="space-y-6">
                                            {/* SMU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    University Scholarship
                                                </h4>

                                                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-400/30 transition-colors">
                                                    <ul className="space-y-4">
                                                        <li className="flex items-center text-blue-50">
                                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center mr-4">
                                                                <Check className="w-5 h-5 text-cyan-400" />
                                                            </div>
                                                            <span className="text-lg font-semibold text-white">Tuition Fee: <span className="text-cyan-300 ml-1">100% Free</span></span>
                                                        </li>
                                                        <li className="flex items-center text-blue-50">
                                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center mr-4">
                                                                <Check className="w-5 h-5 text-cyan-400" />
                                                            </div>
                                                            <span className="text-lg font-semibold text-white">Hostel Fee: <span className="text-cyan-300 ml-1">100% Free</span></span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10 text-center italic text-blue-200/60 text-sm font-medium">
                                                    (CSCA Required)
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'hsu' ? (
                                        <div className="space-y-6">
                                            {/* HSU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    University Scholarship
                                                </h4>

                                                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-400/30 transition-colors">
                                                    <ul className="space-y-4">
                                                        <li className="flex items-center text-blue-50">
                                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center mr-4">
                                                                <Check className="w-5 h-5 text-cyan-400" />
                                                            </div>
                                                            <span className="text-lg font-semibold text-white">Tuition Fee: <span className="text-cyan-300 ml-1">100% Free</span></span>
                                                        </li>
                                                        <li className="flex items-center text-blue-50">
                                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center mr-4">
                                                                <Check className="w-5 h-5 text-cyan-400" />
                                                            </div>
                                                            <span className="text-lg font-semibold text-white">Hostel Fee: <span className="text-cyan-300 ml-1">100% Free</span></span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10 text-center italic text-blue-200/60 text-sm font-medium">
                                                    (Terms and conditions apply based on performance)
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'wzu' ? (
                                        <div className="space-y-6">
                                            {/* WZU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    WZU Scholarship Policy
                                                </h4>

                                                <div className="space-y-4">
                                                    {/* First Class */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 group hover:bg-cyan-500/15 transition-all">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h5 className="flex items-center text-cyan-300 font-bold">
                                                                <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                                First Class Scholarship
                                                            </h5>
                                                            <span className="text-xs font-bold px-2 py-1 bg-cyan-400/20 text-cyan-300 rounded-full uppercase tracking-tighter">Premier</span>
                                                        </div>
                                                        <p className="text-white text-lg font-extrabold flex items-center">
                                                            Tuition Fee: <span className="text-cyan-400 ml-2">100% Free</span>
                                                        </p>
                                                    </div>

                                                    {/* Second Class */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 group hover:bg-white/10 transition-all">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h5 className="flex items-center text-blue-100 font-bold">
                                                                <Star className="w-4 h-4 mr-2" />
                                                                Second Class Scholarship
                                                            </h5>
                                                        </div>
                                                        <p className="text-white text-lg font-extrabold flex items-center">
                                                            Payable: <span className="text-amber-400 ml-2">8,000 CNY/Year</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10 text-center italic text-blue-200/60 text-sm font-medium">
                                                    &quot;(University will review the scholarship every year)&quot;
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'nuist' ? (
                                        <div className="space-y-6">
                                            {/* NUIST Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    NUIST Freshman Excellent Scholarship
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* First Class */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 glass-morphism">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            First Class
                                                        </h5>
                                                        <p className="text-white text-lg font-extrabold">
                                                            Tuition Fee: <span className="text-cyan-400">100% Free</span>
                                                        </p>
                                                        <p className="text-[10px] text-cyan-200/60 mt-2 uppercase tracking-widest font-bold">Renewal: Top 40% Status</p>
                                                    </div>

                                                    {/* Second Class */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 glass-morphism">
                                                        <h5 className="flex items-center text-blue-100 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2" />
                                                            Second Class
                                                        </h5>
                                                        <p className="text-white text-lg font-extrabold">
                                                            Payable: <span className="text-amber-400">9,000 CNY/Year</span>
                                                        </p>
                                                        <p className="text-[10px] text-blue-200/60 mt-2 uppercase tracking-widest font-bold">Coverage: 50% Tuition Free</p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                                    <h5 className="text-sm font-bold text-white mb-2 flex items-center">
                                                        <Info className="w-3.5 h-3.5 mr-2 text-cyan-400" />
                                                        Renewal Policy (From Year 2)
                                                    </h5>
                                                    <div className="grid grid-cols-2 gap-4 text-[12px]">
                                                        <div className="text-blue-100 flex items-center">
                                                            <Check className="w-3 h-3 mr-1.5 text-cyan-400" />
                                                            Top <span className="text-white font-bold mx-1">40%</span> &rarr; 1st Class
                                                        </div>
                                                        <div className="text-blue-100 flex items-center">
                                                            <Check className="w-3 h-3 mr-1.5 text-cyan-400" />
                                                            <span className="text-white font-bold mx-1">41-85%</span> &rarr; 2nd Class
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'suep' ? (
                                        <div className="space-y-6">
                                            {/* SUEP Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    Scholarship Policy
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {/* SGS Class A */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 glass-morphism relative overflow-hidden group/card hover:bg-cyan-500/15 transition-all">
                                                        <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-3 relative z-10">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            SGS Class A
                                                        </h5>
                                                        <div className="space-y-2 relative z-10">
                                                            <div className="flex items-center text-white text-xs font-bold">
                                                                <Check className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0" />
                                                                Tuition: 100% FREE
                                                            </div>
                                                            <div className="flex items-center text-white text-xs font-bold">
                                                                <Check className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0" />
                                                                Insurance: 100% FREE
                                                            </div>
                                                            <div className="flex items-center text-white text-xs font-bold">
                                                                <Check className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0" />
                                                                Hostel: 100% FREE
                                                            </div>
                                                            <div className="text-cyan-200 text-[10px] font-black uppercase tracking-widest mt-3 bg-cyan-400/20 px-2 py-1 rounded-lg inline-block">
                                                                Stipend: 12,000 CNY/Year
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* SGS Class B */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-cyan-400/30 transition-all group/card">
                                                        <h5 className="flex items-center text-blue-100 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2" />
                                                            SGS Class B
                                                        </h5>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center text-white text-xs font-bold">
                                                                <Check className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0" />
                                                                Tuition: 100% FREE
                                                            </div>
                                                            <div className="flex items-center text-white text-xs font-bold">
                                                                <Check className="w-3.5 h-3.5 mr-2 text-cyan-400 flex-shrink-0" />
                                                                Insurance: 100% FREE
                                                            </div>
                                                            <div className="text-blue-200 text-[10px] font-bold mt-2">
                                                                Hostel: 4,500 CNY/Year
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* University Scholarship */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-amber-400/30 transition-all group/card">
                                                        <h5 className="flex items-center text-blue-100 font-bold mb-3">
                                                            <Trophy className="w-4 h-4 mr-2 text-amber-400" />
                                                            University
                                                        </h5>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center text-white text-xs font-bold">
                                                                <Check className="w-3.5 h-3.5 mr-2 text-amber-400 flex-shrink-0" />
                                                                Tuition: 8,000 CNY/Year
                                                            </div>
                                                            <div className="flex items-center text-white text-xs font-bold">
                                                                <Check className="w-3.5 h-3.5 mr-2 text-amber-400 flex-shrink-0" />
                                                                Insurance: 100% FREE
                                                            </div>
                                                            <div className="text-blue-200 text-[10px] font-bold mt-2">
                                                                Hostel: 4,500 CNY/Year
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-blue-200/40 text-[10px] uppercase font-bold tracking-widest">
                                                    <Info className="w-3.5 h-3.5" />
                                                    Subject to Annual Review & Performance
                                                </div>
                                            </div>
                                        </div>
                                    ) : (uni.slug === 'zzu' && activeTab !== 'mbbs') ? (
                                        <div className="space-y-6">
                                            {/* ZZU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    University President Scholarship
                                                </h4>

                                                <div className="space-y-4">
                                                    {/* Type A */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 group hover:bg-cyan-500/15 transition-all">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h5 className="flex items-center text-cyan-300 font-bold tracking-tight">
                                                                <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                                Type A Scholarship
                                                            </h5>
                                                        </div>
                                                        <p className="text-white text-xl font-extrabold flex items-center">
                                                            Tuition Fee: <span className="text-cyan-400 ml-2">100% Free</span>
                                                        </p>
                                                    </div>

                                                    {/* Type B */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 group hover:bg-white/10 transition-all">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h5 className="flex items-center text-blue-100 font-bold tracking-tight">
                                                                <Star className="w-4 h-4 mr-2" />
                                                                Type B Scholarship
                                                            </h5>
                                                        </div>
                                                        <p className="text-white text-xl font-extrabold flex items-center">
                                                            Tuition Fee: <span className="text-amber-400 ml-2">5,000 CNY</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10">
                                                    <div className="flex items-center justify-center gap-2 text-blue-200/60 text-xs font-medium uppercase tracking-widest">
                                                        <Info className="w-3.5 h-3.5" />
                                                        Subject to Annual Academic Review
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'cumt' ? (
                                        <div className="space-y-6">
                                            {/* CUMT Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    CUMT School Scholarship
                                                </h4>

                                                <div className="space-y-4">
                                                    {/* First Class */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 group hover:bg-cyan-500/15 transition-all">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h5 className="flex items-center text-cyan-300 font-bold tracking-tight">
                                                                <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                                First Class Scholarship
                                                            </h5>
                                                        </div>
                                                        <p className="text-white text-xl font-extrabold flex items-center">
                                                            Tuition Fee: <span className="text-cyan-400 ml-2">100% Free</span>
                                                        </p>
                                                    </div>

                                                    {/* Second Class */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 group hover:bg-white/10 transition-all">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h5 className="flex items-center text-blue-100 font-bold tracking-tight">
                                                                <Star className="w-4 h-4 mr-2" />
                                                                Second Class Scholarship
                                                            </h5>
                                                        </div>
                                                        <p className="text-white text-xl font-extrabold flex items-center">
                                                            Coverage: <span className="text-amber-400 ml-2">50% Tuition Free</span>
                                                        </p>
                                                        <p className="text-sm text-blue-200/60 mt-1">Payable: 7,200 CNY/Year</p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-white/10">
                                                    <div className="flex items-center justify-center gap-2 text-blue-200/60 text-xs font-medium uppercase tracking-widest text-center">
                                                        <Info className="w-3.5 h-3.5" />
                                                        All scholarship winners must pass an annual review
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'nuaa' ? (
                                        <div className="space-y-6">
                                            {/* NUAA Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    NUAA Scholarship Policy
                                                </h4>

                                                <div className="space-y-4">
                                                    {/* Fly High */}
                                                    <div className="bg-blue-600/10 rounded-xl p-5 border border-blue-400/20 group hover:bg-blue-600/15 transition-all">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h5 className="flex items-center text-blue-200 font-bold tracking-tight">
                                                                <Star className="w-4 h-4 mr-2 fill-blue-400" />
                                                                NUAA Fly High Scholarship
                                                            </h5>
                                                            <span className="text-[10px] font-bold px-2 py-1 bg-blue-400/20 text-blue-300 rounded-full uppercase tracking-tighter">Entrance</span>
                                                        </div>
                                                        <p className="text-white text-xl font-extrabold flex items-center">
                                                            1st Year: <span className="text-cyan-400 ml-2">100% Tuition Free</span>
                                                        </p>
                                                    </div>

                                                    {/* Government */}
                                                    <div className="bg-emerald-500/5 rounded-xl p-5 border border-emerald-400/10 group hover:bg-emerald-500/10 transition-all">
                                                        <h5 className="flex items-center text-emerald-300 font-bold tracking-tight mb-2">
                                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                                            Nanjing Government Scholarship
                                                        </h5>
                                                        <p className="text-white text-xl font-extrabold flex items-center">
                                                            Reward: <span className="text-emerald-400 ml-2">10,000 CNY</span>
                                                        </p>
                                                        <p className="text-xs text-blue-200/40 mt-1">(One-time payment)</p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                                    <div className="flex items-start gap-3">
                                                        <Info className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                                                        <p className="text-xs text-blue-100/70 leading-relaxed italic">
                                                            All scholarship winners must pass an annual review. Level of scholarship adjusted according to academic performance.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'scut' ? (
                                        <div className="space-y-6">
                                            {/* SCUT Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    SCUT Scholarship Policy
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Type A */}
                                                    <div className="bg-cyan-500/15 rounded-xl p-5 border border-cyan-400/30 glass-morphism col-span-1 md:col-span-2">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h5 className="flex items-center text-cyan-300 font-bold tracking-tight">
                                                                <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                                Type A: 100% Free
                                                            </h5>
                                                            <span className="text-[10px] font-bold px-2 py-1 bg-cyan-400/20 text-cyan-300 rounded-lg uppercase tracking-widest">Full 4 Years</span>
                                                        </div>
                                                        <p className="text-white text-lg font-extrabold">
                                                            Tuition Status: <span className="text-cyan-400">100% FREE</span>
                                                        </p>
                                                    </div>

                                                    {/* Type B */}
                                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                                                        <h5 className="flex items-center text-blue-100 font-bold mb-2">
                                                            <Star className="w-3.5 h-3.5 mr-2 fill-blue-300/40" />
                                                            Type B (4 Years)
                                                        </h5>
                                                        <p className="text-white font-extrabold mb-1">50% Tuition FREE</p>
                                                        <p className="text-xs text-blue-200/60 font-medium tracking-tight">Payable: 13,000 CNY/Year</p>
                                                    </div>

                                                    {/* Type C */}
                                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                                                        <h5 className="flex items-center text-blue-100 font-bold mb-2">
                                                            <Star className="w-3.5 h-3.5 mr-2 fill-blue-300/20" />
                                                            Type C (2 Years)
                                                        </h5>
                                                        <p className="text-white font-extrabold mb-1">50% Tuition FREE</p>
                                                        <p className="text-xs text-blue-200/60 font-medium tracking-tight">Payable: 13,000 CNY/Year</p>
                                                    </div>

                                                    {/* Type D */}
                                                    <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-400/20 hover:bg-emerald-500/10 transition-colors col-span-1 md:col-span-2">
                                                        <h5 className="flex items-center text-emerald-300 font-bold mb-2">
                                                            <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                                                            Type D: Guangdong Government
                                                        </h5>
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-white font-extrabold">10,000 CNY <span className="text-emerald-400/80 text-xs font-medium ml-1">/ Year</span></p>
                                                            <p className="text-xs text-emerald-200/40 font-bold px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">Payable: 16,000 CNY</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'sues' ? (
                                        <div className="space-y-6">
                                            {/* SUES Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    SUES Full Scholarship Policy
                                                </h4>

                                                <div className="space-y-4">
                                                    {/* Tuition & Insurance */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 glass-morphism">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            100% Coverage
                                                        </h5>
                                                        <div className="space-y-2">
                                                            <p className="text-white text-lg font-extrabold">
                                                                Tuition: <span className="text-cyan-400">FREE</span>
                                                            </p>
                                                            <p className="text-white text-lg font-extrabold">
                                                                Insurance: <span className="text-cyan-400">FREE</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Hostel */}
                                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                                        <div className="flex justify-between items-center text-blue-100 font-bold">
                                                            <span>Hostel Fee</span>
                                                            <span className="text-amber-400">1,200 CNY/Year</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-8 pt-6 border-t border-white/10">
                                                    <h5 className="text-sm font-bold text-white mb-4 flex items-center uppercase tracking-wider">
                                                        <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
                                                        Renewal Requirements
                                                    </h5>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-blue-400/30 transition-colors flex items-center justify-between">
                                                            <span className="text-blue-100 text-sm font-medium">End of Year 1</span>
                                                            <span className="text-xs font-black bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">PASS HSK 3</span>
                                                        </div>
                                                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-blue-400/30 transition-colors flex items-center justify-between">
                                                            <span className="text-blue-100 text-sm font-medium">End of Year 2</span>
                                                            <span className="text-xs font-black bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">PASS HSK 4</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-blue-200/40 mt-4 text-center italic">&quot;Required to maintain scholarship for subsequent years&quot;</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'sdu' ? (
                                        <div className="space-y-6">
                                            {/* SDU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    SDU Scholarship Policy
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Class A */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 glass-morphism relative overflow-hidden group/card hover:bg-cyan-500/15 transition-all">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            Class A Scholarship
                                                        </h5>
                                                        <div className="space-y-2">
                                                            <div className="text-white text-lg font-extrabold flex items-center">
                                                                Tuition Fee: <span className="text-cyan-400 ml-2">100% Free</span>
                                                            </div>
                                                            <div className="text-blue-100/60 text-sm font-medium">
                                                                Hostel Fee: 9,600 CNY/Year
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Class B */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-cyan-400/30 transition-all group/card">
                                                        <h5 className="flex items-center text-blue-100 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2" />
                                                            Class B Scholarship
                                                        </h5>
                                                        <div className="space-y-2">
                                                            <div className="text-white text-lg font-extrabold flex items-center">
                                                                Payable: <span className="text-amber-400 ml-2">7,500 CNY/Year</span>
                                                            </div>
                                                            <div className="text-blue-100/60 text-sm font-medium">
                                                                Hostel Fee: 9,600 CNY/Year
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 italic text-[11px] text-blue-200/40 text-center uppercase tracking-widest font-bold">
                                                    Subject to Annual Review & Performance
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'sspu' ? (
                                        <div className="space-y-6">
                                            {/* SSPU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    SSPU Full Scholarship Policy
                                                </h4>

                                                <div className="space-y-4">
                                                    {/* Tuition & Insurance */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 glass-morphism">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            100% Coverage
                                                        </h5>
                                                        <div className="space-y-2">
                                                            <p className="text-white text-lg font-extrabold">
                                                                Tuition: <span className="text-cyan-400">FREE</span>
                                                            </p>
                                                            <p className="text-white text-lg font-extrabold">
                                                                Insurance: <span className="text-cyan-400">FREE</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Hostel */}
                                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                                        <div className="flex justify-between items-center text-blue-100 font-bold">
                                                            <span>Hostel Fee</span>
                                                            <span className="text-amber-400">40 CNY/Day</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 italic text-[11px] text-blue-200/40 text-center uppercase tracking-widest font-bold">
                                                    Subject to Annual Review & Performance
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'hdu' ? (
                                        <div className="space-y-6">
                                            {/* HDU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    HDU Scholarship Policy
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* First Class */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 glass-morphism relative overflow-hidden group/card hover:bg-cyan-500/15 transition-all">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            First Class Scholarship
                                                        </h5>
                                                        <div className="space-y-2">
                                                            <div className="text-white text-lg font-extrabold flex items-center">
                                                                Tuition: <span className="text-cyan-400 ml-2">100% Free</span>
                                                            </div>
                                                            <div className="text-white text-lg font-extrabold flex items-center">
                                                                Hostel: <span className="text-cyan-400 ml-2">100% Free</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Second Class */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-cyan-400/30 transition-all group/card">
                                                        <h5 className="flex items-center text-blue-100 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2" />
                                                            Second Class Scholarship
                                                        </h5>
                                                        <div className="space-y-2">
                                                            <div className="text-white text-lg font-extrabold flex items-center">
                                                                Tuition: <span className="text-cyan-400 ml-2">100% Free</span>
                                                            </div>
                                                            <div className="text-blue-100/60 text-sm font-medium">
                                                                Hostel: Student Pays
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 italic text-[11px] text-blue-200/40 text-center uppercase tracking-widest font-bold">
                                                    University will review the scholarship every year
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'ncepu' ? (
                                        <div className="space-y-6">
                                            {/* NCEPU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    NCEPU Scholarship Policy
                                                </h4>

                                                <div className="space-y-4">
                                                    {/* Tuition */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 glass-morphism">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            Tuition Coverage
                                                        </h5>
                                                        <div className="space-y-2">
                                                            <p className="text-white text-lg font-extrabold">
                                                                Tuition Fee: <span className="text-cyan-400">100% FREE</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Hostel */}
                                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                                        <div className="flex justify-between items-center text-blue-100 font-bold">
                                                            <span>Hostel Fee</span>
                                                            <span className="text-amber-400">9,000 CNY/Year</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 italic text-[11px] text-blue-200/40 text-center uppercase tracking-widest font-bold">
                                                    Renewal depends on Academic Performance from Second Year
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'lyu' ? (
                                        <div className="space-y-6">
                                            {/* LYU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    LYU Scholarship Tiers
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {/* Tier 1 */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-400/20 glass-morphism relative overflow-hidden group/card">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-2 text-sm">
                                                            <Star className="w-3 h-3 mr-1 fill-cyan-400" />
                                                            1st Class
                                                        </h5>
                                                        <div className="text-white text-lg font-extrabold">
                                                            FREE
                                                        </div>
                                                        <div className="text-cyan-400/60 text-[10px] uppercase font-bold">Tuition</div>
                                                    </div>

                                                    {/* Tier 2 */}
                                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 group/card">
                                                        <h5 className="flex items-center text-blue-100 font-bold mb-2 text-sm">
                                                            <Star className="w-3 h-3 mr-1" />
                                                            2nd Class
                                                        </h5>
                                                        <div className="text-white text-lg font-extrabold">
                                                            4,000
                                                        </div>
                                                        <div className="text-blue-100/40 text-[10px] uppercase font-bold">CNY / Year</div>
                                                    </div>

                                                    {/* Tier 3 */}
                                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 group/card">
                                                        <h5 className="flex items-center text-blue-100 font-bold mb-2 text-sm">
                                                            <Star className="w-3 h-3 mr-1" />
                                                            3rd Class
                                                        </h5>
                                                        <div className="text-white text-lg font-extrabold">
                                                            7,000
                                                        </div>
                                                        <div className="text-blue-100/40 text-[10px] uppercase font-bold">CNY / Year</div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                                    <p className="text-amber-200 text-xs font-medium text-center">
                                                        <span className="font-bold">Bonus:</span> 2nd to 4th Year have a chance to get additional <span className="text-amber-400 font-bold">5,000 CNY/year</span> performance reward.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'hbust' ? (
                                        <div className="space-y-6">
                                            {/* HBUST Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    HBUST Financial Model
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Initial Cost */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 group/card">
                                                        <h5 className="flex items-center text-blue-100 font-bold mb-3">
                                                            Initial Fees (1st Year)
                                                        </h5>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-blue-100/60">Tuition</span>
                                                                <span className="text-white font-bold">4,900 CNY</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-blue-100/60">Hostel</span>
                                                                <span className="text-white font-bold">1,200 CNY</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Future Scholarship */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 glass-morphism relative overflow-hidden group/card">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            From 2nd Year
                                                        </h5>
                                                        <div className="text-white text-lg font-extrabold flex items-center">
                                                            Reward: <span className="text-cyan-400 ml-2">5,000 - 8,000 CNY</span>
                                                        </div>
                                                        <p className="text-[10px] text-cyan-200/60 mt-2 uppercase font-bold">Automatic Scholarship for all students</p>
                                                    </div>
                                                </div>

                                                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 italic text-[11px] text-blue-200/40 text-center uppercase tracking-widest font-bold">
                                                    One of the most affordable options in China
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'hcnu' ? (
                                        <div className="space-y-6">
                                            {/* HCNU Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    HCNU Scholarship Policy
                                                </h4>

                                                <div className="space-y-4">
                                                    {/* Base Cost */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 group/card">
                                                        <h5 className="flex items-center text-blue-100 font-bold mb-3">
                                                            Discounted Fees
                                                        </h5>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <span className="text-blue-100/60 text-[10px] uppercase font-bold">Tuition</span>
                                                                <p className="text-white font-extrabold">6,500 <span className="text-[10px] text-blue-100/40">CNY/Y</span></p>
                                                            </div>
                                                            <div className="space-y-1 text-right">
                                                                <span className="text-blue-100/60 text-[10px] uppercase font-bold">Hostel</span>
                                                                <p className="text-white font-extrabold">2,000 <span className="text-[10px] text-blue-100/40">CNY/Y</span></p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Excellence Reward */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 glass-morphism relative overflow-hidden group/card shadow-[0_0_20px_rgba(34,211,238,0.05)]">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            Excellence Bonus
                                                        </h5>
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-white text-lg font-extrabold">
                                                                Extra: <span className="text-cyan-400">+4,000 CNY</span>
                                                            </div>
                                                            <div className="text-[10px] text-cyan-200/60 font-bold text-right leading-tight">
                                                                FOR TOP TIER<br />PERFORMERS
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 italic text-[11px] text-blue-200/40 text-center uppercase tracking-widest font-bold">
                                                    Reward scholarship paid every year based on results
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'hafa' ? (
                                        <div className="space-y-6">
                                            {/* HAFA Scholarship Display */}
                                            <div className="bg-indigo-950/20 backdrop-blur-xl p-8 rounded-3xl border border-indigo-500/30 hover:bg-indigo-900/30 transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] overflow-hidden relative group/hafa">
                                                {/* Decorative background element */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover/hafa:bg-indigo-500/20 transition-colors" />

                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                                    <div className="space-y-2">
                                                        <h4 className="font-extrabold text-white text-2xl tracking-tight flex items-center">
                                                            <Palette className="w-6 h-6 text-indigo-400 mr-3" />
                                                            Artistic Excellence Scholarship
                                                        </h4>
                                                        <p className="text-indigo-200/60 text-sm font-medium">
                                                            Exclusive Scholarship for Fine Arts & Design Students
                                                        </p>
                                                    </div>

                                                    <div className="bg-indigo-500/20 px-6 py-3 rounded-2xl border border-indigo-400/30 text-center backdrop-blur-sm">
                                                        <div className="text-white text-3xl font-black tracking-tighter">75% OFF</div>
                                                        <div className="text-indigo-300 text-[10px] uppercase font-bold tracking-widest">Automatic Deduction</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                                    {/* Cost Card */}
                                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-indigo-500/30 transition-colors">
                                                        <h5 className="text-blue-100 font-bold mb-4 flex items-center text-sm">
                                                            <School className="w-4 h-4 mr-2" />
                                                            Post-Scholarship Fees
                                                        </h5>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                                                <span className="text-blue-100/40 text-xs">Tuition Fee</span>
                                                                <span className="text-white font-extrabold text-lg">7,500 <span className="text-xs font-normal opacity-40">CNY/Y</span></span>
                                                            </div>
                                                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                                                <span className="text-blue-100/40 text-xs">Hostel Fee</span>
                                                                <span className="text-white font-bold italic">2,000 - 3,000 <span className="text-xs font-normal opacity-40">CNY/Y</span></span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Nickname/Branding Card */}
                                                    <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/20 flex flex-col justify-center items-center text-center relative overflow-hidden group/magic">
                                                        <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover/magic:opacity-100 transition-opacity blur-xl" />
                                                        <Star className="w-8 h-8 text-amber-400 mb-3 animate-pulse" />
                                                        <h5 className="text-amber-200 font-black text-lg tracking-wide uppercase italic">
                                                            &quot;The Harry Potter School&quot;
                                                        </h5>
                                                        <p className="text-amber-100/40 text-[10px] uppercase font-bold tracking-widest mt-1">
                                                            Unique Gothic Architecture
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-8 pt-6 border-t border-indigo-500/20 text-center">
                                                    <p className="text-indigo-200/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                                                        Pass Exam + Regular Attendance = Continuous Scholarship
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'hut' ? (
                                        <div className="space-y-6">
                                            {/* HUT Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                                    <h4 className="font-extrabold text-white text-xl tracking-tight flex items-center">
                                                        <School className="w-5 h-5 text-emerald-400 mr-2" />
                                                        HUT Excellence Scholarship
                                                    </h4>
                                                    <div className="bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                                                        <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Performance Based</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                    {[
                                                        { label: 'Level 1', value: '15,000', color: 'text-emerald-400' },
                                                        { label: 'Level 2', value: '10,000', color: 'text-white' },
                                                        { label: 'Level 3', value: '5,000', color: 'text-white/60' },
                                                        { label: 'Level 4', value: '3,000', color: 'text-white/40' }
                                                    ].map((tier, i) => (
                                                        <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center group/tier hover:bg-white/10 transition-colors">
                                                            <div className="text-[9px] uppercase font-bold text-white/30 mb-1">{tier.label}</div>
                                                            <div className={`text-lg font-black ${tier.color}`}>{tier.value}</div>
                                                            <div className="text-[8px] text-white/20 uppercase font-bold">CNY / Year</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-8 space-y-4">
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                                                        <h5 className="text-blue-100 font-bold mb-3 flex items-center text-sm">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2" />
                                                            Standard Cost Structure
                                                        </h5>
                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div className="space-y-1">
                                                                <span className="text-blue-100/40 text-[10px] uppercase font-bold">Base Tuition</span>
                                                                <p className="text-white font-extrabold">7,000 <span className="text-[10px] text-blue-100/20 font-normal">CNY/Year</span></p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="text-blue-100/40 text-[10px] uppercase font-bold">Base Hostel</span>
                                                                <p className="text-white font-extrabold">3,000 <span className="text-[10px] text-blue-100/20 font-normal">CNY/Year</span></p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-3 px-2">
                                                        <Award className="w-4 h-4 text-emerald-400/60" />
                                                        <p className="text-blue-100/40 text-[10px] leading-relaxed italic">
                                                            * Excellent results holder will get extra scholarship based on their academic ranking.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (uni.slug === 'zzu' && activeTab === 'mbbs') ? (
                                        <div className="space-y-6">
                                            {/* ZZU MBBS Display */}
                                            <div className="bg-rose-950/20 backdrop-blur-xl p-8 rounded-3xl border border-rose-500/30 hover:bg-rose-900/30 transition-all hover:shadow-[0_0_40px_rgba(244,63,94,0.15)] relative overflow-hidden group/zzu">
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover/zzu:bg-rose-500/20 transition-colors" />

                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                                    <div className="space-y-2">
                                                        <h4 className="font-extrabold text-white text-2xl tracking-tight flex items-center">
                                                            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center mr-3">
                                                                <GraduationCap className="w-5 h-5 text-rose-400" />
                                                            </div>
                                                            Bachelor of Medicine (MBBS)
                                                        </h4>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex items-center text-rose-200/60 text-xs font-bold uppercase tracking-widest text-nowrap">
                                                                <Clock className="w-3 h-3 mr-1.5" />
                                                                MBBS (6 Years)
                                                            </div>
                                                            <div className="flex items-center text-rose-200/60 text-xs font-bold uppercase tracking-widest">
                                                                <Award className="w-3 h-3 mr-1.5" />
                                                                QS: 618 / Times: 601-800
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-rose-500/20 px-6 py-3 rounded-2xl border border-rose-400/30 text-center backdrop-blur-sm">
                                                        <div className="text-white text-3xl font-black tracking-tighter">36,000</div>
                                                        <div className="text-rose-300 text-[10px] uppercase font-bold tracking-widest">CNY / Annual Tuition</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                                    {/* Admissions Criteria Card */}
                                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 group-hover/zzu:border-rose-500/20 transition-colors">
                                                        <h5 className="text-rose-100 font-bold mb-4 flex items-center text-sm">
                                                            <Building2 className="w-4 h-4 mr-2 text-rose-400" />
                                                            Admissions Criteria
                                                        </h5>
                                                        <div className="space-y-3">
                                                            {[
                                                                "Requirements: HSC 4.50+",
                                                                "IELTS: 5.5 or DET: 95",
                                                                "CSCA Required",
                                                                "EFSET or MOI Acceptable"
                                                            ].map((req, rid) => (
                                                                <div key={rid} className="flex items-center text-[11px] text-rose-100/80 leading-tight">
                                                                    <Check className="w-3.5 h-3.5 mr-2 text-rose-400 flex-shrink-0" />
                                                                    {req}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Additional Info Card */}
                                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 group-hover/zzu:border-rose-500/20 transition-colors relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl -mr-12 -mt-12" />
                                                        <h5 className="text-rose-100 font-bold mb-4 flex items-center text-sm">
                                                            <AlertCircle className="w-4 h-4 mr-2 text-rose-400" />
                                                            Additional Info
                                                        </h5>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center text-xs">
                                                                <div className="flex items-center text-[11px] text-rose-100/80 leading-tight">
                                                                    <Clock className="w-3.5 h-3.5 mr-2 text-rose-400 flex-shrink-0" />
                                                                    Age Limit: 18-23
                                                                </div>
                                                                <span className="text-rose-200 text-[10px] font-bold uppercase tracking-wider">QS #618</span>
                                                            </div>
                                                            <div className="flex items-center text-[10px] text-rose-100/80 leading-tight">
                                                                <Calendar className="w-3.5 h-3.5 mr-2 text-rose-400 flex-shrink-0" />
                                                                Deadline: May 30th (Depends on Seats)
                                                            </div>
                                                            <div className="flex items-center text-[10px] text-rose-100/40 italic">
                                                                <Info className="w-3 h-3 mr-1.5" />
                                                                U.S. News Global: #203
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Requirement Highlights */}
                                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 group-hover/zzu:border-rose-500/20 transition-colors">
                                                        <h5 className="text-rose-100 font-bold mb-4 flex items-center text-sm">
                                                            <AlertCircle className="w-4 h-4 mr-2 text-rose-400" />
                                                            Admissions Criteria
                                                        </h5>
                                                        <ul className="space-y-2 text-[11px] text-rose-100/60">
                                                            <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-rose-400" /> HSC Score: 4.50+</li>
                                                            <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-rose-400" /> IELTS 5.5 / DET 95+</li>
                                                            <li className="flex items-center"><Check className="w-3 h-3 mr-2 text-rose-400" /> MOI or EFSET Accepted</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (uni.slug === 'ntu' && activeTab === 'mbbs') ? (
                                        <div className="space-y-6">
                                            {/* NTU Medical/Dental Display */}
                                            <div className="bg-blue-950/20 backdrop-blur-xl p-8 rounded-3xl border border-blue-500/30 hover:bg-blue-900/30 transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] relative overflow-hidden group/ntu">
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover/ntu:bg-blue-500/20 transition-colors" />

                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                                    <div className="space-y-2">
                                                        <h4 className="font-extrabold text-white text-2xl tracking-tight flex items-center">
                                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                                                <GraduationCap className="w-5 h-5 text-blue-400" />
                                                            </div>
                                                            Clinical Medicine & Dentistry
                                                        </h4>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex items-center text-blue-200/60 text-xs font-bold uppercase tracking-widest text-nowrap">
                                                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                                MBBS (6 Years) / BDS (5 Years)
                                                            </div>
                                                            <div className="flex items-center text-blue-200/60 text-xs font-bold uppercase tracking-widest">
                                                                <Award className="w-3 h-3 mr-1.5" />
                                                                QS: 851-900 / CWUR: 770
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-blue-500/20 px-6 py-3 rounded-2xl border border-blue-400/30 text-center backdrop-blur-sm">
                                                        <div className="text-white text-3xl font-black tracking-tighter">26,000</div>
                                                        <div className="text-blue-300 text-[10px] uppercase font-bold tracking-widest">CNY / Annual Tuition</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                                    {/* Key Info Card */}
                                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 group-hover/ntu:border-blue-500/20 transition-colors">
                                                        <h5 className="text-blue-100 font-bold mb-4 flex items-center text-sm">
                                                            <Building2 className="w-4 h-4 mr-2 text-blue-400" />
                                                            Admissions Criteria
                                                        </h5>
                                                        <div className="space-y-3">
                                                            {[
                                                                "Requirements: HSC 4.50+",
                                                                "IELTS: 5.5 or DET: 95",
                                                                "CSCA Required",
                                                                "EFSET or MOI Acceptable"
                                                            ].map((req, rid) => (
                                                                <div key={rid} className="flex items-center text-[11px] text-blue-100/80 leading-tight">
                                                                    <Check className="w-3.5 h-3.5 mr-2 text-blue-400 flex-shrink-0" />
                                                                    {req}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Additional Info Card */}
                                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 group-hover/ntu:border-blue-500/20 transition-colors relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-12 -mt-12" />
                                                        <h5 className="text-blue-100 font-bold mb-4 flex items-center text-sm">
                                                            <AlertCircle className="w-4 h-4 mr-2 text-blue-400" />
                                                            Admissions & Deposit
                                                        </h5>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center text-[11px] text-blue-100/80 leading-tight">
                                                                <Clock className="w-3.5 h-3.5 mr-2 text-blue-400 flex-shrink-0" />
                                                                Age Limit: 18-24
                                                            </div>
                                                            <div className="flex items-center text-[10px] text-blue-100/80 leading-tight">
                                                                <Calendar className="w-3.5 h-3.5 mr-2 text-blue-400 flex-shrink-0" />
                                                                Deadline: May 30th (Depends on Seats)
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                                            <p className="text-[10px] text-amber-200/90 leading-tight font-bold text-center italic">
                                                                [ Student have to deposit 2,600 CNY for getting JW202 ]
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-8 pt-6 border-t border-blue-500/20 flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                                        <span className="text-blue-200/40 text-[9px] font-bold uppercase tracking-widest leading-none">English Medium Enrollment Active</span>
                                                    </div>
                                                    <span className="text-blue-200/40 text-[9px] font-bold uppercase tracking-widest leading-none tracking-tight">Fall 2026 Intake</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (uni.slug === 'xzmu' && activeTab === 'mbbs') ? (
                                        <div className="space-y-6">
                                            {/* XZMU Medical Display */}
                                            <div className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 hover:border-blue-500/20 transition-all group/xzmu relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover/xzmu:bg-blue-500/10 transition-colors" />

                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                                    <div className="space-y-2">
                                                        <h4 className="font-extrabold text-white text-2xl tracking-tight flex items-center">
                                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 border border-blue-500/30 text-blue-400">
                                                                <Stethoscope className="w-5 h-5" />
                                                            </div>
                                                            Medical & Health Sciences
                                                        </h4>
                                                        <div className="flex flex-wrap items-center gap-4 ml-14">
                                                            <div className="flex items-center text-blue-200/60 text-[10px] font-bold uppercase tracking-widest text-nowrap">
                                                                <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                                                                MBBS (6 Years)
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                                            <div className="flex items-center text-blue-200/60 text-[10px] font-bold uppercase tracking-widest">
                                                                <Award className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                                                                Times: 1201-1500 / USN: 1463
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-blue-600/20 px-6 py-4 rounded-3xl border border-blue-400/30 text-center backdrop-blur-xl shadow-xl shadow-blue-900/20">
                                                        <div className="text-white text-3xl font-black tracking-tighter">28k-33k</div>
                                                        <div className="text-blue-300 text-[10px] uppercase font-bold tracking-widest mt-1">CNY / Annual Tuition</div>
                                                    </div>
                                                </div>

                                                {/* Scholarship Tables */}
                                                <div className="mt-10 space-y-8 relative z-10">
                                                    {/* First Year Scholarship */}
                                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10 relative overflow-hidden group/s1 hover:border-blue-500/30 transition-colors">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
                                                        <h5 className="text-cyan-400 font-black mb-6 flex items-center text-sm uppercase tracking-wider">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            First Year Scholarship Policy
                                                        </h5>
                                                        <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
                                                            <table className="w-full text-left border-collapse min-w-[500px]">
                                                                <thead>
                                                                    <tr className="border-b border-white/20 text-[11px] uppercase tracking-widest text-blue-200/50 font-black">
                                                                        <th className="py-3 pr-4">Tuition Fees</th>
                                                                        <th className="py-3 px-3 text-center">Type A (50%)</th>
                                                                        <th className="py-3 px-3 text-center">Type B (30%)</th>
                                                                        <th className="py-3 pl-3 text-center">Type C (20%)</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="text-[13px] font-bold text-white/90">
                                                                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                                        <td className="py-4 pr-4 text-blue-100">MBBS</td>
                                                                        <td className="py-4 px-3 text-center text-emerald-400 bg-emerald-500/5">100% FREE</td>
                                                                        <td className="py-4 px-3 text-center text-white/70 tracking-tight">16,500 CNY</td>
                                                                        <td className="py-4 pl-3 text-center text-white/70 tracking-tight">24,750 CNY</td>
                                                                    </tr>
                                                                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                                        <td className="py-4 pr-4 text-blue-100">Nursing</td>
                                                                        <td className="py-4 px-3 text-center text-emerald-400 bg-emerald-500/5">100% FREE</td>
                                                                        <td className="py-4 px-3 text-center text-white/70 tracking-tight">5,000 CNY</td>
                                                                        <td className="py-4 pl-3 text-center text-white/70 tracking-tight">10,000 CNY</td>
                                                                    </tr>
                                                                    <tr className="hover:bg-white/[0.02] transition-colors">
                                                                        <td className="py-4 pr-4 text-blue-200/80">Dental Surgery (BDS)</td>
                                                                        <td className="py-4 px-3 text-center text-white font-black">10,000 CNY<br /><span className="text-[10px] opacity-40 uppercase">(20%)</span></td>
                                                                        <td className="py-4 px-3 text-center text-white font-black">15,000 CNY<br /><span className="text-[10px] opacity-40 uppercase">(30%)</span></td>
                                                                        <td className="py-4 pl-3 text-center text-white font-black">20,000 CNY<br /><span className="text-[10px] opacity-40 uppercase">(40%)</span></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>

                                                    {/* Second Year Scholarship */}
                                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10 relative overflow-hidden group/s2 hover:border-indigo-500/30 transition-colors">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
                                                        <h5 className="text-indigo-400 font-black mb-6 flex items-center text-sm uppercase tracking-wider">
                                                            <Award className="w-4 h-4 mr-2" />
                                                            Second Year Scholarship & Onwards
                                                        </h5>
                                                        <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
                                                            <table className="w-full text-left border-collapse min-w-[500px]">
                                                                <thead>
                                                                    <tr className="border-b border-white/20 text-[11px] uppercase tracking-widest text-blue-200/50 font-black">
                                                                        <th className="py-3 pr-4">Fees</th>
                                                                        <th className="py-3 px-3 text-center">Value (MBBS/BDS)</th>
                                                                        <th className="py-3 pl-3 text-center">Value (Nursing)</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="text-[13px] font-bold text-white/90">
                                                                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                                        <td className="py-4 pr-4 text-blue-100/70">Jiangsu Govt. Scholarships</td>
                                                                        <td className="py-4 px-3 text-center text-emerald-400 uppercase">18,000 CNY/Year</td>
                                                                        <td className="py-4 pl-3 text-center text-emerald-400 uppercase">18,000 CNY/Year</td>
                                                                    </tr>
                                                                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                                        <td className="py-4 pr-4 text-blue-100/70">XZMU Academic scholarships</td>
                                                                        <td className="py-4 px-3 text-center text-blue-400">1,000 – 5,000 CNY</td>
                                                                        <td className="py-4 pl-3 text-center text-cyan-300">11,000 – 25,000 CNY</td>
                                                                    </tr>
                                                                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                                        <td className="py-4 pr-4 text-blue-100/70">Individual Scholarships</td>
                                                                        <td colSpan={2} className="py-4 text-center text-blue-100">100 – 3,000 CNY</td>
                                                                    </tr>
                                                                    <tr className="hover:bg-white/[0.02] transition-colors">
                                                                        <td className="py-4 pr-4 text-rose-300 font-extrabold flex items-center">
                                                                            Jiangsu Govt. Scholarships
                                                                            <span className="ml-2 text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-400 animate-pulse">ELITE</span>
                                                                        </td>
                                                                        <td colSpan={2} className="py-4 text-center text-rose-100 font-black text-lg drop-shadow-sm">
                                                                            50,000 / Year
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 relative z-10">
                                                    {/* Admissions Criteria Card */}
                                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 group-hover/xzmu:border-blue-500/20 transition-colors">
                                                        <h5 className="text-blue-100 font-extrabold mb-5 flex items-center text-sm tracking-tight">
                                                            <Building2 className="w-4 h-4 mr-2 text-blue-400" />
                                                            Admissions Criteria
                                                        </h5>
                                                        <div className="space-y-3">
                                                            {[
                                                                "Requirement: HSC 4.00+",
                                                                "IELTS: 5.5 or DET: 95",
                                                                "Professional Medical Background (Preferred)",
                                                                "HSC Results (Physics, Chemistry, Biology - High)"
                                                            ].map((req, rid) => (
                                                                <div key={rid} className="flex items-center text-[11px] text-blue-100/80 leading-tight">
                                                                    <Check className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
                                                                    {req}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Additional Info Card */}
                                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 group-hover/xzmu:border-blue-500/20 transition-colors relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-12 -mt-12" />
                                                        <h5 className="text-blue-100 font-extrabold mb-5 flex items-center text-sm tracking-tight">
                                                            <AlertCircle className="w-4 h-4 mr-2 text-blue-400" />
                                                            Admission Notes
                                                        </h5>
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                                                <div className="flex items-center text-[11px] text-blue-100/80 font-bold uppercase tracking-widest leading-none">
                                                                    <Clock className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
                                                                    Age Limit: 18-25
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center text-[10px] text-blue-100/80 leading-tight font-bold italic px-2">
                                                                <Calendar className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
                                                                Deadline: June 30th, 2026
                                                            </div>
                                                            <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                                                <p className="text-[10px] text-amber-200/90 leading-tight font-bold text-center italic">
                                                                    [ Student have to deposit 5,200 CNY for getting JW202 ]
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-10 pt-6 border-t border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                                                        <span className="text-blue-200/40 text-[10px] font-bold uppercase tracking-widest leading-none">Official Medical Center Enrollment</span>
                                                    </div>
                                                    <span className="text-blue-200/40 text-[10px] font-bold uppercase tracking-widest leading-none tracking-tight order-first md:order-last">Jiangsu Province, China</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (uni.slug === 'njit' && activeTab === 'masters') ? (
                                        <div className="space-y-6">
                                            {/* NJIT Masters Scholarship Display */}
                                            <div className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 hover:border-blue-500/20 transition-all group/njit relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover/njit:bg-blue-500/10 transition-colors" />

                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                                    <div className="space-y-2">
                                                        <h4 className="font-extrabold text-white text-2xl tracking-tight flex items-center">
                                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 border border-blue-500/30 text-blue-400">
                                                                <GraduationCap className="w-5 h-5" />
                                                            </div>
                                                            Engineering & Technology Masters
                                                        </h4>
                                                        <div className="flex flex-wrap items-center gap-4 ml-14">
                                                            <div className="flex items-center text-blue-200/60 text-[10px] font-bold uppercase tracking-widest text-nowrap">
                                                                <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                                                                Masters (3 Years)
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                                            <div className="flex items-center text-blue-200/60 text-[10px] font-bold uppercase tracking-widest">
                                                                <Award className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                                                                US.News: 1953
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-blue-600/20 px-6 py-4 rounded-3xl border border-blue-400/30 text-center backdrop-blur-xl shadow-xl shadow-blue-900/20">
                                                        <div className="text-white text-3xl font-black tracking-tighter">24,000</div>
                                                        <div className="text-blue-300 text-[10px] uppercase font-bold tracking-widest mt-1">CNY / Annual Tuition</div>
                                                    </div>
                                                </div>

                                                {/* NJIT Scholarship Table */}
                                                <div className="mt-10 bg-white/5 rounded-3xl p-6 border border-white/10 relative overflow-hidden group/s1 hover:border-cyan-500/30 transition-colors z-10">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
                                                    <h5 className="text-cyan-400 font-black mb-6 flex items-center text-sm uppercase tracking-wider">
                                                        <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                        NJIT Masters Scholarship Policy
                                                    </h5>
                                                    <div className="overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
                                                        <table className="w-full text-left border-collapse min-w-[600px]">
                                                            <thead>
                                                                <tr className="border-b border-white/20 text-[11px] uppercase tracking-widest text-blue-200/50 font-black">
                                                                    <th className="py-3 pr-4">Fees</th>
                                                                    <th className="py-3 px-3 text-center">Type A</th>
                                                                    <th className="py-3 px-3 text-center">Type B</th>
                                                                    <th className="py-3 pl-3 text-center">Type C</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="text-[13px] font-bold text-white/90">
                                                                <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                                    <td className="py-4 pr-4 text-blue-100">Tuition Fee</td>
                                                                    <td className="py-4 px-3 text-center text-emerald-400 bg-emerald-500/5">100% FREE</td>
                                                                    <td className="py-4 px-3 text-center text-emerald-400 bg-emerald-500/5">100% FREE</td>
                                                                    <td className="py-4 pl-3 text-center text-emerald-400 bg-emerald-500/5">100% FREE</td>
                                                                </tr>
                                                                <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                                    <td className="py-4 pr-4 text-blue-100">Insurance Fee</td>
                                                                    <td className="py-4 px-3 text-center text-emerald-400 bg-emerald-500/5">100% FREE</td>
                                                                    <td className="py-4 px-3 text-center text-emerald-400 bg-emerald-500/5">100% FREE</td>
                                                                    <td className="py-4 pl-3 text-center text-emerald-400 bg-emerald-500/5">100% FREE</td>
                                                                </tr>
                                                                <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                                    <td className="py-4 pr-4 text-blue-100">Accommodation Fee</td>
                                                                    <td className="py-4 px-3 text-center text-emerald-400 bg-emerald-500/5">100% FREE</td>
                                                                    <td className="py-4 px-3 text-center text-emerald-400 bg-emerald-500/5">100% FREE</td>
                                                                    <td className="py-4 pl-3 text-center text-emerald-400 bg-emerald-500/5">100% FREE</td>
                                                                </tr>
                                                                <tr className="hover:bg-white/[0.02] transition-colors">
                                                                    <td className="py-4 pr-4 text-blue-200/80">Stipend</td>
                                                                    <td className="py-4 px-3 text-center text-cyan-400 font-black tracking-widest bg-cyan-500/5 relative">
                                                                        <div className="absolute inset-x-0 -top-[1px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                                                                        1,000 CNY/Month
                                                                    </td>
                                                                    <td className="py-4 px-3 text-center text-blue-400 font-black">500 CNY/Month</td>
                                                                    <td className="py-4 pl-3 text-center text-white/50 font-black">300 CNY/Month</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 relative z-10">
                                                    {/* Admissions Criteria Card */}
                                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 group-hover/njit:border-blue-500/20 transition-colors">
                                                        <h5 className="text-blue-100 font-extrabold mb-5 flex items-center text-sm tracking-tight">
                                                            <Building2 className="w-4 h-4 mr-2 text-blue-400" />
                                                            Admissions Criteria
                                                        </h5>
                                                        <div className="space-y-3">
                                                            {[
                                                                "Requirement: Bachelor Degree",
                                                                "IELTS: 5.5 or DET: 95",
                                                                "Study Plan & Recommendation Letters",
                                                                "All scholarship winners must pass an annual review"
                                                            ].map((req, rid) => (
                                                                <div key={rid} className="flex items-center text-[11px] text-blue-100/80 leading-tight">
                                                                    <Check className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
                                                                    {req}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Additional Info Card */}
                                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 group-hover/njit:border-blue-500/20 transition-colors relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-12 -mt-12" />
                                                        <h5 className="text-blue-100 font-extrabold mb-5 flex items-center text-sm tracking-tight">
                                                            <AlertCircle className="w-4 h-4 mr-2 text-blue-400" />
                                                            Admission & Deposits
                                                        </h5>
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                                                <div className="flex items-center text-[11px] text-blue-100/80 font-bold uppercase tracking-widest leading-none">
                                                                    <Clock className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
                                                                    Age Limit: 18-35
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center text-[10px] text-blue-100/80 leading-tight font-bold italic px-2">
                                                                <Calendar className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
                                                                Deadline: June 30th, 2026
                                                            </div>
                                                            <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl relative overflow-hidden group">
                                                                <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
                                                                <p className="relative z-10 text-[11px] text-red-200/90 leading-tight font-bold text-center italic tracking-wide">
                                                                    <span className="block mb-1 text-red-400 uppercase tracking-widest text-[9px]">Mandatory Requirement</span>
                                                                    Enrollment Deposit: CNY 5,000 per person<br /><span className="text-[9px] opacity-70">(Refundable)</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-10 pt-6 border-t border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                                                        <span className="text-blue-200/40 text-[10px] font-bold uppercase tracking-widest leading-none">Engineering Masters Enrollment Active</span>
                                                    </div>
                                                    <span className="text-blue-200/40 text-[10px] font-bold uppercase tracking-widest leading-none tracking-tight order-first md:order-last">Jiangsu Province, China</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'njupt' ? (
                                        <div className="space-y-6">
                                            {/* NJUPT Scholarship Display */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    NJUPT International Students Scholarship
                                                </h4>

                                                <div className="space-y-4">
                                                    {/* Entrance / 1st Year */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/20 glass-morphism">
                                                        <h5 className="flex items-center text-cyan-300 font-bold mb-3">
                                                            <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                            1st Year: 100% FREE
                                                        </h5>
                                                        <p className="text-white text-lg font-extrabold uppercase tracking-tight">Guaranteed Entrance Waiver</p>
                                                    </div>

                                                    {/* Renewal Tiers */}
                                                    <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                                        <h5 className="text-sm font-bold text-white mb-4 flex items-center">
                                                            <Info className="w-3.5 h-3.5 mr-2 text-cyan-400" />
                                                            Renewal (From Year 2)
                                                        </h5>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 group hover:border-cyan-400/30 transition-colors">
                                                                <span className="text-blue-100 text-sm font-medium">Top 50% Students</span>
                                                                <span className="text-xs font-black text-cyan-400 uppercase">100% Free</span>
                                                            </div>
                                                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 group hover:border-blue-400/30 transition-colors">
                                                                <span className="text-blue-100 text-sm font-medium">Next 30% Students</span>
                                                                <span className="text-xs font-black text-blue-200 uppercase">Pay 6,000 CNY</span>
                                                            </div>
                                                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 group hover:border-blue-200/20 transition-colors">
                                                                <span className="text-blue-200/60 text-sm font-medium">Last 20% Students</span>
                                                                <span className="text-xs font-black text-blue-200/40 uppercase">Pay 11,500 CNY</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'jsnu' ? (
                                        <div className="space-y-6">
                                            {/* JSNU Scholarship Policy */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    Scholarship Policy
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Type A */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-cyan-400/20 hover:border-cyan-400/40 transition-colors text-white font-bold">
                                                        <Star className="w-4 h-4 mr-2 fill-cyan-400 inline" />
                                                        Type A Scholarship
                                                        <ul className="mt-4 space-y-3 font-medium">
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Tuition Fee: 100% Free</span>
                                                            </li>
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Hostel Fee: 1,500-3,000 CNY/Year</span>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    {/* Type B */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-cyan-400/30 transition-colors text-white font-bold">
                                                        <Star className="w-4 h-4 mr-2 fill-cyan-400 inline" />
                                                        Type B Scholarship
                                                        <ul className="mt-4 space-y-3 font-medium">
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Tuition Fee: 7,000 CNY/Year</span>
                                                            </li>
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Hostel Fee: 1,500-3,000 CNY/Year</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                                                    <p className="text-white font-extrabold text-sm italic tracking-tight">
                                                        &quot;All scholarship winners must pass an annual review.&quot;
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'cczu' ? (
                                        <div className="space-y-6">
                                            {/* CCZU Scholarship Policy */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    Scholarship Policy
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Type A */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-cyan-400/20 hover:border-cyan-400/40 transition-colors text-white font-bold">
                                                        <Star className="w-4 h-4 mr-2 fill-cyan-400 inline" />
                                                        Type A Scholarship
                                                        <ul className="mt-4 space-y-3 font-medium">
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Tuition Fee: 100% Free</span>
                                                            </li>
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Hostel Fee: 1,750 CNY/Year</span>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    {/* Type B */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-cyan-400/30 transition-colors text-white font-bold">
                                                        <Star className="w-4 h-4 mr-2 fill-cyan-400 inline" />
                                                        Type B Scholarship
                                                        <ul className="mt-4 space-y-3 font-medium">
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Tuition Fee: 5,000 CNY/Year</span>
                                                            </li>
                                                            <li className="flex items-start text-sm text-blue-50">
                                                                <Check className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                                                                <span>Hostel Fee: 1,750 CNY/Year</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                                                    <p className="text-white font-extrabold text-sm italic tracking-tight">
                                                        &quot;All scholarship winners must pass an annual review.&quot;
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'ctgu' ? (
                                        <div className="space-y-6">
                                            {/* CTGU Scholarship Policy */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    Hubei Provincial Government Scholarship
                                                </h4>

                                                <div className="bg-cyan-500/10 rounded-xl p-6 border border-cyan-400/20 glass-morphism">
                                                    <h5 className="flex items-center text-cyan-300 font-bold mb-4">
                                                        <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                        100% Tuition Fee Waiver
                                                    </h5>
                                                    <ul className="space-y-4">
                                                        <li className="flex items-center text-blue-50">
                                                            <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center mr-4">
                                                                <Check className="w-5 h-5 text-cyan-400" />
                                                            </div>
                                                            <span className="text-lg font-semibold text-white">Tuition Fee: <span className="text-cyan-300 ml-1">100% Free</span></span>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                                                    <p className="text-[13px] text-blue-100/70 leading-relaxed italic text-center">
                                                        &quot;All scholarship winners must pass an annual review. The level of scholarship will be adjusted according to academic performance.&quot;
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : uni.slug === 'cpu' ? (
                                        <div className="space-y-6">
                                            {/* CPU Scholarship Policy */}
                                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:shadow-lg">
                                                <h4 className="font-extrabold text-white mb-6 text-xl tracking-tight flex items-center">
                                                    <School className="w-5 h-5 text-cyan-400 mr-2" />
                                                    CPU President Scholarship
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Category 1 */}
                                                    <div className="bg-cyan-500/10 rounded-xl p-5 border border-cyan-400/30 glass-morphism">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <h5 className="flex items-center text-cyan-300 font-bold">
                                                                <Star className="w-4 h-4 mr-2 fill-cyan-400" />
                                                                Category 1
                                                            </h5>
                                                            <span className="text-[10px] font-bold px-2 py-1 bg-cyan-400/20 text-cyan-300 rounded-lg uppercase tracking-widest">Full Tuition</span>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <p className="text-white text-xl font-extrabold">Tuition: <span className="text-cyan-400">100% FREE</span></p>
                                                            <div className="pt-3 border-t border-white/10">
                                                                <p className="text-[10px] text-cyan-200/60 uppercase font-bold mb-1">Applicable Major:</p>
                                                                <p className="text-xs text-blue-50 font-medium">International Economics and Trade</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Category 2 */}
                                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-cyan-400/30 transition-all">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <h5 className="flex items-center text-blue-100 font-bold">
                                                                <Star className="w-4 h-4 mr-2" />
                                                                Category 2
                                                            </h5>
                                                            <span className="text-[10px] font-bold px-2 py-1 bg-white/10 text-blue-200 rounded-lg uppercase tracking-widest">Partial</span>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <p className="text-white text-xl font-extrabold">Tuition: <span className="text-amber-400">5,000 CNY/Year</span></p>
                                                            <div className="pt-3 border-t border-white/10">
                                                                <p className="text-[10px] text-blue-200/40 uppercase font-bold mb-1">Applicable Majors:</p>
                                                                <p className="text-xs text-blue-100/70 font-medium">Pharmacy, Clinical Pharmacy</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nanjing Government */}
                                                <div className="mt-6 bg-emerald-500/5 rounded-xl p-5 border border-emerald-400/10 hover:bg-emerald-500/10 transition-all group">
                                                    <h5 className="flex items-center text-emerald-300 font-bold tracking-tight mb-2">
                                                        <Trophy className="w-4 h-4 mr-2 text-emerald-400" />
                                                        Nanjing Government Scholarship
                                                    </h5>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-white text-lg font-extrabold">Reward: <span className="text-emerald-400">10,000 CNY</span></p>
                                                        <span className="text-[10px] text-emerald-200/40 font-bold italic">One-time payment</span>
                                                    </div>
                                                </div>

                                                <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-center">
                                                    <p className="text-white font-extrabold text-sm italic tracking-tight">
                                                        &quot;All scholarship winners must pass an annual review.&quot;
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {activeTab === 'mbbs' ? (
                                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center">
                                                    <Info className="w-8 h-8 text-blue-400 mx-auto mb-3 opacity-50" />
                                                    <p className="text-blue-100 font-bold text-lg mb-2">Program Details</p>
                                                    <p className="text-blue-100/40 text-sm leading-relaxed max-w-md mx-auto italic font-medium">
                                                        For details regarding admissions, specific medical requirements, and the official fee structure, please refer to the specialized sections below.
                                                    </p>
                                                </div>
                                            ) : (
                                                uni.scholarships?.map((sch, i) => (
                                                    <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                                                        <h4 className="font-bold text-white mb-1 text-lg">{sch.title}</h4>
                                                        {sch.amount && <p className="text-cyan-200 font-bold mb-2 text-base">{sch.amount}</p>}
                                                        <ul className="space-y-2 mb-2">
                                                            {sch.details.map((d, di) => (
                                                                <li key={di} className="text-[14px] text-blue-50 leading-relaxed flex items-start">
                                                                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-cyan-400 flex-shrink-0" />
                                                                    {d}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Programs Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-3xl p-7 md:p-10 shadow-sm border border-slate-100 relative overflow-hidden"
                        >
                            {/* Subtle background decoration */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                            <div className="flex items-center mb-8 pb-6 border-b border-slate-100 relative z-10">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 text-white shadow-lg shadow-blue-200 flex-shrink-0">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                        {(activeTab === 'mbbs' || activeTab === 'masters') ? 'Major List' : 'Available Majors'}
                                    </h2>
                                    <p className="text-[12px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">
                                        {(activeTab === 'mbbs' || activeTab === 'masters') ? 'English Medium' : 'Undergraduate Programs'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-2.5 relative z-10">
                                {activeProgram?.majors?.length > 0 ? (
                                    activeProgram.majors.map((major, i) => (
                                        <div key={i} className="flex items-center p-3.5 bg-slate-50/80 hover:bg-blue-50 rounded-xl transition-all group border border-transparent hover:border-blue-100">
                                            <div className="w-6 h-6 rounded-lg bg-blue-100 group-hover:bg-blue-500 flex items-center justify-center mr-3 flex-shrink-0 transition-colors">
                                                <ChevronRight className="w-3.5 h-3.5 text-blue-500 group-hover:text-white transition-colors" strokeWidth={3} />
                                            </div>
                                            <span className="text-slate-700 font-semibold group-hover:text-slate-900 transition-colors text-[14px] leading-snug">{major}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 font-medium italic col-span-2 text-center py-8 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200">
                                        No specific majors listed for this category yet.
                                    </p>
                                )}
                            </div>
                        </motion.div>

                        {/* Financials Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-3xl p-7 md:p-10 shadow-sm border border-slate-100 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-5 border-b border-slate-100 relative z-10 gap-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 text-white shadow-lg shadow-emerald-200 flex-shrink-0">
                                        <Wallet className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                            {(activeTab === 'mbbs' || activeTab === 'masters') ? 'Actual Fees' : 'Tuition & Fees'}
                                        </h2>
                                        <p className="text-[12px] font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">
                                            {(activeTab === 'mbbs' || activeTab === 'masters') ? 'Official Fee Structure' : 'Estimated Annual Costs'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden relative z-10 shadow-sm">
                                {/* Table Header Equivalent */}
                                <div className="hidden sm:grid sm:grid-cols-12 gap-4 bg-slate-50/80 border-b border-slate-200 px-6 py-4">
                                    <div className="col-span-1 text-xs font-bold text-slate-400 uppercase tracking-wider">No.</div>
                                    <div className="col-span-7 md:col-span-8 text-xs font-bold text-slate-500 uppercase tracking-wider">Fee Description</div>
                                    <div className="col-span-4 md:col-span-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount (CNY)</div>
                                </div>

                                {/* List Items */}
                                <div className="divide-y divide-slate-100">
                                    {(activeProgram?.fees || uni.fees)?.map((fee, i) => (
                                        <div key={i} className="group flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:items-center px-6 py-4 lg:py-5 hover:bg-slate-50/50 transition-colors">
                                            {/* Mobile: Number Top */}
                                            <div className="sm:hidden mb-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">Item {(i + 1).toString().padStart(2, '0')}</span>
                                            </div>

                                            {/* Desktop: Number Left */}
                                            <div className="hidden sm:block col-span-1">
                                                <span className="text-sm font-semibold text-slate-400">{(i + 1).toString().padStart(2, '0')}</span>
                                            </div>

                                            {/* Description */}
                                            <div className="col-span-7 md:col-span-8 pr-4">
                                                <div className="font-bold text-slate-700 text-[15px]">{fee.item}</div>
                                                {fee.notes && (
                                                    <div className="text-[13px] text-slate-500 mt-1 leading-snug">
                                                        {fee.notes}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Amount */}
                                            <div className="col-span-4 md:col-span-3 sm:text-right mt-3 sm:mt-0 xl:-mr-4">
                                                <span className="inline-flex items-center text-[15px] font-bold text-slate-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
                                                    {fee.cost}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Documents Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b border-slate-100/80 relative z-10 gap-4">
                                <div className="flex items-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-[1.25rem] flex items-center justify-center mr-6 text-indigo-600 border border-indigo-100/50 shadow-inner">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Required Documents</h2>
                                        <p className="text-[15px] font-medium text-slate-500 mt-1.5 flex items-center">
                                            <Check className="w-4 h-4 mr-1.5 text-indigo-400" />
                                            Checklist for your application package
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 inline-flex items-center self-start sm:self-auto">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</span>
                                    <span className="ml-2 text-sm font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded shadow-sm border border-indigo-100/50">Mandatory</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 relative z-10">
                                {[
                                    "Passport (Minimum 1 Year Validity)",
                                    "Recent Passport Size Photo",
                                    "Highest Degree Certificate",
                                    "Academic Transcript",
                                    "Foreign Physical Examination Form",
                                    "Language Proficiency Certificate (IELTS / TOEFL / MOI / Equivalent)",
                                    "Non-Criminal Record / Police Clearance Certificate",
                                    "Bank Statement (Minimum $5,000 Balance)",
                                    ...(activeTab === 'masters' ? ["Two Recommendation Letters (Masters & PhD)"] : []),
                                    ...(activeTab === 'bachelor' ? ["CSCA Transcript"] : []),
                                ].map((doc: string, i: number) => (
                                    <div key={i} className="flex items-center p-4 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/60 hover:border-indigo-200 transition-all duration-300 group shadow-sm hover:shadow-md cursor-default">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mr-5 group-hover:bg-indigo-500 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 flex-shrink-0 border border-slate-200 group-hover:border-transparent">
                                            <Check className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" strokeWidth={3} />
                                        </div>
                                        <span className="text-slate-600 font-semibold group-hover:text-slate-900 transition-colors text-[14px] leading-snug pr-2">
                                            {doc}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Sticky) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* 1. APPLY NOW FORM - Primary Call to Action */}
                        <div className="sticky top-28 space-y-6">

                            <div data-cta-form="true"><CTALeadForm universityName={uni.name} /></div>
                            <UniversityWhatsApp universityName={uni.name} className="w-full" />

                            {/* Notes Card */}
                            {uni.notes && uni.notes.length > 0 && (
                                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200/60 shadow-sm">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-amber-200">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-amber-900 text-base tracking-tight">Important Notes</h3>
                                            <p className="text-[11px] text-amber-600 font-bold uppercase tracking-widest">Read before applying</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        {uni.notes.map((note: string, i) => (
                                            <div key={i} className="flex items-start text-sm text-amber-900/80 font-medium leading-relaxed bg-white/70 p-3.5 rounded-xl border border-amber-100/60">
                                                <span className="mr-2.5 text-amber-500 font-black mt-0.5 flex-shrink-0">›</span>
                                                <span className="flex-1">{note}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div >
            </section >

            {/* ═══════════════════════════════════════════════════════════ */}
            {/*  STICKY MOBILE BOTTOM CTA BAR — lg:hidden                  */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                <div className="flex items-center gap-3 px-4 py-3">
                    {/* WhatsApp Button */}
                    <a
                        href={`https://wa.me/8801971277688?text=I'm interested in ${encodeURIComponent(uni.name)}. Please share more details.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 active:bg-emerald-600 text-white font-extrabold text-sm py-3.5 rounded-2xl transition-colors shadow-md shadow-emerald-200 active:scale-95"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.522 5.846L.057 24l6.376-1.668A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.37l-.359-.214-3.717.975.993-3.634-.234-.372A9.818 9.818 0 0112 2.182c5.422 0 9.818 4.396 9.818 9.818S17.422 21.818 12 21.818z" />
                        </svg>
                        WhatsApp
                    </a>

                    {/* Apply Now Button */}
                    <button
                        onClick={() => {
                            const form = document.querySelector('[data-cta-form]') as HTMLElement | null;
                            if (form) {
                                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            } else {
                                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                            }
                        }}
                        className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 active:from-blue-700 active:to-indigo-800 text-white font-extrabold text-sm py-3.5 rounded-2xl transition-all shadow-md shadow-blue-200 active:scale-95"
                    >
                        Apply Now — Free
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Spacer so sticky bar doesn't overlap content on mobile */}
            <div className="lg:hidden h-24" />
        </div >
    );
};

export default UniversityDetailClient;
