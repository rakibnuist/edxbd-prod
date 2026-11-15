import type { Metadata } from 'next';
import AdminLayoutClient from './AdminLayoutClient';

export const metadata: Metadata = {
  title: { absolute: 'Admin | EduExpress International' },
  robots: { index: false, follow: false, noarchive: true },
};

/** Server wrapper enforcing non-indexable metadata across all /admin routes. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
