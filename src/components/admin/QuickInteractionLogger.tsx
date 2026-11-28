'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  PhoneCall,
  Send,
  Sparkles,
  User,
  Users,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { buildWhatsAppUrl } from '@/lib/wa-templates';

export interface InteractionActivity {
  id: string;
  type: string;
  actorName: string | null;
  employeeId: string | null;
  toValue: string | null;
  fromValue: string | null;
  details: string | null;
  createdAt: string;
}

interface QuickInteractionLoggerProps {
  leadId: string;
  leadName: string;
  phone?: string | null;
  currentStatus: string;
  currentFollowup?: string | null;
  isApplication?: boolean;
  onLeadUpdated?: (updated: { status?: string; nextFollowup?: string | null; notes?: string; isApplication?: boolean; leadRef?: string | null }) => void;
}

type InteractionChannel = 'Phone Call' | 'WhatsApp Chat' | 'Office Meeting';

const OUTCOME_OPTIONS = [
  { key: 'positive', label: 'Positive / Interested', emoji: '🌟', tone: 'emerald', newStatus: 'qualified' },
  { key: 'followup', label: 'Follow-up Due', emoji: '📅', tone: 'amber', newStatus: 'contacted' },
  { key: 'parent_discussed', label: 'Parent Talked', emoji: '👨‍👩‍👦', tone: 'indigo', newStatus: 'consultation_scheduled' },
  { key: 'office_visit', label: 'Office Visit Booked', emoji: '🏢', tone: 'cyan', newStatus: 'consultation_scheduled' },
  { key: 'docs_requested', label: 'Waiting for Docs', emoji: '📄', tone: 'blue', newStatus: 'contacted' },
  { key: 'no_answer', label: 'No Answer / Busy', emoji: '📵', tone: 'slate', newStatus: 'no_response' },
  { key: 'not_interested', label: 'Not Interested', emoji: '❌', tone: 'rose', newStatus: 'not_interested' },
] as const;

const QUICK_NOTE_SNIPPETS = [
  'Interested in China CSC / University scholarship.',
  'Discussed tuition, dorm & EduExpress ClearCost guarantee.',
  'Waiting for HSC marksheet / passport copy.',
  'Parent wants to visit Dhanmondi office.',
  'Sent document checklist via WhatsApp.',
];

export default function QuickInteractionLogger({
  leadId,
  phone,
  currentStatus,
  currentFollowup,
  isApplication = false,
  onLeadUpdated,
}: QuickInteractionLoggerProps) {
  const { authenticatedFetch } = useAuth();
  const [activities, setActivities] = useState<InteractionActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Form states
  const [selectedOutcome, setSelectedOutcome] = useState<string>(OUTCOME_OPTIONS[0].label);
  const [channel, setChannel] = useState<InteractionChannel>('Phone Call');
  const [summary, setSummary] = useState('');
  const [nextFollowup, setNextFollowup] = useState<string>('');
  const [autoStatus, setAutoStatus] = useState<string>(isApplication ? currentStatus : 'qualified');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: 'ok' | 'err' } | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    let active = true;
    authenticatedFetch(`/api/admin/leads/${encodeURIComponent(leadId)}/activities`, { cache: 'no-store' })
      .then(async (res) => (res.ok ? res.json().catch(() => null) : null))
      .then((json) => {
        if (!active || !json) return;
        setActivities(Array.isArray(json.activities) ? json.activities : []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingActivities(false);
      });
    return () => {
      active = false;
    };
  }, [authenticatedFetch, leadId, reloadTick]);

  const handleOutcomeSelect = useCallback(
    (item: typeof OUTCOME_OPTIONS[number]) => {
      setSelectedOutcome(item.label);
      if (!isApplication) {
        setAutoStatus(item.newStatus);
      }

      // Compute Dhaka (GMT+6) tomorrow's suggested follow-up using UTC setters so browser TZ never shifts time
      const nowDhaka = new Date(Date.now() + 6 * 3600 * 1000);
      if (item.key === 'positive' || item.key === 'followup' || item.key === 'parent_discussed') {
        nowDhaka.setUTCDate(nowDhaka.getUTCDate() + 1);
        nowDhaka.setUTCHours(12, 0, 0, 0);
        setNextFollowup(nowDhaka.toISOString().slice(0, 16));
      } else if (item.key === 'no_answer') {
        nowDhaka.setUTCDate(nowDhaka.getUTCDate() + 1);
        nowDhaka.setUTCHours(15, 30, 0, 0);
        setNextFollowup(nowDhaka.toISOString().slice(0, 16));
      }
    },
    [isApplication],
  );

  const handleQuickSnippet = (snippet: string) => {
    setSummary((prev) => (prev ? `${prev} ${snippet}` : snippet));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setMessage(null);

      const res = await authenticatedFetch(`/api/admin/leads/${encodeURIComponent(leadId)}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome: selectedOutcome,
          channel,
          summary: summary.trim(),
          nextFollowup: nextFollowup || null,
          newStatus: isApplication ? undefined : (autoStatus || undefined),
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ text: json.error || json.message || 'Failed to record interaction.', tone: 'err' });
        return;
      }

      setMessage({ text: 'Call & discussion logged successfully! KPI updated.', tone: 'ok' });
      setSummary('');
      if (json.lead && onLeadUpdated) {
        onLeadUpdated({
          status: json.lead.status,
          nextFollowup: json.lead.nextFollowup,
          notes: json.lead.notes,
          isApplication: json.lead.isApplication,
          leadRef: json.lead.leadRef,
        });
      }
      setReloadTick((t) => t + 1);
    } catch {
      setMessage({ text: 'Network error saving interaction.', tone: 'err' });
    } finally {
      setSubmitting(false);
    }
  };

  const waUrl = buildWhatsAppUrl(phone);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      {/* Quick Contact Bar for Mobile Counselors */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-[#0f3a5c]/10 text-[#0f3a5c]">
            <PhoneCall size={14} />
          </div>
          <span className="text-xs font-bold text-slate-800">1-Tap Counselor Outreach</span>
        </div>

        <div className="flex items-center gap-2">
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 active:scale-95"
            >
              <Phone size={13} /> Call {phone}
            </a>
          ) : (
            <span className="text-xs text-slate-400">No phone</span>
          )}

          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 transition hover:bg-teal-100 active:scale-95"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Main Interaction Logging Form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Call Outcome / Result *
          </label>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {OUTCOME_OPTIONS.map((item) => {
              const active = selectedOutcome === item.label;
              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => handleOutcomeSelect(item)}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left text-xs font-semibold transition active:scale-95 ${
                    active
                      ? 'border-[#0f3a5c] bg-[#0f3a5c] text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Channel Used
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as InteractionChannel)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
            >
              <option value="Phone Call">📞 Phone Call</option>
              <option value="WhatsApp Chat">💬 WhatsApp Chat / Audio</option>
              <option value="Office Meeting">🏢 Dhanmondi Office Visit</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Update Lead Pipeline Status
            </label>
            <select
              value={autoStatus}
              onChange={(e) => setAutoStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified (Positive)</option>
              <option value="consultation_scheduled">Consultation Scheduled</option>
              <option value="consultation_completed">Consultation Completed</option>
              <option value="application_started">File / Application Started</option>
              <option value="no_response">No Response</option>
              <option value="not_interested">Not Interested</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span>Next Follow-up Date & Time</span>
            {currentFollowup && (
              <span className="text-[10px] text-amber-700">Currently: {currentFollowup}</span>
            )}
          </label>
          <input
            type="datetime-local"
            value={nextFollowup}
            onChange={(e) => setNextFollowup(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-[#0f3a5c] focus:outline-none"
          />
        </div>

        <div>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Discussion Summary / Counselor Notes
            </label>
            <span className="text-[10px] text-slate-400">Click chip to auto-insert</span>
          </div>

          <div className="mb-2 flex flex-wrap gap-1.5">
            {QUICK_NOTE_SNIPPETS.map((snippet, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleQuickSnippet(snippet)}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 transition hover:border-[#0f3a5c] hover:bg-slate-100"
              >
                + {snippet.slice(0, 32)}...
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="What was discussed? E.g., student wants March 2027 intake, HSC 4.80, parent requested budget breakdown..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0f3a5c] focus:outline-none"
          />
        </div>

        {message && (
          <div
            className={`rounded-lg px-3 py-2 text-xs font-semibold ${
              message.tone === 'ok'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f3a5c] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#0c2f4d] active:scale-[0.99] disabled:opacity-50"
        >
          <Send size={13} />
          {submitting ? 'Saving Interaction...' : 'Save & Log Discussion to Timeline'}
        </button>
      </form>

      {/* Visual Interaction History Timeline */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
          <Clock size={13} /> Interaction History & Call Logs ({activities.length})
        </h4>

        {loadingActivities ? (
          <p className="mt-2 text-xs text-slate-400">Loading call history...</p>
        ) : activities.length === 0 ? (
          <p className="mt-2 text-xs text-slate-500 italic">No calls or discussions logged yet for this student.</p>
        ) : (
          <div className="mt-3 space-y-2.5">
            {activities.slice(0, 15).map((act) => (
              <div
                key={act.id}
                className="relative rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{act.actorName || 'Counselor'}</span>
                    {act.fromValue && (
                      <span className="rounded bg-slate-200/60 px-1.5 py-0.5 text-[10px] text-slate-600">
                        {act.fromValue}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(act.createdAt).toLocaleString('en-GB', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                      timeZone: 'Asia/Dhaka',
                    })}
                  </span>
                </div>

                {act.toValue && (
                  <div className="mt-1">
                    <span className="inline-block rounded-md border border-[#0f3a5c]/20 bg-[#0f3a5c]/10 px-2 py-0.5 text-[10px] font-bold text-[#0f3a5c]">
                      {act.toValue}
                    </span>
                  </div>
                )}

                {act.details && (
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {act.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
