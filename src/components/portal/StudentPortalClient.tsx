'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Award, Building2, Check, CheckCircle2, Clock, ExternalLink, FileCheck2,
  Globe, GraduationCap, MessageCircle, MessageSquare, Phone, Plane, QrCode,
  RefreshCw, Send, ShieldCheck, Sparkles, Upload, X,
} from 'lucide-react';
import { FLAGSHIP_MILESTONES, type MilestoneKey } from '@/lib/student-portal';
import { toSafeExternalUrl } from '@/lib/safe-url';

type PortalPayload = {
  student: {
    name: string;
    country: string;
    program: string;
    university: string | null;
    degree: string | null;
    gpa: number | null;
    status: string;
    applicationStage: string;
    visaDeadline: string | null;
    departureDate: string | null;
    milestoneStep: number;
    progressPct: number;
    updatedAt: string;
  };
  counselor: {
    name: string;
    role: string;
    phone: string;
    whatsappUrl: string | null;
  };
  universityApps: Array<{
    id: string;
    university: string;
    program: string | null;
    status: string;
    applicationId: string | null;
    submittedOn: string | null;
    decisionOn: string | null;
  }>;
  documents: Array<{
    id: string;
    docType: string;
    status: string;
    notes: string | null;
    studentUploadedUrl: string | null;
  }>;
  updates: Array<{
    id: string;
    type: string;
    actorName: string | null;
    fromValue: string | null;
    toValue: string | null;
    details: string | null;
    createdAt: string;
  }>;
};

const STEP_ICONS: Record<MilestoneKey, typeof Send> = {
  submitted: Send,
  review: Building2,
  admission: Award,
  jw202: ShieldCheck,
  visa: Sparkles,
  fly: Plane,
};

const DOC_STATUS_LABELS: Record<string, { bn: string; en: string; cls: string }> = {
  verified: { bn: 'ভেরিফায়েড', en: 'Verified', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  received: { bn: 'গৃহীত (রিভিউতে)', en: 'Received', cls: 'bg-blue-50 text-blue-800 border-blue-200' },
  rejected: { bn: 'সংশোধন প্রয়োজন', en: 'Needs Fix', cls: 'bg-red-50 text-red-800 border-red-200' },
  not_required: { bn: 'প্রয়োজন নেই', en: 'Optional', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
  pending: { bn: 'বাকি আছে', en: 'Pending', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
};

const UNI_STATUS_LABELS: Record<string, { bn: string; en: string; cls: string }> = {
  admitted: { bn: 'ভর্তি অনুমোদিত 🎉', en: 'Admitted 🎉', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  submitted: { bn: 'সাবমিট সম্পন্ন', en: 'Submitted', cls: 'bg-blue-50 text-blue-800 border-blue-200' },
  ready: { bn: 'প্রস্তুত', en: 'Ready', cls: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  returned: { bn: 'সংশোধন', en: 'Returned', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  rejected: { bn: 'প্রত্যাখ্যাত', en: 'Not Selected', cls: 'bg-red-50 text-red-800 border-red-200' },
  documents: { bn: 'ফাইল প্রস্তুতি', en: 'Preparing', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export default function StudentPortalClient({ token }: { token: string }) {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [data, setData] = useState<PortalPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [driveInput, setDriveInput] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [msgInput, setMsgInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  const [refreshTick, setRefreshTick] = useState(0);

  const loadPortal = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRefreshTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/public/track/${encodeURIComponent(token)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Tracking portal not found.');
        return json;
      })
      .then((json) => {
        if (!controller.signal.aborted) {
          setData(json);
          setError(null);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Unable to load portal.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [token, refreshTick]);

  const handleSubmitDocUrl = async (docId: string) => {
    if (!driveInput.trim()) return;
    setUploadingDoc(true);
    setNotice(null);
    try {
      const res = await fetch(
        `/api/public/track/${encodeURIComponent(token)}/documents/${encodeURIComponent(docId)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: driveInput.trim() }),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed.');
      setActiveDocId(null);
      setDriveInput('');
      setNotice(
        lang === 'bn'
          ? 'আপনার ডকুমেন্ট লিংক সফলভাবে জমা হয়েছে!'
          : 'Document Drive link submitted successfully!',
      );
      await loadPortal();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setSendingMsg(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/public/track/${encodeURIComponent(token)}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgInput.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not send message.');
      setMsgInput('');
      setNotice(
        lang === 'bn'
          ? 'আপনার বার্তা কাউন্সেলরের কাছে পাঠানো হয়েছে।'
          : 'Message sent to your counselor.',
      );
      await loadPortal();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Message error.');
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm border border-slate-200 text-sm font-semibold text-slate-700">
          <RefreshCw size={18} className="animate-spin text-blue-600" />
          <span>অ্যাপ্লিকেশন ট্র্যাকিং লোড হচ্ছে…</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <GraduationCap size={40} className="mx-auto text-slate-300" />
          <h1 className="mt-4 text-lg font-bold text-slate-900">Tracking Link Unavailable</h1>
          <p className="mt-2 text-sm text-slate-600">
            {error || 'This student tracking link is inactive or invalid. Please ask your EduExpress counselor for your latest link.'}
          </p>
          <a
            href="https://wa.me/8801983333566"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            <MessageCircle size={16} /> Contact EduExpress Support
          </a>
        </div>
      </div>
    );
  }

  const { student, counselor, universityApps, documents, updates } = data;
  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://eduexpressint.com/track/${token}`;
  const isBn = lang === 'bn';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/40 pb-14 text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#081c2e] to-[#12436b] text-xs font-extrabold text-amber-400 shadow-sm">
              EE
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight text-[#081c2e]">EduExpress International</p>
              <p className="text-[11px] font-medium text-slate-500">
                {isBn ? 'লাইভ অ্যাপ্লিকেশন ট্র্যাকিং পোর্টাল' : 'Live Student Tracking Portal'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              title="Show QR Code"
            >
              <QrCode size={14} />
              <span className="hidden sm:inline">QR</span>
            </button>
            <button
              type="button"
              onClick={() => setLang((prev) => (prev === 'bn' ? 'en' : 'bn'))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-100"
            >
              <Globe size={13} />
              {isBn ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 pt-6">
        {notice && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-900 shadow-xs">
            {notice}
          </div>
        )}

        {/* Student Overview Hero */}
        <section className="rounded-3xl bg-gradient-to-br from-[#081c2e] via-[#0f3a5c] to-[#134e7c] p-6 text-white shadow-lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-cyan-200">
                <ShieldCheck size={13} />
                {isBn ? 'ভেরিফায়েড স্টুডেন্ট ফাইল' : 'Verified Student File'}
              </span>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{student.name}</h1>
              <p className="mt-1 text-sm text-cyan-100/90">
                {student.country} · {student.university || student.program}
                {student.gpa ? ` · GPA ${student.gpa.toFixed(2)}` : ''}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-4 py-3 text-right backdrop-blur-xs">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-200">
                {isBn ? 'মোট অগ্রগতি' : 'Overall Progress'}
              </p>
              <p className="mt-0.5 text-3xl font-black text-amber-300 tabular-nums">{student.progressPct}%</p>
              <p className="text-[11px] text-cyan-100">
                {isBn ? `ধাপ ${student.milestoneStep} / ৬` : `Step ${student.milestoneStep} of 6`}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15">
              <div
                style={{ width: `${student.progressPct}%` }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
              />
            </div>
            {(student.visaDeadline || student.departureDate) && (
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-cyan-100">
                {student.visaDeadline && <span>Visa Deadline: <strong>{student.visaDeadline}</strong></span>}
                {student.departureDate && <span>Target Flight: <strong>{student.departureDate}</strong></span>}
              </div>
            )}
          </div>
        </section>

        {/* Direct Assigned Counselor Card */}
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isBn ? 'আপনার ডেডিকেটেড কাউন্সেলর' : 'Your Dedicated Counselor'}
            </p>
            <p className="mt-0.5 text-base font-bold text-slate-900">{counselor.name}</p>
            <p className="text-xs text-slate-500">{counselor.role} · EduExpress Dhaka</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {counselor.whatsappUrl && (
              <a
                href={counselor.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
              >
                <MessageCircle size={15} />
                {isBn ? 'হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp'}
              </a>
            )}
            {counselor.phone && (
              <a
                href={`tel:${counselor.phone}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
              >
                <Phone size={15} />
                {isBn ? 'কল করুন' : 'Call'}
              </a>
            )}
          </div>
        </section>

        {/* 6 Flagship Journey Milestones */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {isBn ? 'আপনার ভর্তির ৬টি ধাপ (লাইভ স্ট্যাটাস)' : 'Your 6-Stage Admission & Visa Roadmap'}
              </h2>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'এখন আর বারবার ফোন করার প্রয়োজন নেই — প্রতিটি আপডেট এখানে রিয়েল-টাইম দেখতে পাবেন।'
                  : 'Real-time milestone updates synchronized directly with our Dhaka & China admissions desk.'}
              </p>
            </div>
            <button
              type="button"
              onClick={loadPortal}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={12} /> {isBn ? 'রিফ্রেশ' : 'Refresh'}
            </button>
          </div>

          <div className="space-y-4">
            {FLAGSHIP_MILESTONES.map((step) => {
              const Icon = STEP_ICONS[step.key];
              const isCompleted = step.id < student.milestoneStep || (step.id === 6 && student.milestoneStep === 6);
              const isCurrent = step.id === student.milestoneStep && !(step.id === 6 && student.milestoneStep === 6);
              return (
                <div
                  key={step.id}
                  className={`relative flex gap-4 rounded-2xl border p-4 transition ${
                    isCurrent
                      ? 'border-blue-400 bg-blue-50/70 shadow-sm ring-1 ring-blue-300/60'
                      : isCompleted
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-slate-100 bg-slate-50/60 opacity-75'
                  }`}
                >
                  <div
                    className={`grid size-11 shrink-0 place-items-center rounded-xl font-bold ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                          ? 'bg-[#0f3a5c] text-amber-300'
                          : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {step.id}. {isBn ? step.titleBn : step.titleEn}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCurrent
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted
                          ? (isBn ? 'সম্পন্ন' : 'Completed')
                          : isCurrent
                            ? (isBn ? 'চলমান ধাপ' : 'Current Step')
                            : (isBn ? `সম্ভাব্য: ${step.estimatedTime}` : 'Upcoming')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-700">
                      {isBn ? step.descBn : step.descEn}
                    </p>
                    {isCurrent && (
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold text-blue-900 border border-blue-200">
                        <Clock size={12} className="text-blue-600 shrink-0" />
                        {isBn ? step.actionBn : step.actionEn}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* University Applications + Documents Checklist Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* University Applications */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <GraduationCap size={17} className="text-blue-700" />
              {isBn ? 'বিশ্ববিদ্যালয় আবেদন তালিকা' : 'University Applications'}
            </h2>
            <div className="mt-3 space-y-2.5">
              {universityApps.map((app) => {
                const badge = UNI_STATUS_LABELS[app.status] || UNI_STATUS_LABELS.documents;
                return (
                  <div key={app.id} className="rounded-xl border border-slate-200 p-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-900">{app.university}</p>
                        {app.program && <p className="text-slate-500">{app.program}</p>}
                        {app.applicationId && (
                          <p className="mt-0.5 font-mono text-[10px] text-slate-400">Ref: {app.applicationId}</p>
                        )}
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.cls}`}>
                        {isBn ? badge.bn : badge.en}
                      </span>
                    </div>
                  </div>
                );
              })}
              {universityApps.length === 0 && (
                <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
                  {isBn
                    ? 'আপনার পছন্দের বিশ্ববিদ্যালয় শর্টলিস্ট ও আবেদন নম্বর এখানে যুক্ত হবে।'
                    : 'Shortlisted universities and official application numbers will appear here.'}
                </p>
              )}
            </div>
          </section>

          {/* Documents Checklist */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <FileCheck2 size={17} className="text-emerald-600" />
              {isBn ? 'ডকুমেন্ট চেকলিস্ট ও আপলোড' : 'Document Checklist & Drive Submission'}
            </h2>
            <div className="mt-3 space-y-2 max-h-96 overflow-y-auto pr-1">
              {documents.map((doc) => {
                const badge = DOC_STATUS_LABELS[doc.status] || DOC_STATUS_LABELS.pending;
                const safeLink = toSafeExternalUrl(doc.studentUploadedUrl);
                const isEditing = activeDocId === doc.id;
                return (
                  <div key={doc.id} className="rounded-xl border border-slate-200 p-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800">{doc.docType}</span>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.cls}`}>
                        {isBn ? badge.bn : badge.en}
                      </span>
                    </div>
                    {safeLink && (
                      <a
                        href={safeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                      >
                        {isBn ? 'আপনার জমা দেওয়া লিংক দেখুন' : 'View uploaded Drive link'} <ExternalLink size={10} />
                      </a>
                    )}
                    {doc.status !== 'verified' && !isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDocId(doc.id);
                          setDriveInput(doc.studentUploadedUrl || '');
                        }}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#0f3a5c] hover:underline"
                      >
                        <Upload size={11} /> {isBn ? 'গুগল ড্রাইভ লিংক জমা দিন' : 'Submit Google Drive Link'}
                      </button>
                    )}
                    {isEditing && (
                      <div className="mt-2 flex gap-1.5">
                        <input
                          type="url"
                          value={driveInput}
                          onChange={(e) => setDriveInput(e.target.value)}
                          placeholder="https://drive.google.com/..."
                          className="flex-1 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                        />
                        <button
                          type="button"
                          disabled={uploadingDoc || !driveInput.trim()}
                          onClick={() => handleSubmitDocUrl(doc.id)}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white disabled:opacity-50"
                        >
                          {uploadingDoc ? '…' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveDocId(null)}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-[11px]"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {documents.length === 0 && (
                <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500">
                  {isBn
                    ? 'ডকুমেন্ট তালিকা প্রস্তুত হলে এখানে দেখতে পাবেন।'
                    : 'Your required document checklist will appear here once opened.'}
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Message Admissions Team & Recent Timeline */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <MessageSquare size={17} className="text-indigo-600" />
            {isBn ? 'সরাসরি কাউন্সেলরকে বার্তা পাঠান ও আপডেট হিস্ট্রি' : 'Direct Message & Activity Updates'}
          </h2>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={msgInput}
              maxLength={1000}
              onChange={(e) => setMsgInput(e.target.value)}
              placeholder={
                isBn
                  ? 'আপনার পাসপোর্ট, ইন্টারভিউ বা স্কলারশিপ নিয়ে কোনো প্রশ্ন থাকলে লিখুন…'
                  : 'Ask your admissions counselor a question…'
              }
              className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900"
            />
            <button
              type="submit"
              disabled={sendingMsg || !msgInput.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f3a5c] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#12436b] disabled:opacity-50"
            >
              <Send size={13} /> {isBn ? 'পাঠান' : 'Send'}
            </button>
          </form>

          {updates.length > 0 && (
            <div className="space-y-2 border-t border-slate-100 pt-3 max-h-60 overflow-y-auto">
              {updates.map((upd) => (
                <div key={upd.id} className="flex items-start gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-xs">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-blue-600" />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2 font-bold text-slate-800">
                      <span>{upd.type.replaceAll('_', ' ')}</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        {new Date(upd.createdAt).toLocaleDateString('en-GB', { timeZone: 'Asia/Dhaka' })}
                      </span>
                    </div>
                    {upd.toValue && <p className="text-blue-700 font-medium">{upd.toValue}</p>}
                    {upd.details && <p className="mt-0.5 text-slate-600">{upd.details}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* QR Code Modal */}
      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Portal QR Code</h3>
              <button onClick={() => setShowQr(false)} className="rounded p-1 text-slate-400 hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pageUrl)}`}
              alt="QR code for student tracking link"
              width={200}
              height={200}
              className="mx-auto rounded-lg border border-slate-100"
            />
            <p className="mt-3 text-[11px] text-slate-500">
              {isBn
                ? 'অভিভাবকদের সাথে শেয়ার করতে অথবা ফোনে সেভ করতে স্ক্যান করুন।'
                : 'Scan to open or share this live progress tracker on another phone.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
