import Image from 'next/image';
import Link from 'next/link';
import { formatBangladeshPhone } from '@/lib/contact-format';
import FooterCta from '@/components/FooterCta';
import { CookieSettingsButton } from '@/components/CookieConsent';
import { Clock3, Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Navigation, Phone, Youtube } from 'lucide-react';
import { destinationLinks } from '@/data/siteNavigation';
import { getPublicTrustRecords } from '@/lib/trust-records';

// Footer information architecture: one labelled group per question a visitor
// brings to the bottom of a page (where can I study, how do I plan, who are
// you, how do I reach you), then legal links on their own line.
const planLinks = [
  ['University finder', '/universities'],
  ['Scholarships', '/scholarships'],
  ['Cost of studying in China', '/study-in-china-cost-bangladesh'],
  ['Intakes and deadlines', '/china-intakes-deadlines'],
  ['Student visa guide', '/china-student-visa-bangladesh'],
  ['MBBS in China', '/mbbs-in-china-bangladesh'],
  ['Free assessment', '/education-fit-assessment'],
];

const companyLinks = [
  ['About EduExpress', '/about'],
  ['How it works', '/your-study-journey'],
  ['What we do', '/services'],
  ['Student success stories', '/success-stories'],
  ['Proof library', '/proof-library'],
  ['For parents', '/for-parents'],
  ['Advice and updates', '/updates'],
  ['Partner with us', '/partnership'],
];

const legalLinks = [
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
  ['Fee policy', '/fees-and-transparency'],
  ['Student data', '/student-data-privacy'],
  ['Complaints', '/complaints-and-resolution'],
  ['Country status', '/country-status'],
];

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/eduexpressint', icon: Facebook },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/eduexpress', icon: Linkedin },
  { name: 'Instagram', href: 'https://www.instagram.com/eduexpressint/', icon: Instagram },
  { name: 'YouTube', href: 'https://www.youtube.com/@EduExpressInt', icon: Youtube },
];

const linkClass = 'text-[15px] leading-6 text-white/75 transition-colors hover:text-lime';

function Group({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <nav aria-label={title} className={className}>
      <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-lime">{title}</h2>
      <div className="mt-5">{children}</div>
    </nav>
  );
}

export default async function Footer() {
  const { offices } = await getPublicTrustRecords();
  const office = offices.find(item => item.isHeadOffice) ?? offices[0];
  const whatsapp = office?.phonePrimary
    ? `https://wa.me/${office.phonePrimary.replace(/\D/g, '')}?text=${encodeURIComponent('Assalamu alaikum. I would like counselling for studying abroad.')}`
    : null;
  const half = Math.ceil(destinationLinks.length / 2);

  return (
    <footer id="site-footer" className="site-footer relative overflow-hidden bg-petrol-800 text-white">
      <FooterCta />

      <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-16 lg:px-8 lg:pb-10">
        <div data-anim="stagger" className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" aria-label="EduExpress International home" className="inline-block">
              <Image src="/white-logo.png" alt="EduExpress International" width={210} height={59} className="h-auto w-48" />
            </Link>
            <p className="mt-5 max-w-sm text-[16px] leading-7 text-white/80">
              Study abroad from Bangladesh, with every cost in writing. Evidence-first counselling from our Dhanmondi office since 2018.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {['Since 2018', 'BDT 0 before China visa', 'Parents welcome'].map(item => (
                <li key={item} className="rounded-full border border-white/20 px-3 py-1 text-[13px] font-semibold text-white/85">{item}</li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`EduExpress on ${name}`}
                  className="grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-lime hover:text-petrol-800"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Destinations, in two columns */}
          <Group title="Study destinations" className="lg:col-span-3">
            <div className="grid grid-cols-2 gap-x-6">
              {[destinationLinks.slice(0, half), destinationLinks.slice(half)].map((column, index) => (
                <ul key={index} className="grid gap-2.5">
                  {column.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <Link href="/destinations" className="mt-4 inline-block text-[15px] font-semibold text-white underline underline-offset-4 hover:text-lime">
              Compare all destinations
            </Link>
          </Group>

          <Group title="Plan and compare" className="lg:col-span-2">
            <ul className="grid gap-2.5">
              {planLinks.map(([name, href]) => (
                <li key={href}><Link href={href} className={linkClass}>{name}</Link></li>
              ))}
            </ul>
          </Group>

          <Group title="Company" className="lg:col-span-3">
            <ul className="grid gap-2.5">
              {companyLinks.map(([name, href]) => (
                <li key={href}><Link href={href} className={linkClass}>{name}</Link></li>
              ))}
            </ul>
          </Group>
        </div>

        {/* Visit us — every way to reach a person, in one row */}
        <section aria-label="Visit or contact our office" className="mt-14 grid gap-6 rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 sm:grid-cols-2 sm:p-8 lg:grid-cols-[1.15fr_1fr_.8fr_1.25fr]">
          <div className="flex gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><MapPin size={18} aria-hidden="true" /></span>
            <div className="text-[15px] leading-6">
              <p className="font-bold text-white">Dhanmondi office</p>
              <p className="mt-1 text-white/75">{office?.address ?? 'Dhanmondi, Dhaka'}</p>
              {office?.mapUrl && (
                <a href={office.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1.5 font-semibold text-lime hover:underline">
                  <Navigation size={14} aria-hidden="true" /> Get directions
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><Clock3 size={18} aria-hidden="true" /></span>
            <div className="text-[15px] leading-6">
              <p className="font-bold text-white">Opening hours</p>
              <p className="mt-1 text-white/75">{office?.hours ?? 'Saturday to Thursday, 11:00 AM to 6:00 PM'}</p>
            </div>
          </div>
          <div className="flex gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><Phone size={18} aria-hidden="true" /></span>
            <div className="text-[15px] leading-6">
              <p className="font-bold text-white">Call us</p>
              {office?.phonePrimary ? (
                <>
                  <a href={`tel:${office.phonePrimary}`} className="mt-1 block text-white/85 hover:text-lime">{formatBangladeshPhone(office.phonePrimary)}</a>
                  {office.phoneSecondary && <a href={`tel:${office.phoneSecondary}`} className="block text-white/85 hover:text-lime">{formatBangladeshPhone(office.phoneSecondary)}</a>}
                </>
              ) : (
                <Link href="/contact" className="mt-1 block text-white/85 hover:text-lime">Contact details</Link>
              )}
            </div>
          </div>
          <div className="flex gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-petrol-800"><MessageCircle size={18} aria-hidden="true" /></span>
            <div className="min-w-0 text-[15px] leading-6">
              <p className="font-bold text-white">Message us</p>
              {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-1 block text-white/85 hover:text-lime">WhatsApp the office</a>}
              {office?.email && (
                <a href={`mailto:${office.email}`} className="mt-0.5 flex items-center gap-1.5 text-white/85 [overflow-wrap:anywhere] hover:text-lime">
                  <Mail size={14} className="shrink-0" aria-hidden="true" /> {office.email}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Legal */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-[14px] text-white/70 lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} EduExpress International. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map(([name, href]) => (
              <li key={href}><Link href={href} className="hover:text-white">{name}</Link></li>
            ))}
            <li><CookieSettingsButton className="hover:text-white" /></li>
            <li><Link href="/bn/study-in-china" lang="bn" hrefLang="bn-BD" className="font-semibold text-white hover:text-lime">বাংলা</Link></li>
          </ul>
        </div>
      </div>

      {/* Oversized wordmark — decorative sign-off */}
      <p
        aria-hidden="true"
        data-anim="rise"
        className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[19vw] font-black leading-[0.72] tracking-[-0.04em] text-white/[0.06] lg:text-[17vw]"
      >
        EduExpress
      </p>
    </footer>
  );
}
