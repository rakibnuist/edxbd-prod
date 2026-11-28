'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
import {
  formatFollowupDisplay,
  getFollowupClassification,
  type LeadRecord,
} from '@/lib/lead-workflow';

type Props = {
  lead: LeadRecord;
  saving: boolean;
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<boolean>;
  onClose?: () => void;
  compact?: boolean;
};

const REASON_PRESETS = [
  'Client requested call back',
  'Check passport & academic transcripts',
  'Discuss shortlisted universities',
  'CSC / University scholarship review',
  'Parent counseling session',
  'WhatsApp message follow-up',
];

/**
 * Returns a local ISO string (YYYY-MM-DDTHH:mm) offset in Dhaka time (UTC+6)
 */
function getDhakaLocalIso(
  deltaHours = 0,
  targetHour?: number,
  targetMinute = 0,
  deltaDays = 0,
): string {
  // Current time in Dhaka (UTC+6)
  const dhakaNow = new Date(Date.now() + 6 * 3600 * 1000);

  if (targetHour !== undefined) {
    dhakaNow.setUTCDate(dhakaNow.getUTCDate() + deltaDays);
    dhakaNow.setUTCHours(targetHour, targetMinute, 0, 0);
  } else {
    dhakaNow.setUTCHours(dhakaNow.getUTCHours() + deltaHours);
    // Round up to nearest 15 mins for cleaner UX
    const mins = dhakaNow.getUTCMinutes();
    const roundedMins = Math.ceil(mins / 15) * 15;
    dhakaNow.setUTCMinutes(roundedMins, 0, 0);
  }

  return dhakaNow.toISOString().slice(0, 16);
}

export default function FollowupScheduler({
  lead,
  saving,
  onUpdate,
  onClose,
  compact = false,
}: Props) {
  const currentInfo = getFollowupClassification(lead.nextFollowup);

  const initialVal = lead.nextFollowup
    ? lead.nextFollowup.length === 10
      ? `${lead.nextFollowup}T11:00`
      : lead.nextFollowup.slice(0, 16)
    : '';

  const [datetime, setDatetime] = useState(initialVal);
  const [prevInitialVal, setPrevInitialVal] = useState(initialVal);
  if (initialVal !== prevInitialVal) {
    setPrevInitialVal(initialVal);
    setDatetime(initialVal);
  }
  const [reason, setReason] = useState('');
  const [appendNote, setAppendNote] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [localSaving, setLocalSaving] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const scheduleClose = (delayMs: number) => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
      if (onClose) onClose();
    }, delayMs);
  };

  const isScheduled = Boolean(lead.nextFollowup);

  const handlePresetClick = (presetIso: string, defaultReason?: string) => {
    setDatetime(presetIso);
    if (!reason && defaultReason) {
      setReason(defaultReason);
    }
  };

  const handleSave = async () => {
    if (!datetime) {
      setFeedback('Please pick a date and time to schedule the follow-up.');
      return;
    }
    setLocalSaving(true);
    setFeedback(null);

    const updatePayload: Record<string, unknown> = {
      nextFollowup: datetime,
    };

    if (appendNote) {
      const scheduledDisplay = formatFollowupDisplay(datetime) || datetime;
      const noteEntry = `[Follow-up scheduled for ${scheduledDisplay}${reason ? ` · Agenda: ${reason.trim()}` : ''}]`;
      const prevNotes = (lead.notes || '').trim();
      updatePayload.notes = prevNotes ? `${prevNotes}\n\n${noteEntry}` : noteEntry;
    }

    const success = await onUpdate(lead.id, updatePayload);
    setLocalSaving(false);
    if (success) {
      setFeedback('Follow-up scheduled successfully!');
      scheduleClose(1200);
    } else {
      setFeedback('Failed to schedule follow-up. Please retry.');
    }
  };

  const handleMarkDone = async () => {
    setLocalSaving(true);
    setFeedback(null);

    const updatePayload: Record<string, unknown> = {
      nextFollowup: null,
    };

    // If lead status is no_response, we can optionally move them to contacted
    if (lead.status === 'no_response') {
      updatePayload.status = 'contacted';
    }

    if (appendNote) {
      const nowDhakaStr = formatFollowupDisplay(getDhakaLocalIso(0)) || 'Today';
      const noteEntry = `[Re-contact completed on ${nowDhakaStr}${reason ? ` · Outcome: ${reason.trim()}` : ''}]`;
      const prevNotes = (lead.notes || '').trim();
      updatePayload.notes = prevNotes ? `${prevNotes}\n\n${noteEntry}` : noteEntry;
    }

    const success = await onUpdate(lead.id, updatePayload);
    setLocalSaving(false);
    if (success) {
      setFeedback('Re-contact marked as completed!');
      scheduleClose(1000);
    } else {
      setFeedback('Failed to update follow-up. Please retry.');
    }
  };

  const handleClear = async () => {
    setLocalSaving(true);
    setFeedback(null);
    const success = await onUpdate(lead.id, { nextFollowup: null });
    setLocalSaving(false);
    if (success) {
      setDatetime('');
      setFeedback('Scheduled follow-up cleared.');
      scheduleClose(1000);
    } else {
      setFeedback('Failed to clear follow-up.');
    }
  };

  const isBusy = saving || localSaving;

  return (
    <div className="space-y-4 text-xs">
      {/* Current Follow-up Banner */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 ${
          isScheduled ? currentInfo.badgeClass : 'border-slate-200 bg-white text-slate-700'
        }`}
      >
        <div className="flex items-center gap-2">
          {currentInfo.isOverdue ? (
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
          ) : currentInfo.isToday ? (
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-amber-500"></span>
            </span>
          ) : isScheduled ? (
            <Clock size={16} className="shrink-0 text-sky-700" />
          ) : (
            <CalendarClock size={16} className="shrink-0 text-slate-400" />
          )}

          <div>
            <p className="font-bold">
              {isScheduled
                ? `Follow-up: ${formatFollowupDisplay(lead.nextFollowup)}`
                : 'No Follow-up Scheduled'}
            </p>
            <p className="text-[11px] opacity-80">
              {isScheduled
                ? currentInfo.isOverdue
                  ? 'Counselor SLA alert: Re-contact time has passed!'
                  : currentInfo.isToday
                    ? 'Re-contact due today! Reach client as scheduled.'
                    : 'Scheduled upcoming client re-contact.'
                : 'Set a scheduled callback time so counselors remember to re-contact.'}
            </p>
          </div>
        </div>

        {isScheduled && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={isBusy}
              onClick={handleMarkDone}
              className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
              title="Mark that counselor successfully reached out and completed this follow-up"
            >
              <CheckCircle2 size={12} />
              Mark Re-contacted
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={handleClear}
              className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              title="Clear follow-up without adding notes"
            >
              <X size={12} />
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Quick 1-Click Preset Buttons */}
      <div>
        <label className="mb-1.5 block font-bold text-slate-700">
          Quick Schedule Presets (Dhaka Time):
        </label>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handlePresetClick(getDhakaLocalIso(2), 'Call back after 2 hours')}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left font-medium text-slate-700 shadow-xs hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-900 transition disabled:opacity-50"
          >
            <span>+2 Hours</span>
            <Clock size={12} className="text-slate-400" />
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handlePresetClick(getDhakaLocalIso(0, 17, 0, 0), 'Call back today evening (5 PM)')}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left font-medium text-slate-700 shadow-xs hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-900 transition disabled:opacity-50"
          >
            <span>Today 5:00 PM</span>
            <Clock size={12} className="text-slate-400" />
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handlePresetClick(getDhakaLocalIso(0, 11, 0, 1), 'Morning follow-up call')}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left font-medium text-slate-700 shadow-xs hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-900 transition disabled:opacity-50"
          >
            <span>Tomorrow 11 AM</span>
            <Calendar size={12} className="text-slate-400" />
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handlePresetClick(getDhakaLocalIso(0, 16, 0, 1), 'Afternoon follow-up call')}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left font-medium text-slate-700 shadow-xs hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-900 transition disabled:opacity-50"
          >
            <span>Tomorrow 4 PM</span>
            <Calendar size={12} className="text-slate-400" />
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handlePresetClick(getDhakaLocalIso(0, 11, 0, 2), 'In 2 days check-in')}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left font-medium text-slate-700 shadow-xs hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-900 transition disabled:opacity-50"
          >
            <span>In 2 Days (11 AM)</span>
            <Calendar size={12} className="text-slate-400" />
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => handlePresetClick(getDhakaLocalIso(0, 11, 0, 7), 'Next week review')}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left font-medium text-slate-700 shadow-xs hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-900 transition disabled:opacity-50"
          >
            <span>Next Week (11 AM)</span>
            <Sparkles size={12} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Date & Time Picker */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`followup-dt-${lead.id}`}
            className="mb-1 block font-bold text-slate-700"
          >
            Date & Time:
          </label>
          <input
            id={`followup-dt-${lead.id}`}
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            disabled={isBusy}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-xs outline-none focus:border-[#12436b] focus:ring-2 focus:ring-[#12436b]/20"
          />
          {datetime && (
            <p className="mt-1 text-[11px] text-blue-700 font-medium">
              Scheduled for: {formatFollowupDisplay(datetime) || datetime}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`followup-reason-${lead.id}`}
            className="mb-1 block font-bold text-slate-700"
          >
            Follow-up Reason / Agenda:
          </label>
          <input
            id={`followup-reason-${lead.id}`}
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Call back: client in class; check passport"
            disabled={isBusy}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-xs outline-none focus:border-[#12436b] focus:ring-2 focus:ring-[#12436b]/20"
          />
        </div>
      </div>

      {/* Quick Agenda Chips */}
      <div>
        <label className="mb-1 block text-[11px] font-semibold text-slate-500">
          Quick Agenda Suggestions:
        </label>
        <div className="flex flex-wrap gap-1">
          {REASON_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={isBusy}
              onClick={() => setReason(preset)}
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              + {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Checkbox for appending to Counselor Notes */}
      <div className="flex items-center gap-2 pt-1">
        <input
          id={`append-note-${lead.id}`}
          type="checkbox"
          checked={appendNote}
          onChange={(e) => setAppendNote(e.target.checked)}
          className="size-3.5 rounded border-slate-300 text-[#12436b] focus:ring-[#12436b]"
        />
        <label htmlFor={`append-note-${lead.id}`} className="text-[11px] font-medium text-slate-600">
          Automatically append this follow-up schedule and reason to Counselor Notes
        </label>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <p
          role="status"
          className={`rounded-lg p-2.5 text-center text-xs font-semibold ${
            feedback.includes('success') || feedback.includes('completed') || feedback.includes('cleared')
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback}
        </p>
      )}

      {/* Save Button */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          disabled={isBusy || !datetime}
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f3a5c] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#12436b] disabled:opacity-50 transition"
        >
          {isBusy ? (
            <RefreshCw size={13} className="animate-spin" />
          ) : (
            <CalendarCheck size={14} />
          )}
          {isScheduled ? 'Update Schedule' : 'Schedule Re-contact'}
        </button>
      </div>
    </div>
  );
}
