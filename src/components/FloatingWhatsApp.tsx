'use client';

import { useState, useEffect } from 'react';
import { trackContactInteraction, getUserDevice } from '@/lib/vercel-analytics';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export default function FloatingWhatsApp({
  phoneNumber = '+8801983333566',
  message = 'Hi! I&apos;m interested in studying abroad. Can you help me?',
  className = ''
}: FloatingWhatsAppProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Show the widget after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Show popup shortly after widget appears
      setTimeout(() => setShowPopup(true), 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    // Track WhatsApp interaction
    trackContactInteraction('whatsapp', {
      page: window.location.pathname,
      source: 'floating_widget',
      device: getUserDevice(),
      phone_number: phoneNumber
    });

    // Format phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const whatsappPhone = cleanPhone.startsWith('880') ? cleanPhone : `880${cleanPhone}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappPhone}?text=${encodedMessage}`, '_blank');

    // Hide popup after click
    setShowPopup(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 ${className} font-sans`}>
      {/* Greeting Popup */}
      {showPopup && (
        <div className="bg-white p-4 rounded-xl shadow-2xl max-w-[280px] relative animate-fadeIn transition-all duration-300 border border-gray-100">
          <button
            onClick={(e) => { e.stopPropagation(); setShowPopup(false); }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Close WhatsApp popup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            Hello Future Scholar! 🎓 We provide expert guidance for studying abroad with scholarship assistance. Want to check your eligibility? Let&apos;s chat!
          </p>
          {/* Arrow pointing down */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-100"></div>
        </div>
      )}

      {/* Main WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative w-16 h-16 rounded-full shadow-lg hover:shadow-2xl
          transition-all duration-300 ease-in-out
          transform hover:scale-105 active:scale-95
          flex items-center justify-center
          group bg-[#25D366] overflow-visible
        `}
        title="Chat with us on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm z-20 border-2 border-white animate-bounce">
          1
        </div>

        {/* WhatsApp Icon */}
        <svg
          viewBox="0 0 448 512"
          className={`w-9 h-9 fill-white transition-transform duration-300 z-10 ${isHovered ? 'scale-110' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>

        {/* Pulse Animations */}
        <span className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping duration-[2s]"></span>
        <span className="absolute inset-0 rounded-full bg-white opacity-10 animate-ping delay-75 duration-[2s]"></span>
      </button>
    </div>
  );
}
