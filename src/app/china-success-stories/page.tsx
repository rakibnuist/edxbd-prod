import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, FileCheck2, ShieldCheck } from 'lucide-react';
import { CtaBand, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { pageMetadata } from '@/lib/seo';
import { StandardsGrid, StoryCard, getPublishedStories } from '../success-stories/stories';

const PATH = '/china-success-stories';
const canonical = `https://eduexpressint.com${PATH}`;

const getChinaStories = cache(() => getPublishedStories({ country: { contains: 'China' } }));

export async function generateMetadata() {
  const stories = await getChinaStories();
  return pageMetadata({
    title: 'China Student Success Stories | EduExpress International',
    description:
      'Consent-based stories from EduExpress students in China: profile, university choice, timeline, service scope and payment, with passport and visa data redacted.',
    path: PATH,
    // Unchanged rule: the page stays out of the index until at least one consented China story is public.
    noindex: stories.length === 0,
  });
}

export default async function ChinaSuccessStoriesPage() {
  const stories = await getChinaStories();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonical}#page`,
    url: canonical,
    name: 'China Student Success Stories',
    inLanguage: 'en-BD',
    isPartOf: { '@id': 'https://eduexpressint.com/#website' },
    about: { '@id': 'https://eduexpressint.com/#organization' },
    breadcrumb: { '@id': `${canonical}#breadcrumb` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: stories.length,
      itemListElement: stories.map((story, index) => ({ '@type': 'ListItem', position: index + 1, name: story.name })),
    },
  };

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Study in China', path: '/study-in-china-from-bangladesh' }, { name: 'Success stories' }]}
        eyebrow="Proof with permission"
        title="China student success stories."
        lead="Every published story requires a real student record, written consent, an approved photo, service and payment details, and privacy-safe evidence."
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
            <Link href="/study-in-china-from-bangladesh" className="ed-btn ed-btn-outline min-h-[52px] px-7">Study in China guide</Link>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/students/campus-nuist.webp"
                alt="A student at the I love NUIST sign on campus in Nanjing"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 480px"
                className="object-cover object-[60%_45%]"
              />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
              On campus in Nanjing
            </figcaption>
          </figure>
        }
      />

      <TrustBar />

      <Section title="Three checks before a story goes public." intro="Offer and timeline facts are checked before publication, and the student decides what is shown.">
        <StandardsGrid />
      </Section>

      <Section
        tone="sage"
        id="stories"
        title={stories.length ? 'Published China stories.' : 'No China story is public until its consent record is complete.'}
        intro={
          stories.length
            ? 'Each story is one student’s case, published with permission. Universities decide admission and scholarships; authorities decide visas.'
            : 'Student stories are a separate consent-controlled record. Until one is complete, the proof library shows privacy-safe admission notices and JW202 evidence instead.'
        }
      >
        {stories.length ? (
          <div data-anim="stagger" className="grid gap-6 lg:grid-cols-2">
            {stories.map(story => <StoryCard key={story.id} story={story} />)}
          </div>
        ) : (
          <div data-anim="stagger" className="grid gap-5 md:grid-cols-2">
            <article className={kit.card}>
              <span className={kit.iconLime}><FileCheck2 size={22} aria-hidden="true" /></span>
              <h3 className={`mt-6 ${kit.h3}`}>Inspect the evidence that is public</h3>
              <p className="mt-2 text-[16px] leading-7 text-ink-soft">
                The proof library holds company records with definitions and privacy-safe admission evidence, or we arrange a controlled inspection at our Dhanmondi office.
              </p>
              <Link href="/proof-library" className="ed-btn ed-btn-soft mt-6 min-h-[48px] px-6">Open the proof library</Link>
            </article>
            <article className={kit.cardDark}>
              <span className={kit.iconLime}><ShieldCheck size={22} aria-hidden="true" /></span>
              <h3 className="mt-6 text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime">What we will never publish</h3>
              <p className="mt-2 text-[16px] leading-7 text-white/80">
                Passport numbers, birth dates, visa identifiers or a photo the student has not approved. A story is a record, not an advertisement.
              </p>
              <Link href="/success-stories" className="ed-btn ed-btn-on-dark mt-6 min-h-[48px] px-6">All student stories</Link>
            </article>
          </div>
        )}
      </Section>

      <CtaBand
        title="Check your China route."
        text="Share your results, budget and preferred subject. A counsellor explains the scholarship routes that fit, the complete cost and the documents to prepare."
      />
    </>
  );
}
