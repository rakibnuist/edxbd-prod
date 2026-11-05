import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  GraduationCap,
  House,
  Info,
  Wallet,
} from 'lucide-react';

import DestinationCover, { destinationPhoto } from '@/components/destinations/DestinationCover';
import { CtaBand, FaqBlock, JsonLd, PageHero, Section, kit } from '@/components/page/PageKit';
import { countries } from '@/lib/countries';
import { pageMetadata } from '@/lib/seo';
import { SITE_URL, absoluteUrl } from '@/lib/site-urls';
import { COUNTRY_SEO, type CountrySeo } from './country-seo';

type Props = { params: Promise<{ country: string }> };
type CountryRecord = (typeof countries)[number];

const countryPath = (slug: string) => `/study-in-${slug}-from-bangladesh`;

function seoFor(country: CountryRecord): CountrySeo {
  return (
    COUNTRY_SEO[country.slug] ?? {
      displayName: country.name,
      title: `Study in ${country.name} from Bangladesh | EduExpress`,
      description:
        country.metaDescription ||
        `Study in ${country.name} from Bangladesh. Compare universities, programs, recognition, tuition, living costs, scholarships and visa readiness with evidence-based guidance.`,
      photoAlt: `${country.name} destination photo`,
    }
  );
}

/** ISO date for the recorded "Month YYYY" verification, or undefined if none is recorded. */
function verifiedIso(country: CountryRecord) {
  const recorded = country.reviewerInfo?.lastVerifiedDate;
  if (!recorded) return undefined;
  const date = new Date(`${recorded} 1 UTC`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

const bullet = <span className="mt-[11px] inline-block size-1.5 shrink-0 rounded-full bg-petrol-800" aria-hidden="true" />;

export function generateStaticParams() {
  return countries.map(({ slug }) => ({ country: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const country = countries.find((item) => item.slug === slug);
  if (!country) return { title: 'Country Not Found' };
  // China is permanently redirected to its own guide, which owns its metadata.
  if (country.slug === 'china') return {};

  const seo = seoFor(country);
  return pageMetadata({ title: seo.title, description: seo.description, path: countryPath(slug), locale: 'en_BD' });
}

export default async function CountryPage({ params }: Props) {
  const { country: slug } = await params;
  const country = countries.find((item) => item.slug === slug);
  if (!country) notFound();
  if (country.slug === 'china') permanentRedirect('/study-in-china-from-bangladesh');

  const seo = seoFor(country);
  const name = seo.displayName;
  const status = country.serviceStatus || 'Active';
  const path = countryPath(slug);
  const pageUrl = absoluteUrl(path);
  const photo = destinationPhoto(slug);
  const reviewed = country.reviewerInfo?.lastVerifiedDate;
  const dateModified = verifiedIso(country);

  const programAreas = country.programs.length
    ? country.programs
    : ['Business', 'Technology', 'Health and Social Sciences', 'International programs'];

  const facts = [
    { icon: CalendarDays, label: 'Primary intakes', value: country.intakesText || 'Confirmed per intake' },
    { icon: Clock, label: 'Next major deadline', value: country.nextDeadline || 'Check current cycle' },
    { icon: Wallet, label: 'Indicative tuition', value: country.costs?.tuition || 'Varies by institution' },
    { icon: House, label: 'Indicative living', value: country.costs?.living || 'Varies by city' },
  ];

  const whoItFits = country.whoItFits || [
    'Students who want a clear comparison of recognition, total cost and entry rules before applying.',
    'Families looking for written costs and realistic timelines.',
    'Applicants ready to build a complete, verifiable file.',
  ];
  const checkFirst = country.whoShouldReconsider || [
    'Do not rely on part-time work alone to cover tuition and living costs.',
    'Verify recognition for your specific program and career/licensing goals.',
    'Visa rules change frequently — always check current official guidance for your intake.',
  ];
  const sources = country.reviewerInfo?.primarySources || [
    'Official embassy/consulate guidance',
    'Higher education authority',
    'Immigration authority',
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Study in ${country.name} from Bangladesh`,
        description: seo.description,
        inLanguage: 'en-BD',
        ...(dateModified ? { dateModified } : {}),
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        reviewedBy: { '@id': `${SITE_URL}/#organization` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        ...(photo ? { primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(photo) } } : {}),
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#programs`,
        name: `Popular study areas in ${country.name} for Bangladeshi students`,
        numberOfItems: programAreas.length,
        itemListElement: programAreas.map((program, index) => ({ '@type': 'ListItem', position: index + 1, name: program })),
      },
      ...(country.universities && country.universities.length > 0
        ? [
            {
              '@type': 'ItemList',
              '@id': `${pageUrl}#universities`,
              name: `Institutions noted for ${country.name}`,
              numberOfItems: country.universities.length,
              itemListElement: country.universities.map((university, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: university,
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={path}
        trail={[{ name: 'Destinations', path: '/destinations' }, { name: `Study in ${name}` }]}
        eyebrow={`${status} destination service`}
        title={`Study in ${name} from Bangladesh.`}
        lead={
          country.valueStatement ||
          `EduExpress supports Bangladeshi students with education fit, institution checks, written costs, application guidance and visa readiness for ${country.name}. Recommendations are evidence-based and explained before any commitment.`
        }
        reviewed={reviewed}
        actions={
          <>
            <Link href="/education-fit-assessment" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Get my free assessment <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/find-education" className="ed-btn ed-btn-outline min-h-[52px] px-7">Research universities</Link>
          </>
        }
        aside={
          <figure className="relative overflow-hidden rounded-3xl bg-petrol-800">
            <div className="relative aspect-[4/3]">
              {photo ? (
                <Image src={photo} alt={seo.photoAlt} fill priority sizes="(max-width:1024px) 100vw, 480px" className="object-cover" />
              ) : (
                <DestinationCover slug={slug} name={country.name} flag={country.flag} priority sizes="(max-width:1024px) 100vw, 480px" />
              )}
            </div>
            <figcaption className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
                <span aria-hidden="true">{country.flag}</span> {country.name}
              </span>
              {country.nextDeadline && (
                <span className="rounded-full bg-lime px-4 py-1.5 text-[14px] font-semibold text-petrol-800">
                  Next deadline: {country.nextDeadline}
                </span>
              )}
            </figcaption>
          </figure>
        }
      />

      <section aria-label={`Quick facts for ${country.name}`} className="border-b border-canvas-soft bg-white py-8">
        <ul data-anim="stagger" className={`${kit.wrap} grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
          {facts.map((fact) => (
            <li key={fact.label} className="flex items-start gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lime text-petrol-800">
                <fact.icon size={20} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[14px] font-semibold text-ink-soft">{fact.label}</span>
                <span className="mt-0.5 block text-[16px] font-bold leading-6 text-petrol-800">{fact.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Section title={`Is ${name} right for you?`} intro="An honest fit check before any application: who this route suits, and what to confirm first.">
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-2">
          <article className={kit.cardLime}>
            <span className={kit.icon}><CheckCircle2 size={22} aria-hidden="true" /></span>
            <h3 className={`mt-6 ${kit.h3}`}>Who this route fits</h3>
            <ul className="mt-4 grid gap-3">
              {whoItFits.map((point) => (
                <li key={point} className="flex gap-3 text-[16px] leading-7 text-petrol-800">
                  <Check size={18} className="mt-1 shrink-0 text-lime-deep" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className={kit.cardSage}>
            <span className={kit.icon}><Info size={22} aria-hidden="true" /></span>
            <h3 className={`mt-6 ${kit.h3}`}>Check before choosing</h3>
            <ul className="mt-4 grid gap-3">
              {checkFirst.map((point) => (
                <li key={point} className="flex gap-3 text-[16px] leading-7 text-ink-soft">
                  {bullet}
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      <Section
        tone="sage"
        title="Universities, programs and recognition."
        intro={
          country.educationSystemAndRecognition ||
          'Education quality, recognition, and accreditation are reviewed against published official sources. Always confirm recognition for your exact program and intended career path.'
        }
      >
        <div data-anim="stagger" className="grid gap-5 lg:grid-cols-2">
          <article className={kit.card}>
            <h3 className={kit.h3}>Popular study areas</h3>
            <p className="mt-2 text-[16px] leading-7 text-ink-soft">
              EduExpress focuses on institution checks and program fit for Bangladeshi students. Popular study areas for {country.name} include:
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {programAreas.map((program) => (
                <li key={program} className="rounded-full bg-lime-pale px-4 py-2 text-[15px] font-semibold text-lime-deep">{program}</li>
              ))}
            </ul>
          </article>
          {country.universities && country.universities.length > 0 ? (
            <article className={kit.card}>
              <h3 className={kit.h3}>Institutions noted in current guidance</h3>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {country.universities.map((university) => (
                  <li key={university} className="flex items-start gap-2.5 text-[16px] leading-6 text-ink-soft">
                    <Check size={18} className="mt-0.5 shrink-0 text-lime-deep" aria-hidden="true" />
                    <span>{university}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[14px] leading-6 text-ink-mute">
                Availability changes by intake. Always confirm current admission status for your chosen intake.
              </p>
            </article>
          ) : (
            <article className={kit.card}>
              <h3 className={kit.h3}>How institutions are checked</h3>
              <p className="mt-2 text-[16px] leading-7 text-ink-soft">
                Each institution is checked against its official name, source, recognition evidence, program details, fees and intake
                status before it is recommended.
              </p>
              <Link href="/how-we-verify-universities" className={`mt-4 ${kit.link}`}>
                How we verify universities <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          )}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/universities" className="ed-btn ed-btn-outline min-h-[48px] px-6">Browse university records</Link>
          <Link href="/find-education" className="ed-btn ed-btn-outline min-h-[48px] px-6">Research by program</Link>
          <Link href="/how-we-verify-universities" className="ed-btn ed-btn-outline min-h-[48px] px-6">How we verify universities</Link>
        </div>
      </Section>

      <Section
        title="Admission requirements for Bangladeshi students."
        intro="Requirements vary by institution and intake. Use this as a starting checklist — confirm the exact list in writing for your shortlisted program."
      >
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-2">
          {[
            { title: 'Language & academics', items: country.requirements?.language || [] },
            { title: 'Documents to prepare', items: country.requirements?.documents || [] },
          ].map((group) => (
            <article key={group.title} className={kit.cardSage}>
              <h3 className={kit.h3}>{group.title}</h3>
              <ul className="mt-4 grid gap-3">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[16px] leading-7 text-ink-soft">
                    {bullet}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section
        tone="sage"
        title="Costs, fees and funding."
        intro="We state costs as indicative and always itemise fees in writing before you proceed."
      >
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-2">
          <article className={kit.card}>
            <p className="text-[14px] font-semibold text-ink-soft">Indicative tuition</p>
            <p className="mt-2 font-display text-[24px] font-black leading-snug text-petrol-800">{country.costs?.tuition || 'Varies widely by institution'}</p>
            <p className="mt-2 text-[15px] text-ink-mute">Currency: {country.costs?.currency || 'Check with institution'}</p>
          </article>
          <article className={kit.card}>
            <p className="text-[14px] font-semibold text-ink-soft">Indicative living costs</p>
            <p className="mt-2 font-display text-[24px] font-black leading-snug text-petrol-800">{country.costs?.living || 'Varies by city and lifestyle'}</p>
            <p className="mt-2 text-[15px] text-ink-mute">Prepare a dated, itemised cost sheet</p>
          </article>
        </div>
        {country.scholarships && country.scholarships.length > 0 && (
          <div data-anim="up" className={`mt-5 ${kit.cardLime}`}>
            <div className="flex items-center gap-3">
              <BadgeCheck size={22} className="text-lime-deep" aria-hidden="true" />
              <h3 className={kit.h3}>Funding opportunities to check</h3>
            </div>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {country.scholarships.map((scholarship) => (
                <li key={scholarship} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[16px] font-semibold text-petrol-800">
                  <Check size={18} className="shrink-0 text-lime-deep" aria-hidden="true" />
                  <span>{scholarship}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] leading-6 text-petrol-800">
              Eligibility changes by intake. Always confirm coverage, renewal conditions and costs that remain.
            </p>
          </div>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/scholarships" className="ed-btn ed-btn-outline min-h-[48px] px-6">Scholarship guidance</Link>
          <Link href="/fees-and-transparency" className="ed-btn ed-btn-outline min-h-[48px] px-6">Fees &amp; transparency</Link>
        </div>
      </Section>

      <Section
        tone="navy"
        title="Visa, residence and documentation."
        intro="Visa decisions are made solely by the relevant immigration authority. EduExpress checks your file against published requirements and flags gaps before submission."
      >
        <ul data-anim="stagger" className="grid gap-3 md:grid-cols-2">
          {(country.requirements?.visa || []).map((visa) => (
            <li key={visa} className="flex gap-3 rounded-3xl bg-white/[0.08] px-5 py-4 text-[16px] leading-7 text-white">
              <ArrowRight size={18} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
              <span>{visa}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[15px] leading-7 text-white/75">
          Processing times, fees and forms change. Always verify against the official embassy/consulate website for your intake.
        </p>
      </Section>

      <Section title="Work rights, careers and realistic expectations.">
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-3">
          <article className={kit.cardSage}>
            <span className={kit.icon}><Briefcase size={22} aria-hidden="true" /></span>
            <h3 className={`mt-6 ${kit.h3}`}>Work rights</h3>
            <p className="mt-2 text-[16px] leading-7 text-ink-soft">
              {country.workRightsAndCareer?.rights || 'Check current student work rules with the official immigration source.'}
            </p>
          </article>
          <article className={kit.cardSage}>
            <span className={kit.icon}><GraduationCap size={22} aria-hidden="true" /></span>
            <h3 className={`mt-6 ${kit.h3}`}>Career opportunities</h3>
            <p className="mt-2 text-[16px] leading-7 text-ink-soft">
              {country.workRightsAndCareer?.opportunities || 'Outcomes depend on skills, language, networking and the job market at graduation.'}
            </p>
          </article>
          <article className={kit.cardOutline}>
            <span className={kit.iconLime}><Info size={22} aria-hidden="true" /></span>
            <h3 className={`mt-6 ${kit.h3}`}>Reality check</h3>
            <p className="mt-2 text-[16px] leading-7 text-ink-soft">
              {country.workRightsAndCareer?.caveats ||
                'Do not rely on part-time work to cover tuition. Post-study rules change frequently — verify for your exact intake.'}
            </p>
          </article>
        </div>
      </Section>

      <Section
        tone="sage"
        title="Intakes, deadlines and timing."
        intro="Deadlines are often tied to scholarship rounds and visa processing. Start early to avoid last-minute document gaps."
      >
        <div data-anim="stagger" className="grid gap-5 sm:grid-cols-2">
          <article className={kit.card}>
            <p className="text-[14px] font-semibold text-ink-soft">Primary intakes</p>
            <p className="mt-2 font-display text-[24px] font-black leading-snug text-petrol-800">{country.intakesText || 'Confirmed per institution'}</p>
          </article>
          <article className={kit.card}>
            <p className="text-[14px] font-semibold text-ink-soft">Next major deadline</p>
            <p className="mt-2 font-display text-[24px] font-black leading-snug text-petrol-800">{country.nextDeadline || 'Contact us for current deadlines'}</p>
          </article>
        </div>
      </Section>

      <Section
        title={`Compare ${name} with realistic alternatives.`}
        intro="Compare fit by recognition, total cost, language of instruction, post-study options and timeline — not just tuition alone."
      >
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-2">
          <article className={kit.cardSage}>
            <h3 className={kit.h3}>vs {country.comparisons?.countryA || 'Another destination'}</h3>
            <p className="mt-2 text-[16px] leading-7 text-ink-soft">
              {country.comparisons?.countryA_description || 'Consider recognition, total cost, visa rules and career fit side by side for your goals.'}
            </p>
          </article>
          <article className={kit.cardSage}>
            <h3 className={kit.h3}>vs {country.comparisons?.countryB || 'Another destination'}</h3>
            <p className="mt-2 text-[16px] leading-7 text-ink-soft">
              {country.comparisons?.countryB_description || 'Compare realistic scholarship access, living costs and application timelines before deciding.'}
            </p>
          </article>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/compare-study-destinations" className="ed-btn ed-btn-outline min-h-[48px] px-6">Compare all destinations</Link>
          <Link href="/destinations" className="ed-btn ed-btn-outline min-h-[48px] px-6">Explore other destinations</Link>
          <Link href="/study-in-china-from-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] px-6">Study in China guide</Link>
        </div>
      </Section>

      <Section
        tone="sage"
        title="Evidence-first, updated against official sources."
        intro="Information on this page is reviewed against published embassy, immigration, higher education and scholarship sources. We state costs as indicative and always itemise fees in writing before you proceed."
      >
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-2">
          <article className={kit.card}>
            <p className="text-[14px] font-semibold text-ink-soft">Reviewed by</p>
            <p className="mt-2 font-display text-[24px] font-black leading-snug text-petrol-800">{country.reviewerInfo?.name || 'EduExpress Review Team'}</p>
            <p className="mt-1 text-[16px] text-ink-soft">{country.reviewerInfo?.role || 'Admissions & Compliance'}</p>
            {reviewed && <p className={`mt-4 ${kit.badge}`}><BadgeCheck size={16} aria-hidden="true" /> Last verified: {reviewed}</p>}
          </article>
          <article className={kit.card}>
            <p className="text-[14px] font-semibold text-ink-soft">Primary sources</p>
            <ul className="mt-3 grid gap-2.5">
              {sources.map((source) => (
                <li key={source} className="flex items-start gap-2.5 text-[16px] leading-6 text-petrol-800">
                  <Check size={18} className="mt-0.5 shrink-0 text-lime-deep" aria-hidden="true" />
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
        <p className="mt-6 text-[15px] leading-7 text-ink-soft">
          No obligation. For China, no EduExpress service fee before China visa approval.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/china-visa-first-policy" className="ed-btn ed-btn-outline min-h-[48px] px-6">China visa-first payment terms</Link>
          <Link href="/fees-and-transparency" className="ed-btn ed-btn-outline min-h-[48px] px-6">Fees &amp; transparency</Link>
          <Link href="/about" className="ed-btn ed-btn-outline min-h-[48px] px-6">About EduExpress</Link>
        </div>
      </Section>

      {country.faqs && country.faqs.length > 0 && (
        <FaqBlock tone="white" title={`${country.name} study FAQs for Bangladeshi students`} items={country.faqs} />
      )}

      <CtaBand
        title={`Start with a free assessment for ${name}.`}
        text={`Share your results, budget, intake and goals. We'll review realistic options for ${name}, flag risks and costs in writing, and tell you exactly what's missing before you commit to an application.`}
      />
    </>
  );
}
