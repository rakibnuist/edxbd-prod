'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Fingerprint,
  Loader2,
  Radar,
  ScanLine,
  Send,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  analyticsAllowed,
  captureUtmParameters,
  createConversionEventId,
  getUtmParameters,
  trackAssessmentStart,
  trackAssessmentSubmit,
  trackCompareCompleted,
  trackCompareStarted,
} from '@/lib/conversion-events';

const priorities = [
  { value: 'cost', code: '01', title: 'Control the cost', note: 'Start from what your family can realistically sustain.' },
  { value: 'scholarship', code: '02', title: 'Find scholarship routes', note: 'Compare coverage, conditions and what remains payable.' },
  { value: 'career', code: '03', title: 'Maximise career value', note: 'Start with academic fit, recognition and the path after graduation.' },
  { value: 'speed', code: '04', title: 'Catch the next intake', note: 'Focus on routes that match your preparation time and document readiness.' },
];

const levels = ['SSC / O Level', 'HSC / A Level', "Bachelor's", "Master's", 'Diploma'];
const budgets = ['Under 5 lakh BDT / year', '5–10 lakh BDT / year', '10–20 lakh BDT / year', 'Above 20 lakh BDT / year', 'Not sure'];
const intakes = ['Spring 2027', 'Autumn 2027', 'Spring 2028', 'Not sure'];
const destinations = [
  { value: 'not-sure', label: 'Surprise me — compare' },
  { value: 'china', label: 'China' },
  { value: 'malaysia', label: 'Malaysia' },
  { value: 'south-korea', label: 'South Korea' },
  { value: 'hungary', label: 'Hungary' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'cyprus', label: 'Cyprus' },
];

const routePaths: Record<string, string> = {
  china: '/study-in-china-from-bangladesh',
  malaysia: '/destinations/malaysia',
  'south-korea': '/destinations/south-korea',
  hungary: '/destinations/hungary',
  uk: '/destinations/uk',
  cyprus: '/destinations/cyprus',
};

type Screen = 'priority' | 'profile' | 'limits' | 'signal' | 'contact' | 'done';

interface FormState {
  priority: string;
  academicLevel: string;
  result: string;
  subject: string;
  budget: string;
  intake: string;
  destination: string;
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}

const EMPTY: FormState = {
  priority: '', academicLevel: '', result: '', subject: '', budget: '', intake: '', destination: 'not-sure',
  name: '', email: '', phone: '', consent: false,
};

interface Signal {
  route: string;
  label: string;
  href: string;
  why: string[];
  verify: string[];
}

function destinationName(value: string) {
  return destinations.find(destination => destination.value === value)?.label || 'Open comparison';
}

function buildSignal(form: FormState): Signal {
  const medical = /mbbs|medicine|medical|doctor|dent/i.test(form.subject);
  const open = form.destination === 'not-sure';
  const route = open ? (medical ? 'China medical verification route' : form.priority === 'career' ? 'China + Malaysia comparison' : 'China-first comparison') : `${destinationName(form.destination)} route`;
  const href = open ? (medical ? '/mbbs-in-china-bangladesh' : '/destinations') : routePaths[form.destination] || '/destinations';
  const priorityLabel = priorities.find(priority => priority.value === form.priority)?.title.toLowerCase() || 'your main goal';

  const why = [
    `Built around ${priorityLabel}.`,
    `${form.academicLevel || 'Your academic level'} → ${form.subject || 'your chosen subject'}.`,
    `${form.budget || 'Budget'} and ${form.intake || 'intake'} stay visible in the comparison.`,
  ];

  const verify = [
    form.result ? 'Exact entry requirement against your result' : 'Your latest GPA, CGPA or grades',
    'Complete first-year and full-program cost',
    form.priority === 'scholarship' ? 'Scholarship coverage, conditions and renewal rules' : 'University recognition and program fit',
    medical ? 'Bangladesh recognition and licensing pathway' : 'Visa readiness and document gaps',
  ];

  return { route, label: open ? 'MULTI-ROUTE SIGNAL' : 'SELECTED ROUTE SIGNAL', href, why, verify };
}

const order: Screen[] = ['priority', 'profile', 'limits', 'signal', 'contact', 'done'];

export default function DecisionLab() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [screen, setScreen] = useState<Screen>('priority');
  const [signal, setSignal] = useState<Signal | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const started = useRef(false);

  useEffect(() => { captureUtmParameters(); }, []);

  const update = (patch: Partial<FormState>) => {
    if (!started.current) {
      started.current = true;
      trackAssessmentStart({ label: 'decision_lab' });
      trackCompareStarted({ label: 'decision_lab' });
    }
    setForm(previous => ({ ...previous, ...patch }));
  };

  const go = (next: Screen) => {
    setError('');
    setScreen(next);
  };

  const fromPriority = () => {
    if (!form.priority) return setError('Choose the decision that matters most to you.');
    go('profile');
  };

  const fromProfile = () => {
    if (!form.academicLevel || !form.subject) return setError('Choose your academic level and tell us the subject you want to study.');
    go('limits');
  };

  const revealSignal = () => {
    const result = buildSignal(form);
    setSignal(result);
    trackCompareCompleted({ destination: form.destination, label: 'decision_lab', priority: form.priority });
    go('signal');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone) return setError('Add your name, email and WhatsApp or phone number.');
    if (!form.consent) return setError('Agree to the privacy policy so a counselor can contact you.');
    setSubmitting(true);
    const metaEventId = createConversionEventId('lead');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          country: destinationName(form.destination),
          program: form.subject,
          source: 'homepage_decision_lab',
          leadType: 'assessment',
          destinationInterest: form.destination,
          assessment: {
            priority: form.priority,
            academicLevel: form.academicLevel,
            academicResults: form.result,
            subject: form.subject,
            budget: form.budget,
            intake: form.intake,
            suggestedRoute: signal?.route,
          },
          consent: form.consent,
          consentTimestamp: new Date().toISOString(),
          consentPolicyVersion: '2026-07-19',
          landingPage: window.location.pathname,
          utm: getUtmParameters(),
          trackingConsent: analyticsAllowed(),
          metaEventId,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed');
      }
      trackAssessmentSubmit({ destination: form.destination, label: 'decision_lab', priority: form.priority, eventId: metaEventId });
      setScreen('done');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentIndex = order.indexOf(screen);

  return (
    <form onSubmit={submit} className="decision-lab relative overflow-hidden rounded-[10px] border border-[#0a1f33] bg-[#08263c] text-white">
            <div className="relative border-b border-white/10 px-6 py-5 sm:px-9">
        <div className="flex items-center justify-between gap-5">
          <p className="ed-label flex items-center gap-2 text-[#8ed0ee]"><ScanLine size={14} /> EduExpress Decision Lab</p>
          <p className="ed-label text-white/60">Signal {String(Math.min(currentIndex + 1, 5)).padStart(2, '0')} / 05</p>
        </div>
        <div className="mt-4 flex gap-1.5" aria-label={`Stage ${Math.min(currentIndex + 1, 5)} of 5`}>
          {[0, 1, 2, 3, 4].map(index => <span key={index} className={`h-1 flex-1 rounded-full transition ${index <= currentIndex ? 'bg-[#8ed0ee]' : 'bg-white/10'}`} />)}
        </div>
      </div>

      <div className="relative min-h-[570px] px-6 py-9 sm:px-9 sm:py-11 lg:px-12">
        {screen === 'priority' && (
          <div>
            <p className="ed-label text-[#cbdbe6]">Question 01</p>
            <h2 className="ed-display mt-4 max-w-[16ch] text-[clamp(2.1rem,5vw,4rem)]">What matters most in your next decision?</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">Do not choose a country yet. Choose the problem you want the route to solve.</p>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {priorities.map(priority => {
                const active = form.priority === priority.value;
                return (
                  <button type="button" key={priority.value} onClick={() => update({ priority: priority.value })} className={`group flex min-h-[140px] items-start gap-5 rounded-[20px] border p-5 text-left transition ${active ? 'border-[#8ed0ee] bg-[#8ed0ee] text-[#071622]' : 'border-white/12 bg-white/[.035] hover:border-white/35'}`}>
                    <span className={`ed-figure text-xl ${active ? 'text-[#174f7a]' : 'text-[#8ed0ee]'}`}>{priority.code}</span>
                    <span><strong className="ed-display block text-xl">{priority.title}</strong><span className={`mt-3 block text-xs leading-5 ${active ? 'text-[#0a1f33]/65' : 'text-white/50'}`}>{priority.note}</span></span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {screen === 'profile' && (
          <div>
            <p className="ed-label text-[#cbdbe6]">Question 02</p>
            <h2 className="ed-display mt-4 max-w-[16ch] text-[clamp(2.1rem,5vw,4rem)]">Where are you starting from?</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">This turns a vague ambition into an academic route.</p>
            <div className="mt-9 grid gap-5 lg:grid-cols-[1fr_1fr]">
              <label><span className={labelClass}>Current academic level</span><select value={form.academicLevel} onChange={event => update({ academicLevel: event.target.value })} className={inputClass}><option value="">Choose your level</option>{levels.map(level => <option key={level}>{level}</option>)}</select></label>
              <label><span className={labelClass}>Latest result · optional</span><input value={form.result} onChange={event => update({ result: event.target.value })} className={inputClass} placeholder="HSC GPA 4.50 / CGPA 3.20" /></label>
              <label className="lg:col-span-2"><span className={labelClass}>What do you want to study?</span><input value={form.subject} onChange={event => update({ subject: event.target.value })} className={`${inputClass} text-lg`} placeholder="Computer Science, MBBS, Business, Engineering…" /></label>
            </div>
          </div>
        )}

        {screen === 'limits' && (
          <div>
            <p className="ed-label text-[#cbdbe6]">Question 03</p>
            <h2 className="ed-display mt-4 max-w-[17ch] text-[clamp(2.1rem,5vw,4rem)]">Give the dream some real boundaries.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">A route is only useful when timing and money make sense.</p>
            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              <label><span className={labelClass}>Yearly budget</span><select value={form.budget} onChange={event => update({ budget: event.target.value })} className={inputClass}><option value="">Choose a budget</option>{budgets.map(value => <option key={value}>{value}</option>)}</select></label>
              <label><span className={labelClass}>Target intake</span><select value={form.intake} onChange={event => update({ intake: event.target.value })} className={inputClass}><option value="">Choose an intake</option>{intakes.map(value => <option key={value}>{value}</option>)}</select></label>
            </div>
            <div className="mt-8">
              <p className={labelClass}>A destination in mind?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {destinations.map(destination => <button type="button" key={destination.value} onClick={() => update({ destination: destination.value })} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${form.destination === destination.value ? 'border-[#8ed0ee] bg-[#8ed0ee] text-[#071622]' : 'border-white/15 bg-white/[.03] text-white/65 hover:border-white/35'}`}>{destination.label}</button>)}
              </div>
            </div>
          </div>
        )}

        {screen === 'signal' && signal && (
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3"><Radar className="text-[#8ed0ee]" size={27} /><p className="ed-label text-[#8ed0ee]">{signal.label}</p></div>
              <h2 className="ed-display mt-5 text-[clamp(2.5rem,6vw,5rem)] text-balance">{signal.route}</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/55">This is a starting signal, not an admission promise. It shows where the next verification should begin.</p>
              <Link href={signal.href} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#071622]">Explore this route <ArrowRight size={16} /></Link>
            </div>
            <div className="rounded-[24px] border border-white/12 bg-white/[.035] p-6 sm:p-8">
              <div className="grid gap-7 sm:grid-cols-2">
                <div><p className="ed-label text-[#8ed0ee]">Why it starts here</p><ul className="mt-5 space-y-4">{signal.why.map(item => <li key={item} className="flex gap-3 text-sm leading-6 text-white/70"><Check size={16} className="mt-1 shrink-0 text-[#8ed0ee]" />{item}</li>)}</ul></div>
                <div><p className="ed-label text-[#f0b9b2]">Must be verified</p><ul className="mt-5 space-y-4">{signal.verify.map(item => <li key={item} className="flex gap-3 text-sm leading-6 text-white/70"><ShieldAlert size={16} className="mt-1 shrink-0 text-[#e1786b]" />{item}</li>)}</ul></div>
              </div>
            </div>
          </div>
        )}

        {screen === 'contact' && (
          <div>
            <p className="ed-label flex items-center gap-2 text-[#8ed0ee]"><Fingerprint size={14} /> Optional human layer</p>
            <h2 className="ed-display mt-4 max-w-[15ch] text-[clamp(2.1rem,5vw,4rem)]">Turn the signal into a counselor-checked shortlist.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">Your instant route is already yours. Share details only if you want a named counselor to review it.</p>
            <div className="mt-9 grid gap-5 sm:grid-cols-3">
              <label><span className={labelClass}>Full name</span><input value={form.name} onChange={event => update({ name: event.target.value })} className={inputClass} placeholder="Your name" /></label>
              <label><span className={labelClass}>Email</span><input type="email" value={form.email} onChange={event => update({ email: event.target.value })} className={inputClass} placeholder="you@example.com" /></label>
              <label><span className={labelClass}>WhatsApp / phone</span><input value={form.phone} onChange={event => update({ phone: event.target.value })} className={inputClass} placeholder="01XXXXXXXXX" /></label>
            </div>
            <label className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4 text-xs leading-6 text-white/55"><input type="checkbox" checked={form.consent} onChange={event => update({ consent: event.target.checked })} className="mt-1 size-4 accent-[#8ed0ee]" /><span>I agree that EduExpress may contact me about this assessment. I have read the <Link href="/privacy" className="font-bold text-[#8ed0ee] underline">privacy policy</Link>.</span></label>
          </div>
        )}

        {screen === 'done' && (
          <div className="grid min-h-[460px] place-items-center text-center">
            <div className="max-w-xl"><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#8ed0ee] text-[#071622]"><CheckCircle2 size={31} /></span><p className="ed-label mt-7 text-[#8ed0ee]">Signal transmitted</p><h2 className="ed-display mt-4 text-[clamp(2.5rem,6vw,5rem)]">A human can take it from here.</h2><p className="mt-5 text-sm leading-7 text-white/55">Your profile, decision priority and starting route are ready for counselor review.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/universities" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#071622]">Explore universities <ArrowRight size={16} /></Link><Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-bold text-white">Visit decision desk <ArrowRight size={16} /></Link></div></div>
          </div>
        )}

        {error && <p role="alert" className="mt-6 rounded-xl border border-[#c0392b]/45 bg-[#c0392b]/10 px-4 py-3 text-sm text-[#f0b9b2]">{error}</p>}
      </div>

      {screen !== 'done' && (
        <div className="relative flex flex-wrap items-center gap-3 border-t border-white/10 px-6 py-5 sm:px-9">
          {screen === 'priority' && <><span className="mr-auto text-xs text-white/60">No country. No contact details. Start with the decision.</span><button type="button" onClick={fromPriority} className={primaryButton}>Next signal <ArrowRight size={16} /></button></>}
          {screen === 'profile' && <><button type="button" onClick={() => go('priority')} className={backButton}><ArrowLeft size={16} /> Back</button><button type="button" onClick={fromProfile} className={`ml-auto ${primaryButton}`}>Set boundaries <ArrowRight size={16} /></button></>}
          {screen === 'limits' && <><button type="button" onClick={() => go('profile')} className={backButton}><ArrowLeft size={16} /> Back</button><button type="button" onClick={revealSignal} className={`ml-auto ${primaryButton}`}>Reveal my route signal <Sparkles size={16} /></button></>}
          {screen === 'signal' && <><button type="button" onClick={() => go('limits')} className={backButton}><ArrowLeft size={16} /> Recalibrate</button><button type="button" onClick={() => go('contact')} className={`ml-auto ${primaryButton}`}>Ask a human to verify <ArrowRight size={16} /></button></>}
          {screen === 'contact' && <><button type="button" onClick={() => go('signal')} className={backButton}><ArrowLeft size={16} /> Keep instant result</button><button type="submit" disabled={submitting} className={`ml-auto ${primaryButton} disabled:opacity-50`}>{submitting ? <><Loader2 className="animate-spin" size={16} /> Sending</> : <>Send for human review <Send size={16} /></>}</button></>}
        </div>
      )}
    </form>
  );
}

const labelClass = 'ed-label mb-2 block text-[#8ed0ee]';
const inputClass = 'w-full rounded-2xl border border-white/12 bg-white/[.055] px-5 py-4 text-sm text-white outline-none transition focus:border-[#8ed0ee] focus:bg-white/[.08] placeholder:text-white/25';
const primaryButton = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8ed0ee] px-6 text-sm font-bold text-[#071622] transition hover:bg-white';
const backButton = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-5 text-sm font-bold text-white/70 transition hover:border-white/35 hover:text-white';
