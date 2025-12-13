'use client';

import { Testimonial } from '@/lib/types';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
}

const TestimonialsSection = ({ testimonials }: TestimonialsSectionProps) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!testimonials.length) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    if (!testimonials.length) return null;

    return (
        <section className="py-32 relative overflow-hidden bg-slate-50">
            {/* Background Image Removed */}

            <div className="container relative z-10 px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Featured Review Card (Carousel) */}
                    <div className="relative h-[400px]"> {/* Fixed height container to prevent layout shift */}
                        {/* Decorative background blobs */}
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                {/* The Card */}
                                <div className="relative bg-white p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 h-full flex flex-col justify-center">
                                    <Quote className="absolute top-10 right-10 w-20 h-20 text-slate-50 rotate-180" />

                                    <div className="flex items-center gap-4 mb-6 relative z-10">
                                        {/* Profile Image */}
                                        <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-white shadow-md overflow-hidden relative shrink-0">
                                            <Image
                                                src={testimonials[current].image || '/images/placeholder.jpg'}
                                                alt={testimonials[current].name}
                                                width={100}
                                                height={100}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900">{testimonials[current].name}</h4>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-slate-500 font-medium truncate max-w-[200px]">{testimonials[current].program}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 text-lg leading-relaxed relative z-10">
                                        "{testimonials[current].quote}"
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-slate-50">
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{testimonials[current].university}</p>
                                    </div>
                                </div>

                                {/* Stack Effect Cards - Only rendered once behind the active card */}
                                <div className="absolute top-4 left-4 w-full h-full bg-slate-50 rounded-[2rem] -z-10 shadow-sm border border-slate-100 transform rotate-2"></div>
                                <div className="absolute top-8 left-8 w-full h-full bg-slate-50 rounded-[2rem] -z-20 shadow-sm border border-slate-50 transform rotate-3"></div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right: Stats & CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:pl-10"
                    >
                        <h2 className="text-5xl font-bold text-slate-900 mb-8 font-heading">
                            What Our Students <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Say About Us</span>
                        </h2>

                        <div className="flex items-end gap-4 mb-6">
                            <span className="text-6xl font-black text-slate-900 leading-none">4.8</span>
                            <div className="pb-2">
                                <div className="flex text-amber-400 gap-1 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-6 h-6 fill-current" />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500 font-medium whitespace-nowrap">Average Rating</p>
                            </div>
                        </div>

                        <p className="text-slate-600 text-lg mb-10 max-w-md">
                            You can read more reviews from our students on our Google and Facebook pages. Don't forget to leave a review while you're there.
                        </p>

                        <button className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 group">
                            See More Reviews
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Carousel Indicators */}
                        <div className="flex gap-2 mt-8">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrent(idx)}
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === current ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-blue-400'}`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
