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
    const iconClassName = "w-4 h-4 text-blue-600";

    if (React.isValidElement(IconOrElement)) {
        iconElement = React.cloneElement(IconOrElement as React.ReactElement<{ className?: string }>, { className: iconClassName });
    } else {
        const IconComp = IconOrElement as LucideIcon;
        iconElement = <IconComp className={iconClassName} />;
    }

    return (
        <div className="relative bg-slate-50 overflow-hidden border-b border-slate-200">
            {/* Dynamic Background with brighter gradients */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-100/50 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse delay-1000"></div>
                {/* Light overlay */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
            </div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24 lg:pt-48 lg:pb-32 text-center z-10">
                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-sm mb-8 shadow-sm">
                    {iconElement}
                    <span className="tracking-wide">{badgeText}</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-tight text-slate-900">
                    <span className="drop-shadow-sm">{title} </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient">{highlight}</span>
                </h1>

                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                    {description}
                </p>

                {children}
            </div>
        </div>
    );
}
