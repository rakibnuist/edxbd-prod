'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Clock3, MapPin, Menu, MessageCircle, Phone, Search, X } from 'lucide-react';
import {
  aboutNavigation,
  chinaNavigation,
  costNavigation,
  destinationLinks,
  type SiteLink,
} from '@/data/siteNavigation';
import { formatBangladeshPhone } from '@/lib/contact-format';
import SearchPalette from '@/components/site/SearchPalette';

// Six plain-language sections. A first-time student or parent should be able
// to guess what is behind each label without reading a description.
type HeaderMenu = {
  label: string;
  href: string;
  links: SiteLink[];
  align?: 'left' | 'right';
  wide?: boolean;
};

const menus: HeaderMenu[] = [
  { label: 'Study in China', href: '/study-in-china-from-bangladesh', links: chinaNavigation },
  { label: 'Destinations', href: '/destinations', links: destinationLinks, wide: true },
  { label: 'Universities', href: '/universities', links: [] },
  { label: 'Scholarships & costs', href: '/scholarships', links: costNavigation },
  { label: 'Updates', href: '/updates', links: [] },
  { label: 'About us', href: '/about', links: aboutNavigation, align: 'right', wide: true },
];

const slugOf = (href: string) => href.split('#')[0];
const isCurrent = (pathname: string, href: string) => {
  const base = slugOf(href);
  return base.startsWith('/') && (pathname === base || pathname.startsWith(`${base}/`));
};
const isSectionCurrent = (pathname: string, menu: HeaderMenu) =>
  isCurrent(pathname, menu.href) || menu.links.some(link => isCurrent(pathname, link.href));

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
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const phone = office?.phonePrimary ?? '+8801983333566';
  const hours = office?.hours ?? 'Saturday to Thursday, 11:00 AM to 6:00 PM';
  const telHref = `tel:${phone.replace(/\s/g, '')}`;
  const whatsappHref = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Assalamu alaikum. I would like counselling for studying abroad.',
  )}`;
  const assessmentHref = pathname === '/' ? '#assessment' : '/education-fit-assessment';

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      {/* Keeps the header's total height unchanged (pages offset for it). */}
      <div className="h-[3px] transition-colors bg-petrol-600" aria-hidden="true" />

      {/* Contact facts: who we are and how to reach a person. */}
      <div className="hidden h-[34px] border-b text-[14px] transition-colors lg:block border-rule bg-chalk-100 text-ink-soft">
        <div className="mx-auto flex h-full max-w-shell items-center justify-between px-6">
          <div className="flex items-center gap-5">
            <Link href="/contact" className="inline-flex items-center gap-1.5 hover:underline">
              <MapPin size={14} aria-hidden="true" className="text-petrol-500" /> Office in Dhanmondi, Dhaka
            </Link>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} aria-hidden="true" className="text-petrol-500" /> {hours}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/bn/study-in-china" hrefLang="bn-BD" lang="bn" className="font-semibold text-petrol-700 hover:text-petrol-900">
              বাংলা
            </Link>
            <a href={telHref} className="inline-flex items-center gap-1.5 font-semibold text-petrol-700 hover:text-petrol-900">
              <Phone size={14} aria-hidden="true" /> {formatBangladeshPhone(phone)}
            </a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-green-600 hover:text-green-700">
              <MessageCircle size={14} aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className={`border-b transition-[background-color,box-shadow,border-color] duration-200 ${
          'border-rule bg-white'
        } ${scrolled || openMenu ? 'shadow-[0_8px_24px_-18px_rgba(15,23,42,.45)]' : ''}`}
      >
        <div className="mx-auto flex h-[64px] max-w-shell items-center justify-between px-4 sm:h-[72px] sm:px-6">
          <Link href="/" aria-label="EduExpress International home" className="shrink-0">
            <Image src="/logo.png" alt="EduExpress International" width={180} height={51} priority className="h-8 w-auto sm:h-9 lg:h-10" />
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
              const current = isSectionCurrent(pathname, menu);
              const hasMenu = menu.links.length > 0;
              const isOpen = hasMenu && openMenu === menu.href;
              return (
                <div
                  key={menu.href}
                  className="relative flex h-full items-stretch"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(hasMenu ? menu.href : null);
                  }}
                  onFocus={() => {
                    cancelClose();
                    setOpenMenu(hasMenu ? menu.href : null);
                  }}
                  onBlur={event => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setOpenMenu(prev => (prev === menu.href ? null : prev));
                    }
                  }}
                >
                  <Link
                    href={menu.href}
                    aria-haspopup={hasMenu ? 'true' : undefined}
                    aria-expanded={hasMenu ? isOpen : undefined}
                    aria-current={current ? 'page' : undefined}
                    className={`relative flex items-center gap-1 whitespace-nowrap px-3 text-[15px] font-semibold transition-colors 2xl:px-3.5 ${
                      current || isOpen ? 'text-petrol-600' : 'text-ink hover:text-petrol-600'
                    }`}
                  >
                    {menu.label}
                    {hasMenu && (
                      <ChevronDown size={15} aria-hidden="true" className={`transition-transform duration-200 text-ink-mute ${isOpen ? 'rotate-180' : ''}`} />
                    )}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3.5 bottom-0 h-[3px] rounded-t bg-petrol-600 transition-opacity ${current ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </Link>

                  {hasMenu && (
                    <div
                      className={`absolute top-full pt-2 transition duration-150 ease-out ${
                        isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                      } ${menu.align === 'right' ? 'right-0' : 'left-0'}`}
                    >
                      <ul
                        className={`grid gap-1 rounded-xl border border-rule bg-white p-2 shadow-[0_20px_40px_-24px_rgba(15,23,42,.45)] ${
                          menu.wide ? 'w-[560px] grid-cols-2' : 'w-[340px] grid-cols-1'
                        }`}
                      >
                        {menu.links.map(link => (
                          <li key={`${link.href}-${link.name}`}>
                            <Link
                              href={link.href}
                              aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
                              className="flex flex-col rounded-lg px-3 py-2.5 hover:bg-chalk-100"
                            >
                              <span className="text-[15px] font-semibold leading-6 text-ink">{link.name}</span>
                              {link.note && <span className="text-[14px] leading-5 text-ink-mute">{link.note}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:ml-4">
            <span className="hidden sm:block">
              <SearchPalette />
            </span>
            <a
              href={telHref}
              aria-label={`Call ${formatBangladeshPhone(phone)}`}
              className="grid size-10 place-items-center rounded-lg border lg:hidden border-rule text-petrol-600 hover:bg-chalk-100"
            >
              <Phone size={18} aria-hidden="true" />
            </a>
            <Link href={assessmentHref} className="ed-btn ed-btn-signal min-h-10 px-4 text-[14px] sm:text-[15px]">
              Free assessment
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(value => !value)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="grid size-10 place-items-center rounded-lg border xl:hidden border-rule bg-white text-petrol-700"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-navigation" className="h-[calc(100dvh-67px)] overflow-y-auto border-b border-rule bg-white sm:h-[calc(100dvh-75px)] lg:h-[calc(100dvh-109px)] xl:hidden">
          <div className="mx-auto max-w-2xl px-4 pb-24 pt-4 sm:px-5">
            <div className="grid grid-cols-2 gap-2">
              <Link href={assessmentHref} onClick={() => setMobileOpen(false)} className="ed-btn ed-btn-signal min-h-12 whitespace-nowrap px-3 text-[15px]">
                Free assessment
              </Link>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-outline min-h-12 text-[15px]">
                <MessageCircle size={17} aria-hidden="true" className="text-green-600" /> WhatsApp
              </a>
            </div>

            <Link
              href="/universities"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex min-h-12 items-center gap-2 rounded-lg border border-rule bg-chalk-100 px-4 text-[15px] font-semibold text-petrol-700"
            >
              <Search size={17} aria-hidden="true" /> Search universities and programmes
            </Link>

            <div className="mt-4 border-t border-rule">
              {menus.map(menu =>
                menu.links.length === 0 ? (
                  <Link key={menu.href} href={menu.href} className="flex min-h-14 items-center border-b border-rule px-1 text-[17px] font-semibold text-ink">
                    {menu.label}
                  </Link>
                ) : (
                  <details key={menu.href} open={isSectionCurrent(pathname, menu)} className="group border-b border-rule">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-1">
                      <span className="text-[17px] font-semibold text-ink">{menu.label}</span>
                      <ChevronDown size={18} aria-hidden="true" className="text-ink-mute transition group-open:rotate-180" />
                    </summary>
                    <div className="grid pb-3">
                      {menu.links.map(link => (
                        <Link
                          key={`${link.href}-${link.name}`}
                          href={link.href}
                          aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
                          className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink-soft hover:bg-chalk-100 aria-[current=page]:text-petrol-600"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                ),
              )}
            </div>

            <div className="mt-6 rounded-xl border border-rule bg-chalk-100 p-5">
              <p className="text-[15px] font-semibold text-ink">Talk to a counsellor</p>
              <p className="mt-1 text-[14px] text-ink-soft">{hours}</p>
              <a href={telHref} className="mt-3 inline-flex items-center gap-2 text-[15px] font-semibold text-petrol-600">
                <Phone size={16} aria-hidden="true" /> {formatBangladeshPhone(phone)}
              </a>
              <Link
                href="/bn/study-in-china"
                hrefLang="bn-BD"
                lang="bn"
                className="mt-4 flex items-center justify-between border-t border-rule pt-3 text-[15px] font-semibold text-petrol-700"
              >
                বাংলায় পড়ুন <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
