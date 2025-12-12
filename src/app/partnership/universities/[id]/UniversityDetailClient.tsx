
'use client';

import { motion } from 'framer-motion';
import {
    GraduationCap,
    MapPin,
    Trophy,
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
            <div className="bg-slate-900 text-white min-h-[400px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
                    <Link href="/partnership/universities" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors group">
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Universities
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                        <div className="max-w-3xl">
                            <div className="flex flex-wrap gap-3 mb-6">
                                {uni.badges?.map((badge, i) => (
                                    <span key={i} className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-600/30 text-blue-200 text-sm font-medium border border-blue-500/40 backdrop-blur-md shadow-sm">
                                        {badge}
                                    </span>
                                ))}
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium border border-amber-500/30 backdrop-blur-sm">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Deadline: {uni.deadlines.application}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 text-white leading-tight">
                                {uni.name}
                            </h1>

                            {uni.logo && (
                                <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-xl inline-block border border-white/20">
                                    <img src={uni.logo} alt={`${uni.name} logo`} className="h-24 w-auto object-contain" />
                                </div>
                            )}

                            <div className="flex items-center text-xl text-slate-300 mb-8">
                                <MapPin className="w-6 h-6 mr-2 text-blue-400 flex-shrink-0" />
                                {uni.location}
                            </div>

                            {/* Key Stats Grid in Header */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                {uni.rankings.world && (
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">World Rank</p>
                                        <p className="text-2xl font-bold text-white">#{uni.rankings.world}</p>
                                    </div>
                                )}
                                {uni.rankings.national && (
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">National Rank</p>
                                        <p className="text-2xl font-bold text-white">#{uni.rankings.national}</p>
                                    </div>
                                )}
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Tuition Start</p>
                                    <p className="text-xl font-bold text-emerald-400">{uni.details.tuition.split(' ')[0]}</p>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Only header image or graphic could go here */}
                    </div>
                </div>
            </div>

            <section className="container mx-auto px-6 -mt-10 pb-24 relative z-20">
                <div className="grid lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Main Information */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Quick Highlights Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div className="overflow-hidden">
                                    <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">Degree</span>
                                    <span className="block text-lg font-bold text-slate-900 truncate" title={uni.degree.join(', ')}>{uni.degree.join(', ')}</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                                <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                    <Languages className="w-6 h-6 text-pink-600" />
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">Language</span>
                                    <span className="block text-lg font-bold text-slate-900">{uni.taught.join(', ')}</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                    <Calendar className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">Intake</span>
                                    <span className="block text-lg font-bold text-slate-900">{uni.intake.join(', ')}</span>
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
                            <div className="flex items-center mb-8 pb-4 border-b border-slate-100">
                                <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
                                <h2 className="text-2xl font-bold text-slate-900">Available Majors</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                {uni.details.majors.map((major, i) => (
                                    <div key={i} className="flex items-start p-3 bg-slate-50 hover:bg-blue-50 rounded-xl transition-colors group">
                                        <CheckCircle className="w-5 h-5 text-blue-300 group-hover:text-blue-500 mr-3 mt-0.5 flex-shrink-0 transition-colors" />
                                        <span className="text-slate-700 font-medium group-hover:text-blue-700 transition-colors">{major}</span>
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
                            <div className="flex items-center mb-8 pb-4 border-b border-slate-100">
                                <Wallet className="w-6 h-6 mr-3 text-emerald-600" />
                                <h2 className="text-2xl font-bold text-slate-900">Tuition & Fees</h2>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 mb-8">
                                <p className="text-emerald-800 font-bold text-lg mb-1">Annual Tuition</p>
                                <p className="text-3xl font-black text-emerald-600">{uni.details.tuition}</p>
                                {uni.details.tuitionDetails && (
                                    <div className="mt-4 pt-4 border-t border-emerald-200/50">
                                        <ul className="space-y-2">
                                            {uni.details.tuitionDetails.map((td, i) => (
                                                <li key={i} className="text-sm text-emerald-700 flex items-start">
                                                    <span className="mr-2 opacity-50">•</span> {td}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                {uni.fees.map((fee, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-white">
                                        <div>
                                            <span className="text-slate-900 font-bold block">{fee.item}</span>
                                            {fee.notes && <span className="text-xs text-slate-400 font-medium">{fee.notes}</span>}
                                        </div>
                                        <span className="text-slate-700 font-bold bg-slate-50 px-3 py-1 rounded-lg mt-2 sm:mt-0 inline-block text-center">{fee.cost}</span>
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
                            <div className="flex items-center mb-8 pb-4 border-b border-slate-100">
                                <FileText className="w-6 h-6 mr-3 text-indigo-600" />
                                <h2 className="text-2xl font-bold text-slate-900">Required Documents</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {uni.documents.map((doc, i) => (
                                    <div key={i} className="flex items-center p-4 bg-indigo-50/30 rounded-xl border border-indigo-100/50">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3 flex-shrink-0"></div>
                                        <span className="text-slate-700 font-medium">{doc}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Sticky) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* 1. APPLY NOW FORM - Primary Call to Action */}
                        <div className="sticky top-24 space-y-6">
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
                                        {uni.scholarships.map((sch, i) => (
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
