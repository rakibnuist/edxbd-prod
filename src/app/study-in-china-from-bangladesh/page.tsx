import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarCheck,
  Check,
  Clock3,
  FileCheck2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import ChinaPillarHero from '@/components/china/ChinaPillarHero';
import ChinaPillarLeadForm from '@/components/china/ChinaPillarLeadForm';
import ChinaSelectAction from '@/components/china/ChinaSelectAction';
import ChinaStudyPlanner from '@/components/china/ChinaStudyPlanner';
import CscaMasterProOfferCard from '@/components/china/CscaMasterProOfferCard';
import { CtaBand, FaqBlock, JsonLd, Section, TrustBar, kit } from '@/components/page/PageKit';
import StoryMarquee from '@/components/stories/StoryMarquee';
import type { StoryCardData } from '@/components/stories/StoryCard';
import { CHINA_REPORT_OFFICIAL_AUTHORITIES, buildChinaBenchmark } from '@/lib/china-benchmark';
import { getChinaIntakes } from '@/lib/china-intakes';
import { getChinaStudyHub } from '@/lib/china-study-hub';
import { config } from '@/lib/config';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { breadcrumbJsonLd, citationJsonLd } from '@/lib/json-ld';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';
import { ogImage, pageMetadata } from '@/lib/seo';
import { getPublicTrustRecords } from '@/lib/trust-records';
import { getUniversityRecords, type CleanUniversityRecord } from '@/lib/university-records';

const SITE = 'https://eduexpressint.com';
const PATH = '/study-in-china-from-bangladesh';
const canonical = `${SITE}${PATH}`;
export const revalidate = 3600;

export async function generateMetadata() {
  const content = await getChinaStudyHub();
  return pageMetadata({
    title: 'Study in China from Bangladesh | EduExpress International',
    description: content.description,
    path: PATH,
    locale: 'en_BD',
    languages: { 'en-BD': PATH, 'bn-BD': '/bn/study-in-china', 'x-default': PATH },
    image: ogImage('china-guide', content.photos.hero.alt),
  });
}

const featuredSpecs = [
  {
    slug: 'nuist',
    acronym: 'NUIST',
    logo: '/images/universities/logos/nuist.webp',
    summary: 'Atmospheric science, computing, AI and engineering with English- and Chinese-medium options and generous freshman scholarships.',
    route: 'Bachelor’s Degree',
  },
  {
    slug: 'hit-harbin',
    acronym: 'HIT',
    logo: '/images/universities/logos/hit-harbin.webp',
    summary: 'C9 League engineering powerhouse offering foundation-to-degree and direct engineering routes with merit scholarship tiers.',
    route: 'Foundation → Bachelor',
  },
  {
    slug: 'nuaa',
    acronym: 'NUAA',
    logo: '/images/universities/logos/nuaa.webp',
    summary: 'Aerospace, mechanical, computer science and business programmes in Nanjing with transparent annual tuition schedules.',
    route: 'Bachelor’s Degree',
  },
  {
    slug: 'shanghai-jiao-tong-university',
    acronym: 'SJTU',
    logo: '/images/universities/logos/shanghai-jiao-tong-university.webp',
    summary: 'Top-30 ShanghaiRanking global research university offering non-degree Chinese language, STEM and postgraduate options.',
    route: 'Chinese Language',
  },
  {
    slug: 'chongqing-medical-university',
    acronym: 'CQMU',
    logo: '/images/universities/logos/chongqing-medical-university.webp',
    summary: 'MoE-listed English-medium 6-year Clinical Medicine (MBBS) with affiliated teaching hospitals and clear entry criteria.',
    route: 'MBBS in China',
  },
  {
    slug: 'suep',
    acronym: 'SUEP',
    logo: '/images/universities/logos/suep.webp',
    summary: 'Electrical engineering, power systems, CS and automation in Shanghai with affordable CNY tuition and living options.',
    route: 'Bachelor’s Degree',
  },
];

const contents: [string, string][] = [
  ['2027 Intakes', 'china-intakes-2027'],
  ['Rankings & quality', 'china-education-quality'],
  ['Scholarships', 'china-funding'],
  ['Costs & BDT 200k package', 'china-total-cost'],
  ['MBBS', 'china-recognition'],
  ['Admission & CSCA', 'china-eligibility'],
  ['Stories & proof', 'china-proof'],
  ['Universities', 'china-university-options'],
  ['FAQs', 'china-research-faq'],
];

const visaFirstTerms =
  'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';

const monthYear = (iso?: string) => {
  const date = iso ? new Date(`${iso}T00:00:00Z`) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    : undefined;
};

async function loadChinaUniversities(): Promise<CleanUniversityRecord[]> {
  try {
    return await getUniversityRecords('China');
  } catch {
    return [];
  }
}

export default async function StudyInChinaFromBangladeshPage() {
  const now = new Date();
  const [content, trust, chinaUniversities] = await Promise.all([
    getChinaStudyHub(),
    getPublicTrustRecords(),
    loadChinaUniversities(),
  ]);

  const intakes = getChinaIntakes(now);
  const chinaStories: StoryCardData[] = trust.testimonials
    .filter(item => !item.country || /china/i.test(item.country))
    .slice(0, 12)
    .map(item => ({
      id: item.id,
      quote: item.content,
      name: item.displayName || item.studentName,
      program: item.program ?? undefined,
      university: item.university ?? undefined,
      location: item.location ?? undefined,
      country: item.country ?? undefined,
      rating: item.rating ?? 5,
      image: item.image ?? undefined,
    }));

  const chinaEvidence = trust.evidence
    .filter(asset => !asset.country || /china/i.test(asset.country))
    .slice(0, 4);

  const report = buildChinaBenchmark(chinaUniversities, intakes, chinaStories.length, now);
  const office = trust.offices.find(item => item.isHeadOffice) ?? trust.offices[0];
  const phone = office?.phonePrimary ?? config.contact.phone;
  const whatsapp = config.contact.whatsapp || phone;
  const address = office?.address ?? DEFAULT_OFFICE_RECORD.address;
  const hours = office?.hours ?? DEFAULT_OFFICE_RECORD.hours;
  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Assalamu alaikum. I would like a free Study in China plan from EduExpress International.',
  )}`;
  const telHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  const supportPackage =
    trust.servicePackages.find(item => item.slug === 'china-complete-support-package') ??
    trust.servicePackages.find(item => item.destination.toLowerCase() === 'china');
  const packagePrice = supportPackage?.priceLabel ?? '2,00,000 BDT';
  const packageItems = supportPackage?.includedItems?.length
    ? supportPackage.includedItems
    : [
        'Application fees until successful admission',
        'Admission Notice',
        'Scholarship assistance',
        'JW202 Form',
        'Visa application processing',
        'Embassy fee',
        'Medical checkup in Bangladesh',
        'Pre-departure briefing and travel guidance',
        'One-way air ticket',
        'Airport pickup',
      ];
  const excludedItems = supportPackage?.excludedItems?.length
    ? supportPackage.excludedItems
    : [
        'University registration or seat deposit',
        'Tuition deposit required directly by the university',
        'Any university or third party amount not listed as included in the signed package schedule',
      ];

  const bySlug = new Map(chinaUniversities.map(uni => [uni.slug, uni]));
  const featuredUniversities = featuredSpecs
    .map(spec => {
      const university = bySlug.get(spec.slug);
      return university ? { ...spec, university } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const seenLogos = new Set<string>();
  const tickerLogos = chinaUniversities
    .filter(item => {
      if (!item.logo || seenLogos.has(item.logo)) return false;
      seenLogos.add(item.logo);
      return true;
    })
    .slice(0, 40);

  const openIntakes = intakes
    .filter(row => row.status === 'Open' || row.status === 'Closing')
    .map(row => row.name.split(' Intake')[0]);
  const intakeBadge = openIntakes.length
    ? `${openIntakes.join(' & ')} Intakes Open`
    : '2027 China Admissions Desk Open';

  const heroStats =
    report.universityCount > 0
      ? {
          universities: `${report.universityCount} Unis`,
          universitiesSub: `Across ${report.cityCount} Chinese cities`,
          programmes: `${report.programCounts.total}+`,
          programmesSub: 'Verified study rows',
          scholarships: `${report.scholarshipTotal}`,
          scholarshipsSub: 'CSC, Provincial & Uni',
        }
      : {
          universities: 'Verified',
          universitiesSub: 'Leading Chinese cities',
          programmes: '5 Routes',
          programmesSub: 'English & Chinese medium',
          scholarships: 'Up to 100%',
          scholarshipsSub: 'CSC, Provincial & Uni',
        };

  const reviewed = monthYear(content.research?.checkedAt);
  const checkedAt = content.research?.checkedAt;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        name: 'Study in China from Bangladesh',
        description: content.description,
        inLanguage: 'en-BD',
        primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/og/china-guide.jpg` },
        mainEntityOfPage: canonical,
        ...(checkedAt ? { dateModified: `${checkedAt}T00:00:00Z` } : {}),
        author: { '@id': `${SITE}/#organization` },
        reviewedBy: { '@id': `${SITE}/#organization` },
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        mainEntity: { '@id': `${canonical}#guides` },
        ...citationJsonLd([...CHINA_REPORT_OFFICIAL_AUTHORITIES]),
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#guides`,
        name: 'Study in China topic guides for Bangladeshi students',
        numberOfItems: content.guides.length,
        itemListElement: content.guides.map((guide, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: guide.title,
          url: `${SITE}${guide.href}`,
        })),
      },
    ],
  };

  return (
    <article lang="en" className="overflow-x-clip">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Study in China' }], PATH)} />
      <JsonLd data={schema} />

      {/* 1. Executive Dark-Petrol Conversion Hero + Embedded Lead Form */}
      <ChinaPillarHero
        intro={content.intro}
        reviewed={reviewed}
        heroPhoto={content.photos.hero}
        stats={heroStats}
        intakeBadge={intakeBadge}
        phoneNumber={phone}
        whatsappNumber={whatsapp}
      />

      {/* 2. Standing Trust Facts */}
      <TrustBar universities={report.universityCount > 0 ? report.universityCount : undefined} />

      {/* 3. Live Chinese University Logo Ticker */}
      {tickerLogos.length >= 6 && (
        <section aria-label="Chinese universities in our verified directory" className="border-b border-canvas-soft bg-white py-9">
          <p className="px-5 text-center text-[15px] font-semibold text-ink-soft">
            {report.universityCount} Chinese universities in {report.cityCount} cities — fees, scholarships and entry requirements checked at source
          </p>
          <div className="home-ticker mt-5">
            <div
              className="home-ticker-track items-center"
              style={{ ['--ticker-duration' as string]: `${Math.max(52, Math.round(tickerLogos.length * 1.9))}s` }}
            >
              {[0, 1].map(copy => (
                <ul
                  key={copy}
                  className="flex shrink-0 items-center gap-4 pr-4"
                  aria-hidden={copy === 1 ? true : undefined}
                  inert={copy === 1 ? true : undefined}
                >
                  {tickerLogos.map(item => (
                    <li key={`${item.slug}-${copy}`} className="shrink-0">
                      <Link
                        href={`/universities/${item.slug}`}
                        title={item.name}
                        className="flex h-16 w-[148px] items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-4 py-2 shadow-[0_2px_10px_rgba(15,58,92,0.04)] transition hover:border-petrol-800/40"
                      >
                        <Image
                          src={item.logo as string}
                          alt={`${item.name} logo`}
                          width={116}
                          height={48}
                          unoptimized
                          loading="eager"
                          decoding="sync"
                          className="max-h-11 w-auto max-w-[116px] object-contain"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. On-Page Quick Navigator + Bilingual Switch */}
      <section aria-label="Plan your China study" className="border-b border-canvas-soft bg-[#f8fafc] py-7">
        <div className={`${kit.wrap} flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between`}>
          <nav aria-label="On this page" className="flex flex-wrap gap-2">
            {contents.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="inline-flex min-h-[42px] items-center rounded-full border border-slate-200 bg-white px-4 text-[14.5px] font-semibold text-petrol-800 transition hover:border-petrol-800/40 hover:bg-lime-pale"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <Link
              href="/bn/study-in-china"
              hrefLang="bn-BD"
              lang="bn"
              className="inline-flex min-h-[42px] items-center rounded-full border border-petrol-800/20 bg-white px-4 text-[14.5px] font-bold text-petrol-800 transition hover:bg-canvas-soft"
            >
              বাংলা গাইড পড়ুন
            </Link>
            <a href="#china-fit-form" className="ed-btn ed-btn-signal min-h-[42px] px-5 text-[14.5px]">
              Free study plan <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* 5. Live 2027 China Intakes Spotlight */}
      <Section
        id="china-intakes-2027"
        title="2027 China intakes: apply while seats & scholarships are open."
        intro={content.introDetail}
        action={
          <Link href="/china-intakes-deadlines" className="ed-btn ed-btn-outline min-h-[48px] px-6">
            Full 2027 intake calendar <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      >
        <div data-anim="stagger" className="grid gap-5 lg:grid-cols-2">
          {intakes.map(row => {
            const isMarch = Boolean(row.activeCampaignHref);
            const intakeOption = isMarch ? 'March 2027 (Spring)' : 'September 2027 (Main)';
            return (
              <article
                key={row.name}
                className={
                  isMarch
                    ? 'flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#071f33] via-petrol-800 to-[#12436b] p-6 text-white shadow-lg sm:p-8'
                    : 'flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-canvas-soft p-6 sm:p-8'
                }
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider ${
                        isMarch ? 'bg-lime text-petrol-800' : 'bg-white text-petrol-800'
                      }`}
                    >
                      <CalendarCheck size={14} aria-hidden="true" />
                      {row.status} · {row.badge}
                    </span>
                    <span className={`text-xs font-bold ${isMarch ? 'text-lime' : 'text-petrol-700'}`}>
                      Deadline: {row.deadlineLabel}
                    </span>
                  </div>

                  <h3 className={`mt-4 font-display text-[26px] font-black leading-tight sm:text-[30px] ${isMarch ? 'text-white' : 'text-petrol-800'}`}>
                    {row.name}
                  </h3>
                  <p className={`mt-2.5 text-[15.5px] leading-7 ${isMarch ? 'text-white/85' : 'text-ink-soft'}`}>
                    {row.programs}
                  </p>

                  <dl className={`mt-5 grid grid-cols-2 gap-3 rounded-2xl p-4 text-sm ${isMarch ? 'bg-white/[0.08] ring-1 ring-white/15' : 'bg-white'}`}>
                    <div>
                      <dt className={`text-xs font-semibold ${isMarch ? 'text-white/70' : 'text-ink-mute'}`}>Classes begin</dt>
                      <dd className={`mt-0.5 font-bold ${isMarch ? 'text-white' : 'text-petrol-800'}`}>{row.classesStart}</dd>
                    </div>
                    <div>
                      <dt className={`text-xs font-semibold ${isMarch ? 'text-white/70' : 'text-ink-mute'}`}>Scholarship window</dt>
                      <dd className={`mt-0.5 font-bold ${isMarch ? 'text-lime' : 'text-petrol-800'}`}>{row.cscDeadline}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <ChinaSelectAction
                    intake={intakeOption}
                    label={`intake_${intakeOption}`}
                    className="ed-btn ed-btn-signal min-h-[48px] px-5 text-[15px]"
                  >
                    Check eligibility for {isMarch ? 'March' : 'September'} 2027 <ArrowRight size={16} aria-hidden="true" />
                  </ChinaSelectAction>
                  {isMarch ? (
                    <Link href="/china-march-2027-intake" className="ed-btn ed-btn-on-dark min-h-[48px] px-5 text-[15px]">
                      Explore 18 March universities
                    </Link>
                  ) : (
                    <Link href="/china-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] px-5 text-[15px]">
                      CSC &amp; Sept scholarships
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* 6. Education Quality & World Rankings */}
      <Section
        id="china-education-quality"
        tone="sage"
        title="Why study in China? Education quality comes first."
        intro="A good shortlist connects the reputation of a university with the quality of your actual programme. Look at what you will study, who will teach you and the facilities you will use."
      >
        <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          <div data-anim="stagger" className="grid gap-4">
            {content.quality.map((item, idx) => (
              <div key={item.title} className={kit.card}>
                <div className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-lime font-display text-[17px] font-black text-petrol-800">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className={kit.h3}>{item.title}</h3>
                    <p className={`mt-2 ${kit.body}`}>{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside data-anim="up" className={`${kit.cardDark} self-start shadow-xl`}>
            <h3 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime">
              Chinese universities on the world stage
            </h3>
            <p className="mt-2 text-[14px] leading-6 text-white/75">
              ShanghaiRanking · Academic Ranking of World Universities
            </p>
            <table className="mt-5 w-full text-left text-[16px]">
              <caption className="sr-only">Examples of Chinese university world rankings from ShanghaiRanking</caption>
              <thead>
                <tr className="border-b border-white/20 text-[14px] text-white/70">
                  <th scope="col" className="py-3 font-medium">University</th>
                  <th scope="col" className="py-3 text-right font-medium">World rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/15">
                {content.rankings.map(item => (
                  <tr key={item.name}>
                    <th scope="row" className="py-4 pr-4 font-semibold text-white">{item.name}</th>
                    <td className="py-4 text-right font-display text-[30px] font-black leading-none text-lime">#{item.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5 border-t border-white/20 pt-4 text-[15px] leading-6 text-white/80">
              World, national and subject rankings answer different questions. Use the ranking for your intended major alongside teaching language, admission fit and total cost.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/china-universities" className="ed-btn ed-btn-signal min-h-[48px] px-5">
                Explore university options <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/china-study-report-bangladesh" className="ed-btn ed-btn-on-dark min-h-[48px] px-5">
                Live data report
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      {/* 7. Scholarships & CSC Monthly Stipends */}
      <Section
        id="china-funding"
        title="Scholarships for Bangladeshi students."
        intro="From tuition reductions to full awards, funding can make your chosen programme more affordable. Compare the coverage, eligible degree and renewal conditions after checking academic fit."
        action={
          <Link href="/china-scholarships-bangladesh" className="ed-btn ed-btn-outline min-h-[48px] px-6">
            Explore scholarships <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      >
        <div data-anim="stagger" className="grid gap-4 md:grid-cols-3">
          {content.fundingRoutes.map(item => (
            <div key={item.title} className={`${kit.cardSage} flex flex-col`}>
              <span className={kit.icon}><Award size={21} aria-hidden="true" /></span>
              <h3 className={`mt-5 ${kit.h3}`}>{item.title}</h3>
              <p className={`mt-2 flex-1 ${kit.body}`}>{item.body}</p>
              <ChinaSelectAction
                route="Scholarship Assessment"
                label={`scholarship_${item.title}`}
                className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 self-start text-[15px] font-bold text-petrol-800 underline-offset-4 hover:underline"
              >
                Assess my scholarship eligibility <ArrowRight size={15} aria-hidden="true" />
              </ChinaSelectAction>
            </div>
          ))}
        </div>
        <div className={`mt-6 grid gap-6 ${kit.cardLime} border border-lime-deep/15 lg:grid-cols-[1fr_1.5fr] lg:items-center`}>
          <div>
            <h3 className={kit.h3}>Full CSC scholarship monthly stipends</h3>
            <p className="mt-2 text-[15px] leading-6 text-ink-soft">
              For eligible full-award recipients; the scholarship terms define your funding period. Partial awards and other schemes differ.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/csc-scholarship-bangladesh" className={kit.link}>
                CSC scholarship guide <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <ChinaSelectAction
                route="Scholarship Assessment"
                label="csc_stipend_check"
                className="inline-flex items-center gap-1.5 text-[16px] font-bold text-lime-deep underline-offset-4 hover:underline"
              >
                Check my GPA fit <ArrowRight size={16} aria-hidden="true" />
              </ChinaSelectAction>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {content.stipends.map(item => (
              <div key={item.level} className="rounded-2xl bg-white p-4 shadow-sm">
                <dt className="text-[14px] font-semibold text-ink-soft">{item.level}</dt>
                <dd className="mt-1 font-display text-[24px] font-black leading-tight text-petrol-800 sm:text-[28px]">{item.amount}</dd>
                <dd className="text-[14px] text-ink-soft">{item.period}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* 8. Visa-First Complete China Support Package + Total Costs */}
      <Section
        id="china-total-cost"
        tone="sage"
        title="Transparent costs & BDT 0 service fee before visa."
        intro="Build a full family budget around the university, major and city. Keep tuition before scholarship, confirmed funding, third-party fees and EduExpress service charges clearly separated in writing."
      >
        {/* Flagship Package Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-md">
          <div className="grid gap-6 bg-gradient-to-r from-[#071f33] via-petrol-800 to-[#12436b] p-6 text-white sm:p-9 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-lime">
                <Sparkles size={13} aria-hidden="true" />
                One package · Application to arrival
              </span>
              <h3 className="mt-3 font-display text-[32px] font-black leading-[1.02] text-lime sm:text-[40px]">
                {supportPackage?.title ?? 'Complete China Support Package'}
              </h3>
              <p className="mt-3 max-w-xl text-[16.5px] leading-7 text-white/85">
                {supportPackage?.summary ??
                  'One complete package for your China application, scholarship assistance, JW202, visa preparation, air ticket and campus arrival support.'}
              </p>
              <p lang="bn" className="mt-4 inline-block rounded-2xl border border-lime/30 bg-lime/10 px-4 py-2 text-[1.25rem] font-bold text-lime">
                ভিসার আগে এক টাকাও সার্ভিস চার্জ নয়।
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-white/75">EduExpress package price</p>
              <p className="mt-1 font-display text-[38px] font-black leading-none text-lime sm:text-[44px]">{packagePrice}</p>
              <p className="mt-2 text-sm font-semibold text-white">Payable only after China visa approval</p>
              <p className="mt-3 text-xs leading-5 text-white/80">
                Choose Route 1 (original academic documents held as documented security, BDT 0 upfront deposit) or Route 2 (BDT 15,000 refundable deposit while keeping originals, deducted from the final package).
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <ChinaSelectAction
                  route="Help me choose a route"
                  label="package_clear_cost_cta"
                  className="ed-btn ed-btn-signal min-h-[48px] px-5 text-[15px]"
                >
                  Get my written ClearCost sheet <ArrowRight size={16} aria-hidden="true" />
                </ChinaSelectAction>
                <Link href="/china-visa-first-policy" className="ed-btn ed-btn-on-dark min-h-[48px] px-5 text-[14.5px]">
                  Read payment policy
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-9 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <h4 className="text-[18px] font-bold text-petrol-800">Included in your China support package</h4>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {packageItems.map(item => (
                  <li key={item} className="flex gap-2.5 text-[15px] leading-6 text-ink-soft">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime text-petrol-800">
                      <Check size={13} strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-canvas-soft p-6">
              <h4 className="text-[17px] font-bold text-petrol-800">Paid separately (University &amp; third parties)</h4>
              <ul className="mt-3 space-y-2 text-[14.5px] leading-6 text-ink-soft">
                {excludedItems.map(item => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-petrol-800" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-slate-300/70 pt-3 text-[13.5px] leading-6 text-ink-soft">
                {visaFirstTerms}
              </p>
            </div>
          </div>
        </div>

        {/* Example University Tuition & Cost Checklist */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-10">
          <div>
            <div id="china-fee-examples" className="scroll-mt-28 divide-y divide-canvas-soft rounded-3xl bg-white px-6 shadow-sm">
              {content.costExamples.map(item => (
                <div key={item.name} className="flex flex-wrap items-center justify-between gap-3 py-5">
                  <div>
                    <Link href={item.href} className="text-[17px] font-semibold text-petrol-800 underline-offset-4 hover:underline">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-[14px] text-ink-soft">{item.programme}</p>
                  </div>
                  <div className="sm:text-right">
                    <strong className="font-display text-[26px] font-black leading-none text-petrol-800">{item.amount}</strong>
                    <p className="mt-1 text-[14px] text-ink-soft">{item.period}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-5">
              <Link href="/study-in-china-cost-bangladesh" className={kit.link}>
                Explore fees &amp; total costs <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/compare-costs" className={kit.link}>
                Compare first-year costs <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/china-study-report-bangladesh" className={kit.link}>
                China CNY benchmark report <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className={`${kit.cardLime} self-start`}>
            <h3 className={kit.h3}>Your itemised cost checklist</h3>
            <dl className="mt-3 divide-y divide-white">
              <div className="py-4">
                <dt className="text-[16px] font-semibold text-petrol-800">Before China</dt>
                <dd className={`mt-1 ${kit.body}`}>
                  Application charges, any university deposit, document preparation, visa and travel arrangements, plus the agreed EduExpress Package.
                </dd>
              </div>
              <div className="py-4">
                <dt className="text-[16px] font-semibold text-petrol-800">In China</dt>
                <dd className={`mt-1 ${kit.body}`}>
                  Tuition after confirmed support, accommodation, insurance, medical examination, residence permit, meals and everyday living.
                </dd>
              </div>
            </dl>
            <p className="mt-1 text-[15px] leading-6 text-ink-soft">
              Compare the first year and later years, including the conditions for scholarship renewal.
            </p>
            <Link href="/fees-and-transparency" className={`mt-3 ${kit.link}`}>
              How EduExpress handles fees <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      {/* 9. MBBS in China — Recognition & BMDC Pathway */}
      <Section id="china-recognition" tone="navy" title="MBBS in China: plan your medical career." intro={content.mbbs.intro}>
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-14">
          <div>
            <span className={kit.iconLime}><Stethoscope size={22} aria-hidden="true" /></span>
            <p className="mt-5 text-[17px] leading-7 text-white/85">
              Compare medical universities, annual tuition, freshman scholarships and BMDC licensing requirements in our dedicated guide for Bangladeshi students.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ChinaSelectAction
                route="MBBS in China"
                label="mbbs_eligibility_check"
                className="ed-btn ed-btn-signal min-h-[52px] px-6"
              >
                Check my MBBS eligibility <ArrowRight size={17} aria-hidden="true" />
              </ChinaSelectAction>
              <Link href="/mbbs-in-china-bangladesh" className="ed-btn ed-btn-on-dark min-h-[52px] px-6">
                MBBS guide &amp; fees
              </Link>
            </div>
          </div>
          <div data-anim="stagger" className="divide-y divide-white/15">
            {content.mbbs.points.map(item => (
              <div key={item.title} className="py-5 first:pt-0">
                <h3 className="text-[19px] font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-[16px] leading-7 text-white/80">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 10. Admission Plan, CSCA, Language & Documents */}
      <Section
        id="china-eligibility"
        title="Your Bangladesh-to-China admission plan."
        intro="Use your current qualification to find the right starting point. Requirements belong to the selected university and programme."
        action={
          <Link href="/china-admission-requirements" className="ed-btn ed-btn-outline min-h-[48px] px-6">
            Full admission guide <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      >
        <div className="overflow-x-auto rounded-3xl border border-canvas-soft">
          <table className="w-full min-w-[620px] text-left text-[15px] leading-6">
            <caption className="sr-only">China study routes and qualifications for Bangladeshi applicants</caption>
            <thead className="bg-canvas-soft">
              <tr>
                {['Study route', 'Your starting qualification', 'What to prepare'].map(label => (
                  <th key={label} scope="col" className="px-5 py-3.5 font-semibold text-petrol-800">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-soft">
              {content.qualifications.map(item => (
                <tr key={item.level}>
                  <th scope="row" className="px-5 py-4 align-top font-semibold text-petrol-800">{item.level}</th>
                  <td className="px-5 py-4 align-top text-ink-soft">{item.qualification}</td>
                  <td className="max-w-md px-5 py-4 text-ink-soft">{item.prepare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div id="china-language" className={`scroll-mt-28 ${kit.cardSage}`}>
            <h3 className={kit.h3}>English, Chinese and CSCA</h3>
            <p className={`mt-2 ${kit.body}`}>
              Teaching-language evidence and academic entrance results serve different purposes. English-taught programmes specify accepted IELTS, TOEFL or MOI evidence; Chinese-taught routes specify HSK requirements. CSCA Mathematics and any required Physics, Chemistry or Professional Chinese depend on your undergraduate route.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/china-admission-requirements#guide-3-understand-csca-and-language-proof" className={kit.link}>
                Understand CSCA <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/updates/csca-guide-study-in-china" className={kit.link}>
                CSCA exam guide <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/study-in-china-without-ielts" className={kit.link}>
                English &amp; MOI options <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div id="china-preparation" className={`scroll-mt-28 ${kit.cardSage}`}>
            <h3 className={kit.h3}>Prepare your application file</h3>
            <ul className="mt-4 grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
              {content.documents.map(item => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] leading-6 text-ink-soft">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime text-petrol-800">
                    <Check size={13} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] leading-6 text-ink-soft">
              Keep names consistent across your passport and academic records. Programme documents apply to self-funded and scholarship applicants.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <CscaMasterProOfferCard assessmentHref="/education-fit-assessment" compact />
        </div>
        <p className="mt-6 text-[16px] leading-7 text-ink-soft">
          <strong className="text-petrol-800">Choosing a start: </strong>
          Autumn is a common degree-entry period; spring offers language and foundation options, with selected degree routes by university.{' '}
          <Link href="/china-intakes-deadlines" className="font-semibold text-petrol-800 underline underline-offset-4">
            See 2027 intakes and deadlines
          </Link>.
        </p>
      </Section>

      {/* 11. Interactive China Study Route Finder */}
      <ChinaStudyPlanner />

      {/* 12. Real Student Stories & Campus / Airport Proof */}
      <section id="china-proof" aria-labelledby="china-proof-heading" className="scroll-mt-24 overflow-hidden bg-petrol-800 py-16 text-white lg:py-20">
        <div className={kit.wrap}>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-lime">
                Real Student Outcomes · Since 2018
              </span>
              <h2 id="china-proof-heading" data-anim="up" className={`mt-4 ${kit.h2OnDark}`}>
                Real Bangladeshi students on campus in China.
              </h2>
              <p className="mt-4 text-[17.5px] leading-7 text-white/85">
                Families meet our counsellors in Dhanmondi, receive admission notices and JW202 documents, and depart from Dhaka Airport. Read what our students share in their own words.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/china-success-stories" className="ed-btn ed-btn-signal min-h-[50px] px-6">
                  Read China student stories <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <Link href="/proof-library" className="ed-btn ed-btn-on-dark min-h-[50px] px-6">
                  Inspect proof library
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 bg-[#071f33]">
                <Image
                  src="/images/students/campus-nuist.webp"
                  alt="Bangladeshi student at Nanjing University of Information Science and Technology campus in China"
                  fill
                  sizes="(max-width:640px) 100vw, 320px"
                  className="object-cover object-[60%_45%]"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-petrol-800">
                  On campus in Nanjing
                </figcaption>
              </figure>
              <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 bg-[#071f33]">
                <Image
                  src="/images/home/student-departure-support.webp"
                  alt="EduExpress Dhaka Airport departure support for Bangladeshi students travelling to China"
                  fill
                  sizes="(max-width:640px) 100vw, 320px"
                  className="object-cover object-[center_28%]"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-petrol-800">
                  Dhaka Airport send-off
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        {chinaStories.length > 0 && (
          <div className="mt-12">
            <StoryMarquee stories={chinaStories} asElement="div" />
          </div>
        )}
      </section>

      {/* 13. Privacy-Safe Redacted Evidence Records */}
      {chinaEvidence.length > 0 && (
        <Section
          tone="white"
          title="Inspect privacy-safe admission & authorization records."
          intro="Every public admission notice, pre-admission preview and authorization document is privacy checked before publication, with personal identifiers redacted."
          action={
            <Link href="/proof-library" className="ed-btn ed-btn-outline min-h-[48px] px-6">
              Open full proof library <ArrowRight size={16} aria-hidden="true" />
            </Link>
          }
        >
          <ul data-anim="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {chinaEvidence.map(asset => (
              <li key={asset.id} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-canvas-soft">
                <div className="relative aspect-[4/3] bg-white">
                  {asset.thumbnailUrl ? (
                    <Image
                      src={asset.thumbnailUrl}
                      alt={`Privacy safe preview: ${asset.title}`}
                      fill
                      sizes="(max-width:640px) 100vw, 280px"
                      className="object-contain p-3"
                    />
                  ) : (
                    <div className="grid h-full place-items-center">
                      <FileCheck2 size={42} className="text-petrol-800" aria-hidden="true" />
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-petrol-800 px-3 py-1 text-[11px] font-bold text-white">
                    Privacy checked
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-semibold capitalize text-ink-mute">{asset.type.replaceAll('_', ' ')}</span>
                  <h3 className="mt-1.5 text-[16px] font-bold leading-snug text-petrol-800">{asset.title}</h3>
                  {asset.university && (
                    <Link href={`/universities/${asset.university.slug}`} className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-bold text-petrol-700 hover:underline">
                      View {asset.university.name} <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 14. Student Life in China */}
      <Section
        id="china-student-life"
        tone="sage"
        title="Feel prepared for life in China."
        intro="Practical details matter to students and parents as much as the course."
        action={
          <Link href="/life-in-china-bangladeshi-students" className="ed-btn ed-btn-outline min-h-[48px] px-6">
            Explore student life <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      >
        <div className="grid items-start gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-12">
          <figure data-anim="up">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-md">
              <Image
                src={content.photos.life.src}
                alt={content.photos.life.alt}
                fill
                sizes="(max-width:1024px) 100vw, 500px"
                className="object-cover object-[50%_72%]"
              />
            </div>
            <figcaption className="mt-3 text-[14px] leading-6 text-ink-soft">{content.photos.life.caption}</figcaption>
          </figure>
          <div data-anim="stagger" className="grid gap-3">
            {content.life.map(item => (
              <div key={item.title} className={kit.card}>
                <h3 className={kit.h3}>{item.title}</h3>
                <p className={`mt-2 ${kit.body}`}>{item.body}</p>
              </div>
            ))}
            <Link id="china-visa-route" href="/china-student-visa-bangladesh" className={`scroll-mt-28 mt-2 ${kit.link}`}>
              Student visa and arrival preparation from Bangladesh <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      {/* 15. Featured Chinese Universities Grid */}
      <Section
        id="china-university-options"
        title="Explore Chinese university programmes."
        intro="Open a profile for majors, teaching language, entry requirements, scholarships and fee schedules — or select a university directly for your personalised plan."
        action={
          <Link href="/china-universities" className="ed-btn ed-btn-outline min-h-[48px] px-6">
            View all {report.universityCount > 0 ? report.universityCount : ''} universities <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      >
        <div data-anim="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredUniversities.map(({ university, logo, acronym, summary, route }) => (
            <div key={university.slug} className="flex flex-col rounded-3xl border border-slate-200/80 bg-canvas-soft p-6 transition hover:border-petrol-800/30 hover:bg-white hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={logo}
                    alt={`${university.name} logo`}
                    width={56}
                    height={56}
                    className="size-14 rounded-2xl border border-slate-200/80 bg-white object-contain p-1.5"
                  />
                  <div>
                    <p className="text-[16px] font-bold text-petrol-800">{acronym}</p>
                    <p className="text-[14px] text-ink-soft">{university.city}, China</p>
                  </div>
                </div>
                {university.rankings?.world && (
                  <span className="rounded-full bg-lime px-3 py-1 text-xs font-extrabold text-petrol-800">
                    World #{university.rankings.world}
                  </span>
                )}
              </div>

              <h3 className={`mt-5 ${kit.h3}`}>{university.name}</h3>
              <p className={`mt-2 flex-1 text-[15px] leading-6 text-ink-soft`}>{summary}</p>

              {university.details.tuition && (
                <p className="mt-4 rounded-2xl bg-white px-4 py-2.5 text-xs font-semibold text-petrol-800 ring-1 ring-slate-200/80">
                  Tuition: <span className="font-bold">{university.details.tuition}</span>
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <Link
                  href={`/universities/${university.slug}`}
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-3 text-[14px] font-bold text-petrol-800 transition hover:border-petrol-800"
                >
                  View profile
                </Link>
                <ChinaSelectAction
                  university={university.name}
                  route={route}
                  label={`uni_card_${university.slug}`}
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-petrol-800 px-3 text-[14px] font-bold text-white transition hover:bg-petrol-700"
                >
                  Get study plan <ArrowRight size={14} aria-hidden="true" />
                </ChinaSelectAction>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 16. All 12 China Topic Guides */}
      <Section
        id="china-study-guide"
        tone="sage"
        title="Go deeper into your next question."
        intro="Each topic has its own guide, so you can focus on the part of your study plan that matters now."
      >
        <nav aria-label="China study topic guides">
          <ul data-anim="stagger" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.guides.map(guide => (
              <li key={guide.href}>
                <Link href={guide.href} className="group flex h-full flex-col rounded-3xl bg-white p-6 transition-colors hover:bg-lime-pale">
                  <span className="flex items-center justify-between gap-3 text-[18px] font-semibold text-petrol-800">
                    <span className="inline-flex items-center gap-2">
                      <BookOpen size={18} aria-hidden="true" />
                      {guide.title}
                    </span>
                    <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
                  </span>
                  <span className="mt-2 text-[15px] leading-6 text-ink-soft">{guide.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      {/* 17. Bottom Conversion Zone: Steps, Dhanmondi Office & Embedded Assessment Form */}
      <Section
        id="china-bottom-assessment"
        title="From your first question to your university plan."
        intro="Share your academic background and study goals. EduExpress helps you prepare a suitable shortlist, scholarship route and written cost plan. Parents are welcome to join the conversation."
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,480px)] lg:items-start lg:gap-12">
          <div>
            <div className="grid gap-5 sm:grid-cols-2">
              <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
                <Image
                  src="/images/home/consultation-family.webp"
                  alt="A student and parent meeting an EduExpress counsellor at the Dhanmondi office"
                  fill
                  sizes="(max-width:640px) 100vw, 320px"
                  className="object-cover"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-petrol-800">
                  Parents welcome in Dhanmondi
                </figcaption>
              </figure>
              <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
                <Image
                  src={content.photos.support.src}
                  alt={content.photos.support.alt}
                  fill
                  sizes="(max-width:640px) 100vw, 320px"
                  className="object-cover"
                />
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-petrol-800">
                  Written shortlist &amp; cost plan
                </figcaption>
              </figure>
            </div>

            <ol data-anim="stagger" className="mt-6 grid gap-4 sm:grid-cols-2">
              {content.steps.map((item, i) => (
                <li key={item.title} className={kit.cardSage}>
                  <span className="grid size-10 place-items-center rounded-full bg-lime font-display text-[18px] font-black text-petrol-800" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className={`mt-4 ${kit.h3}`}>{item.title}</h3>
                  <p className={`mt-2 ${kit.body}`}>{item.body}</p>
                </li>
              ))}
            </ol>

            {/* Dhanmondi Head Office Card */}
            <div className={`mt-5 ${kit.cardDark}`}>
              <p className="flex items-center gap-2 text-[19px] font-semibold text-lime">
                <ShieldCheck size={20} aria-hidden="true" />
                Visit our Dhanmondi Head Office — or speak to a China counsellor today
              </p>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-6 text-white/85">
                <li className="flex gap-2.5">
                  <MapPin size={18} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
                  <span>{address}</span>
                </li>
                <li className="flex gap-2.5">
                  <Clock3 size={18} className="mt-1 shrink-0 text-lime" aria-hidden="true" />
                  <span>{hours}</span>
                </li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={telHref} className="ed-btn ed-btn-signal min-h-[46px] px-5 text-[15px]">
                  <Phone size={16} aria-hidden="true" /> {formatBangladeshPhone(phone)}
                </a>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-on-dark min-h-[46px] px-5 text-[15px]">
                  <MessageCircle size={16} aria-hidden="true" /> WhatsApp Desk
                </a>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <ChinaPillarLeadForm
              sectionId="china-fit-form-bottom"
              headingAs="h3"
              phoneNumber={phone}
              whatsappNumber={whatsapp}
            />
          </div>
        </div>
      </Section>

      {/* 18. FAQs */}
      <div id="china-research-faq" className="scroll-mt-28">
        <FaqBlock items={content.faqs} title="Study in China: your questions answered." />
      </div>

      {/* 19. Closing CTA Band */}
      <CtaBand
        title="Plan your China study with us."
        text="Share your results, subject and budget. A counsellor replies within one working day with suitable universities, scholarship routes and every cost in writing."
        assessmentHref="#china-fit-form"
      />
    </article>
  );
}
