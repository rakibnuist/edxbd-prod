import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileCheck2, ShieldCheck } from 'lucide-react';

type DocumentGroup = {
  name: string;
  documents: string[];
};

const categories: { name: string; matches: RegExp }[] = [
  { name: 'Identity & Passport Details', matches: /passport|photograph|\bphoto\b|identity|birth certificate|guardian|nationality/i },
  { name: 'Academic Certificates & Transcripts', matches: /diploma|degree certificate|graduation|transcript|academic record|school certificate|(?:highest|academic) qualification certificate|predicted grade|\bSSC\b|\bHSC\b/i },
  { name: 'Language & Proficiency Proof', matches: /\bHSK\b|\bHSKK\b|\bIELTS\b|\bTOEFL\b|\bCSCA\b|language|medium.of.instruction|proficiency|entrance exam/i },
  { name: 'Study Plan, CV & Research Proposal', matches: /study plan|research proposal|personal statement|motivation|portfolio|publication|research paper|\bCV\b|curriculum vitae|resume|résumé/i },
  { name: 'Recommendation Letters', matches: /recommendation|reference letter|referee|supervisor|professor|acceptance letter/i },
  { name: 'Medical & Physical Examination', matches: /physical examination|medical|health|examination form/i },
  { name: 'Bank Statement & Financial Proof', matches: /financial|bank|sponsor|funding|guarantee|solvency|income/i },
  { name: 'Police Clearance & Background Check', matches: /criminal|police|conduct|background check/i },
];

function groupDocuments(documents: string[]): DocumentGroup[] {
  const groups = categories.map((category) => ({ name: category.name, documents: [] as string[] }));
  const additional: DocumentGroup = { name: 'Additional Application Forms', documents: [] };

  for (const document of documents) {
    if (!document.trim()) continue;
    const specificIndex = categories.findIndex((category, index) => index > 0 && category.matches.test(document));
    const index = specificIndex >= 0 ? specificIndex : categories[0].matches.test(document) ? 0 : -1;
    (index >= 0 ? groups[index] : additional).documents.push(document);
  }

  return [...groups, additional].filter((group) => group.documents.length > 0);
}

export default function UniversityDocuments({
  documents,
  programName,
  applyHref,
}: {
  documents: string[];
  programName: string;
  applyHref: string;
}) {
  const groups = groupDocuments(documents);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-200/80 bg-emerald-50/50 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <FileCheck2 size={18} className="text-emerald-700 shrink-0" />
          <p className="text-xs sm:text-sm font-medium text-slate-700">
            Showing required document checklist for:{' '}
            <strong className="font-bold text-petrol-800">{programName}</strong>{' '}
            <span className="text-slate-500">({documents.length} required items)</span>
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
          Verified Dossier Format
        </span>
      </div>

      {groups.length > 0 ? (
        <div className="grid items-stretch gap-4 sm:grid-cols-2">
          {groups.map((group, groupIdx) => (
            <section
              key={group.name}
              className={`rounded-2xl border border-slate-200/90 bg-slate-50/60 p-5 transition-colors hover:bg-white hover:border-emerald-300 ${
                group.documents.some((document) => document.length > 260) ? 'sm:col-span-2' : ''
              }`}
            >
              <div className="flex items-center gap-2.5 border-b border-slate-200/80 pb-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-petrol-800 text-[11px] font-bold text-white">
                  {groupIdx + 1}
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-petrol-800">{group.name}</h3>
              </div>
              <ul className="mt-3.5 space-y-2.5">
                {group.documents.map((document, index) => (
                  <li key={`${index}-${document}`} className="flex items-start gap-2.5 text-xs sm:text-sm leading-6 text-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-1" />
                    <span>{document}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm leading-7 text-slate-600">
            Standard international admission documents apply (Passport, Academic Certificates & Transcripts, Photo, Medical Form, and Police Clearance). Contact our counselors for the exact checklist for your intake.
          </p>
        </div>
      )}

      {/* Practical Preparation Tips for Bangladeshi Students */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck size={20} className="text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Document Preparation Tips for Bangladeshi Applicants
            </h4>
            <ul className="mt-2 grid gap-2 text-xs leading-5 text-slate-600 sm:grid-cols-2">
              <li>• Ensure your name and parents’ names match exactly across your Passport, SSC, and HSC/Bachelor certificates.</li>
              <li>• Scan original color documents at 300 DPI (PDF/JPG) — mobile phone shadows or cropped edges can delay university review.</li>
              <li>• Passport must have at least 12–18 months validity remaining from the intended intake date.</li>
              <li>• EduExpress counselors review and format your entire application file free of charge before university portal submission.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-petrol-800 p-5 sm:flex-row sm:items-center text-white">
        <div>
          <h4 className="text-sm font-bold text-white">Want a free document check before applying?</h4>
          <p className="mt-0.5 text-xs leading-5 text-white/80">
            Send your transcripts to our Dhaka counseling team for a same-day eligibility and document verification.
          </p>
        </div>
        <Link
          href={applyHref}
          className="ed-btn ed-btn-signal min-h-[42px] px-5 text-xs font-bold shrink-0"
        >
          Verify My Documents <ArrowRight size={14} className="shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
