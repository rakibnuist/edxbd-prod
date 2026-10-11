'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Clock3, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { formatBangladeshPhone } from '@/lib/contact-format';

const navigation = [
  { name: 'Study in China', href: '/study-in-china-from-bangladesh' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Universities', href: '/universities' },
  { name: 'Costs & Scholarships', href: '/scholarships' },
  { name: 'Success Stories', href: '/success-stories' },
  { name: 'For Parents', href: '/for-parents' },
  { name: 'About', href: '/about' },
];

function isCurrent(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
}

export default function LightHeader({ office }: { office?: { phonePrimary: string; hours: string } }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const phone = office?.phonePrimary ?? '+880 1983-333566';
  const hours = office?.hours ?? 'Sat–Thu, 11 AM–6 PM';
  const whatsappHref = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Assalamu alaikum. I would like a free profile assessment for studying abroad.',
  )}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-[#102a43]">
      <div className="hidden h-9 bg-[#0d3856] text-white xl:block">
        <div className="mx-auto flex h-full max-w-[1360px] items-center justify-between px-6 text-xs font-semibold">
          <div className="flex items-center gap-5 text-white/80">
            <Link href="/contact" className="flex items-center gap-2 hover:text-white"><MapPin size={13} /> Dhanmondi, Dhaka</Link>
            <span className="flex items-center gap-2"><Clock3 size={13} /> {hours}</span>
          </div>
          <div className="flex items-center gap-5">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-white/80 hover:text-white"><Phone size={13} /> {formatBangladeshPhone(phone)}</a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-bold text-[#8fe5ac] hover:text-white"><MessageCircle size={13} /> WhatsApp</a>
            <Link href="/education-fit-assessment" className="rounded-full bg-[#f4a024] px-3 py-1 font-extrabold text-[#102a43] hover:bg-[#ffb33f]">Free assessment</Link>
          </div>
        </div>
      </div>

      <nav className="border-b border-slate-200 bg-white/95 shadow-[0_8px_30px_rgba(15,55,87,.08)] backdrop-blur-xl" aria-label="Main navigation">
        <div className="mx-auto flex h-[76px] max-w-[1360px] items-center px-4 sm:px-6">
          <Link href="/" aria-label="EduExpress International home" className="shrink-0">
            <Image src="/logo.png" alt="EduExpress International" width={180} height={51} priority className="h-10 w-auto" />
          </Link>

          <div className="ml-auto hidden h-full items-center xl:flex">
            {navigation.map(item => {
              const current = isCurrent(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={`relative flex h-full items-center px-2.5 text-[12px] font-bold transition xl:px-3 xl:text-[13px] ${current ? 'text-[#1767a0]' : 'text-slate-700 hover:text-[#1767a0]'}`}
                >
                  {item.name}
                  {current && <span className="absolute inset-x-3 bottom-0 h-1 rounded-t bg-[#f4a024]" />}
                </Link>
              );
            })}
          </div>

          <Link href="/#assessment" className="ml-auto hidden min-h-11 items-center gap-2 rounded-xl bg-[#1767a0] px-4 text-xs font-extrabold text-white shadow-sm hover:bg-[#104f7c] sm:inline-flex xl:ml-4">
            Free assessment <ArrowRight size={15} />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(open => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            className="ml-3 grid size-11 place-items-center rounded-xl border border-[#1767a0]/15 bg-[#eef8fe] text-[#1767a0] xl:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-navigation" className="h-[calc(100dvh-76px)] overflow-y-auto border-b border-slate-200 bg-white xl:hidden">
          <div className="mx-auto max-w-2xl px-5 py-6">
            <div className="grid grid-cols-2 gap-3">
              <Link href="/#assessment" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#1767a0] px-3 text-center text-sm font-extrabold text-white">Free assessment <ArrowRight size={15} /></Link>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 text-center text-sm font-extrabold text-[#07301a]"><MessageCircle size={17} /> WhatsApp</a>
            </div>

            <div className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
              {navigation.map(item => (
                <Link key={item.href} href={item.href} className={`flex items-center justify-between py-4 text-base font-bold ${isCurrent(pathname, item.href) ? 'text-[#1767a0]' : 'text-[#102a43]'}`}>
                  {item.name} <ArrowRight size={16} className="text-slate-400" />
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#f5f9fc] p-5">
              <p className="text-xs font-extrabold uppercase tracking-[.12em] text-[#1767a0]">Talk to EduExpress</p>
              <p className="mt-2 text-sm text-slate-600">{hours}</p>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#1767a0]"><Phone size={16} /> {formatBangladeshPhone(phone)}</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
