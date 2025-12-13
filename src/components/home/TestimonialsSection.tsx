'use client';

import { Star, CheckCircle, MessageCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Testimonial } from '@/lib/types';

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
}

const TestimonialsSection = ({ testimonials }: TestimonialsSectionProps) => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center md:text-left mb-16">
                    <div className="inline-flex items-center gap-2 text-amber-600 font-bold tracking-widest text-sm uppercase mb-4 bg-amber-50/50 px-4 py-2 rounded-full border border-amber-100 backdrop-blur-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span>Student Success Stories</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-heading font-black text-slate-900 leading-tight drop-shadow-lg">
                        Don&apos;t just take our <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 text-glow-amber">word for it.</span>
                    </h2>
                </div>

                {/* Marquee Container */}
                <div className="relative w-full overflow-hidden py-10 -mx-4 px-4 min-h-[500px]">
                    {/* Gradient Masks */}
                    <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none"></div>

                    <div className="flex gap-8 w-max animate-marquee hover:[animation-play-state:paused]">
                        {[...testimonials, ...testimonials].map((t, i) => (
                            <div key={i} className="w-[85vw] md:w-[450px] shrink-0">
                                <GlassCard className="p-10 hover:border-blue-300/50 hover:bg-white/60 transition-all duration-300 group flex flex-col h-full rounded-[2.5rem]">
                                    {/* Verified Badge */}
                                    <div className="absolute top-8 right-8 flex items-center gap-1.5 px-3 py-1 bg-green-50/50 border border-green-200/50 rounded-full backdrop-blur-sm">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Verified</span>
                                    </div>

                                    {/* Quote Icon */}
                                    <div className="mb-8">
                                        <div className="w-14 h-14 bg-white/60 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 shadow-sm border border-white/50 transition-all duration-300">
                                            <MessageCircle className="w-6 h-6 opacity-80" />
                                        </div>
                                    </div>

                                    <blockquote className="text-xl text-slate-700 leading-relaxed font-semibold mb-8 flex-grow">
                                        &quot;{t.quote}&quot;
                                    </blockquote>

                                    <div className="flex items-center gap-4 mt-auto pt-8 border-t border-slate-900/5">
                                        <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center text-3xl border border-white shadow-sm overflow-hidden relative">
                                            <span className="relative z-10">{t.image}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-lg leading-tight group-hover:text-blue-700 transition-colors">{t.name}</div>
                                            <div className="text-sm text-slate-500 font-medium">{t.university}</div>
                                        </div>
                                        <div className="ml-auto flex text-amber-500 gap-0.5">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Badge Strip */}
                <div className="mt-16 pt-12 border-t border-slate-900/5 flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-60 mix-blend-multiply">
                    {['CSC Scholarship', 'British Council', 'Study In China', 'GKS Algebra', 'UniAssist'].map((badge, i) => (
                        <span key={i} className="text-lg font-bold text-slate-400 font-heading uppercase tracking-widest">{badge}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
