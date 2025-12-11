'use client';

import { useEffect } from 'react';
import { trackEngagement, trackPageView, getUserDevice } from '@/lib/vercel-analytics';

interface EngagementTrackerProps {
  pageName: string;
}

const EngagementTracker = ({ pageName }: EngagementTrackerProps) => {
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const startTime = Date.now();

    // Track scroll engagement
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        if (scrollPercent >= 50 && scrollPercent < 100) {
          trackEngagement('scroll_50', {
            page: pageName,
            device: getUserDevice(),
            scroll_percent: Math.round(scrollPercent)
          });
        } else if (scrollPercent >= 100) {
          trackEngagement('scroll_100', {
            page: pageName,
            device: getUserDevice(),
            scroll_percent: Math.round(scrollPercent)
          });
        }
      }, 100);
    };

    // Track time on page
    const trackTimeOnPage = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      if (timeSpent === 30) {
        trackEngagement('time_30s', {
          page: pageName,
          device: getUserDevice(),
          time_spent: timeSpent
        });
      } else if (timeSpent === 60) {
        trackEngagement('time_60s', {
          page: pageName,
          device: getUserDevice(),
          time_spent: timeSpent
        });
      } else if (timeSpent === 120) {
        trackEngagement('time_120s', {
          page: pageName,
          device: getUserDevice(),
          time_spent: timeSpent
        });
        clearInterval(timeTracker);
      }
    };

    // Start time tracking
    const timeTracker = setInterval(trackTimeOnPage, 1000);

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track page view
    trackPageView(pageName, {
      device: getUserDevice(),
      timestamp: new Date().toISOString()
    });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      clearInterval(timeTracker);
    };
  }, [pageName]);

  return null; // This component doesn't render anything
};

export default EngagementTracker;
