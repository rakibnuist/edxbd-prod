'use client';

import { Country } from '@/lib/countries';
import { motion } from 'framer-motion';
import {
    GraduationCap,
    Wallet,
    Building2,
    CheckCircle2,
    ArrowRight,
    FileText,
    Plane,
    Globe,
    Clock,
    School
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ConsultationButton from '@/components/ConsultationButton';

interface DestinationDetailClientProps {
    country: Country;
}

export default function DestinationDetailClient({ country }: DestinationDetailClientProps) {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    {country.images[0] ? (
                        <Image
                            src={country.images[0]}
                            alt={`Study in ${country.name}`}
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-900" />
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-900/90" />
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
                            <span className="text-2xl">{country.flag}</span>
                            <span className="text-sm font-semibold tracking-wider uppercase">Top Destination</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                            Study in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{country.name}</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                            {country.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ConsultationButton
                                text="Get Free Consultation"
                                source={`${country.slug}_hero`}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2"
                            />
                            <Link
                                href="#requirements"
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Check Requirements
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick Stats Bar */}
            <div className="relative z-20 -mt-16 container mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    <div className="flex flex-col items-center text-center p-2 border-r border-slate-100 last:border-0 md:last:border-r-0">
                        <Building2 className="w-8 h-8 text-blue-600 mb-3" />
                        <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Tuition</span>
                        <span className="text-slate-900 font-bold block">{country.costs.tuition.split(' ')[0]}</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-2 border-r border-slate-100 last:border-0 md:last:border-r-0">
                        <Wallet className="w-8 h-8 text-emerald-600 mb-3" />
                        <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Living Cost</span>
                        <span className="text-slate-900 font-bold block">{country.costs.living}</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-2 border-r border-slate-100 last:border-0 md:last:border-r-0">
                        <Clock className="w-8 h-8 text-amber-600 mb-3" />
                        <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Processing</span>
                        <span className="text-slate-900 font-bold block">3-4 Months</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-2">
                        <Globe className="w-8 h-8 text-indigo-600 mb-3" />
                        <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Intakes</span>
                        <span className="text-slate-900 font-bold block">Feb / Sep</span>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Main Detail */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Why Choose Section */}
                        <motion.section
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <StarIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900">Why Study in {country.name}?</h2>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {country.benefits.map((benefit, i) => (
                                    <motion.div
                                        key={i}
                                        variants={fadeIn}
                                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                                    >
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-2">{benefit}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">Experience world-class education with excellent opportunities for international students.</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Universities Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-indigo-100 rounded-xl">
                                    <School className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900">Top Universities</h2>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                                    {country.universities.map((uni, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 sm:border-0">
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl font-bold text-slate-400">
                                                {uni.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-slate-800">{uni}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Requirements Section */}
                        <section id="requirements">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-emerald-100 rounded-xl">
                                    <FileText className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900">Admission Requirements</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-0" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                                        <GraduationCap className="w-5 h-5 text-emerald-600" />
                                        Language Proficiency
                                    </h3>
                                    <ul className="space-y-3 relative z-10">
                                        {country.requirements.language.map((req, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-700">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-0" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Required Documents
                                    </h3>
                                    <div className="grid sm:grid-cols-2 gap-3 relative z-10">
                                        {country.requirements.documents.map((req, i) => (
                                            <div key={i} className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                                <span className="text-sm font-medium">{req}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] -z-0" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                                        <Plane className="w-5 h-5 text-amber-600" />
                                        Visa Requirements
                                    </h3>
                                    <ul className="space-y-3 relative z-10">
                                        {country.requirements.visa.map((req, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-700">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Consultation Card */}
                            <div className="bg-[#0A1A2F] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                                <h3 className="text-2xl font-bold mb-4 relative z-10">Free Assessment</h3>
                                <p className="text-slate-300 mb-8 relative z-10 text-sm leading-relaxed">
                                    Speak with our expert counselors to evaluate your profile and get scholarship guidance for {country.name}.
                                </p>

                                <ConsultationButton
                                    text="Book Free Call"
                                    source={`${country.slug}_sidebar`}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 relative z-10"
                                />

                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span>No Hidden Charges</span>
                                </div>
                            </div>

                            {/* Scholarships Card */}
                            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-amber-500" />
                                    Available Scholarships
                                </h3>
                                <div className="space-y-4">
                                    {country.scholarships.map((scholarship, i) => (
                                        <div key={i} className="flex gap-3 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                                            <span className="text-sm text-slate-600 font-medium leading-relaxed">{scholarship}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Need Help Card */}
                            <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                                <h3 className="font-bold text-blue-900 mb-2">Need Quick Help?</h3>
                                <p className="text-sm text-blue-700 mb-4">Chat with us on WhatsApp for instant replies.</p>
                                <a
                                    href="https://wa.me/+8801983333566"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-white text-blue-600 font-bold py-3 rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors"
                                >
                                    WhatsApp Now
                                </a>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Helper component for the Star icon since it's not exported by default from lucide-react in some versions or I missed it in import
function StarIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
