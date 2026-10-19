'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  captureUtmParameters,
  getUtmParameters,
  trackAssessmentStart,
  trackAssessmentSubmit,
  trackCompareCompleted,
  trackCompareStarted,
} from '@/lib/conversion-events';
import { destinationLinks } from '@/data/siteNavigation';

const PRIVACY_VERSION = '2026-07-19';

const ACADEMIC_LEVELS = ['SSC / O Level', 'HSC / A Level', "Bachelor's", "Master's", 'Diploma', 'Other'];
const INTAKES = ['Spring 2027', 'Autumn 2027', 'Spring 2028', 'Not sure yet'];
const APPLICATION_INTAKES = ['Next available intake', 'Spring intake', 'Autumn intake', 'Flexible / discuss with counselor'];
const LANGUAGES = ['IELTS / TOEFL ready', 'English — no test yet', 'Willing to learn another language', 'Not sure yet'];
const BUDGETS = [
  'Under 5 lakh BDT / year',
  '5–10 lakh BDT / year',
  '10–20 lakh BDT / year',
  'Above 20 lakh BDT / year',
  'Not sure yet',
];

const destinationValue = (name: string) => {
  if (name === 'United Kingdom') return 'uk';
  return name.toLowerCase().replace(/\s+/g, '-');
};

const DESTINATIONS = [
  ...destinationLinks.map(destination => ({
    value: destinationValue(destination.name),
    label: destination.name,
    href: destination.href,
  })),
  { value: 'not-sure', label: 'Help me compare', href: '/destinations' },
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

interface RouteRecommendation {
  title: string;
  badge: string;
  note: string;
  href: string;
}

interface Summary {
  routes: RouteRecommendation[];
  checks: string[];
  missing: string[];
}

type Screen = 'profile' | 'plan' | 'results' | 'contact' | 'done';

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

function getDestination(value: string) {
  return DESTINATIONS.find(destination => destination.value === value);
}

function buildSummary(form: FormState): Summary {
  const routes: RouteRecommendation[] = [];
  const checks: string[] = [];
  const missing: string[] = [];
  const notSure = form.preferredCountries.length === 0 || form.preferredCountries.includes('not-sure');
  const wantsChina = notSure || form.preferredCountries.includes('china');
  const wantsMalaysia = notSure || form.preferredCountries.includes('malaysia');
  const medical = /mbbs|medicine|medical|doctor|dentist/i.test(`${form.subject} ${form.careerGoal}`);

  if (wantsChina) {
    routes.push({
      title: medical ? 'China medical route — verify first' : 'China university route',
      badge: medical ? 'Recognition check required' : 'Flagship route',
      note: medical
        ? 'Start with university recognition, licensing and current eligibility before comparing scholarships or price.'
        : 'Start with universities that match your academic level, subject, budget and English readiness. Scholarship conditions are checked per intake.',
      href: medical ? '/mbbs-in-china-bangladesh' : '/china-universities',
    });
  }

  if (wantsMalaysia && !medical) {
    routes.push({
      title: 'Malaysia pathway',
      badge: 'Second route to compare',
      note: 'Compare Foundation, Diploma and Bachelor pathways by entry level, English requirement and complete first-year cost.',
      href: '/study-in-malaysia-from-bangladesh',
    });
  }

  for (const value of form.preferredCountries.filter(value => !['china', 'malaysia', 'not-sure'].includes(value)).slice(0, 2)) {
    const destination = getDestination(value);
    if (!destination) continue;
    routes.push({
      title: `${destination.label} study route`,
      badge: 'Profile review needed',
      note: 'Entry rules, recognition, complete cost and visa readiness must be checked against your exact program and intake.',
      href: destination.href,
    });
  }

  if (routes.length === 0) {
    routes.push({
      title: 'Compare active destinations',
      badge: 'Open comparison',
      note: 'A counselor can compare suitable routes after checking your academic profile, budget, subject and English readiness.',
      href: '/destinations',
    });
  }

  if (!form.academicResults) missing.push('Latest GPA, CGPA or grades');
  if (!form.budget || form.budget === 'Not sure yet') missing.push('A realistic yearly budget including living costs');
  if (!form.language || form.language === 'Not sure yet') missing.push('English test status or preparation plan');
  if (!form.intake || form.intake === 'Not sure yet') missing.push('Preferred intake and application timing');

  checks.push('University recognition and program fit');
  checks.push('Tuition, living and third-party fees separately');
  checks.push('Scholarship conditions and renewal rules');
  if (medical) checks.push('Bangladesh licensing and recognition pathway');
  else checks.push('Visa readiness and document gaps');

  return { routes: routes.slice(0, 3), checks, missing };
}

type InitialContext = { university?: string; program?: string; country?: string; intent?: 'application' };

export default function EducationFitAssessment({ initialContext }: { initialContext?: InitialContext } = {}) {
  const isApplication = initialContext?.intent === 'application';
  const eventLabel = isApplication ? 'university_application' : 'homepage_discovery';
  const [form, setForm] = useState<FormState>(() => {
    const country = initialContext?.country ? destinationValue(initialContext.country) : '';
    return { ...EMPTY, subject: initialContext?.program || '', preferredCountries: DESTINATIONS.some(destination => destination.value === country) ? [country] : [] };
  });
  const [screen, setScreen] = useState<Screen>('profile');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    captureUtmParameters();
  }, []);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackAssessmentStart({ destination: form.preferredCountries[0] || 'unspecified', label: eventLabel });
    if (!isApplication) trackCompareStarted({ destination: form.preferredCountries[0] || 'unspecified', label: eventLabel });
  };

  const update = (patch: Partial<FormState>) => {
    markStarted();
    setForm(previous => ({ ...previous, ...patch }));
  };

  const toggleCountry = (value: string) => {
    markStarted();
    setForm(previous => {
      if (value === 'not-sure') {
        return { ...previous, preferredCountries: previous.preferredCountries.includes(value) ? [] : [value] };
      }
      const withoutNotSure = previous.preferredCountries.filter(country => country !== 'not-sure');
      const has = withoutNotSure.includes(value);
      return {
        ...previous,
        preferredCountries: has
          ? withoutNotSure.filter(country => country !== value)
          : [...withoutNotSure, value].slice(-3),
      };
    });
  };

  const continueFromProfile = () => {
    setErrorMsg('');
    if (!form.academicLevel || !form.subject) {
      setErrorMsg('Choose your current academic level and the subject you want to study.');
      return;
    }
    setScreen('plan');
  };

  const showResults = () => {
    setErrorMsg('');
    const nextSummary = buildSummary(form);
    setSummary(nextSummary);
    setScreen(isApplication ? 'contact' : 'results');
    if (!isApplication) trackCompareCompleted({
      destination: form.preferredCountries[0] || 'not-sure',
      label: 'homepage_discovery',
      route_count: nextSummary.routes.length,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg('');

    if (!form.name || !form.email || !form.phone) {
      setErrorMsg('Provide your name, email and WhatsApp or phone number.');
      return;
    }
    if (!form.consent) {
      setErrorMsg('Agree to the privacy policy so a counselor can review and contact you.');
      return;
    }

    setStatus('submitting');
    const primaryDestination = form.preferredCountries.find(country => country !== 'not-sure') || 'not-sure';

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: getDestination(primaryDestination)?.label || 'Not specified',
          program: form.subject || 'Not specified',
          message: [isApplication && 'University application support request', initialContext?.university && `University: ${initialContext.university}`, initialContext?.program && `Selected program: ${initialContext.program}`, `Career goal: ${form.careerGoal || 'not provided'}`].filter(Boolean).join('\n'),
          notes: isApplication ? ['Application support requested through the university profile', initialContext?.university && `University: ${initialContext.university}`, initialContext?.program && `Selected program: ${initialContext.program}`, initialContext?.country && `Selected country: ${initialContext.country}`].filter(Boolean).join(' | ') : undefined,
          source: isApplication ? 'university_profile_application' : 'homepage_admissions_discovery',
          leadType: isApplication ? 'application' : 'assessment',
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
            suggestedRoutes: summary?.routes.map(route => route.title) || [],
          },
          consent: form.consent,
          consentTimestamp: new Date().toISOString(),
          consentPolicyVersion: PRIVACY_VERSION,
          landingPage: window.location.pathname,
          utm: getUtmParameters(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed');
      }

      trackAssessmentSubmit({ destination: primaryDestination, label: eventLabel });
      setStatus('idle');
      setScreen('done');
    } catch (error) {
      setStatus('error');
      setErrorMsg(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  const progress = screen === 'profile' ? 1 : screen === 'plan' || screen === 'results' ? 2 : 3;

  if (screen === 'done') {
    return (
      <div className="overflow-hidden rounded-[22px] border border-[#174f7a]/20 bg-white shadow-[0_24px_70px_rgba(8,38,60,.14)]">
        <div className="bg-[#0a1f33] p-7 text-white sm:p-9">
          <CheckCircle2 className="text-[#8ed0ee]" size={34} />
          <p className="ed-label mt-6 text-[#8ed0ee]">{isApplication ? 'Application support request received' : 'Assessment received'}</p>
          <h2 className="ed-display mt-3 text-3xl">Your profile is ready for counselor review.</h2>
          <p className="mt-4 text-sm leading-6 text-white/70">
            {isApplication ? 'A counselor will review your preferred university, program and academic profile, then help with eligibility, documents and the application process. This request is not a university admission offer.' : 'We have your study plan and starting routes. A counselor can now check the exact university, cost and document details.'}
          </p>
        </div>
        <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-8">
          <Link href="/universities" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#174f7a] px-5 text-sm font-bold text-white">
            Browse universities <ArrowRight size={16} />
          </Link>
          <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#c9d8e6] px-5 text-sm font-bold text-[#0a1f33]">
            Contact the office <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-[22px] border border-[#174f7a]/20 bg-white shadow-[0_24px_70px_rgba(8,38,60,.14)]">
      <div className="border-b border-[#e2e7ee] bg-[#0a1f33] p-6 text-white sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#8ed0ee] text-[#0a1f33]">
              <SearchCheck size={22} />
            </span>
            <div>
              <p className="ed-label text-[#8ed0ee]">{isApplication ? 'University application support' : 'Free admissions discovery'}</p>
              <h2 className="ed-display mt-1 text-2xl sm:text-[1.75rem]">{isApplication ? 'Tell us about your study plans' : 'See your starting routes'}</h2>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70">2 min</span>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2" aria-label={`Step ${progress} of 3`}>
          {(isApplication ? ['Profile', 'Study plan', 'Contact'] : ['Profile', 'Routes', 'Review']).map((label, index) => (
            <div key={label}>
              <div className={`h-1.5 rounded-full ${index + 1 <= progress ? 'bg-[#8ed0ee]' : 'bg-white/15'}`} />
              <span className={`mt-2 block text-xs font-semibold ${index + 1 === progress ? 'text-white' : 'text-white/50'}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-7">
        {screen === 'profile' && (
          <div className="space-y-5">
            <div>
              <h3 className="ed-display text-2xl text-[#0a1f33]">What do you want to study?</h3>
              <p className="mt-2 text-sm leading-6 text-[#55677a]">Start with what you know. Exact documents can come later.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Current level" required>
                <select value={form.academicLevel} onChange={event => update({ academicLevel: event.target.value })} className={inputClass}>
                  <option value="">Choose your level</option>
                  {ACADEMIC_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </Field>
              <Field label="Latest result">
                <input value={form.academicResults} onChange={event => update({ academicResults: event.target.value })} className={inputClass} placeholder="HSC GPA 4.5" />
              </Field>
              <Field label="Subject or field" required>
                <input value={form.subject} onChange={event => update({ subject: event.target.value })} className={inputClass} placeholder="Computer Science, MBBS…" />
              </Field>
              <Field label="Career goal">
                <input value={form.careerGoal} onChange={event => update({ careerGoal: event.target.value })} className={inputClass} placeholder="What do you want to become?" />
              </Field>
            </div>
          </div>
        )}

        {screen === 'plan' && (
          <div className="space-y-5">
            <div>
              <h3 className="ed-display text-2xl text-[#0a1f33]">{isApplication ? 'Plan your study preferences' : 'What should the route fit?'}</h3>
              <p className="mt-2 text-sm leading-6 text-[#55677a]">{isApplication ? 'Add your budget, preferred intake and language readiness to guide the application review.' : 'Choose “not sure” whenever you want us to compare.'}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Yearly budget">
                <select value={form.budget} onChange={event => update({ budget: event.target.value })} className={inputClass}>
                  <option value="">Choose a range</option>
                  {BUDGETS.map(value => <option key={value} value={value}>{value}</option>)}
                </select>
              </Field>
              <Field label="Target intake">
                <select value={form.intake} onChange={event => update({ intake: event.target.value })} className={inputClass}>
                  <option value="">Choose an intake</option>
                  {(isApplication ? APPLICATION_INTAKES : INTAKES).map(value => <option key={value} value={value}>{value}</option>)}
                </select>
              </Field>
              <Field label="English readiness">
                <select value={form.language} onChange={event => update({ language: event.target.value })} className={inputClass}>
                  <option value="">Choose one</option>
                  {LANGUAGES.map(value => <option key={value} value={value}>{value}</option>)}
                </select>
              </Field>
            </div>
            <div>
              <p className="ed-label text-[#174f7a]">{isApplication ? 'Preferred destinations · choose up to 3' : 'Destinations to compare · choose up to 3'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {DESTINATIONS.map(destination => {
                  const active = form.preferredCountries.includes(destination.value);
                  return (
                    <button
                      type="button"
                      key={destination.value}
                      onClick={() => toggleCountry(destination.value)}
                      className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${active ? 'border-[#0a1f33] bg-[#0a1f33] text-white' : 'border-[#d8e1e9] bg-[#f7fafc] text-[#55677a] hover:border-[#174f7a]'}`}
                    >
                      {destination.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {screen === 'results' && summary && (
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e6f4fb] text-[#174f7a]"><Sparkles size={19} /></span>
              <div>
                <p className="ed-label text-[#2f7fbf]">Your instant starting point</p>
                <h3 className="ed-display mt-1 text-2xl text-[#0a1f33]">Routes worth checking first</h3>
              </div>
            </div>
            <div className="space-y-3">
              {summary.routes.map(route => (
                <Link key={route.title} href={route.href} className="group block rounded-2xl border border-[#dce5ed] bg-[#f8fbfd] p-4 transition hover:border-[#64b5df] hover:bg-white">
                  <span className="ed-label text-[#c0392b]">{route.badge}</span>
                  <span className="mt-2 flex items-center justify-between gap-4">
                    <strong className="text-base text-[#0a1f33]">{route.title}</strong>
                    <ArrowRight size={16} className="shrink-0 text-[#2f7fbf] transition group-hover:translate-x-1" />
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-[#55677a]">{route.note}</span>
                </Link>
              ))}
            </div>
            <div className="grid gap-4 rounded-2xl bg-[#0a1f33] p-5 text-white sm:grid-cols-2">
              <div>
                <p className="ed-label text-[#8ed0ee]">We will verify</p>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-white/75">
                  {summary.checks.map(item => <li key={item} className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#8ed0ee]" />{item}</li>)}
                </ul>
              </div>
              <div>
                <p className="ed-label text-[#f0c36a]">Still needed</p>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-white/75">
                  {(summary.missing.length ? summary.missing : ['Your documents for a final eligibility check']).map(item => <li key={item} className="flex gap-2"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#f0c36a]" />{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        {screen === 'contact' && (
          <div className="space-y-5">
            <div>
              <p className="ed-label text-[#2f7fbf]">{isApplication ? 'Contact details' : 'Optional counselor review'}</p>
              <h3 className="ed-display mt-2 text-2xl text-[#0a1f33]">{isApplication ? 'Start your application with EduExpress.' : 'Get a written shortlist checked by a person.'}</h3>
              <p className="mt-2 text-sm leading-6 text-[#55677a]">{isApplication ? 'Share your contact details so a counselor can review your eligibility and help with the university application.' : 'Your instant result stays free. Share contact details only if you want a counselor to review it.'}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Full name" required><input value={form.name} onChange={event => update({ name: event.target.value })} className={inputClass} placeholder="Your name" /></Field>
              <Field label="Email" required><input type="email" value={form.email} onChange={event => update({ email: event.target.value })} className={inputClass} placeholder="you@example.com" /></Field>
              <Field label="WhatsApp / phone" required><input value={form.phone} onChange={event => update({ phone: event.target.value })} className={inputClass} placeholder="01XXXXXXXXX" /></Field>
            </div>
            <label className="flex items-start gap-3 rounded-2xl bg-[#f5f7f9] p-4 text-sm leading-6 text-[#55677a]">
              <input type="checkbox" checked={form.consent} onChange={event => update({ consent: event.target.checked })} className="mt-1 size-4 shrink-0 accent-[#174f7a]" />
              <span>I agree that EduExpress may contact me about this {isApplication ? 'application request' : 'assessment'}. I have read the <Link href="/privacy" className="font-bold text-[#174f7a] underline">privacy policy</Link>.</span>
            </label>
          </div>
        )}

        {errorMsg && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>}

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-[#e2e7ee] pt-5">
          {screen === 'profile' && (
            <>
              <span className="mr-auto text-xs text-[#6c7b89]">No contact details required</span>
              <button type="button" onClick={continueFromProfile} className={primaryButton}>Continue <ArrowRight size={17} /></button>
            </>
          )}
          {screen === 'plan' && (
            <>
              <button type="button" onClick={() => { setErrorMsg(''); setScreen('profile'); }} className={secondaryButton}><ArrowLeft size={16} /> Back</button>
              <button type="button" onClick={showResults} className={`ml-auto ${primaryButton}`}>{isApplication ? 'Continue to contact details' : 'Show my starting routes'} <SearchCheck size={17} /></button>
            </>
          )}
          {screen === 'results' && (
            <>
              <button type="button" onClick={() => setScreen('plan')} className={secondaryButton}><ArrowLeft size={16} /> Edit answers</button>
              <button type="button" onClick={() => setScreen('contact')} className={`ml-auto ${primaryButton}`}>Get a written shortlist <ArrowRight size={17} /></button>
            </>
          )}
          {screen === 'contact' && (
            <>
              <button type="button" onClick={() => { setErrorMsg(''); setScreen(isApplication ? 'plan' : 'results'); }} className={secondaryButton}><ArrowLeft size={16} /> Back</button>
              <button type="submit" disabled={status === 'submitting'} className={`ml-auto ${primaryButton} disabled:opacity-60`}>
                {status === 'submitting' ? <><Loader2 className="animate-spin" size={17} /> Sending…</> : <><ClipboardCheck size={17} /> {isApplication ? 'Request application support' : 'Request counselor review'}</>}
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

const inputClass = 'w-full rounded-xl border border-[#d8e1e9] bg-white px-4 py-3 text-sm text-[#0a1f33] outline-none transition focus:border-[#174f7a] focus:ring-2 focus:ring-[#64b5df]/25 placeholder:text-slate-400';
const primaryButton = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0a1f33] px-5 text-sm font-bold text-white transition hover:bg-[#174f7a]';
const secondaryButton = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#c9d8e6] bg-white px-5 text-sm font-bold text-[#174f7a] transition hover:border-[#174f7a]';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.09em] text-[#174f7a]">{label}{required && <span className="text-[#c0392b]"> *</span>}</span>
      {children}
    </label>
  );
}
