import Image from 'next/image';
import Link from 'next/link';
import { formatBangladeshPhone } from '@/lib/contact-format';
import FooterCta from '@/components/FooterCta';
import { CookieSettingsButton } from '@/components/CookieConsent';
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Youtube,
} from 'lucide-react';
import { destinationLinks, proofNavigation, resourceNavigation } from '@/data/siteNavigation';
import { getPublicTrustRecords } from '@/lib/trust-records';

const exploreLinks = [
  ['Find education', '/find-education'],
  ['University finder', '/universities'],
  ['Scholarship guidance', '/scholarships'],
  ['Destinations', '/destinations'],
  ['Compare destinations', '/compare-study-destinations'],
  ['Study in China', '/study-in-china-from-bangladesh'],
];

const journeyLinks = [
  ['Complete study journey', '/your-study-journey'],
  ['How we help', '/services'],
  ['Free fit assessment', '/education-fit-assessment'],
  ['For parents', '/for-parents'],
  ['Contact EduExpress', '/contact'],
];

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/eduexpressint', icon: Facebook },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/eduexpress', icon: Linkedin },
  { name: 'Instagram', href: 'https://www.instagram.com/eduexpressint/', icon: Instagram },
  { name: 'YouTube', href: 'https://www.youtube.com/@EduExpressInt', icon: Youtube },
];

const legalLinks = [
  ['About', '/about'],
  ['Contact', '/contact'],
  ['Dhanmondi office', '/education-consultant-dhaka'],
  ['Partnership', '/partnership'],
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
  ['Fee policy', '/fees-and-transparency'],
  ['Country status', '/country-status'],
  ['Student data', '/student-data-privacy'],
  ['Complaints', '/complaints-and-resolution'],
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 py-1.5 text-[15px] font-medium text-white/85 transition-colors hover:text-white"
    >
      <span>{children}</span>
      <ArrowUpRight size={12} className="shrink-0 text-mint-300 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
    </Link>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[15px] font-bold text-white">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default async function Footer() {
  const { offices } = await getPublicTrustRecords();
  const office = offices[0];
  const officeWhatsApp = office?.phonePrimary
    ? `https://wa.me/${office.phonePrimary.replace(/\D/g, '')}?text=${encodeURIComponent(
        'Assalamu alaikum. I would like counselling for studying abroad.',
      )}`
    : null;

  return (
    <footer id="site-footer" className="site-footer overflow-hidden bg-petrol-800 text-white">
      <FooterCta />

      <div className="mx-auto max-w-shell px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.1fr_.7fr_.7fr_.8fr_1fr] xl:gap-10">
          <div>
            <Link href="/" aria-label="EduExpress International home">
              <Image src="/white-logo.png" alt="EduExpress International" width={210} height={59} className="h-auto w-44" />
            </Link>
            <p className="mt-5 max-w-sm text-[15px] leading-7 text-white/80">
              Bangladesh&apos;s evidence-first education consultancy. We publish costs, sources and verification dates so a family can check the decision instead of trusting a brochure.
            </p>
                        <div className="mt-6 flex gap-2">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid size-10 place-items-center rounded-full border border-white/20 text-white/70 transition hover:border-marigold hover:text-marigold"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <Column title="Find education">
            {exploreLinks.map(([name, href]) => (
              <FooterLink key={href} href={href}>
                {name}
              </FooterLink>
            ))}
          </Column>

          <Column title="Your journey">
            {journeyLinks.map(([name, href]) => (
              <FooterLink key={href} href={href}>
                {name}
              </FooterLink>
            ))}
          </Column>

          <Column title="Proof and advice">
            {proofNavigation.slice(0, 3).map(link => (
              <FooterLink key={link.href} href={link.href}>
                {link.name}
              </FooterLink>
            ))}
            {resourceNavigation.slice(0, 2).map(link => (
              <FooterLink key={link.href} href={link.href}>
                {link.name}
              </FooterLink>
            ))}
          </Column>

          <div>
            <Column title="Dhanmondi office">
              {office ? (
                <div className="mt-1 space-y-3.5 text-[15px] leading-6 text-white/80">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="mt-1 shrink-0 text-mint-300" size={15} aria-hidden="true" />
                    <span>{office.address}</span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <Phone className="mt-1 shrink-0 text-mint-300" size={15} aria-hidden="true" />
                    <span>
                      <a href={`tel:${office.phonePrimary}`} className="block font-semibold text-white hover:text-mint-300">
                        {formatBangladeshPhone(office.phonePrimary)}
                      </a>
                      {office.phoneSecondary && (
                        <a href={`tel:${office.phoneSecondary}`} className="mt-0.5 block hover:text-mint-300">
                          {formatBangladeshPhone(office.phoneSecondary)}
                        </a>
                      )}
                    </span>
                  </p>
                  {officeWhatsApp && (
                    <a href={officeWhatsApp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 font-semibold text-white hover:text-mint-300">
                      <MessageCircle className="shrink-0 text-mint-300" size={15} aria-hidden="true" /> WhatsApp the office
                    </a>
                  )}
                  {office.email && (
                    <a href={`mailto:${office.email}`} className="flex items-center gap-2.5 break-all hover:text-mint-300">
                      <Mail className="shrink-0 text-mint-300" size={15} aria-hidden="true" /> {office.email}
                    </a>
                  )}
                  <p className="text-white/80">{office.hours}</p>
                  {office.mapUrl && (
                    <a href={office.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-mint-300 hover:text-white">
                      <Navigation className="shrink-0" size={14} aria-hidden="true" /> Directions on Google Maps
                    </a>
                  )}
                </div>
              ) : (
                <Link href="/contact" className="mt-1 inline-flex items-center gap-2 text-[15px] font-semibold text-mint-300">
                  Open contact details <ArrowUpRight size={13} />
                </Link>
              )}
            </Column>
          </div>
        </div>

        <div className="mt-12 border-t border-white/12 pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <p className="shrink-0 text-[14px] font-semibold text-white/80">Destinations</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 lg:border-l lg:border-white/12 lg:pl-6">
              {destinationLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-[14px] text-white/75 transition-colors hover:text-white">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-5 text-[14px] text-white/70 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map(([name, href]) => (
              <Link key={href} href={href} className="transition-colors hover:text-white">
                {name}
              </Link>
            ))}
            <Link href="/bn/study-in-china" lang="bn" className="transition-colors hover:text-white">
              বাংলা গাইড
            </Link>
            <CookieSettingsButton className="transition-colors hover:text-white" />
          </div>
          <p>© EduExpress International Bangladesh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
