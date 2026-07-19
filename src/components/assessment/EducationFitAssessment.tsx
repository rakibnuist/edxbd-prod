'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, ClipboardCheck, Loader2 } from 'lucide-react';
import {
  captureUtmParameters,
  getUtmParameters,
  trackAssessmentStart,
  trackAssessmentSubmit,
} from '@/lib/conversion-events';

const PRIVACY_VERSION = '2026-07-19';

const ACADEMIC_LEVELS = ['SSC / O Level', 'HSC / A Level', "Bachelor's", "Master's", 'Diploma', 'Other'];
const INTAKES = ['Spring 2027', 'Autumn 2027', 'Spring 2028', 'Not sure yet'];
const LANGUAGES = ['English (IELTS/TOEFL ready)', 'English (no test yet)', 'Willing to learn local language', 'Not sure yet'];
const BUDGETS = [
  'Under 5 lakh BDT / year',
  '5–10 lakh BDT / year',
  '10–20 lakh BDT / year',
  'Above 20 lakh BDT / year',
  'Not sure yet',
];
// China is flagship; Wave 1 is launching. Labels stay honest about status.
const DESTINATIONS = [
  { value: 'china', label: 'China — Flagship (Visa-first policy)' },
  { value: 'uk', label: 'United Kingdom — Active' },
  { value: 'hungary', label: 'Hungary — Active' },
  { value: 'south-korea', label: 'South Korea — Active' },
  { value: 'finland', label: 'Finland — Active' },
  { value: 'malaysia', label: 'Malaysia — Active' },
  { value: 'malta', label: 'Malta — Active' },
  { value: 'cyprus', label: 'Cyprus — Active' },
  { value: 'georgia', label: 'Georgia — Active (MBBS & General)' },
  { value: 'greece', label: 'Greece — Active' },
  { value: 'croatia', label: 'Croatia — Active' },
  { value: 'thailand', label: 'Thailand — Active' },
  { value: 'not-sure', label: 'Not sure — help me compare' },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  academicLevel: string;
  academicResults: string;
  subject: string;
  budget: string;
  intake: string;
  language: string;
  careerGoal: string;
  preferredCountries: string[];
  consent: boolean;
}

const EMPTY: FormState = {
  name: '',
  email: '',
  phone: '',
  academicLevel: '',
  academicResults: '',
  subject: '',
  budget: '',
  intake: '',
  language: '',
  careerGoal: '',
  preferredCountries: [],
  consent: false,
};

interface Summary {
  routes: string[];
  risks: string[];
  missing: string[];
  nextStep: string;
}

function buildSummary(f: FormState): Summary {
  const routes: string[] = [];
  const risks: string[] = [];
  const missing: string[] = [];

  const wantsChina = f.preferredCountries.includes('china');
  const wantsMedical = /mbbs|medicine|doctor|medical|dentist/i.test(`${f.subject} ${f.careerGoal}`);
  const notSure = f.preferredCountries.length === 0 || f.preferredCountries.includes('not-sure');

  if (wantsChina || notSure) {
    routes.push(
      'Study in China: our flagship route with a verified university list, scholarship conditions and a visa-first policy (no EduExpress service fee before China visa approval).'
    );
  }
  if (wantsMedical) {
    routes.push('MBBS pathway: recognition and licensing are checked first, before cost or promotion.');
    risks.push('Medical study abroad requires licensing checks for practising in Bangladesh — this must be confirmed for each university before you commit.');
  }
  const selectedActive = f.preferredCountries.filter((c) => !['china', 'not-sure'].includes(c));
  if (selectedActive.length > 0) {
    routes.push(
      `${selectedActive.map((c) => DESTINATIONS.find((d) => d.value === c)?.label.split(' —')[0]).join(', ')}: Active education service available. We will map entry rules, tuition, living expenses, recognition, and visa requirements in your custom report.`
    );
  }
  if (routes.length === 0) {
    routes.push('We will compare at least three suitable routes across our active destinations based on your academic profile and budget.');
  }

  if (!f.budget || f.budget === 'Not sure yet') {
    missing.push('A realistic yearly budget (tuition + living) so we can separate affordable routes from unaffordable ones.');
  }
  if (!f.language || f.language.includes('Not sure')) {
    missing.push('Your English test status (IELTS/TOEFL/Duolingo) or willingness to take one — this changes which programs are open to you.');
  }
  if (!f.academicResults) {
    missing.push('Your latest academic results (GPA/CGPA or grades) to match entry requirements.');
  }
  if (!f.intake || f.intake === 'Not sure yet') {
    missing.push('Your target intake, so we can map realistic deadlines.');
  }

  risks.push('Past performance does not guarantee an individual visa outcome. Scholarship coverage and availability change by university, intake and profile, and are verified before application.');

  const nextStep = wantsChina || notSure
    ? 'Book a free counseling session — we will prepare an EduFit Decision Report comparing your suitable routes with a written cost breakdown.'
    : 'Book a free counseling session for a written EduFit Decision Report and a ClearCost sheet for your chosen route.';

  return { routes, risks: Array.from(new Set(risks)), missing, nextStep };
}

export default function EducationFitAssessment() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    captureUtmParameters();
  }, []);

  // Fire assessment_start once, on first meaningful interaction.
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackAssessmentStart({ destination: form.preferredCountries[0] || 'unspecified' });
  };

  const update = (patch: Partial<FormState>) => {
    markStarted();
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const toggleCountry = (value: string) => {
    markStarted();
    setForm((prev) => {
      const has = prev.preferredCountries.includes(value);
      return {
        ...prev,
        preferredCountries: has
          ? prev.preferredCountries.filter((c) => c !== value)
          : [...prev.preferredCountries, value],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.name || !form.email || !form.phone) {
      setErrorMsg('Please provide your name, email and WhatsApp/phone so we can send your assessment.');
      return;
    }
    if (!form.consent) {
      setErrorMsg('Please agree to the privacy policy so we can contact you about this assessment.');
      return;
    }

    setStatus('submitting');
    const primaryDestination = form.preferredCountries.find((c) => c !== 'not-sure') || 'not-sure';

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: DESTINATIONS.find((d) => d.value === primaryDestination)?.label.split(' —')[0] || 'Not specified',
          program: form.subject || 'Not specified',
          message: `Career goal: ${form.careerGoal || 'n/a'}`,
          source: 'education_fit_assessment',
          leadType: 'assessment',
          destinationInterest: primaryDestination,
          assessment: {
            academicLevel: form.academicLevel,
            academicResults: form.academicResults,
            subject: form.subject,
            budget: form.budget,
            intake: form.intake,
            language: form.language,
            careerGoal: form.careerGoal,
            preferredCountries: form.preferredCountries,
          },
          consent: form.consent,
          consentTimestamp: new Date().toISOString(),
          consentPolicyVersion: PRIVACY_VERSION,
          landingPage: window.location.pathname,
          utm: getUtmParameters(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed');
      }

      trackAssessmentSubmit({ destination: primaryDestination });
      setSummary(buildSummary(form));
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again or contact us on WhatsApp.');
    }
  };

  if (status === 'done' && summary) {
    return (
      <div className="border-2 border-[#08263c] bg-white">
        <div className="flex items-center gap-3 border-b-2 border-[#08263c] bg-[#08263c] p-6 text-white sm:p-8">
          <CheckCircle2 className="shrink-0 text-[#64b5df]" size={28} />
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Your Education Fit summary</p>
            <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">Here is your first written read, {form.name.split(' ')[0]}</h2>
          </div>
        </div>
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#174f7a]">Suitable routes to explore</h3>
            <ul className="mt-3 space-y-3">
              {summary.routes.map((r) => (
                <li key={r} className="flex gap-3 border-l-4 border-[#64b5df] bg-[#f4f8fa] p-3 text-sm leading-6 text-slate-700">{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-[#174f7a]">Risks and honest caveats</h3>
            <ul className="mt-3 space-y-3">
              {summary.risks.map((r) => (
                <li key={r} className="flex gap-3 bg-[#fff7ed] p-3 text-sm leading-6 text-[#7c2d12]">{r}</li>
              ))}
            </ul>
          </div>
          {summary.missing.length > 0 && (
            <div className="lg:col-span-2">
              <h3 className="font-heading text-lg font-bold text-[#174f7a]">Information we still need</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {summary.missing.map((m) => (
                  <li key={m} className="flex gap-2 text-sm leading-6 text-slate-600"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#174f7a]" />{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 border-t-2 border-[#08263c] bg-[#64b5df] p-6 text-[#08263c] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="max-w-xl text-sm font-semibold leading-6">{summary.nextStep}</p>
          <Link href="/contact?service=education-fit-assessment" className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#08263c] px-6 py-4 text-sm font-black text-white hover:bg-[#174f7a]">Book my counseling session <ArrowUpRight size={18} /></Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-[#08263c] bg-white">
      <div className="flex items-center gap-3 border-b-2 border-[#08263c] bg-[#174f7a] p-6 text-white sm:p-8">
        <ClipboardCheck className="shrink-0 text-[#8ed0ee]" size={26} />
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Free · no obligation</p>
          <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">Get your Education Fit Assessment</h2>
        </div>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        {/* Contact */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Full name" required>
            <input value={form.name} onChange={(e) => update({ name: e.target.value })} className={inputCls} placeholder="Your full name" />
          </Field>
          <Field label="Email" required>
            <input type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} className={inputCls} placeholder="you@example.com" />
          </Field>
          <Field label="WhatsApp or phone" required>
            <input value={form.phone} onChange={(e) => update({ phone: e.target.value })} className={inputCls} placeholder="01XXXXXXXXX" />
          </Field>
        </div>

        {/* Academic */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Highest academic level">
            <select value={form.academicLevel} onChange={(e) => update({ academicLevel: e.target.value })} className={inputCls}>
              <option value="">Select one</option>
              {ACADEMIC_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Latest results (GPA / grades)">
            <input value={form.academicResults} onChange={(e) => update({ academicResults: e.target.value })} className={inputCls} placeholder="e.g. HSC GPA 4.5, CGPA 3.4" />
          </Field>
        </div>

        {/* Interest */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Subject or field of interest">
            <input value={form.subject} onChange={(e) => update({ subject: e.target.value })} className={inputCls} placeholder="e.g. Computer Science, MBBS, Business" />
          </Field>
          <Field label="Career goal">
            <input value={form.careerGoal} onChange={(e) => update({ careerGoal: e.target.value })} className={inputCls} placeholder="What you want this to lead to" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Yearly budget">
            <select value={form.budget} onChange={(e) => update({ budget: e.target.value })} className={inputCls}>
              <option value="">Select one</option>
              {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Target intake">
            <select value={form.intake} onChange={(e) => update({ intake: e.target.value })} className={inputCls}>
              <option value="">Select one</option>
              {INTAKES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Language readiness">
            <select value={form.language} onChange={(e) => update({ language: e.target.value })} className={inputCls}>
              <option value="">Select one</option>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
        </div>

        {/* Destinations */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#174f7a]">Preferred destinations <span className="font-semibold normal-case text-slate-400">(choose any — or none if unsure)</span></p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DESTINATIONS.map((d) => {
              const active = form.preferredCountries.includes(d.value);
              return (
                <button
                  type="button"
                  key={d.value}
                  onClick={() => toggleCountry(d.value)}
                  className={`border-2 px-3 py-2 text-sm font-bold transition ${active ? 'border-[#08263c] bg-[#08263c] text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-[#174f7a]'}`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Consent */}
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input type="checkbox" checked={form.consent} onChange={(e) => update({ consent: e.target.checked })} className="mt-1 size-4 shrink-0" />
          <span>I agree that EduExpress may contact me about this assessment. I have read the <Link href="/privacy" className="font-bold text-[#174f7a] underline">privacy policy</Link>.</span>
        </label>

        {errorMsg && <p className="border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex w-full items-center justify-center gap-3 bg-[#08263c] px-6 py-4 text-base font-black text-white transition hover:bg-[#174f7a] disabled:opacity-60"
        >
          {status === 'submitting' ? <><Loader2 className="animate-spin" size={19} /> Preparing your summary…</> : <>Get my Education Fit summary <ArrowUpRight size={19} /></>}
        </button>
        <p className="text-center text-xs leading-5 text-slate-400">No file-opening charge. Your details are used only for this assessment and are never published.</p>
      </div>
    </form>
  );
}

const inputCls =
  'w-full border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#174f7a] placeholder:text-slate-400';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#174f7a]">{label}{required && <span className="text-red-500"> *</span>}</span>
      {children}
    </label>
  );
}
