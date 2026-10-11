'use client';

import { usePathname } from 'next/navigation';
import { isStandaloneCampaignRoute } from '@/lib/campaign-routes';

export default function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hidden = pathname.startsWith('/admin')
    || pathname.startsWith('/dashboard')
    || isStandaloneCampaignRoute(pathname);

  if (hidden) return null;
  return <>{children}</>;
}
