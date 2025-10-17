'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, ArrowRight, Star, Award } from 'lucide-react';
import { modalBackdrop, modalContent, fadeInUp, scaleInCenter } from '@/lib/animations';
import EnhancedContactForm from './EnhancedContactForm';

const QuickContactForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for custom event to open modal from CTA buttons
  useEffect(() => {
    const handleOpenQuickForm = () => {
      setIsOpen(true);
    };

    window.addEventListener('openQuickForm', handleOpenQuickForm);

    return () => {
      window.removeEventListener('openQuickForm', handleOpenQuickForm);
    };
  }, []);

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
        {/* Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 backdrop-blur-md overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
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
            <MessageCircle className="w-6 h-6" />
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
            className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
          />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-gray-900/95 backdrop-blur-md text-white px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-white/10">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Get Free Consultation</span>
            </div>
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900/95 rotate-45 border-r border-b border-white/10" />
          </div>
        </motion.button>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${80 + i * 10}%`
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Modern Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
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
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white/95 backdrop-blur-xl rounded-3xl max-w-3xl w-full max-h-[95vh] min-h-[600px] flex flex-col shadow-2xl border border-white/40"
              onClick={(e) => {
                // Prevent modal from closing when clicking on the modal content
                e.stopPropagation();
              }}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]" />
              
              {/* Enhanced Header */}
              <div className="relative p-6 border-b border-gray-200/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Award className="w-6 h-6 text-white" />
                      {/* Sparkle effect */}
                      <motion.div
                        animate={{ 
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          delay: 1
                        }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                      />
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Free Consultation
                      </h2>
                      <p className="text-sm text-gray-600 flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>Get expert advice on your study abroad journey</span>
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-300 hover:scale-110 group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                  </motion.button>
                </div>
                
                {/* Trust indicators */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 flex items-center space-x-4 text-xs text-gray-500"
                >
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>100% Free</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span>Expert Guidance</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span>24h Response</span>
                  </div>
                </motion.div>
              </div>

              {/* Form Content */}
              <div className="relative p-6 pb-12 flex-1 overflow-y-auto min-h-[400px]">
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
                  autoHideDelay={1000}
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