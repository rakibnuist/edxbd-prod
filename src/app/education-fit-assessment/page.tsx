import type { Metadata } from 'next';
import Link from 'next/link';
import EducationFitAssessment from '@/components/assessment/EducationFitAssessment';

export const metadata: Metadata = {
  title: { absolute: 'Free Education Fit Assessment | EduExpress International' },
  description:
    'Get a free, written Education Fit Assessment. Share your results, budget, intake and goals — we compare suitable study-abroad routes, risks and missing information before you commit.',
  alternates: { canonical: '/education-fit-assessment' },
  openGraph: {
    title: 'Free Education Fit Assessment | EduExpress International',
    description: 'Compare before you commit. A written read on your suitable routes, risks and next step.',
    url: '/education-fit-assessment',
    type: 'website',
  },
};

const promises = [
  'We compare at least three suitable routes and explain why each is recommended or set aside.',
  'We separate university, embassy and third-party costs from EduExpress charges — in writing.',
  'No file-opening charge, and no EduExpress service fee before China visa approval.',
];

export default function EducationFitAssessmentPage() {
  return (
    <div className="bg-[#f4f8fa] text-[#08263c]">
      <section className="relative overflow-hidden bg-[#08263c] px-5 pb-16 pt-28 text-white sm:px-8 sm:pt-32 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(100,181,223,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(100,181,223,0.07)_1px,transparent_1px)] bg-[size:58px_58px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="relative mx-auto max-w-[1440px]">
          <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs uppercase tracking-[0.18em] text-white/50">
            <Link href="/">Home</Link> <span aria-hidden> / </span> Education Fit Assessment
          </nav>
          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#8ed0ee]">The Free Education Fit Assessment</p>
              <h1 className="mt-5 max-w-2xl font-heading text-4xl font-bold leading-[1.06] tracking-tight md:text-6xl">
                Compare before you commit — with a written read on your fit
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/70 md:text-lg">
                Share a few details about your results, budget, intake and goals. We return the suitable routes for you,
                the risks to weigh, and the information we still need — before any money or application is involved.
              </p>
            </div>
            <ul className="grid gap-3">
              {promises.map((p) => (
                <li key={p} className="border-l-4 border-[#64b5df] bg-white/5 p-4 text-sm leading-6 text-white/80">{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <EducationFitAssessment />
        </div>
      </section>
    </div>
  );
}
