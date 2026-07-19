'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const FloatingWhatsApp = dynamic(() => import('./FloatingWhatsApp' /* webpackChunkName: "whatsapp" */), {
    ssr: false
});

interface WrapperProps {
    phoneNumber?: string;
    message?: string;
    className?: string;
}

export default function WhatsAppWrapper(props: WrapperProps) {
    const pathname = usePathname();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldRender(true);
        }, 5000); // 5 second delay to clear TBT

        return () => clearTimeout(timer);
    }, []);

    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) return null;
    if (!shouldRender) return null;

    return <FloatingWhatsApp {...props} />;
}
