'use client';

import Link from 'next/link';
import { FormEvent, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { trackAssessmentSubmit, trackFormFieldFocus, trackFormStart } from '@/lib/analytics';

type FormState = {
  name: string;
  phone: string;
  email: string;
  qualification: string;
  program: string;
  consent: boolean;
};

const initialState: FormState = {
  name: '',
  phone: '',
  email: '',
  qualification: '',
  program: '',
  consent: false,
};

const fieldClass =
  'mt-2 h-11 w-full border border-[#174f7a]/20 bg-white px-3 text-sm font-semibold text-[#08263c] outline-none transition placeholder:text-slate-400 focus:border-[#174f7a] focus:ring-4 focus:ring-[#64b5df]/20';

export default function ChinaCampaignLeadForm() {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const startedRef = useRef(false);
  const lastSubmissionRef = useRef(0);

  const recordInteraction = (fieldName: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackFormStart('consultation');
    }
    trackFormFieldFocus(fieldName, 'china_fit_assessment');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || Date.now() - lastSubmissionRef.current < 2000) return;

    setError('');
    lastSubmissionRef.current = Date.now();

    const cleanName = formData.name.trim();
    const cleanPhone = formData.phone.trim();
    const cleanEmail = formData.email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = cleanPhone.replace(/\D/g, '');

    if (cleanName.length < 2) return setError('Please enter your full name.');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) return setError('Please enter a valid WhatsApp or phone number.');
    if (!emailPattern.test(cleanEmail)) return setError('Please enter a valid email address.');
    if (!formData.qualification || !formData.program) return setError('Please select your current qualification and target study level.');
    if (!formData.consent) return setError('Please confirm that we may contact you about this assessment.');

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          country: 'China',
          program: formData.program,
          message: `China fit assessment. Current qualification: ${formData.qualification}. Target level: ${formData.program}. IELTS and CSCA readiness to be checked during assessment.`,
          formType: 'consultation',
          source: 'china_campaign_landing',
          consent: true,
          consentTimestamp: new Date().toISOString(),
          consentPolicyVersion: '2026-07-19',
          landingPage: window.location.pathname,
          utm: Object.fromEntries(new URLSearchParams(window.location.search)),
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'Your request could not be sent. Please try again.');
      }

      trackAssessmentSubmit({
        destination: 'China',
        target_level: formData.program,
        qualification: formData.qualification,
        source: 'china_campaign_landing',
      });
      setIsSubmitted(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Your request could not be sent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div id="china-fit-form" className="flex min-h-[470px] flex-col justify-center bg-white p-6 text-center shadow-[0_25px_80px_rgba(8,38,60,0.22)] sm:p-8" aria-live="polite">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#e9f7fd] text-[#174f7a]">
          <CheckCircle2 size={34} />
        </span>
        <p className="mt-6 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Assessment request received</p>
        <h2 className="mt-3 font-heading text-3xl font-bold text-[#08263c]">Your China profile is in the review queue</h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-600">
          A China admissions counselor will review your study level, eligibility and likely next documents, then contact you during office hours.
        </p>
        <p className="mt-5 text-xs font-bold text-slate-500">Saturday to Thursday, 11:00 AM to 6:00 PM</p>
        <button type="button" onClick={() => { setFormData(initialState); setIsSubmitted(false); startedRef.current = false; }} className="mx-auto mt-7 text-sm font-black text-[#174f7a] underline underline-offset-4">
          Submit another profile
        </button>
      </div>
    );
  }

  return (
    <form id="china-fit-form" onSubmit={handleSubmit} className="scroll-mt-[92px] bg-white p-5 text-[#08263c] shadow-[0_25px_80px_rgba(8,38,60,0.22)] sm:p-7 min-[1200px]:scroll-mt-[120px]" noValidate>
      <div className="flex items-start justify-between gap-4 border-b border-[#174f7a]/15 pb-4">
        <div>
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Free first step</p>
          <h2 className="mt-1 font-heading text-2xl font-bold leading-tight">Get your China Fit Assessment</h2>
        </div>
        <span className="grid size-10 shrink-0 place-items-center bg-[#e9f7fd] text-[#174f7a]" aria-hidden="true"><ShieldCheck size={21} /></span>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-600">Share five details. We will screen your likely study level, admission route and next documents.</p>

      <div className="mt-4">
        <label htmlFor="name" className="text-xs font-black">Full name <span className="text-red-600">*</span></label>
        <input id="name" name="name" autoComplete="name" value={formData.name} onFocus={() => recordInteraction('name')} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className={fieldClass} placeholder="Your full name" required />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="text-xs font-black">WhatsApp or phone <span className="text-red-600">*</span></label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={formData.phone} onFocus={() => recordInteraction('phone')} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} className={fieldClass} placeholder="01XXXXXXXXX" required />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-black">Email <span className="text-red-600">*</span></label>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" value={formData.email} onFocus={() => recordInteraction('email')} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className={fieldClass} placeholder="you@example.com" required />
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="qualification" className="text-xs font-black">Current qualification <span className="text-red-600">*</span></label>
          <select id="qualification" name="qualification" value={formData.qualification} onFocus={() => recordInteraction('qualification')} onChange={(event) => setFormData({ ...formData, qualification: event.target.value })} className={fieldClass} required>
            <option value="">Select one</option>
            <option>SSC or O Level</option>
            <option>HSC or A Level</option>
            <option>Diploma</option>
            <option>Bachelor</option>
            <option>Master</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="program" className="text-xs font-black">Target study level <span className="text-red-600">*</span></label>
          <select id="program" name="program" value={formData.program} onFocus={() => recordInteraction('program')} onChange={(event) => setFormData({ ...formData, program: event.target.value })} className={fieldClass} required>
            <option value="">Select one</option>
            <option>Chinese Language</option>
            <option>Foundation</option>
            <option>Diploma</option>
            <option>Bachelor</option>
            <option>Master</option>
            <option>PhD</option>
            <option>Not sure yet</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 text-[11px] leading-5 text-slate-600">
        <input id="consent" name="consent" type="checkbox" checked={formData.consent} onFocus={() => recordInteraction('consent')} onChange={(event) => setFormData({ ...formData, consent: event.target.checked })} className="mt-1 size-4 shrink-0 accent-[#174f7a]" required />
        <label htmlFor="consent" className="cursor-pointer">I agree that EduExpress may contact me about this assessment. I have read the <Link href="/privacy" className="font-bold text-[#174f7a] underline">privacy policy</Link>.</label>
      </div>

      {error ? <p className="mt-3 border-l-4 border-red-500 bg-red-50 px-3 py-2 text-xs font-bold text-red-700" role="alert">{error}</p> : null}

      <button type="submit" disabled={isSubmitting} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 bg-[#174f7a] px-5 text-sm font-black text-white transition hover:bg-[#08263c] disabled:cursor-wait disabled:opacity-70">
        {isSubmitting ? 'Sending your profile' : 'Get My China Fit Assessment'} <ArrowRight size={17} aria-hidden="true" />
      </button>

      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500">
        <LockKeyhole size={12} aria-hidden="true" /> No file opening charge. Your details are used only for this request.
      </div>
    </form>
  );
}
