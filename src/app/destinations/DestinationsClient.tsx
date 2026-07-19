'use client';

import { Globe, ArrowRight, Building2, Wallet, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import ConsultationButton from '@/components/ConsultationButton';
import { activeCountries } from '@/lib/countries';
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
        <div className="min-h-screen bg-[#f4f8fa] text-[#08263c] font-sans">
            <PageHeader
                title="Study Abroad"
                highlight="Destinations"
                description="Compare ten active destination services through education fit, institution checks, clear costs and visa readiness. China is the flagship proof record."
                icon={<Globe />}
                badgeText="Global Opportunities"
            />

            {/* Countries Grid */}
            <section className="py-16 sm:py-24 relative overflow-hidden">
                <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {activeCountries.map((country) => (
                            <motion.div key={country.slug} variants={itemVariants} className="h-full">
                                <Link
                                    href={country.slug === 'china' ? '/destinations/china' : `/destinations/${country.slug}`}
                                    className="group relative bg-white border-2 border-[#08263c] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#174f7a] overflow-hidden flex flex-col h-full"
                                >
                                    {/* Card Header with Image and Flag */}
                                    <div className="relative h-52 overflow-hidden bg-[#08263c]">
                                        {country.images[0] && (
                                            <Image
                                                src={country.images[0]}
                                                alt={`Study in ${country.name}`}
                                                fill
                                                quality={75}
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#08263c] via-[#08263c]/40 to-transparent opacity-90" />

                                        {/* Service Status Badge */}
                                        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[#174f7a] px-3 py-1 text-[10px] font-mono font-black uppercase tracking-[0.18em] text-[#8ed0ee]">
                                            <span className="size-1.5 rounded-full bg-[#64b5df]" />
                                            {country.serviceStatus || 'Active'}
                                        </div>

                                        {/* Flag Badge */}
                                        <div className="absolute top-4 right-4 grid size-10 place-items-center bg-white/20 backdrop-blur-md text-2xl border border-white/30">
                                            {country.flag}
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h2 className="font-heading text-3xl font-bold text-white group-hover:text-[#8ed0ee] transition-colors">
                                                {country.name}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow relative z-10 bg-white">
                                        <p className="text-slate-700 mb-6 line-clamp-3 text-sm leading-6 font-medium">
                                            {country.description}
                                        </p>

                                        {/* Cost Snapshot Grid */}
                                        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[#174f7a]/15 pt-4 bg-[#f4f8fa] p-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-[#174f7a] font-mono text-[9px] font-black uppercase tracking-wider">
                                                    <Building2 className="w-3 h-3" />
                                                    <span>Tuition</span>
                                                </div>
                                                <p className="text-xs font-bold text-[#08263c] truncate" title={country.costs.tuition}>
                                                    {country.costs.tuition}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-[#174f7a] font-mono text-[9px] font-black uppercase tracking-wider">
                                                    <Wallet className="w-3 h-3" />
                                                    <span>Living</span>
                                                </div>
                                                <p className="text-xs font-bold text-[#08263c] truncate" title={country.costs.living}>
                                                    {country.costs.living}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Area */}
                                        <div className="mt-6 pt-4 border-t border-[#174f7a]/15 flex items-center justify-between group/btn">
                                            <span className="font-mono text-xs font-black uppercase tracking-wider text-[#174f7a] group-hover/btn:text-[#08263c] transition-colors">
                                                Inspect {country.name} Route
                                            </span>
                                            <div className="grid size-9 place-items-center bg-[#08263c] text-white transition-all group-hover/btn:bg-[#174f7a]">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Bring 01-03 CTA Banner */}
            <section className="bg-[#64b5df] px-5 py-16 text-[#08263c] sm:px-8 sm:py-24 md:py-32 lg:px-12">
                <div className="mx-auto max-w-[1440px]">
                    <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">
                        <div>
                            <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#174f7a]">Compare before you commit</p>
                            <h2 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">Inspect ten active destination routes with written fee schedules and visa readiness.</h2>
                        </div>
                        <Link href="/fees-and-transparency" className="inline-flex w-full items-center justify-center gap-3 bg-[#08263c] px-7 py-5 text-base font-black text-white hover:bg-[#174f7a] sm:text-lg lg:w-auto lg:min-w-64">
                            Calculate Clear Costs <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
