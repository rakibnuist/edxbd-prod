'use client';

import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Loader2,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import type { FitResponseLanguage } from '@/lib/fit-matcher';
import type { TranscriptEvaluationResult } from '@/lib/transcript-evaluator';

interface TranscriptUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResults?: (gpa: string, academicLevel: string, subject: string) => void;
  initialLanguage?: FitResponseLanguage;
}

export default function TranscriptUploadModal({
  isOpen,
  onClose,
  onApplyResults,
  initialLanguage = 'en',
}: TranscriptUploadModalProps) {
  const [language, setLanguage] = useState<FitResponseLanguage>(initialLanguage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranscriptEvaluationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(language === 'bn' ? 'অনুগ্রহ করে JPG, PNG অথবা WebP ফরম্যাটের ছবি আপলোড করুন।' : 'Please choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError(language === 'bn' ? 'ছবির সাইজ ৮ মেগাবাইটের কম হতে হবে।' : 'Image size must be smaller than 8 MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setResult(null);
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleEvaluate = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('language', language);

    try {
      const response = await fetch('/api/ai/evaluate-transcript', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to evaluate transcript.');
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evaluation service is unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result || !onApplyResults) return;
    const gpaStr = String(result.analysis.gpa || '');
    const levelStr = result.analysis.examination || 'HSC / A Level';
    const subStr = result.eligibleDisciplines[0] || result.analysis.groupOrMajor || '';
    onApplyResults(gpaStr, levelStr, subStr);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-200/80 bg-stone-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-petrol-800 text-lime shadow-sm">
              <Sparkles size={18} aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-petrol-800">
                {language === 'bn' ? 'মার্কশিট ও ট্রান্সক্রিপ্ট স্ক্যানার' : 'Marksheet & Transcript Scanner'}
              </h3>
              <p className="text-[12px] text-ink-soft">
                {language === 'bn' ? 'জেমিনাই ভিশন ও BMDC নিয়মের সাহায্যে স্বয়ংক্রিয় মূল্যায়ন' : 'Multimodal Gemini evaluation with BMDC eligibility check'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-stone-200/70 p-1 text-[12px] font-semibold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`rounded-lg px-2 py-0.5 transition-colors ${language === 'en' ? 'bg-white text-petrol-800 shadow-sm' : 'text-stone-600'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`rounded-lg px-2 py-0.5 transition-colors ${language === 'bn' ? 'bg-white text-petrol-800 shadow-sm' : 'text-stone-600'}`}
              >
                বাং
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-8 place-items-center rounded-xl text-stone-400 hover:bg-stone-200/60 hover:text-stone-700"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6 sm:px-8">
          {!result ? (
            <div>
              {/* Dropzone */}
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragging
                    ? 'border-petrol-800 bg-lime-pale'
                    : 'border-stone-300 bg-stone-50/50 hover:border-petrol-800 hover:bg-stone-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onFileInputChange}
                  className="hidden"
                />

                <div className="grid size-12 place-items-center rounded-full bg-white text-petrol-800 shadow-sm ring-1 ring-stone-200">
                  <Upload size={22} aria-hidden="true" />
                </div>
                <p className="mt-4 text-[15px] font-semibold text-petrol-800">
                  {selectedFile
                    ? selectedFile.name
                    : language === 'bn'
                    ? 'মার্কশিট বা ট্রান্সক্রিপ্টের ছবি এখানে ড্রপ করুন অথবা ব্রাউজ করুন'
                    : 'Drop your marksheet image here or browse'}
                </p>
                <p className="mt-1 text-[13px] text-ink-soft">
                  {language === 'bn'
                    ? 'JPG, PNG বা WebP ফরম্যাট (সর্বোচ্চ ৮ মেগাবাইট)'
                    : 'JPG, PNG, or WebP up to 8 MB. SSC, HSC, Alim, A Level, or Bachelor.'}
                </p>
              </div>

              {previewUrl && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3 sm:px-4 sm:py-2.5">
                  <div className="flex min-w-0 max-w-full items-center gap-2 text-[13px] font-medium text-petrol-800">
                    <FileText size={16} className="shrink-0" aria-hidden="true" />
                    <span className="truncate">{selectedFile?.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleEvaluate}
                    disabled={loading}
                    className="ed-btn ed-btn-signal min-h-[38px] w-full sm:w-auto px-4 text-[13px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                        <span>{language === 'bn' ? 'স্ক্যান হচ্ছে…' : 'Evaluating…'}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === 'bn' ? 'জেমিনাই দিয়ে স্ক্যান করুন' : 'Evaluate with Gemini'}</span>
                        <Sparkles size={14} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Analysis Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-canvas-soft p-4 ring-1 ring-stone-200">
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-lime-deep">
                    {result.analysis.examination}
                  </span>
                  <h4 className="text-[18px] font-bold text-petrol-800">
                    {result.analysis.candidateName || (language === 'bn' ? 'শিক্ষার্থী প্রোফাইল' : 'Student Record')}
                  </h4>
                  <p className="text-[13px] text-ink-soft">
                    {result.analysis.groupOrMajor} · {result.analysis.educationBoard || 'Board Verified'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-[12px] font-semibold text-ink-soft">GPA</span>
                  <span className="font-display text-[26px] font-black leading-tight text-petrol-800">
                    {result.analysis.gpa} <span className="text-[16px] font-semibold text-ink-soft">/ {result.analysis.scale}</span>
                  </span>
                </div>
              </div>

              {/* BMDC Eligibility Banner */}
              <div
                className={`rounded-2xl border p-4 ${
                  result.bmdcEligibility.biologySatisfied
                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
                    : 'border-amber-200 bg-amber-50/70 text-amber-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.bmdcEligibility.biologySatisfied ? (
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
                  )}
                  <div>
                    <h5 className="font-bold text-[14px]">
                      {language === 'bn'
                        ? result.bmdcEligibility.biologySatisfied
                          ? 'BMDC জীববিজ্ঞান শর্ত পূরণ হয়েছে (GPA >= ৩.৫০)'
                          : 'BMDC জীববিজ্ঞান সতর্কতা'
                        : result.bmdcEligibility.biologySatisfied
                        ? 'BMDC Biology Threshold Satisfied (GPA >= 3.50)'
                        : 'BMDC Biology Eligibility Notice'}
                    </h5>
                    <p className="mt-1 text-[13px] leading-relaxed">
                      {result.bmdcEligibility.ruleExplanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Subjects */}
              {result.analysis.subjects.length > 0 && (
                <div>
                  <h5 className="text-[13px] font-bold uppercase tracking-wider text-stone-500">
                    {language === 'bn' ? 'শনাক্তকৃত বিষয় ও গ্রেড:' : 'Extracted Subject Grades:'}
                  </h5>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {result.analysis.subjects.map((sub, idx) => (
                      <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50/80 p-2.5">
                        <span className="block truncate text-[12px] font-semibold text-stone-600">{sub.name}</span>
                        <div className="mt-0.5 flex items-baseline justify-between">
                          <span className="font-bold text-[14px] text-petrol-800">{sub.grade}</span>
                          {sub.gradePoint !== undefined && (
                            <span className="text-[11px] font-semibold text-stone-500">{sub.gradePoint} pt</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grounded University Matches */}
              {result.recommendedMatches.length > 0 && (
                <div>
                  <h5 className="text-[13px] font-bold uppercase tracking-wider text-stone-500">
                    {language === 'bn' ? 'ডাটাবেস অনুযায়ী সম্ভাব্য প্রোগ্রাম ও বিশ্ববিদ্যালয়:' : 'Grounded University Matches:'}
                  </h5>
                  <div className="mt-2 space-y-2">
                    {result.recommendedMatches.map(uni => (
                      <div
                        key={uni.slug}
                        className="flex flex-col justify-between gap-2 rounded-xl border border-stone-200 bg-white p-3.5 sm:flex-row sm:items-center"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <GraduationCap size={15} className="text-petrol-800" aria-hidden="true" />
                            <strong className="text-[14px] font-bold text-petrol-800">{uni.universityName}</strong>
                            <span className="text-[12px] text-stone-500">({uni.city}, {uni.country})</span>
                          </div>
                          <p className="mt-0.5 text-[13px] text-stone-700">
                            {uni.programName} · <span className="font-semibold text-petrol-800">{uni.tuition}</span>
                          </p>
                          <p className="text-[11px] text-stone-500">{uni.eligibilityNotes}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {uni.clearCostPath && (
                            <Link
                              href={uni.clearCostPath}
                              className="text-[12px] font-semibold text-lime-deep underline underline-offset-2 hover:text-petrol-800"
                            >
                              ClearCost
                            </Link>
                          )}
                          <Link
                            href={uni.profilePath}
                            className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-[12px] font-semibold text-petrol-800 hover:bg-stone-100"
                          >
                            Profile <ExternalLink size={11} aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Counselor Summary */}
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-[13px] leading-relaxed text-ink-soft">
                <span className="font-bold text-petrol-800">
                  {language === 'bn' ? 'কাউন্সেলর পরামর্শ:' : 'Assessment Note:'}
                </span>{' '}
                {result.counselorSummary}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-800">
              {error}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 bg-stone-50 px-6 py-4 sm:px-8">
          <p className="text-[12px] text-stone-500">
            {language === 'bn' ? 'EduExpress ভর্তি বা স্কলারশিপের গ্যারান্টি দেয় না।' : 'No admission or scholarship guarantees.'}
          </p>

          <div className="flex items-center gap-2">
            {result ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-stone-700 hover:bg-stone-50"
                >
                  {language === 'bn' ? 'আরেকটি স্ক্যান করুন' : 'Scan Another'}
                </button>
                {onApplyResults && (
                  <button
                    type="button"
                    onClick={handleApply}
                    className="ed-btn ed-btn-signal min-h-[40px] px-4 text-[13px]"
                  >
                    {language === 'bn' ? 'ফর্মে তথ্য বসান' : 'Apply to Form'}
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-[13px] font-semibold text-stone-700 hover:bg-stone-50"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
