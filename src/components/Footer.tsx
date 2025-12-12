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
    { name: 'Universities', href: '/partnership/universities' },
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
    <footer className="relative bg-gray-50 text-gray-600 font-sans overflow-hidden border-t border-gray-200">

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
                  height={63}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Your trusted partner for global education. We specialize in unlocking opportunities with <span className="text-gray-900 font-bold bg-blue-50 px-1 rounded border border-blue-100">FREE scholarship assistance</span> to help you achieve your dreams abroad.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 shadow-sm"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-wide uppercase inline-block relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-blue-600 pb-2">
                Quick Links
              </h3>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center text-gray-600 text-sm hover:text-blue-700 transition-all duration-300"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-wide uppercase inline-block relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-blue-600 pb-2">
                Top Destinations
              </h3>
              <ul className="space-y-4">
                {destinations.slice(0, 5).map((country) => (
                  <li key={country.slug}>
                    <Link
                      href={`/destinations/${country.slug}`}
                      className="group flex items-center text-gray-600 text-sm hover:text-blue-700 transition-all duration-300"
                    >
                      <Globe className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
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
              <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-wide uppercase inline-block relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-blue-600 pb-2">
                Contact Us
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white border border-gray-200 shrink-0 shadow-sm text-blue-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-gray-600 text-sm leading-relaxed pt-1">
                    House: 12/1, Ground Floor<br />
                    Road: 4/A, Dhanmondi<br />
                    Dhaka - 1209, Bangladesh
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white border border-gray-200 shrink-0 shadow-sm text-blue-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-1 pt-1">
                    <a href="tel:+8801983333566" className="text-gray-800 hover:text-blue-700 transition-colors text-sm font-bold">
                      +880 1983-333566
                    </a>
                    <a href="tel:+88013296663505" className="text-gray-600 hover:text-blue-700 transition-colors text-sm font-medium">
                      +880 1329-6663505
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white border border-gray-200 shrink-0 shadow-sm text-blue-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <a href="mailto:info@eduexpressint.com" className="text-gray-600 hover:text-blue-700 transition-colors text-sm pt-2.5 break-all font-medium">
                    info@eduexpressint.com
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>


        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 relative z-10">
          <div className="flex items-center gap-2 order-2 md:order-1 font-bold">
            © 2025 EduExpress International. All Rights Reserved.
          </div>

          <div className="flex items-center gap-8 order-1 md:order-2">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors font-medium text-gray-600 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors font-medium text-gray-600 hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
