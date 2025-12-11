// Professional Animation Library for EduExpress International
// Provides consistent, performant animations throughout the application

import { Variants } from 'framer-motion';

// Base animation configurations
export const animationConfig = {
  // Timing functions for consistent feel
  ease: {
    smooth: [0.4, 0, 0.2, 1] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
    elastic: [0.175, 0.885, 0.32, 1.275] as const,
    snappy: [0.25, 0.46, 0.45, 0.94] as const,
  },

  // Duration presets
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
  },

  // Stagger delays
  stagger: {
    fast: 0.1,
    normal: 0.15,
    slow: 0.2,
  }
};

// Page transition animations
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.smooth,
    },
  },
};

// Fade in animations
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
};

export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
};

export const fadeInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
};

export const fadeInRight: Variants = {
  initial: {
    opacity: 0,
    x: 30,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
};

// Scale animations
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.bounce,
    },
  },
};

export const scaleInCenter: Variants = {
  initial: {
    opacity: 0,
    scale: 0.5,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: animationConfig.duration.slow,
      ease: animationConfig.ease.elastic,
    },
  },
};

// Stagger animations for lists
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: animationConfig.stagger.normal,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
};

// Card animations
export const cardHover: Variants = {
  initial: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.02,
    y: -8,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: animationConfig.duration.fast,
    },
  },
};

// Button animations
export const buttonHover: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: animationConfig.duration.fast,
    },
  },
};

// Modal animations
export const modalBackdrop: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.smooth,
    },
  },
};

export const modalContent: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.bounce,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.smooth,
    },
  },
};

// Loading animations
export const loadingSpinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const loadingPulse: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: animationConfig.ease.smooth,
    },
  },
};

// Text animations
export const textReveal: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.slow,
      ease: animationConfig.ease.smooth,
    },
  },
};

export const textSlideUp: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.slower,
      ease: animationConfig.ease.smooth,
    },
  },
};

// Icon animations
export const iconBounce: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    transition: {
      duration: animationConfig.duration.fast,
      ease: animationConfig.ease.bounce,
    },
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: animationConfig.duration.fast,
    },
  },
};

export const iconRotate: Variants = {
  initial: {
    rotate: 0,
  },
  hover: {
    rotate: 360,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
};

// Progress animations
export const progressBar: Variants = {
  initial: {
    width: '0%',
  },
  animate: {
    width: '100%',
    transition: {
      duration: animationConfig.duration.slower,
      ease: animationConfig.ease.smooth,
    },
  },
};

// Slide animations
export const slideInFromLeft: Variants = {
  initial: {
    x: '-100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
};

export const slideInFromRight: Variants = {
  initial: {
    x: '100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
};

// Floating animations
export const float: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: animationConfig.ease.smooth,
    },
  },
};

export const floatReverse: Variants = {
  animate: {
    y: [10, -10, 10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: animationConfig.ease.smooth,
    },
  },
};

// Utility functions
export const createStaggerAnimation = (delay: number = animationConfig.stagger.normal) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: delay,
    },
  },
});

export const createFadeInAnimation = (direction: 'up' | 'down' | 'left' | 'right' = 'up', distance: number = 30) => ({
  initial: {
    opacity: 0,
    ...(direction === 'up' && { y: distance }),
    ...(direction === 'down' && { y: -distance }),
    ...(direction === 'left' && { x: distance }),
    ...(direction === 'right' && { x: -distance }),
  },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: animationConfig.duration.normal,
      ease: animationConfig.ease.smooth,
    },
  },
});

// Intersection Observer hook for scroll animations
export const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return { ref, isVisible };
};

// Re-export React hooks for convenience
import { useState, useRef, useEffect } from 'react';
