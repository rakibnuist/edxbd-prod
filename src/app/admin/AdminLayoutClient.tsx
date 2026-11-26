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
  CalendarClock,
  FolderKanban,
  Landmark,
  EyeOff,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LogoutButton from '@/components/LogoutButton';
import LiveAlertsBell from '@/components/admin/LiveAlertsBell';
import { canAccessFinanceRole } from '@/lib/roles';

type NavGroup = 'operations' | 'team_controls' | 'website_cms';

const NAV: Array<{
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  group: NavGroup;
  exact?: boolean;
  badge?: string;
}> = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, group: 'operations', exact: true },
  { name: 'Student Leads', href: '/admin/leads', icon: Users2, group: 'operations', badge: 'Active' },
  { name: 'Application Tracker', href: '/admin/applications', icon: FolderKanban, group: 'operations', badge: 'Tracker' },
  { name: 'KPI & Attendance', href: '/admin/kpi', icon: Activity, group: 'operations', badge: 'Live' },
  { name: 'Finance & Ledger', href: '/admin/finance', icon: Landmark, group: 'operations', badge: 'Ledger' },
  { name: 'B2B Partners', href: '/admin/partnerships', icon: Handshake, group: 'operations' },
  { name: 'Team & Users', href: '/admin/users', icon: UserCog, group: 'team_controls' },
  { name: 'Settings & Flow', href: '/admin/settings', icon: SettingsIcon, group: 'team_controls' },
  { name: 'Universities', href: '/admin/universities', icon: GraduationCap, group: 'website_cms' },
  { name: 'Countries', href: '/admin/countries', icon: Globe2, group: 'website_cms' },
  { name: 'Content & Guides', href: '/admin/content', icon: FileText, group: 'website_cms' },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote, group: 'website_cms' },
  { name: 'Evidence Library', href: '/admin/evidence', icon: Images, group: 'website_cms' },
  { name: 'Company Records', href: '/admin/trust', icon: ShieldCheck, group: 'website_cms' },
  { name: 'Hidden Source Vault', href: '/admin/source-watches', icon: EyeOff, group: 'website_cms', badge: 'Private' },
  { name: 'GBP & LinkedIn Posts', href: '/admin/gbp-posts', icon: CalendarClock, group: 'website_cms' },
];

const GROUP_LABELS: Record<NavGroup, string> = {
  operations: 'CRM & Operations',
  team_controls: 'Team & Office Controls',
  website_cms: 'Website Catalog & Trust',
};

const COUNSELOR_ALLOWED_PREFIXES = ['/admin', '/admin/leads', '/admin/applications', '/admin/kpi'];

function isCounselorRouteAllowed(pathname: string): boolean {
  if (pathname === '/admin') return true;
  return COUNSELOR_ALLOWED_PREFIXES.some(
    (p) => p !== '/admin' && (pathname === p || pathname.startsWith(`${p}/`)),
  );
}

function isFinanceRoute(pathname: string): boolean {
  return pathname === '/admin/finance' || pathname.startsWith('/admin/finance/');
}

function AdminHeader({
  activeName,
  onOpenSidebar,
}: {
  activeName: string;
  onOpenSidebar: () => void;
}) {
  const { user } = useAuth();
  const isCounselor = user?.role === 'counselor';
  const isOpsAdmin = user?.role === 'operations_admin';
  const roleBadgeLabel = isCounselor
    ? 'COUNSELOR'
    : user?.role === 'super_admin'
      ? 'FULL CONTROL'
      : isOpsAdmin
        ? 'OPS ADMIN'
        : 'ADMIN';
  const roleDotClass = isCounselor
    ? 'bg-emerald-600'
    : isOpsAdmin
      ? 'bg-indigo-600'
      : 'bg-blue-600';
  const rolePillClass = isCounselor
    ? 'bg-emerald-100 text-emerald-800'
    : isOpsAdmin
      ? 'bg-indigo-100 text-indigo-800'
      : 'bg-blue-100 text-blue-800';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 py-2.5 sm:px-4 sm:py-3 backdrop-blur lg:px-6 print:hidden">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation drawer"
          className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        >
          <Menu size={18} />
        </button>

        {/* Mobile Brand Mark */}
        <Link href="/admin" className="flex items-center gap-1.5 lg:hidden">
          <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 font-heading text-[11px] font-bold text-slate-950 shadow-xs">
            EE
          </span>
        </Link>

        {/* Breadcrumb / Current Route Title */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="hidden text-xs font-semibold text-slate-400 sm:inline">
            {isCounselor ? 'Counselor Desk' : 'EduExpress Admin'}
          </span>
          <span className="hidden text-slate-300 sm:inline">/</span>
          <h1 className="max-w-[130px] truncate text-sm font-bold text-slate-900 xs:max-w-[200px] sm:max-w-none sm:text-base">
            {activeName}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dhaka Desk Live Indicator (Medium+ Screens) */}
        {!isCounselor && (
          <Link
            href="/admin/settings#lead-flow"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Dhaka GMT+6
          </Link>
        )}

        {/* Live Alerts Bell */}
        <LiveAlertsBell />

        {/* User Role Tag (Large Screens) */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
          <span className={`size-2 rounded-full ${roleDotClass}`} />
          <span className="max-w-[150px] truncate font-semibold text-slate-700">
            {user?.email || 'admin@eduexpressint.com'}
          </span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold ${rolePillClass}`}>
            {roleBadgeLabel}
          </span>
        </div>

        {/* View Public Website Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-[#0f3a5c] shadow-xs transition hover:bg-slate-50"
          title="Open live website in new tab"
        >
          <span className="hidden sm:inline">View site</span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </header>
  );
}

function MobileBottomNav({
  isCounselor,
  canSeeFinance,
  pathname,
  onOpenSidebar,
}: {
  isCounselor: boolean;
  canSeeFinance: boolean;
  pathname: string;
  onOpenSidebar: () => void;
}) {
  const items = isCounselor
    ? [
        { label: 'Leads', href: '/admin/leads', icon: Users2 },
        { label: 'Tracker', href: '/admin/applications', icon: FolderKanban },
        { label: 'Attendance', href: '/admin/kpi', icon: Activity },
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
      ]
    : [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
        { label: 'Leads', href: '/admin/leads', icon: Users2 },
        { label: 'Tracker', href: '/admin/applications', icon: FolderKanban },
        canSeeFinance
          ? { label: 'Finance', href: '/admin/finance', icon: Landmark }
          : { label: 'Attendance', href: '/admin/kpi', icon: Activity },
      ];

  const isItemActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch justify-around border-t border-slate-200/90 bg-white/95 px-1 py-1 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.06)] lg:hidden print:hidden"
      style={{ paddingBottom: 'calc(0.35rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {items.map((it) => {
        const Icon = it.icon;
        const active = isItemActive(it.href, it.exact);
        return (
          <Link
            key={it.label}
            href={it.href}
            className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
              active ? 'text-[#0f3a5c]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`relative flex size-8 items-center justify-center rounded-xl transition ${
                active ? 'bg-blue-50 text-[#0f3a5c]' : 'text-slate-500'
              }`}
            >
              <Icon size={19} className={active ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
            </div>
            <span
              className={`text-[10px] tracking-tight ${
                active ? 'font-bold text-[#0f3a5c]' : 'font-medium text-slate-500'
              }`}
            >
              {it.label}
            </span>
          </Link>
        );
      })}

      {/* Menu / Drawer button */}
      <button
        type="button"
        onClick={onOpenSidebar}
        className="flex flex-1 flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-800 transition-colors"
      >
        <div className="flex size-8 items-center justify-center rounded-xl text-slate-500">
          <Menu size={19} className="stroke-[1.8]" />
        </div>
        <span className="text-[10px] font-medium text-slate-500">More</span>
      </button>
    </nav>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const isCounselor = user?.role === 'counselor';
  const canSeeFinance = canAccessFinanceRole(user?.role);

  const visibleNav = isCounselor
    ? NAV.filter(
        (item) =>
          item.href === '/admin' ||
          item.href === '/admin/leads' ||
          item.href === '/admin/applications' ||
          item.href === '/admin/kpi',
      )
    : canSeeFinance
      ? NAV
      : NAV.filter((item) => item.href !== '/admin/finance');

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const activeItem = visibleNav.find((n) => isActive(n.href, n.exact));
  const blockedFinance = !canSeeFinance && isFinanceRoute(pathname);
  const routeAllowed = !blockedFinance && (!isCounselor || isCounselorRouteAllowed(pathname));

  const navSections: NavGroup[] = isCounselor
    ? ['operations']
    : ['operations', 'team_controls', 'website_cms'];

  const navLinks = (
    <nav className="flex-1 space-y-4 px-3 py-2">
      {navSections.map((group) => {
        const items = visibleNav.filter((item) => item.group === group);
        if (!items.length) return null;
        return (
          <div key={group} className="space-y-1">
            <p className="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {GROUP_LABELS[group]}
            </p>
            {items.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all ${
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
          </div>
        );
      })}
    </nav>
  );

  return (
        <div className="min-h-screen bg-slate-100/70 text-slate-900 print:bg-white">
          <div className="flex h-[100dvh] print:block print:h-auto">
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside
              className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-[#081c2e] text-white shadow-2xl transition-transform duration-300 lg:w-60 lg:static lg:translate-x-0 print:hidden ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              {/* Brand Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <Link
                  href="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 font-heading text-sm font-bold text-slate-950 shadow-sm">
                    EE
                  </div>
                  <div>
                    <div className="text-sm font-bold tracking-tight text-white">EduExpress</div>
                    <div className="text-[11px] font-medium text-cyan-300">Operations Console</div>
                  </div>
                </Link>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setSidebarOpen(false)}
                  className="inline-flex size-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile User Profile Header inside Drawer */}
              <div className="mx-3 mt-3 rounded-xl border border-white/10 bg-white/5 p-3 lg:hidden">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-600/30 text-xs font-bold text-blue-200">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'EE'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-white">
                      {user?.name || user?.email || 'EduExpress Staff'}
                    </p>
                    <p className="truncate text-[10px] text-slate-400">
                      {user?.role === 'counselor' ? 'Counselor Desk' : user?.role || 'Admin'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-2">
                {navLinks}
              </div>

              {/* System Health Status Card in Sidebar */}
              {isCounselor ? (
                <div className="mx-3 mb-2 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">Counselor Workspace</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400">
                    Dhaka Desk: GMT+6
                    <br />
                    Scope: Leads, Tracker &amp; KPI
                  </div>
                </div>
              ) : (
                <div className="mx-3 mb-2 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">Office Controls</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400">
                    Dhaka Time: GMT+6
                    <br />
                    GPS Check-In &amp; Lead Flow
                  </div>
                </div>
              )}

              {/* User / Logout */}
              <div className="border-t border-white/10 p-3">
                <LogoutButton />
              </div>
            </aside>

            {/* Main Area */}
            <div className="flex flex-1 flex-col overflow-hidden print:block print:overflow-visible">
              <AdminHeader
                activeName={activeItem?.name ?? 'Admin'}
                onOpenSidebar={() => setSidebarOpen(true)}
              />

              <main className="min-w-0 flex-1 overflow-auto bg-slate-50/70 p-3 pb-24 sm:p-6 sm:pb-6 lg:p-8 lg:pb-8 print:overflow-visible print:bg-white print:p-0">
                {routeAllowed ? (
                  children
                ) : blockedFinance && !isCounselor ? (
                  <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900">Financial Details Restricted</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Your account has full operational access across leads, applications, KPI, team, settings, and website management, while company financial records, payroll, and cash ledgers are restricted to full-control administrators.
                    </p>
                    <div className="mt-5 flex justify-center gap-3">
                      <Link
                        href="/admin"
                        className="rounded-xl bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white hover:bg-[#12436b]"
                      >
                        Back to Dashboard
                      </Link>
                      <Link
                        href="/admin/applications"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100"
                      >
                        Open Application Tracker
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900">Counselor Access Scope</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Your counselor account has access to the Leads Workspace, Application Tracker, and KPI &amp; Daily Check-In console. Administrator settings and site content pages are restricted.
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

              {/* Mobile Bottom Navigation Dock */}
              <MobileBottomNav
                isCounselor={isCounselor}
                canSeeFinance={canSeeFinance}
                pathname={pathname}
                onOpenSidebar={() => setSidebarOpen(true)}
              />
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
