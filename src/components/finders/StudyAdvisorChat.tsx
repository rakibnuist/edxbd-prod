'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  Square,
  User,
} from 'lucide-react';
import type { AdvisorCitation, AdvisorStreamEvent } from '@/lib/advisor-tools';
import type { FitResponseLanguage } from '@/lib/fit-matcher';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: AdvisorCitation[];
  mode?: 'gemini' | 'catalog';
  model?: string;
}

const PRESET_QUESTIONS: Record<FitResponseLanguage, Array<{ label: string; query: string }>> = {
  en: [
    {
      label: 'MBBS recognition & rules',
      query: 'What are the BMDC and WDOMS recognition requirements for MBBS in China?',
    },
    {
      label: 'China ClearCost breakdown',
      query: 'How much does tuition, hostel, and living cost for bachelor programs in China?',
    },
    {
      label: 'Computer Science in Malaysia',
      query: 'What are the tuition fees and scholarship options for Computer Science in Malaysia?',
    },
    {
      label: 'EduExpress fee transparency',
      query: 'What is EduExpress’s visa-first policy and what fees are due before China visa approval?',
    },
  ],
  bn: [
    {
      label: 'চীনে MBBS ও BMDC স্বীকৃতি',
      query: 'চীনে MBBS পড়ার জন্য BMDC ও WDOMS স্বীকৃতির নিয়ম এবং টিউশন ফি কেমন?',
    },
    {
      label: 'চীনে পড়াশোনার প্রকৃত খরচ',
      query: 'চীনে ব্যাচেলর প্রোগ্রামে টিউশন, হোস্টেল ও থাকা-খাওয়ার বিস্তারিত খরচ কত?',
    },
    {
      label: 'মালয়েশিয়ায় কম্পিউটার সায়েন্স',
      query: 'মালয়েশিয়ায় কম্পিউটার সায়েন্স পড়ার টিউশন ফি এবং স্কলারশিপের সুযোগ কী কী?',
    },
    {
      label: 'ভিসা-ফার্স্ট সার্ভিস চার্জ পলিসি',
      query: 'চায়না ভিসার ক্ষেত্রে EduExpress-এর ভিসা-ফার্স্ট পলিসি এবং ফি আলাদা করার নিয়ম কী?',
    },
  ],
};

function formatCitationLabel(category: AdvisorCitation['category']): string {
  switch (category) {
    case 'university':
      return 'University Profile';
    case 'cost_plan':
      return 'ClearCost Breakdown';
    case 'destination':
      return 'Destination Guide';
    case 'guide':
      return 'Verified Guide';
    default:
      return 'Reference';
  }
}

function renderFormattedMessage(text: string) {
  const lines = text.split('\n');
  return (
    <div className="space-y-2 text-[15px] leading-relaxed text-ink-soft">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={`empty-${idx}`} className="h-1.5" />;
        }

        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ');
        const isSubBullet = trimmed.startsWith('  • ') || trimmed.startsWith('    • ');
        const content = trimmed.replace(/^[-•]\s+/, '').replace(/^•\s+/, '');

        // Simple bold parser
        const parts = content.split(/(\*\*[^*]+\*\*)/g);
        const formatted = parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={partIdx} className="font-semibold text-petrol-800">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet || isSubBullet) {
          return (
            <div
              key={`line-${idx}`}
              className={`flex items-start gap-2.5 ${isSubBullet ? 'pl-6 text-[14px]' : 'pl-1'}`}
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime-deep" aria-hidden="true" />
              <div className="flex-1">{formatted}</div>
            </div>
          );
        }

        return (
          <p key={`line-${idx}`} className="text-ink-soft">
            {formatted}
          </p>
        );
      })}
    </div>
  );
}

export default function StudyAdvisorChat() {
  const [language, setLanguage] = useState<FitResponseLanguage>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [streamingCitations, setStreamingCitations] = useState<AdvisorCitation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messageIdCounter = useRef(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, streamingStatus]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setStreamingStatus(null);
  };

  const handleReset = () => {
    handleStop();
    setMessages([]);
    setStreamingText('');
    setStreamingCitations([]);
    setError(null);
  };

  const handleSubmitQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    setInput('');

    const userMessage: ChatMessage = {
      id: `usr-${++messageIdCounter.current}`,
      role: 'user',
      content: trimmed,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsStreaming(true);
    setStreamingStatus(
      language === 'bn' ? 'যাচাইকৃত ডাটাবেসে তথ্য অনুসন্ধান হচ্ছে…' : 'Querying verified database records…',
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
          history: newHistory.slice(-5).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errMessage = 'Unable to reach the advisor service.';
        try {
          const errData = await response.json();
          if (errData?.error) errMessage = errData.error;
        } catch {
          // ignore
        }
        throw new Error(errMessage);
      }

      if (!response.body) {
        throw new Error('No streaming response body received.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';
      let accumulatedCitations: AdvisorCitation[] = [];
      let completionMode: 'gemini' | 'catalog' = 'gemini';
      let completionModel: string | undefined;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

          try {
            const event: AdvisorStreamEvent = JSON.parse(trimmedLine.slice(6));
            if (event.type === 'status') {
              setStreamingStatus(event.label);
            } else if (event.type === 'chunk') {
              accumulatedText += event.text;
              setStreamingText(accumulatedText);
            } else if (event.type === 'citations') {
              accumulatedCitations = event.citations;
              setStreamingCitations(event.citations);
            } else if (event.type === 'done') {
              completionMode = event.mode;
              completionModel = event.model;
              setStreamingStatus(null);
            } else if (event.type === 'error') {
              setError(event.error);
            }
          } catch {
            // ignore JSON parse errors on partial chunks
          }
        }
      }

      const finalAssistantMessage: ChatMessage = {
        id: `asst-${++messageIdCounter.current}`,
        role: 'assistant',
        content: accumulatedText.trim() || (language === 'bn' ? 'কোনো উত্তর পাওয়া যায়নি।' : 'No answer available.'),
        citations: accumulatedCitations,
        mode: completionMode,
        model: completionModel,
      };

      setMessages(prev => [...prev, finalAssistantMessage]);
      setStreamingText('');
      setStreamingCitations([]);
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        // User voluntarily cancelled
      } else {
        const msg = err instanceof Error ? err.message : 'Advisor failed to stream response.';
        setError(msg);
      }
    } finally {
      setIsStreaming(false);
      setStreamingStatus(null);
      abortControllerRef.current = null;
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmitQuestion(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitQuestion(input);
    }
  };

  const presets = PRESET_QUESTIONS[language];

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50">
      {/* Advisor Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 bg-stone-50/80 px-6 py-4 backdrop-blur-sm sm:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-petrol-800 text-lime shadow-sm">
            <Sparkles size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-bold text-petrol-800">
                {language === 'bn' ? 'স্টাডি ও কস্ট অ্যাডভাইজর' : 'Study & Cost Advisor'}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-petrol-900">
                AI + DB
              </span>
            </div>
            <p className="text-[13px] text-ink-soft">
              {language === 'bn'
                ? 'গুগল জেমিনাই ও EduExpress যাচাইকৃত ডাটাবেসের সাহায্যে সরাসরি প্রশ্নোত্তর'
                : 'Interactive queries grounded in verified university, cost, and guide records'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="inline-flex rounded-xl bg-stone-200/70 p-1 text-[13px] font-semibold">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`rounded-lg px-2.5 py-1 transition-colors ${
                language === 'en'
                  ? 'bg-white text-petrol-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`rounded-lg px-2.5 py-1 transition-colors ${
                language === 'bn'
                  ? 'bg-white text-petrol-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              বাংলা
            </button>
          </div>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
              title="Reset conversation"
            >
              <RefreshCw size={13} aria-hidden="true" />
              <span className="hidden sm:inline">{language === 'bn' ? 'নতুন চ্যাট' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Conversation Body */}
      <div className="min-h-[380px] max-h-[560px] overflow-y-auto px-5 py-6 sm:px-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-canvas-soft text-petrol-800 ring-1 ring-stone-200">
              <Bot size={28} aria-hidden="true" />
            </div>
            <h4 className="mt-4 text-[19px] font-bold text-petrol-800">
              {language === 'bn'
                ? 'কীভাবে সাহায্য করতে পারি?'
                : 'What would you like to know before choosing?'}
            </h4>
            <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-ink-soft">
              {language === 'bn'
                ? 'চীনে MBBS ও BMDC স্বীকৃতি, মালয়েশিয়ার টিউশন ফি, চাইনিজ স্কলারশিপ বা EduExpress-এর স্বচ্ছ ফি পলিসি সম্পর্কে প্রশ্ন করুন।'
                : 'Ask about MBBS BMDC recognition, China ClearCost tuition schedules, Malaysian universities, or our transparent visa-first terms.'}
            </p>

            {/* Presets */}
            <div className="mt-6 flex w-full max-w-xl flex-wrap justify-center gap-2">
              {presets.map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSubmitQuestion(preset.query)}
                  className="rounded-full border border-stone-200 bg-stone-50 px-3.5 py-2 text-left text-[13px] font-medium text-petrol-800 transition-all hover:border-petrol-800 hover:bg-lime-pale"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-stone-100 pt-6 text-[12px] text-stone-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#2ead4b]" aria-hidden="true" />
                120+ Verified Universities
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#2ead4b]" aria-hidden="true" />
                Published ClearCost Plans
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#2ead4b]" aria-hidden="true" />
                WDOMS & BMDC Checks
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#2ead4b]" aria-hidden="true" />
                No China Service Fee Before Visa
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-petrol-800 text-lime shadow-sm">
                    <Sparkles size={16} aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl px-5 py-4 sm:max-w-[82%] ${
                    msg.role === 'user'
                      ? 'bg-petrol-800 text-white'
                      : 'border border-stone-200/80 bg-stone-50/70'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-[15px] leading-relaxed">{msg.content}</p>
                  ) : (
                    <div>
                      {renderFormattedMessage(msg.content)}

                      {/* Engine Tag */}
                      <div className="mt-3 flex items-center gap-2 border-t border-stone-200/60 pt-2 text-[11px] text-stone-500">
                        {msg.mode === 'gemini' ? (
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                            <Sparkles size={12} aria-hidden="true" />
                            Google Gemini {msg.model || 'Interactions API'} · Database Grounded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-medium text-stone-600">
                            <CheckCircle2 size={12} className="text-stone-500" aria-hidden="true" />
                            EduExpress Verified Catalog Match
                          </span>
                        )}
                      </div>

                      {/* Citations Pill Bar */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 border-t border-stone-200/60 pt-3">
                          <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                            {language === 'bn' ? 'যাচাইকৃত তথ্যসূত্র ও লিঙ্ক:' : 'Verified Sources & Profiles:'}
                          </span>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {msg.citations.map(citation => (
                              <Link
                                key={citation.href}
                                href={citation.href}
                                className="group inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-[12px] font-semibold text-petrol-800 transition-colors hover:border-petrol-800 hover:bg-lime-pale"
                              >
                                {citation.category === 'university' && (
                                  <GraduationCap size={13} className="text-petrol-800" aria-hidden="true" />
                                )}
                                <span>{citation.title}</span>
                                <ExternalLink
                                  size={11}
                                  className="text-stone-400 group-hover:text-petrol-800"
                                  aria-hidden="true"
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-stone-200 text-petrol-800">
                    <User size={16} aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}

            {/* In-Flight Streaming Bubble */}
            {isStreaming && (
              <div className="flex justify-start gap-3 sm:gap-4">
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-petrol-800 text-lime shadow-sm">
                  <Sparkles size={16} aria-hidden="true" />
                </div>
                <div className="max-w-[88%] rounded-2xl border border-stone-200 bg-stone-50/70 px-5 py-4 sm:max-w-[82%]">
                  {streamingStatus && (
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-lime-pale px-3 py-1 text-[12px] font-semibold text-lime-deep">
                      <Loader2 size={12} className="animate-spin text-petrol-800" aria-hidden="true" />
                      <span>{streamingStatus}</span>
                    </div>
                  )}

                  {streamingText ? (
                    renderFormattedMessage(streamingText)
                  ) : (
                    <div className="flex items-center gap-2 text-[14px] text-stone-500">
                      <span className="inline-block size-1.5 animate-pulse rounded-full bg-petrol-800" />
                      <span className="inline-block size-1.5 animate-pulse rounded-full bg-petrol-800 [animation-delay:200ms]" />
                      <span className="inline-block size-1.5 animate-pulse rounded-full bg-petrol-800 [animation-delay:400ms]" />
                      <span className="ml-1 text-[13px]">
                        {language === 'bn' ? 'উত্তর প্রস্তুত হচ্ছে…' : 'Composing answer…'}
                      </span>
                    </div>
                  )}

                  {streamingCitations.length > 0 && (
                    <div className="mt-3 border-t border-stone-200/60 pt-3">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        {language === 'bn' ? 'শনাক্তকৃত রেফারেন্স:' : 'Detected References:'}
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {streamingCitations.map(citation => (
                          <span
                            key={citation.href}
                            className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-[12px] font-medium text-stone-700"
                          >
                            <span className="text-[10px] uppercase text-stone-400">
                              {formatCitationLabel(citation.category)}:
                            </span>
                            <span>{citation.title}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div className="mx-6 mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] text-rose-800 sm:mx-8">
          <p className="font-semibold">{language === 'bn' ? 'ত্রুটি ঘটেছে:' : 'Notice:'}</p>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleFormSubmit} className="border-t border-stone-200/80 bg-stone-50/60 p-4 sm:p-5">
        <div className="relative flex items-center gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder={
              language === 'bn'
                ? 'আপনার প্রশ্ন লিখুন (যেমন: MBBS BMDC স্বীকৃতি, মালয়েশিয়া সিএসই খরচ, স্কলারশিপ)…'
                : 'Ask a verified question (e.g., MBBS BMDC recognition, Malaysia CS fees, China scholarships)…'
            }
            rows={1}
            className="w-full resize-none rounded-2xl border border-stone-300 bg-white py-3 pl-4 pr-24 text-[15px] text-stone-900 placeholder:text-stone-400 focus:border-petrol-800 focus:outline-none focus:ring-2 focus:ring-petrol-800/10 disabled:bg-stone-100"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {isStreaming ? (
              <button
                type="button"
                onClick={handleStop}
                className="grid size-9 place-items-center rounded-xl bg-stone-800 text-white transition-opacity hover:opacity-90"
                title="Stop streaming"
              >
                <Square size={14} fill="currentColor" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="grid size-9 place-items-center rounded-xl bg-petrol-800 text-lime transition-all hover:bg-petrol-900 disabled:opacity-30 disabled:hover:bg-petrol-800"
                title="Send question"
              >
                <Send size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Brand Compliance Footer */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[12px] text-stone-500">
          <p className="leading-relaxed">
            {language === 'bn'
              ? 'EduExpress ভর্তি, স্কলারশিপ বা ভিসার গ্যারান্টি দেয় না। চায়না ভিসার আগে কোনো সার্ভিস চার্জ নেই।'
              : 'EduExpress does not guarantee admission, scholarships, or visas. China routes have no service fee before visa.'}
          </p>
          <Link
            href="/education-fit-assessment"
            className="inline-flex items-center gap-1 font-semibold text-petrol-800 underline underline-offset-2 hover:text-petrol-900"
          >
            {language === 'bn' ? 'ফ্রি প্রোফাইল যাচাই করুন' : 'Need a written assessment?'}
            <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>
      </form>
    </div>
  );
}
