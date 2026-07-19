'use client';

import React, { useRef } from 'react';
import { Country } from '@/lib/countries';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Building2,
  Globe,
  Wallet,
  Award,
  BookOpen,
  MapPin,
  CheckCircle2,
  School,
  Landmark,
  Languages,
  FileCheck,
  Plane,
  Clock,
  Sparkles,
  Scroll,
  Crown,
  Star,
  Calendar,
  MessageSquare,
  Briefcase,
  ArrowRight,
  ChevronRight,
  Shield,
  FileText,
  GraduationCap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ConsultationButton from '@/components/ConsultationButton';

// Icon Map for dynamic rendering
const iconMap: Record<string, React.ComponentType<any>> = {
  Building2,
  Globe,
  Wallet,
  Award,
  BookOpen,
  MapPin,
  CheckCircle2,
  School,
  Landmark,
  Languages,
  FileCheck,
  Plane,
  Clock,
  Sparkles,
  Scroll,
  Crown,
  Star,
  Calendar,
  MessageSquare,
  Briefcase,
  Shield,
  FileText,
  GraduationCap
};

interface DestinationDetailClientProps {
  country: Country;
}

export default function DestinationDetailClient({ country }: DestinationDetailClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Dynamic Theme Colors based on country slug to give each page a tailored premium aesthetic
  const getThemeColors = (slug: string) => {
    switch (slug) {
      case 'china':
        return {
          primary: 'text-red-600 bg-red-50 border-red-200',
          gradient: 'from-red-950 via-slate-900 to-slate-900',
          accent: 'from-red-400 to-amber-400',
          button: 'bg-red-600 hover:bg-red-500 shadow-red-900/40',
          buttonBorder: 'border-red-400/50 hover:bg-red-950/30 hover:border-red-400',
          badge: 'bg-red-100 text-red-800 border-red-200',
          iconColor: 'text-red-600',
          lineColor: 'bg-red-600'
        };
      case 'uk':
        return {
          primary: 'text-blue-600 bg-blue-50 border-blue-200',
          gradient: 'from-blue-950 via-indigo-950 to-slate-900',
          accent: 'from-red-500 via-white to-blue-400',
          button: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40',
          buttonBorder: 'border-blue-400/50 hover:bg-blue-950/30 hover:border-blue-400',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          iconColor: 'text-blue-600',
          lineColor: 'bg-blue-600'
        };
      case 'south-korea':
        return {
          primary: 'text-indigo-600 bg-indigo-50 border-indigo-200',
          gradient: 'from-slate-950 via-indigo-950 to-slate-900',
          accent: 'from-blue-400 to-pink-400',
          button: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/40',
          buttonBorder: 'border-indigo-400/50 hover:bg-indigo-950/30 hover:border-indigo-400',
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          iconColor: 'text-indigo-600',
          lineColor: 'bg-indigo-600'
        };
      case 'hungary':
        return {
          primary: 'text-emerald-600 bg-emerald-50 border-emerald-200',
          gradient: 'from-emerald-950 via-slate-900 to-slate-900',
          accent: 'from-emerald-400 via-white to-red-400',
          button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40',
          buttonBorder: 'border-emerald-400/50 hover:bg-emerald-950/30 hover:border-emerald-400',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          iconColor: 'text-emerald-600',
          lineColor: 'bg-emerald-600'
        };
      case 'finland':
        return {
          primary: 'text-sky-600 bg-sky-50 border-sky-200',
          gradient: 'from-sky-950 via-slate-900 to-slate-900',
          accent: 'from-sky-400 to-emerald-400',
          button: 'bg-sky-600 hover:bg-sky-500 shadow-sky-900/40',
          buttonBorder: 'border-sky-400/50 hover:bg-sky-950/30 hover:border-sky-400',
          badge: 'bg-sky-100 text-sky-800 border-sky-200',
          iconColor: 'text-sky-600',
          lineColor: 'bg-sky-600'
        };
      case 'cyprus':
        return {
          primary: 'text-orange-600 bg-orange-50 border-orange-200',
          gradient: 'from-orange-950 via-slate-900 to-slate-900',
          accent: 'from-orange-400 to-yellow-400',
          button: 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/40',
          buttonBorder: 'border-orange-400/50 hover:bg-orange-950/30 hover:border-orange-400',
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          iconColor: 'text-orange-600',
          lineColor: 'bg-orange-600'
        };
      case 'croatia':
        return {
          primary: 'text-teal-600 bg-teal-50 border-teal-200',
          gradient: 'from-teal-950 via-slate-900 to-slate-900',
          accent: 'from-red-400 via-white to-blue-400',
          button: 'bg-teal-600 hover:bg-teal-500 shadow-teal-900/40',
          buttonBorder: 'border-teal-400/50 hover:bg-teal-950/30 hover:border-teal-400',
          badge: 'bg-teal-100 text-teal-800 border-teal-200',
          iconColor: 'text-teal-600',
          lineColor: 'bg-teal-600'
        };
      case 'georgia':
        return {
          primary: 'text-rose-600 bg-rose-50 border-rose-200',
          gradient: 'from-rose-950 via-slate-900 to-slate-900',
          accent: 'from-rose-400 to-amber-400',
          button: 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/40',
          buttonBorder: 'border-rose-400/50 hover:bg-rose-950/30 hover:border-rose-400',
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          iconColor: 'text-rose-600',
          lineColor: 'bg-rose-600'
        };
      case 'malaysia':
      default:
        return {
          primary: 'text-blue-600 bg-blue-50 border-blue-200',
          gradient: 'from-slate-950 via-blue-950 to-slate-900',
          accent: 'from-blue-400 to-amber-400',
          button: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40',
          buttonBorder: 'border-blue-400/50 hover:bg-blue-950/30 hover:border-blue-400',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          iconColor: 'text-blue-600',
          lineColor: 'bg-blue-600'
        };
    }
  };

  const colors = getThemeColors(country.slug);

  const renderIcon = (name: string, className = "w-6 h-6") => {
    const IconComponent = iconMap[name] || BookOpen;
    return <IconComponent className={className} />;
  };

  return (
    <div ref={containerRef} className="bg-slate-50 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Hero Section */}
      <section className="relative h-[95vh] min-h-[650px] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 z-0">
          {country.images[0] ? (
            <Image
              src={country.images[0]}
              alt={`Study in ${country.name}`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${colors.gradient}`} />
          )}
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-80 mix-blend-multiply z-10`} />
        </div>

        {/* Floating Decorative Elements */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-20 right-20 w-96 h-96 rounded-full blur-[120px] opacity-25 z-0 bg-blue-500`}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className={`absolute bottom-10 left-10 w-80 h-80 rounded-full blur-[100px] opacity-20 z-0 bg-amber-500`}
        />

        {/* Content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-20 container mx-auto px-6 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full mb-8 shadow-lg shadow-black/10">
            <span className="text-2xl">{country.flag}</span>
            <span className="text-sm font-bold tracking-wider text-white uppercase">PREMIER STUDY DESTINATION</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-none drop-shadow-2xl">
            Study in <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colors.accent}`}>{country.name}</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-lg">
            {country.description}. Compare education fit, institution status, total costs and visa readiness before you proceed.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <ConsultationButton
              text="Apply for Scholarships"
              source={`${country.slug}_hero_primary`}
              className={`group px-8 py-4 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 ${colors.button}`}
            />
            <ConsultationButton
              text="Free Assessment"
              source={`${country.slug}_hero_secondary`}
              className={`px-8 py-4 bg-transparent border text-white rounded-xl font-semibold text-lg hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 ${colors.buttonBorder}`}
            />
          </div>
        </motion.div>
      </section>

      {/* Intakes Banner */}
      <div className={`${colors.lineColor} text-white py-4 overflow-hidden shadow-inner relative z-30`}>
        <div className="container mx-auto px-6 flex items-center justify-center space-x-8 animate-marquee whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <span className="font-bold tracking-wide uppercase">INTAKES: {country.intakesText || 'February & September'}</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <span className="font-bold tracking-wide uppercase">FREE SCHOLARSHIP ASSESSMENT OPEN</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <span className="font-bold tracking-wide uppercase">DESTINATION SPECIFIC VISA READINESS REVIEW</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="relative z-30 -mt-16 container mx-auto px-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-x divide-slate-100">
          <div className="flex flex-col items-center text-center p-2">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 mb-3">
              <Building2 className="w-8 h-8" />
            </div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Tuition Fees</span>
            <span className="text-slate-900 font-bold block text-sm md:text-base">{country.costs.tuition.split('(')[0]}</span>
          </div>
          <div className="flex flex-col items-center text-center p-2">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 mb-3">
              <Wallet className="w-8 h-8" />
            </div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Living Cost</span>
            <span className="text-slate-900 font-bold block text-sm md:text-base">{country.costs.living}</span>
          </div>
          <div className="flex flex-col items-center text-center p-2">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 mb-3">
              <Clock className="w-8 h-8" />
            </div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Processing Time</span>
            <span className="text-slate-900 font-bold block text-sm md:text-base">3 - 4 Months</span>
          </div>
          <div className="flex flex-col items-center text-center p-2">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 mb-3">
              <Globe className="w-8 h-8" />
            </div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Visa Review</span>
            <span className="text-slate-900 font-bold block text-sm md:text-base">Readiness Checked</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-20">

            {/* Why Study in [Country] */}
            <section>
              <div className="flex items-center gap-3 mb-10">
                <div className={`p-3 rounded-xl ${colors.primary}`}>
                  <Star className="w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Why Study in {country.name}?</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                {country.benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 text-blue-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 mb-3">{benefit}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Explore world-class academic courses and build a successful global career in a highly welcoming international student environment.
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Degree Levels & Programs */}
            {country.degreesList && (
              <section>
                <div className="flex items-center gap-3 mb-10">
                  <div className={`p-3 rounded-xl ${colors.primary}`}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Available Degrees & Levels</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {country.degreesList.map((degree, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -3 }}
                      className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${colors.lineColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${degree.color}`}>
                          {renderIcon(degree.icon, "w-6 h-6")}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{degree.title}</h3>
                          <div className="flex items-center text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {degree.duration}
                          </div>
                          <p className="text-slate-500 text-xs leading-normal">{degree.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Partner Universities */}
            <section>
              <div className="flex items-center gap-3 mb-10">
                <div className={`p-3 rounded-xl ${colors.primary}`}>
                  <School className="w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Top Partner Universities</h2>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                  {country.universities.map((uni, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 sm:border-0">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 text-xl font-bold text-slate-400">
                        {uni.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800 text-sm md:text-base">{uni}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Popular Fields of Study */}
            {country.popularProgramsList && (
              <section>
                <div className="flex items-center gap-3 mb-10">
                  <div className={`p-3 rounded-xl ${colors.primary}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Popular Fields of Study</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {country.popularProgramsList.map((cat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center mb-4 pb-4 border-b border-slate-100">
                        <div className={`p-2.5 rounded-lg mr-3 bg-blue-50 text-blue-600`}>
                          {renderIcon(cat.icon, "w-5 h-5")}
                        </div>
                        <h4 className="font-extrabold text-slate-900">{cat.name}</h4>
                      </div>
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {cat.programs.map((p, i) => (
                          <li key={i} className="flex items-center text-xs font-semibold text-slate-600">
                            <span className="w-1.5 h-1.5 bg-blue-200 rounded-full mr-2" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Student Cities */}
            {country.citiesList && (
              <section>
                <div className="flex items-center gap-3 mb-10">
                  <div className={`p-3 rounded-xl ${colors.primary}`}>
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Top Student Cities</h2>
                </div>

                <div className="space-y-6">
                  {country.citiesList.map((city, idx) => (
                    <div key={idx} className="group flex flex-col md:flex-row items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                      <div className="w-full md:w-44 h-44 md:h-32 rounded-2xl flex-shrink-0 mb-4 md:mb-0 md:mr-6 overflow-hidden relative">
                        <img
                          src={city.imageQuery}
                          alt={city.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-grow text-center md:text-left px-2">
                        <h4 className="text-xl font-bold text-slate-900 mb-1">{city.name}</h4>
                        <p className="text-xs text-slate-500 font-semibold mb-3">{city.stats}</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          {city.highlights.map((h, i) => (
                            <span key={i} className="text-xs px-3 py-1 bg-slate-50 text-slate-600 rounded-full border border-slate-200 font-medium">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Requirements Section */}
            <section id="requirements">
              <div className="flex items-center gap-3 mb-10">
                <div className={`p-3 rounded-xl ${colors.primary}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Admission & Visa Requirements</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-blue-50/50 rounded-bl-[100px] -z-0" />
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                    <Languages className="w-5 h-5 text-blue-600" />
                    Language Proficiency
                  </h3>
                  <ul className="space-y-3 relative z-10 text-sm">
                    {country.requirements.language.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-50/50 rounded-bl-[100px] -z-0" />
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    Required Documents
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 relative z-10">
                    {country.requirements.documents.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-700 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-semibold text-slate-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-amber-50/50 rounded-bl-[100px] -z-0" />
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                    <Plane className="w-5 h-5 text-amber-600" />
                    Visa Requirements
                  </h3>
                  <ul className="space-y-3 relative z-10 text-sm">
                    {country.requirements.visa.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">

              {/* Consultation / Assessment Card */}
              <div className="bg-[#0b172a] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <h3 className="text-2xl font-bold mb-4 relative z-10">Free Assessment</h3>
                <p className="text-slate-300 mb-8 relative z-10 text-sm leading-relaxed">
                  Submit your details and get an evaluation of your admission and scholarship prospects in {country.name} directly from our expert team.
                </p>

                <ConsultationButton
                  text="Book Consultation Call"
                  source={`${country.slug}_sidebar`}
                  className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg relative z-10 hover:scale-[1.02] active:scale-[0.98] ${colors.button}`}
                />

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Government-Licensed Partner</span>
                </div>
              </div>

              {/* Available Scholarships List Card */}
              {country.scholarshipsList && (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Available Scholarships
                  </h3>
                  <div className="space-y-4">
                    {country.scholarshipsList.map((scholarship, i) => (
                      <div key={i} className="flex gap-3 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="mt-1 w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-600">
                          {renderIcon(scholarship.icon, "w-4 h-4")}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 mb-1 leading-tight">{scholarship.name}</div>
                          <div className="text-xs font-semibold text-slate-500 mb-1">{scholarship.amount}</div>
                          <div className="text-[10px] text-red-500 font-bold bg-red-50 border border-red-100 px-2 py-0.5 rounded w-fit">Deadline: {scholarship.deadline}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Next Deadline:</span>
                    <span className="text-red-600 uppercase">{country.nextDeadline || 'Varies'}</span>
                  </div>
                </div>
              )}

              {/* Custom Fact Card */}
              {country.factText && (
                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600 shrink-0">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="font-extrabold text-blue-900 text-sm mb-1">Did you know?</div>
                      <p className="text-xs text-blue-800 leading-relaxed font-medium">
                        {country.factText}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Need Quick Help Card */}
              <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 relative overflow-hidden">
                <h3 className="font-bold text-emerald-900 mb-1 text-lg leading-tight">Need Instant Help?</h3>
                <p className="text-sm text-emerald-700 mb-6 font-medium">Chat with our counselors on WhatsApp for quick, direct answers.</p>
                <a
                  href={`https://wa.me/8801983333566?text=Hi!%20I'm%20interested%20in%20studying%20in%20${country.name}.%20Can%20you%20help%20me?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors active:scale-95 text-center text-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  WhatsApp Us Now
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-slate-900 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-indigo-950/90 z-10" />
          {country.images[0] && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
              style={{ backgroundImage: `url('${country.images[0]}')` }}
            />
          )}
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center max-w-4xl">
          <div className="mb-8 flex justify-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border bg-white/10 border-white/20 backdrop-blur-md shadow-lg shadow-black/10`}>
              <Plane className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Start Your Study Journey Today
          </h2>

          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Scholarship applications are open for upcoming intakes in {country.name}. Secure your admission with our expert counseling.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <ConsultationButton
              text="Apply Now"
              source={`${country.slug}_footer_cta_primary`}
              className="px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-2xl min-w-[200px]"
            />
            <ConsultationButton
              text="Talk to a Counselor"
              source={`${country.slug}_footer_cta_secondary`}
              className="px-10 py-5 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 hover:border-white hover:scale-105 active:scale-95 transition-all min-w-[200px]"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
