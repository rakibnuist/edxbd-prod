'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MessageCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type { FitResponseLanguage } from '@/lib/fit-matcher';
import type { LeadCopilotResult, LeadReadinessTier } from '@/lib/lead-copilot';
import { leadContactLinks, type LeadRecord } from '@/lib/lead-workflow';

type CopilotRequestFn = (
  id: string,
  options: { language: FitResponseLanguage; focus?: string },
) => Promise<{ data?: LeadCopilotResult; error?: string }>;

const READINESS_LABELS: Record<LeadReadinessTier, string> = {
  ready_for_shortlist: 'Ready for shortlist',
  needs_documents: 'Needs documents',
  needs_budget_clarification: 'Budget clarification needed',
  high_risk_review: 'High-risk review',
};

const READINESS_TONES: Record<LeadReadinessTier, string> = {
  ready_for_shortlist: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  needs_documents: 'bg-sky-50 text-sky-900 border-sky-200',
  needs_budget_clarification: 'bg-amber-50 text-amber-900 border-amber-200',
  high_risk_review: 'bg-rose-50 text-rose-900 border-rose-200',
};

export default function LeadCopilotPanel({
  lead,
  onGenerate,
  onAppendNotes,
}: {
  lead: LeadRecord;
  onGenerate: CopilotRequestFn;
  onAppendNotes: (snippet: string) => void;
}) {
  const [language, setLanguage] = useState<FitResponseLanguage>('en');
  const [focus, setFocus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LeadCopilotResult | null>(null);
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [whatsappText, setWhatsappText] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailText, setEmailText] = useState('');
  const [copied, setCopied] = useState<'whatsapp' | 'email' | null>(null);

  const links = leadContactLinks(lead);

  const runCopilot = async (nextLang: FitResponseLanguage = language) => {
    setLoading(true);
    setError(null);
    try {
      const response = await onGenerate(lead.id, {
        language: nextLang,
        focus: focus.trim() || undefined,
      });
      if (response.error || !response.data) {
        setError(response.error || 'Could not prepare counselor brief right now.');
        return;
      }
      setResult(response.data);
      setWhatsappText(response.data.whatsappDraft);
      setEmailSubject(response.data.emailSubject);
      setEmailText(response.data.emailDraft);
    } finally {
      setLoading(false);
    }
  };

  const copyDraft = async (target: 'whatsapp' | 'email') => {
    const payload = target === 'whatsapp'
      ? whatsappText
      : `Subject: ${emailSubject}\n\n${emailText}`;
    if (!payload.trim()) return;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(target);
      window.setTimeout(() => setCopied(prev => (prev === target ? null : prev)), 2000);
    } catch {
      setError('Clipboard access was denied. You can copy directly from the text box.');
    }
  };

  const whatsappHref = links.whatsapp && whatsappText.trim()
    ? `${links.whatsapp}?text=${encodeURIComponent(whatsappText.trim())}`
    : null;
  const emailHref = lead.email && emailText.trim()
    ? `mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailText.trim())}`
    : null;

  return (
    <section className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#12436b]" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-gray-900">Admissions Co-pilot</h3>
          </div>
          <p className="mt-1 text-xs text-gray-600">
            Internal triage, grounded catalog matches, and non-guarantee reply drafts.
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5" role="group" aria-label="Reply draft language">
          {(['en', 'bn'] as const).map(lang => (
            <button
              key={lang}
              type="button"
              disabled={loading}
              aria-pressed={language === lang}
              onClick={() => {
                setLanguage(lang);
                if (result && lang !== result.language) {
                  void runCopilot(lang);
                }
              }}
              className={`min-h-8 rounded-md px-2.5 text-xs font-medium transition ${
                language === lang ? 'bg-[#12436b] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {lang === 'en' ? 'EN' : 'বাংলা'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={focus}
          maxLength={250}
          onChange={event => setFocus(event.target.value)}
          placeholder="Optional focus (e.g. ask for HSC Biology GPA, explain hostel vs tuition)…"
          className="min-h-10 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-[#12436b]"
        />
        <button
          type="button"
          disabled={loading}
          onClick={() => void runCopilot(language)}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#12436b] px-4 text-xs font-semibold text-white hover:bg-[#0e3556] focus-visible:ring-2 focus-visible:ring-[#12436b] disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? <RefreshCw size={14} className="animate-spin" aria-hidden="true" /> : <Sparkles size={14} aria-hidden="true" />}
          {loading ? 'Analyzing…' : result ? 'Regenerate' : 'Generate AI brief'}
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-900">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${READINESS_TONES[result.triage.readinessTier]}`}>
              {READINESS_LABELS[result.triage.readinessTier]}
              {typeof result.triage.readinessConfidence === 'number' && (
                <span className="tabular-nums opacity-80">
                  ({Math.round(result.triage.readinessConfidence * 100)}%)
                </span>
              )}
            </span>
            <span className="rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700">
              Desk: {result.triage.recommendedTeam.replaceAll('_', ' ')}
            </span>
            {result.triage.medicalReviewRequired && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900">
                <AlertTriangle size={12} aria-hidden="true" />
                WDOMS / BMDC check
              </span>
            )}
            {result.triage.scholarshipExpectationRisk && (
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-900">
                <AlertTriangle size={12} aria-hidden="true" />
                Cost/scholarship expectation alert
              </span>
            )}
            <span className="ml-auto text-[11px] text-gray-500">
              {result.mode === 'gemini'
                ? [result.model, result.decisionModel].filter(Boolean).join(' + ')
                : 'Catalog & rules fallback'}
            </span>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-600">Counselor brief</h4>
              <button
                type="button"
                onClick={() => onAppendNotes(result.internalNoteSnippet)}
                className="text-xs font-medium text-[#12436b] hover:underline"
              >
                Insert into notes
              </button>
            </div>
            <p className="text-sm leading-6 text-gray-800">{result.counselorBrief}</p>

            {result.missingDocuments.length > 0 && (
              <div className="pt-1">
                <p className="text-xs font-semibold text-gray-700">Missing items to request</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-gray-700">
                  {result.missingDocuments.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}

            {result.verificationPriorities.length > 0 && (
              <div className="pt-1">
                <p className="text-xs font-semibold text-gray-700">Verification priorities</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-gray-700">
                  {result.verificationPriorities.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>

          {result.matchedUniversities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                Verified catalog shortlist
              </h4>
              <div className="space-y-2">
                {result.matchedUniversities.map(uni => (
                  <a
                    key={uni.slug}
                    href={uni.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-gray-200 bg-white p-3 transition hover:border-[#12436b]/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-900">
                          {uni.name} · <span className="font-normal text-gray-600">{uni.city}, {uni.country}</span>
                        </p>
                        {uni.matchedProgram && (
                          <p className="mt-0.5 text-xs text-[#12436b]">{uni.matchedProgram}</p>
                        )}
                      </div>
                      <ExternalLink size={13} className="shrink-0 text-gray-400" aria-hidden="true" />
                    </div>
                    <p className="mt-1 text-xs text-gray-700">{uni.tuitionSummary}</p>
                    {uni.scholarshipNote && (
                      <p className="mt-0.5 text-[11px] text-emerald-800">{uni.scholarshipNote}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-600">{uni.reason}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-white p-3.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex rounded-lg bg-gray-100 p-0.5" role="tablist" aria-label="Reply draft channel">
                <button
                  type="button"
                  role="tab"
                  aria-selected={channel === 'whatsapp'}
                  onClick={() => setChannel('whatsapp')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
                    channel === 'whatsapp' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
                  }`}
                >
                  <MessageCircle size={13} aria-hidden="true" />
                  WhatsApp draft
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={channel === 'email'}
                  onClick={() => setChannel('email')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
                    channel === 'email' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
                  }`}
                >
                  <Mail size={13} aria-hidden="true" />
                  Email draft
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void copyDraft(channel)}
                  className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 text-xs font-medium text-gray-800 hover:bg-gray-50"
                >
                  {copied === channel ? <Check size={13} className="text-emerald-700" aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                  {copied === channel ? 'Copied' : 'Copy'}
                </button>
                {channel === 'whatsapp' && whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-emerald-700 px-2.5 text-xs font-medium text-white hover:bg-emerald-800"
                  >
                    <MessageCircle size={13} aria-hidden="true" />
                    Send in WhatsApp
                  </a>
                )}
                {channel === 'email' && emailHref && (
                  <a
                    href={emailHref}
                    className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-[#12436b] px-2.5 text-xs font-medium text-white hover:bg-[#0e3556]"
                  >
                    <Mail size={13} aria-hidden="true" />
                    Open in Mail
                  </a>
                )}
              </div>
            </div>

            {channel === 'whatsapp' ? (
              <textarea
                aria-label="WhatsApp draft reply"
                value={whatsappText}
                onChange={event => setWhatsappText(event.target.value)}
                rows={6}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-xs leading-5 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-[#12436b]"
              />
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  aria-label="Email draft subject"
                  value={emailSubject}
                  onChange={event => setEmailSubject(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-2.5 py-2 text-xs font-medium text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-[#12436b]"
                />
                <textarea
                  aria-label="Email draft body"
                  value={emailText}
                  onChange={event => setEmailText(event.target.value)}
                  rows={8}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-xs leading-5 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-[#12436b]"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
