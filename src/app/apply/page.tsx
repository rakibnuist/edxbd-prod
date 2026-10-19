import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';

type SearchParams = Record<string, string | string[] | undefined>;
type Props = { searchParams: Promise<SearchParams> };

function contextValue(value: string | string[] | undefined, limit = 220) {
  return (Array.isArray(value) ? value[0] : value)?.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, limit) || undefined;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = await searchParams;
  return {
    title: { absolute: 'Apply with EduExpress International | University Application Support' },
    description: 'Start your university application with EduExpress International. Share your preferred university, program and academic profile for eligibility, document and application support.',
    alternates: { canonical: '/apply' },
    robots: Object.keys(query).length > 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      title: 'Apply with EduExpress International',
      description: 'University application support, starting with your academic profile and study preferences.',
      url: '/apply',
      type: 'website',
    },
  };
}

export default async function ApplyPage({ searchParams }: Props) {
  const query = await searchParams;
  const university = contextValue(query.university);
  const program = contextValue(query.program, 300);
  const country = contextValue(query.country, 80);

  return <main className="min-h-screen bg-[#f6f8fa] px-5 pb-20 pt-28 text-[#102b40] sm:px-8 xl:pt-40">
    <div className="mx-auto max-w-[1000px]">
      <Link href="/universities" className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-[#174f7a]"><ArrowLeft size={15} />Explore universities</Link>
      <header className="mb-8 mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#287465]">University applications</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Apply with EduExpress International</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">Share your academic background and study preferences. Our counselors can help you check eligibility, prepare documents and plan your university application.</p>
        {(university || program || country) && <dl className="mt-7 grid gap-5 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2 sm:p-6">
          {university && <div className="sm:col-span-2"><dt className="text-xs font-medium text-slate-500">Preferred university</dt><dd className="mt-1.5 text-base font-semibold">{university}</dd></div>}
          {program && <div><dt className="text-xs font-medium text-slate-500">Selected program</dt><dd className="mt-1.5 text-sm leading-6 text-slate-700">{program}</dd></div>}
          {country && <div><dt className="text-xs font-medium text-slate-500">Destination</dt><dd className="mt-1.5 text-sm leading-6 text-slate-700">{country}</dd></div>}
        </dl>}
      </header>
      <EducationFitAssessment key={JSON.stringify([university, program, country])} initialContext={{ university, program, country, intent: 'application' }} />
      <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-6 text-slate-500">This form requests application support from EduExpress International. Admission and scholarship decisions are made by the university and the relevant awarding body.</p>
    </div>
  </main>;
}
