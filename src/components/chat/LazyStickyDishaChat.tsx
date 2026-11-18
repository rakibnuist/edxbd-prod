'use client';

import dynamic from 'next/dynamic';

const StickyDishaChat = dynamic(() => import('./StickyDishaChat'), {
  ssr: false,
});

export default function LazyStickyDishaChat(props: { phoneNumber?: string }) {
  return <StickyDishaChat {...props} />;
}
