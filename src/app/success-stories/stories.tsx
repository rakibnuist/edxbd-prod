import 'server-only';

import type { Prisma } from '@prisma/client';
import { FileCheck2, LockKeyhole, UserRoundCheck } from 'lucide-react';
import StoryCardView from '@/components/stories/StoryCard';
import { kit } from '@/components/page/PageKit';
import prisma from '@/lib/prisma';
import { withPublicTestimonials } from '@/lib/testimonial-visibility';

/** Shared by /success-stories and /china-success-stories. */

export type PublicStory = {
  id: string;
  name: string;
  location: string;
  country: string;
  rating: number;
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
      location: record.location || '',
      country: record.country || '',
      rating: record.rating || 5,
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
  { icon: UserRoundCheck, title: 'A real, individual case', text: 'One student, one route. A story shows their own university, program and words, not a promise for anyone else.' },
  { icon: FileCheck2, title: 'Service and cost made clear', text: 'Where a story covers it, it states what EduExpress provided and who paid for what.' },
  { icon: LockKeyhole, title: 'Private data removed', text: 'Passport numbers, birth dates, visa identifiers, contact and payment details never appear publicly.' },
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
  return (
    <StoryCardView
      story={{
        ...story,
        facts: [
          ['Profile and constraints', story.academicProfile],
          ['Decision and options', story.decisionFactors],
          ['Application and visa timeline', story.applicationTimeline],
          ['EduExpress service', story.serviceProvided],
          ['Who paid what', story.studentPaid],
          ['Where they are now', story.currentUpdate],
        ],
      }}
    />
  );
}
