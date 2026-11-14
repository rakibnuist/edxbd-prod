import Image from 'next/image';
import Link from 'next/link';
import { formatBangladeshPhone } from '@/lib/contact-format';
import FooterCta from '@/components/FooterCta';
import { CookieSettingsButton } from '@/components/CookieConsent';
import {
  ArrowUpRight,
  CheckCircle2,
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
import { getPublicTrustRecords } from '@/lib/trust-records';

const chinaFlagshipLinks = [
  { name: 'China March 2027 Intake', href: '/china-march-2027-intake', badge: 'Open' },
  { name: 'Study in China Guide', href: '/study-in-china-from-bangladesh' },
  { name: 'China Scholarships', href: '/china-scholarships-bangladesh' },
  { name: 'Cost of Studying in China', href: '/study-in-china-cost-bangladesh' },
  { name: 'MBBS in China', href: '/mbbs-in-china-bangladesh' },
  { name: 'China Student Visa Guide', href: '/china-student-visa-bangladesh' },
  { name: 'Intakes & Deadlines', href: '/china-intakes-deadlines' },
  { name: 'Visa-First Policy (BDT 0)', href: '/china-visa-first-policy' },
];

const planLinks = [
  ['University Directory (120)', '/universities'],
  ['Programs by Budget', '/programs'],
  ['Compare Study Costs', '/compare-costs'],
  ['Scholarship Database', '/scholarships#scholarship-database'],
  ['Proof Library', '/proof-library'],
  ['How We Verify Universities', '/how-we-verify-universities'],
  ['Free Fit Assessment', '/education-fit-assessment'],
];

const companyLinks = [
  ['About EduExpress', '/about'],
  ['How It Works', '/your-study-journey'],
  ['What We Do', '/services'],
  ['Student Success Stories', '/success-stories'],
  ['For Parents & Families', '/for-parents'],
  ['Fee Policy & Transparency', '/fees-and-transparency'],
  ['Education Updates', '/updates'],
  ['Partner With Us', '/partnership'],
];

const legalLinks = [
  ['Privacy Policy', '/privacy'],
  ['Terms of Service', '/terms'],
  ['Fee Policy', '/fees-and-transparency'],
  ['Student Data Privacy', '/student-data-privacy'],
  ['Complaints & Resolution', '/complaints-and-resolution'],
  ['Country Status', '/country-status'],
];

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/eduexpressint', icon: Facebook },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/eduexpress', icon: Linkedin },
  { name: 'Instagram', href: 'https://www.instagram.com/eduexpressint/', icon: Instagram },
  { name: 'YouTube', href: 'https://www.youtube.com/@EduExpressInt', icon: Youtube },
];

const linkClass = 'text-[14.5px] leading-6 text-white/75 transition-colors hover:text-lime';

function Group({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <nav aria-label={title} className={className}>
      <h2 className="border-b border-white/10 pb-2.5 text-xs font-extrabold uppercase tracking-[0.14em] text-lime">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
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
  const featuredDestinations = destinationLinks.filter(item => item.href !== '/study-in-china-from-bangladesh').slice(0, 7);

  return (
    <footer
      id="site-footer"
      className="site-footer relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#082238] via-[#061c2e] to-[#041320] text-white"
    >
      <FooterCta />

      <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-14 lg:px-8 lg:pb-12 lg:pt-16">
        {/* Top Institutional Navigation Grid */}
        <div data-anim="stagger" className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Col 1–4: Brand Identity & Written Governance */}
          <div className="sm:col-span-2 lg:col-span-4 lg:pr-4">
            <Link href="/" aria-label="EduExpress International home" className="inline-block">
              <Image
                src="/white-logo.png"
                alt="EduExpress International"
                width={210}
                height={59}
                className="h-auto w-44 sm:w-48"
              />
            </Link>

            <p className="mt-4 max-w-sm text-[15px] leading-6.5 text-white/80">
              Bangladesh&apos;s evidence-first study abroad consultancy since 2018. Compare verified universities, realistic scholarship tiers, and your complete written cost schedule from our Dhanmondi head office.
            </p>

            {/* Governance Pillars */}
            <ul className="mt-5 space-y-2 text-[13.5px] font-semibold text-white/90">
              {[
                'BDT 0 service fee before China visa approval',
                'Written cost breakdown before you commit',
                'In-person family counselling in Dhanmondi, Dhaka',
              ].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-lime" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Social Media Channels */}
            <div className="mt-6 flex items-center gap-2.5">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`EduExpress on ${name}`}
                  className="grid size-10 place-items-center rounded-xl border border-white/15 bg-white/[0.06] text-white/85 transition hover:border-lime hover:bg-lime hover:text-petrol-800"
                >
                  <Icon size={17} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 5–6: China Flagship & March 2027 Desk */}
          <Group title="Study in China" className="lg:col-span-2">
            <ul className="grid gap-2.5">
              {chinaFlagshipLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={`${linkClass} inline-flex items-center gap-2`}>
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-petrol-800">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </Group>

          {/* Col 7–8: Global Destinations */}
          <Group title="Destinations" className="lg:col-span-2">
            <ul className="grid gap-2.5">
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
              className="mt-3.5 inline-flex items-center gap-1 text-[13.5px] font-bold text-lime hover:underline"
            >
              All 12 destinations
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </Group>

          {/* Col 9–10: Directory & Planning Tools */}
          <Group title="Plan & Verify" className="lg:col-span-2">
            <ul className="grid gap-2.5">
              {planLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </Group>

          {/* Col 11–12: Company & Governance */}
          <Group title="Company" className="lg:col-span-2">
            <ul className="grid gap-2.5">
              {companyLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </Group>
        </div>

        {/* Executive Dhaka Head Office & Admissions Desk Strip */}
        <section
          aria-label="Visit or contact our office"
          className="mt-12 rounded-3xl border border-white/12 bg-white/[0.04] p-5 sm:p-7"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-lime/15 text-lime">
                <ShieldCheck size={17} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-lime">
                  Dhaka Head Office &amp; Admissions Desk
                </p>
                <p className="text-xs text-white/70">
                  Walk-in student &amp; parent consultations · Verified university dossiers
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-white transition hover:border-lime hover:bg-lime hover:text-petrol-800"
            >
              Book office visit
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Address */}
            <div className="flex gap-3.5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lime text-petrol-800">
                <MapPin size={18} aria-hidden="true" />
              </span>
              <div className="text-sm leading-6">
                <p className="font-bold text-white">Dhanmondi Office</p>
                <p className="mt-0.5 text-[13.5px] leading-5 text-white/75">
                  {office?.address ?? 'House 41/A, Road 4/A, Dhanmondi, Dhaka 1209'}
                </p>
                {office?.mapUrl && (
                  <a
                    href={office.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-lime hover:underline"
                  >
                    <Navigation size={12} aria-hidden="true" /> Get directions on Maps
                  </a>
                )}
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex gap-3.5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lime text-petrol-800">
                <Clock3 size={18} aria-hidden="true" />
              </span>
              <div className="text-sm leading-6">
                <p className="font-bold text-white">Counselling Hours</p>
                <p className="mt-0.5 text-[13.5px] leading-5 text-white/75">
                  {office?.hours ?? 'Saturday to Thursday, 11:00 AM to 6:00 PM'}
                </p>
                <p className="mt-1.5 text-xs font-semibold text-lime">Parents welcome at every session</p>
              </div>
            </div>

            {/* Direct Phone */}
            <div className="flex gap-3.5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lime text-petrol-800">
                <Phone size={18} aria-hidden="true" />
              </span>
              <div className="text-sm leading-6">
                <p className="font-bold text-white">Admissions Hotline</p>
                {office?.phonePrimary ? (
                  <div className="mt-0.5 space-y-0.5 text-[13.5px]">
                    <a href={`tel:${office.phonePrimary}`} className="block font-semibold text-white/90 hover:text-lime">
                      {formatBangladeshPhone(office.phonePrimary)}
                    </a>
                    {office.phoneSecondary && (
                      <a href={`tel:${office.phoneSecondary}`} className="block text-white/75 hover:text-lime">
                        {formatBangladeshPhone(office.phoneSecondary)}
                      </a>
                    )}
                  </div>
                ) : (
                  <Link href="/contact" className="mt-1 block text-white/85 hover:text-lime">
                    Contact details
                  </Link>
                )}
              </div>
            </div>

            {/* WhatsApp & Email */}
            <div className="flex gap-3.5 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lime text-petrol-800">
                <MessageCircle size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0 text-sm leading-6">
                <p className="font-bold text-white">WhatsApp &amp; Email</p>
                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block text-[13.5px] font-semibold text-lime hover:underline"
                  >
                    Chat on WhatsApp →
                  </a>
                )}
                {office?.email && (
                  <a
                    href={`mailto:${office.email}`}
                    className="mt-1 flex items-center gap-1.5 text-[13px] text-white/75 [overflow-wrap:anywhere] hover:text-white"
                  >
                    <Mail size={13} className="shrink-0 text-lime" aria-hidden="true" /> {office.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Legal, Governance & Language Bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-[13px] text-white/65 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-semibold text-white/80">
              © {new Date().getFullYear()} EduExpress International. All rights reserved.
            </p>
            <p className="mt-0.5 text-xs text-white/55">
              University fees remain in official destination currency; service terms and third-party charges are itemised in writing before commitment.
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map(([name, href]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-white">
                  {name}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className="transition hover:text-white" />
            </li>
            <li>
              <Link
                href="/bn/study-in-china"
                lang="bn"
                hrefLang="bn-BD"
                className="rounded-lg border border-white/15 bg-white/[0.06] px-2.5 py-1 font-bold text-lime transition hover:bg-lime hover:text-petrol-800"
              >
                বাংলা
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
