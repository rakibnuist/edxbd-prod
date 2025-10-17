'use client';

import { 
  GraduationCap, 
  Users, 
  Clock, 
  ArrowRight, 
  Phone, 
  CheckCircle,
  Award,
  MessageCircle,
  Send,
  Plane,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { trackApplicationStart, trackConsultationRequest } from '@/lib/analytics';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import AnimatedButton from '@/components/AnimatedButton';
import EngagementTracker from '@/components/EngagementTracker';
import { fadeInUp, fadeInDown, scaleIn, staggerContainer, staggerItem, float } from '@/lib/animations';

// Import components normally for now - lazy loading can be added later
import { Testimonial, Update } from '@/lib/types';
import { featuredCountries } from '@/lib/countries';

// Client-side only flag component to prevent hydration issues
const ClientOnlyFlag = ({ flag, className }: { flag: string; className: string }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className={className}>
        {flag}
      </div>
    );
  }
  
  return (
    <motion.div 
      className={className}
      whileHover={{ scale: 1.15, rotate: 5 }}
    >
      {flag}
    </motion.div>
  );
};

const Home = memo(function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentDestination, setCurrentDestination] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [currentUpdateSlide, setCurrentUpdateSlide] = useState(0);
  const [carouselOffset, setCarouselOffset] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Create infinite loop countries array - duplicate the array multiple times for seamless loop
  const countries = useMemo(() => {
    const baseCountries = featuredCountries.map(country => ({
      name: country.name,
      flag: country.flag,
      description: country.description
    }));
    // Create multiple copies for seamless infinite loop
    return [...baseCountries, ...baseCountries, ...baseCountries];
  }, []);

  // Fetch testimonials from database
  const fetchTestimonials = useCallback(async () => {
    const fallbackTestimonials: Testimonial[] = [
      {
        _id: "fallback-1",
        name: "Rahman Ahmed",
        location: "Dhaka, Bangladesh",
        university: "University of Manchester, UK",
        program: "Computer Science",
        quote: "EduExpress International made my dream of studying in the UK come true. Their guidance was like having a personal mentor throughout the entire process.",
        rating: 5,
        image: "🇧🇩",
        country: "UK",
        isActive: true,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: "fallback-2",
        name: "Fatima Khan",
        location: "Karachi, Pakistan",
        university: "University of Toronto, Canada",
        program: "Business Administration",
        quote: "The team at EduExpress International was incredibly supportive. They helped me navigate the complex application process and secure a scholarship.",
        rating: 5,
        image: "🇵🇰",
        country: "Canada",
        isActive: true,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: "fallback-3",
        name: "Ahmed Hassan",
        location: "Cairo, Egypt",
        university: "University of Melbourne, Australia",
        program: "Engineering",
        quote: "From visa assistance to accommodation help, EduExpress International provided comprehensive support. Highly recommended!",
        rating: 5,
        image: "🇪🇬",
        country: "Australia",
        isActive: true,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    try {
      setTestimonialsLoading(true);
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.length > 0 ? data : fallbackTestimonials);
      } else {
        console.error('Failed to fetch testimonials:', response.statusText);
        setTestimonials(fallbackTestimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials(fallbackTestimonials);
    } finally {
      setTestimonialsLoading(false);
    }
  }, []);

  // Fetch latest updates from database
  const fetchUpdates = useCallback(async () => {
    try {
      setUpdatesLoading(true);
      const response = await fetch('/api/updates?limit=4');
      if (response.ok) {
        const data = await response.json();
        setUpdates(data.updates || []);
      } else {
        console.error('Failed to fetch updates:', response.statusText);
        setUpdates([]);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
      setUpdates([]);
    } finally {
      setUpdatesLoading(false);
    }
  }, []);

  // Fetch testimonials and updates on component mount
  useEffect(() => {
    fetchTestimonials();
    fetchUpdates();
  }, [fetchTestimonials, fetchUpdates]);

  // Enhanced carousel functionality with pause support
  useEffect(() => {
    if (isCarouselPaused) return;

    const interval = setInterval(() => {
      // Rotate destinations every 6 seconds
      setCurrentDestination((prev) => (prev + 1) % countries.length);
      
      // Enhanced carousel movement with slide-based navigation - one card per slide
      setCurrentCarouselSlide((prev) => {
        const totalSlides = featuredCountries.length;
        return (prev + 1) % totalSlides;
      });
      
      // Rotate updates every 10 seconds
      if (updates.length > 4) {
        const totalSlides = Math.ceil(updates.length / 4);
        setCurrentUpdateSlide((prev) => (prev + 1) % totalSlides);
      }
    }, 4000); // 4 seconds for better user experience

    // Separate interval for testimonials to control their speed independently
    const testimonialInterval = setInterval(() => {
      if (testimonials.length > 0) {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }
    }, 6000); // 6 seconds for testimonials - slower rotation

    return () => {
      clearInterval(interval);
      clearInterval(testimonialInterval);
    };
  }, [testimonials.length, countries.length, updates.length, isCarouselPaused]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setCurrentCarouselSlide((prev) => {
          const totalSlides = featuredCountries.length;
          return prev === 0 ? totalSlides - 1 : prev - 1;
        });
      } else if (event.key === 'ArrowRight') {
        setCurrentCarouselSlide((prev) => {
          const totalSlides = featuredCountries.length;
          return (prev + 1) % totalSlides;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation functions
  const goToPreviousSlide = () => {
    setCurrentCarouselSlide((prev) => {
      const totalSlides = featuredCountries.length;
      return prev === 0 ? totalSlides - 1 : prev - 1;
    });
  };

  const goToNextSlide = () => {
    setCurrentCarouselSlide((prev) => {
      const totalSlides = featuredCountries.length;
      return (prev + 1) % totalSlides;
    });
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentCarouselSlide(slideIndex);
  };

  // Touch/swipe support for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextSlide();
    } else if (isRightSwipe) {
      goToPreviousSlide();
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Engagement Tracking */}
      <EngagementTracker pageName="home" />
      
      {/* Compact Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        {/* Enhanced Background Elements with Glassmorphism */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main gradient orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl"
            variants={float}
            animate="animate"
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/15 to-orange-400/15 rounded-full blur-3xl"
            variants={float}
            animate="animate"
            transition={{ delay: 1 }}
          />
          
          {/* Additional floating elements */}
          <motion.div 
            className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-2xl"
            animate={{ 
              y: [0, -20, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          {/* Glassmorphism floating shapes */}
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            animate={{ 
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-32 right-32 w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            animate={{ 
              y: [0, 25, 0],
              x: [0, -15, 0],
              rotate: [0, -180, -360]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto py-8 sm:py-12">
            {/* Compact Trust Badge */}
            <AnimatedSection animation="fadeInDown" delay={0.2}>
              <div className="mb-4">
                <motion.div 
                  className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-md border border-blue-200/60 rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                    🏆 Trusted Since 2018 • 3000+ Students Got Scholarships
                  </span>
                  <motion.div 
                    className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </motion.div>
              </div>
            </AnimatedSection>

            {/* Compact Main Heading */}
            <AnimatedSection animation="fadeInUp" delay={0.4}>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 font-bold leading-tight font-heading px-2">
                <motion.span 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Study Abroad
                </motion.span>
                <motion.span 
                  className="block bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  Made Simple
                </motion.span>
              </h1>
            </AnimatedSection>

            {/* Compact Value Proposition */}
            <div className="mb-3 sm:mb-4 px-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 font-heading">
                🎓 <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">FREE</span> Scholarship Assistance
              </h2>
            </div>

            {/* Compact Subtitle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Transform your education journey with expert study abroad consultancy. 
              <span className="font-bold text-green-600"> FREE scholarship assistance</span> since 2018. 
              <span className="font-bold text-blue-600"> 97% success rate</span> helping 3000+ students study at top universities worldwide.
            </p>

            {/* Compact CTA Buttons */}
            <AnimatedSection animation="fadeInUp" delay={1.2}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center px-4 sm:px-6">
                <motion.button
                  onClick={() => {
                    trackConsultationRequest('hero_cta');
                    window.dispatchEvent(new CustomEvent('openQuickForm'));
                  }}
                  className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white text-base px-8 py-3 rounded-full font-bold shadow-xl hover:shadow-2xl min-h-[48px] touch-manipulation active:scale-95 transition-all duration-300 border border-white/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center space-x-2">
                    <span>Get FREE Consultation</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>
                
                <motion.button
                  onClick={() => trackApplicationStart('phone_call')}
                  className="group relative bg-white/90 backdrop-blur-md hover:bg-white text-blue-600 text-base px-8 py-3 rounded-full font-bold shadow-lg border-2 border-blue-600/50 hover:border-blue-700 min-h-[48px] touch-manipulation active:scale-95 transition-all duration-300 hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Phone className="w-4 h-4" />
                    </motion.div>
                    <span>Call Now</span>
                  </div>
                </motion.button>
              </div>
            </AnimatedSection>

            {/* Compact Stats Preview */}
            <AnimatedSection animation="stagger" delay={1.4}>
              <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-6">
                {[
                  { value: "3000+", label: "Students Helped", icon: "🎓" },
                  { value: "97%", label: "Success Rate", icon: "🏆" },
                  { value: "2018", label: "Since", icon: "⭐" },
                  { value: "100%", label: "Free Consultation", icon: "💯" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-3 sm:p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 touch-manipulation group"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div 
                      className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.8 + index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-700 font-semibold">{stat.label}</div>
                    
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <div className="text-center mb-20">
              <motion.div 
                className="inline-block mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Award className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 font-heading">
                How We Help You
              </h2>
              
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-8"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
              
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                <span className="font-bold text-purple-600">3 Simple Steps</span> to Study Abroad with Scholarship Assistance
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="stagger" delay={0.8}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: "01",
                  title: "Free Consultation",
                  description: "Get personalized guidance on study abroad opportunities and scholarship options tailored to your profile.",
                  icon: "💬"
                },
                {
                  step: "02", 
                  title: "Application Support",
                  description: "Complete assistance with university applications, document preparation, and scholarship applications.",
                  icon: "📝"
                },
                {
                  step: "03",
                  title: "Visa & Departure",
                  description: "End-to-end visa assistance and pre-departure support to ensure smooth transition to your new country.",
                  icon: "✈️"
                }
              ].map((process, index) => (
                <motion.div
                  key={process.step}
                  className="text-center group"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + index * 0.2 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative mb-8">
                    <motion.div 
                      className="w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.span 
                        className="text-4xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.2, type: "spring", stiffness: 200 }}
                      >
                        {process.icon}
                      </motion.span>
                    </motion.div>
                    <motion.div 
                      className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.4 + index * 0.2, type: "spring", stiffness: 200 }}
                    >
                      {process.step}
                    </motion.div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading">
                    {process.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {process.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Enhanced Featured Countries Carousel Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 font-heading">
              Popular Study Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our most popular study destinations with comprehensive support and scholarship opportunities
            </p>
          </div>

          {/* Enhanced Carousel with Controls */}
          <div className="max-w-7xl mx-auto">
            <div 
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/60 via-blue-50/30 to-purple-50/40 backdrop-blur-md shadow-2xl border border-white/30 hover:border-blue-200/50 transition-all duration-500"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Subtle animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 animate-pulse"></div>
              </div>
              {/* Enhanced Navigation Buttons with Glow Effects - Mobile Responsive */}
              <button
                onClick={goToPreviousSlide}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-700 hover:text-blue-600 rounded-full p-2 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 backdrop-blur-md border border-white/30 hover:border-blue-300/50 opacity-90 hover:opacity-100 group min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Previous destinations"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300 blur-sm"></div>
                <ChevronLeft className="relative w-4 h-4 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform duration-200" />
              </button>
              
              <button
                onClick={goToNextSlide}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-gray-700 hover:text-blue-600 rounded-full p-2 sm:p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 backdrop-blur-md border border-white/30 hover:border-blue-300/50 opacity-90 hover:opacity-100 group min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Next destinations"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300 blur-sm"></div>
                <ChevronRight className="relative w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* Carousel Container - One Card Per Slide */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentCarouselSlide * 100}%)`
                  }}
                >
                  {featuredCountries.map((country, index) => (
                    <div key={country.name} className="w-full flex-shrink-0 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
                      <div className="flex justify-center">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="group bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 cursor-pointer border border-white/30 hover:border-indigo-300/60 relative overflow-hidden max-w-sm sm:max-w-md lg:max-w-lg w-full"
                          onClick={() => {
                            trackApplicationStart(`country_${country.name.toLowerCase()}`);
                            window.dispatchEvent(new CustomEvent('openQuickForm'));
                          }}
                          whileHover={{ y: -8 }}
                        >
                          {/* Enhanced multi-layer gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-indigo-50/60 group-hover:via-purple-50/50 group-hover:to-pink-50/60 transition-all duration-700 rounded-3xl"></div>
                          
                          {/* Animated pattern overlay */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 via-purple-400/20 to-pink-400/30 rounded-3xl animate-pulse"></div>
                          </div>
                          
                          {/* Subtle border glow effect */}
                          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 blur-sm"></div>
                          </div>
                          
                          <div className="text-center relative z-10">
                            {/* Enhanced flag with glow effect - Mobile Responsive */}
                            <div className="relative mb-6 sm:mb-8 lg:mb-10">
                              <ClientOnlyFlag 
                                flag={country.flag}
                                className="text-6xl sm:text-7xl lg:text-9xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500 filter group-hover:drop-shadow-2xl group-hover:brightness-110"
                              />
                              {/* Subtle glow effect behind flag */}
                              <div className="absolute inset-0 text-6xl sm:text-7xl lg:text-9xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 blur-sm">
                                {country.flag}
                              </div>
                            </div>
                            
                            {/* Enhanced title with gradient text - Mobile Responsive */}
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-5 lg:mb-6 leading-tight bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-500 font-heading">
                              {country.name}
                            </h3>
                            
                            {/* Enhanced description with better typography - Mobile Responsive */}
                            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 lg:mb-10 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed font-medium">
                              {country.description}
                            </p>
                            
                            {/* Enhanced CTA button with gradient background - Mobile Responsive */}
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
                              <motion.div 
                                className="relative inline-flex items-center text-white font-bold text-sm sm:text-base lg:text-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-full transition-all duration-300 shadow-xl group-hover:shadow-2xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <span className="hidden sm:inline">Explore {country.name}</span>
                                <span className="sm:hidden">Explore</span>
                                <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <div className="text-center mb-20">
              <motion.div 
                className="inline-block mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="w-28 h-28 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden">
                  <Users className="w-14 h-14 text-white relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
                </div>
              </motion.div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent font-heading">
                Success Stories
              </h2>
              
              <motion.div 
                className="w-32 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-full mx-auto mb-8 shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: 128 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
              
              <p className="text-xl text-gray-600 max-w-4xl mx-auto font-medium">
                Hear from students who achieved their study abroad dreams with our support
              </p>
            </div>
          </AnimatedSection>

          {testimonialsLoading ? (
            <div className="text-center">
              <motion.div 
                className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-gray-600 text-lg font-medium">Loading testimonials...</p>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <motion.div 
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 relative overflow-hidden"
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-blue-50/50 rounded-3xl" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl" />
                
                <div className="text-center relative z-10">
                  <motion.div 
                    className="text-8xl mb-8"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    {testimonials[currentTestimonial]?.image || "👨‍🎓"}
                  </motion.div>
                  
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle
                          className={`w-7 h-7 ${i < (testimonials[currentTestimonial]?.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.blockquote 
                    className="text-xl text-gray-700 mb-8 italic leading-relaxed font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    "{testimonials[currentTestimonial]?.quote || 'EduExpress International made my study abroad dream come true!'}"
                  </motion.blockquote>
                  
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h4 className="font-bold text-gray-900 text-xl mb-2 font-heading">
                      {testimonials[currentTestimonial]?.name || "Student"}
                    </h4>
                    <p className="text-gray-600 text-lg">
                      {testimonials[currentTestimonial]?.university || "University"} • {testimonials[currentTestimonial]?.program || "Program"}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <motion.div 
                className="inline-block mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 font-heading">
                Latest Updates
              </h2>
              
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-8"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
              
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Stay informed with the latest news, scholarship opportunities, and study abroad insights
              </p>
            </AnimatedSection>
          </div>

          {updatesLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading latest updates...</p>
            </div>
          ) : updates.length > 0 ? (
            <AnimatedSection animation="stagger" delay={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {updates.slice(0, 4).map((update, index) => (
                  <motion.article
                    key={update._id}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100 hover:border-green-200 relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    onClick={() => window.open(`/updates/${update.slug}`, '_blank')}
                  >
                    {/* Featured Badge */}
                    {update.isFeatured && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                    
                    {/* Card Content */}
                    <div className="p-6 h-full flex flex-col">
                      {/* Category Badge */}
                      {update.category && (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 mb-4 w-fit">
                          {update.category}
                        </div>
                      )}
                      
                      {/* Title */}
                      <header className="mb-4 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 line-clamp-2 leading-tight font-heading">
                          {update.title}
                        </h3>
                      </header>
                      
                      {/* Meta Description */}
                      <div className="mb-6 flex-1">
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {update.metaDescription || update.excerpt || 'Stay updated with the latest news and opportunities.'}
                        </p>
                      </div>
                      
                      {/* Read More Link */}
                      <footer className="mt-auto">
                        <div className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm group-hover:translate-x-1 transition-all duration-300">
                          <span>Read More</span>
                          <ArrowRight className="ml-1 w-4 h-4" />
                        </div>
                      </footer>
                    </div>
                    
                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-emerald-50/0 group-hover:from-green-50/30 group-hover:to-emerald-50/20 transition-all duration-300 rounded-xl"></div>
                  </motion.article>
                ))}
              </div>
              
              {/* View All Updates Button */}
              <div className="text-center mt-12">
                <AnimatedButton
                  onClick={() => window.open('/updates', '_blank')}
                  className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white text-lg px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-3xl"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  View All Updates
                </AnimatedButton>
              </div>
            </AnimatedSection>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-6">📰</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2 font-heading">No Updates Available</h3>
              <p className="text-gray-500">Check back soon for the latest news and updates!</p>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-2xl" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div 
              className="inline-block mb-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto shadow-2xl border border-white/30 relative overflow-hidden">
                <span className="text-5xl relative z-10">🚀</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Ready to Study Abroad?
            </motion.h2>
            
            <motion.div 
              className="w-32 h-1.5 bg-white/60 rounded-full mx-auto mb-10 shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
            
            <motion.p 
              className="text-blue-100 text-xl lg:text-2xl mb-16 max-w-4xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Join <span className="font-bold text-yellow-300 bg-yellow-300/20 px-3 py-1 rounded-full">3000+ students</span> who achieved their study abroad dreams with our FREE scholarship assistance since 2018
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <AnimatedButton
                onClick={() => {
                  trackConsultationRequest('final_cta');
                  window.dispatchEvent(new CustomEvent('openQuickForm'));
                }}
                className="group relative bg-white text-indigo-600 hover:bg-gray-50 text-xl px-16 py-6 rounded-full font-bold shadow-2xl hover:shadow-3xl border border-white/20 backdrop-blur-sm"
                icon={<GraduationCap className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />}
                iconPosition="left"
              >
                <span className="relative z-10">Get FREE Consultation</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/50 to-indigo-50/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </AnimatedButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Optimized components */}
    </div>
  );
});

export default Home;
