'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { featuredCountries } from '@/lib/countries';

const DestinationsSection = () => {
    // Duplicate countries for infinity scroll
    // Only duplicate if we have countries, otherwise empty array but featuredCountries should be imported.
    const marqueeCountries = [...featuredCountries, ...featuredCountries];

    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background Wash */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-indigo-600 font-black tracking-widest text-xs uppercase bg-indigo-50/50 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-200/50 shadow-sm">Global Opportunities</span>
                    <h2 className="text-4xl md:text-6xl font-heading font-black text-slate-900 mt-6 tracking-tight drop-shadow-lg">Top Destinations</h2>
                    <p className="text-slate-600 mt-6 max-w-xl mx-auto text-lg font-medium">Swipe through our most popular study destinations and find your perfect match.</p>
                </motion.div>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden py-10 group/marquee z-10">
                <div
                    className="flex gap-10 w-max animate-marquee-scroll hover:[animation-play-state:paused]"
                    style={{ width: "max-content", animationDuration: '60s' }}
                >
                    {marqueeCountries.map((country, i) => (
                        <motion.div
                            key={`${country.name}-${i}`}
                            whileHover={{ scale: 1.02, y: -10 }}
                            className="shrink-0 w-[85vw] sm:w-[350px] h-[520px] rounded-[3rem] overflow-hidden relative group cursor-pointer"
                        >
                            <GlassCard className="h-full !rounded-[3rem] border-opacity-80 bg-white/80 hover:bg-white/95 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                {/* Image Section (Top Half) */}
                                <div className="h-3/5 w-full relative overflow-hidden p-3">
                                    <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                                        {/* Gradient Placeholder */}
                                        <div className={`absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 mix-blend-multiply transition-transform duration-700 group-hover:scale-110`}></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-[10rem] opacity-20 select-none grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                                            {country.flag}
                                        </div>

                                        {/* Overlay tag */}
                                        <div className="absolute top-6 right-6 z-20">
                                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide bg-white/80 backdrop-blur-md shadow-sm border border-white/50 text-slate-800`}>
                                                Top Choice
                                            </span>
                                        </div>

                                        {/* Flag centered */}
                                        <div className="absolute bottom-6 left-8 z-20">
                                            <span className="text-7xl drop-shadow-xl filter">{country.flag}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section (Bottom Half) */}
                                <div className="h-2/5 px-8 pb-8 pt-2 flex flex-col relative z-10">
                                    <h3 className="text-3xl font-extrabold text-slate-900 mb-2 drop-shadow-sm">{country.name}</h3>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {country.scholarships[0] && (
                                            <span className="text-[10px] font-bold px-3 py-1.5 bg-amber-400/20 text-amber-900 border border-amber-400/20 rounded-lg uppercase tracking-wide backdrop-blur-sm">
                                                {country.scholarships[0].split(' ')[0]} Scholarship
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                                        {country.description}
                                    </p>

                                    <button
                                        className="mt-auto w-full py-4 bg-white/50 hover:bg-blue-600 hover:text-white text-slate-900 border border-white/60 font-bold rounded-2xl transition-all flex justify-center items-center gap-2 group/btn text-sm backdrop-blur-sm shadow-sm"
                                        onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('openQuickForm')); }}
                                    >
                                        View Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DestinationsSection;
