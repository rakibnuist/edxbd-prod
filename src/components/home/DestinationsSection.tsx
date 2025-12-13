'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { featuredCountries } from '@/lib/countries';
import { useState } from 'react';
import NextImage from 'next/image';

// Map countries to high-quality Unsplash images (Curated & Reliable)
// Map countries to high-quality Unsplash images (Curated & Reliable)
const countryImages: Record<string, string> = {
    'China': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2000&auto=format&fit=crop', // Great Wall
    'South Korea': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=2000&auto=format&fit=crop', // Seoul
    'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2000&auto=format&fit=crop', // London
    'Hungary': 'https://images.unsplash.com/photo-1516901632977-d141a38d469b?q=80&w=2000&auto=format&fit=crop', // Budapest
    'Finland': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2000&auto=format&fit=crop', // Northern Lights (Reliable)
    'Cyprus': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop', // Coast
    'Croatia': 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=2000&auto=format&fit=crop', // Dubrovnik (Standard)
    'Georgia': 'https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=2000&auto=format&fit=crop' // Mountains
};

// Fallback background colors if images fail to load
const countryColors: Record<string, string> = {
    'China': 'bg-red-800',
    'South Korea': 'bg-blue-900',
    'United Kingdom': 'bg-indigo-900',
    'Hungary': 'bg-green-800',
    'Finland': 'bg-sky-900',
    'Cyprus': 'bg-orange-800',
    'Croatia': 'bg-teal-800',
    'Georgia': 'bg-purple-900'
};

const DestinationsSection = () => {
    const [activeId, setActiveId] = useState<number>(0);

    return (
        <section className="py-24 lg:py-32 relative overflow-hidden bg-slate-50">
            {/* Background Image Removed for Visibility */}

            <div className="relative z-10">
                {/* Header */}
                <div className="container mx-auto px-4 mb-16 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold tracking-wide uppercase mb-4"
                    >
                        Global Network
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
                    >
                        {featuredCountries.length} Premium Study Destinations
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 max-w-2xl mx-auto"
                    >
                        Embark on a borderless educational journey. From the innovation hubs of Asia to the historic campuses of Europe, we connect your ambitions with world-class opportunities.
                    </motion.p>
                </div>

                {/* Accordion Container - Taller on mobile to fit content */}
                <div className="w-full h-[850px] lg:h-[700px] px-4">
                    <div className="max-w-[1400px] mx-auto h-full flex flex-col lg:flex-row gap-4">
                        {featuredCountries.map((country, index) => {
                            const isActive = activeId === index;
                            return (
                                <motion.div
                                    key={country.slug}
                                    layout
                                    onClick={() => setActiveId(index)}
                                    className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out shadow-lg
                                    ${isActive ? 'flex-[10] lg:flex-[3]' : 'flex-1'}
                                    h-full group
                                `}
                                >
                                    {/* Background Image */}
                                    <div className={`absolute inset-0 ${countryColors[country.name] || 'bg-slate-800'}`}>
                                        <NextImage
                                            src={countryImages[country.name] || countryImages['China']}
                                            alt={country.name}
                                            fill
                                            className={`object-cover transition-transform duration-700
                                            ${isActive ? 'scale-100' : 'scale-110 group-hover:scale-105 grayscale group-hover:grayscale-0'}
                                        `}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        {/* Overlay */}
                                        <div className={`absolute inset-0 transition-colors duration-500
                                        ${isActive ? 'bg-black/30' : 'bg-black/40 group-hover:bg-black/20'}
                                    `} />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-0 p-6 lg:p-10 flex flex-col justify-between z-10 text-white">

                                        {/* Top Label */}
                                        <div className={`transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-fit">
                                                <span className="text-2xl">{country.flag}</span>
                                                <span className="font-bold tracking-wide">{country.name}</span>
                                            </div>
                                        </div>

                                        {/* Bottom Content (Active) */}
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="space-y-6 bg-black/40 backdrop-blur-lg p-6 rounded-3xl border border-white/10"
                                            >
                                                <div>
                                                    <h3 className="text-3xl md:text-5xl font-bold mb-3">{country.name}</h3>
                                                    <p className="text-white/90 text-sm md:text-base max-w-xl line-clamp-2 md:line-clamp-none">
                                                        {country.description}
                                                    </p>
                                                </div>

                                                {/* Benefits List */}
                                                <div className="space-y-3">
                                                    {country.benefits?.slice(0, 3).map((benefit, i) => (
                                                        <div key={i} className="flex items-center gap-3">
                                                            <div className="p-1 rounded-full bg-green-500/20 text-green-400">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-sm md:text-base font-medium text-white/90">{benefit}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('openQuickForm')); }}
                                                    className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 group/btn"
                                                >
                                                    Start Your Application
                                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </motion.div>
                                        )}

                                        {/* Bottom Label (Inactive - Vertical Text on Desktop) */}
                                        {!isActive && (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:translate-y-0 lg:rotate-[-90deg]">
                                                <h3 className="text-2xl md:text-4xl font-bold text-white tracking-widest uppercase whitespace-nowrap drop-shadow-lg">
                                                    {country.name}
                                                </h3>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DestinationsSection;
