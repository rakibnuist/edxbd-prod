import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, Clock, FileCheck2, MapPin, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { CtaBand, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { pageMetadata } from '@/lib/seo';
import { getPublicTrustRecords } from '@/lib/trust-records';

const PATH = '/proof-library';
const PAGE_URL = `https://eduexpressint.com${PATH}`;

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Proof Library: Company Records & Evidence | EduExpress',
  description:
    'Inspect EduExpress company records with definitions, privacy-safe authorization and admission evidence, published student feedback and our Dhanmondi office.',
  path: PATH,
  image: { url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — proof library' },
});

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: 'EduExpress proof library',
  description: 'Company records with definitions, privacy-safe authorization and admission evidence, student feedback and office details.',
  inLanguage: 'en-BD',
  about: { '@id': 'https://eduexpressint.com/#organization' },
  isPartOf: { '@id': 'https://eduexpressint.com/#website' },
  breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
};

export default async function ProofLibraryPage() {
  // getPublicTrustRecords applies the public story rule (published, not taken down).
  // Never query published testimonials independently on a public page.
  const trust = await getPublicTrustRecords();
  const testimonials = trust.testimonials;
  const office = trust.offices[0];

  const contents = [
    trust.metrics.length > 0 && { href: '#company-records', label: 'Company records with definitions' },
    { href: '#evidence', label: 'Authorizations and application evidence' },
    testimonials.length > 0 && { href: '#student-feedback', label: 'Published student feedback' },
    office && { href: '#office-record', label: 'Real office record' },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Proof library' }]}
        eyebrow="Public evidence register"
        title="Trust should be inspectable."
        lead="Company records, approved evidence and real student feedback are managed in the central database. Private identifiers never belong on a public page."
        actions={
          <>
            <Link href="/contact" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              Arrange an office inspection <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/how-we-verify-universities" className="ed-btn ed-btn-outline min-h-[52px] px-7">How we verify universities</Link>
          </>
        }
        aside={
          <div className={kit.cardDark}>
            <span className={kit.iconLime}><ShieldCheck size={22} aria-hidden="true" /></span>
            <p className="mt-6 text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime">Publication rule</p>
            <p className="mt-2 text-[16px] leading-7 text-white/80">No passport number, date of birth, visa identifier or private student record is made public.</p>
            <nav aria-label="In this library" className="mt-6 border-t border-white/15 pt-4">
              <ul className="grid gap-1">
                {contents.map(item => (
                  <li key={item.href}>
                    <a href={item.href} className="group flex min-h-[44px] items-center justify-between gap-3 text-[16px] font-semibold text-white">
                      {item.label}
                      <ArrowRight size={16} className="shrink-0 text-lime transition group-hover:translate-x-1" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        }
      />

      <TrustBar />

      {trust.metrics.length > 0 && (
        <Section id="company-records" title="Company records with definitions." intro="Every figure states what it counts and where it comes from. Read the definition before relying on the number.">
          <ul data-anim="stagger" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {trust.metrics.map((metric, index) => (
              <li key={metric.id} className={`${index === 0 ? kit.cardLime : kit.cardSage} flex flex-col`}>
                <p className="font-display text-[52px] font-black leading-none text-petrol-800">{metric.value}</p>
                <h3 className={`mt-4 ${kit.h3}`}>{metric.label}</h3>
                <p className="mt-2 text-[16px] leading-7 text-ink-soft">{metric.definition}</p>
                {metric.evidenceNote && (
                  <div className="mt-auto pt-5">
                    <p className="border-t border-petrol-800/10 pt-4 text-[14px] font-semibold leading-6 text-ink-soft">{metric.evidenceNote}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        tone="sage"
        id="evidence"
        title="Authorizations and application evidence."
        intro="Current institutional records and clearly labelled archive records are shown separately from student identity. Every public outcome preview has been privacy checked."
        action={
          trust.evidence.length > 0 ? (
            <span className="rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-petrol-800">
              {trust.evidence.length} public record{trust.evidence.length === 1 ? '' : 's'}
            </span>
          ) : undefined
        }
      >
        {trust.evidence.length ? (
          <ul data-anim="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trust.evidence.map(asset => {
              const archive = asset.type.includes('archive');
              return (
                <li key={asset.id} className="flex flex-col overflow-hidden rounded-3xl bg-white">
                  <div className="relative aspect-[3/4] bg-chalk-100">
                    {asset.thumbnailUrl ? (
                      <Image src={asset.thumbnailUrl} alt={`Privacy safe preview: ${asset.title}`} fill sizes="(max-width:640px) 100vw, 300px" className="object-contain p-3" />
                    ) : (
                      <div className="grid h-full place-items-center"><FileCheck2 size={46} className="text-petrol-800" aria-hidden="true" /></div>
                    )}
                    <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[14px] font-semibold ${archive ? 'bg-white text-petrol-800 ring-1 ring-petrol-800/20' : 'bg-petrol-800 text-white'}`}>
                      {archive ? 'Archive record' : 'Public evidence'}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[14px] font-semibold capitalize text-ink-soft">{asset.type.replaceAll('_', ' ')}</span>
                    <h3 className="mt-2 text-[19px] font-semibold leading-snug text-petrol-800">{asset.title}</h3>
                    {asset.summary && <p className="mt-2 text-[15px] leading-6 text-ink-soft">{asset.summary}</p>}
                    {asset.university && (
                      <Link href={`/universities/${asset.university.slug}`} className={`${kit.link} mt-3 min-h-[44px] text-[15px]`}>
                        View {asset.university.name}
                      </Link>
                    )}
                    <p className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[14px] font-semibold text-green-600">
                      <ShieldCheck size={15} aria-hidden="true" /> Privacy checked
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div data-anim="up" className="grid overflow-hidden rounded-3xl bg-white lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative min-h-[240px]">
              <Image
                src="/images/office/admission-packets.webp"
                alt="Admission envelopes from Nanjing University of Information Science and Technology with EduExpress file notes"
                fill
                sizes="(max-width:1024px) 100vw, 520px"
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-9">
              <span className={kit.iconLime}><FileCheck2 size={22} aria-hidden="true" /></span>
              <h3 className="mt-6 font-display text-[30px] font-black leading-[1] tracking-[-0.01em] text-petrol-800">Inspect privacy safe records at the Dhanmondi decision desk.</h3>
              <p className={`mt-4 ${kit.body}`}>
                Admission notices, JW201 or JW202 records and authorization documents may contain sensitive identifiers. EduExpress shows an approved redacted copy publicly or arranges a controlled office inspection.
              </p>
              <Link href="/contact" className="ed-btn ed-btn-signal mt-6 min-h-[52px] px-7">
                Arrange an inspection <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </Section>

      {testimonials.length > 0 && (
        <Section
          id="student-feedback"
          title="Published student feedback."
          action={<Link href="/success-stories" className="ed-btn ed-btn-outline min-h-[48px] px-6">Full student stories <ArrowRight size={16} aria-hidden="true" /></Link>}
        >
          <ul data-anim="stagger" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map(item => (
              <li key={item.id} className={`${kit.cardSage} flex flex-col`}>
                <MessageSquareQuote size={24} className="text-petrol-800" aria-hidden="true" />
                <blockquote className="mt-4 text-[16px] leading-7 text-ink-soft">&ldquo;{item.content}&rdquo;</blockquote>
                <div className="mt-auto pt-5">
                  <p className="border-t border-petrol-800/10 pt-4 text-[16px] font-semibold text-petrol-800">{item.displayName || item.studentName}</p>
                  {(item.university || item.country) && (
                    <p className="mt-0.5 text-[14px] text-ink-soft">{[item.university, item.country].filter(Boolean).join(', ')}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {office && (
        <Section tone="navy" id="office-record" title="The office behind the records." intro="Privacy-sensitive records can be inspected at the office by arrangement.">
          <div data-anim="up" className="grid overflow-hidden rounded-3xl border border-white/15 lg:grid-cols-[.8fr_1.2fr]">
            {office.photoUrl ? (
              <div className="relative min-h-[240px]">
                <Image src={office.photoUrl} alt="Reception of the EduExpress office in Dhanmondi, Dhaka" fill sizes="(max-width:1024px) 100vw, 460px" className="object-cover" />
              </div>
            ) : (
              <div className="grid min-h-[200px] place-items-center"><Building2 size={48} className="text-lime" aria-hidden="true" /></div>
            )}
            <div className="p-6 sm:p-9">
              <p className="text-[14px] font-semibold uppercase tracking-[0.12em] text-white/70">Real office record</p>
              <h3 className="mt-3 text-[24px] font-semibold leading-snug text-lime">{office.name}</h3>
              <ul className="mt-5 space-y-3 text-[16px] leading-6 text-white/85">
                <li className="flex gap-3"><MapPin size={19} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /><span>{office.address}</span></li>
                <li className="flex gap-3"><Clock size={19} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /><span>{office.hours}</span></li>
              </ul>
              <Link href="/contact" className="ed-btn ed-btn-signal mt-7 min-h-[52px] px-7">
                Visit or contact us <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Section>
      )}

      <CtaBand title="Judge us on the record." text="Start the free assessment and every recommendation, cost and responsibility you receive comes in writing, the same standard this library is held to." />
    </>
  );
}
