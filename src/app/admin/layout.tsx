'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, FileText, MessageSquareQuote, Users2, Handshake, ContactRound,
  GraduationCap, Globe2, UserCog, Settings as SettingsIcon, Menu, X, ShieldCheck, Images,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import LogoutButton from '@/components/LogoutButton';

const NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Leads', href: '/admin/leads', icon: Users2 },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  { name: 'Universities', href: '/admin/universities', icon: GraduationCap },
  { name: 'Evidence Library', href: '/admin/evidence', icon: Images },
  { name: 'Team', href: '/admin/teams', icon: ContactRound },
  { name: 'Company Records', href: '/admin/trust', icon: ShieldCheck },
  { name: 'Partnerships', href: '/admin/partnerships', icon: Handshake },
  { name: 'Countries', href: '/admin/countries', icon: Globe2 },
  { name: 'Users', href: '/admin/users', icon: UserCog },
  { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const activeItem = NAV.find((n) => isActive(n.href, n.exact));

  const navLinks = (
    <nav className="flex-1 space-y-1 px-3">
      {NAV.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-gray-200/70 text-gray-950'
                : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-950'
            }`}
          >
            <Icon size={18} className={active ? 'text-gray-900' : ''} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-[#f4f6f7]">
          <div className="flex h-[100dvh]">
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
              className={`fixed inset-y-0 left-0 z-50 flex w-56 flex-col bg-[#f4f6f7] transition-transform duration-300 lg:static lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="flex items-center justify-between px-5 py-5">
                <div>
                  <div className="text-base font-semibold text-[#174f7a]">EduExpress</div>
                  <div className="text-xs text-gray-600">Admissions workspace</div>
                </div>
                <button aria-label="Close menu" onClick={() => setSidebarOpen(false)} className="rounded-md p-1 text-gray-600 hover:text-gray-900 lg:hidden">
                  <X size={20} />
                </button>
              </div>
              {navLinks}
              <div className="border-t border-gray-200 p-4">
                <LogoutButton />
              </div>
            </aside>

            {/* Main */}
            <div className="flex flex-1 flex-col overflow-hidden">
              <header className="sticky top-0 z-30 flex items-center justify-between bg-[#f4f6f7] px-4 py-3 lg:px-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                    aria-label="Open menu"
                  >
                    <Menu size={22} />
                  </button>
                  <span className="text-sm font-medium text-gray-600">
                    <span className="mr-2 text-[#174f7a] lg:hidden">EduExpress</span>{activeItem?.name ?? 'Admin'}
                  </span>
                </div>
                <Link href="/" className="text-xs font-medium text-[#174f7a] hover:underline">
                  View site ↗
                </Link>
              </header>

              <main className="min-w-0 flex-1 overflow-auto bg-white lg:mb-2 lg:mr-2 lg:rounded-2xl lg:border lg:border-gray-200">
                <div className="p-4 sm:p-6">{children}</div>
              </main>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
