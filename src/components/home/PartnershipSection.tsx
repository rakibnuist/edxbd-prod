'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Handshake, Globe, Briefcase, Building2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';

const PartnershipSection = () => {
    return (
        <section className="py-24 relative z-10 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                < GlassCard className="p-0 border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-50/50 to-transparent rounded-full blur-3xl -z-10" />

                    <div className="grid lg:grid-cols-2 gap-0 relative z-10">

                        {/* Left Content */}
                        <div className="p-12 md:p-20 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-8">
                                    <Handshake className="w-4 h-4 text-orange-500" />
                                    <span className="text-orange-900 text-xs font-bold uppercase tracking-widest">B2B Partnership Program</span>
                                </div>

                                <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-slate-900 mb-6 leading-tight">
                                    Scale Your <br />
                                    Business <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Without Limits.</span>
                                </h2>

                                <p className="text-lg text-slate-600 mb-10 max-w-md leading-relaxed">
                                    Join our global network of educational agents and institutions. Access exclusive university contracts, high commission rates, and 24/7 processing support.
                                </p>

                                <div>
                                    <Link href="/partnership" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl group">
                                        Become a Partner <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Visual: Professional Image */}
                        <div className="relative min-h-[300px] md:min-h-[400px] lg:h-full flex items-center justify-center bg-slate-50/50 border-t lg:border-t-0 lg:border-l border-slate-100 overflow-hidden group order-first lg:order-last">
                            {/* Image Container */}
                            <div className="absolute inset-0 w-full h-full">
                                <Image
                                    src="/images/partnership.jpg"
                                    alt="Global Partnership"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                {/* Gradient Overlay for text readability/style */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent mix-blend-multiply" />
                            </div>

                            {/* Floating Stats/Badges for professional look */}
                            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-3 md:gap-4">
                                <GlassCard className="p-3 md:p-4 bg-white/10 backdrop-blur-md border-white/20 text-center md:text-left">
                                    <div className="text-xl md:text-2xl font-bold text-white mb-1">50+</div>
                                    <div className="text-blue-200 text-[10px] md:text-xs font-medium uppercase tracking-wider">Countries</div>
                                </GlassCard>
                                <GlassCard className="p-3 md:p-4 bg-white/10 backdrop-blur-md border-white/20 text-center md:text-left">
                                    <div className="text-xl md:text-2xl font-bold text-white mb-1">500+</div>
                                    <div className="text-blue-200 text-[10px] md:text-xs font-medium uppercase tracking-wider">Universities</div>
                                </GlassCard>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </section>
    );
};

export default PartnershipSection;
