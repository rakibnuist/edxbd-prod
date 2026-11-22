'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
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
  options?: Array<{ label: string; value: string }>;
  isCompleteCard?: boolean;
  leadName?: string;
  leadDestination?: string;
}

type ConversationStage = 'country' | 'level' | 'name' | 'phone' | 'done' | 'freeform';

const COUNTRY_OPTIONS = [
  { label: '🇨🇳 China', value: 'China' },
  { label: '🇲🇾 Malaysia', value: 'Malaysia' },
  { label: '🇬🇧 United Kingdom', value: 'United Kingdom' },
  { label: '🇰🇷 South Korea', value: 'South Korea' },
  { label: '🩺 MBBS Abroad', value: 'MBBS' },
  { label: '🌍 Not sure yet', value: 'Not sure yet' },
];

const LEVEL_OPTIONS = [
  { label: "🎓 Bachelor's Degree", value: "Bachelor's Degree" },
  { label: '📜 HSC / A-Level Complete', value: 'HSC / A-Level' },
  { label: "🏛️ Master's Degree", value: "Master's Degree" },
  { label: '🩺 MBBS Candidate', value: 'MBBS' },
  { label: '🌐 Language / Foundation', value: 'Language / Foundation' },
];

const TEASER_DISMISSED_KEY = 'edx_disha_teaser_dismissed_v1';
const CHAT_PHONE = '+8801983333566';
const PRIVACY_VERSION = '2026-07-19';

function getInitialMessage(lang: FitResponseLanguage): ChatMessage {
  return {
    id: 'disha-intro',
    role: 'assistant',
    content:
      lang === 'bn'
        ? '👋 **হ্যালো! আমি দিশা**, এডুএক্সপ্রেসের এআই স্টাডি কাউন্সেলর।\n\nউপযুক্ত বিশ্ববিদ্যালয়, স্কলারশিপ ও খরচের সঠিক হিসাব পেতে আপনি কোন দেশে উচ্চশিক্ষার জন্য যেতে চান?'
        : "👋 **Hi! I'm Disha**, your study advisor at EduExpress.\n\nI can help you check university eligibility, scholarships, and real total costs. **Which country are you interested in?**",
    options: COUNTRY_OPTIONS,
  };
}

function renderFormattedMessage(text: string) {
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
  const [messages, setMessages] = useState<ChatMessage[]>(() => [getInitialMessage('en')]);

  // Conversational Lead State
  const [stage, setStage] = useState<ConversationStage>('country');
  const [studentCountry, setStudentCountry] = useState('China');
  const [studentLevel, setStudentLevel] = useState("Bachelor's Degree");
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [isSavingLead, setIsSavingLead] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageIdCounter = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isExcluded =
    !pathname ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/login');

  const isCampaignLanding =
    pathname === '/china-march-2027-intake' ||
    pathname === '/study-in-china-from-bangladesh';

  const suppressAutoTeaser =
    isCampaignLanding ||
    pathname === '/education-fit-assessment' ||
    pathname === '/apply' ||
    pathname === '/contact' ||
    pathname === '/partnership' ||
    pathname === '/b2b' ||
    pathname === '/updates' ||
    pathname === '/universities';

  // Teaser bubble timer (skip on conversion forms/directories/updates so the floating bubble never obscures controls)
  useEffect(() => {
    if (isExcluded || suppressAutoTeaser) return;

    const timer = setTimeout(() => {
      try {
        const dismissed = window.sessionStorage.getItem(TEASER_DISMISSED_KEY);
        if (!dismissed && !isOpen) {
          setShowTeaser(true);
        }
      } catch {
        // ignore
      }
    }, 5500);

    return () => clearTimeout(timer);
  }, [isExcluded, suppressAutoTeaser, isOpen]);

  // Auto-scroll on new messages
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
    setTimeout(() => inputRef.current?.focus(), 250);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      document.body.removeAttribute('data-disha-open');
      return;
    }
    document.body.setAttribute('data-disha-open', 'true');
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.removeAttribute('data-disha-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const openWhatsAppDirect = (customText?: string) => {
    const defaultMsg =
      language === 'bn'
        ? 'আসসালামু আলাইকুম। আমি এডুএক্সপ্রেসের স্টাডি কাউন্সেলর দিশার মাধ্যমে যোগাযোগ করছি। উচ্চশিক্ষা সংক্রান্ত বিষয়ে কথা বলতে চাই।'
        : 'Hi! I am reaching out from eduexpressint.com through Disha. I would like counseling for studying abroad.';
    const text = customText || defaultMsg;
    trackWhatsAppClick({ label: 'disha_sticky_chat' });
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const finalPhone = cleanPhone.startsWith('880') ? cleanPhone : `880${cleanPhone}`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Submit collected lead seamlessly to CRM
  const persistLeadToCrm = async (name: string, phone: string, country: string, level: string) => {
    setIsSavingLead(true);
    const eventId = createConversionEventId('lead');
    const cleanDigits = phone.replace(/[^\d]/g, '');
    const fallbackEmail = `${cleanDigits || 'student'}@lead.eduexpressint.com`;

    try {
      const metaParams = await getConsentedSubmissionMetaParams();
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...metaParams,
          name: name.trim(),
          email: fallbackEmail,
          phone: phone.trim(),
          country: country === 'Not sure yet' ? 'Not specified' : country,
          program: level,
          message: `Disha Conversational Chat Lead. Country: ${country}. Level: ${level}.`,
          source: 'disha_sticky_chat',
          leadType: 'assessment',
          destinationInterest: country === 'Not sure yet' ? [] : [country],
          assessment: {
            academicLevel: level,
            preferredCountries: country === 'Not sure yet' ? [] : [country],
          },
          consent: true,
          consentTimestamp: new Date().toISOString(),
          consentPolicyVersion: PRIVACY_VERSION,
          landingPage: window.location.pathname,
          utm: getUtmParameters(),
          trackingConsent: analyticsAllowed(),
          metaEventId: eventId,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        persistTrackingLeadId(data?.leadId);
        trackAssessmentSubmit({ destination: country, label: 'disha_conversational_chat', eventId });
      }
    } catch {
      // Background CRM write error — don't block user
    } finally {
      setIsSavingLead(false);
    }
  };

  // 1. Handle Option Pills Selection in Chat
  const handleSelectOption = (value: string, label: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${++messageIdCounter.current}`,
      role: 'user',
      content: label,
    };

    if (stage === 'country') {
      setStudentCountry(value);
      setStage('level');

      const replyContent =
        language === 'bn'
          ? `চমৎকার পছন্দ! ${value === 'China' ? 'চায়না আমাদের ফ্ল্যাগশিপ রুট — ভিসার আগে কোনো সার্ভিস চার্জ নেই। 🎓' : 'বিদেশে উচ্চশিক্ষার জন্য এটি চমৎকার গন্তব্য। 🎓'}\n\nআপনার **বর্তমান বা লক্ষ্য শিক্ষাগত যোগ্যতা** কী?`
          : `Great choice! ${value === 'China' ? 'China is our flagship route with up to 100% scholarships & BDT 0 service fee before visa! 🎓' : 'A very popular destination for international students! 🎓'}\n\n**What is your current or target study level?**`;

      const botReply: ChatMessage = {
        id: `asst-${++messageIdCounter.current}`,
        role: 'assistant',
        content: replyContent,
        options: LEVEL_OPTIONS,
      };

      setMessages((prev) => [...prev, userMsg, botReply]);
    } else if (stage === 'level') {
      setStudentLevel(value);
      setStage('name');

      const replyContent =
        language === 'bn'
          ? 'দারুণ! আপনার প্রোফাইল যাচাই করার জন্য **আপনার পুরো নামটা কী?**'
          : 'Got it! To evaluate your profile, **may I know your full name?**';

      const botReply: ChatMessage = {
        id: `asst-${++messageIdCounter.current}`,
        role: 'assistant',
        content: replyContent,
      };

      setMessages((prev) => [...prev, userMsg, botReply]);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  };

  // 2. Handle Text Input (Conversational or AI Inquiry)
  const handleSendText = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    setInput('');

    const userMsg: ChatMessage = {
      id: `usr-${++messageIdCounter.current}`,
      role: 'user',
      content: trimmed,
    };

    // If currently asking for Name in the conversational flow:
    if (stage === 'name') {
      if (trimmed.length < 50 && !trimmed.includes('?') && !/how|what|cost|fee|visa|ielts/i.test(trimmed)) {
        setStudentName(trimmed);
        setStage('phone');

        const botReply: ChatMessage = {
          id: `asst-${++messageIdCounter.current}`,
          role: 'assistant',
          content:
            language === 'bn'
              ? `ধন্যবাদ **${trimmed}**! 👋\n\n**আপনার হোয়াটসঅ্যাপ/ফোন নম্বরটি লিখুন:**\nআমাদের ধানমন্ডি অফিস থেকে সিনিয়র কাউন্সেলর আপনার ফাইল দেখে উপযুক্ত স্কলারশিপ তালিকা ও লিখিত খরচের শিডিউল পাঠাবেন।`
              : `Nice to meet you, **${trimmed}**! 👋\n\n**What's your WhatsApp number?**\nOur senior counselor from Dhanmondi will review your background and send a tailored scholarship shortlist & written cost schedule.`,
        };

        setMessages((prev) => [...prev, userMsg, botReply]);
        setTimeout(() => inputRef.current?.focus(), 200);
        return;
      }
    }

    // If currently asking for Phone in the conversational flow:
    if (stage === 'phone') {
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length >= 8) {
        setStudentPhone(trimmed);
        setStage('done');

        // Persist lead in background
        persistLeadToCrm(studentName || 'Student', trimmed, studentCountry, studentLevel);

        const botReply: ChatMessage = {
          id: `asst-${++messageIdCounter.current}`,
          role: 'assistant',
          content:
            language === 'bn'
              ? `সব তথ্য পাওয়া গেছে, **${studentName || 'প্রিয় শিক্ষার্থী'}**! 🎉\n\nআপনার ফাইলটি আমাদের ধানমন্ডি সেন্টারের সিনিয়র কাউন্সেলরের টেবিলে পাঠানো হয়েছে। ১ কার্যদিবসের মধ্যে আপনার সাথে যোগাযোগ করা হবে।\n\nএখনই সরাসরি কথা বলতে চান?`
              : `All set, **${studentName || 'there'}**! 🎉\n\nYour profile has been forwarded to our Dhanmondi counseling team. A senior counselor will review your file and contact you within 1 working day.\n\nWant immediate answers? Feel free to connect directly on WhatsApp:`,
          isCompleteCard: true,
          leadName: studentName || 'Student',
          leadDestination: studentCountry,
        };

        setMessages((prev) => [...prev, userMsg, botReply]);
        return;
      }
    }

    // Otherwise, treat as freeform question and stream from /api/ai/advisor!
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsStreaming(true);
    setStreamingStatus(
      language === 'bn' ? 'যাচাইকৃত ডাটাবেসে তথ্য দেখা হচ্ছে…' : 'Searching verified records…',
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
            .filter((m) => !m.isCompleteCard)
            .slice(-4)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error('Connection interrupted');
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
            }
          } catch {
            // ignore partial JSON
          }
        }
      }

      // Add gentle conversational nudge if lead isn't captured yet
      let finalText = accumulatedText.trim() || (language === 'bn' ? 'তথ্য পাওয়া যায়নি।' : 'No answer available.');
      if (stage !== 'done') {
        const nudge =
          language === 'bn'
            ? '\n\n*(আপনার রেজাল্ট অনুযায়ী উপযুক্ত স্কলারশিপ তালিকা ও খরচের হিসাব পেতে চাইলে আপনার হোয়াটসঅ্যাপ নম্বরটি এখানে লিখতে পারেন!)*'
            : '\n\n*(Would you like a personalized written cost schedule for your profile? Enter your WhatsApp number below!)*';
        finalText += nudge;
      }

      const finalAssistantMsg: ChatMessage = {
        id: `asst-${++messageIdCounter.current}`,
        role: 'assistant',
        content: finalText,
        citations: accumulatedCitations,
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
      handleSendText();
    }
  };

  const getInputPlaceholder = () => {
    if (stage === 'name') {
      return language === 'bn' ? 'আপনার পুরো নাম লিখুন...' : 'Type your full name...';
    }
    if (stage === 'phone') {
      return language === 'bn' ? 'হোয়াটসঅ্যাপ নম্বর (যেমন: 017...)' : 'WhatsApp number (e.g. 017...)';
    }
    return language === 'bn' ? 'দিশাকে প্রশ্ন করুন (যেমন: স্কলারশিপ, খরচ)...' : 'Ask Disha a question or reply...';
  };

  if (isExcluded || isCampaignLanding) return null;

  return (
    <>
      {/* 1. MINIMALIST STICKY LAUNCHER DOCK */}
      <div className="sticky-disha-dock fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2.5 transition-[bottom,opacity,transform] duration-300 lg:bottom-6 lg:right-6">
        {/* Subtle Teaser Speech Bubble (hidden on compact phones and form/directory routes so hero & form CTAs stay unobstructed) */}
        {showTeaser && !suppressAutoTeaser && !isOpen && (
          <div
            role="status"
            className="ed-pop-in relative hidden max-w-[270px] items-start gap-2.5 rounded-2xl border border-petrol-700/10 bg-white p-3 shadow-[0_10px_28px_rgba(15,53,87,0.18)] sm:flex sm:max-w-[300px]"
          >
            <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-petrol-800 text-lime">
              <Sparkles size={13} />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-petrol-800">
                  {language === 'bn' ? 'দিশা — স্টাডি কাউন্সেলর' : 'Disha · Study Advisor'}
                </span>
                <button
                  onClick={dismissTeaser}
                  className="rounded p-0.5 text-slate-400 hover:text-slate-600"
                  aria-label="Dismiss message"
                >
                  <X size={12} />
                </button>
              </div>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-soft">
                {language === 'bn'
                  ? 'উচ্চশিক্ষা ও স্কলারশিপের তথ্য জানতে চান? দিশার সাথে চ্যাট করুন।'
                  : 'Planning to study abroad? Chat with Disha for instant advice!'}
              </p>
              <button
                onClick={handleOpenChat}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-petrol-800 px-3 py-1 text-[11.5px] font-bold text-white transition hover:bg-petrol-900"
              >
                {language === 'bn' ? 'চ্যাট করুন' : 'Chat with Disha'}
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        )}

        {/* Action Pair: Direct WhatsApp + Disha Launcher */}
        <div className="flex items-center gap-2">
          {/* Quick Direct WhatsApp Button */}
          <button
            data-disha-wa="1"
            onClick={() => openWhatsAppDirect()}
            className="group relative flex size-11 items-center justify-center rounded-full border border-emerald-400/35 bg-white shadow-[0_6px_20px_rgba(16,185,129,0.2)] transition hover:scale-105 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:size-12"
            title="Chat directly on WhatsApp"
            aria-label="Chat directly on WhatsApp"
          >
            <MessageCircle size={20} className="text-emerald-600 transition group-hover:scale-110" />
            <span className="sr-only">WhatsApp Counselor</span>
          </button>

          {/* Disha Floating Launcher Button */}
          <button
            onClick={isOpen ? handleCloseChat : handleOpenChat}
            className="group relative flex items-center gap-2 rounded-full border border-petrol-600/90 bg-petrol-800 px-3 py-2 text-white shadow-[0_10px_30px_rgba(15,53,87,0.3)] transition-all hover:-translate-y-0.5 hover:bg-petrol-900 hover:shadow-[0_14px_36px_rgba(15,53,87,0.4)] focus:outline-none focus:ring-4 focus:ring-lime/50 sm:gap-2.5 sm:px-3.5 sm:py-2.5"
            aria-expanded={isOpen}
            aria-label="Open Disha Study Advisor Chatbot"
          >
            <div className="relative">
              <div className="grid size-7 place-items-center rounded-full bg-petrol-700 text-lime ring-2 ring-white/25 sm:size-8">
                <Sparkles size={15} />
              </div>
              {/* Pulsing online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full border-2 border-petrol-800 bg-emerald-500" />
              </span>
            </div>

            <div className="hidden text-left sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold tracking-tight text-white">Ask Disha</span>
                <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-300">
                  Online
                </span>
              </div>
              <p className="text-[10.5px] font-medium text-slate-300">Study Advisor</p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. LIGHT, FRIENDLY CHAT WINDOW */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="disha-chat-title"
          className="ed-pop-in fixed bottom-4 left-4 right-4 z-[70] flex h-[calc(100dvh-96px)] max-h-[600px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-[#fbfbf8] shadow-[0_20px_60px_rgba(11,43,69,0.32)] sm:bottom-[88px] sm:left-auto sm:right-6 sm:h-[580px] sm:w-[400px]"
        >
          {/* Light Header */}
          <div className="flex items-center justify-between border-b border-petrol-900/15 bg-petrol-800 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="grid size-8 place-items-center rounded-full bg-petrol-700 text-lime ring-2 ring-white/25">
                  <Sparkles size={16} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-petrol-800 bg-emerald-500" />
              </div>
              <div>
                <h3 id="disha-chat-title" className="text-[13.5px] font-bold leading-tight text-white">
                  Disha (দিশা)
                </h3>
                <p className="text-[10.5px] font-medium text-slate-300">
                  EduExpress Advisor · ধানমন্ডি, ঢাকা
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language Switcher */}
              <button
                onClick={() => {
                  const nextLang = language === 'en' ? 'bn' : 'en';
                  setLanguage(nextLang);
                  setStage('country');
                  setMessages([getInitialMessage(nextLang)]);
                }}
                className="rounded-lg border border-white/20 bg-white/10 px-2 py-0.5 text-[10.5px] font-bold tracking-wider text-white transition hover:bg-white/20"
                title="Switch Language"
              >
                {language === 'en' ? 'বাংলা' : 'English'}
              </button>

              {/* WhatsApp direct in header */}
              <button
                onClick={() => openWhatsAppDirect()}
                className="grid size-7 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 transition hover:bg-emerald-500 hover:text-white"
                title="WhatsApp Counselor"
                aria-label="WhatsApp Counselor"
              >
                <MessageCircle size={14} />
              </button>

              {/* Close */}
              <button
                onClick={handleCloseChat}
                className="grid size-7 place-items-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close Chat"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Micro Notice Strip (Clean hairlines) */}
          <div className="flex items-center justify-between bg-petrol-900 px-3.5 py-1.5 text-[10.5px] text-slate-300">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={11} className="text-emerald-400" />
              <span>Evidence-First Guidance</span>
            </span>
            <span className="font-semibold text-lime">BDT 0 Fee Before Visa</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-petrol-800 text-lime">
                    <Sparkles size={12} />
                  </div>
                )}

                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`rounded-2xl p-3 text-[13.5px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-petrol-800 text-white shadow-sm'
                        : 'border border-slate-200/80 bg-white text-ink shadow-[0_1px_4px_rgba(0,0,0,0.03)]'
                    }`}
                  >
                    {msg.role === 'assistant' ? renderFormattedMessage(msg.content) : <p>{msg.content}</p>}

                    {/* Citations if available */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1 border-t border-rule pt-2">
                        {msg.citations.slice(0, 3).map((cit, cIdx) => (
                          <a
                            key={`cit-${cIdx}`}
                            href={cit.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded bg-canvas-soft px-2 py-0.5 text-[10.5px] font-semibold text-petrol-800 hover:bg-lime-pale"
                          >
                            <span className="truncate max-w-[130px]">{cit.title}</span>
                            <ExternalLink size={9} />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Completion Card with 1-Click WhatsApp Handover */}
                    {msg.isCompleteCard && (
                      <div className="mt-2.5 rounded-xl border border-emerald-300/40 bg-emerald-50/60 p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            openWhatsAppDirect(
                              `Hi, my name is ${msg.leadName}. I was chatting with Disha on eduexpressint.com about studying in ${msg.leadDestination}. Can we discuss my options?`,
                            )
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-[12.5px] font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                        >
                          <MessageCircle size={15} />
                          <span>{language === 'bn' ? 'সরাসরি হোয়াটসঅ্যাপে কথা বলুন' : 'Chat on WhatsApp Now'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* One-Tap Choice Chips Right Inside the Flow */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.options.map((opt, oIdx) => (
                        <button
                          key={`opt-${oIdx}`}
                          type="button"
                          onClick={() => handleSelectOption(opt.value, opt.label)}
                          className="rounded-full border border-petrol-700/20 bg-white px-3 py-1.5 text-[12px] font-medium text-petrol-800 shadow-sm transition hover:border-petrol-700 hover:bg-canvas-soft active:scale-95"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Live Streaming Response Bubble */}
            {isStreaming && (
              <div className="flex gap-2.5">
                <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-petrol-800 text-lime">
                  <Sparkles size={12} />
                </div>
                <div className="max-w-[85%] rounded-2xl border border-slate-200/80 bg-white p-3 text-[13.5px] text-ink shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                  {streamingStatus && (
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11.5px] font-medium text-petrol-600">
                      <Loader2 size={11} className="animate-spin" />
                      <span>{streamingStatus}</span>
                    </div>
                  )}
                  {streamingText ? (
                    renderFormattedMessage(streamingText)
                  ) : (
                    <div className="flex items-center gap-1.5 py-1 text-slate-400">
                      <span className="size-1.5 animate-bounce rounded-full bg-slate-300" />
                      <span className="size-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:0.2s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Bar (Active Step Indicator) */}
          {stage !== 'done' && (
            <div className="flex items-center justify-between border-t border-slate-200/60 bg-white px-3.5 py-1.5 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>
                  {stage === 'country' && (language === 'bn' ? 'ধাপ ১: দেশ নির্বাচন করুন' : 'Step 1: Select destination')}
                  {stage === 'level' && (language === 'bn' ? 'ধাপ ২: শিক্ষাগত যোগ্যতা' : 'Step 2: Study level')}
                  {stage === 'name' && (language === 'bn' ? 'ধাপ ৩: আপনার নাম লিখুন' : 'Step 3: Enter your name')}
                  {stage === 'phone' && (language === 'bn' ? 'ধাপ ৪: হোয়াটসঅ্যাপ নম্বর' : 'Step 4: WhatsApp number')}
                  {stage === 'freeform' && (language === 'bn' ? 'প্রশ্ন করুন' : 'Ask anything')}
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setStage('country');
                  setMessages([getInitialMessage(language)]);
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-petrol-700"
              >
                <RefreshCw size={10} />
                <span>{language === 'bn' ? 'রিসেট' : 'Restart'}</span>
              </button>
            </div>
          )}

          {/* Light Input Bar */}
          <div className="border-t border-slate-200/80 bg-white p-2.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendText();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={getInputPlaceholder()}
                disabled={isStreaming}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-base text-ink placeholder:text-slate-400 focus:border-petrol-600 focus:bg-white focus:outline-none sm:text-[13.5px]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="grid size-9 place-items-center rounded-xl bg-petrol-800 text-white shadow-sm transition hover:bg-petrol-900 disabled:opacity-40"
                aria-label="Send message"
              >
                {isStreaming ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
