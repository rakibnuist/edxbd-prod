'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const StickyDishaChat = dynamic(() => import('./StickyDishaChat'), {
  ssr: false,
});

export default function LazyStickyDishaChat(props: { phoneNumber?: string }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/embed')) return null;
  return <StickyDishaChat {...props} />;
}
