'use client';

import { Sparkles, LucideIcon } from 'lucide-react';
import React from 'react';

interface PageHeaderProps {
    title: string;
    highlight: string;
    description: string;
    icon?: LucideIcon | React.ReactElement;
    badgeText?: string;
    children?: React.ReactNode;
}

export default function PageHeader({
    title,
    highlight,
    description,
    icon: IconOrElement = Sparkles,
    badgeText = "Explore Global Opportunities",
    children
}: PageHeaderProps) {
    let iconElement: React.ReactNode;
    const iconClassName = "w-4 h-4 text-amber-300";

    if (React.isValidElement(IconOrElement)) {
        iconElement = React.cloneElement(IconOrElement as React.ReactElement<{ className?: string }>, { className: iconClassName });
    } else {
        const IconComp = IconOrElement as LucideIcon;
        iconElement = <IconComp className={iconClassName} />;
    }

    return (
        <div className="relative bg-[#0F172A] overflow-hidden">
            {/* Dynamic Background with brighter gradients */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px]"></div>
            </div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-8 backdrop-blur-md shadow-xl ring-1 ring-white/10">
                    {iconElement}
                    <span className="tracking-wide">{badgeText}</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
                    <span className="text-white drop-shadow-lg">{title} </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient">{highlight}</span>
                </h1>

                <p className="text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                    {description}
                </p>

                {children}
            </div>
        </div>
    );
}
