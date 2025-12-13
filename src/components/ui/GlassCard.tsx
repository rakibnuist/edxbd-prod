import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

const GlassCard = ({ children, className = "" }: GlassCardProps) => {
    return (
        <div className={`relative backdrop-blur-3xl bg-white/40 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2.5rem] overflow-hidden ${className}`}>
            {/* Refractive Highlight Edge (Top/Left) */}
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/50 pointer-events-none z-20 mix-blend-overlay"></div>

            {/* Inner Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent opacity-50 pointer-events-none z-10"></div>

            {/* Noise Texture - Optimized to use local class or consistent style */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay z-0"></div>

            <div className="relative z-30 h-full">
                {children}
            </div>
        </div>
    );
};

export default GlassCard;
