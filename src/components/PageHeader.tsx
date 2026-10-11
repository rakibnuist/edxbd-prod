'use client';

import { Sparkles, LucideIcon } from 'lucide-react';
import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

interface PageHeaderProps {
    title: string;
    highlight: string;
    description: string;
    icon?: LucideIcon | React.ReactElement;
    badgeText?: string;
    children?: React.ReactNode;
    breadcrumbLabel?: string;
}

export default function PageHeader({
    title,
    highlight,
    description,
    icon: IconOrElement = Sparkles,
    badgeText = "Explore Global Opportunities",
    children,
    breadcrumbLabel
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
        <header className="relative overflow-hidden border-b border-[#174f7a]/12 bg-[#edf6fb] pb-12 pt-28 text-[#08263c] sm:pb-14 sm:pt-32 lg:pt-36">
            <div className="pointer-events-none absolute right-[-8rem] top-[-12rem] size-[30rem] rounded-full border-[5rem] border-[#64b5df]/10" />
            <div className="relative z-10 mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
                <Breadcrumbs items={[{ name: breadcrumbLabel || `${title} ${highlight}`.trim() }]} className="mb-5" />

                <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#174f7a]/15 bg-white px-4 py-2 text-[11px] font-black uppercase leading-5 tracking-[0.12em] text-[#174f7a] shadow-sm sm:text-xs">
                    {iconElement}
                    <span className="min-w-0 whitespace-normal">{badgeText}</span>
                </div>

                <h1 className="w-full max-w-4xl break-words text-balance font-heading text-[clamp(2.35rem,5vw,4rem)] font-bold leading-[1.04] tracking-[-0.035em]">
                    {title}{' '}
                    <span className="text-[#174f7a]">
                        {highlight}
                    </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
                    {description}
                </p>

                {children && <div className="mt-6">{children}</div>}
            </div>
        </header>
    );
}
