'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, FileText, MessageSquareQuote, Users2, Handshake,
  GraduationCap, Globe2, UserCog, Settings as SettingsIcon, Menu, X,
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

  const NavLinks = () => (
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
                ? 'bg-white/10 text-white ring-1 ring-white/15'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon size={18} className={active ? 'text-[#64b5df]' : ''} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-[#f4f8fa]">
          <div className="flex h-screen">
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
              className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#08263c] transition-transform duration-300 lg:static lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="flex items-center justify-between px-5 py-5">
                <div>
                  <div className="text-base font-bold text-white">EduExpress</div>
                  <div className="text-[11px] font-medium uppercase tracking-widest text-[#64b5df]">Admin Console</div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="rounded-md p-1 text-white/60 hover:text-white lg:hidden">
                  <X size={20} />
                </button>
              </div>
              <NavLinks />
              <div className="border-t border-white/10 p-4">
                <LogoutButton />
              </div>
            </aside>

            {/* Main */}
            <div className="flex flex-1 flex-col overflow-hidden">
              <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:px-8">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                    aria-label="Open menu"
                  >
                    <Menu size={22} />
                  </button>
                  <h1 className="text-base font-semibold text-[#08263c] sm:text-lg">
                    {activeItem?.name ?? 'Admin'}
                  </h1>
                </div>
                <Link href="/" className="text-xs font-medium text-[#174f7a] hover:underline">
                  View site ↗
                </Link>
              </header>

              <main className="flex-1 overflow-auto">
                <div className="p-4 sm:p-6 lg:p-8">{children}</div>
              </main>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
