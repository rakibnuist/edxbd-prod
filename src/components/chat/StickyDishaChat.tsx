'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  Loader2,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

import {
  analyticsAllowed,
  createConversionEventId,
  getUtmParameters,
  trackAssessmentSubmit,
  trackWhatsAppClick,
} from '@/lib/conversion-events';
import { getConsentedSubmissionMetaParams } from '@/lib/meta-param-builder-client';
import { persistTrackingLeadId } from '@/lib/tracking-consent';
import type { AdvisorCitation, AdvisorStreamEvent } from '@/lib/advisor-tools';
import type { FitResponseLanguage } from '@/lib/fit-matcher';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: AdvisorCitation[];
  isLeadForm?: boolean;
  leadSubmitted?: boolean;
  leadName?: string;
  leadDestination?: string;
  timestamp?: number;
}

const DESTINATIONS = [
  'China',
  'Malaysia',
  'United Kingdom',
  'South Korea',
  'Hungary',
  'Finland',
  'Not sure yet',
];

const STUDY_LEVELS = [
  'HSC / A Level',
  "Bachelor's Degree",
  "Master's Degree",
  'MBBS / Medicine',
  'PhD',
  'Language / Foundation',
];

const PRESETS: Record<FitResponseLanguage, Array<{ label: string; query: string; isLeadTrigger?: boolean }>> = {
  en: [
    { label: '🎯 Free Profile Assessment', query: 'I would like a free profile assessment for study abroad.', isLeadTrigger: true },
    { label: '🇨🇳 China March/Sept Intakes', query: 'What are the intake deadlines and scholarship options for China?' },
    { label: '🩺 MBBS in China & BMDC Rules', query: 'What are the BMDC and WDOMS recognition requirements for MBBS in China?' },
    { label: '💰 ClearCost Breakdown', query: 'How does EduExpress itemize total tuition, hostel, and visa-first fees?' },
    { label: '💬 Talk on WhatsApp', query: 'whatsapp_counselor' },
  ],
  bn: [
    { label: '🎯 ফ্রি প্রোফাইল মূল্যায়ন', query: 'আমি বিদেশে উচ্চশিক্ষার জন্য একটি ফ্রি প্রোফাইল মূল্যায়ন করতে চাই।', isLeadTrigger: true },
    { label: '🇨🇳 চায়না স্কলারশিপ ও ইনটেক', query: 'চীনে মার্চ ও সেপ্টেম্বর ইনটেকের স্কলারশিপ এবং আবেদনের নিয়ম কী?' },
    { label: '🩺 MBBS ও BMDC স্বীকৃতি', query: 'চীনে MBBS পড়ার জন্য BMDC ও WDOMS স্বীকৃতির নিয়ম এবং টিউশন ফি কেমন?' },
    { label: '💰 প্রকৃত সম্পূর্ণ খরচ', query: 'টিউশন, হোস্টেল এবং ভিসা-ফার্স্ট সার্ভিস চার্জ পলিসির নিয়ম কী?' },
    { label: '💬 হোয়াটসঅ্যাপে কথা বলুন', query: 'whatsapp_counselor' },
  ],
};

const TEASER_DISMISSED_KEY = 'edx_disha_teaser_dismissed_v1';
const CHAT_PHONE = '+8801983333566';
const PRIVACY_VERSION = '2026-07-19';

function renderMessageContent(text: string) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 text-[14px] leading-relaxed text-ink-soft">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={`sp-${idx}`} className="h-1" />;
        }

        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ');
        const isSubBullet = trimmed.startsWith('  • ') || trimmed.startsWith('    • ');
        const cleanText = trimmed.replace(/^[-•]\s+/, '').replace(/^•\s+/, '');

        const parts = cleanText.split(/(\*\*[^*]+\*\*)/g);
        const formatted = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-semibold text-petrol-800">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet || isSubBullet) {
          return (
            <div key={`line-${idx}`} className={`flex items-start gap-2 ${isSubBullet ? 'pl-4 text-[13px]' : 'pl-0.5'}`}>
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
              <div className="flex-1">{formatted}</div>
            </div>
          );
        }

        return <p key={`line-${idx}`}>{formatted}</p>;
      })}
    </div>
  );
}

export default function StickyDishaChat({
  phoneNumber = CHAT_PHONE,
}: {
  phoneNumber?: string;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [language, setLanguage] = useState<FitResponseLanguage>('en');
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [streamingCitations, setStreamingCitations] = useState<AdvisorCitation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // In-chat Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCountry, setLeadCountry] = useState('China');
  const [leadLevel, setLeadLevel] = useState("Bachelor's Degree");
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Hidden on admin, dashboard and login routes
  const isExcluded =
    !pathname ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/login');

  // Initial welcome message with upfront Lead Capture Card
  useEffect(() => {
    const welcomeEn: ChatMessage = {
      id: 'disha-welcome',
      role: 'assistant',
      content:
        "👋 **Hi, I'm Disha (দিশা)** — your EduExpress AI Study Advisor.\n\nTo find suitable universities, scholarship options, and get an **itemized written cost schedule**, enter your details below. Our senior counselor from Dhanmondi will evaluate your file within 1 working day:\n\n*(You can also ask me any questions directly below!)*",
      isLeadForm: true,
      timestamp: Date.now(),
    };

    const welcomeBn: ChatMessage = {
      id: 'disha-welcome-bn',
      role: 'assistant',
      content:
        "👋 **নমস্কার/হ্যালো! আমি দিশা (Disha)** — এডুএক্সপ্রেসের এআই স্টাডি অ্যাডভাইজর।\n\nআপনার রেজাল্ট ও বাজেট অনুযায়ী উপযুক্ত বিশ্ববিদ্যালয়, স্কলারশিপ ও **লিখিত সম্পূর্ণ খরচ শিডিউল** পেতে নিচে আপনার তথ্য দিন। আমাদের ধানমন্ডি অফিস থেকে দ্রুত ফাইল যাচাই করা হবে:\n\n*(অথবা নিচে আপনার যেকোনো প্রশ্ন সরাসরি টাইপ করতে পারেন!)*",
      isLeadForm: true,
      timestamp: Date.now(),
    };

    setMessages([language === 'bn' ? welcomeBn : welcomeEn]);
  }, [language]);

  // Teaser display timer
  useEffect(() => {
    if (isExcluded) return;

    const timer = setTimeout(() => {
      try {
        const dismissed = window.sessionStorage.getItem(TEASER_DISMISSED_KEY);
        if (!dismissed && !isOpen) {
          setShowTeaser(true);
        }
      } catch {
        // ignore
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [isExcluded, isOpen]);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingText, isOpen]);

  const dismissTeaser = useCallback(() => {
    setShowTeaser(false);
    try {
      window.sessionStorage.setItem(TEASER_DISMISSED_KEY, '1');
    } catch {
      // ignore
    }
  }, []);

  const handleOpenChat = () => {
    dismissTeaser();
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const openWhatsAppDirect = (customText?: string) => {
    const defaultMsg =
      language === 'bn'
        ? 'আসসালামু আলাইকুম। আমি এডুএক্সপ্রেসের স্টাডি অ্যাডভাইজর দিশার মাধ্যমে যোগাযোগ করছি। উচ্চশিক্ষা সংক্রান্ত বিষয়ে কথা বলতে চাই।'
        : 'Hi! I am reaching out from eduexpressint.com through Disha. I would like counseling for studying abroad.';
    const text = customText || defaultMsg;
    trackWhatsAppClick({ label: 'disha_sticky_chat' });
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const finalPhone = cleanPhone.startsWith('880') ? cleanPhone : `880${cleanPhone}`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const triggerLeadForm = () => {
    const activeForm = messages.find((m) => m.isLeadForm && !m.leadSubmitted);
    if (activeForm) {
      const formEl = document.getElementById('disha-lead-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const promptMsg: ChatMessage = {
      id: `lead-req-${++messageIdCounter.current}`,
      role: 'assistant',
      content:
        language === 'bn'
          ? '📋 **ফ্রি প্রোফাইল মূল্যায়ন ও লিখিত খরচ শিডিউল:**\nনিচের ফর্মে আপনার তথ্য দিন। আমাদের ধানমন্ডি অফিসের একজন অভিজ্ঞ সিনিয়র কাউন্সেলর ১ কার্যদিবসের মধ্যে আপনার ফাইল যাচাই করে বিস্তারিত জানাবেন।'
          : '📋 **Free Profile Assessment & Written Cost Schedule:**\nPlease provide your details below. A senior counselor from our Dhanmondi office will evaluate your academic file and contact you within 1 working day.',
      isLeadForm: true,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, promptMsg]);
  };

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLeadError('');

    if (!leadName.trim()) {
      setLeadError(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your full name.');
      return;
    }
    if (!leadPhone.trim()) {
      setLeadError(language === 'bn' ? 'অনুগ্রহ করে আপনার ফোন/হোয়াটসঅ্যাপ নম্বর দিন।' : 'Please enter your phone/WhatsApp number.');
      return;
    }
    if (!leadEmail.trim() || !leadEmail.includes('@')) {
      setLeadError(language === 'bn' ? 'সঠিক ইমেইল এড্রেস প্রদান করুন।' : 'Please enter a valid email address.');
      return;
    }
    if (!leadConsent) {
      setLeadError(
        language === 'bn'
          ? 'প্রাইভেসি শর্তাবলীতে সম্মতি প্রদান করুন।'
          : 'Please accept the privacy terms to proceed.',
      );
      return;
    }

    setLeadSubmitting(true);
    const eventId = createConversionEventId('lead');

    try {
      const metaParams = await getConsentedSubmissionMetaParams();
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...metaParams,
          name: leadName.trim(),
          email: leadEmail.trim(),
          phone: leadPhone.trim(),
          country: leadCountry,
          program: leadLevel,
          message: `Disha Sticky Chatbot Lead. Destination: ${leadCountry}. Study Level: ${leadLevel}.`,
          source: 'disha_sticky_chat',
          leadType: 'assessment',
          destinationInterest: leadCountry === 'Not sure yet' ? [] : [leadCountry],
          assessment: {
            academicLevel: leadLevel,
            preferredCountries: leadCountry === 'Not sure yet' ? [] : [leadCountry],
          },
          consent: leadConsent,
          consentTimestamp: new Date().toISOString(),
          consentPolicyVersion: PRIVACY_VERSION,
          landingPage: window.location.pathname,
          utm: getUtmParameters(),
          trackingConsent: analyticsAllowed(),
          metaEventId: eventId,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit profile. Please try again.');
      }

      persistTrackingLeadId(data?.leadId);
      trackAssessmentSubmit({ destination: leadCountry, label: 'disha_sticky_chat', eventId });

      // Mark the active lead form as submitted
      setMessages((prev) =>
        prev.map((m) =>
          m.isLeadForm
            ? {
                ...m,
                leadSubmitted: true,
                leadName: leadName.trim(),
                leadDestination: leadCountry,
              }
            : m,
        ),
      );

      // Add assistant confirmation message
      const confirmationMsg: ChatMessage = {
        id: `lead-success-${++messageIdCounter.current}`,
        role: 'assistant',
        content:
          language === 'bn'
            ? `🎉 ধন্যবাদ **${leadName.trim()}**! আপনার প্রোফাইলটি ধানমন্ডি টিমের কাছে পৌঁছেছে।\n\nআপনি চাইলে এখনই সরাসরি আমাদের হোয়াটসঅ্যাপে যুক্ত হয়ে ফাইলটি শেয়ার করতে পারেন:`
            : `🎉 Thank you **${leadName.trim()}**! Your profile has been sent to our Dhanmondi counseling team.\n\nIf you'd like an immediate review, you can also continue directly on WhatsApp:`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, confirmationMsg]);
    } catch (err) {
      setLeadError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || input;
    const trimmed = textToSend.trim();
    if (!trimmed || isStreaming) return;

    if (trimmed === 'whatsapp_counselor') {
      openWhatsAppDirect();
      return;
    }

    setInput('');
    const userMsg: ChatMessage = {
      id: `usr-${++messageIdCounter.current}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsStreaming(true);
    setStreamingStatus(
      language === 'bn' ? 'যাচাইকৃত ডাটাবেসে তথ্য অনুসন্ধান হচ্ছে…' : 'Querying verified records…',
    );
    setStreamingText('');
    setStreamingCitations([]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          language,
          history: newHistory
            .filter((m) => !m.isLeadForm)
            .slice(-4)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Unable to contact Disha advisor service.');
      }
      if (!response.body) {
        throw new Error('No stream body received.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';
      let accumulatedCitations: AdvisorCitation[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const tLine = line.trim();
          if (!tLine || !tLine.startsWith('data: ')) continue;

          try {
            const event: AdvisorStreamEvent = JSON.parse(tLine.slice(6));
            if (event.type === 'status') {
              setStreamingStatus(event.label);
            } else if (event.type === 'chunk') {
              accumulatedText += event.text;
              setStreamingText(accumulatedText);
            } else if (event.type === 'citations') {
              accumulatedCitations = event.citations;
              setStreamingCitations(event.citations);
            } else if (event.type === 'done') {
              setStreamingStatus(null);
            } else if (event.type === 'error') {
              accumulatedText += `\n\n*(Error: ${event.error})*`;
            }
          } catch {
            // ignore JSON parse on chunk boundaries
          }
        }
      }

      const finalAssistantMsg: ChatMessage = {
        id: `asst-${++messageIdCounter.current}`,
        role: 'assistant',
        content: accumulatedText.trim() || (language === 'bn' ? 'কোনো উত্তর পাওয়া যায়নি।' : 'No answer available.'),
        citations: accumulatedCitations,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, finalAssistantMsg]);
      setStreamingText('');
      setStreamingCitations([]);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;

      const errorMsg: ChatMessage = {
        id: `err-${++messageIdCounter.current}`,
        role: 'assistant',
        content:
          language === 'bn'
            ? 'সার্ভিস সংযোগে সাময়িক সমস্যা হয়েছে। সরাসরি আমাদের কাউন্সেলরের সাথে হোয়াটসঅ্যাপে কথা বলতে পারেন।'
            : 'A momentary connection error occurred. Feel free to talk directly with our senior counselor on WhatsApp.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsStreaming(false);
      setStreamingStatus(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isExcluded) return null;

  return (
    <>
      {/* 1. FLOATING LAUNCHER DOCK */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6">
        {/* Subtle Teaser Speech Bubble (Appears after 3.5s) */}
        {showTeaser && !isOpen && (
          <div
            role="status"
            className="relative flex max-w-[280px] items-start gap-2.5 rounded-2xl border border-petrol-700/15 bg-white p-3.5 shadow-[0_12px_32px_rgba(15,53,87,0.22)] animate-in fade-in slide-in-from-bottom-2 sm:max-w-[320px]"
          >
            <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-petrol-700 text-white">
              <Sparkles size={14} className="text-marigold" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-petrol-800">
                  {language === 'bn' ? 'দিশা — এআই অ্যাডভাইজর' : 'Disha · AI Advisor'}
                </span>
                <button
                  onClick={dismissTeaser}
                  className="rounded p-0.5 text-slate-400 hover:text-slate-600"
                  aria-label="Dismiss message"
                >
                  <X size={13} />
                </button>
              </div>
              <p className="mt-1 text-[13px] leading-snug text-ink-soft">
                {language === 'bn'
                  ? 'উচ্চশিক্ষা বা স্কলারশিপ বিষয়ে তথ্য চান? দিশাকে প্রশ্ন করুন বা ফ্রি মূল্যায়ন নিন।'
                  : 'Need study abroad facts or a free eligibility assessment? Chat with Disha!'}
              </p>
              <button
                onClick={handleOpenChat}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-petrol-700 px-3 py-1 text-[12px] font-bold text-white transition hover:bg-petrol-600"
              >
                {language === 'bn' ? 'কথা বলুন' : 'Chat with Disha'}
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Action Button Pair (WhatsApp shortcut + Disha Bot Launcher) */}
        <div className="flex items-center gap-2">
          {/* Quick Direct WhatsApp Button */}
          <button
            onClick={() => openWhatsAppDirect()}
            className="group relative flex size-12 items-center justify-center rounded-full border border-emerald-400/40 bg-white shadow-[0_8px_24px_rgba(16,185,129,0.25)] transition hover:scale-105 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:size-13"
            title="Chat directly on WhatsApp"
            aria-label="Chat directly on WhatsApp"
          >
            <MessageCircle size={22} className="text-emerald-600 transition group-hover:scale-110" />
            <span className="sr-only">WhatsApp Counselor</span>
          </button>

          {/* Primary Disha Floating Launcher */}
          <button
            onClick={isOpen ? handleCloseChat : handleOpenChat}
            className="group relative flex items-center gap-2.5 rounded-full border border-petrol-600 bg-petrol-700 px-4 py-3 text-white shadow-[0_12px_36px_rgba(15,53,87,0.35)] transition-all hover:-translate-y-0.5 hover:bg-petrol-800 hover:shadow-[0_16px_42px_rgba(15,53,87,0.45)] focus:outline-none focus:ring-4 focus:ring-petrol-600/30"
            aria-expanded={isOpen}
            aria-label="Open Disha Study Abroad AI Chatbot"
          >
            <div className="relative">
              <div className="grid size-9 place-items-center rounded-full bg-petrol-800 text-marigold ring-2 ring-white/30">
                <Sparkles size={18} />
              </div>
              {/* Pulsing online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-3 rounded-full border-2 border-petrol-700 bg-emerald-500" />
              </span>
            </div>

            <div className="hidden text-left sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold tracking-tight text-white">Ask Disha</span>
                <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Online
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-300">AI Study Advisor & Leads</p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. CHAT WINDOW FLYOUT */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="disha-chat-title"
          className="fixed bottom-24 right-4 z-50 flex h-[calc(100dvh-130px)] max-h-[660px] w-[calc(100vw-32px)] max-w-[420px] flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-[#fbfbf8] shadow-[0_24px_70px_rgba(11,43,69,0.38)] animate-in fade-in slide-in-from-bottom-4 sm:bottom-24 sm:right-6 sm:h-[620px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-petrol-800/20 bg-petrol-700 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="grid size-9 place-items-center rounded-full bg-petrol-800 text-marigold ring-2 ring-white/20">
                  <Sparkles size={18} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-petrol-700 bg-emerald-500" />
              </div>
              <div>
                <h3 id="disha-chat-title" className="text-[14px] font-bold leading-tight text-white">
                  Disha (দিশা)
                </h3>
                <p className="text-[11px] font-medium text-slate-300">
                  EduExpress AI Advisor · ধানমন্ডি, ঢাকা
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language Switcher */}
              <button
                onClick={() => setLanguage((prev) => (prev === 'en' ? 'bn' : 'en'))}
                className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-bold tracking-wider text-white transition hover:bg-white/20"
                title="Switch Language"
              >
                {language === 'en' ? 'বাংলা' : 'English'}
              </button>

              {/* Direct WhatsApp Action in Header */}
              <button
                onClick={() => openWhatsAppDirect()}
                className="grid size-7 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 transition hover:bg-emerald-500 hover:text-white"
                title="Connect on WhatsApp"
                aria-label="Connect on WhatsApp"
              >
                <MessageCircle size={15} />
              </button>

              {/* Minimize / Close */}
              <button
                onClick={handleCloseChat}
                className="grid size-7 place-items-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="flex items-center justify-between bg-petrol-900 px-3.5 py-1.5 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>Evidence-First Study Abroad Guidance</span>
            </span>
            <span className="font-semibold text-marigold">BDT 0 Service Fee Before Visa</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 space-y-3.5 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-petrol-700 text-marigold">
                    <Sparkles size={13} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-[14px] ${
                    msg.role === 'user'
                      ? 'bg-petrol-700 text-white shadow-sm'
                      : 'border border-rule bg-white text-ink shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
                  }`}
                >
                  {msg.role === 'assistant' ? renderMessageContent(msg.content) : <p>{msg.content}</p>}

                  {/* Citations if available */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-rule pt-2">
                      {msg.citations.slice(0, 3).map((cit, cIdx) => (
                        <a
                          key={`cit-${cIdx}`}
                          href={cit.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-petrol-50 px-2 py-0.5 text-[11px] font-semibold text-petrol-700 hover:bg-petrol-100"
                        >
                          <span className="truncate max-w-[140px]">{cit.title}</span>
                          <ExternalLink size={10} />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* IN-CHAT LEAD GENERATION MICRO-FORM */}
                  {msg.isLeadForm && (
                    <div id="disha-lead-form" className="mt-3 rounded-2xl border border-petrol-700/25 bg-slate-50/85 p-3.5 text-left shadow-xs">
                      {msg.leadSubmitted ? (
                        <div className="space-y-2 text-center">
                          <div className="mx-auto grid size-10 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                            <CheckCircle2 size={24} />
                          </div>
                          <h4 className="text-[14px] font-bold text-petrol-900">
                            {language === 'bn' ? 'প্রোফাইল জমা হয়েছে!' : 'Assessment Request Submitted!'}
                          </h4>
                          <p className="text-[12px] text-ink-soft">
                            {language === 'bn'
                              ? 'আমাদের সিনিয়র কাউন্সেলর আপনার তথ্য যাচাই করে ১ কার্যদিবসে যোগাযোগ করবেন।'
                              : 'A senior counselor will evaluate your profile and contact you within 1 working day.'}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              openWhatsAppDirect(
                                `Hi, my name is ${msg.leadName}. I submitted an assessment for ${msg.leadDestination} on eduexpressint.com through Disha.`,
                              )
                            }
                            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-[13px] font-bold text-white shadow-sm transition hover:bg-emerald-700"
                          >
                            <MessageCircle size={15} />
                            {language === 'bn' ? 'হোয়াটসঅ্যাপে ফাইলটি শেয়ার করুন' : 'Connect on WhatsApp Now'}
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                          <div className="flex items-center gap-1.5 font-bold text-[13px] text-petrol-900">
                            <Sparkles size={14} className="text-marigold" />
                            <span>
                              {language === 'bn'
                                ? 'ফ্রি স্কলারশিপ ও খরচ তালিকা নিন'
                                : 'Get Free Scholarship & Cost Shortlist'}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-ink-soft">
                            {language === 'bn'
                              ? 'আপনার তথ্য দিন — আমাদের কাউন্সেলর যাচাই করে লিখিত খরচ শিডিউল পাঠাবেন:'
                              : 'Enter your details to receive matched options and an itemized cost schedule:'}
                          </p>

                          {leadError && (
                            <div className="rounded-lg bg-red-50 p-2 text-[12px] font-medium text-red-700">
                              {leadError}
                            </div>
                          )}

                          <div>
                            <label className="block text-[11px] font-bold text-petrol-800">
                              {language === 'bn' ? 'আপনার নাম *' : 'Full Name *'}
                            </label>
                            <input
                              type="text"
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              placeholder="e.g. Tanvir Ahmed"
                              required
                              className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] text-ink placeholder:text-slate-400 focus:border-petrol-600 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-petrol-800">
                                {language === 'bn' ? 'ফোন / হোয়াটসঅ্যাপ *' : 'Phone / WhatsApp *'}
                              </label>
                              <input
                                type="tel"
                                value={leadPhone}
                                onChange={(e) => setLeadPhone(e.target.value)}
                                placeholder="+880 1..."
                                required
                                className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] text-ink placeholder:text-slate-400 focus:border-petrol-600 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-petrol-800">
                                {language === 'bn' ? 'ইমেইল এড্রেস *' : 'Email Address *'}
                              </label>
                              <input
                                type="email"
                                value={leadEmail}
                                onChange={(e) => setLeadEmail(e.target.value)}
                                placeholder="name@email.com"
                                required
                                className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] text-ink placeholder:text-slate-400 focus:border-petrol-600 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-bold text-petrol-800">
                                {language === 'bn' ? 'পছন্দের দেশ' : 'Destination'}
                              </label>
                              <select
                                value={leadCountry}
                                onChange={(e) => setLeadCountry(e.target.value)}
                                className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[12px] text-ink focus:border-petrol-600 focus:outline-none"
                              >
                                {DESTINATIONS.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-petrol-800">
                                {language === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Study Level'}
                              </label>
                              <select
                                value={leadLevel}
                                onChange={(e) => setLeadLevel(e.target.value)}
                                className="mt-0.5 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[12px] text-ink focus:border-petrol-600 focus:outline-none"
                              >
                                {STUDY_LEVELS.map((lvl) => (
                                  <option key={lvl} value={lvl}>
                                    {lvl}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <label className="flex items-start gap-2 pt-1 text-[11px] text-ink-soft">
                            <input
                              type="checkbox"
                              checked={leadConsent}
                              onChange={(e) => setLeadConsent(e.target.checked)}
                              className="mt-0.5 size-3.5 rounded border-slate-300 text-petrol-700 focus:ring-petrol-600"
                            />
                            <span>
                              {language === 'bn'
                                ? 'আমি এডুএক্সপ্রেসের প্রাইভেসি পলিসি অনুযায়ী যোগাযোগের সম্মতি দিচ্ছি।'
                                : 'I agree to be contacted by an EduExpress counselor.'}
                            </span>
                          </label>

                          <button
                            type="submit"
                            disabled={leadSubmitting}
                            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-petrol-700 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-petrol-800 disabled:opacity-70"
                          >
                            {leadSubmitting ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>{language === 'bn' ? 'জমা হচ্ছে…' : 'Submitting profile…'}</span>
                              </>
                            ) : (
                              <>
                                <span>
                                  {language === 'bn'
                                    ? '👉 ফ্রি তালিকা ও খরচ শিডিউল নিন'
                                    : '👉 Get My Free Shortlist & Costs'}
                                </span>
                                <ArrowRight size={13} />
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Live Streaming Response Bubble */}
            {isStreaming && (
              <div className="flex gap-2.5">
                <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-petrol-700 text-marigold">
                  <Sparkles size={13} />
                </div>
                <div className="max-w-[85%] rounded-2xl border border-rule bg-white p-3.5 text-[14px] text-ink shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                  {streamingStatus && (
                    <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-petrol-600">
                      <Loader2 size={12} className="animate-spin" />
                      <span>{streamingStatus}</span>
                    </div>
                  )}
                  {streamingText ? (
                    renderMessageContent(streamingText)
                  ) : (
                    <div className="flex items-center gap-1.5 py-1 text-slate-400">
                      <span className="size-2 animate-bounce rounded-full bg-slate-300" />
                      <span className="size-2 animate-bounce rounded-full bg-slate-300 [animation-delay:0.2s]" />
                      <span className="size-2 animate-bounce rounded-full bg-slate-300 [animation-delay:0.4s]" />
                    </div>
                  )}

                  {streamingCitations.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-rule pt-2">
                      {streamingCitations.map((cit, cIdx) => (
                        <span
                          key={`cit-stream-${cIdx}`}
                          className="inline-flex items-center gap-1 rounded bg-petrol-50 px-1.5 py-0.5 text-[10px] font-semibold text-petrol-700"
                        >
                          {cit.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Chips */}
          <div className="border-t border-slate-200/80 bg-white/95 px-3 py-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[12px] scrollbar-none">
              {PRESETS[language].map((preset, pIdx) => (
                <button
                  key={`preset-${pIdx}`}
                  type="button"
                  onClick={() => {
                    if (preset.isLeadTrigger) {
                      triggerLeadForm();
                    } else if (preset.query === 'whatsapp_counselor') {
                      openWhatsAppDirect();
                    } else {
                      handleSendMessage(preset.query);
                    }
                  }}
                  disabled={isStreaming}
                  className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-petrol-800 transition hover:border-petrol-600 hover:bg-petrol-50 active:scale-95 disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="border-t border-slate-200 bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  language === 'bn' ? 'দিশাকে প্রশ্ন করুন (যেমন: স্কলারশিপ খরচ)...' : 'Ask Disha a question...'
                }
                disabled={isStreaming}
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50/70 px-3 py-2 text-[13.5px] text-ink placeholder:text-slate-400 focus:border-petrol-600 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="grid size-9 place-items-center rounded-xl bg-petrol-700 text-white transition hover:bg-petrol-800 disabled:opacity-40"
                aria-label="Send query"
              >
                {isStreaming ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
