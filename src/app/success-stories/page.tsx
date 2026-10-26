import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CameraOff, FileCheck2, LockKeyhole, Quote, ShieldCheck, UserRoundCheck } from 'lucide-react';
import prisma from '@/lib/prisma';

const canonical = 'https://eduexpressint.com/success-stories';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Student Success Stories | EduExpress' },
  description: 'Read student stories with profiles, decisions, timelines, service scope and payment details.',
  alternates: { canonical },
  openGraph: {
    title: 'Student Success Stories',
    description: 'Education outcomes from EduExpress students.',
    url: canonical,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — Better Education. Clear Costs. Written Proof.' }],
  },
};

type PublicStory = {
  id: string;
  name: string;
  displayName?: string;
  location: string;
  university: string;
  program: string;
  quote: string;
  image?: string;
  academicProfile?: string;
  decisionFactors?: string;
  applicationTimeline?: string;
  serviceProvided?: string;
  studentPaid?: string;
  currentUpdate?: string;
  consentEvidenceId?: string;
  consentExpiresAt?: string;
  consentImageApproved?: boolean;
};

async function getStoryData() {
  try {
    const records = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }]
    });

    const totalRecords = await prisma.testimonial.count();

    const serialized: PublicStory[] = records.map(r => ({
      id: r.id,
      name: r.studentName,
      displayName: r.displayName || r.studentName,
      location: r.location || r.country || '',
      university: r.university || '',
      program: r.program || '',
      quote: r.content,
      image: r.image || undefined,
      academicProfile: r.academicProfile || undefined,
      decisionFactors: r.decisionFactors || undefined,
      applicationTimeline: r.applicationTimeline || undefined,
      serviceProvided: r.serviceProvided || undefined,
      studentPaid: r.studentPaid || undefined,
      currentUpdate: r.currentUpdate || undefined,
      consentEvidenceId: r.consentEvidenceId || undefined,
      consentExpiresAt: r.consentExpiresAt?.toISOString(),
      consentImageApproved: r.consentImageApproved,
    }));

    return { stories: serialized, pendingCount: 0, totalActive: totalRecords };
  } catch (error) {
    console.error('Story evidence unavailable:', error);
    return { stories: [] as PublicStory[], pendingCount: 0, totalActive: 0 };
  }
}

export default async function SuccessStoriesPage() {
  const { stories, pendingCount, totalActive } = await getStoryData();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonical}#page`,
    url: canonical,
    name: 'Student Success Stories',
    description: 'Education stories from EduExpress students.',
    dateModified: '2026-07-19',
    inLanguage: 'en-BD',
    mainEntity: { '@type': 'ItemList', numberOfItems: stories.length, itemListElement: stories.map((story, index) => ({ '@type': 'ListItem', position: index + 1, name: `${story.displayName || story.name}: ${story.program} at ${story.university}` })) },
  };

  return (
    <article className="bg-[#f6f9fb] pt-[76px] text-[#08263c] min-[1200px]:pt-[104px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="relative overflow-hidden bg-[#08263c] text-white">
        <div className="pointer-events-none absolute left-[-2rem] top-[-2rem] hidden md:block size-[28rem] opacity-15">
          <Image src="/emblem-icon.png" width={450} height={450} alt="" className="h-auto w-full object-contain filter brightness-0 invert" />
        </div>
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 lg:px-12 lg:grid-cols-[.66fr_.34fr] lg:items-end lg:py-16">
          <div>
            <nav className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/50" aria-label="Breadcrumb"><Link href="/">Home</Link> <span aria-hidden="true">/</span> Success stories</nav>
            <p className="mt-8 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Proof with permission</p>
            <h1 className="mt-4 max-w-4xl text-balance font-heading text-4xl font-bold leading-tight sm:text-6xl">Student Success Stories</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/70">A real story should explain the student profile, options considered, university decision, timeline, EduExpress service and cost responsibility. Passport numbers, birth dates and visa identifiers never belong on this page.</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/15">
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">{stories.length}</strong><span className="mt-2 block text-xs text-white/55">Stories ready to publish</span></div>
            <div className="bg-[#08263c] p-5"><strong className="font-heading text-4xl text-[#8ed0ee]">{pendingCount}</strong><span className="mt-2 block text-xs text-white/55">Records awaiting completion</span></div>
          </div>
        </div>
      </header>

      <section className="border-b border-[#174f7a]/15 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-[#174f7a]/15 sm:grid-cols-3">
          {[
            { icon: UserRoundCheck, title: 'Individual cases', text: 'Each story describes one student’s profile, decision and timeline.' },
            { icon: FileCheck2, title: 'Service scope', text: 'Each story states what EduExpress provided and who paid for it.' },
            { icon: LockKeyhole, title: 'Sensitive data removed', text: 'Passport numbers, birth dates and visa identifiers are never shown.' },
          ].map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4 bg-white p-5"><span className="grid size-10 shrink-0 place-items-center bg-[#e9f7fd] text-[#174f7a]"><Icon size={20} /></span><div><strong className="text-sm">{title}</strong><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-14 sm:px-8 lg:px-12 lg:py-20">
        {stories.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {stories.map(story => (
              <article key={story.id} className="overflow-hidden border border-[#174f7a]/20 bg-white">
                <div className="grid sm:grid-cols-[11rem_1fr]">
                  <div className="relative min-h-44 bg-[#08263c] text-white">
                    {story.image ? <Image src={story.image} alt={`${story.displayName || story.name}, EduExpress student story`} fill sizes="(max-width:640px) 100vw, 176px" className="object-cover" /> : <div className="flex h-full min-h-44 flex-col items-center justify-center p-5 text-center"><CameraOff size={27} className="text-[#8ed0ee]" /><p className="mt-3 text-[10px] leading-5 text-white/55">Photo not approved for public display</p></div>}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-emerald-700"><BadgeCheck size={13} />Student story</div>
                    <h2 className="mt-3 font-heading text-2xl font-bold">{story.displayName || story.name}</h2>
                    <p className="mt-2 text-sm font-bold text-[#174f7a]">{story.program}</p>
                    <p className="mt-1 text-xs text-slate-500">{story.university} <span aria-hidden="true">•</span> {story.location}</p>
                    <blockquote className="mt-5 border-l-4 border-[#64b5df] pl-4 text-sm leading-6 text-slate-600"><Quote size={15} className="mb-2 text-[#174f7a]" />{story.quote}</blockquote>
                  </div>
                </div>
                <div className="grid border-t border-[#174f7a]/15 sm:grid-cols-2">
                  {[
                    ['Profile and constraints', story.academicProfile],
                    ['Decision and options', story.decisionFactors],
                    ['Application and visa timeline', story.applicationTimeline],
                    ['EduExpress service', story.serviceProvided],
                    ['Student payment record', story.studentPaid],
                    ['Current update', story.currentUpdate || 'Arrival update not yet recorded.'],
                  ].filter(([, value]) => Boolean(value)).map(([label, value]) => <div key={label} className="border-b border-r border-[#174f7a]/15 p-4"><h3 className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-[#174f7a]">{label}</h3><p className="mt-2 text-xs leading-5 text-slate-600">{value}</p></div>)}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid overflow-hidden border border-[#174f7a]/20 bg-white lg:grid-cols-[.42fr_.58fr]">
            <div className="flex min-h-80 flex-col justify-between bg-[#08263c] p-7 text-white sm:p-10">
              <ShieldCheck size={34} className="text-[#8ed0ee]" />
              <div><p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Publication gate active</p><h2 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">New student stories are on their way</h2></div>
            </div>
            <div className="p-7 sm:p-10">
              <p className="text-sm leading-7 text-slate-600">{totalActive} testimonial record{totalActive === 1 ? ' is' : 's are'} on file. Stories appear here once their profile, decision, timeline, service scope and payment details are complete.</p>
              <h3 className="mt-7 font-heading text-xl font-bold">Why this is better than publishing a quote alone</h3>
              <ul className="mt-4 grid gap-3 text-sm text-slate-600">
                {['The student controls their public name and photo', 'Sensitive identifiers remain redacted', 'Readers can understand the decision and the outcome', 'Every result is presented as an individual case'].map(item => <li key={item} className="flex gap-3"><BadgeCheck size={16} className="mt-1 shrink-0 text-[#174f7a]" />{item}</li>)}
              </ul>
              <Link href="/education-fit-assessment" className="mt-7 inline-flex min-h-12 items-center gap-2 bg-[#174f7a] px-5 text-sm font-black text-white">Get an Education Fit Assessment <ArrowRight size={16} /></Link>
            </div>
          </div>
        )}
      </section>

      <section className="border-y border-[#174f7a]/15 bg-[#e9f7fd]">
        <div className="mx-auto max-w-[1440px] px-5 py-10 text-xs leading-6 text-slate-600 sm:px-8 lg:px-12">
          <p><strong className="text-[#08263c]">Editorial owner:</strong> EduExpress Admissions Desk <span aria-hidden="true">•</span> <strong className="text-[#08263c]">Consent reviewer:</strong> EduExpress Content and Compliance</p>
          <p><strong className="text-[#08263c]">Publishing standard:</strong> Sensitive data redaction and a complete story record</p>
        </div>
      </section>
    </article>
  );
}
