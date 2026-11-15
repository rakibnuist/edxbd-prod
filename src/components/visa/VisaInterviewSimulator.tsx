'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  HelpCircle,
  Loader2,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { FitResponseLanguage } from '@/lib/fit-matcher';
import {
  getQuestionsForDestination,
  type VisaAnswerSubmission,
  type VisaDestination,
  type VisaInterviewFeedback,
} from '@/lib/visa-simulator';

export default function VisaInterviewSimulator() {
  const [destination, setDestination] = useState<VisaDestination>('china');
  const [language, setLanguage] = useState<FitResponseLanguage>('en');
  const [universityName, setUniversityName] = useState(
    'Nanjing University of Information Science & Technology',
  );
  const [programName, setProgramName] = useState('Computer Science & Technology (Bachelor)');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<VisaInterviewFeedback | null>(null);

  const questions = getQuestionsForDestination(destination);
  const currentQ = questions[currentIndex] || questions[0];
  const bn = language === 'bn';

  const handleDestinationChange = (dest: VisaDestination) => {
    setDestination(dest);
    setCurrentIndex(0);
    setAnswers({});
    setFeedback(null);
    if (dest === 'china') {
      setUniversityName('Nanjing University of Information Science & Technology');
      setProgramName('Computer Science & Technology (Bachelor)');
    } else {
      setUniversityName('Asia Pacific University of Technology & Innovation');
      setProgramName('BSc (Hons) in Computer Science');
    }
  };

  const handleAnswerChange = (val: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const submissionAnswers: VisaAnswerSubmission[] = questions.map(q => ({
      questionId: q.id,
      answer: answers[q.id] || '',
    }));

    try {
      const response = await fetch('/api/ai/visa-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          universityName,
          programName,
          academicLevel: 'Bachelor',
          language,
          answers: submissionAnswers,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to evaluate interview responses.');
      }

      setFeedback(data.feedback);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evaluation service is currently unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setAnswers({});
    setFeedback(null);
    setError(null);
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 bg-stone-50/80 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-petrol-800 text-lime shadow-sm">
            <Sparkles size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-bold text-petrol-800">
                {bn ? 'এআই ভিসা ইন্টারভিউ সিমুলেটর' : 'AI Visa Interview Simulator'}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-petrol-900">
                Gemini Consular Prep
              </span>
            </div>
            <p className="text-[13px] text-ink-soft">
              {bn
                ? 'চীনা দূতাবাস (JW202) ও মালয়েশিয়া (EMGS) ভিসা ইন্টারভিউয়ের জন্য প্রস্তুতি'
                : 'Practice genuine embassy consular questions for China & Malaysia student visas'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Destination Switch */}
          <div className="inline-flex rounded-xl bg-stone-200/70 p-1 text-[13px] font-semibold">
            <button
              type="button"
              onClick={() => handleDestinationChange('china')}
              className={`rounded-lg px-2.5 py-1 transition-colors ${
                destination === 'china'
                  ? 'bg-white text-petrol-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🇨🇳 China
            </button>
            <button
              type="button"
              onClick={() => handleDestinationChange('malaysia')}
              className={`rounded-lg px-2.5 py-1 transition-colors ${
                destination === 'malaysia'
                  ? 'bg-white text-petrol-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🇲🇾 Malaysia
            </button>
          </div>

          {/* Language Switch */}
          <div className="inline-flex rounded-xl bg-stone-200/70 p-1 text-[13px] font-semibold">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`rounded-lg px-2 py-1 transition-colors ${
                language === 'en'
                  ? 'bg-white text-petrol-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`rounded-lg px-2 py-1 transition-colors ${
                language === 'bn'
                  ? 'bg-white text-petrol-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              বাং
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Body */}
      <div className="p-6 sm:p-8">
        {!feedback ? (
          <div>
            {/* Context bar */}
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-stone-500">
                  {bn ? 'বিশ্ববিদ্যালয়ের নাম' : 'Admitted University'}
                </label>
                <input
                  type="text"
                  value={universityName}
                  onChange={e => setUniversityName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-[14px] text-stone-800 focus:border-petrol-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-stone-500">
                  {bn ? 'প্রোগ্রাম ও ডিগ্রি' : 'Program & Degree'}
                </label>
                <input
                  type="text"
                  value={programName}
                  onChange={e => setProgramName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-[14px] text-stone-800 focus:border-petrol-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Step progress pills */}
            <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-4">
              <span className="text-[13px] font-bold text-petrol-800">
                {bn ? `প্রশ্ন ${currentIndex + 1} / ৪` : `Question ${currentIndex + 1} of 4`}
              </span>
              <div className="flex gap-1.5">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'w-8 bg-petrol-800'
                        : answers[q.id]?.trim()
                        ? 'w-4 bg-lime-deep'
                        : 'w-4 bg-stone-200'
                    }`}
                    title={`Question ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Consular Officer Question Card */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-petrol-800 text-lime shadow-sm">
                  <Bot size={20} aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {bn ? 'কনসুলার অফিসার প্রশ্ন:' : 'Consular Officer Inquiry:'}
                  </span>
                  <h4 className="mt-1 text-[17px] font-bold leading-snug text-petrol-800 sm:text-[19px]">
                    {bn ? currentQ.questionBn : currentQ.questionEn}
                  </h4>
                  <p className="mt-2 flex items-center gap-1.5 text-[13px] text-stone-600">
                    <HelpCircle size={14} className="text-stone-400" aria-hidden="true" />
                    <span>{bn ? currentQ.contextBn : currentQ.contextEn}</span>
                  </p>
                </div>
              </div>

              {/* Answer Box */}
              <div className="mt-5">
                <label className="block text-[13px] font-semibold text-petrol-800">
                  {bn ? 'আপনার উত্তর লিখুন:' : 'Your Answer:'}
                </label>
                <textarea
                  rows={4}
                  value={answers[currentQ.id] || ''}
                  onChange={e => handleAnswerChange(e.target.value)}
                  placeholder={
                    bn
                      ? 'আত্মবিশ্বাসের সাথে ২-৩ বাক্যে আপনার উত্তর লিখুন…'
                      : 'Provide a concise, confident 2-3 sentence answer as you would speak at the embassy counter…'
                  }
                  className="mt-2 w-full rounded-xl border border-stone-300 bg-white p-3.5 text-[14px] leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-petrol-800 focus:outline-none focus:ring-2 focus:ring-petrol-800/10"
                />
              </div>

              {/* Key points hint */}
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-200/80 pt-3 text-[12px] text-stone-500">
                <span className="font-semibold text-stone-700">{bn ? 'গুরুত্বপূর্ণ পয়েন্ট:' : 'Key focus:'}</span>
                {currentQ.keyCheckingPoints.map((point, idx) => (
                  <span key={idx} className="rounded-md bg-white px-2 py-0.5 text-stone-600 ring-1 ring-stone-200">
                    {point}
                  </span>
                ))}
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-800">
                {error}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-30"
              >
                <ArrowLeft size={15} aria-hidden="true" />
                <span>{bn ? 'পূর্ববর্তী' : 'Previous'}</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ed-btn ed-btn-signal min-h-[42px] px-5 text-[13px]"
                >
                  <span>{bn ? 'পরবর্তী প্রশ্ন' : 'Next Question'}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="ed-btn ed-btn-signal min-h-[42px] px-6 text-[13px]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                      <span>{bn ? 'মূল্যায়ন হচ্ছে…' : 'Analyzing Answers…'}</span>
                    </>
                  ) : (
                    <>
                      <span>{bn ? 'সম্পূর্ণ ইন্টারভিউ মূল্যায়ন করুন' : 'Evaluate Full Interview'}</span>
                      <Sparkles size={15} aria-hidden="true" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-6">
            {/* Verdict Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-canvas-soft p-5 ring-1 ring-stone-200 sm:p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`grid size-16 shrink-0 place-items-center rounded-2xl font-display text-[26px] font-black shadow-sm ${
                    feedback.verdict === 'strong'
                      ? 'bg-emerald-600 text-white'
                      : feedback.verdict === 'moderate'
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {feedback.readinessScore}
                </div>
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-lime-deep">
                    {bn ? 'কনসুলার প্রস্তুতি স্কোর' : 'Consular Readiness Score'}
                  </span>
                  <h4 className="text-[19px] font-bold text-petrol-800 sm:text-[21px]">
                    {feedback.verdictLabel}
                  </h4>
                  <p className="mt-0.5 text-[13px] text-stone-600">
                    {feedback.mode === 'gemini'
                      ? 'Google Gemini 4 Hydrogen Consular Analysis'
                      : 'EduExpress Verified Consular Assessment'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-stone-700 transition-colors hover:bg-stone-50"
              >
                <RefreshCw size={13} aria-hidden="true" />
                <span>{bn ? 'নতুন ইন্টারভিউ' : 'Retake Interview'}</span>
              </button>
            </div>

            {/* Red Flags Banner */}
            {feedback.redFlags.length > 0 && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-rose-950">
                <div className="flex items-start gap-3">
                  <ShieldAlert size={22} className="mt-0.5 shrink-0 text-rose-600" aria-hidden="true" />
                  <div>
                    <h5 className="font-bold text-[15px]">
                      {bn ? 'চিহ্নিত রেড ফ্ল্যাগ ও ঝুঁকি:' : 'Identified Red Flags & Consular Risks:'}
                    </h5>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] leading-relaxed">
                      {feedback.redFlags.map((flag, idx) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Strengths */}
            {feedback.strengths.length > 0 && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-emerald-950">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={22} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <div>
                    <h5 className="font-bold text-[15px]">
                      {bn ? 'পর্যবেক্ষিত ইতিবাচক দিকসমূহ:' : 'Observed Strengths:'}
                    </h5>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] leading-relaxed">
                      {feedback.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Corrections */}
            <div>
              <h5 className="text-[14px] font-bold uppercase tracking-wider text-stone-600">
                {bn ? 'প্রশ্নভিত্তিক পর্যালোচনা ও আদর্শ উত্তর:' : 'Question-by-Question Review & Model Answers:'}
              </h5>
              <div className="mt-3 space-y-3">
                {feedback.corrections.map((corr, idx) => (
                  <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50/60 p-4">
                    <strong className="block text-[14px] text-petrol-800">{corr.question}</strong>
                    <div className="mt-2 rounded-lg bg-white p-3 text-[13px] text-stone-700 ring-1 ring-stone-200">
                      <span className="font-semibold text-stone-500">{bn ? 'আপনার উত্তর:' : 'Your Answer:'}</span>{' '}
                      {corr.studentAnswer}
                    </div>
                    <div className="mt-2 rounded-lg bg-lime-pale/60 p-3 text-[13px] text-petrol-900 ring-1 ring-lime/40">
                      <span className="font-semibold text-lime-deep">{bn ? 'আদর্শ কূটনৈতিক উত্তর:' : 'Model Diplomatic Answer:'}</span>{' '}
                      {corr.recommendedResponse}
                    </div>
                    <p className="mt-2 text-[12px] font-medium text-stone-500">
                      💡 <span className="font-semibold">{bn ? 'টিপ:' : 'Tip:'}</span> {corr.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Counselor tips & Next Steps */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <h5 className="text-[14px] font-bold text-petrol-800">
                {bn ? 'EduExpress ভিসা টিমের শেষ পরামর্শ:' : 'EduExpress Visa Counselors’ Final Advice:'}
              </h5>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-ink-soft">
                {feedback.counselorTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4">
                <p className="text-[12px] text-stone-500">
                  {bn ? 'চায়না ভিসার ক্ষেত্রে ভিসা অনুমোদনের পূর্বে কোনো সার্ভিস ফি নেই।' : 'No consultancy service fee before China visa approval.'}
                </p>
                <Link
                  href="/contact"
                  className="ed-btn ed-btn-signal min-h-[38px] px-4 text-[13px]"
                >
                  {bn ? 'কাউন্সেলরের সাথে ১-অন-১ মক বুক করুন' : 'Book 1-on-1 Visa Mock'}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
