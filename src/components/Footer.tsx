import Image from 'next/image';
import Link from 'next/link';
import { formatBangladeshPhone } from '@/lib/contact-format';
import FooterCta from '@/components/FooterCta';
import {
  ArrowRight,
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
import {
  destinationLinks,
  proofNavigation,
  resourceNavigation,
} from '@/data/siteNavigation';
import { getPublicTrustRecords } from '@/lib/trust-records';

const exploreLinks = [
  ['Find education', '/find-education'],
  ['Find universities', '/universities'],
  ['Scholarship guidance', '/scholarships'],
  ['Explore destinations', '/destinations'],
  ['Compare destinations', '/compare-study-destinations'],
  ['Study in China', '/study-in-china-from-bangladesh'],
];

const journeyLinks = [
  ['Complete study journey', '/your-study-journey'],
  ['How we help', '/services'],
  ['Free Fit Assessment', '/education-fit-assessment'],
  ['For parents', '/for-parents'],
  ['Contact EduExpress', '/contact'],
];

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/eduexpressint', icon: Facebook },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/eduexpress', icon: Linkedin },
  { name: 'Instagram', href: 'https://www.instagram.com/eduexpressint/', icon: Instagram },
  { name: 'YouTube', href: 'https://www.youtube.com/@EduExpressInt', icon: Youtube },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group flex items-center justify-between gap-3 py-1.5 text-sm font-semibold text-white/72 transition hover:text-white">
      <span>{children}</span>
      <ArrowRight size={13} className="shrink-0 text-[#64b5df] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
    </Link>
  );
}

export default async function Footer() {
  const { offices } = await getPublicTrustRecords();
  const office = offices[0];
  // Same WhatsApp entry point as the header: identical number and intent,
  // so both tracked whatsapp_click events carry the same contact data.
  const officeWhatsApp = office?.phonePrimary
    ? `https://wa.me/${office.phonePrimary.replace(/\D/g, '')}?text=${encodeURIComponent(
        'Assalamu alaikum. I would like counselling for studying abroad.',
      )}`
    : null;
  return (
    <footer id="site-footer" className="site-footer overflow-hidden bg-[#061b2a] text-white">
      <FooterCta />

      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.15fr_.72fr_.72fr_.82fr_1.08fr] xl:gap-9">
          <div>
            <Link href="/" aria-label="EduExpress International home">
              <Image src="/white-logo.png" alt="EduExpress International" width={210} height={59} className="h-auto w-48" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/68">Bangladesh&apos;s evidence-first education consultancy for students who want a better education decision, clear costs and written proof.</p>
            <p className="mt-5 border-l-2 border-[#64b5df] pl-4 text-sm font-bold text-white">Compare before you commit.</p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className="grid size-9 place-items-center border border-white/20 text-white/70 transition hover:border-[#64b5df] hover:bg-[#64b5df] hover:text-[#08263c]"><Icon size={16} /></a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Explore</p>
            <h3 className="mt-2 font-heading text-xl font-bold">Find education</h3>
            <div className="mt-5">
              {exploreLinks.map(([name, href]) => <FooterLink key={href} href={href}>{name}</FooterLink>)}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Your journey</p>
            <h3 className="mt-2 font-heading text-xl font-bold">From fit to campus</h3>
            <div className="mt-5">
              {journeyLinks.map(([name, href]) => <FooterLink key={href} href={href}>{name}</FooterLink>)}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Proof and resources</p>
            <h3 className="mt-2 font-heading text-xl font-bold">Inspect the process</h3>
            <div className="mt-5">
              {proofNavigation.slice(0, 3).map(link => <FooterLink key={link.href} href={link.href}>{link.name}</FooterLink>)}
              {resourceNavigation.slice(0, 2).map(link => <FooterLink key={link.href} href={link.href}>{link.name}</FooterLink>)}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Dhanmondi decision desk</p>
            <h3 className="mt-2 font-heading text-xl font-bold">Talk to EduExpress</h3>
            {office ? <div className="mt-5 space-y-4 text-sm leading-6 text-white/75">
              <p className="flex items-start gap-3"><MapPin className="mt-1 shrink-0 text-[#64b5df]" size={16} /><span>{office.address}</span></p>
              <div className="flex items-start gap-3"><Phone className="mt-1 shrink-0 text-[#64b5df]" size={16} /><div><a href={`tel:${office.phonePrimary}`} className="block font-black text-white hover:text-[#8ed0ee]">{formatBangladeshPhone(office.phonePrimary)}</a>{office.phoneSecondary && <a href={`tel:${office.phoneSecondary}`} className="mt-1 block hover:text-[#8ed0ee]">{formatBangladeshPhone(office.phoneSecondary)}</a>}</div></div>
              {officeWhatsApp && <a href={officeWhatsApp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-bold text-white transition hover:text-[#8ed0ee]"><MessageCircle className="shrink-0 text-[#8fe5ac]" size={16} /> WhatsApp {formatBangladeshPhone(office.phonePrimary)}</a>}
              {office.email && <a href={`mailto:${office.email}`} className="flex items-center gap-3 break-all hover:text-[#8ed0ee]"><Mail className="shrink-0 text-[#64b5df]" size={16} /> {office.email}</a>}
              <p className="border-l-2 border-white/20 pl-4">{office.hours}</p>
              {office.mapUrl && <a href={office.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-[#8ed0ee] transition hover:text-white"><Navigation className="shrink-0" size={15} /> Get directions — Google Maps</a>}
            </div> : <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#8ed0ee]">Open contact details <ArrowRight size={14} /></Link>}
          </div>
        </div>

        <div className="mt-12 border-y border-white/15 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="shrink-0">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Active destinations</p>
              <Link href="/destinations" className="mt-1 inline-flex items-center gap-2 text-xs font-black text-white">Compare all <ArrowRight size={12} /></Link>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 lg:border-l lg:border-white/15 lg:pl-6">
              {destinationLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-xs font-bold text-white/65 transition hover:text-[#8ed0ee]">{link.name}</Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col justify-between gap-5 text-xs text-white/55 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-semibold">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/partnership" className="hover:text-white">Partnership</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/fees-and-transparency" className="hover:text-white">Fee policy</Link>
            <Link href="/student-data-privacy" className="hover:text-white">Student data</Link>
            <Link href="/complaints-and-resolution" className="hover:text-white">Complaints</Link>
          </div>
          <p>© {new Date().getFullYear()} EduExpress International Bangladesh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
