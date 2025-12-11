'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ArrowRight, Globe, Youtube, ExternalLink } from 'lucide-react';
import Image from 'next/image';

import { countries } from '@/lib/countries';

const Footer = () => {


  const destinations = countries
    .filter(country => country.featured)
    .map(country => ({
      name: country.name,
      slug: country.slug
    }));

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Our Services', href: '/services' },
    { name: 'Latest Updates', href: '/updates' },
    { name: 'Partnership', href: '/partnership' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/EduExpressIntBD', icon: Facebook },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/eduexpress/', icon: Linkedin },
    { name: 'Instagram', href: 'https://www.instagram.com/eduexpressint', icon: Instagram },
    { name: 'YouTube', href: 'https://www.youtube.com/@EduExpressInt', icon: Youtube },
  ];

  return (
    <footer className="relative bg-slate-50 -z-10 text-slate-700 font-sans overflow-hidden border-t-4 border-blue-600">

      {/* Background Pattern - Subtle, not interfering */}
      <div className="absolute inset-0 opacity-[0.4] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block relative group">
              <div className="relative w-56 h-auto">
                <Image
                  src="/logo.png"
                  alt="EduExpress International"
                  width={224}
                  height={80}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-slate-700 text-lg leading-relaxed max-w-sm font-semibold">
              Your trusted partner for global education. We specialize in unlocking opportunities with <span className="text-slate-900 font-bold bg-amber-100 px-1 rounded border border-amber-200">FREE scholarship assistance</span> to help you achieve your dreams abroad.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border-2 border-slate-200 text-slate-500 hover:text-white hover:bg-blue-700 hover:border-blue-700 transition-all duration-200 shadow-sm"
                  aria-label={social.name}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight uppercase border-b-2 border-slate-200 pb-2 inline-block">
                Quick Links
              </h3>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center text-slate-700 hover:text-blue-800 transition-all duration-200 font-medium"
                    >
                      <ArrowRight className="w-4 h-4 mr-3 text-blue-600 transition-transform group-hover:translate-x-1" />
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight uppercase border-b-2 border-slate-200 pb-2 inline-block">
                Top Destinations
              </h3>
              <ul className="space-y-4">
                {destinations.slice(0, 5).map((country) => (
                  <li key={country.slug}>
                    <Link
                      href={`/destinations/${country.slug}`}
                      className="group flex items-center text-slate-700 hover:text-blue-800 transition-all duration-200 font-medium"
                    >
                      <Globe className="w-5 h-5 mr-3 text-blue-500" />
                      <span>{country.name}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/destinations"
                    className="inline-flex items-center text-blue-700 hover:text-blue-900 font-black mt-4 transition-colors group text-sm uppercase tracking-wider pl-1"
                  >
                    View All <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight uppercase border-b-2 border-slate-200 pb-2 inline-block">
                Contact Us
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white border-2 border-slate-200 shrink-0">
                    <MapPin className="w-6 h-6 text-blue-700" />
                  </div>
                  <span className="text-slate-700 text-base leading-relaxed font-semibold pt-1">
                    House: 12/1, Ground Floor<br />
                    Road: 4/A, Dhanmondi<br />
                    Dhaka - 1209, Bangladesh
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white border-2 border-slate-200 shrink-0">
                    <Phone className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="flex flex-col gap-1 pt-1">
                    <a href="tel:+8801983333566" className="text-slate-800 hover:text-blue-800 transition-colors text-base font-bold">
                      +880 1983-333566
                    </a>
                    <a href="tel:+88013296663505" className="text-slate-700 hover:text-blue-700 transition-colors text-base font-medium">
                      +880 1329-6663505
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white border-2 border-slate-200 shrink-0">
                    <Mail className="w-6 h-6 text-blue-700" />
                  </div>
                  <a href="mailto:info@eduexpressint.com" className="text-slate-700 hover:text-blue-800 transition-colors text-base font-semibold pt-2">
                    info@eduexpressint.com
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>


        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t-2 border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-600 relative z-10">
          <div className="flex items-center gap-2 order-2 md:order-1 font-bold">
            {/* Copyright Removed */}
          </div>

          <div className="flex items-center gap-8 order-1 md:order-2">
            <Link href="/privacy" className="hover:text-blue-700 transition-colors font-bold text-slate-700 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-700 transition-colors font-bold text-slate-700 hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
