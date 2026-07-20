'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  ChevronDown,
  CircleDollarSign,
  FileCheck2,
  Globe2,
  Menu,
  Phone,
  ScanSearch,
  ShieldCheck,
  X,
} from 'lucide-react';

const destinations = [
  { name: 'China', href: '/study-in-china-from-bangladesh', note: 'Flagship since 2018', code: 'CN' },
  { name: 'Malta', href: '/destinations/malta', note: 'Active since 2025', code: 'MT' },
  { name: 'Hungary', href: '/destinations/hungary', note: 'Active since 2025', code: 'HU' },
  { name: 'Cyprus', href: '/destinations/cyprus', note: 'Active since 2025', code: 'CY' },
  { name: 'South Korea', href: '/destinations/south-korea', note: 'Active since 2025', code: 'KR' },
  { name: 'United Kingdom', href: '/destinations/uk', note: 'Active since 2025', code: 'UK' },
  { name: 'Georgia', href: '/destinations/georgia', note: 'Active since 2025', code: 'GE' },
  { name: 'Greece', href: '/destinations/greece', note: 'University collaboration', code: 'GR' },
  { name: 'Malaysia', href: '/destinations/malaysia', note: 'Active university routes', code: 'MY' },
  { name: 'Thailand', href: '/destinations/thailand', note: 'Active university routes', code: 'TH' },
];

const chinaLinks = [
  { name: 'Study in China hub', href: '/study-in-china-from-bangladesh' },
  { name: 'CSC Scholarship BD', href: '/csc-scholarship-bangladesh' },
  { name: 'China Student Visa', href: '/china-student-visa-bangladesh' },
  { name: 'Study Cost Breakdown', href: '/study-in-china-cost-bangladesh' },
  { name: 'Study Without IELTS', href: '/study-in-china-without-ielts' },
  { name: 'MBBS in China', href: '/mbbs-in-china-bangladesh' },
  { name: 'Intakes & Deadlines', href: '/china-intakes-deadlines' },
  { name: 'Life in China', href: '/life-in-china-bangladeshi-students' },
  { name: 'Success Stories', href: '/china-success-stories' },
  { name: 'চীনে উচ্চশিক্ষা (বাংলা)', href: '/bn/study-in-china' },
  { name: 'China universities', href: '/china-universities' },
];

const proofLinks = [
  { name: 'Better Education Standard', href: '/better-education-standard', icon: BookOpenCheck, note: 'Six checks before a recommendation' },
  { name: 'Fees and transparency', href: '/fees-and-transparency', icon: CircleDollarSign, note: 'See who receives every payment' },
  { name: 'University verification', href: '/how-we-verify-universities', icon: ShieldCheck, note: 'Inspect recognition and evidence' },
  { name: 'Application support', href: '/services', icon: FileCheck2, note: 'Understand our role and scope' },
];

type MenuName = 'destinations' | 'china' | 'proof';

export default function LightHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuName | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<MenuName | null>('destinations');

  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setActiveMenu(null);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setActiveMenu(null);
    };
    const onScroll = () => setActiveMenu(null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = (menu: MenuName) => {
    clearCloseTimer();
    setActiveMenu(menu);
  };

  const scheduleMenuClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setActiveMenu(null), 180);
  };

  const closeMenu = () => {
    clearCloseTimer();
    setActiveMenu(null);
  };

  const toggleMenu = (menu: MenuName) => {
    clearCloseTimer();
    setActiveMenu(current => current === menu ? null : menu);
  };
  const toggleMobileGroup = (menu: MenuName) => setMobileGroup(current => current === menu ? null : menu);

  return (
    <header ref={headerRef} onMouseEnter={clearCloseTimer} onMouseLeave={scheduleMenuClose} className="fixed inset-x-0 top-0 z-50 text-[#08263c]">
      <div className="hidden h-7 bg-[#08263c] text-[10px] font-extrabold uppercase tracking-[0.17em] text-white min-[1200px]:block">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6">
          <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#64b5df]" /> Dhanmondi decision desk is open</span>
          <span>10 active destination services</span>
          <a href="tel:+8801983333566" className="flex items-center gap-2 hover:text-[#8ed0ee]"><Phone size={12} /> +880 1983-333566</a>
        </div>
      </div>

      <nav className="border-b border-[#174f7a]/20 bg-white/95 shadow-[0_12px_35px_rgba(8,38,60,0.08)] backdrop-blur-xl" aria-label="Main navigation">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-5 px-4 sm:px-6">
          <Link href="/" className="shrink-0" aria-label="EduExpress International home">
            <Image src="/logo.png" width={190} height={53} priority unoptimized alt="EduExpress International" className="h-10 w-auto lg:h-[42px]" />
          </Link>

          <div className="ml-auto hidden h-full items-center min-[1200px]:flex">
            <Link href="/" onMouseEnter={closeMenu} onFocus={closeMenu} className="grid h-full place-items-center border-x border-transparent px-3 text-sm font-extrabold hover:bg-[#e9f7fd]">Home</Link>
            <button onClick={() => toggleMenu('destinations')} onMouseEnter={() => openMenu('destinations')} onFocus={() => openMenu('destinations')} className={`flex h-full items-center gap-1.5 border-x px-3 text-sm font-extrabold transition ${activeMenu === 'destinations' ? 'border-[#174f7a]/15 bg-[#e9f7fd] text-[#174f7a]' : 'border-transparent hover:bg-[#e9f7fd]'}`} aria-expanded={activeMenu === 'destinations'} aria-controls="destinations-menu">
              Destinations <ChevronDown size={15} className={`transition ${activeMenu === 'destinations' ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={() => toggleMenu('china')} onMouseEnter={() => openMenu('china')} onFocus={() => openMenu('china')} className={`flex h-full items-center gap-2 border-x px-3 text-sm font-extrabold transition ${activeMenu === 'china' ? 'border-[#174f7a]/15 bg-[#e9f7fd] text-[#174f7a]' : 'border-transparent hover:bg-[#e9f7fd]'}`} aria-expanded={activeMenu === 'china'} aria-controls="china-menu">
              <span className="grid size-5 place-items-center rounded-full bg-[#174f7a] font-mono text-[8px] text-white">CN</span> China flagship <ChevronDown size={15} className={`transition ${activeMenu === 'china' ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={() => toggleMenu('proof')} onMouseEnter={() => openMenu('proof')} onFocus={() => openMenu('proof')} className={`flex h-full items-center gap-1.5 border-x px-3 text-sm font-extrabold transition ${activeMenu === 'proof' ? 'border-[#174f7a]/15 bg-[#e9f7fd] text-[#174f7a]' : 'border-transparent hover:bg-[#e9f7fd]'}`} aria-expanded={activeMenu === 'proof'} aria-controls="proof-menu">
              How we decide <ChevronDown size={15} className={`transition ${activeMenu === 'proof' ? 'rotate-180' : ''}`} />
            </button>
            <Link href="/universities" onMouseEnter={closeMenu} onFocus={closeMenu} className="grid h-full place-items-center border-x border-transparent px-3 text-sm font-extrabold hover:bg-[#e9f7fd]">Find education</Link>
            <Link href="/updates" onMouseEnter={closeMenu} onFocus={closeMenu} className="grid h-full place-items-center border-x border-transparent px-3 text-sm font-extrabold hover:bg-[#e9f7fd]">Updates</Link>
            <Link href="/contact" onMouseEnter={closeMenu} onFocus={closeMenu} className="grid h-full place-items-center border-x border-transparent px-3 text-sm font-extrabold hover:bg-[#e9f7fd]">Contact</Link>
          </div>

          <div className="ml-auto hidden items-center gap-2 md:flex min-[1200px]:hidden">
            <Link href="/study-in-china-from-bangladesh" className="flex items-center gap-2 border border-[#174f7a]/20 bg-[#e9f7fd] px-4 py-3 text-xs font-black text-[#174f7a]">
              <span className="grid size-5 place-items-center rounded-full bg-[#174f7a] font-mono text-[8px] text-white">CN</span> China flagship
            </Link>
            <Link href="/education-fit-assessment" className="flex items-center gap-2 bg-[#174f7a] px-4 py-3 text-xs font-black text-white">Free Fit Assessment <ArrowUpRight size={15} /></Link>
          </div>

          <Link href="/education-fit-assessment" onMouseEnter={closeMenu} onFocus={closeMenu} className="ml-auto hidden shrink-0 items-center gap-2 bg-[#174f7a] px-4 py-3 text-sm font-black text-white transition hover:bg-[#08263c] min-[1200px]:ml-0 min-[1200px]:inline-flex">
            Free Fit Assessment <ArrowUpRight size={16} />
          </Link>

          <button onClick={() => setMobileOpen(current => !current)} className="ml-auto grid size-11 shrink-0 place-items-center border border-[#174f7a]/25 bg-[#e9f7fd] min-[1200px]:hidden" aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {activeMenu === 'destinations' && (
          <div id="destinations-menu" onMouseEnter={clearCloseTimer} onMouseLeave={scheduleMenuClose} className="absolute inset-x-0 top-full hidden border-b border-[#174f7a]/20 bg-white shadow-[0_30px_55px_rgba(8,38,60,0.18)] min-[1200px]:block">
            <div className="mx-auto grid max-w-[1440px] grid-cols-[.34fr_.66fr]">
              <Link href="/study-in-china-from-bangladesh" className="group relative min-h-[330px] overflow-hidden bg-[#08263c] p-8 text-white">
                <Image src="/images/destinations/china.jpg" alt="Study in China from Bangladesh" fill sizes="34vw" className="object-cover opacity-30 transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08263c] via-[#08263c]/70 to-[#174f7a]/15" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#8ed0ee]"><span>Flagship record</span><span>Since 2018</span></div>
                  <div>
                    <p className="font-heading text-4xl font-bold leading-none">Study in China</p>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">University comparison, costs, scholarships and visa readiness for Bangladeshi students.</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#8ed0ee]">Enter China hub <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
                  </div>
                </div>
              </Link>
              <div className="p-7">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Active service map</p><h2 className="mt-1 font-heading text-2xl font-bold">Compare ten destination routes</h2></div>
                  <Link href="/destinations" className="flex items-center gap-2 text-sm font-black text-[#174f7a]">View all <ArrowRight size={15} /></Link>
                </div>
                <div className="grid grid-cols-3 border-l border-t border-[#174f7a]/20">
                  {destinations.slice(1).map(destination => (
                    <Link key={destination.href} href={destination.href} className="group flex min-h-20 items-center gap-3 border-b border-r border-[#174f7a]/20 p-3 hover:bg-[#e9f7fd]">
                      <span className="grid size-9 shrink-0 place-items-center bg-[#e9f7fd] font-mono text-[10px] font-black text-[#174f7a] group-hover:bg-[#174f7a] group-hover:text-white">{destination.code}</span>
                      <span><strong className="block text-sm">{destination.name}</strong><small className="mt-0.5 block text-[10px] text-slate-500">{destination.note}</small></span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'china' && (
          <div id="china-menu" onMouseEnter={clearCloseTimer} onMouseLeave={scheduleMenuClose} className="absolute inset-x-0 top-full hidden border-b border-[#174f7a]/20 bg-[#08263c] text-white shadow-[0_30px_55px_rgba(8,38,60,0.25)] min-[1200px]:block">
            <div className="mx-auto grid max-w-[1440px] grid-cols-[.42fr_.58fr]">
              <div className="relative overflow-hidden border-r border-white/15 p-8">
                <div className="pointer-events-none absolute -right-6 -top-6 size-48 opacity-15">
                  <Image src="/emblem-icon.png" width={200} height={200} unoptimized alt="" className="h-auto w-full object-contain filter brightness-0 invert" />
                </div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#8ed0ee]">China record through 2025</p>
                <div className="mt-7 grid grid-cols-3 gap-px bg-white/15">
                  {[['2018', 'Operating since'], ['98%', 'Recorded visa success'], ['2000+', 'B2C and B2B students']].map(item => <div key={item[0]} className="bg-[#08263c] p-4"><strong className="font-heading text-3xl text-[#8ed0ee]">{item[0]}</strong><span className="mt-2 block text-[10px] leading-4 text-white/55">{item[1]}</span></div>)}
                </div>
                <p className="mt-4 text-[10px] leading-5 text-white/50">Company records through 2025. The 2027 cycle is now in planning, with every university and authority issuing its own decision.</p>
              </div>
              <div className="grid grid-cols-2 p-7">
                {chinaLinks.map((item, index) => (
                  <Link key={item.href} href={item.href} className="group flex items-center justify-between border-b border-white/15 px-4 py-3 hover:bg-white/5">
                    <span className="flex items-center gap-3"><span className="font-mono text-[10px] text-[#8ed0ee]">0{index + 1}</span><span className="text-sm font-bold">{item.name}</span></span><ArrowUpRight size={15} className="text-[#8ed0ee] transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'proof' && (
          <div id="proof-menu" onMouseEnter={clearCloseTimer} onMouseLeave={scheduleMenuClose} className="absolute inset-x-0 top-full hidden border-b border-[#174f7a]/20 bg-[#e9f7fd] shadow-[0_30px_55px_rgba(8,38,60,0.18)] min-[1200px]:block">
            <div className="mx-auto grid max-w-[1440px] grid-cols-[.32fr_.68fr] p-7">
              <div className="border-r border-[#174f7a]/20 pr-8">
                <span className="grid size-12 place-items-center bg-[#174f7a] text-white"><ScanSearch size={24} /></span>
                <h2 className="mt-5 font-heading text-3xl font-bold leading-tight">Decide with evidence, not pressure</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Our process separates education fit, total cost, verification and responsibility before a student commits.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pl-7">
                {proofLinks.map(({ name, href, icon: Icon, note }) => (
                  <Link key={href} href={href} className="group flex items-center gap-4 border border-[#174f7a]/15 bg-white p-4 hover:border-[#174f7a]">
                    <span className="grid size-11 shrink-0 place-items-center bg-[#e9f7fd] text-[#174f7a]"><Icon size={21} /></span>
                    <span><strong className="block text-sm">{name}</strong><small className="mt-1 block text-[10px] text-slate-500">{note}</small></span>
                    <ArrowRight size={15} className="ml-auto shrink-0 text-[#174f7a] transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {mobileOpen && (
        <div id="mobile-navigation" className="h-[calc(100dvh-76px)] overflow-y-auto border-b border-[#174f7a]/20 bg-[#f4f8fa] min-[1200px]:hidden">
          <div className="mx-auto max-w-2xl px-4 py-5">
            <div className="grid grid-cols-2 gap-2">
              <a href="tel:+8801983333566" className="flex items-center justify-center gap-2 bg-[#08263c] px-3 py-3 text-xs font-bold text-white"><Phone size={15} /> +880 1983-333566</a>
              <Link href="/education-fit-assessment" className="flex items-center justify-center gap-2 bg-[#64b5df] px-3 py-3 text-center text-xs font-black">Free Fit Assessment <ArrowUpRight size={15} /></Link>
            </div>

            <div className="mt-4 border-t border-[#174f7a]/20">
              <Link href="/" className="flex items-center justify-between border-b border-[#174f7a]/20 py-4 font-heading text-xl font-bold">Home <ArrowRight size={18} /></Link>
              {([
                ['destinations', 'Destinations', Globe2],
                ['china', 'China flagship', ShieldCheck],
                ['proof', 'How we decide', ScanSearch],
              ] as [MenuName, string, typeof Globe2][]).map(([key, label, Icon]) => (
                <div key={key} className="border-b border-[#174f7a]/20">
                  <button onClick={() => toggleMobileGroup(key)} className="flex w-full items-center justify-between py-4 text-left font-heading text-xl font-bold" aria-expanded={mobileGroup === key}>
                    <span className="flex items-center gap-3"><Icon size={20} className="text-[#174f7a]" />{label}</span><ChevronDown size={18} className={`transition ${mobileGroup === key ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileGroup === key && (
                    <div className="mb-4 grid gap-px bg-[#174f7a]/15">
                      {(key === 'destinations' ? destinations.map(item => ({ name: item.name, href: item.href })) : key === 'china' ? chinaLinks : proofLinks).map(item => (
                        <Link key={item.href} href={item.href} className="flex items-center justify-between bg-white px-4 py-3 text-sm font-bold hover:bg-[#e9f7fd]">{item.name}<ArrowRight size={15} className="text-[#174f7a]" /></Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/universities" className="flex items-center justify-between border-b border-[#174f7a]/20 py-4 font-heading text-xl font-bold">Find education <ArrowRight size={18} /></Link>
              <Link href="/updates" className="flex items-center justify-between border-b border-[#174f7a]/20 py-4 font-heading text-xl font-bold">Updates <ArrowRight size={18} /></Link>
              <Link href="/contact" className="flex items-center justify-between border-b border-[#174f7a]/20 py-4 font-heading text-xl font-bold">Contact <ArrowRight size={18} /></Link>
            </div>
            <p className="py-5 text-center text-[11px] font-bold uppercase leading-5 tracking-[0.14em] text-slate-500">Saturday-Thursday 11:00 AM-6:00 PM, Friday closed</p>
          </div>
        </div>
      )}
    </header>
  );
}
