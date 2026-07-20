import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Youtube,
} from 'lucide-react';

const destinations = [
  ['China', '/study-in-china-from-bangladesh', '01'],
  ['Malta', '/destinations/malta', '02'],
  ['Hungary', '/destinations/hungary', '03'],
  ['Cyprus', '/destinations/cyprus', '04'],
  ['South Korea', '/destinations/south-korea', '05'],
  ['United Kingdom', '/destinations/uk', '06'],
  ['Georgia', '/destinations/georgia', '07'],
  ['Greece', '/destinations/greece', '08'],
  ['Malaysia', '/destinations/malaysia', '09'],
  ['Thailand', '/destinations/thailand', '10'],
];

const proofLinks = [
  ['Better Education Standard', '/better-education-standard'],
  ['Fees and transparency', '/fees-and-transparency'],
  ['University verification', '/how-we-verify-universities'],
  ['China visa first terms', '/china-visa-first-policy'],
  ['Our services', '/services'],
  ['Updates and guides', '/updates'],
  ['Partner with EduExpress', '/partnership'],
];

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/eduexpressint', icon: Facebook },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/eduexpress', icon: Linkedin },
  { name: 'Instagram', href: 'https://www.instagram.com/eduexpressint/', icon: Instagram },
  { name: 'YouTube', href: 'https://www.youtube.com/@EduExpressInt', icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#061b2a] text-white">
      <div className="border-b border-white/15 bg-[#64b5df] px-5 py-5 text-[#08263c] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="flex items-center gap-3 text-sm font-black"><span className="grid size-8 place-items-center rounded-full bg-[#08263c] text-white"><ShieldCheck size={16} /></span> Better education. Clear costs. Written proof.</p>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">Bangladesh decision desk</p>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="pointer-events-none absolute right-0 top-4 font-heading text-[clamp(5rem,15vw,14rem)] font-bold leading-none tracking-[-0.08em] text-white/[0.025]">EDU</div>

        <div className="relative grid overflow-hidden border border-white/20 bg-[#08263c] lg:grid-cols-[1fr_auto]">
          <div className="p-7 sm:p-10 lg:p-14">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#8ed0ee]">Your next decision starts with fit</p>
            <h2 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-[1.06] tracking-[-0.02em] sm:text-6xl lg:text-7xl">Bring the ambition. We will help you inspect the route.</h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65">Compare education quality, total cost, recognition and visa readiness before you commit to a destination.</p>
          </div>
          <div className="relative flex min-w-72 items-center border-t border-dashed border-white/30 bg-[#64b5df] p-7 text-[#08263c] lg:border-l lg:border-t-0 lg:p-10">
            <span className="absolute -left-3 -top-3 hidden size-6 rounded-full bg-[#061b2a] lg:block" />
            <span className="absolute -bottom-3 -left-3 hidden size-6 rounded-full bg-[#061b2a] lg:block" />
            <div>
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em]">Assessment pass</span>
              <p className="mt-3 font-heading text-2xl font-bold">Free Education Fit Assessment</p>
              <Link href="/education-fit-assessment" className="mt-6 inline-flex items-center gap-3 bg-[#08263c] px-5 py-4 text-sm font-black text-white hover:bg-[#174f7a]">Start my assessment <ArrowUpRight size={18} /></Link>
            </div>
          </div>
        </div>

        <div className="relative mt-16 grid gap-12 border-t border-white/15 pt-12 lg:grid-cols-[.8fr_1.25fr_.95fr]">
          <div>
            <Link href="/" aria-label="EduExpress International home">
              <Image src="/white-logo.png" alt="EduExpress International" width={220} height={62} unoptimized className="h-auto w-52" />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">Bangladesh&apos;s evidence first education consultancy for students who want the reasoning, cost and responsibility in writing.</p>
            <div className="mt-7 flex gap-2">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className="grid size-10 place-items-center border border-white/20 text-white/65 transition hover:border-[#64b5df] hover:bg-[#64b5df] hover:text-[#08263c]"><Icon size={17} /></a>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <div><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Destination index</p><h3 className="mt-2 font-heading text-2xl font-bold">Ten active service routes</h3></div>
              <Link href="/destinations" className="hidden items-center gap-2 text-xs font-black text-[#8ed0ee] sm:flex">Compare all <ArrowRight size={14} /></Link>
            </div>
            <div className="mt-6 grid border-l border-t border-white/15 sm:grid-cols-2">
              {destinations.map(([name, href, number]) => (
                <Link key={href} href={href} className="group flex items-center justify-between border-b border-r border-white/15 px-4 py-3 hover:bg-white/5">
                  <span className="flex items-center gap-3"><span className="font-mono text-[9px] text-[#64b5df]">{number}</span><span className="text-sm font-bold text-white/80 group-hover:text-white">{name}</span></span>
                  <ArrowUpRight size={14} className="text-white/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#8ed0ee]" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Visit the decision desk</p>
            <h3 className="mt-2 font-heading text-2xl font-bold">Dhanmondi, Dhaka</h3>
            <div className="mt-6 space-y-5 text-sm leading-6 text-white/65">
              <p className="flex items-start gap-3"><MapPin className="mt-1 shrink-0 text-[#64b5df]" size={17} /> <span>House 12/1, Ground Floor, Road 4/A<br />Dhanmondi, Dhaka 1209</span></p>
              <div className="flex items-start gap-3"><Phone className="mt-1 shrink-0 text-[#64b5df]" size={17} /><div><a href="tel:+8801983333566" className="block font-black text-white hover:text-[#8ed0ee]">+880 1983-333566</a><a href="tel:+8801329663505" className="mt-1 block text-white/65 hover:text-[#8ed0ee]">+880 1329-663505</a></div></div>
              <a href="mailto:info@eduexpressint.com" className="flex items-center gap-3 break-all hover:text-[#8ed0ee]"><Mail className="shrink-0 text-[#64b5df]" size={17} /> info@eduexpressint.com</a>
              <div className="border-l-2 border-[#64b5df] pl-4"><strong className="block text-white">Saturday-Thursday</strong><span>11:00 AM-6:00 PM, Friday closed</span></div>
            </div>
          </div>
        </div>

        <div className="relative mt-14 grid gap-8 border-t border-white/15 pt-10 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Inspect our process</p>
            <div className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-2">
              {proofLinks.map(([name, href]) => <Link key={href} href={href} className="flex items-center justify-between text-xs font-bold text-white/55 hover:text-white">{name}<ArrowRight size={13} /></Link>)}
            </div>
          </div>
          <div className="flex flex-col justify-end gap-5 md:items-end">
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-white/55">
              <Link href="/about" className="hover:text-white">About</Link>
              <Link href="/privacy" className="hover:text-white">Privacy policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of service</Link>
              <Link href="/student-data-privacy" className="hover:text-white">Student data privacy</Link>
              <Link href="/complaints-and-review" className="hover:text-white">Complaints and review</Link>
            </div>
            <p className="text-xs text-white/35">© EduExpress International. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
