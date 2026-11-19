'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Clock, ExternalLink, FileUp, Flame, GraduationCap, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { NotificationItem } from '@/app/api/admin/notifications/route';

const STORAGE_PREFIX = 'eduexpress_alerts_seen_v1_';

export default function LiveAlertsBell() {
  const { user, isAuthenticated, authenticatedFetch } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [lastSeenAt, setLastSeenAt] = useState<number>(0);
  const [refreshTick, setRefreshTick] = useState(0);

  const storageKey = user?.id ? `${STORAGE_PREFIX}${user.id}` : '';

  useEffect(() => {
    if (!isAuthenticated || !storageKey) return;
    let active = true;
    const savedRaw = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null;
    const parsedSaved = savedRaw ? Number(savedRaw) : 0;

    authenticatedFetch('/api/admin/notifications', { cache: 'no-store' })
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setItems(Array.isArray(data.items) ? data.items : []);
        if (Number.isFinite(parsedSaved) && parsedSaved > 0) {
          setLastSeenAt(parsedSaved);
        }
      })
      .catch(() => {});

    const interval = window.setInterval(() => {
      setRefreshTick((t) => t + 1);
    }, 60_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [authenticatedFetch, isAuthenticated, refreshTick, storageKey]);

  const unreadCount = items.filter((item) => Date.parse(item.createdAt) > lastSeenAt).length;

  const markAllSeen = () => {
    const now = Date.now();
    setLastSeenAt(now);
    if (storageKey && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, String(now));
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) setRefreshTick((t) => t + 1);
        }}
        aria-label="Live lead and student portal alerts"
        className="relative inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-extrabold text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs font-extrabold text-slate-900">Live Admissions Alerts</p>
                <p className="text-[11px] text-slate-500">Hot GPA leads, SLA timers &amp; portal activity</p>
              </div>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={markAllSeen}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-50"
                >
                  <CheckCheck size={12} /> Mark seen
                </button>
              )}
            </div>

            <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
              {items.map((item) => {
                const isNew = Date.parse(item.createdAt) > lastSeenAt;
                const Icon =
                  item.kind === 'hot_lead'
                    ? Flame
                    : item.kind === 'student_doc_upload'
                      ? FileUp
                      : item.kind === 'student_message'
                        ? MessageSquare
                        : item.kind === 'scholarship_notice'
                          ? GraduationCap
                          : Clock;
                const tone =
                  item.kind === 'hot_lead'
                    ? 'bg-amber-50 text-amber-700'
                    : item.kind === 'student_doc_upload' || item.kind === 'student_message'
                      ? 'bg-blue-50 text-blue-700'
                      : item.kind === 'scholarship_notice'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600';

                return (
                  <Link
                    key={item.id}
                    href={item.href || (item.leadId ? `/admin/leads?lead=${encodeURIComponent(item.leadId)}` : '/admin/leads')}
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3 px-4 py-3 transition hover:bg-slate-50 ${
                      isNew ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${tone}`}>
                      <Icon size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-xs font-bold text-slate-900">{item.title}</p>
                        <ExternalLink size={11} className="shrink-0 text-slate-400" />
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-600">{item.subtitle}</p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {new Date(item.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' })}
                      </p>
                    </div>
                  </Link>
                );
              })}

              {items.length === 0 && (
                <div className="px-4 py-8 text-center text-xs text-slate-500">
                  All caught up — no pending hot leads or student portal updates in the last 72h.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
