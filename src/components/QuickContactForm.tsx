'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, Star, Award } from 'lucide-react';

import EnhancedContactForm from './EnhancedContactForm';
import { trackConsultationRequest } from '@/lib/analytics';

const QuickContactForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for custom event to open modal from CTA buttons
  useEffect(() => {
    const handleOpenQuickForm = () => {
      setIsOpen(true);
      trackConsultationRequest('quick_form_event');
    };

    window.addEventListener('openQuickForm', handleOpenQuickForm);

    return () => {
      window.removeEventListener('openQuickForm', handleOpenQuickForm);
    };
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    trackConsultationRequest('floating_button');
  };

  const handleFormSubmit = () => {
    // This callback is called when the form is successfully submitted
    // The auto-hide functionality is now handled by EnhancedContactForm

    // Fallback: Close modal after 3 seconds if auto-hide doesn't work
    setTimeout(() => {
      console.log('Fallback: Closing modal after 3 seconds');
      setIsOpen(false);
    }, 3000);
  };

  // Stable callback for auto-hide to prevent setState-in-render issues
  const handleAutoHide = useCallback(() => {
    console.log('QuickContactForm: onAutoHide called, closing modal');
    // Use setTimeout to ensure this runs after the current render cycle
    setTimeout(() => {
      setIsOpen(false);
    }, 0);
  }, []);

  // Stable callback for closing modal to ensure single-click functionality
  const handleCloseModal = useCallback(() => {
    console.log('QuickContactForm: Closing modal');
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Modern Floating Contact Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-40"
      >
        {/* Floating Action Button - CRYSTAL BLUE */}
        <motion.button
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className="group relative bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-2xl shadow-2xl hover:shadow-blue-500/40 transition-all duration-500 border border-white/20 overflow-hidden ring-4 ring-blue-600/20"
        >
          {/* Main icon */}
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10"
          >
            <MessageCircle className="w-7 h-7" />
          </motion.div>

          {/* Sparkle effects */}
          <motion.div
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.5
            }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white"
          />

          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-slate-700 pointer-events-none">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Get Free Consultation</span>
            </div>
            {/* Arrow */}
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700" />
          </div>
        </motion.button>
      </motion.div>

      {/* Modern Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(2, 6, 23, 0.8)', // Darker slate overlay
              backdropFilter: 'blur(8px)'
            }}
            onClick={(e) => {
              // Close modal when clicking on backdrop (white space)
              if (e.target === e.currentTarget) {
                handleCloseModal();
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-[1.5rem] max-w-xl w-full flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/20"
              onClick={(e) => {
                // Prevent modal from closing when clicking on the modal content
                e.stopPropagation();
              }}
            >
              {/* Header - COMPACT */}
              <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50 overflow-hidden shrink-0">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                        Free Consultation
                      </h2>
                      <p className="text-xs text-slate-600 font-bold flex items-center space-x-1 mt-1">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span>Get expert advice</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all duration-300 group shadow-sm hover:shadow-md"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
                  </button>
                </div>

                {/* Trust indicators */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wide">
                  <div className="flex items-center space-x-1 bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-md">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span>100% Free</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-md">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    <span>Expert Guidance</span>
                  </div>
                </div>
              </div>

              {/* Form Content - Remove manual scrollbar if possible by fitting content */}
              <div className="relative px-6 py-6 bg-white overflow-y-auto max-h-[75vh]">
                <EnhancedContactForm
                  formType="consultation"
                  source="quick_contact_modal"
                  title=""
                  description=""
                  showCountry={true}
                  showProgram={true}
                  showMessage={true}
                  showLocation={false}
                  className="bg-transparent shadow-none border-none p-0"
                  onSubmit={handleFormSubmit}
                  autoHide={true}
                  autoHideDelay={3000}
                  onAutoHide={handleAutoHide}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickContactForm;