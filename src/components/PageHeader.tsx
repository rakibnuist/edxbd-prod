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
    /** Full crumb trail. Omit to keep the single-crumb default built from breadcrumbLabel / `${title} ${highlight}`. */
    breadcrumbs?: { name: string; href?: string }[];
}

/**
 * Shared page masthead. A warm editorial band with a serif statement, the trail
 * back and a layered sky grid. Inner pages inherit the homepage's depth here.
 */
export default function PageHeader({
    title,
    highlight,
    description,
    icon: IconOrElement = Sparkles,
    badgeText,
    children,
    breadcrumbLabel,
    breadcrumbs,
}: PageHeaderProps) {
    const IconComp = React.isValidElement(IconOrElement) ? null : (IconOrElement as LucideIcon);
    const trail = breadcrumbs ?? [{ name: breadcrumbLabel || `${title} ${highlight}`.trim() }];

    return (
        <header className="relative overflow-hidden border-b border-[#12436b]/10 bg-[linear-gradient(180deg,#ffffff_0%,#f4f9fc_100%)] px-5 pb-12 pt-[100px] text-ed-ink sm:px-8 lg:px-12 lg:pb-16 lg:pt-[136px]">
            <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark opacity-70" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-24 -top-24 size-[360px] rounded-full bg-sky-100/80 blur-[90px]" aria-hidden="true" />
            <div
                className="ed-numeral pointer-events-none absolute right-8 top-24 hidden select-none text-[170px] leading-none text-ed-navy/[0.05] lg:block"
                aria-hidden="true"
            >
                ED
            </div>

            <div className="relative mx-auto max-w-shell">
                <Breadcrumbs items={trail} className="mb-5" />

                {badgeText && (
                    <p className="inline-flex items-center gap-2 rounded-full border border-[#12436b]/12 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ed-navy shadow-[0_12px_28px_-24px_rgba(18,67,107,0.35)]">
                        {IconComp ? <IconComp size={13} className="text-ed-teal" aria-hidden="true" /> : null}
                        {badgeText}
                    </p>
                )}

                <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end lg:gap-14">
                    <div className="min-w-0">
                        <h1 className="ed-home-display max-w-[26ch] break-words text-balance text-[clamp(2.15rem,4.5vw,3.7rem)] leading-[1.02] tracking-[-0.03em]">
                            {title}
                            {highlight ? <span className="block text-ed-navy">{highlight}</span> : null}
                        </h1>
                        <span className="mt-6 block h-[3px] w-20 rounded-full bg-gradient-to-r from-ed-navy via-ed-teal to-ed-sky" aria-hidden="true" />
                    </div>
                    <p className="max-w-[54ch] border-l-2 border-ed-sky/30 pl-4 text-[15px] leading-7 text-slate-600 lg:mb-1">
                        {description}
                    </p>
                </div>

                {children && <div className="mt-7">{children}</div>}
            </div>
        </header>
    );
}
