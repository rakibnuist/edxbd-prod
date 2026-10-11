'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import LightHeader from './LightHeader';
import { isStandaloneCampaignRoute } from '@/lib/campaign-routes';

const ConditionalHeader = ({ office }: { office?: { phonePrimary: string; hours: string } }) => {
  const pathname = usePathname();

  // Hide header for admin and dashboard routes
  // This logic is safe for SSR as usePathname works on initial render
  const shouldHideHeader = pathname.startsWith('/admin')
    || pathname.startsWith('/dashboard')
    || isStandaloneCampaignRoute(pathname);


  // Add/remove class to body for dashboard routes - this only runs on client
  useEffect(() => {
    if (shouldHideHeader) {
      document.body.classList.add('dashboard-mode');
    } else {
      document.body.classList.remove('dashboard-mode');
    }
  }, [shouldHideHeader]);

  // Render appropriate header based on route
  if (shouldHideHeader) {
    return null;
  }


  return <LightHeader office={office} />;
};

export default ConditionalHeader;
