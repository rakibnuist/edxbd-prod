'use client';



interface TickerProps {
    items: string[];
    direction?: 'left' | 'right';
    speed?: 'fast' | 'normal' | 'slow';
    className?: string;
}

export default function Ticker({ items, direction = 'left', speed = 'normal', className = '' }: TickerProps) {
    // Duplicate items enough times to ensure smooth infinite scroll
    // For safety, we repeat 4 times
    const repeatedItems = [...items, ...items, ...items, ...items];

    const speedClass = {
        fast: 'duration-[20s]',
        normal: 'duration-[40s]',
        slow: 'duration-[60s]',
    }[speed];

    const animationClass = direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse';

    return (
        <div className={`relative flex overflow-hidden select-none group ${className}`}>
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className={`flex min-w-full shrink-0 items-center justify-around gap-8 whitespace-nowrap ${animationClass} ${speedClass} group-hover:[animation-play-state:paused]`}>
                {repeatedItems.map((item, i) => (
                    <div key={`${item}-${i}`} className="flex items-center gap-4 px-4">
                        <span className="text-lg font-bold text-slate-700 whitespace-nowrap px-6 py-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                            {item}
                        </span>
                    </div>
                ))}
            </div>
            <div aria-hidden="true" className={`flex min-w-full shrink-0 items-center justify-around gap-8 whitespace-nowrap ${animationClass} ${speedClass} group-hover:[animation-play-state:paused]`}>
                {repeatedItems.map((item, i) => (
                    <div key={`dup-${item}-${i}`} className="flex items-center gap-4 px-4">
                        <span className="text-lg font-bold text-slate-700 whitespace-nowrap px-6 py-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                            {item}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
