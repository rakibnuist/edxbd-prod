import 'server-only';

import Image from 'next/image';
import type { Prisma } from '@prisma/client';
import { BadgeCheck, CameraOff, FileCheck2, LockKeyhole, UserRoundCheck } from 'lucide-react';
import { kit } from '@/components/page/PageKit';
import prisma from '@/lib/prisma';
import { withPublicTestimonials } from '@/lib/testimonial-visibility';

/** Shared by /success-stories and /china-success-stories. */

export type PublicStory = {
  id: string;
  name: string;
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
};

/** Publicly visible stories (published, not taken down), optionally narrowed (e.g. to China). Fails closed to an empty list. */
export async function getPublishedStories(where: Prisma.TestimonialWhereInput = {}): Promise<PublicStory[]> {
  try {
    const records = await prisma.testimonial.findMany({
      where: withPublicTestimonials(where),
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });
    return records.map(record => ({
      id: record.id,
      name: record.displayName || record.studentName,
      location: record.location || record.country || '',
      university: record.university || '',
      program: record.program || '',
      quote: record.content,
      image: record.image || undefined,
      academicProfile: record.academicProfile || undefined,
      decisionFactors: record.decisionFactors || undefined,
      applicationTimeline: record.applicationTimeline || undefined,
      serviceProvided: record.serviceProvided || undefined,
      studentPaid: record.studentPaid || undefined,
      currentUpdate: record.currentUpdate || undefined,
    }));
  } catch (error) {
    console.error('Story evidence unavailable:', error);
    return [];
  }
}

/** The publishing standard every story is held to, shown on both story pages. */
export const storyStandards = [
  { icon: UserRoundCheck, title: 'Private data removed', text: 'Passport, visa, contact and payment details are never shown with a story.' },
  { icon: FileCheck2, title: 'Service scope and payment', text: 'Each story states what EduExpress provided and who paid for it.' },
  { icon: LockKeyhole, title: 'Sensitive data removed', text: 'Passport numbers, birth dates and visa identifiers never appear publicly.' },
];

export function StandardsGrid() {
  return (
    <ul data-anim="stagger" className="grid gap-5 md:grid-cols-3">
      {storyStandards.map(item => (
        <li key={item.title} className={kit.cardSage}>
          <span className={kit.icon}><item.icon size={22} aria-hidden="true" /></span>
          <h3 className={`mt-6 ${kit.h3}`}>{item.title}</h3>
          <p className="mt-2 text-[16px] leading-7 text-ink-soft">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function StoryCard({ story }: { story: PublicStory }) {
  const facts: [string, string | undefined][] = [
    ['Profile and constraints', story.academicProfile],
    ['Decision and options', story.decisionFactors],
    ['Application and visa timeline', story.applicationTimeline],
    ['EduExpress service', story.serviceProvided],
    ['Student payment record', story.studentPaid],
    ['Current update', story.currentUpdate || 'Arrival update not yet recorded.'],
  ];
  const place = [story.university, story.location].filter(Boolean).join(' · ');

  return (
    <article className="overflow-hidden rounded-3xl bg-white">
      <div className="grid sm:grid-cols-[180px_1fr]">
        <div className="relative min-h-[200px] bg-petrol-800">
          {story.image ? (
            <Image src={story.image} alt={`${story.name}, EduExpress student`} fill sizes="(max-width:640px) 100vw, 180px" className="object-cover" />
          ) : (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 p-5 text-center">
              <span className={kit.iconLime}><CameraOff size={20} aria-hidden="true" /></span>
              <p className="text-[14px] leading-5 text-white/80">Photo not approved for public display</p>
            </div>
          )}
        </div>
        <div className="p-6 sm:p-7">
          <p className={kit.badge}><BadgeCheck size={15} aria-hidden="true" /> Student story</p>
          <h3 className="mt-4 font-display text-[28px] font-black leading-none tracking-[-0.01em] text-petrol-800">{story.name}</h3>
          {story.program && <p className="mt-3 text-[16px] font-semibold text-petrol-800">{story.program}</p>}
          {place && <p className="mt-1 text-[14px] text-ink-soft">{place}</p>}
          <blockquote className="mt-5 border-l-4 border-lime pl-4 text-[16px] leading-7 text-ink-soft">&ldquo;{story.quote}&rdquo;</blockquote>
        </div>
      </div>
      <dl className="grid border-t border-canvas-soft sm:grid-cols-2">
        {facts.filter(([, value]) => Boolean(value)).map(([label, value]) => (
          <div key={label} className="border-b border-canvas-soft p-5 sm:odd:border-r">
            <dt className="text-[14px] font-semibold text-petrol-800">{label}</dt>
            <dd className="mt-1 text-[15px] leading-6 text-ink-soft">{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
