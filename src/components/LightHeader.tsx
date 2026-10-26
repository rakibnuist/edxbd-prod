'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import {
  chinaNavigation,
  destinationLinks,
  findEducationNavigation,
  journeyNavigation,
  proofNavigation,
  resourceNavigation,
  serviceNavigation,
  type SiteLink,
} from '@/data/siteNavigation';
import { formatBangladeshPhone } from '@/lib/contact-format';

// Grouped primary navigation, matching the approved information architecture
// and siteNavigation.ts (the single source for header + footer). China stays
// the flagship slot. "For Parents" and "Universities" live inside the Advice
// and Find Education groups; the utility bar carries contact, not marketing.
// Desktop panels are controlled by one `openMenu` state (hover/focus managed
// in JS) so only one panel can ever be open — CSS-only hover+focus-within
// allowed two panels (clicked-link focus + hover of another group) to stack.
type HeaderMenu = {
  label: string;
  href: string;
  links: SiteLink[];
  /** Right-anchored panels for the groups sitting near the viewport edge. */
  align?: 'left' | 'right';
};

const menus: HeaderMenu[] = [
  { label: 'Study in China', href: '/study-in-china-from-bangladesh', links: chinaNavigation },
  { label: 'Destinations', href: '/destinations', links: destinationLinks },
  { label: 'Find Education', href: '/find-education', links: findEducationNavigation },
  { label: 'Your Journey', href: '/your-study-journey', links: journeyNavigation },
  { label: 'How We Help', href: '/services', links: serviceNavigation },
  { label: 'Proof', href: '/proof-library', links: proofNavigation, align: 'right' },
  { label: 'Advice', href: '/updates', links: resourceNavigation, align: 'right' },
];

const slugOf = (href: string) => href.split('#')[0];

function isSectionCurrent(pathname: string, href: string, links: SiteLink[]) {
  const base = slugOf(href);
  if (base.startsWith('/') && (pathname === base || pathname.startsWith(`${base}/`))) return true;
  return links.some(link => {
    const child = slugOf(link.href);
    return child.startsWith('/') && (pathname === child || pathname.startsWith(`${child}/`));
  });
}

function isChildCurrent(pathname: string, href: string) {
  const base = slugOf(href);
  return base.startsWith('/') && (pathname === base || pathname.startsWith(`${base}/`));
}

type LightHeaderOffice = { phonePrimary: string; phoneSecondary?: string | null; hours: string };

export default function LightHeader({ office }: { office?: LightHeaderOffice }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const desktopNavRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  // Short grace period so the pointer can travel from a trigger into its panel
  // (or across neighbouring groups) without flickering the menu closed.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };
  const openGroup = (href: string) => {
    cancelClose();
    setOpenMenu(href);
  };

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close the open panel on outside clicks / taps.
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!desktopNavRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const phone = office?.phonePrimary ?? '+8801983333566';
  const hours = office?.hours ?? 'Saturday to Thursday, 11:00 AM to 6:00 PM';
  const whatsappHref = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Assalamu alaikum. I would like counselling for studying abroad.',
  )}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-[#08263c]">
      {/* Utility strip: contact facts only — the single CTA lives in the nav row */}
      <div className="hidden h-9 bg-[#0d3856] text-white xl:block">
        <div className="mx-auto flex h-full max-w-[1360px] items-center justify-between px-6 text-[12px] font-medium tracking-wide">
          <div className="flex items-center gap-6">
            <Link href="/contact" className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"><MapPin size={13} /> Dhanmondi, Dhaka</Link>
            <span className="flex items-center gap-2 text-white/70"><Clock3 size={13} /> {hours}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 font-semibold text-white/90 transition-colors hover:text-white"><Phone size={13} /> {formatBangladeshPhone(phone)}</a>
            {office?.phoneSecondary && <a href={`tel:${office.phoneSecondary}`} className="hidden font-semibold text-white/90 transition-colors hover:text-white 2xl:flex"><Phone size={13} /> {formatBangladeshPhone(office.phoneSecondary)}</a>}
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-bold text-[#8fe5ac] transition-colors hover:text-white"><MessageCircle size={13} /> WhatsApp</a>
          </div>
        </div>
      </div>

      <nav className="border-b border-slate-200/80 bg-white/95 shadow-[0_6px_24px_rgba(15,55,87,.07)] backdrop-blur-xl" aria-label="Main navigation">
        <div className="mx-auto flex h-[72px] max-w-[1360px] items-stretch px-4 sm:px-6">
          <Link href="/" aria-label="EduExpress International home" className="my-auto mr-6 shrink-0 self-center xl:mr-4">
            <Image src="/logo.png" alt="EduExpress International" width={180} height={51} priority className="h-10 w-auto" />
          </Link>

          {/* Desktop grouped menus — one open at a time, via the openMenu state */}
          <div
            ref={desktopNavRef}
            className="ml-auto hidden h-full items-stretch xl:flex"
            onMouseLeave={scheduleClose}
            onKeyDown={event => { if (event.key === 'Escape') setOpenMenu(null); }}
          >
            {menus.map(menu => {
              const current = isSectionCurrent(pathname, menu.href, menu.links);
              const open = openMenu === menu.href;
              return (
                <div
                  key={menu.href}
                  className="relative flex h-full items-stretch"
                  onMouseEnter={() => openGroup(menu.href)}
                  onFocus={() => openGroup(menu.href)}
                  onBlur={event => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setOpenMenu(prev => (prev === menu.href ? null : prev));
                    }
                  }}
                >
                  <Link
                    href={menu.href}
                    aria-haspopup="true"
                    aria-expanded={open}
                    aria-current={current ? 'true' : undefined}
                    className={`whitespace-nowrap flex items-center gap-1.5 px-2.5 2xl:px-3 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors ${current || open ? 'text-[#174f7a]' : 'text-[#08263c]/80 hover:text-[#174f7a]'}`}
                  >
                    {menu.label}
                    <ChevronDown size={13} aria-hidden="true" className={`opacity-55 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </Link>
                  <span aria-hidden="true" className={`pointer-events-none absolute inset-x-2.5 bottom-0 h-[3px] origin-left rounded-t bg-[#f4a024] transition-transform duration-200 ${open || current ? 'scale-x-100' : 'scale-x-0'}`} />

                  <div className={`absolute top-full pt-1 transition duration-150 ease-out ${open ? 'visible opacity-100' : 'invisible opacity-0'} ${menu.align === 'right' ? 'right-0' : 'left-0'}`}>
                    <div className="w-max overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-[0_24px_64px_rgba(8,38,60,0.16)]">
                      <ul className={`grid gap-0.5 ${menu.links.length >= 12 ? 'lg:w-[720px] grid-cols-3' : menu.links.length >= 6 ? 'lg:w-[540px] grid-cols-2' : 'w-[320px] grid-cols-1'}`}>
                        {menu.links.map(link => {
                          const childCurrent = isChildCurrent(pathname, link.href);
                          return (
                            <li key={link.name}>
                              <Link
                                href={link.href}
                                aria-current={childCurrent ? 'true' : undefined}
                                className="flex flex-col gap-0.5 rounded-xl px-3 py-2 transition-colors hover:bg-[#eef8fe]"
                              >
                                <span className={`text-sm font-bold leading-5 ${childCurrent ? 'text-[#174f7a]' : 'text-[#08263c]'}`}>{link.name}</span>
                                <span className="text-[12px] leading-5 text-slate-500">{link.note}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/education-fit-assessment"
            className="mb-auto mt-auto hidden h-11 shrink-0 items-center gap-2 rounded-full bg-[#f4a024] px-5 text-[13px] font-extrabold text-[#08263c] shadow-sm transition hover:bg-[#ffb33f] sm:inline-flex xl:ml-4"
          >
            Free assessment <ArrowRight size={15} />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(open => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            className="my-auto ml-3 grid size-11 shrink-0 place-items-center rounded-xl border border-[#1767a0]/15 bg-[#eef8fe] text-[#1767a0] xl:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer: grouped accordions mirror the desktop IA */}
      {mobileOpen && (
        <div id="mobile-navigation" className="h-[calc(100dvh-72px)] overflow-y-auto border-b border-slate-200 bg-white xl:hidden">
          <div className="mx-auto max-w-2xl px-5 py-6">
            <div className="grid grid-cols-2 gap-3">
              <Link href="/education-fit-assessment" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#f4a024] px-3 text-center text-sm font-extrabold text-[#08263c]">Free assessment <ArrowRight size={15} /></Link>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 text-center text-sm font-extrabold text-[#07301a]"><MessageCircle size={17} /> WhatsApp</a>
            </div>

            <div className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
              {menus.map(menu => {
                const current = isSectionCurrent(pathname, menu.href, menu.links);
                return (
                  <details key={menu.href} open={current} className="group/dropdown py-1">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-1 py-2.5">
                      <span className={`text-[13px] font-extrabold uppercase tracking-[0.08em] ${current ? 'text-[#174f7a]' : 'text-[#08263c]'}`}>{menu.label}</span>
                      <span className="grid size-7 place-items-center rounded-full bg-[#f5f9fc] text-slate-500 transition group-open:rotate-180 group-open:bg-[#eef8fe] group-open:text-[#174f7a]"><ChevronDown size={14} /></span>
                    </summary>
                    <div className="grid gap-1 px-1 pb-3 pt-1">
                      <Link href={menu.href} className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#1767a0] hover:underline">Overview</Link>
                      {menu.links.map(link => {
                        const active = isChildCurrent(pathname, link.href);
                        return (
                          <Link
                            key={link.name}
                            href={link.href}
                            aria-current={active ? 'true' : undefined}
                            className={`flex flex-col gap-0.5 rounded-xl px-2.5 py-2 transition-colors ${active ? 'bg-[#eef8fe]' : 'hover:bg-[#f5f9fc]'}`}
                          >
                            <span className={`text-sm font-bold leading-5 ${active ? 'text-[#174f7a]' : 'text-[#08263c]'}`}>{link.name}</span>
                            <span className="text-[12px] leading-5 text-slate-500">{link.note}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-[#f5f9fc] p-5">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#1767a0]">Talk to EduExpress</p>
              <p className="mt-2 text-sm text-slate-600">{hours}</p>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#1767a0]"><Phone size={16} /> {formatBangladeshPhone(phone)}</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
