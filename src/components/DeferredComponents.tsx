'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const QuickContactForm = dynamic(() => import('./QuickContactForm' /* webpackChunkName: "quick-contact-form" */), { ssr: false });
const EnhancedAnalytics = dynamic(() => import('./EnhancedAnalytics' /* webpackChunkName: "analytics" */), { ssr: false });
const Footer = dynamic(() => import('./Footer' /* webpackChunkName: "footer" */), { ssr: false });

interface DeferredComponentsProps {
    children?: React.ReactNode;
}

export default function DeferredComponents({ children }: DeferredComponentsProps) {
    const [showQuickContact, setShowQuickContact] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showFooter, setShowFooter] = useState(false);

    useEffect(() => {
        // Defer analytics to after initial page load
        const analyticsTimer = setTimeout(() => {
            setShowAnalytics(true);
        }, 2000);

        // Defer Footer
        const footerTimer = setTimeout(() => {
            setShowFooter(true);
        }, 2000);

        // Defer QuickContactForm
        const contactTimer = setTimeout(() => {
            setShowQuickContact(true);
        }, 3000);

        return () => {
            clearTimeout(analyticsTimer);
            clearTimeout(footerTimer);
            clearTimeout(contactTimer);
        };
    }, []);

    return (
        <>
            {children}
            {showAnalytics && <EnhancedAnalytics />}
            {showFooter && <Footer />}
            {showQuickContact && <QuickContactForm />}
        </>
    );
}
