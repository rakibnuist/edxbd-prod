'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronDown, Clock3, MapPin, Menu, MessageCircle, Phone, Search, X } from 'lucide-react';
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
import SearchPalette from '@/components/site/SearchPalette';

// One grouped primary navigation, one source of truth (siteNavigation.ts).
// Desktop panels are led by a short explanation of the section — a reader can
// pick the right page without decoding seven identical link cards.
type HeaderMenu = {
  label: string;
  href: string;
  summary: string;
  links: SiteLink[];
  align?: 'left' | 'right';
};

const menus: HeaderMenu[] = [
  {
    label: 'China',
    href: '/study-in-china-from-bangladesh',
    summary: 'The deepest evidence base we publish: universities, costs, scholarships and visa routes.',
    links: chinaNavigation,
  },
  {
    label: 'Destinations',
    href: '/destinations',
    summary: 'Twelve destination services, each labelled with its current status rather than sold equally.',
    links: destinationLinks,
  },
  {
    label: 'Find education',
    href: '/find-education',
    summary: 'Start with your subject, level, budget and intake — then narrow to universities.',
    links: findEducationNavigation,
  },
  {
    label: 'Your journey',
    href: '/your-study-journey',
    summary: 'Seven stages from profile assessment to university registration, with what you receive at each.',
    links: journeyNavigation,
  },
  {
    label: 'How we help',
    href: '/services',
    summary: 'What we do, what the university does, and what nobody can promise you.',
    links: serviceNavigation,
  },
  {
    label: 'Proof',
    href: '/proof-library',
    summary: 'Inspect the records: verification method, fee policy, outcomes and complaint handling.',
    links: proofNavigation,
    align: 'right',
  },
  {
    label: 'Advice',
    href: '/updates',
    summary: 'Dated guidance and current intake news, written by the counselling team.',
    links: resourceNavigation,
    align: 'right',
  },
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
  const [scrolled, setScrolled] = useState(false);
  const desktopNavRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };
  const openGroup = (href: string) => {
    cancelClose();
    setOpenMenu(href);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset menu state when the route changes
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!desktopNavRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const onScroll = () => setScrolled(window.scrollY > 12);
    document.addEventListener('pointerdown', onPointerDown);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const phone = office?.phonePrimary ?? '+8801983333566';
  const hours = office?.hours ?? 'Saturday to Thursday, 11:00 AM to 6:00 PM';
  const whatsappHref = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Assalamu alaikum. I would like counselling for studying abroad.',
  )}`;
  const open = Boolean(openMenu);
  const assessmentHref = pathname === '/' ? '#assessment' : '/education-fit-assessment';

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      <div className="h-[3px] bg-gradient-to-r from-petrol-700 via-sky-500 to-mint-300" aria-hidden="true" />
      {/* Contact strip — facts only, no marketing. */}
      <div className="hidden h-[34px] border-b border-petrol-900/60 bg-petrol-800 text-[12px] text-white/80 lg:block">
        <div className="mx-auto flex h-full max-w-shell items-center justify-between px-6">
          <div className="flex items-center gap-5">
            <Link href="/contact" className="inline-flex items-center gap-1.5 transition-colors hover:text-mint-300">
              <MapPin size={13} aria-hidden="true" /> Dhanmondi, Dhaka
            </Link>
            <span className="inline-flex items-center gap-1.5 text-white/70">
              <Clock3 size={13} aria-hidden="true" /> {hours}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/bn/study-in-china" hrefLang="bn-BD" lang="bn" className="font-semibold text-white transition-colors hover:text-mint-300">
              বাংলা
            </Link>
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-mint-300">
              <Phone size={13} aria-hidden="true" /> {formatBangladeshPhone(phone)}
            </a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-mint-300 transition-colors hover:text-white">
              <MessageCircle size={13} aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className={`relative border-b bg-white backdrop-blur-xl transition-shadow duration-200 after:absolute after:inset-x-0 after:bottom-0 after:h-[1px] after:bg-gradient-to-r after:from-petrol-600/90 after:via-sky-500/80 after:to-transparent ${
          open || scrolled ? 'border-rule shadow-[0_14px_50px_-16px_rgba(15,53,87,.75)]' : 'border-rule shadow-[0_6px_30px_-14px_rgba(15,53,87,.5)]'
        }`}
      >
        <div className="mx-auto flex h-[64px] max-w-shell items-center justify-between px-3 sm:h-[72px] sm:px-6 lg:justify-start">
          <Link href="/" aria-label="EduExpress International home" className="shrink-0">
            <Image src="/logo.png" alt="EduExpress International" width={180} height={51} priority className="h-8 w-auto mix-blend-multiply sm:h-9 lg:h-10" />
          </Link>

          <div
            ref={desktopNavRef}
            className="ml-auto hidden h-full items-stretch xl:flex"
            onMouseLeave={scheduleClose}
            onKeyDown={event => {
              if (event.key === 'Escape') setOpenMenu(null);
            }}
          >
            {menus.map(menu => {
              const current = isSectionCurrent(pathname, menu.href, menu.links);
              const isOpen = openMenu === menu.href;
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
                    aria-expanded={isOpen}
                    aria-current={current ? 'true' : undefined}
                    className={`relative flex items-center gap-1 whitespace-nowrap px-2.5 text-[13px] font-medium tracking-[-0.005em] transition-colors xl:px-3 ${
                      current || isOpen ? 'text-petrol-700' : 'text-ink-soft hover:text-petrol-600'
                    }`}
                  >
                    {menu.label}
                    <ChevronDown size={12} aria-hidden="true" className={`mt-0.5 text-ink-mute transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-2.5 bottom-0 h-[2px] origin-left bg-petrol-600 transition-transform duration-200 ${
                        current || isOpen ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </Link>

                  <div
                    className={`absolute top-full pt-2 transition duration-150 ease-out ${
                      isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                    } ${menu.align === 'right' ? 'right-0' : 'left-0'}`}
                  >
                    <div className="grid w-[min(88vw,880px)] grid-cols-[minmax(0,240px)_minmax(0,1fr)] overflow-hidden rounded-[22px] border border-rule bg-white shadow-deep">
                      <div className="rounded-l-[22px] border-r border-rule bg-blush/50 p-6">
                        <p className="ed-label">{menu.label}</p>
                        <p className="mt-3 font-heading text-[19px] leading-[1.25] text-ink">{menu.summary}</p>
                        <Link href={menu.href} className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-petrol-600 hover:text-petrol-800">
                          Open overview <ArrowUpRight size={14} aria-hidden="true" />
                        </Link>
                      </div>
                      <ul className={`grid gap-x-6 gap-y-1 p-4 ${menu.links.length > 6 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {menu.links.map(link => {
                          const childCurrent = isChildCurrent(pathname, link.href);
                          return (
                            <li key={`${link.href}-${link.name}`}>
                              <Link
                                href={link.href}
                                aria-current={childCurrent ? 'true' : undefined}
                                className="group flex flex-col gap-0.5 rounded-[12px] border-l-2 border-transparent px-3 py-2 transition-colors hover:border-terra hover:bg-chalk-100"
                              >
                                <span className={`text-[13.5px] font-semibold leading-5 ${childCurrent ? 'text-petrol-700' : 'text-ink'} group-hover:text-petrol-700`}>
                                  {link.name}
                                </span>
                                {link.note && <span className="text-[12px] leading-[1.45] text-ink-mute">{link.note}</span>}
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

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:ml-4">
            <span className="hidden sm:block">
              <SearchPalette />
            </span>
            <Link
              href={assessmentHref}
              className="ed-btn ed-btn-signal min-h-9 px-3 text-[11.5px] sm:min-h-10 sm:px-4 sm:text-[13px]"
            >
              Free assessment
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(value => !value)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              className="grid size-9 place-items-center rounded-full border border-rule bg-white text-petrol-700 sm:size-10 xl:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-navigation" className="h-[calc(100dvh-64px)] overflow-y-auto border-b border-rule bg-chalk sm:h-[calc(100dvh-72px)] lg:h-[calc(100dvh-108px)] xl:hidden">
          <div className="mx-auto max-w-2xl px-4 pb-24 pt-4 sm:px-5">
            <div className="grid grid-cols-2 gap-2">
              <Link href={assessmentHref} onClick={() => setMobileOpen(false)} className="ed-btn ed-btn-signal min-h-11 text-sm">
                Free assessment
              </Link>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="ed-btn min-h-11 bg-[#25d366] text-sm text-[#06251a]">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>

            <Link
              href="/universities"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex min-h-11 items-center gap-2 rounded-xl border border-rule bg-white px-4 text-[13px] font-semibold text-petrol-700"
            >
              <Search size={16} aria-hidden="true" /> Search universities & programs
            </Link>

            <div className="mt-4 border-t border-rule">
              {menus.map(menu => {
                const current = isSectionCurrent(pathname, menu.href, menu.links);
                return (
                  <details key={menu.href} open={current} className="group/cmd border-b border-rule py-1">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-1 py-3">
                      <span className={`font-heading text-[17px] ${current ? 'text-petrol-700' : 'text-ink'}`}>{menu.label}</span>
                      <span className="grid size-7 place-items-center rounded-full border border-rule text-ink-mute transition group-open:rotate-180 group-open:border-petrol-400 group-open:text-petrol-600">
                        <ChevronDown size={14} />
                      </span>
                    </summary>
                    <div className="grid gap-0.5 pb-3 pl-1">
                      <Link href={menu.href} className="py-1.5 text-[13px] font-semibold text-petrol-600">
                        Overview
                      </Link>
                      {menu.links.map(link => {
                        const active = isChildCurrent(pathname, link.href);
                        return (
                          <Link
                            key={`${link.href}-${link.name}`}
                            href={link.href}
                            aria-current={active ? 'true' : undefined}
                            className={`flex flex-col gap-0.5 border-l-2 py-1.5 pl-3 ${active ? 'border-marigold' : 'border-transparent'}`}
                          >
                            <span className={`text-[14px] font-medium ${active ? 'text-petrol-700' : 'text-ink'}`}>{link.name}</span>
                            {link.note && <span className="text-[12px] leading-[1.45] text-ink-mute">{link.note}</span>}
                          </Link>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>

            <div className="mt-6 rounded-[22px] border border-rule bg-white p-5">
              <p className="ed-label">Talk to EduExpress</p>
              <p className="mt-2 text-sm text-ink-soft">{hours}</p>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-petrol-600">
                <Phone size={15} /> {formatBangladeshPhone(phone)}
              </a>
              <Link
                href="/bn/study-in-china"
                hrefLang="bn-BD"
                lang="bn"
                className="mt-4 flex items-center justify-between border-t border-rule pt-3 text-sm font-semibold text-petrol-700"
              >
                বাংলা <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
