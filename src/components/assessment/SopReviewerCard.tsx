'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  GraduationCap,
  Lightbulb,
  Loader2,
  MessageCircle,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import type {
  SopDocumentType,
  SopReviewResult,
  SopTargetCountry,
  SopTargetDegree,
} from '@/lib/sop-reviewer';

const SAMPLE_CSC_PLAN = `STUDY AND RESEARCH PLAN IN CHINA

Target Degree: Master of Engineering in Computer Science and Technology
Target Institution: Southeast University, Nanjing, China

1. ACADEMIC BACKGROUND AND OBJECTIVES
I graduated with a Bachelor of Science in Computer Science and Engineering from a recognized university in Bangladesh, achieving a CGPA of 3.65/4.00. Throughout my undergraduate curriculum, my primary academic interest was distributed systems and machine learning. My undergraduate capstone project focused on real-time traffic sensor anomaly detection using graph neural networks.

2. REASONS FOR CHOOSING CHINA AND SOUTHEAST UNIVERSITY
China is at the global forefront of high-speed computing, artificial intelligence, and digital infrastructure. Southeast University in Nanjing is renowned for its national key laboratory in computer science and robust industry-academia collaboration. Specifically, I am motivated to join Dr. Liu’s research team focusing on edge-cloud collaborative intelligence, which closely aligns with my scholastic preparation.

3. PROPOSED STUDY & RESEARCH TIMELINE
- Year 1 (Semester 1 & 2): Complete all mandatory core coursework in advanced algorithms, distributed computing, and achieve HSK Level 3 in Chinese language to communicate effectively in laboratory and daily settings.
- Year 2 (Semester 3 & 4): Conduct experimental research on latency-aware edge scheduling under the supervision of my faculty advisor. Submit at least one research paper to an international peer-reviewed conference.
- Year 3 (Semester 5 & 6): Complete thesis dissertation writing, defense, and laboratory knowledge transfer.

4. POST-GRADUATION PLAN AND CAREER GOALS
Upon graduation, I will return immediately to Bangladesh. The burgeoning digital transformation and fintech sectors in Dhaka require highly skilled engineers in distributed infrastructure. My goal is to join the faculty of a leading engineering university in Bangladesh or contribute as a senior research engineer to national data initiatives, leveraging the high-level knowledge and technical rigor acquired in China.`;

export default function SopReviewerCard() {
  const [docType, setDocType] = useState<SopDocumentType>('study_plan');
  const [country, setCountry] = useState<SopTargetCountry>('China');
  const [degree, setDegree] = useState<SopTargetDegree>('Master');
  const [subject, setSubject] = useState('Computer Science & Technology');
  const [draftText, setDraftText] = useState('');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SopReviewResult | null>(null);

  const wordCount = draftText.trim() ? draftText.trim().split(/\s+/).filter(Boolean).length : 0;

  const targetRanges: Record<SopTargetDegree, { min: number; max: number }> = {
    Bachelor: { min: 500, max: 1000 },
    Master: { min: 800, max: 1500 },
    PhD: { min: 1000, max: 2500 },
    MBBS: { min: 600, max: 1200 },
  };
  const targetRange = targetRanges[degree];

  const handleReview = async () => {
    if (!draftText.trim() || draftText.trim().length < 30) {
      setError(language === 'bn' ? 'অনুগ্রহ করে ন্যূনতম ৩০ অক্ষরের একটি খসড়া লিখুন বা পেস্ট করুন।' : 'Please enter at least 30 characters of your draft.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/sop-reviewer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: draftText,
          documentType: docType,
          targetCountry: country,
          targetDegree: degree,
          targetSubject: subject,
          language,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to review draft. Please try again.');
      }

      const data = (await res.json()) as SopReviewResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evaluation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setDocType('study_plan');
    setCountry('China');
    setDegree('Master');
    setSubject('Computer Science & Technology');
    setDraftText(SAMPLE_CSC_PLAN);
    setError(null);
  };

  const handleReset = () => {
    setDraftText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="rounded-3xl border border-petrol-100 bg-white p-6 shadow-xl sm:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-canvas-soft pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-lime/20 px-3.5 py-1 text-[13px] font-bold uppercase tracking-wider text-petrol-900">
            <Sparkles size={14} className="text-petrol-800" />
            {language === 'bn' ? 'জেমিনি ৪ এআই স্টাডি প্ল্যান রিভিউ' : 'Gemini 4 Study Plan & SOP Reviewer'}
          </div>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-petrol-900 sm:text-3xl">
            {language === 'bn' ? 'সিএসসি ও বিশ্ববিদ্যালয় স্টাডি প্ল্যান নিরীক্ষা' : 'CSC & University Study Plan Critique'}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            {language === 'bn'
              ? 'চীনা সিএসসি স্কলারশিপ এবং মালয়েশিয়ার অ্যাডমিশন কমিটির মানদণ্ডে আপনার খসড়া যাচাই করুন।'
              : 'Evaluate your draft against official Chinese CSC scholarship and university rubrics before applying.'}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-1.5 self-start rounded-full border border-canvas-soft bg-canvas-subtle p-1 sm:self-center">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              language === 'en' ? 'bg-petrol-900 text-white shadow-sm' : 'text-ink-soft hover:text-ink'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('bn')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              language === 'bn' ? 'bg-petrol-900 text-white shadow-sm' : 'text-ink-soft hover:text-ink'
            }`}
          >
            বাংলা
          </button>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Document Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
            {language === 'bn' ? 'ডকুমেন্টের ধরন' : 'Document Type'}
          </label>
          <select
            value={docType}
            onChange={e => setDocType(e.target.value as SopDocumentType)}
            className="mt-1.5 w-full rounded-xl border border-canvas-soft bg-canvas-subtle px-3 py-2 text-sm font-semibold text-petrol-900 focus:border-petrol-800 focus:outline-none"
          >
            <option value="study_plan">Study Plan (CSC / Chinese Universities)</option>
            <option value="sop">Statement of Purpose (SOP)</option>
            <option value="research_proposal">Research Proposal</option>
          </select>
        </div>

        {/* Target Country */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
            {language === 'bn' ? 'গন্তব্য দেশ' : 'Target Country'}
          </label>
          <select
            value={country}
            onChange={e => setCountry(e.target.value as SopTargetCountry)}
            className="mt-1.5 w-full rounded-xl border border-canvas-soft bg-canvas-subtle px-3 py-2 text-sm font-semibold text-petrol-900 focus:border-petrol-800 focus:outline-none"
          >
            <option value="China">China (CSC & University Scholarships)</option>
            <option value="Malaysia">Malaysia (EMGS & Universities)</option>
            <option value="General">General / Other</option>
          </select>
        </div>

        {/* Target Degree */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
            {language === 'bn' ? 'ডিগ্রি লেভেল' : 'Target Degree'}
          </label>
          <select
            value={degree}
            onChange={e => setDegree(e.target.value as SopTargetDegree)}
            className="mt-1.5 w-full rounded-xl border border-canvas-soft bg-canvas-subtle px-3 py-2 text-sm font-semibold text-petrol-900 focus:border-petrol-800 focus:outline-none"
          >
            <option value="Bachelor">Bachelor’s (Undergraduate)</option>
            <option value="Master">Master’s (Postgraduate)</option>
            <option value="PhD">PhD / Doctorate</option>
            <option value="MBBS">MBBS / Clinical Medicine</option>
          </select>
        </div>

        {/* Target Major / Subject */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
            {language === 'bn' ? 'বিষয় / মেজর' : 'Intended Major'}
          </label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="e.g. Computer Science, Civil Eng"
            className="mt-1.5 w-full rounded-xl border border-canvas-soft bg-canvas-subtle px-3 py-2 text-sm font-semibold text-petrol-900 focus:border-petrol-800 focus:outline-none"
          />
        </div>
      </div>

      {/* Editor Area */}
      <div className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-3 text-xs text-ink-soft">
            <span>
              {language === 'bn' ? 'শব্দ সংখ্যা:' : 'Words:'}{' '}
              <strong className="text-petrol-900">{wordCount}</strong>
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="rounded-full bg-lime/20 px-2.5 py-0.5 font-medium text-petrol-900">
              {language === 'bn' ? `প্রস্তাবিত: ${targetRange.min}–${targetRange.max} শব্দ` : `Target: ${targetRange.min}–${targetRange.max} words`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-petrol-800 hover:underline"
            >
              <FileCheck2 size={14} />
              {language === 'bn' ? 'নমুনা সিএসসি প্ল্যান লোড করুন' : 'Load Sample CSC Plan'}
            </button>
            {draftText && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-ink-soft hover:text-ink"
              >
                <RotateCcw size={13} />
                {language === 'bn' ? 'মুছে ফেলুন' : 'Clear'}
              </button>
            )}
          </div>
        </div>

        <textarea
          rows={11}
          value={draftText}
          onChange={e => setDraftText(e.target.value)}
          placeholder={
            language === 'bn'
              ? 'এখানে আপনার স্টাডি প্ল্যান বা এসওপি খসড়া লিখুন বা পেস্ট করুন (কমপক্ষে ৩০ অক্ষর)...'
              : 'Paste or type your Study Plan, SOP, or Proposal draft here (minimum 30 characters)...'
          }
          className="w-full rounded-2xl border border-canvas-soft bg-white p-4 font-mono text-sm leading-relaxed text-ink shadow-inner focus:border-petrol-800 focus:outline-none focus:ring-1 focus:ring-petrol-800"
        />
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Review Button */}
      <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-xs text-ink-soft">
          {language === 'bn'
            ? 'গবেষণা পদ্ধতি, শব্দ সংখ্যা এবং নন-ইমিগ্র্যান্ট ভিসার শর্তাবলী স্বয়ংক্রিয়ভাবে নিরীক্ষিত হবে।'
            : 'Evaluates methodology, milestones, word count limits, and non-immigrant compliance.'}
        </p>
        <button
          type="button"
          onClick={handleReview}
          disabled={loading || !draftText.trim()}
          className="ed-btn ed-btn-signal w-full justify-center px-8 sm:w-auto disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {language === 'bn' ? 'জেমিনি বিশ্লেষণ চলছে...' : 'Analyzing with Gemini...'}
            </>
          ) : (
            <>
              <Sparkles size={18} />
              {language === 'bn' ? 'স্টাডি প্ল্যান নিরীক্ষা করুন' : 'Critique Study Plan'}
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>

      {/* Review Results */}
      {result && (
        <div className="mt-8 rounded-3xl border border-petrol-200 bg-gradient-to-br from-petrol-50/50 to-canvas-subtle p-6 sm:p-8">
          {/* Result Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-petrol-100 pb-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div
                className={`grid size-16 shrink-0 place-items-center rounded-2xl font-display text-2xl font-black text-white shadow-md ${
                  result.overallScore >= 80
                    ? 'bg-petrol-900'
                    : result.overallScore >= 65
                    ? 'bg-amber-600'
                    : 'bg-red-600'
                }`}
              >
                {result.overallScore}
                <span className="text-[10px] font-normal opacity-80">/100</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-bold text-petrol-900">
                    {language === 'bn' ? 'সামগ্রিক মূল্যায়ন স্কোর' : 'Overall Evaluation Score'}
                  </h4>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      result.status === 'excellent'
                        ? 'bg-lime text-petrol-900'
                        : result.status === 'good'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {result.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-soft">
                  {result.wordCount} {language === 'bn' ? 'শব্দ' : 'words'} · ~{result.estimatedReadTimeMinutes}{' '}
                  {language === 'bn' ? 'মিনিট পড়ার সময়' : 'min read time'} ·{' '}
                  <span className="font-semibold text-petrol-800">
                    {result.mode === 'gemini' ? 'Gemini 4 Hydrogen Verified' : 'Catalog Evaluation'}
                  </span>
                </p>
              </div>
            </div>

            <a
              href="#contact"
              className="ed-btn ed-btn-outline self-start text-xs sm:self-center"
            >
              {language === 'bn' ? 'কাউন্সিলরের সাথে আলোচনা করুন' : 'Discuss with a Counselor'}
            </a>
          </div>

          {/* Compliance Alerts if present */}
          {(result.countrySpecificFeedback.visaComplianceRisk ||
            result.countrySpecificFeedback.medicalLicensingNote ||
            result.countrySpecificFeedback.cscAlignment) && (
            <div className="mt-6 space-y-3">
              {result.countrySpecificFeedback.cscAlignment && (
                <div className="flex items-start gap-3 rounded-2xl border border-lime/60 bg-lime/10 p-4 text-sm text-petrol-900">
                  <Award size={18} className="mt-0.5 shrink-0 text-petrol-800" />
                  <div>
                    <strong className="block font-semibold">
                      {language === 'bn' ? 'সিএসসি স্কলারশিপ পরামর্শ' : 'CSC Scholarship Advisory'}
                    </strong>
                    <span className="mt-0.5 block leading-relaxed text-ink-soft">
                      {result.countrySpecificFeedback.cscAlignment}
                    </span>
                  </div>
                </div>
              )}

              {result.countrySpecificFeedback.visaComplianceRisk && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                  <ShieldAlert size={18} className="mt-0.5 shrink-0 text-red-600" />
                  <div>
                    <strong className="block font-semibold">
                      {language === 'bn' ? 'ভিসা ও আইনগত ঝুঁকি সতর্কতা' : 'Visa & Consular Risk Alert'}
                    </strong>
                    <span className="mt-0.5 block leading-relaxed text-red-800">
                      {result.countrySpecificFeedback.visaComplianceRisk}
                    </span>
                  </div>
                </div>
              )}

              {result.countrySpecificFeedback.medicalLicensingNote && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <GraduationCap size={18} className="mt-0.5 shrink-0 text-amber-700" />
                  <div>
                    <strong className="block font-semibold">
                      {language === 'bn' ? 'বিএমডিসি মেডিকেল লাইসেন্সিং শর্ত' : 'BMDC Licensing Requirement'}
                    </strong>
                    <span className="mt-0.5 block leading-relaxed text-amber-800">
                      {result.countrySpecificFeedback.medicalLicensingNote}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Strengths and Weaknesses Grid */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Strengths */}
            <div className="rounded-2xl border border-emerald-200/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600" />
                {language === 'bn' ? 'খসড়ার ইতিবাচক দিকসমূহ' : 'Key Strengths'}
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
                {result.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-2xl border border-amber-200/60 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-800">
                <AlertTriangle size={16} className="text-amber-600" />
                {language === 'bn' ? 'উন্নয়নের সুযোগ' : 'Areas for Revision'}
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
                {result.weaknesses.length > 0 ? (
                  result.weaknesses.map((weak, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span>{weak}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-ink-soft">
                    {language === 'bn' ? 'কোনো গুরুতর ত্রুটি পাওয়া যায়নি।' : 'No critical structural weaknesses detected.'}
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Actionable Suggestions */}
          {result.actionableSuggestions.length > 0 && (
            <div className="mt-6">
              <h5 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-petrol-900">
                <Lightbulb size={16} className="text-amber-600" />
                {language === 'bn' ? 'নির্দিষ্ট সংশোধন ও পুনর্লেখন পরামর্শ' : 'Actionable Revision Recommendations'}
              </h5>
              <div className="mt-3 space-y-4">
                {result.actionableSuggestions.map((sug, idx) => (
                  <div key={idx} className="rounded-2xl border border-canvas-soft bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <strong className="text-base font-semibold text-petrol-900">{sug.title}</strong>
                      <span className="rounded-full bg-petrol-50 px-2.5 py-0.5 text-xs font-semibold text-petrol-800">
                        {sug.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{sug.text}</p>

                    {sug.exampleBeforeAfter && (
                      <div className="mt-4 grid gap-3 rounded-xl bg-canvas-subtle p-3.5 sm:grid-cols-2">
                        <div className="rounded-lg border border-red-200/50 bg-white p-3 text-xs leading-relaxed">
                          <span className="font-bold text-red-700">❌ Before (Generic/Weak):</span>
                          <p className="mt-1 text-ink-soft italic">&ldquo;{sug.exampleBeforeAfter.before}&rdquo;</p>
                        </div>
                        <div className="rounded-lg border border-emerald-200/50 bg-white p-3 text-xs leading-relaxed">
                          <span className="font-bold text-emerald-700">✅ After (Persuasive/Specific):</span>
                          <p className="mt-1 text-petrol-900 font-medium">&ldquo;{sug.exampleBeforeAfter.after}&rdquo;</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* High-Intent Lead Conversion Card */}
          <div className="mt-8 rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-50/80 via-white to-petrol-50/50 p-5 shadow-sm sm:p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 size={13} />
                  {language === 'bn' ? 'কাউন্সেলর রিভিউ ও সিএসসি সহায়তা' : 'Expert Counselor Review Available'}
                </span>
                <h4 className="mt-2 text-lg font-bold text-petrol-900">
                  {language === 'bn'
                    ? 'আপনার স্টাডি প্ল্যান ও স্কলারশিপ ফাইল চূড়ান্ত করতে চান?'
                    : 'Need a Senior Counselor to Polish Your SOP & Finalize University Submission?'}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft sm:text-sm">
                  {language === 'bn'
                    ? 'এডুএক্সপ্রেস ধানমন্ডি অফিসের চীন ও আন্তর্জাতিক স্কলারশিপ স্পেশালিস্টদের সাথে সরাসরি হোয়াটসঅ্যাপে পরামর্শ করুন। ভিসা অনুমোদনের পূর্বে কোনো সার্ভিস ফি নেই।'
                    : 'Connect directly with an EduExpress Dhanmondi specialist to review professor communications, CSC Type A/B strategies, and admissions. Zero service fee before visa approval.'}
                </p>
              </div>

              <a
                href={`https://wa.me/8801983333566?text=${encodeURIComponent(
                  `Hello EduExpress! I ran the AI Study Plan Review for ${degree} in ${subject || 'my subject'} (${country}). My overall score is ${result.overallScore}/100 (rating: ${result.status}). Could a senior counselor help me polish my study plan and review my university shortlist?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg sm:text-sm"
              >
                <MessageCircle size={16} />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে কাউন্সেলরের সাথে কথা বলুন' : 'Chat on WhatsApp with Specialist'}</span>
              </a>
            </div>
          </div>

          {/* EduExpress Service Note & Disclaimer */}
          <div className="mt-6 border-t border-petrol-100 pt-4 text-xs text-ink-soft">
            <p className="flex items-center gap-1.5 font-medium text-petrol-800">
              <BookOpen size={14} />
              {language === 'bn'
                ? 'এডুএক্সপ্রেস চীন ভিসা-ফার্স্ট পলিসি: ভিসা অনুমোদনের পূর্বে কোনো সার্ভিস চার্জ নেই।'
                : 'EduExpress China Visa-First Policy: Zero service fee charged before China student visa approval.'}
            </p>
            <p className="mt-1 italic">{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
