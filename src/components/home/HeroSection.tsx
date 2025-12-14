'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star, Users, Send } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { activeCountries } from '@/lib/countries';

// Map countries to high-quality Unsplash images (Consistent with DestinationsSection)
const countryImages: Record<string, string> = {
    'China': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2000&auto=format&fit=crop', // Great Wall
    'South Korea': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=2000&auto=format&fit=crop', // Seoul
    'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2000&auto=format&fit=crop', // London
    'Hungary': 'https://images.unsplash.com/photo-1516901632977-d141a38d469b?q=80&w=2000&auto=format&fit=crop', // Budapest
    'Finland': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2000&auto=format&fit=crop', // Northern Lights
    'Cyprus': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop', // Sturdy fallback (Cyprus Coast)
    'Croatia': 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=2000&auto=format&fit=crop', // (No change)
    'Georgia': 'https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=2000&auto=format&fit=crop', // Mountains
    'Malaysia': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000&auto=format&fit=crop' // Iconic Petronas (Stable)
};

// Slide Data
const SLIDES = activeCountries.map((country, index) => ({
    id: index + 1,
    title: `Study in ${country.name}`,
    subtitle: country.description,
    link: `/destinations/${country.slug}`,
    image: countryImages[country.name] || countryImages['China'] // Fallback
}));

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center bg-blue-50">
            {/* Background Image Removed */}

            {/* Aurora Background Effect Container (Clipped) */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-40 left-20 w-96 h-96 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* --- SPLIT CONTENT --- */}
            <div className="relative z-10 flex-grow container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-24 pb-12 lg:pt-32 lg:pb-40">

                {/* LEFT: Text Content */}
                <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 order-2 lg:order-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 30, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 mb-6 w-fit mx-auto lg:mx-0 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                                <span className="text-sm font-bold text-green-800 uppercase tracking-wide">Accepting Applications</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight text-slate-900">
                                {SLIDES[currentSlide].title}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 font-medium mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                {SLIDES[currentSlide].subtitle}. Start your journey with expert guidance and secured scholarships.
                            </p>

                            <div className="flex justify-center lg:justify-start">
                                <Link
                                    href={SLIDES[currentSlide].link}
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                                >
                                    Start Your Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* RIGHT: Human Element (Man Touch) - Now Visible! */}
                <div className="relative h-[450px] lg:h-[550px] order-1 lg:order-2 flex items-center justify-center">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative w-full max-w-[400px] lg:max-w-[450px] h-full"
                    >
                        {/* Decorative Blob Background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-[3rem] rotate-3 opacity-80 transform scale-95 shadow-2xl" />

                        {/* Main Image Container */}
                        <div className="absolute inset-0 bg-white rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src={SLIDES[currentSlide].image}
                                        alt={SLIDES[currentSlide].title}
                                        fill
                                        priority={true}
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Floating "Trust" Badge 1: Visa Success */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -left-4 lg:-left-16 top-16 lg:top-20 bg-white p-3 lg:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-lg lg:text-xl font-bold text-slate-900">98%</div>
                                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Visa Success</div>
                            </div>
                        </motion.div>

                        {/* Floating "Trust" Badge 2: Scholarship */}
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                            className="absolute -right-4 lg:-right-12 bottom-28 lg:bottom-32 bg-white p-3 lg:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                <Star className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <div className="text-lg lg:text-xl font-bold text-slate-900">$5M+</div>
                                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Scholarships</div>
                            </div>
                        </motion.div>

                        {/* Floating "Trust" Badge 3: Support */}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2"
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-blue-400 border-2 border-blue-600" />
                                ))}
                            </div>
                            <span className="text-sm font-bold">24/7 Support</span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* --- NAVIGATION ARROWS (Corner) --- */}
            <div className="absolute right-4 lg:right-8 bottom-48 lg:bottom-16 flex gap-2 z-20">
                <button
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                    className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-md active:scale-95 touch-manipulation"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={nextSlide}
                    aria-label="Next Slide"
                    className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-md active:scale-95 touch-manipulation"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {/* --- THREE CARDS SECTION (Overlapping Bottom) --- */}
            <div className="absolute bottom-0 left-0 w-full translate-y-1/2 z-30 px-4 hidden lg:block">
                <div className="container mx-auto grid grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-xl p-8 text-center flex flex-col items-center h-full min-h-[220px] justify-center border-b-4 border-blue-600"
                    >
                        <div className="bg-blue-50 p-3 rounded-full mb-4">
                            <Star className="w-8 h-8 text-blue-600 fill-current" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Up to 100% Scholarship</h3>
                        <p className="text-slate-600 text-sm">
                            You could be eligible for a scholarship, grant or funding
                        </p>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-xl p-8 text-center flex flex-col items-center h-full min-h-[220px] justify-center border-b-4 border-amber-500"
                    >
                        <div className="bg-amber-50 p-3 rounded-full mb-4">
                            <Users className="w-8 h-8 text-amber-500 fill-current" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Free Consultations</h3>
                        <p className="text-slate-600 text-sm">
                            Book a FREE appointment and consult to find your path
                        </p>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-xl p-8 text-center flex flex-col items-center h-full min-h-[220px] justify-center border-b-4 border-gray-800"
                    >
                        <div className="bg-gray-100 p-3 rounded-full mb-4">
                            <Send className="w-8 h-8 text-gray-800 fill-current" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">7 Years of Experience</h3>
                        <p className="text-slate-600 text-sm">
                            Successfully helping students achieve their dreams
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Mobile View Cards (Stacked below hero basically) - 
                Actually, to maintain structure, we might want to just let them be 
                below the hero 'proper' in flow, but visuals require overlap.
                
                For simplicity in this layout, let's keep the desktop absolute overlap
                and deal with the "gap" in the next section's padding.
                
                For Mobile: We show them stacked, maybe not overlapped to save space,
                or slight overlap.
            */}
            <div className="absolute bottom-0 left-0 w-full translate-y-[20%] z-30 px-4 block lg:hidden pb-10">
                {/* Mobile allows horizontal scroll or just stack. 
                    Design often implies stack. 
                    Let's not do overlapping on mobile to avoid covering the hero text if screen is short.
                    Actually, let's just Hide this here and expect it to be rendered in the main flow 
                    if we were refactoring the whole page. 
                    
                    BUT, since this is "HeroSection", I must return everything.
                    
                    Let's put the mobile cards in a way that works.
                */}
            </div>
        </section >
    );
};

// We need a wrapper to handle the layout impact of the absolute cards
// Because the cards hang *off* the bottom, the next section needs padding-top.
// Since we only control HeroSection, we can add a 'spacer' div at the bottom 
// that is part of the flow if we want, OR we assume the user will fix the next section.
// However, a better approach for the Component is to include the spacer 
// or let the cards be in flow for mobile and absolute for desktop.

const HeroWrapper = () => {
    return (
        <div className="relative mb-24 lg:mb-[140px]">
            <HeroSection />
            {/* Mobile Cards Reuse - rendered below 'section' for flow */}
            <div className="container mx-auto px-4 grid gap-6 lg:hidden relative z-30 -mt-12">
                {[
                    { icon: Star, title: "Up to 100% Scholarship", text: "You could be eligible for a scholarship, grant or funding", color: "text-blue-600", border: "border-blue-600" },
                    { icon: Users, title: "Free Consultations", text: "Book a FREE appointment and consult to find your path", color: "text-amber-500", border: "border-amber-500" },
                    { icon: Send, title: "7 Years of Experience", text: "Successfully helping students achieve their dreams", color: "text-gray-800", border: "border-gray-800" }
                ].map((card, i) => (
                    <div key={i} className={`bg-white rounded-xl shadow-lg p-6 text-center flex flex-col items-center border-b-4 ${card.border}`}>
                        <card.icon className={`w-10 h-10 mb-4 fill-current ${card.color}`} />
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
                        <p className="text-slate-600 text-sm">{card.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Rewriting Generic component export
export default HeroWrapper;

