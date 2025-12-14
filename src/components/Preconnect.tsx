'use client';

import { preconnect } from 'react-dom';

export function Preconnect() {
    return (
        <>
            <link rel="preconnect" href="https://www.transparenttextures.com" />
            <link rel="preconnect" href="https://vercel.live" />
            <link rel="preconnect" href="https://grainy-gradients.vercel.app" />
        </>
    );
}
