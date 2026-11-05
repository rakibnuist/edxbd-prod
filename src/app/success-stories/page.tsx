import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, ShieldCheck } from 'lucide-react';
import { CtaBand, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { pageMetadata } from '@/lib/seo';
import { StandardsGrid, StoryCard, getPublishedStories } from './stories';

const PATH = '/success-stories';
const canonical = `https://eduexpressint.com${PATH}`;

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Study Abroad Success Stories from Bangladesh | EduExpress',
  description:
    'Consent-based EduExpress student stories: the profile, options considered, university decision, timeline, service scope and who paid, with private data removed.',
  path: PATH,
});

const gateReasons = [
  'The student controls their public name and photo',
  'Sensitive identifiers remain redacted',
  'Readers can understand the decision and the outcome',
  'Every result is presented as an individual case',
];

export default async function SuccessStoriesPage() {
  const stories = await getPublishedStories();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonical}#page`,
    url: canonical,
    name: 'Student Success Stories',
    description: 'Consent-based education stories from EduExpress students.',
    dateModified: '2026-07-19',
    inLanguage: 'en-BD',
    isPartOf: { '@id': 'https://eduexpressint.com/#website' },
    about: { '@id': 'https://eduexpressint.com/#organization' },
    breadcrumb: { '@id': `${canonical}#breadcrumb` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: stories.length,
      itemListElement: stories.map((story, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: [story.name, [story.program, story.university].filter(Boolean).join(' at ')].filter(Boolean).join(': '),
      })),
    },
  };

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Success stories' }]}
        eyebrow="Proof with permission"
        title="Student success stories."
        lead="A real story explains the student profile, options considered, university decision, timeline, EduExpress service and cost responsibility. Passport numbers, birth dates and visa identifiers never belong on this page."
        actions={
          <>
            {stories.length > 0 ? (
              <a href="#stories" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                Read the stories <ArrowRight size={18} aria-hidden="true" />
              </a>
            ) : (
              <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                Get my free assessment <ArrowRight size={18} aria-hidden="true" />
              </Link>
            )}
            <Link href="/proof-library" className="ed-btn ed-btn-outline min-h-[52px] px-7">Inspect the proof library</Link>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/students/success-banner.webp"
                alt="Students and parents at Dhaka airport holding a banner: Finally we made our dream study in China with EduExpress International"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
              Departure day, Dhaka airport
            </figcaption>
          </figure>
        }
      />

      <TrustBar />

      <Section
        title="What every story must show."
        intro="Each story describes one student’s profile, decision and timeline, so a family can judge it as an individual case rather than a slogan."
      >
        <StandardsGrid />
        <dl className="mt-10 grid gap-4 border-t border-canvas-soft pt-6 text-[15px] leading-6 text-ink-soft sm:grid-cols-3">
          <div><dt className="font-semibold text-petrol-800">Editorial owner</dt><dd>EduExpress Admissions Desk</dd></div>
          <div><dt className="font-semibold text-petrol-800">Consent reviewer</dt><dd>EduExpress Content and Compliance</dd></div>
          <div><dt className="font-semibold text-petrol-800">Publishing standard</dt><dd>Sensitive data redaction and a complete story record</dd></div>
        </dl>
      </Section>

      <Section
        tone="sage"
        id="stories"
        title={stories.length ? 'Published student stories.' : 'New student stories are on their way.'}
        intro={
          stories.length
            ? 'Each story was published with the student’s permission. Results are individual and do not predict another student’s outcome.'
            : 'Stories appear here once their profile, decision, timeline, service scope and payment details are complete. We would rather show nothing than a quote without context.'
        }
      >
        {stories.length ? (
          <div data-anim="stagger" className="grid gap-6 lg:grid-cols-2">
            {stories.map(story => <StoryCard key={story.id} story={story} />)}
          </div>
        ) : (
          <div data-anim="stagger" className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
            <article className={`${kit.cardDark} flex flex-col justify-between gap-10`}>
              <span className={kit.iconLime}><ShieldCheck size={22} aria-hidden="true" /></span>
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.12em] text-white/70">Publication gate active</p>
                <h3 className="mt-3 font-display text-[30px] font-black leading-[1] text-lime">No story is published without a complete, consented record.</h3>
              </div>
            </article>
            <article className={kit.card}>
              <h3 className={kit.h3}>Why this is better than publishing a quote alone</h3>
              <ul className="mt-5 grid gap-3">
                {gateReasons.map(item => (
                  <li key={item} className="flex gap-3 text-[16px] leading-7 text-ink-soft">
                    <BadgeCheck size={18} className="mt-1 shrink-0 text-petrol-800" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/proof-library" className="ed-btn ed-btn-soft min-h-[48px] px-6">See published company records</Link>
                <Link href="/your-study-journey" className={`${kit.link} min-h-[48px]`}>How a student file moves <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </article>
          </div>
        )}
      </Section>

      <CtaBand
        title="Start your own file."
        text="Tell us your results, budget and preferred country. A counsellor reviews your profile and explains realistic options, the complete cost and the documents to prepare."
      />
    </>
  );
}
