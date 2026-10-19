import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type DocumentGroup = {
  name: string;
  documents: string[];
};

const categories: { name: string; matches: RegExp }[] = [
  { name: 'Identity & personal details', matches: /passport|photograph|\bphoto\b|identity|birth certificate|guardian|nationality/i },
  { name: 'Academic records', matches: /diploma|degree certificate|graduation|transcript|academic record|school certificate|(?:highest|academic) qualification certificate|predicted grade|\bSSC\b|\bHSC\b/i },
  { name: 'Language & entrance results', matches: /\bHSK\b|\bHSKK\b|\bIELTS\b|\bTOEFL\b|\bCSCA\b|language|medium.of.instruction|proficiency|entrance exam/i },
  { name: 'Study plan & academic work', matches: /study plan|research proposal|personal statement|motivation|portfolio|publication|research paper|\bCV\b|curriculum vitae|resume|résumé/i },
  { name: 'References & recommendations', matches: /recommendation|reference letter|referee|supervisor|professor|acceptance letter/i },
  { name: 'Health documents', matches: /physical examination|medical|health|examination form/i },
  { name: 'Financial evidence', matches: /financial|bank|sponsor|funding|guarantee|solvency|income/i },
  { name: 'Background records', matches: /criminal|police|conduct|background check/i },
];

function groupDocuments(documents: string[]): DocumentGroup[] {
  const groups = categories.map(category => ({ name: category.name, documents: [] as string[] }));
  const additional: DocumentGroup = { name: 'Additional application documents', documents: [] };

  for (const document of documents) {
    if (!document.trim()) continue;
    // Identity words also appear inside bank statements and medical forms.
    // Prefer the document's specific purpose before the general identity group.
    const specificIndex = categories.findIndex((category, index) => index > 0 && category.matches.test(document));
    const index = specificIndex >= 0 ? specificIndex : categories[0].matches.test(document) ? 0 : -1;
    (index >= 0 ? groups[index] : additional).documents.push(document);
  }

  return [...groups, additional].filter(group => group.documents.length > 0);
}

export default function UniversityDocuments({ documents, programName, applyHref }: {
  documents: string[];
  programName: string;
  applyHref: string;
}) {
  const groups = groupDocuments(documents);

  return <div className="space-y-6">
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold tracking-tight text-[#102b40]">Your admission checklist</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">Prepare your admission documents for <strong className="font-medium text-slate-800">{programName}</strong>, whether you apply as a self-funded student or through a scholarship.</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">This checklist follows your selected program. A scholarship may require additional supporting evidence.</p>
    </div>

    {groups.length > 0 ? <div className="grid items-start gap-4 sm:grid-cols-2">
      {groups.map(group => <section key={group.name} className={`rounded-lg bg-[#f5f8fa] p-5 ${group.documents.some(document => document.length > 280) ? 'sm:col-span-2' : ''}`}>
        <h4 className="text-sm font-semibold leading-6 text-[#102b40]">{group.name}</h4>
        <div className="mt-3 space-y-3">{group.documents.map((document, index) => <p key={`${index}-${document}`} className="text-sm leading-7 text-slate-600">{document}</p>)}</div>
      </section>)}
    </div> : <div className="rounded-lg bg-[#f5f8fa] p-5"><p className="text-sm leading-7 text-slate-600">The document checklist for this program has not been specified. EduExpress International can help you confirm which documents to prepare.</p></div>}

    <div className="flex flex-col items-start justify-between gap-4 rounded-lg bg-[#eaf2f6] p-5 sm:flex-row sm:items-center">
      <div><h3 className="text-sm font-semibold text-[#102b40]">Ready to prepare your application?</h3><p className="mt-1 text-sm leading-6 text-slate-600">Get help reviewing your documents and chosen study route.</p></div>
      <Link href={applyHref} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#174f7a] px-4 py-2.5 text-center text-xs font-semibold text-white transition-colors hover:bg-[#103d60] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174f7a] sm:w-auto sm:text-sm">Apply with EduExpress International<ArrowRight size={16} className="shrink-0" aria-hidden="true" /></Link>
    </div>
  </div>;
}
