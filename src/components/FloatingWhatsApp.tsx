'use client';

import { useState } from 'react';
import { trackContactInteraction, getUserDevice } from '@/lib/vercel-analytics';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export default function FloatingWhatsApp({
  phoneNumber = '+8801983333566',
  message = 'Hi, I would like an Education Fit Assessment. Please help me compare suitable study options, complete costs and scholarship availability.',
  className = '',
}: FloatingWhatsAppProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    trackContactInteraction('whatsapp', {
      page: window.location.pathname,
      source: 'floating_widget',
      device: getUserDevice(),
      phone_number: phoneNumber,
    });

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const whatsappPhone = cleanPhone.startsWith('880') ? cleanPhone : `880${cleanPhone}`;
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className={`fixed bottom-5 right-5 z-40 flex items-center gap-3 ${className}`}>
      <span className={`pointer-events-none hidden min-w-40 border border-[#174f7a]/20 border-l-4 border-l-[#64b5df] bg-white px-4 py-3 shadow-[0_14px_40px_rgba(8,38,60,0.18)] transition duration-200 sm:block ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`}>
        <span className="block font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Direct support</span>
        <span className="mt-1 block text-xs font-black text-[#08263c]">Ask on WhatsApp</span>
      </span>
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative grid size-14 place-items-center overflow-hidden border border-[#8ed0ee] bg-[#08263c] shadow-[0_12px_34px_rgba(8,38,60,0.3)] transition hover:-translate-y-1 hover:bg-[#174f7a] hover:shadow-[0_16px_40px_rgba(8,38,60,0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#64b5df]/40 sm:size-16"
        title="Ask EduExpress on WhatsApp"
        aria-label="Ask EduExpress on WhatsApp"
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-[#64b5df]" />
        <span className="absolute left-1.5 top-2 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-[#8ed0ee]">WA</span>
        <svg viewBox="0 0 448 512" className="mt-1 size-6 fill-white transition group-hover:scale-105 sm:size-7" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
        <span className="absolute bottom-1.5 right-1.5 size-2.5 rounded-full border-2 border-[#08263c] bg-[#25D366] group-hover:border-[#174f7a]" aria-hidden="true" />
      </button>
    </div>
  );
}
