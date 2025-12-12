'use client';

import dynamic from 'next/dynamic';

const FloatingWhatsApp = dynamic(() => import('./FloatingWhatsApp'), {
    ssr: false
});

interface WrapperProps {
    phoneNumber?: string;
    message?: string;
    className?: string;
}

export default function WhatsAppWrapper(props: WrapperProps) {
    return <FloatingWhatsApp {...props} />;
}
