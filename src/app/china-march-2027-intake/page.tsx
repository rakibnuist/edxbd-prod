import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock3,
  FileCheck2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import March2027Experience from '@/components/campaigns/March2027Experience';
import March2027ContactLink from '@/components/campaigns/March2027ContactLink';
import StoryMarquee from '@/components/stories/StoryMarquee';
import { JsonLd, TrustBar, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { getChinaIntakes } from '@/lib/china-intakes';
import { canApplyToIntake } from '@/lib/intake-status';
import { publicMarchCatalogue } from '@/lib/march-campaign-catalogue';
import { getChinaMarch2027Landing } from '@/lib/intake-campaigns';
import { ogImage, pageMetadata } from '@/lib/seo';
import { getPublicTrustRecords } from '@/lib/trust-records';

export const revalidate = 1800;
const SITE = 'https://eduexpressint.com';
const PATH = '/china-march-2027-intake';
const canonical = `${SITE}${PATH}`;
const title = 'China March 2027 Intake & Fees | EduExpress International';
const description =
  'Compare China March 2027 intake options: university rankings, majors, tuition and scholarships. Get a free personalised application plan from EduExpress.';

export const metadata = pageMetadata({
  title,
  description,
  path: PATH,
  locale: 'en_GB',
  image: ogImage('march-2027', 'Students at a cultural event in China'),
});

const paymentPolicy =
  'No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds.';

const documents = [
  ['Academic documents', 'Certificates, transcripts, or current enrolment and expected-graduation evidence.'],
  ['Passport & photograph', 'A valid passport and a recent photograph meeting the programme requirements.'],
  [
    'Language & supporting evidence',
    'HSK or English evidence, health examination, police clearance and financial proof, where required.',
  ],
  ['Postgraduate applicants', 'A study plan, recommendation letters and programme-specific postgraduate documents.'],
];

export default async function Page() {
  const [trust, campaign] = await Promise.all([
    getPublicTrustRecords().catch(() => null),
    getChinaMarch2027Landing(),
  ]);
  const office = trust?.offices.find(item => item.isHeadOffice) ?? trust?.offices[0];
  const phone = office?.phonePrimary ?? config.contact.phone;
  const whatsapp = config.contact.whatsapp || phone;
  const address =
    office?.address ??
    `${config.contact.address.street}, ${config.contact.address.city} ${config.contact.address.postalCode}`;
  const hours = office?.hours ?? 'Saturday to Thursday, 11:00 AM to 6:00 PM';
  const supportPackage =
    trust?.servicePackages.find(item => item.slug === 'china-complete-support-package') ??
    trust?.servicePackages.find(item => item.destination.toLowerCase() === 'china');
  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hello, I would like a study plan for China March 2027 intake.'
  )}`;
  const marchIntake = getChinaIntakes().find(row => row.activeCampaignHref === PATH);
  const universityCount = campaign.universities.length;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE}/#website` },
        publisher: { '@id': `${SITE}/#organization` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'China March 2027 intake', item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: campaign.faqs.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'ItemList',
        name: 'China spring university planning shortlist',
        numberOfItems: campaign.universities.length,
        itemListElement: campaign.universities.map((university, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CollegeOrUniversity',
            name: university.name,
            logo: `${SITE}${university.logo}`,
            address: { '@type': 'PostalAddress', addressLocality: university.city, addressCountry: 'CN' },
          },
        })),
      },
    ],
  };

  return (
    <div lang="en" className="min-h-screen bg-white pb-24 text-petrol-800 lg:pb-0">
      <JsonLd data={schema} />

      {/* 2-Tier Executive Campaign Header */}
      <header className="sticky top-0 z-40 shadow-[0_8px_28px_-18px_rgba(6,26,43,0.35)]">
        {/* Tier 1: Executive Top Institutional Bar */}
        <div className="border-b border-white/10 bg-[#051827] px-5 text-xs text-white/85 sm:px-8">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-1.5 py-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {marchIntake && (
                <span className="inline-flex items-center gap-1.5 font-bold text-lime">
                  <CalendarCheck size={14} className="shrink-0" aria-hidden="true" />
                  March 2027 Intake: {marchIntake.status}
                </span>
              )}
              {marchIntake && (canApplyToIntake(marchIntake.status) || marchIntake.status === 'Next Intake') && (
                <span className="hidden items-center gap-1.5 text-white/80 sm:inline-flex">
                  <span aria-hidden="true" className="text-white/30">
                    •
                  </span>
                  Deadline: <strong className="font-semibold text-white">{marchIntake.deadlineLabel}</strong>
                </span>
              )}
              <span className="hidden items-center gap-1.5 text-white/75 md:inline-flex">
                <span aria-hidden="true" className="text-white/30">
                  •
                </span>
                <MapPin size={13} className="text-lime" aria-hidden="true" />
                Dhanmondi Head Office, Dhaka
              </span>
            </div>

            <div className="flex items-center gap-4 font-semibold">
              <Link href="/" className="inline-flex items-center gap-1 text-white/85 transition hover:text-lime">
                <ArrowLeft size={13} aria-hidden="true" />
                Main Website
              </Link>
              <span aria-hidden="true" className="text-white/25">
                |
              </span>
              <Link href="/universities" className="hidden text-white/85 transition hover:text-lime sm:inline">
                All 120 Universities
              </Link>
              <span aria-hidden="true" className="hidden text-white/25 sm:inline">
                |
              </span>
              <Link href="/china-intakes-deadlines" className="text-lime underline underline-offset-4 hover:text-white">
                All China intakes →
              </Link>
            </div>
          </div>
        </div>

        {/* Tier 2: Main Sticky Navigation Bar */}
        <div className="border-b border-slate-200/90 bg-white/95 px-5 backdrop-blur-md sm:px-8">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-4 sm:gap-5">
              <Link href="/" aria-label="EduExpress International home" className="shrink-0">
                <Image
                  src="/logo.png"
                  alt="EduExpress International"
                  width={205}
                  height={58}
                  className="h-auto w-36 sm:w-44"
                  priority
                />
              </Link>

              <div className="hidden h-7 w-px bg-slate-200 sm:block" aria-hidden="true" />

              <div className="hidden sm:block xl:hidden 2xl:block">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2c6a97]">
                  China Spring 2027
                </p>
                <p className="text-xs font-bold text-petrol-800">Official Intake Desk</p>
              </div>

              <nav
                aria-label="Campaign sections"
                className="hidden items-center gap-1 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-1 text-[13px] font-bold text-slate-600 lg:flex"
              >
                <a
                  href="#study-options"
                  className="rounded-xl px-3 py-1.5 transition hover:bg-white hover:text-petrol-800 hover:shadow-2xs"
                >
                  {universityCount} Universities
                </a>
                <a
                  href="#costs"
                  className="rounded-xl px-3 py-1.5 transition hover:bg-white hover:text-petrol-800 hover:shadow-2xs"
                >
                  Cost Plan
                </a>
                <a
                  href="#support-package"
                  className="rounded-xl px-3 py-1.5 transition hover:bg-white hover:text-petrol-800 hover:shadow-2xs"
                >
                  Support Package
                </a>
                <a
                  href="#documents"
                  className="rounded-xl px-3 py-1.5 transition hover:bg-white hover:text-petrol-800 hover:shadow-2xs"
                >
                  Documents
                </a>
                <a
                  href="#student-stories"
                  className="rounded-xl px-3 py-1.5 transition hover:bg-white hover:text-petrol-800 hover:shadow-2xs"
                >
                  Student Stories
                </a>
                <a
                  href="#faq"
                  className="rounded-xl px-3 py-1.5 transition hover:bg-white hover:text-petrol-800 hover:shadow-2xs"
                >
                  FAQ
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <March2027ContactLink
                kind="phone"
                href={`tel:${phone}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-petrol-800 transition hover:border-petrol-800/30 hover:bg-slate-100 sm:px-3.5 sm:text-sm"
              >
                <Phone size={15} className="text-[#12436b]" aria-hidden="true" />
                <span className="hidden md:inline">{formatBangladeshPhone(phone)}</span>
                <span className="md:hidden">Call</span>
              </March2027ContactLink>

              <March2027ContactLink
                kind="whatsapp"
                href={whatsappHref}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100 sm:px-3.5 sm:text-sm"
              >
                <MessageCircle size={15} className="text-emerald-700" aria-hidden="true" />
                <span>WhatsApp</span>
              </March2027ContactLink>

              <a
                href="#march-2027-assessment"
                className="ed-btn ed-btn-signal hidden min-h-10 px-4 text-xs font-extrabold sm:inline-flex sm:text-sm"
              >
                Free Study Plan
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero + Lead Form + 18-University Catalogue */}
      <March2027Experience universities={publicMarchCatalogue(campaign.universities)} whatsappNumber={whatsapp} />

      <TrustBar universities={campaign.universities.length} />

      {/* Cost Plan & Complete China Support Package */}
      <section id="costs" aria-labelledby="cost-title" className="scroll-mt-24 bg-canvas-soft px-5 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-petrol-800 shadow-2xs">
              Written Cost Governance
            </span>
            <h2 id="cost-title" data-anim="up" className={`mt-3 ${kit.h2}`}>
              See the full cost before you commit.
            </h2>
            <p className={`mt-4 ${kit.lead}`}>
              Your written cost plan separates university fees, living expenses and EduExpress services, so you know what to pay, who receives it and when it is due.
            </p>
          </div>

          {/* Preserve exact 2 <article> elements here */}
          <div data-anim="stagger" className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              {
                title: 'Before you travel',
                subtitle: 'Stage 1 · In Bangladesh',
                items: [
                  ['University', 'Application fees and any required admission or tuition deposit.'],
                  ['Third parties', 'Any university or third-party costs outside your package, itemised in writing.'],
                  ['EduExpress', 'Your selected package price and written payment terms.'],
                ],
              },
              {
                title: 'After arrival in China',
                subtitle: 'Stage 2 · On Campus in China',
                items: [
                  ['Study', 'Tuition after any supported scholarship reduction.'],
                  ['Stay', 'Accommodation, meals, utilities and personal living expenses.'],
                  ['Formalities', 'Insurance, medical examination, residence permit and other applicable charges.'],
                ],
              },
            ].map(group => (
              <article
                key={group.subtitle}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <h3 className={kit.h3}>{group.title}</h3>
                  <span className={kit.badge}>{group.subtitle}</span>
                </div>
                <dl className="mt-5 space-y-4">
                  {group.items.map(([label, copy]) => (
                    <div key={label} className="grid grid-cols-[7rem_1fr] gap-3 text-[15.5px]">
                      <dt className="font-bold text-petrol-800">{label}</dt>
                      <dd className="leading-7 text-ink-soft">{copy}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          {supportPackage && (
            <section
              id="support-package"
              aria-labelledby="support-package-title"
              className="mt-7 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm"
            >
              <div className="grid gap-5 bg-gradient-to-r from-[#071f33] via-petrol-800 to-[#12436b] p-6 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
                <div>
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime">
                    <Sparkles size={13} aria-hidden="true" />
                    One package · Application to arrival
                  </p>
                  <h3
                    id="support-package-title"
                    className="mt-3 font-display text-[28px] font-black leading-[1.05] text-lime sm:text-[34px]"
                  >
                    {supportPackage.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-[16px] leading-7 text-white/85">{supportPackage.summary}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 sm:text-right">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/75">Complete support package</p>
                  <strong className="mt-1 block font-display text-[32px] font-black text-lime sm:text-[36px]">
                    {supportPackage.priceLabel}
                  </strong>
                  <p className="mt-0.5 text-xs text-white/80">Payable only after visa approval</p>
                </div>
              </div>

              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_.8fr]">
                <div>
                  <h4 className="text-[17px] font-bold text-petrol-800">
                    Everything included in your support package
                  </h4>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {supportPackage.includedItems.map((entry: string) => (
                      <li key={entry} className="flex gap-2.5 text-[15px] leading-6 text-ink-soft">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lime text-petrol-800">
                          <Check size={13} strokeWidth={3} aria-hidden="true" />
                        </span>
                        <span>{entry}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`${kit.cardLime} border border-lime-deep/20`}>
                  <p className="flex items-center gap-2 text-[14px] font-bold text-lime-deep">
                    <ShieldCheck size={18} aria-hidden="true" />
                    EduExpress service charge policy
                  </p>
                  <p lang="bn" className="mt-3 text-[1.65rem] font-bold leading-relaxed text-petrol-800">
                    ভিসার আগে এক টাকাও না।
                  </p>
                  <p className="mt-2 text-[16px] font-bold text-petrol-800">
                    No EduExpress service fee before visa approval.
                  </p>
                  <p className="mt-3 text-[15px] leading-6 text-ink-soft">
                    University and third-party charges, including required deposits, are separate and itemised in writing before you proceed.
                  </p>
                  <Link href="/china-visa-first-policy" className={`mt-4 ${kit.link} text-[15px]`}>
                    Read the payment policy
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <details className="group border-t border-canvas-soft bg-[#f8fafc]/60">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-6 py-4 text-[16px] font-bold text-petrol-800 sm:px-8 [&::-webkit-details-marker]:hidden">
                  Package terms & additional study costs
                  <ChevronDown
                    size={18}
                    className="shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="space-y-4 px-6 pb-7 text-[15px] leading-7 text-ink-soft sm:px-8">
                  <p>{supportPackage.outcomeScope}</p>
                  <div>
                    <h4 className="font-bold text-petrol-800">Paid separately</h4>
                    <ul className="mt-2 list-disc pl-5">
                      {supportPackage.excludedItems.map((entry: string) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-petrol-800">Payment terms</h4>
                    <p>{supportPackage.paymentTerms}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-petrol-800">Refund terms</h4>
                    <p>{supportPackage.refundTerms}</p>
                  </div>
                  <p>{paymentPolicy}</p>
                  <p>Package prices remain in BDT; university fees remain in CNY. No assumed exchange rate is applied.</p>
                </div>
              </details>
            </section>
          )}
        </div>
      </section>

      {/* Application Dossier & Dhanmondi Consultation Section */}
      <section id="documents" aria-labelledby="file-title" className="scroll-mt-24 px-5 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[.88fr_1.12fr] lg:items-center lg:gap-14">
          <div>
            <div data-anim="up" className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 shadow-md">
              <Image
                src="/images/home/consultation-family.webp"
                alt="A student and parent meeting an EduExpress counsellor at the Dhanmondi office"
                fill
                sizes="(max-width:1023px) 100vw, 480px"
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex gap-3 rounded-2xl border border-slate-200/80 bg-[#f8fafc] p-4 text-[15px] leading-6 text-ink-soft">
              <MapPin size={20} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
              <p>
                <strong className="font-bold text-petrol-800">Dhanmondi Head Office:</strong> {address}
                <br />
                <span className="font-semibold text-petrol-800">Parents are welcome to join your consultation.</span>
              </p>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-lime-deep">
              Application Dossier Checklist
            </span>
            <h2 id="file-title" data-anim="up" className={`mt-3 ${kit.h2}`}>
              Turn your plan into an application.
            </h2>
            <p className={`mt-4 ${kit.lead}`}>
              First, we review your profile. Then we agree on the programme, costs and service terms. Your personalised checklist guides the next step: preparing a complete application file.
            </p>
            <dl className="mt-6 divide-y divide-canvas-soft border-y border-canvas-soft">
              {documents.map(([label, copy]) => (
                <div key={label} className="flex gap-3.5 py-4">
                  <span className={`${kit.iconLime} !size-10`}>
                    <FileCheck2 size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-[17px] font-bold text-petrol-800">{label}</dt>
                    <dd className="mt-1 text-[15px] leading-6 text-ink-soft">{copy}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[15px] leading-6 text-ink-soft">
              Documents apply to both self-funded and scholarship applicants. Your selected programme determines the final checklist.
            </p>
            <a href="#march-2027-assessment" className="ed-btn ed-btn-signal mt-6 min-h-[52px] px-7">
              Get my free study plan
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Real Student Testimonials Section (single-line infinite loop carousel, uses <div> cards to preserve exact <article> count) */}
      {(trust?.testimonials?.length ?? 0) > 0 && (
        <section id="student-stories" aria-labelledby="student-stories-title" className="scroll-mt-24 overflow-hidden bg-petrol-800 py-14 text-white lg:py-20">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-lime">
                  Real Student Outcomes · Since 2018
                </span>
                <h2 id="student-stories-title" data-anim="up" className={`mt-3 ${kit.h2OnDark}`}>
                  Real students studying in China.
                </h2>
                <p className="mt-3 text-[17px] leading-7 text-white/80">
                  What our students say about their scholarship outcomes, visa processing in Dhaka, and campus arrival in China.
                </p>
              </div>
              <Link
                href="/china-success-stories"
                className="ed-btn ed-btn-on-dark min-h-12 px-6 text-sm"
              >
                Read all China stories
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <StoryMarquee
              asElement="div"
              stories={trust!.testimonials.map(story => ({
                id: story.id,
                name: story.displayName || story.studentName,
                quote: story.content,
                image: story.image || undefined,
                program: story.program || undefined,
                university: story.university || undefined,
                location: story.location || undefined,
                country: story.country || undefined,
                rating: story.rating,
              }))}
            />
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 bg-canvas-soft px-5 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[.65fr_1.35fr] lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-petrol-800 shadow-2xs">
              March 2027 Intake FAQ
            </span>
            <h2 id="faq-title" data-anim="up" className={`mt-3 ${kit.h2}`}>
              Questions before your next step?
            </h2>
            <p className={`mt-4 ${kit.lead}`}>Talk to a counsellor about your specific study goals.</p>
            <March2027ContactLink
              kind="phone"
              href={`tel:${phone}`}
              className="ed-btn ed-btn-outline mt-5 min-h-[52px] px-6"
            >
              <Phone size={17} aria-hidden="true" />
              {formatBangladeshPhone(phone)}
            </March2027ContactLink>
          </div>
          <div data-anim="stagger" className="grid gap-3">
            {campaign.faqs.map(item => (
              <details
                key={item.question}
                className="faq-smooth group rounded-3xl border border-slate-200/70 bg-white px-6 shadow-2xs"
              >
                <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-5 py-4 text-[17px] font-bold leading-snug text-petrol-800 [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-[22px] leading-none text-petrol-800 transition group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 pr-10 text-[16px] leading-7 text-ink-soft">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Executive CTA Band */}
      <section className="border-b border-white/10 bg-gradient-to-r from-[#071f33] via-petrol-800 to-[#12436b] px-5 py-14 text-white sm:px-8 lg:py-16">
        <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-lime">
              Free Profile Assessment · Dhaka Office
            </span>
            <h2 data-anim="pop" className="mt-3 font-display text-[34px] font-black leading-[0.98] text-lime sm:text-[44px]">
              Your next step starts with your profile.
            </h2>
            <p className="mt-3 text-[18px] text-white/85">
              Your universities, funding options and costs. One clear plan in writing.
            </p>
          </div>
          <a href="#march-2027-assessment" className="ed-btn ed-btn-signal min-h-[54px] shrink-0 px-7">
            Get my free study plan
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* Executive Institutional Campaign Footer */}
      <footer className="bg-[#051827] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <Link href="/" aria-label="EduExpress International home" className="inline-block">
                <Image src="/white-logo.png" alt="EduExpress International" width={190} height={54} className="h-auto w-44" />
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
                Bangladesh&apos;s evidence-first study abroad consultancy since 2018. Every university route, scholarship condition, and cost schedule provided in writing before you commit.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Since 2018', 'BDT 0 Before China Visa', 'Parents Welcome'].map(badge => (
                  <span
                    key={badge}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-lime"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-lime">China Study Guides</h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-white/80">
                {[
                  ['/study-in-china-from-bangladesh', 'Study in China guide'],
                  ['/china-intakes-deadlines', 'Intakes & deadlines'],
                  ['/china-scholarships-bangladesh', 'Scholarships'],
                  ['/study-in-china-cost-bangladesh', 'Study costs'],
                  ['/china-admission-requirements', 'Admission requirements'],
                  ['/china-student-visa-bangladesh', 'Student visa'],
                  ['/universities', 'All 120 universities'],
                  ['/china-visa-first-policy', 'Visa-first policy'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="transition hover:text-lime">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-lime">Dhanmondi Head Office</p>
              <p className="mt-2.5 flex items-start gap-2 text-white/85">
                <MapPin size={16} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
                <span>{address}</span>
              </p>
              <p className="mt-2 flex items-center gap-2 text-white/75">
                <Clock3 size={15} className="shrink-0 text-lime" aria-hidden="true" />
                <span>{hours}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-lime hover:text-petrol-800"
                >
                  <Phone size={14} aria-hidden="true" />
                  {formatBangladeshPhone(phone)}
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-lime px-3.5 py-2 text-xs font-bold text-petrol-800 transition hover:bg-white"
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  WhatsApp Desk
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-3 text-xs text-white/65 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} EduExpress International · Evidence-First Study Abroad Consultancy</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                Service terms
              </Link>
              <Link href="/fees-and-transparency" className="transition hover:text-white">
                Fee policy
              </Link>
              <Link href="/contact" className="transition hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
