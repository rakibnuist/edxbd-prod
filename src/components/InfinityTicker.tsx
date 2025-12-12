'use client';
import { Fragment } from 'react';

const InfinityTicker = () => {
    const content = [
        // Scholarships
        "CSC Scholarship (China)", "Stipendium Hungaricum (Hungary)", "GKS Scholarship (South Korea)", "DAAD (Germany)",
        "Turkiye Burslari", "Chinese Provincial Government Scholarship", "Silk Road Scholarship",

        // Universities
        "Zhejiang University", "Seoul National University", "University of Debrecen", "Tsinghua University",
        "KAIST", "Eötvös Loránd University", "Fudan University", "Yonsei University",
        "Tbilisi State Medical University", "Nanjing University", "Semmelweis University",

        // Majors
        "Medicine (MBBS)", "Computer Science", "International Business", "Engineering",
        "Data Science", "Artificial Intelligence", "Civil Engineering", "Economics", "BBA",
        "Biotechnology", "International Relations"
    ];

    // Randomize or just repeat to ensure smoothness
    const repeatedContent = [...content, ...content, ...content];

    return (
        <div className="relative w-full overflow-hidden bg-slate-100/50 border-t border-b border-white/20 backdrop-blur-sm py-4">
            {/* Gradient masks for smooth fade effect at edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10" />

            <div className="flex w-max animate-marquee">
                {/* First set */}
                <div className="flex whitespace-nowrap gap-8 items-center px-4">
                    {repeatedContent.map((item, index) => (
                        <Fragment key={index}>
                            <span className="text-slate-600 font-semibold text-sm sm:text-base px-4 py-1 rounded-full border border-slate-200 bg-white/60 shadow-sm whitespace-nowrap">
                                {item}
                            </span>
                            <div className="w-1 h-1 bg-blue-400 rounded-full shrink-0 opacity-50" />
                        </Fragment>
                    ))}
                </div>
                {/* Second set for seamless looping */}
                <div className="flex whitespace-nowrap gap-8 items-center px-4">
                    {repeatedContent.map((item, index) => (
                        <Fragment key={`dup-${index}`}>
                            <span className="text-slate-600 font-semibold text-sm sm:text-base px-4 py-1 rounded-full border border-slate-200 bg-white/60 shadow-sm whitespace-nowrap">
                                {item}
                            </span>
                            <div className="w-1 h-1 bg-blue-400 rounded-full shrink-0 opacity-50" />
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InfinityTicker;
