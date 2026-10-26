import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, LockKeyhole, ShieldCheck } from 'lucide-react';
import prisma from '@/lib/prisma';

const canonical = 'https://eduexpressint.com/china-success-stories';

async function getChinaStoryCount() {
  try {
    return await prisma.testimonial.count({
      where: {
        country: { contains: 'China' },
        isPublished: true,
      },
    });
  } catch {
    return 0;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const count = await getChinaStoryCount();
  return {
    title: { absolute: 'China Student Success Stories | EduExpress International' },
    description: 'Consent-based China student outcomes with evidence records and sensitive details redacted.',
    alternates: { canonical },
    robots: { index: count > 0, follow: true },
    openGraph: { title: 'China Student Success Stories', description: 'Proof with permission and privacy controls.', url: canonical, type: 'website' },
  };
}

export default async function ChinaSuccessStoriesPage() {
  const count = await getChinaStoryCount();
  return (
    <article className="min-h-screen bg-[#f4f8fa] px-5 pb-20 pt-32 text-[#08263c] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1100px]">
        <nav aria-label="Breadcrumb" className="text-xs font-bold text-[#174f7a]"><Link href="/">Home</Link> <span aria-hidden>/</span> <Link href="/study-in-china-from-bangladesh">Study in China</Link> <span aria-hidden>/</span> Success stories</nav>
        <header className="mt-8 overflow-hidden rounded-[2rem] bg-[#08263c] p-7 text-white sm:p-10 lg:p-14">
          <p className="text-xs font-black uppercase tracking-[.16em] text-[#8ed0ee]">Proof with permission</p>
          <h1 className="mt-4 max-w-4xl font-heading text-4xl font-bold sm:text-6xl">China student success stories</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/70">Every published story requires a real student record, written consent, an approved photo, service and payment details, and privacy-safe evidence.</p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[['Written consent', 'The student controls their public name, photo and story scope.'], ['Evidence record', 'Offer and timeline facts are checked before publication.'], ['Privacy control', 'Passport, birth date and visa identifiers never appear publicly.']].map(([title, text], index) => <div key={title} className="rounded-2xl border border-[#174f7a]/15 bg-white p-5">{index === 0 ? <BadgeCheck className="text-[#174f7a]" /> : index === 1 ? <ShieldCheck className="text-[#174f7a]" /> : <LockKeyhole className="text-[#174f7a]" />}<h2 className="mt-4 font-heading text-xl font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}
        </section>

        <section className="mt-8 rounded-[2rem] border border-[#174f7a]/15 bg-white p-7 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[.14em] text-[#174f7a]">Publication status</p>
          <h2 className="mt-3 font-heading text-3xl font-bold">{count > 0 ? `${count} consent-approved China stories are ready` : 'No China story is public until its consent record is complete'}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">The public proof library remains available for privacy-safe admission notices and JW202 evidence. Student stories are a separate consent-controlled record.</p>
          <div className="mt-6 flex flex-wrap gap-3"><Link href="/proof-library" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#08263c] px-5 text-sm font-black text-white">Inspect the proof library <ArrowRight size={15} /></Link><Link href="/education-fit-assessment" className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-[#08263c] px-5 text-sm font-black">Get my free assessment <ArrowRight size={15} /></Link></div>
        </section>
      </div>
    </article>
  );
}
