const fs = require('fs');

const content = `
'use client';

import { motion } from 'framer-motion';
import {
    GraduationCap,
    MapPin,
    BookOpen,
    DollarSign,
    Calendar,
    FileText,
    CheckCircle,
    AlertCircle,
    Clock,
    Wallet,
    ArrowLeft,
    Languages,
    Globe,
    Trophy,
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

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Extended Header Background - Darker premium feel */}
            <div className="bg-gradient-to-br from-slate-950 via-[#0b1426] to-slate-900 text-white min-h-[500px] relative overflow-hidden flex flex-col justify-center border-b border-slate-800">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                {/* Background Logo Watermark for University Detail */}
                {uni.logo && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-[80%] opacity-[0.03] pointer-events-none select-none flex items-center justify-end z-0">
                        <img
                            src={uni.logo}
                            alt=""
                            className="h-full w-full object-contain object-right"
                        />
                    </div>
                )}

                <div className="container mx-auto px-6 pt-32 pb-12 relative z-10 w-full">
                    <Link href="/partnership/universities" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group bg-white/10 px-4 py-2 rounded-full backdrop-blur-md hover:bg-white/20 border border-white/10">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Universities
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                        {/* Left Side: Content */}
                        <div className="max-w-3xl flex-1">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {uni.badges?.filter(b => !b.toLowerCase().match(/rank|news|edu|qs/)).map((badge, i) => (
                                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold border border-white/10 shadow-sm backdrop-blur-md">
                                        {badge}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-4 text-white leading-tight drop-shadow-lg">
                                {uni.name}
                            </h1>

                            <div className="flex items-center text-lg text-slate-200 mb-8 font-medium drop-shadow-md">
                                <MapPin className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
                                {uni.location}
                            </div>

                            {/* Professional Rankings & Key Stats */}
                            <div className="mt-8 space-y-4">
                                {/* Global Rankings */}
                                {(uni.rankings?.world || uni.rankings?.national || (uni.badges && uni.badges.some(b => b.toLowerCase().match(/rank|news|edu|qs/)))) && (
                                    <div>
                                        <p className="text-blue-200/80 text-xs font-bold uppercase tracking-widest mb-3">Global Recognition</p>
                                        <div className="flex flex-wrap gap-3">
                                            {uni.rankings?.world && (
                                                <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 backdrop-blur-md border border-blue-400/20 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg shadow-blue-900/20 hover:border-blue-400/40 transition-colors">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                                                        <Globe className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-blue-200/70 uppercase font-bold tracking-wider">World Rank</p>
                                                        <p className="text-white font-black text-lg leading-tight">#{uni.rankings.world}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {uni.rankings?.national && (
                                                <div className="bg-gradient-to-r from-emerald-900/60 to-teal-900/60 backdrop-blur-md border border-emerald-400/20 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg shadow-emerald-900/20 hover:border-emerald-400/40 transition-colors">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                                                        <MapPin className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-emerald-200/70 uppercase font-bold tracking-wider">National Rank</p>
                                                        <p className="text-white font-black text-lg leading-tight">#{uni.rankings.national}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {uni.badges?.map((badge, i) => {
                                                const isRank = badge.toLowerCase().match(/rank|news|edu|qs/);
                                                if (isRank) {
                                                    const parts = badge.split(':');
                                                    const label = parts[0]?.trim();
                                                    const value = parts[1]?.trim() || '';
                                                    return (
                                                        <div key={\`rank-\${i}\`} className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 backdrop-blur-md border border-amber-400/20 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg shadow-amber-900/20 hover:border-amber-400/40 transition-colors">
                                                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300">
                                                                <Trophy className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-amber-200/70 uppercase font-bold tracking-wider">{label}</p>
                                                                <p className="text-white font-black text-lg leading-tight">{value.startsWith('#') ? value : \`#\${value}\`}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Base Stats */}
                                <div className="flex gap-3 pt-2">
                                    {uni.details?.tuition && (
                                        <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                                                <Wallet className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Tuition</p>
                                                <p className="text-white font-bold">{uni.details.tuition.split(' ')[0]}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Visuals & Deadline */}
                        <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto mt-8 lg:mt-0">
                            {/* Logo Card */}
                            {uni.logo ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex-shrink-0 relative group"
                                >
                                    <div className="absolute inset-0 bg-blue-500/20 rounded-[2.5rem] blur-2xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
                                    <div className="relative bg-white border border-slate-100 p-8 rounded-[2rem] shadow-2xl w-[260px] h-[260px] md:w-[320px] md:h-[320px] flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300 overflow-hidden">
                                        <img
                                            src={uni.logo}
                                            alt={\`\${uni.name} logo\`}
                                            className="w-full h-full object-contain filter hover:brightness-105 transition-all drop-shadow-sm"
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex-shrink-0 hidden lg:flex relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] items-center justify-center bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10">
                                    <GraduationCap className="w-24 h-24 text-white/20" />
                                </div>
                            )}

                            {/* Application Deadline */}
                            {uni.deadlines?.application && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="w-full md:w-[320px] flex items-center gap-4 bg-white/10 backdrop-blur-xl px-5 py-4 rounded-2xl border border-white/20 shadow-2xl group hover:bg-white/15 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/30 group-hover:bg-amber-500/30 transition-colors flex-shrink-0">
                                        <Clock className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-amber-200/80 font-bold uppercase tracking-widest mb-0.5">Application Deadline</p>
                                        <p className="text-white font-black text-sm tracking-tight leading-tight">{uni.deadlines.application}</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <section className="container mx-auto px-6 -mt-10 pb-24 relative z-20">
                <div className="grid lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Main Information */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Quick Highlights Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center group transition-all"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl flex items-center justify-center mr-5 flex-shrink-0 border border-indigo-100/50 group-hover:scale-110 transition-transform">
                                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div className="overflow-hidden">
                                    <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">Degree</span>
                                    <span className="block text-lg font-black text-slate-900 truncate" title={uni.degree?.join(', ')}>{uni.degree?.join(', ')}</span>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -4 }}
                                className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center group transition-all"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl flex items-center justify-center mr-5 flex-shrink-0 border border-pink-100/50 group-hover:scale-110 transition-transform">
                                    <Languages className="w-6 h-6 text-pink-600" />
                                </div>
                                <div>
                                    <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">Language</span>
                                    <span className="block text-lg font-black text-slate-900">{uni.taught?.join(', ')}</span>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -4 }}
                                className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center group transition-all"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl flex items-center justify-center mr-5 flex-shrink-0 border border-green-100/50 group-hover:scale-110 transition-transform">
                                    <Calendar className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">Intake</span>
                                    <span className="block text-lg font-black text-slate-900">{uni.intake?.join(', ')}</span>
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
                                                <DollarSign className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black tracking-tight text-white mb-0.5">Scholarships</h3>
                                                <div className="flex items-center bg-white/20 px-3 py-1 rounded-full w-fit">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mr-2 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse"></span>
                                                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">Highly Recommended</span>
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
                                    ) : (
                                        <div className="space-y-6">
                                            {uni.scholarships?.map((sch, i) => (
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
                                            ))}
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
                            className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
                        >
                            <div className="flex items-center mb-8 pb-6 border-b border-slate-100/80">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl flex items-center justify-center mr-5 text-blue-600 border border-blue-100/50">
                                    <BookOpen className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Available Majors</h2>
                                    <p className="text-sm font-medium text-slate-500 mt-1">Undergraduate programs offered</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                {uni.details?.majors?.map((major, i) => (
                                    <div key={i} className="flex items-start p-4 bg-slate-50/50 hover:bg-blue-50/30 rounded-2xl transition-all group border border-transparent hover:border-blue-100 hover:shadow-[0_4px_20px_rgb(59,130,246,0.05)]">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 group-hover:bg-blue-600 transition-all flex-shrink-0">
                                            <div className="w-2 h-2 bg-blue-600 group-hover:bg-white rounded-full transition-colors"></div>
                                        </div>
                                        <span className="text-slate-700 font-semibold group-hover:text-slate-900 transition-colors text-[15px] leading-relaxed">{major}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Financials Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
                        >
                            <div className="flex items-center mb-8 pb-6 border-b border-slate-100/80">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl flex items-center justify-center mr-5 text-emerald-600 border border-emerald-100/50">
                                    <Wallet className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tuition & Fees</h2>
                                    <p className="text-sm font-medium text-slate-500 mt-1">Estimated annual costs</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {uni.fees?.map((fee, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center p-6 rounded-2xl border border-slate-100 hover:border-emerald-100 bg-white shadow-sm transition-all hover:shadow-[0_8px_30px_rgb(16,185,129,0.05)] group">
                                        <div>
                                            <span className="text-slate-900 font-bold block text-lg group-hover:text-emerald-800 transition-colors">{fee.item}</span>
                                            {fee.notes && <span className="text-sm text-slate-500 font-medium mt-1.5 block">{fee.notes}</span>}
                                        </div>
                                        <span className="text-slate-800 font-black bg-slate-50 px-5 py-2.5 rounded-xl mt-4 sm:mt-0 inline-block text-center border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all text-[15px]">{fee.cost}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Documents Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
                        >
                            <div className="flex items-center mb-8 pb-6 border-b border-slate-100/80">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl flex items-center justify-center mr-5 text-indigo-600 border border-indigo-100/50">
                                    <FileText className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Required Documents</h2>
                                    <p className="text-sm font-medium text-slate-500 mt-1">Checklist for your application package</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    "Passport",
                                    "Picture",
                                    "Higher Secondary School /Grade 12th /A Level/ High School Certificate",
                                    "Higher Secondary School /Grade 12th /A Level/ High School Transcript",
                                    "Foreign Physical Medical Exemination Form",
                                    "English Proficiency Certificate (IELTS or TOFEL and Duolingo or any other valid English Certificate)",
                                    "Non Criminal Record / Police Clearance",
                                    "Bank Statement (5000$)",
                                    "Study Plan",
                                    "Application Form (If Required)",
                                    "China Scholastic Competency Assessment (CSCA) Exam Score Report (If Required)"
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-start p-5 bg-slate-50/50 hover:bg-white rounded-2xl border border-transparent hover:border-indigo-100 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/5 group">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-4 mt-0.5 group-hover:scale-110 group-hover:bg-indigo-600 transition-all flex-shrink-0">
                                            <div className="w-2 h-2 bg-indigo-600 group-hover:bg-white rounded-full transition-colors"></div>
                                        </div>
                                        <span className="text-slate-700 font-semibold group-hover:text-slate-900 transition-colors text-[15px] leading-relaxed">{doc}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Sticky) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* 1. APPLY NOW FORM - Primary Call to Action */}
                        <div className="sticky top-28 space-y-6">

                            <CTALeadForm universityName={uni.name} />
                            <UniversityWhatsApp universityName={uni.name} className="w-full" />

                            {/* Notes Card */}
                            {uni.notes && uni.notes.length > 0 && (
                                <div className="bg-blue-50/50 rounded-3xl p-6 md:p-8 border border-blue-100/60 shadow-inner">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-extrabold text-blue-900 text-lg tracking-tight">Important Notes</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {uni.notes.map((note, i) => (
                                            <div key={i} className="flex items-start text-sm text-blue-900/70 font-medium leading-relaxed bg-white/50 p-3 rounded-xl border border-blue-100/30">
                                                <span className="mr-3 text-blue-400 mt-1 flex-shrink-0">•</span>
                                                <span className="flex-1">{note}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UniversityDetailClient;
`;

fs.writeFileSync('src/app/partnership/universities/[id]/UniversityDetailClient.tsx', content);

