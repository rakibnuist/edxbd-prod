
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
            <div className="bg-slate-900 text-white min-h-[450px] relative overflow-hidden flex flex-col justify-center">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

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
                                {uni.badges?.map((badge, i) => (
                                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold border border-white/10 shadow-sm backdrop-blur-md">
                                        {badge}
                                    </span>
                                ))}
                                {/* Deadline Removed from here */}
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-4 text-white leading-tight">
                                {uni.name}
                            </h1>

                            <div className="flex items-center text-lg text-slate-300 mb-8 font-medium">
                                <MapPin className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
                                {uni.location}
                            </div>

                            {/* Key Stats Grid in Header */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                                {uni.rankings?.world && (
                                    <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1 group-hover:text-blue-200 transition-colors">World Rank</p>
                                        <p className="text-2xl font-bold text-white">#{uni.rankings?.world}</p>
                                    </div>
                                )}
                                {uni.rankings?.national && (
                                    <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1 group-hover:text-amber-200 transition-colors">National Rank</p>
                                        <p className="text-2xl font-bold text-white">#{uni.rankings?.national}</p>
                                    </div>
                                )}
                                <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1 group-hover:text-emerald-200 transition-colors">Tuition Start</p>
                                    <p className="text-xl font-bold text-emerald-400">{uni.details?.tuition?.split(' ')[0]}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Logo Card */}
                        {uni.logo && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex-shrink-0 relative group"
                            >
                                <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-2xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
                                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-[280px] h-[280px] flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                                    <img
                                        src={uni.logo}
                                        alt={`${uni.name} logo`}
                                        className="w-full h-full object-contain filter drop-shadow-lg"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <section className="container mx-auto px-6 -mt-10 pb-24 relative z-20">
                <div className="grid lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Main Information */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Quick Highlights Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center hover:border-indigo-300 transition-all hover:shadow-md group">
                                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="overflow-hidden">
                                    <span className="block text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mb-0.5">Degree</span>
                                    <span className="block text-base font-extrabold text-slate-900 truncate" title={uni.degree?.join(', ')}>{uni.degree?.join(', ')}</span>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center hover:border-pink-300 transition-all hover:shadow-md group">
                                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 border border-pink-100 group-hover:bg-pink-100 transition-colors">
                                    <Languages className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <span className="block text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mb-0.5">Language</span>
                                    <span className="block text-base font-extrabold text-slate-900">{uni.taught?.join(', ')}</span>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center hover:border-green-300 transition-all hover:shadow-md group">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 border border-green-100 group-hover:bg-green-100 transition-colors">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <span className="block text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mb-0.5">Intake</span>
                                    <span className="block text-base font-extrabold text-slate-900">{uni.intake?.join(', ')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Programs Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
                        >
                            <div className="flex items-center mb-6 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-4 text-blue-600">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-extrabold text-slate-900">Available Majors</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                {uni.details?.majors?.map((major, i) => (
                                    <div key={i} className="flex items-start p-4 bg-slate-50 hover:bg-white rounded-xl transition-all group border border-slate-100 hover:border-blue-200 hover:shadow-md">
                                        <CheckCircle className="w-4 h-4 text-blue-500 group-hover:text-blue-600 mr-3 mt-1 flex-shrink-0 transition-colors" />
                                        <span className="text-slate-800 font-bold group-hover:text-blue-800 transition-colors text-sm leading-relaxed">{major}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Financials Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
                        >
                            <div className="flex items-center mb-6 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mr-4 text-emerald-600">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-extrabold text-slate-900">Tuition & Fees</h2>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-2xl p-8 border border-emerald-800 mb-8 shadow-lg text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                <p className="text-emerald-200 font-bold text-xs uppercase tracking-wider mb-2 relative z-10">Annual Tuition</p>
                                <p className="text-4xl font-black text-white relative z-10 tracking-tight">{uni.details?.tuition}</p>

                                {uni.details?.tuitionDetails && (
                                    <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                                        <ul className="space-y-3">
                                            {uni.details?.tuitionDetails?.map((td, i) => (
                                                <li key={i} className="text-sm text-emerald-50 font-medium flex items-start">
                                                    <CheckCircle className="w-4 h-4 mr-3 text-emerald-400 mt-0.5" />
                                                    {td}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                {uni.fees?.map((fee, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-sm transition-all hover:shadow-md group">
                                        <div>
                                            <span className="text-slate-900 font-bold block text-lg group-hover:text-emerald-800 transition-colors">{fee.item}</span>
                                            {fee.notes && <span className="text-sm text-slate-500 font-semibold mt-1 block">{fee.notes}</span>}
                                        </div>
                                        <span className="text-slate-800 font-black bg-slate-50 px-4 py-2 rounded-lg mt-3 sm:mt-0 inline-block text-center border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all">{fee.cost}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Documents Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
                        >
                            <div className="flex items-center mb-6 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mr-4 text-indigo-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-extrabold text-slate-900">Required Documents</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {uni.documents?.map((doc, i) => (
                                    <div key={i} className="flex items-center p-4 bg-slate-50 hover:bg-indigo-50 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all hover:shadow-md group">
                                        <div className="w-2 h-2 bg-indigo-400 group-hover:bg-indigo-600 rounded-full mr-4 flex-shrink-0 transition-colors"></div>
                                        <span className="text-slate-700 font-bold group-hover:text-indigo-900 transition-colors">{doc}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Sticky) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* 1. APPLY NOW FORM - Primary Call to Action */}
                        <div className="sticky top-24 space-y-6">

                            {/* Deadline Card - Moved Here for Visibility */}
                            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Application Deadline</p>
                                        <p className="text-2xl font-black text-amber-400">{uni.deadlines?.application}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-amber-400 border border-white/10">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>

                            {/* Scholarship Card - HIGHLIGHTED - Moved to Top */}
                            <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/20 overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-4">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black tracking-wide text-white">SCHOLARSHIPS</h3>
                                            <span className="text-xs font-medium text-amber-100 bg-amber-700/30 px-2 py-0.5 rounded-full">Available Now</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {uni.scholarships?.map((sch, i) => (
                                            <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                                                <h4 className="font-bold text-white mb-1 text-lg">{sch.title}</h4>
                                                {sch.amount && <p className="text-amber-200 font-bold mb-2 text-base">{sch.amount}</p>}
                                                <ul className="space-y-2 mb-2">
                                                    {sch.details.map((d, di) => (
                                                        <li key={di} className="text-xs text-amber-50 leading-relaxed flex items-start">
                                                            <CheckCircle className="w-3 h-3 mr-1.5 mt-0.5 text-amber-300 flex-shrink-0" />
                                                            {d}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <CTALeadForm universityName={uni.name} />

                            <UniversityWhatsApp universityName={uni.name} className="w-full" />

                            {/* Notes Card */}
                            {uni.notes && uni.notes.length > 0 && (
                                <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <AlertCircle className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-bold text-blue-900">Important Notes</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {uni.notes.map((note, i) => (
                                            <div key={i} className="flex items-start text-xs text-blue-800/80 leading-relaxed">
                                                <span className="mr-2 opacity-50 mt-1">•</span>
                                                {note}
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
