'use client';

import { Globe, ArrowRight, Building2, Wallet, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import ConsultationButton from '@/components/ConsultationButton';
import { countries } from '@/lib/countries';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const
        }
    }
};

export default function DestinationsClient() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <PageHeader
                title="Study Abroad"
                highlight="Destinations"
                description="Explore top global education hubs. From the UK's prestige to Finland's innovation, find the perfect destination for your academic journey."
                icon={<Globe />}
                badgeText="Global Opportunities"
            />

            {/* Countries Grid */}
            <section className="py-24 relative overflow-hidden">
                {/* Dynamic Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-100/40 to-orange-100/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {countries.map((country) => (
                            <motion.div key={country.slug} variants={itemVariants} className="h-full">
                                <Link
                                    href={country.slug === 'china' ? '/destinations/china' : `/destinations/${country.slug}`}
                                    className="group relative bg-white rounded-[2rem] border border-slate-200 hover:border-blue-400/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 overflow-hidden flex flex-col h-full"
                                >
                                    {/* Card Header with Image and Flag */}
                                    <div className="relative h-56 overflow-hidden bg-slate-900">
                                        {country.images[0] && (
                                            <Image
                                                src={country.images[0]}
                                                alt={`Study in ${country.name}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />

                                        {/* Flag Badge */}
                                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-lg">
                                            {country.flag}
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h2 className="text-3xl font-bold text-white group-hover:text-blue-200 transition-colors drop-shadow-md">
                                                {country.name}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="p-8 pt-6 flex flex-col flex-grow relative z-10 bg-white">
                                        <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed text-base font-medium">
                                            {country.description}
                                        </p>

                                        {/* Simplified Key Features - Only showing top universities for brevity and impact */}
                                        <div className="space-y-6 mt-auto">


                                            {/* Cost Snapshot */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                                                        <Building2 className="w-3 h-3" />
                                                        <span>Tuition</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-800 truncate" title={country.costs.tuition}>
                                                        {country.costs.tuition}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                                                        <Wallet className="w-3 h-3" />
                                                        <span>Living</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-800 truncate" title={country.costs.living}>
                                                        {country.costs.living}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Area */}
                                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between group/btn">
                                            <span className="text-sm font-bold text-slate-500 group-hover/btn:text-blue-600 transition-colors">
                                                Explore details
                                            </span>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 group-hover/btn:bg-blue-600 group-hover/btn:border-blue-600 transition-all duration-300 shadow-sm group-hover/btn:scale-110">
                                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Premium CTA Section */}
            <section className="py-32 relative overflow-hidden bg-[#0A1A2F]">
                {/* Abstract Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[128px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[128px]" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-white tracking-tight leading-tight">
                                Your Global Future <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Starts Here</span>
                            </h2>
                            <p className="text-xl md:text-2xl mb-12 text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                Don't let paperwork hold you back. We handle the complexity so you can focus on your dreams.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <ConsultationButton
                                    text="Get Free Consultation"
                                    source="destinations_page_cta_primary"
                                    className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] hover:-translate-y-1"
                                />
                                <Link
                                    href="/contact"
                                    className="w-full sm:w-auto px-10 py-5 bg-transparent border border-slate-700 hover:border-slate-500 text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-slate-800/50"
                                >
                                    Contact Support
                                </Link>
                            </div>

                            {/* Trust Signals */}
                            <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6 text-slate-400 font-medium text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span>98% Visa Success Rate</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span>500+ Partner Universities</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span>Free Scholarship Support</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
