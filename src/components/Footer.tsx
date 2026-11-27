import Image from 'next/image';
import Link from 'next/link';
import { formatBangladeshPhone } from '@/lib/contact-format';
import FooterCta from '@/components/FooterCta';
import { CookieSettingsButton } from '@/components/CookieConsent';
import {
  ArrowUpRight,
  Clock3,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Youtube,
} from 'lucide-react';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';
import { toSafeSitePathOrUrl } from '@/lib/safe-url';
import { getPublicTrustRecords } from '@/lib/trust-records';

// 3 cleanly organized navigation columns with short, scannable labels that don't wrap awkwardly
const chinaLinks = [
  { name: 'March 2027 Intake', href: '/china-march-2027-intake', badge: 'Open' },
  { name: 'China Study Guide', href: '/study-in-china-from-bangladesh' },
  { name: 'Scholarships & CSC', href: '/china-scholarships-bangladesh' },
  { name: 'Tuition & Living Costs', href: '/study-in-china-cost-bangladesh' },
  { name: 'After O/A-Level & SSC', href: '/study-in-china-after-o-level-ssc' },
  { name: 'MBBS in China', href: '/mbbs-in-china-bangladesh' },
  { name: 'Student Visa (X1/X2)', href: '/china-student-visa-bangladesh' },
  { name: 'Intakes & Deadlines', href: '/china-intakes-deadlines' },
];

const exploreLinks = [
  { name: 'University Directory', href: '/universities' },
  { name: 'Programs by Budget', href: '/programs' },
  { name: 'Compare Study Costs', href: '/compare-costs' },
  { name: 'Study Gap Guide (12 Countries)', href: '/study-gap-acceptable-countries-bangladesh' },
  { name: 'Visa Bank Solvency & File', href: '/student-visa-bank-solvency-bangladesh' },
  { name: 'Study Without IELTS (MOI)', href: '/study-abroad-without-ielts-from-bangladesh' },
  { name: 'BMDC Foreign Medical List', href: '/bmdc-recognized-medical-colleges-abroad' },
  { name: 'e-Apostille & Attestation', href: '/document-attestation-apostille-bangladesh' },
  { name: 'All 12 Destinations', href: '/destinations' },
  { name: 'Free Fit Assessment', href: '/education-fit-assessment' },
];

const companyLinks = [
  { name: 'About EduExpress', href: '/about' },
  { name: 'Founder & Editorial Profile', href: '/author/abdullah-al-rakib' },
  { name: 'Dhanmondi Head Office', href: '/education-consultant-dhaka' },
  { name: 'How It Works', href: '/your-study-journey' },
  { name: 'For Parents & Families', href: '/for-parents' },
  { name: 'Proof & Visa Library', href: '/proof-library' },
  { name: 'Fee Transparency Policy', href: '/fees-and-transparency' },
  { name: 'Media & Press Room', href: '/press' },
  { name: 'B2B Partner Desk', href: '/b2b' },
];

const legalLinks = [
  ['Privacy Policy', '/privacy'],
  ['Terms of Service', '/terms'],
  ['Fee Policy', '/fees-and-transparency'],
  ['Student Data Privacy', '/student-data-privacy'],
  ['Complaints & Resolution', '/complaints-and-resolution'],
];

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/eduexpressint', icon: Facebook },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/eduexpressint', icon: Linkedin },
  { name: 'Instagram', href: 'https://www.instagram.com/eduexpressint/', icon: Instagram },
  { name: 'YouTube', href: 'https://www.youtube.com/@EduExpressInt', icon: Youtube },
];

const linkClass = 'text-[13.5px] leading-snug text-white/70 transition-colors hover:text-lime';

export default async function Footer() {
  const { offices } = await getPublicTrustRecords();
  const office = offices.find(item => item.isHeadOffice) ?? offices[0];
  const whatsapp = office?.phonePrimary
    ? `https://wa.me/${office.phonePrimary.replace(/\D/g, '')}?text=${encodeURIComponent(
        'Assalamu alaikum. I would like counselling for studying abroad.'
      )}`
    : null;

  return (
    <footer
      id="site-footer"
      className="site-footer relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#082238] via-[#061c2e] to-[#041320] text-white"
    >
      <FooterCta />

      <div className="mx-auto max-w-[1200px] px-5 pb-32 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
        {/* Main 2-Column Grid on Desktop: Brand (5 cols) + Nav (7 cols) */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Brand & Accreditations Column */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <Link href="/" aria-label="EduExpress International home" className="inline-block">
                <Image
                  src="/white-logo.png"
                  alt="EduExpress International"
                  width={200}
                  height={56}
                  className="h-auto w-44"
                />
              </Link>

              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/75">
                Bangladesh&apos;s evidence-first study abroad consultancy since 2018. Compare verified universities, realistic scholarship tiers, and your complete written cost schedule from our Dhanmondi head office.
              </p>

              {/* Verified Association Badges in clean 2-column grid */}
              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:max-w-md">
                <a
                  href="https://cbcabd.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 transition hover:border-lime/40 hover:bg-white/[0.07]"
                >
                  <ShieldCheck size={16} className="shrink-0 text-lime" aria-hidden="true" />
                  <div className="min-w-0 text-left">
                    <p className="text-[11px] font-bold text-white group-hover:text-lime">CBCA Member #08</p>
                    <p className="truncate text-[10px] text-white/60">China-BD Cultural Exch.</p>
                  </div>
                </a>

                <a
                  href="https://www.facdcab.org/members/directory/2264"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 transition hover:border-lime/40 hover:bg-white/[0.07]"
                >
                  <ShieldCheck size={16} className="shrink-0 text-lime" aria-hidden="true" />
                  <div className="min-w-0 text-left">
                    <p className="text-[11px] font-bold text-white group-hover:text-lime">FACD-CAB FCM-452</p>
                    <p className="truncate text-[10px] text-white/60">Govt Reg. #2264</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Links & Trust Line */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                {socialLinks.map(({ name, href, icon: Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`EduExpress on ${name}`}
                    className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-lime hover:bg-lime hover:text-petrol-800"
                  >
                    <Icon size={15} aria-hidden="true" />
                  </a>
                ))}
              </div>
              <span className="hidden text-white/30 sm:inline" aria-hidden="true">·</span>
              <span className="font-medium text-white/60">BDT 0 service fee before visa</span>
            </div>
          </div>

          {/* Navigation Columns (7 cols) - 3 balanced columns with generous breathing room */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {/* Column 1: Study in China */}
            <nav aria-label="Study in China">
              <h2 className="border-b border-white/10 pb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-lime">
                Study in China
              </h2>
              <ul className="mt-3.5 space-y-2.5">
                {chinaLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`${linkClass} inline-flex items-center gap-1.5`}
                    >
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="rounded-full bg-lime px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-petrol-800">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Column 2: Explore & Compare */}
            <nav aria-label="Explore & Compare">
              <h2 className="border-b border-white/10 pb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-lime">
                Explore &amp; Tools
              </h2>
              <ul className="mt-3.5 space-y-2.5">
                {exploreLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Column 3: Company & Trust */}
            <nav aria-label="Company & Trust" className="col-span-2 sm:col-span-1">
              <h2 className="border-b border-white/10 pb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-lime">
                Company &amp; Trust
              </h2>
              <ul className="mt-3.5 space-y-2.5">
                {companyLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Clean Office & Contact Bar */}
        <section
          aria-label="Head office and contact details"
          className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
        >
          <div className="grid gap-6 divide-y divide-white/10 sm:grid-cols-2 sm:gap-6 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
            {/* Address */}
            <div className="flex gap-3 pt-4 sm:pt-0">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-lime/10 text-lime">
                <MapPin size={16} aria-hidden="true" />
              </span>
              <div className="min-w-0 text-xs leading-relaxed">
                <p className="font-semibold text-white">Dhanmondi Head Office</p>
                <p className="mt-0.5 text-white/70">
                  {office?.address ?? DEFAULT_OFFICE_RECORD.address}
                </p>
                {(() => {
                  const safeMapUrl = toSafeSitePathOrUrl(office?.mapUrl);
                  return safeMapUrl ? (
                    <a
                      href={safeMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 font-medium text-lime hover:underline"
                    >
                      <Navigation size={10} aria-hidden="true" /> View on Google Maps
                    </a>
                  ) : null;
                })()}
              </div>
            </div>

            {/* Counselling Hours */}
            <div className="flex gap-3 pt-4 sm:pt-0 lg:pl-6">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-lime/10 text-lime">
                <Clock3 size={16} aria-hidden="true" />
              </span>
              <div className="min-w-0 text-xs leading-relaxed">
                <p className="font-semibold text-white">Counselling Hours</p>
                <p className="mt-0.5 text-white/70">
                  {office?.hours ?? DEFAULT_OFFICE_RECORD.hours}
                </p>
                <p className="mt-0.5 font-medium text-lime">Parents welcome at every session</p>
              </div>
            </div>

            {/* Direct Phone */}
            <div className="flex gap-3 pt-4 sm:pt-0 lg:pl-6">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-lime/10 text-lime">
                <Phone size={16} aria-hidden="true" />
              </span>
              <div className="min-w-0 text-xs leading-relaxed">
                <p className="font-semibold text-white">Admissions Desk</p>
                {office?.phonePrimary ? (
                  <div className="mt-0.5 space-y-0.5">
                    <a href={`tel:${office.phonePrimary}`} data-tracking-type="phone" className="block text-white/85 hover:text-lime">
                      {formatBangladeshPhone(office.phonePrimary)}
                    </a>
                    {office.phoneSecondary && (
                      <a href={`tel:${office.phoneSecondary}`} data-tracking-type="phone" className="block text-white/60 hover:text-lime">
                        {formatBangladeshPhone(office.phoneSecondary)}
                      </a>
                    )}
                  </div>
                ) : (
                  <Link href="/contact" className="mt-0.5 block text-white/75 hover:text-lime">
                    Contact details
                  </Link>
                )}
              </div>
            </div>

            {/* Instant Support */}
            <div className="flex gap-3 pt-4 sm:pt-0 lg:pl-6">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-lime/10 text-lime">
                <MessageCircle size={16} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1 text-xs leading-relaxed">
                <p className="font-semibold text-white">Online Helpdesk</p>
                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-tracking-type="whatsapp"
                    className="mt-0.5 block font-medium text-lime hover:underline"
                  >
                    Chat on WhatsApp →
                  </a>
                )}
                {office?.email && (
                  <a
                    href={`mailto:${office.email}`}
                    className="mt-0.5 flex items-center gap-1 truncate text-white/70 hover:text-white"
                  >
                    <Mail size={11} className="shrink-0 text-lime" aria-hidden="true" />
                    <span className="truncate">{office.email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Clean Bottom Legal & Language Bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p className="whitespace-nowrap">
            © {new Date().getFullYear()} EduExpress International. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:pr-28">
            {legalLinks.map(([name, href]) => (
              <Link key={href} href={href} className="transition hover:text-white">
                {name}
              </Link>
            ))}
            <CookieSettingsButton className="transition hover:text-white" />
            <Link
              href="/bn/study-in-china"
              lang="bn"
              hrefLang="bn-BD"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              className="rounded border border-white/15 bg-white/[0.04] px-2 py-0.5 font-medium text-lime transition hover:bg-lime hover:text-petrol-800"
            >
              বাংলা
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
