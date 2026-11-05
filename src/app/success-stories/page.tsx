import { serializeJsonLd } from '@/lib/json-ld';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CameraOff, FileCheck2, LockKeyhole, Quote, ShieldCheck, UserRoundCheck } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
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
    <article className="bg-[#ffffff] pt-[76px] text-ed-ink min-[1200px]:pt-[104px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <header className="relative overflow-hidden border-b border-rule bg-chalk">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 -top-20 size-[380px] rounded-full bg-sky-400/20 blur-[100px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-shell px-4 pb-12 pt-[104px] sm:px-6 lg:px-10 lg:pb-16 lg:pt-[142px]">
          <Breadcrumbs items={[{ name: 'Success stories' }]} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-end">
            <div>
              <p className="ed-label">Proof with permission</p>
              <h1 className="ed-home-display mt-4 max-w-[16ch] text-[clamp(2.4rem,4.4vw,3.9rem)] text-ink">
                Student success stories
              </h1>
              <p className="mt-4 max-w-[58ch] text-[14.5px] leading-7 text-ink-soft">
                A real story explains the student profile, options considered, university decision, timeline, EduExpress service and cost responsibility. Passport numbers, birth dates and visa identifiers never belong on this page.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-rule bg-rule shadow-[0_22px_50px_-44px_rgba(15,53,87,0.45)]">
              <div className="bg-white p-6">
                <dd className="ed-numeral text-[38px] text-petrol-700">{stories.length}</dd>
                <dt className="mt-2 text-[11.5px] leading-4 text-ink-mute">Stories ready to publish</dt>
              </div>
              <div className="bg-white p-6">
                <dd className="ed-numeral text-[38px] text-petrol-700">{pendingCount}</dd>
                <dt className="mt-2 text-[11.5px] leading-4 text-ink-mute">Records awaiting completion</dt>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <section className="border-b border-[#12436b]/10 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-[#12436b]/15 sm:grid-cols-3">
          {[
            { icon: UserRoundCheck, title: 'Individual cases', text: 'Each story describes one student’s profile, decision and timeline.' },
            { icon: FileCheck2, title: 'Service scope', text: 'Each story states what EduExpress provided and who paid for it.' },
            { icon: LockKeyhole, title: 'Sensitive data removed', text: 'Passport numbers, birth dates and visa identifiers are never shown.' },
          ].map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4 bg-white p-5"><span className="grid size-10 shrink-0 place-items-center bg-ed-sky/12 text-ed-navy"><Icon size={20} /></span><div><strong className="text-sm">{title}</strong><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-14 sm:px-8 lg:px-12 lg:py-20">
        {stories.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {stories.map(story => (
              <article key={story.id} className="overflow-hidden border border-[#12436b]/20 bg-white">
                <div className="grid sm:grid-cols-[11rem_1fr]">
                  <div className="relative min-h-44 bg-ed-navy text-white">
                    {story.image ? <Image src={story.image} alt={`${story.displayName || story.name}, EduExpress student story`} fill sizes="(max-width:640px) 100vw, 176px" className="object-cover" /> : <div className="flex h-full min-h-44 flex-col items-center justify-center p-5 text-center"><CameraOff size={27} className="text-ed-mist" /><p className="mt-3 text-[10px] leading-5 text-white/55">Photo not approved for public display</p></div>}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-emerald-700"><BadgeCheck size={13} />Student story</div>
                    <h2 className="mt-3 ed-home-display text-2xl leading-[1.05]">{story.displayName || story.name}</h2>
                    <p className="mt-2 text-sm font-bold text-ed-navy">{story.program}</p>
                    <p className="mt-1 text-xs text-slate-500">{story.university} <span aria-hidden="true">•</span> {story.location}</p>
                    <blockquote className="mt-5 border-l-4 border-[#a9d6ee] pl-4 text-sm leading-6 text-slate-600"><Quote size={15} className="mb-2 text-ed-navy" />{story.quote}</blockquote>
                  </div>
                </div>
                <div className="grid border-t border-[#12436b]/10 sm:grid-cols-2">
                  {[
                    ['Profile and constraints', story.academicProfile],
                    ['Decision and options', story.decisionFactors],
                    ['Application and visa timeline', story.applicationTimeline],
                    ['EduExpress service', story.serviceProvided],
                    ['Student payment record', story.studentPaid],
                    ['Current update', story.currentUpdate || 'Arrival update not yet recorded.'],
                  ].filter(([, value]) => Boolean(value)).map(([label, value]) => <div key={label} className="border-b border-r border-[#12436b]/10 p-4"><h3 className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-ed-navy">{label}</h3><p className="mt-2 text-xs leading-5 text-slate-600">{value}</p></div>)}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid overflow-hidden border border-[#12436b]/20 bg-white lg:grid-cols-[.42fr_.58fr]">
            <div className="flex min-h-80 flex-col justify-between bg-ed-navy p-7 text-white sm:p-10">
              <ShieldCheck size={34} className="text-ed-mist" />
              <div><p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-ed-mist">Publication gate active</p><h2 className="mt-4 ed-home-display text-3xl leading-[1.05] sm:text-[2.4rem]">New student stories are on their way</h2></div>
            </div>
            <div className="p-7 sm:p-10">
              <p className="text-sm leading-7 text-slate-600">{totalActive} testimonial record{totalActive === 1 ? ' is' : 's are'} on file. Stories appear here once their profile, decision, timeline, service scope and payment details are complete.</p>
              <h3 className="mt-7 ed-home-display text-xl font-bold">Why this is better than publishing a quote alone</h3>
              <ul className="mt-4 grid gap-3 text-sm text-slate-600">
                {['The student controls their public name and photo', 'Sensitive identifiers remain redacted', 'Readers can understand the decision and the outcome', 'Every result is presented as an individual case'].map(item => <li key={item} className="flex gap-3"><BadgeCheck size={16} className="mt-1 shrink-0 text-ed-navy" />{item}</li>)}
              </ul>
              <Link href="/education-fit-assessment" className="mt-7 inline-flex min-h-12 items-center gap-2 bg-[#12436b] px-5 text-sm font-black text-white">Get an Education Fit Assessment <ArrowRight size={16} /></Link>
            </div>
          </div>
        )}
      </section>

      <section className="border-y border-[#12436b]/10 bg-ed-sky/12">
        <div className="mx-auto max-w-[1440px] px-5 py-10 text-xs leading-6 text-slate-600 sm:px-8 lg:px-12">
          <p><strong className="text-ed-ink">Editorial owner:</strong> EduExpress Admissions Desk <span aria-hidden="true">•</span> <strong className="text-ed-ink">Consent reviewer:</strong> EduExpress Content and Compliance</p>
          <p><strong className="text-ed-ink">Publishing standard:</strong> Sensitive data redaction and a complete story record</p>
        </div>
      </section>
    </article>
  );
}
