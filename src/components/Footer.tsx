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
import { destinationLinks } from '@/data/siteNavigation';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';
import { toSafeSitePathOrUrl } from '@/lib/safe-url';
import { getPublicTrustRecords } from '@/lib/trust-records';

// Curated 8 flagship China links (high intent & pathways)
const chinaFlagshipLinks = [
  { name: 'China March 2027 Intake', href: '/china-march-2027-intake', badge: 'Open' },
  { name: 'Study in China Complete Guide', href: '/study-in-china-from-bangladesh' },
  { name: 'China Scholarships (CSC/Provincial)', href: '/china-scholarships-bangladesh' },
  { name: 'Study Cost & Living Expenses', href: '/study-in-china-cost-bangladesh' },
  { name: 'China After O-Level / SSC / Dakhil', href: '/study-in-china-after-o-level-ssc' },
  { name: 'MBBS in China (MOE Listed)', href: '/mbbs-in-china-bangladesh' },
  { name: 'Student Visa (X1/X2 Guide)', href: '/china-student-visa-bangladesh' },
  { name: 'Intakes & Application Deadlines', href: '/china-intakes-deadlines' },
];

// Curated 8 planning, comparison & verification tools
const planLinks = [
  ['University Directory', '/universities'],
  ['Programs by Budget', '/programs'],
  ['Compare Study Costs', '/compare-costs'],
  ['Bangladesh vs China Bachelor', '/bangladesh-vs-china-bachelor-study'],
  ['China vs UK, USA & Private Uni', '/compare-bachelor-china-abroad-bangladesh'],
  ['Malaysia After O-Level / SPM', '/study-in-malaysia-after-o-level'],
  ['Proof Library & Documents', '/proof-library'],
  ['Free Education Fit Assessment', '/education-fit-assessment'],
];

// Curated 7 company & transparency links
const companyLinks = [
  ['About EduExpress', '/about'],
  ['Dhaka Head Office (Dhanmondi)', '/education-consultant-dhaka'],
  ['How It Works (Journey)', '/your-study-journey'],
  ['For Parents & Families', '/for-parents'],
  ['Student Success Stories', '/success-stories'],
  ['Fee Policy & Transparency', '/fees-and-transparency'],
  ['Media & Press Room', '/press'],
  ['B2B Partner Desk', '/b2b'],
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

const linkClass = 'text-[14px] leading-relaxed text-white/75 transition-colors hover:text-lime';

function NavColumn({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <nav aria-label={title} className={className}>
      <h2 className="border-b border-white/10 pb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-lime">
        {title}
      </h2>
      <div className="mt-3.5">{children}</div>
    </nav>
  );
}

export default async function Footer() {
  const { offices } = await getPublicTrustRecords();
  const office = offices.find(item => item.isHeadOffice) ?? offices[0];
  const whatsapp = office?.phonePrimary
    ? `https://wa.me/${office.phonePrimary.replace(/\D/g, '')}?text=${encodeURIComponent(
        'Assalamu alaikum. I would like counselling for studying abroad.'
      )}`
    : null;
  const featuredDestinations = destinationLinks.filter(item => item.href !== '/study-in-china-from-bangladesh').slice(0, 6);

  return (
    <footer
      id="site-footer"
      className="site-footer relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#082238] via-[#061c2e] to-[#041320] text-white"
    >
      <FooterCta />

      <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-12 lg:px-8 lg:pb-20 lg:pt-14">
        {/* Institutional Navigation Grid */}
        <div data-anim="stagger" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Col 1–4: Brand Identity & Verified Accreditations */}
          <div className="sm:col-span-2 lg:col-span-4 lg:pr-6">
            <Link href="/" aria-label="EduExpress International home" className="inline-block">
              <Image
                src="/white-logo.png"
                alt="EduExpress International"
                width={200}
                height={56}
                className="h-auto w-44"
              />
            </Link>

            <p className="mt-4 text-[14px] leading-relaxed text-white/80">
              Bangladesh&apos;s evidence-first study abroad consultancy since 2018. Compare verified universities, realistic scholarship tiers, and your complete written cost schedule from our Dhanmondi head office.
            </p>

            {/* Official Association Accreditation Badges */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/85">
                <ShieldCheck size={16} className="shrink-0 text-lime" aria-hidden="true" />
                <span>
                  Founding Member (#08) of{' '}
                  <a
                    href="https://cbcabd.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-lime hover:underline"
                  >
                    CBCA
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/85">
                <ShieldCheck size={16} className="shrink-0 text-lime" aria-hidden="true" />
                <span>
                  Active Member (FCM-452) of{' '}
                  <a
                    href="https://www.facdcab.org/members/directory/2264"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-lime hover:underline"
                  >
                    FACD-CAB
                  </a>
                </span>
              </div>
            </div>

            {/* Key Commitment Pills */}
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-white/70">
              <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1">
                BDT 0 fee before visa
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1">
                Written cost schedule
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1">
                In-person counselling
              </span>
            </div>

            {/* Social Media Channels */}
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`EduExpress on ${name}`}
                  className="grid size-9 place-items-center rounded-lg border border-white/15 bg-white/[0.05] text-white/80 transition hover:border-lime hover:bg-lime hover:text-petrol-800"
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 5–6: China Flagship */}
          <NavColumn title="Study in China" className="lg:col-span-2">
            <ul className="grid gap-2">
              {chinaFlagshipLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${linkClass} inline-flex items-center gap-1.5`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="rounded-full bg-lime px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-petrol-800">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/bn/study-in-china"
                  lang="bn"
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-lime/90 hover:text-lime"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  বাংলা গাইড (Study in China) →
                </Link>
              </li>
            </ul>
          </NavColumn>

          {/* Col 7–8: Global Destinations */}
          <NavColumn title="Destinations" className="lg:col-span-2">
            <ul className="grid gap-2">
              {featuredDestinations.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/destinations"
              className="mt-3.5 inline-flex items-center gap-1 text-[13px] font-bold text-lime hover:underline"
            >
              All 12 destinations
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </NavColumn>

          {/* Col 9–10: Plan & Verify Tools */}
          <NavColumn title="Plan & Verify" className="lg:col-span-2">
            <ul className="grid gap-2">
              {planLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </NavColumn>

          {/* Col 11–12: Company & Governance */}
          <NavColumn title="Company" className="lg:col-span-2">
            <ul className="grid gap-2">
              {companyLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </NavColumn>
        </div>

        {/* Streamlined Dhanmondi Head Office & Contact Bar */}
        <section
          aria-label="Visit or contact our office"
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
            {/* Address */}
            <div className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-lime/15 text-lime">
                <MapPin size={17} aria-hidden="true" />
              </span>
              <div className="min-w-0 text-xs leading-relaxed">
                <p className="font-bold text-white">Dhanmondi Head Office</p>
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
                      className="mt-1.5 inline-flex items-center gap-1 font-semibold text-lime hover:underline"
                    >
                      <Navigation size={11} aria-hidden="true" /> Directions on Google Maps
                    </a>
                  ) : null;
                })()}
              </div>
            </div>

            {/* Counselling Hours */}
            <div className="flex gap-3 lg:pl-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-lime/15 text-lime">
                <Clock3 size={17} aria-hidden="true" />
              </span>
              <div className="min-w-0 text-xs leading-relaxed">
                <p className="font-bold text-white">Counselling Hours</p>
                <p className="mt-0.5 text-white/70">
                  {office?.hours ?? DEFAULT_OFFICE_RECORD.hours}
                </p>
                <p className="mt-1 font-semibold text-lime">Parents welcome at every session</p>
              </div>
            </div>

            {/* Direct Phone */}
            <div className="flex gap-3 lg:pl-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-lime/15 text-lime">
                <Phone size={17} aria-hidden="true" />
              </span>
              <div className="min-w-0 text-xs leading-relaxed">
                <p className="font-bold text-white">Admissions Desk</p>
                {office?.phonePrimary ? (
                  <div className="mt-0.5 space-y-0.5">
                    <a href={`tel:${office.phonePrimary}`} data-tracking-type="phone" className="block font-semibold text-white/90 hover:text-lime">
                      {formatBangladeshPhone(office.phonePrimary)}
                    </a>
                    {office.phoneSecondary && (
                      <a href={`tel:${office.phoneSecondary}`} data-tracking-type="phone" className="block text-white/70 hover:text-lime">
                        {formatBangladeshPhone(office.phoneSecondary)}
                      </a>
                    )}
                  </div>
                ) : (
                  <Link href="/contact" className="mt-1 block text-white/80 hover:text-lime">
                    Contact details
                  </Link>
                )}
              </div>
            </div>

            {/* WhatsApp & Email */}
            <div className="flex gap-3 lg:pl-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-lime/15 text-lime">
                <MessageCircle size={17} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1 text-xs leading-relaxed">
                <p className="font-bold text-white">Instant Support</p>
                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-tracking-type="whatsapp"
                    className="mt-0.5 block font-semibold text-lime hover:underline"
                  >
                    Chat on WhatsApp →
                  </a>
                )}
                {office?.email && (
                  <a
                    href={`mailto:${office.email}`}
                    className="mt-1 flex items-center gap-1 truncate text-white/75 hover:text-white"
                  >
                    <Mail size={12} className="shrink-0 text-lime" aria-hidden="true" />
                    <span className="truncate">{office.email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Clean Bottom Legal & Language Bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} EduExpress International. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
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
              className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-0.5 font-bold text-lime transition hover:bg-lime hover:text-petrol-800"
            >
              বাংলা
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
