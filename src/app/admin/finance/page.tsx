import type { Metadata } from 'next';
import FinanceWorkspaceClient from '@/components/admin/FinanceWorkspaceClient';

export const metadata: Metadata = {
  title: 'Financial Control Center | EduExpress Admin',
  robots: { index: false, follow: false },
};

export default function AdminFinancePage() {
  return <FinanceWorkspaceClient />;
}
