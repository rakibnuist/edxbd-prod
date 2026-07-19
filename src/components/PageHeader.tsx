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
    const iconClassName = "w-4 h-4 text-[#8ed0ee]";

    if (React.isValidElement(IconOrElement)) {
        iconElement = React.cloneElement(IconOrElement as React.ReactElement<{ className?: string }>, { className: iconClassName });
    } else {
        const IconComp = IconOrElement as LucideIcon;
        iconElement = <IconComp className={iconClassName} />;
    }

    return (
        <header className="relative overflow-hidden bg-[#f4f8fa] pt-28 pb-16 text-[#08263c] sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 border-b border-[#174f7a]/15">
            {/* Grid Pattern Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(23,79,122,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,79,122,0.07)_1px,transparent_1px)] bg-[size:76px_76px]" />
            <div className="pointer-events-none absolute right-[4%] top-28 size-72 rounded-full border-[44px] border-[#64b5df]/15 md:size-[460px]" />

            <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 z-10">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#174f7a]/25 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#174f7a]">
                    <span>EduExpress International Bangladesh</span>
                    <span>Evidence-First Education Consultancy</span>
                    <span>Dhanmondi Decision Desk</span>
                </div>

                <div className="flex w-full max-w-full items-start gap-3 bg-[#174f7a] px-4 py-2 text-[11px] font-black uppercase leading-5 tracking-[0.16em] text-white sm:inline-flex sm:w-auto sm:items-center sm:text-xs sm:tracking-[0.2em] mb-7">
                    {iconElement}
                    <span className="min-w-0 whitespace-normal">{badgeText}</span>
                </div>

                <h1 className="w-full max-w-4xl break-words text-balance font-heading text-[clamp(2.4rem,5.6vw,4.2rem)] font-bold leading-[1.06] tracking-[-0.022em]">
                    {title}{' '}
                    <span className="relative mt-2 inline-block bg-[#64b5df] px-2 pb-2 text-[#08263c] sm:px-3 sm:pb-3">
                        {highlight}
                    </span>
                </h1>

                <p className="mt-7 max-w-3xl border-l-4 border-[#64b5df] pl-5 text-base leading-7 text-slate-700 md:text-lg md:leading-8">
                    {description}
                </p>

                {children && <div className="mt-9">{children}</div>}
            </div>
        </header>
    );
}
