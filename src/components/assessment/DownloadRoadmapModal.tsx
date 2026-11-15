'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileDown,
  GraduationCap,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import type { RoadmapTargetCountry, RoadmapTargetDegree } from '@/lib/roadmap-generator';

interface DownloadRoadmapModalProps {
  initialStudentName?: string;
  initialCountry?: RoadmapTargetCountry;
  initialDegree?: RoadmapTargetDegree;
  initialMajor?: string;
  initialGpa?: string;
  initialIntake?: string;
  buttonLabel?: string;
  buttonVariant?: 'primary' | 'outline' | 'signal';
}

export default function DownloadRoadmapModal({
  initialStudentName = '',
  initialCountry = 'China',
  initialDegree = 'Bachelor',
  initialMajor = 'Computer Science & Technology',
  initialGpa = '4.50 / 5.00',
  initialIntake = 'March 2027',
  buttonLabel,
  buttonVariant = 'outline',
}: DownloadRoadmapModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [studentName, setStudentName] = useState(initialStudentName);
  const [country, setCountry] = useState<RoadmapTargetCountry>(initialCountry);
  const [degree, setDegree] = useState<RoadmapTargetDegree>(initialDegree);
  const [major, setMajor] = useState(initialMajor);
  const [gpa, setGpa] = useState(initialGpa);
  const [intake, setIntake] = useState(initialIntake);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDownloadSuccess(false);

    try {
      const res = await fetch('/api/ai/roadmap-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentName.trim() || 'Prospective Scholar',
          targetCountry: country,
          targetDegree: degree,
          intendedMajor: major,
          targetIntake: intake,
          gpa,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate PDF roadmap.');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (studentName.trim() || 'Scholar').replace(/[^a-zA-Z0-9_-]/g, '_');
      a.download = `EduExpress_Study_Roadmap_${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setDownloadSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error downloading PDF.');
    } finally {
      setLoading(false);
    }
  };

  const btnClass =
    buttonVariant === 'signal'
      ? 'ed-btn ed-btn-signal min-h-[46px] px-6 text-sm'
      : buttonVariant === 'primary'
      ? 'ed-btn ed-btn-primary min-h-[46px] px-6 text-sm'
      : 'ed-btn ed-btn-outline min-h-[46px] px-5 text-sm';

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 ${btnClass}`}
      >
        <FileDown size={17} className="text-petrol-800" />
        <span>{buttonLabel || 'Download Study & Cost Roadmap (PDF)'}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-xl rounded-3xl border border-canvas-soft bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-ink-soft hover:bg-canvas-subtle hover:text-ink"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-2xl bg-lime text-petrol-900 shadow-sm">
                <Sparkles size={20} />
              </span>
              <div>
                <h3 className="text-xl font-bold text-petrol-900">Official Study Abroad Roadmap PDF</h3>
                <p className="text-xs text-ink-soft">
                  Personalized 2-page academic strategy and ClearCost schedule for parents & visa planning.
                </p>
              </div>
            </div>

            <form onSubmit={handleDownload} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="e.g. Md. Tanvir Ahmed"
                  className="mt-1.5 w-full rounded-xl border border-canvas-soft bg-canvas-subtle px-3.5 py-2.5 text-sm font-semibold text-petrol-900 focus:border-petrol-800 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Target Country
                  </label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value as RoadmapTargetCountry)}
                    className="mt-1.5 w-full rounded-xl border border-canvas-soft bg-canvas-subtle px-3 py-2 text-sm font-semibold text-petrol-900 focus:border-petrol-800 focus:outline-none"
                  >
                    <option value="China">China (CSC & University Awards)</option>
                    <option value="Malaysia">Malaysia (EMGS & Universities)</option>
                    <option value="General">General / Comparative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Degree Level
                  </label>
                  <select
                    value={degree}
                    onChange={e => setDegree(e.target.value as RoadmapTargetDegree)}
                    className="mt-1.5 w-full rounded-xl border border-canvas-soft bg-canvas-subtle px-3 py-2 text-sm font-semibold text-petrol-900 focus:border-petrol-800 focus:outline-none"
                  >
                    <option value="Bachelor">Bachelor’s Degree</option>
                    <option value="Master">Master’s Degree</option>
                    <option value="PhD">PhD / Doctorate</option>
                    <option value="MBBS">MBBS / Clinical Medicine</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Intended Major
                  </label>
                  <input
                    type="text"
                    required
                    value={major}
                    onChange={e => setMajor(e.target.value)}
                    placeholder="e.g. Computer Science & Eng"
                    className="mt-1.5 w-full rounded-xl border border-canvas-soft bg-canvas-subtle px-3 py-2 text-sm font-semibold text-petrol-900 focus:border-petrol-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Target Intake
                  </label>
                  <select
                    value={intake}
                    onChange={e => setIntake(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-canvas-soft bg-canvas-subtle px-3 py-2 text-sm font-semibold text-petrol-900 focus:border-petrol-800 focus:outline-none"
                  >
                    <option value="March 2027">March 2027 Intake</option>
                    <option value="September 2027">September 2027 Intake</option>
                    <option value="September 2026">September 2026 Intake</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Academic Standing / GPA
                </label>
                <input
                  type="text"
                  required
                  value={gpa}
                  onChange={e => setGpa(e.target.value)}
                  placeholder="e.g. HSC GPA 4.80 or CGPA 3.60"
                  className="mt-1.5 w-full rounded-xl border border-canvas-soft bg-canvas-subtle px-3 py-2 text-sm font-semibold text-petrol-900 focus:border-petrol-800 focus:outline-none"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                  {error}
                </div>
              )}

              {downloadSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>Roadmap PDF generated and downloaded successfully!</span>
                </div>
              )}

              <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-canvas-soft pt-4 sm:flex-row">
                <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                  <GraduationCap size={14} />
                  Includes EduExpress China Visa-First Guarantee
                </span>

                <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="ed-btn ed-btn-outline px-4 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="ed-btn ed-btn-signal px-6 py-2.5 text-xs font-bold disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download size={14} />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
