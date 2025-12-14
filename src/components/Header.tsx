'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ArrowRight, Mail } from 'lucide-react';
import Image from 'next/image';
import { m, AnimatePresence } from 'framer-motion';
import { trackConsultationRequest } from '@/lib/analytics';
import { fadeInDown, slideInFromLeft } from '@/lib/animations';
import { countries } from '@/lib/countries';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  const pathname = usePathname();


  // Check if we are on a university detail page (dark background)
  const isUniversityDetail = /^\/partnership\/universities\/[^/]+$/.test(pathname);

  // Check if we are on a destination detail page (dark background)
  const isDestinationDetail = /^\/destinations\/[^/]+$/.test(pathname);

  // Transparent when not scrolled (applies to all pages for consistent premium feel)
  const isTransparent = !isScrolled;

  // Dynamic Styles - Crystal Glass
  const headerClass = isTransparent
    ? 'bg-white/10 backdrop-blur-[10px] border-white/10 py-6' // Ultra-clear top state
    : 'bg-white/70 backdrop-blur-2xl border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-4'; // Frosted scroll state

  const navLinkClass = isTransparent
    ? (isUniversityDetail || isDestinationDetail ? 'text-white font-bold hover:text-blue-200' : 'text-slate-800 font-bold hover:text-blue-700') // Adaptive contrast
    : 'text-slate-600 hover:text-blue-600 font-medium';

  const logoFilterClass = '';

  const navigation = [
    { name: 'Home', href: '/', current: pathname === '/' },
    { name: 'Destinations', href: '/destinations', current: pathname.startsWith('/destinations') },
    { name: 'Universities', href: '/partnership/universities', current: pathname.startsWith('/partnership/universities') },
    { name: 'Services', href: '/services', current: pathname === '/services' },
    { name: 'Updates', href: '/updates', current: pathname === '/updates' },
    { name: 'Contact', href: '/contact', current: pathname === '/contact' },
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveDropdown('destinations');
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // Slightly longer delay for smoother exit
    setDropdownTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeout) clearTimeout(dropdownTimeout);
    };
  }, [dropdownTimeout]);



  return (
    <>
      <m.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${headerClass}`}
        initial="initial"
        animate="animate"
        variants={fadeInDown}
      >
        {/* Inner Texture for Glass Effect */}
        {isScrolled && <div className="absolute inset-0 opacity-[0.4] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>}

        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <m.div
              className="flex-shrink-0"
              variants={slideInFromLeft}
            >
              <Link href="/" className="flex items-center gap-2 group">
                <div className={`relative h-10 w-auto transition-transform duration-300 group-hover:scale-105 ${logoFilterClass}`}>
                  <Image
                    src="/logo.png"
                    alt="EduExpress International"
                    width={180}
                    height={50}
                    quality={60}
                    className="h-10 w-auto object-contain drop-shadow-sm"
                    priority
                    sizes="(max-width: 768px) 140px, 180px"
                  />
                </div>
              </Link>
            </m.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-10">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative group h-full flex items-center py-2"
                  onMouseEnter={item.name === 'Destinations' ? handleDropdownEnter : undefined}
                  onMouseLeave={item.name === 'Destinations' ? handleDropdownLeave : undefined}
                >
                  <Link
                    href={item.href}
                    className={`text-sm transition-all duration-300 block relative ${item.current
                      ? (isTransparent ? 'text-blue-700 font-black' : 'text-blue-600 font-extrabold')
                      : navLinkClass
                      }`}
                  >
                    {item.name}
                    {/* Hover Underline - Smooth Expansion */}
                    <span className={`absolute -bottom-1 left-0 w-full h-[2px] rounded-full transform origin-left transition-transform duration-300 ${item.current ? 'scale-x-100 bg-blue-600' : 'scale-x-0 group-hover:scale-x-100 bg-blue-400/80'
                      }`} />
                  </Link>

                  {/* --- CRYSTAL MEGA DROPDOWN --- */}
                  {item.name === 'Destinations' && (
                    <AnimatePresence>
                      {activeDropdown === 'destinations' && (
                        <m.div
                          className="absolute top-full left-1/2 transform -translate-x-1/2 pt-8 w-[800px]"
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.96 }}
                          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} // Cubic bezier for premium feel
                        >
                          {/* Dropdown Container: Frosted Glass Prism */}
                          <div className="relative bg-white/70 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden ring-1 ring-white/60">
                            {/* Decorative Gradients */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

                            <div className="flex">
                              {/* Left Panel: Featured/Summary */}
                              <div className="w-1/3 bg-white/40 p-6 border-r border-white/40 flex flex-col justify-between">
                                <div>
                                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-1">Explore</h3>
                                  <h4 className="text-xl font-heading font-black text-blue-700 mb-4">Global Opportunities</h4>
                                  <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                                    Browse our curated list of top-tier study destinations. Fully funded scholarships available.
                                  </p>
                                </div>

                                <div className="mt-auto">
                                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100/50">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs ring-4 ring-white">
                                      {countries.length}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-xs font-bold text-slate-800">Total Destinations</div>
                                      <div className="text-[10px] text-slate-500">Verified & Partnered</div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Panel: Grid */}
                              <div className="w-2/3 p-6">
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                  {countries.slice(0, 6).map((country) => (
                                    <Link
                                      key={country.slug}
                                      href={country.slug === 'china' ? '/destinations/china' : `/destinations/${country.slug}`}
                                      className="group/item flex items-center gap-3 p-3 rounded-2xl hover:bg-white/60 transition-all duration-300 border border-transparent hover:border-white/60 shadow-sm hover:shadow-md"
                                    >
                                      <div className="w-10 h-10 flex items-center justify-center text-2xl bg-white rounded-xl shadow-sm border border-slate-100 group-hover/item:scale-110 transition-transform duration-300">
                                        {country.flag}
                                      </div>
                                      <div>
                                        <span className="text-sm font-bold text-slate-800 group-hover/item:text-blue-700 transition-colors block">
                                          {country.name}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide group-hover/item:text-slate-600">
                                          View Details
                                        </span>
                                      </div>
                                      <ArrowRight className="w-4 h-4 text-slate-300 ml-auto opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                                    </Link>
                                  ))}
                                </div>

                                <Link
                                  href="/destinations"
                                  className="block w-full py-3 bg-slate-900 text-white hover:bg-blue-700 rounded-xl text-center text-sm font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn"
                                >
                                  View All Destinations <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-5">
              <div className={`h-8 w-px ${isTransparent ? 'bg-slate-300/30' : 'bg-slate-300'}`}></div>
              <m.button
                onClick={() => {
                  trackConsultationRequest('header');
                  window.dispatchEvent(new CustomEvent('openQuickForm'));
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-lg group ${isTransparent
                  ? 'bg-white/60 backdrop-blur-md text-slate-900 border border-white/50 hover:bg-white hover:scale-105 hover:shadow-xl'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-600/30 hover:scale-105'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Free Consultation</span>
                <ArrowRight className={`w-4 h-4 ${isTransparent ? 'text-blue-600' : 'text-white'} group-hover:translate-x-1 transition-transform`} />
              </m.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-xl transition-colors ${isMenuOpen ? 'bg-slate-100 text-slate-900' : (isTransparent ? 'bg-white/50 text-slate-900 backdrop-blur-md' : 'text-slate-900')}`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </nav>

      </m.header>

      {/* Mobile Menu Overlay - Crystal Style */}
      <AnimatePresence>
        {isMenuOpen && (
          <m.div
            className="fixed inset-0 z-[60] lg:hidden bg-white/95 backdrop-blur-3xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-md">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={140}
                  height={40}
                  className="h-9 w-auto"
                  quality={80}
                  sizes="140px"
                />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="px-6 py-8 space-y-2 overflow-y-auto flex-grow">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-5 py-4 text-xl font-bold rounded-2xl transition-all ${item.current
                      ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      {item.name}
                      {item.current && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                    </div>
                  </Link>
                ))}

                <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.dispatchEvent(new CustomEvent('openQuickForm'));
                    }}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 active:scale-95 transition-transform flex items-center justify-center gap-3"
                  >
                    Book Consultation <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <a href="tel:+8801983333566" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-white hover:shadow-md transition-all">
                      <Phone size={24} className="text-blue-600" />
                      <span className="text-xs font-bold uppercase tracking-wide">Call</span>
                    </a>
                    <a href="mailto:info@eduexpressint.com" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-white hover:shadow-md transition-all">
                      <Mail size={24} className="text-blue-600" />
                      <span className="text-xs font-bold uppercase tracking-wide">Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;