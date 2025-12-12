'use client';

import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { trackContactInteraction, getUserDevice } from '@/lib/vercel-analytics';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export default function FloatingWhatsApp({
  phoneNumber = '+8801983333566',
  message = 'Hi! I\'m interested in studying abroad. Can you help me?',
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
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            Hello Dear Sir/Madam, Thank you for contacting EduExpress International. Please let us know how may we assist you?
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
      >
        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm z-20 border-2 border-white animate-bounce">
          1
        </div>

        {/* WhatsApp Icon */}
        <FaWhatsapp
          className={`w-9 h-9 text-white transition-transform duration-300 z-10 ${isHovered ? 'scale-110' : ''}`}
        />

        {/* Pulse Animations */}
        <span className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping duration-[2s]"></span>
        <span className="absolute inset-0 rounded-full bg-white opacity-10 animate-ping delay-75 duration-[2s]"></span>
      </button>
    </div>
  );
}
