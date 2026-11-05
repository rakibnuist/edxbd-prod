import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Star, Users } from 'lucide-react';
import { CtaBand, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { ogImage, pageMetadata } from '@/lib/seo';
import { StandardsGrid, StoryCard, getPublishedStories } from './stories';

const PATH = '/success-stories';
const canonical = `https://eduexpressint.com${PATH}`;

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Study Abroad Success Stories from Bangladesh | EduExpress',
  description:
    'Real EduExpress student stories: the profile, options considered, university decision, timeline, service scope and who paid, with private data removed.',
  path: PATH,
  image: ogImage('stories', 'Students and parents at Dhaka airport celebrating a study in China departure with EduExpress'),
});

export default async function SuccessStoriesPage() {
  const stories = await getPublishedStories();
  const universities = new Set(stories.map(story => story.university).filter(Boolean)).size;
  const countries = new Set(stories.map(story => story.country).filter(Boolean)).size;
  const rated = stories.filter(story => story.rating > 0);
  const average = rated.length ? rated.reduce((sum, story) => sum + story.rating, 0) / rated.length : 0;

  const summary = [
    { icon: Users, value: String(stories.length), label: stories.length === 1 ? 'student story' : 'student stories' },
    ...(universities ? [{ icon: GraduationCap, value: String(universities), label: universities === 1 ? 'university' : 'universities' }] : []),
    ...(average && rated.length >= 3 ? [{ icon: Star, value: `${average.toFixed(1)} / 5`, label: 'average student rating' }] : []),
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonical}#page`,
    url: canonical,
    name: 'Student Success Stories',
    description: 'Education stories from EduExpress students.',
    inLanguage: 'en-BD',
    isPartOf: { '@id': 'https://eduexpressint.com/#website' },
    about: { '@id': 'https://eduexpressint.com/#organization' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: stories.length,
      itemListElement: stories.map((story, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${canonical}#story-${story.id}`,
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
        eyebrow="Real students, real routes"
        title="Student success stories."
        lead="Bangladeshi students who studied abroad with EduExpress, in their own words: where they went, what they study and how the process went for them."
        actions={
          <>
            {stories.length > 0 ? (
              <a href="#stories" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                Read {stories.length} {stories.length === 1 ? 'story' : 'stories'} <ArrowRight size={18} aria-hidden="true" />
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

      <Section
        tone="sage"
        id="stories"
        title={stories.length ? 'In their own words.' : 'New student stories are on their way.'}
        intro={
          stories.length
            ? 'Each story is one student’s own case. Results are individual and do not predict another student’s outcome.'
            : 'We add new stories as students settle into their universities. Meanwhile, the proof library shows privacy-safe admission notices and company records.'
        }
      >
        {stories.length > 0 ? (
          <>
            <ul className="mb-10 flex flex-wrap gap-3">
              {summary.map(item => (
                <li key={item.label} className="inline-flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5">
                  <span className="grid size-10 place-items-center rounded-full bg-lime text-petrol-800"><item.icon size={18} aria-hidden="true" /></span>
                  <span className="text-[16px] text-ink-soft"><strong className="font-display text-[20px] font-black text-petrol-800">{item.value}</strong> {item.label}</span>
                </li>
              ))}
              {countries > 1 && (
                <li className="inline-flex items-center rounded-full bg-white px-5 py-2 text-[16px] text-ink-soft">
                  <strong className="mr-1.5 font-display text-[20px] font-black text-petrol-800">{countries}</strong> destination countries
                </li>
              )}
            </ul>
            <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
              {stories.map(story => (
                <div key={story.id} className="mb-6 break-inside-avoid">
                  <StoryCard story={story} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/proof-library" className="ed-btn ed-btn-signal min-h-[52px] px-7">See published company records</Link>
            <Link href="/your-study-journey" className="ed-btn ed-btn-outline min-h-[52px] px-7">How a student file moves</Link>
          </div>
        )}
      </Section>

      <TrustBar />

      <Section
        title="What every story protects."
        intro="Each story describes one student’s profile, decision and timeline, so a family can judge it as an individual case rather than a slogan."
      >
        <StandardsGrid />
        <dl className="mt-10 grid gap-4 border-t border-canvas-soft pt-6 text-[15px] leading-6 text-ink-soft sm:grid-cols-2">
          <div><dt className="font-semibold text-petrol-800">Editorial owner</dt><dd>EduExpress Admissions Desk</dd></div>
          <div><dt className="font-semibold text-petrol-800">Publishing standard</dt><dd>Sensitive data removed from every story</dd></div>
        </dl>
        <p className={`mt-6 ${kit.body}`}>
          Want to share your own story or update one? <Link href="/contact" className={kit.link}>Contact the admissions desk</Link>.
        </p>
      </Section>

      <CtaBand
        title="Start your own story."
        text="Tell us your results, budget and preferred country. A counsellor reviews your profile and explains realistic options, the complete cost and the documents to prepare."
      />
    </>
  );
}
