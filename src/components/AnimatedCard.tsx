'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cardHover, fadeInUp } from '@/lib/animations';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  delay?: number;
  animation?: 'fadeInUp' | 'scaleIn' | 'none';
}

const AnimatedCard = ({
  children,
  className = '',
  hoverable = true,
  onClick,
  delay = 0,
  animation = 'fadeInUp',
}: AnimatedCardProps) => {
  const baseClasses = 'bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300';
  const hoverClasses = hoverable ? 'cursor-pointer' : '';
  const cardClasses = `${baseClasses} ${hoverClasses} ${className}`;

  const getAnimationVariants = () => {
    if (animation === 'none') return {};

    const variants = {
      fadeInUp: {
        ...fadeInUp,
        animate: {
          ...fadeInUp.animate,
          transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
            delay,
          },
        },
      },
      scaleIn: {
        initial: { opacity: 0, scale: 0.9 },
        animate: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.3,
            delay,
            ease: [0.4, 0, 0.2, 1],
          },
        },
      },
    };

    return variants[animation];
  };

  const animationVariants = getAnimationVariants();

  return (
    <motion.div
      className={cardClasses}
      variants={animationVariants}
      initial="initial"
      animate="animate"
      whileHover={hoverable ? "hover" : undefined}
      whileTap={hoverable ? "tap" : undefined}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </motion.div>
  );
};

// Specialized card variants
export const FeatureCard = ({
  children,
  className = '',
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => (
  <AnimatedCard
    className={`p-6 hover:shadow-2xl hover:border-blue-200 ${className}`}
    delay={delay}
    animation="fadeInUp"
  >
    {children}
  </AnimatedCard>
);

export const TestimonialCard = ({
  children,
  className = '',
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => (
  <AnimatedCard
    className={`p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 ${className}`}
    delay={delay}
    animation="scaleIn"
    hoverable={false}
  >
    {children}
  </AnimatedCard>
);

export const StatsCard = ({
  children,
  className = '',
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => (
  <AnimatedCard
    className={`p-6 text-center bg-gradient-to-br from-white to-gray-50 ${className}`}
    delay={delay}
    animation="fadeInUp"
  >
    {children}
  </AnimatedCard>
);

export default AnimatedCard;
