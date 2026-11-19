'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  MessageSquareQuote,
  Users2,
  Handshake,
  ContactRound,
  GraduationCap,
  Globe2,
  UserCog,
  Settings as SettingsIcon,
  Menu,
  X,
  ShieldCheck,
  Images,
  ExternalLink,
  Activity,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LogoutButton from '@/components/LogoutButton';
import LiveAlertsBell from '@/components/admin/LiveAlertsBell';

const NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Leads', href: '/admin/leads', icon: Users2, badge: 'Active' },
  { name: 'KPI & Workflow', href: '/admin/kpi', icon: Activity, badge: 'Live' },
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

const COUNSELOR_ALLOWED_PREFIXES = ['/admin', '/admin/leads', '/admin/kpi'];

function isCounselorRouteAllowed(pathname: string): boolean {
  if (pathname === '/admin') return true;
  return COUNSELOR_ALLOWED_PREFIXES.some(
    (p) => p !== '/admin' && (pathname === p || pathname.startsWith(`${p}/`)),
  );
}

function AdminHeader({ activeName }: { activeName: string }) {
  const { user } = useAuth();
  const isCounselor = user?.role === 'counselor';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400">
          {isCounselor ? 'EduExpress Counselor Desk' : 'EduExpress Admin'}
        </span>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-bold text-slate-900">{activeName}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Meta Sync Health Pill */}
        {!isCounselor && (
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Meta Leads: Live (2m)
          </div>
        )}

        {/* Live Hot-Lead & Portal Alerts Bell */}
        <LiveAlertsBell />

        {/* User Role Tag */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
          <span className={`size-2 rounded-full ${isCounselor ? 'bg-emerald-600' : 'bg-blue-600'}`} />
          <span className="font-semibold text-slate-700">{user?.email || 'admin@eduexpressint.com'}</span>
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold ${
              isCounselor ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {isCounselor ? 'COUNSELOR' : user?.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
          </span>
        </div>

        {/* View Public Website Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0f3a5c] shadow-sm transition hover:bg-slate-50"
        >
          <span>View site</span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </header>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const isCounselor = user?.role === 'counselor';

  const visibleNav = isCounselor
    ? NAV.filter((item) => item.href === '/admin' || item.href === '/admin/leads' || item.href === '/admin/kpi')
    : NAV;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const activeItem = visibleNav.find((n) => isActive(n.href, n.exact));
  const routeAllowed = !isCounselor || isCounselorRouteAllowed(pathname);

  const navLinks = (
    <nav className="flex-1 space-y-1 px-3 py-2">
      {visibleNav.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
              active
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon
                size={17}
                className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}
              />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  active ? 'bg-white/20 text-white' : 'bg-amber-400/20 text-amber-300'
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
        <div className="min-h-screen bg-slate-100/70 text-slate-900">
          <div className="flex h-[100dvh]">
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside
              className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-[#081c2e] text-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              {/* Brand Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <Link href="/admin" className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 font-heading text-sm font-bold text-slate-950 shadow-sm">
                    EE
                  </div>
                  <div>
                    <div className="text-sm font-bold tracking-tight text-white">EduExpress</div>
                    <div className="text-[11px] font-medium text-cyan-300">Operations Console</div>
                  </div>
                </Link>
                <button
                  aria-label="Close menu"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-2">
                <p className="px-5 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Management
                </p>
                {navLinks}
              </div>

              {/* System Health Status Card in Sidebar */}
              <div className="mx-3 mb-2 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-300">System Engine</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    Operational
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-slate-400">
                  Meta Graph Sync: 2m interval
                  <br />
                  Lead Webhook: Active
                </div>
              </div>

              {/* User / Logout */}
              <div className="border-t border-white/10 p-3">
                <LogoutButton />
              </div>
            </aside>

            {/* Main Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 lg:hidden">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                  aria-label="Open navigation menu"
                >
                  <Menu size={20} />
                </button>
                <span className="font-heading text-sm font-bold text-[#0f3a5c]">EduExpress Admin</span>
                <Link href="/" className="text-xs font-semibold text-blue-700">
                  Site ↗
                </Link>
              </div>

              <AdminHeader activeName={activeItem?.name ?? 'Admin'} />

              <main className="min-w-0 flex-1 overflow-auto bg-slate-50/70 p-4 sm:p-6 lg:p-8">
                {routeAllowed ? (
                  children
                ) : (
                  <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900">Counselor Access Scope</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Your counselor account has access to the Leads Workspace and KPI &amp; Daily Check-In console. Administrator settings and site content pages are restricted.
                    </p>
                    <div className="mt-5 flex justify-center gap-3">
                      <Link
                        href="/admin/leads"
                        className="rounded-xl bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white hover:bg-[#12436b]"
                      >
                        Go to Leads
                      </Link>
                      <Link
                        href="/admin/kpi"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100"
                      >
                        Go to KPI &amp; Check-In
                      </Link>
                    </div>
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
  );
}

/** Interactive sidebar layout shell for authenticated admin and counselor routes. */
export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AdminShell>{children}</AdminShell>
      </ProtectedRoute>
    </AuthProvider>
  );
}
