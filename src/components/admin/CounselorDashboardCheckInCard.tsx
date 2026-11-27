'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileCheck2,
  FolderCheck,
  FolderKanban,
  HelpCircle,
  Loader2,
  MapPin,
  PhoneCall,
  Sparkles,
  Users2,
} from 'lucide-react';
import { captureBrowserLocation } from '@/lib/browser-geolocation';
import type { CounselorDeskSummary } from '@/lib/office-pulse';

interface Props {
  desk: CounselorDeskSummary;
  onCheckInSuccess?: () => Promise<void> | void;
}

export default function CounselorDashboardCheckInCard({ desk, onCheckInSuccess }: Props) {
  const [locating, setLocating] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gpsTroubleshootOpen, setGpsTroubleshootOpen] = useState(false);
  const [checkedInState, setCheckedInState] = useState<{
    checkIn: string;
    status: string;
    locationLabel: string;
  } | null>(desk.checkIn ? { checkIn: desk.checkIn, status: desk.attendanceStatus, locationLabel: desk.locationLabel } : null);

  const isCheckedIn = Boolean(checkedInState?.checkIn || desk.checkIn);

  const handleCheckIn = async () => {
    setError(null);
    setNotice(null);
    setGpsTroubleshootOpen(false);
    setCheckingIn(true);
    setLocating(true);

    try {
      const locPayload = await captureBrowserLocation();
      setLocating(false);

      if (locPayload.locationError === 'denied') {
        setGpsTroubleshootOpen(true);
      }

      const res = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: desk.employeeId || undefined,
          mode: 'checkin',
          ...locPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Check-in failed. Please retry.');
      }

      const locLabel = data.locationStatus?.locationLabel || (locPayload.latitude ? 'GPS Verified' : 'Standard Check-In');
      setCheckedInState({
        checkIn: data.checkIn || desk.dhakaTime,
        status: data.status || 'Present',
        locationLabel: locLabel,
      });

      setNotice(`স্বাগতম! আপনি সফলভাবে চেক-ইন করেছেন (${data.checkIn || desk.dhakaTime}) · ${locLabel}`);
      if (onCheckInSuccess) {
        await onCheckInSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Check-in failed. Please try again.');
    } finally {
      setLocating(false);
      setCheckingIn(false);
    }
  };

  return (
    <div className="w-full">
      {!isCheckedIn ? (
        /* ================= 1-TAP CHECK-IN HERO CARD ================= */
        <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/90 via-white to-slate-50 p-5 shadow-sm sm:p-6 transition hover:shadow-md">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left Column: Greeting & Status */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900">
                  <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
                  Dhaka BST · {desk.dhakaTime}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                  {desk.empId || 'EDX'} · {desk.employeeName || 'Counselor'}
                </span>
              </div>

              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-emerald-600 shrink-0" />
                  আজকের কাউন্সেলিং সেশন শুরু করুন
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-600 max-w-xl">
                  অফিস চেক-ইন দিয়ে আজকের স্টুডেন্ট লিড ও কল লগিং সেশন সক্রিয় করুন। আপনার লোকেশন স্বয়ংক্রিয়ভাবে রেকর্ড হবে।
                </p>
              </div>
            </div>

            {/* Right Column: 1-Tap Check-In CTA Button */}
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <button
                type="button"
                disabled={checkingIn || locating}
                onClick={handleCheckIn}
                className="w-full sm:w-auto inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-7 py-3 text-sm sm:text-base font-extrabold text-white shadow-md transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {checkingIn || locating ? (
                  <>
                    <Loader2 size={20} className="animate-spin text-emerald-100" />
                    <span>{locating ? 'GPS লোকেশন যাচাই হচ্ছে...' : 'চেক-ইন হচ্ছে...'}</span>
                  </>
                ) : (
                  <>
                    <MapPin size={20} className="text-emerald-200" />
                    <span>Check In Now · অফিস চেক-ইন</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-slate-400 text-center sm:text-right flex items-center justify-center sm:justify-end gap-1">
                <MapPin size={11} /> ধানমন্ডি হেড অফিস ভেরিফায়েড
              </span>
            </div>
          </div>

          {/* Feedback & Error / Notice */}
          {notice && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-100/90 border border-emerald-300 p-3 text-xs font-bold text-emerald-900">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start justify-between gap-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-900">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setGpsTroubleshootOpen((v) => !v)}
                className="underline font-bold shrink-0 hover:text-rose-950"
              >
                {gpsTroubleshootOpen ? 'Hide Tip' : 'Location Help'}
              </button>
            </div>
          )}

          {/* Location Troubleshooting Guide for Mobile */}
          {gpsTroubleshootOpen && (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-950">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                <HelpCircle size={14} /> ব্রাউজারে লোকেশন অনুমতি দেওয়ার নিয়ম:
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-amber-900/90">
                <li>মোবাইলের বা ব্রাউজারের অ্যাড্রেস বারের বাম পাশে তালা (🔒) বা টিউন আইকনে চাপ দিন।</li>
                <li><strong>Location</strong> বা <strong>অনুমতি</strong> অপশনে গিয়ে “Allow” বা “অনুমতি দিন” সিলেক্ট করুন।</li>
                <li>এরপর পুনরায় <strong>Check In Now</strong> বাটনে ট্যাপ করুন।</li>
              </ol>
            </div>
          )}
        </div>
      ) : (
        /* ================= ON-DUTY ACTIVE CONFIRMATION CARD ================= */
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Checked in status & location */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-emerald-900">
                  <CheckCircle2 size={13} className="text-emerald-700" />
                  Checked In at {checkedInState?.checkIn || desk.checkIn} ({checkedInState?.status || desk.attendanceStatus})
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                  <MapPin size={11} className="text-emerald-600" />
                  {checkedInState?.locationLabel || desk.locationLabel || 'Verified Office'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {desk.employeeName ? `${desk.employeeName} · ` : ''}কাউন্সেলিং সেশন রানিং রয়েছে। কল ও স্টুডেন্ট ডিসকাশন স্বয়ংক্রিয়ভাবে ট্র্যাকিং হচ্ছে।
              </p>
            </div>

            {/* Right: Quick Action Link to Check-Out & EOD (Inside KPI) */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href="/admin/leads"
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800"
              >
                <Users2 size={14} /> Open Leads Workspace
              </Link>
              <Link
                href="/admin/kpi"
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50"
                title="Conclude your work day and submit daily reflection"
              >
                <FileCheck2 size={14} className="text-slate-500" /> EOD &amp; Check-Out Console →
              </Link>
            </div>
          </div>

          {/* Live Today Metrics Strip */}
          <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-emerald-100 text-xs">
            <div className="rounded-xl bg-white/80 border border-emerald-100 p-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <PhoneCall size={11} className="text-sky-600" /> Calls Logged Today
              </span>
              <p className="mt-1 font-heading text-lg font-bold text-slate-900 tabular-nums">
                {desk.todayCallsLogged ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-white/80 border border-emerald-100 p-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Users2 size={11} className="text-emerald-600" /> Students Touched
              </span>
              <p className="mt-1 font-heading text-lg font-bold text-slate-900 tabular-nums">
                {desk.todayTouchedLeads ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-white/80 border border-emerald-100 p-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <FolderKanban size={11} className="text-[#0f3a5c]" /> Files Opened
              </span>
              <p className="mt-1 font-heading text-lg font-bold text-slate-900 tabular-nums">
                {desk.todayFilesOpened ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-white/80 border border-emerald-100 p-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Clock size={11} className="text-amber-600" /> Duty Time Elapsed
              </span>
              <p className="mt-1 font-heading text-lg font-bold text-slate-900 tabular-nums">
                {desk.hoursWorked > 0 ? `${desk.hoursWorked}h` : 'In Progress'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
