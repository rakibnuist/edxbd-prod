'use client';

import { MessageSquare, X, Award, GraduationCap } from 'lucide-react';
// Removed framer-motion for better performance
import { trackWhatsAppClick } from '@/lib/analytics';
import { useState, useEffect } from 'react';

const WhatsAppWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInitialPopup, setShowInitialPopup] = useState(false);


  const phoneNumber = '+8801983333566';
  const message = encodeURIComponent('Hi! I want to start my study abroad journey with EduExpress International. Can you help me find scholarship opportunities?');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialPopup(true);
    }, 8000);

    const hideTimer = setTimeout(() => {
      setShowInitialPopup(false);
    }, 12000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Removed floating animation for better performance

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('floating_widget');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Enhanced Mobile Initial Popup */}
      {showInitialPopup && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 max-w-xs mobile-overflow-hidden">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 relative overflow-hidden mobile-card">
            {/* Creative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50" />
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full -translate-y-8 translate-x-8 opacity-30" />

            <div className="relative z-10">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Scholarship Expert Available!</h4>
                  <p className="text-gray-600 text-xs mb-2">
                    Get instant help with your study abroad and scholarship questions
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleWhatsAppClick}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation active:bg-green-700"
                    >
                      Chat Now
                    </button>
                    <button
                      onClick={() => setShowInitialPopup(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation active:bg-gray-100 rounded-full"
                      aria-label="Close popup"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mobile Floating Widget */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40">
        {isExpanded && (
          <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-w-xs relative overflow-hidden mobile-card mobile-overflow-hidden">
            {/* Creative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full -translate-y-10 translate-x-10 opacity-30" />

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">EduExpress International</h4>
                  <div className="text-green-600 text-xs flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                    Online now
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-xs mb-3">
                Need help with scholarships? Our experts are here to guide you!
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={handleWhatsAppClick}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center min-h-[44px] touch-manipulation active:bg-green-700"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Start Chat
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation active:bg-gray-100 rounded-lg"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Mobile Main Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative group hover:scale-105 transition-transform touch-manipulation active:scale-95"
          aria-label="Open WhatsApp chat"
          aria-expanded={isExpanded}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />

          {/* Main Button */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl border-2 border-white">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />

            {/* Scholarship Badge */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <Award className="w-3 h-3 text-white" />
            </div>
          </div>
        </button>
      </div>
    </>
  );
};

export default WhatsAppWidget;