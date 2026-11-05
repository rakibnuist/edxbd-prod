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
 * Shared page masthead in the site's Wise-style system: sage band, trail back,
 * heavy display headline and a readable lead. Same props as before.
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
        <header className="bg-canvas-soft pb-14 pt-[96px] text-petrol-800 sm:pt-[112px] lg:pb-20 lg:pt-[140px]">
            <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
                <Breadcrumbs items={trail} className="anim-rise" />

                {badgeText && (
                    <p className="anim-rise mt-6 inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1.5 text-[14px] font-semibold text-lime-deep" style={{ '--d': '40ms' } as React.CSSProperties}>
                        {IconComp ? <IconComp size={15} aria-hidden="true" /> : null}
                        {badgeText}
                    </p>
                )}

                <h1 className="anim-lift mt-5 max-w-[22ch] text-balance font-display text-[42px] font-black leading-[0.97] tracking-[-0.02em] sm:text-[60px] lg:text-[72px]" style={{ '--d': '80ms' } as React.CSSProperties}>
                    {title}
                    {highlight ? <span className="block">{highlight}</span> : null}
                </h1>
                <p className="anim-rise mt-6 max-w-2xl text-[18px] leading-[1.6] text-ink-soft sm:text-[19px]" style={{ '--d': '160ms' } as React.CSSProperties}>
                    {description}
                </p>

                {children && <div className="anim-rise mt-8" style={{ '--d': '240ms' } as React.CSSProperties}>{children}</div>}
            </div>
        </header>
    );
}
