'use client';

import React, { useRef } from 'react';
import { Country } from '@/lib/countries';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Building2, Globe, Wallet, Award, BookOpen, MapPin, CheckCircle2,
  School, Landmark, Languages, FileCheck, Plane, Clock, Sparkles,
  Scroll, Crown, Star, Calendar, MessageSquare, Briefcase, ArrowRight,
  Shield, FileText, GraduationCap, AlertTriangle, Scale, ThumbsUp, ThumbsDown, Info, ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ConsultationButton from '@/components/ConsultationButton';

// Icon Map for dynamic rendering
const iconMap: Record<string, React.ComponentType<any>> = {
  Building2, Globe, Wallet, Award, BookOpen, MapPin, CheckCircle2,
  School, Landmark, Languages, FileCheck, Plane, Clock, Sparkles,
  Scroll, Crown, Star, Calendar, MessageSquare, Briefcase, Shield,
  FileText, GraduationCap
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

  // Unified EduExpress Evidence-First Design System Palette
  const getThemeColors = (_slug: string) => {
    return {
      primary: 'text-[#174f7a] bg-[#e9f7fd] border-[#174f7a]/20',
      gradient: 'from-[#08263c] via-[#061b2a] to-[#08263c]',
      accent: 'from-[#64b5df] via-[#8ed0ee] to-white',
      button: 'bg-[#08263c] hover:bg-[#174f7a] text-white font-black shadow-[4px_4px_0_0_#64b5df]',
      buttonBorder: 'border-2 border-[#08263c] hover:bg-[#174f7a] hover:text-white',
      badge: 'bg-[#174f7a] text-[#8ed0ee] border-[#64b5df]/20 font-mono text-[10px] font-black uppercase tracking-[0.2em]',
      iconColor: 'text-[#174f7a]',
      lineColor: 'bg-[#64b5df]'
    };
  };

  const colors = getThemeColors(country.slug);

  const renderIcon = (name: string, className = "w-6 h-6") => {
    const IconComponent = iconMap[name] || BookOpen;
    return <IconComponent className={className} />;
  };

  return (
    <div ref={containerRef} className="bg-slate-50 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. Breadcrumbs + Service-Status Badge */}
      <div className="absolute top-0 left-0 w-full z-40 bg-transparent pt-6 pointer-events-none">
        <div className="container mx-auto px-6 pointer-events-auto flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm font-medium text-white/80">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-white/40">/</span>
            <Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link>
            <span className="text-white/40">/</span>
            <span className="text-white">Study in {country.name}</span>
          </nav>
          {country.serviceStatus && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-sm ${
              country.serviceStatus === 'Flagship' || country.serviceStatus === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              Service Status: {country.serviceStatus}
            </div>
          )}
        </div>
      </div>

      {/* 2. Hero Section (H1 + 50-word direct value statement) */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          {country.images[0] ? (
            <Image src={country.images[0]} alt={`Study in ${country.name}`} fill priority className="object-cover" sizes="100vw" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${colors.gradient}`} />
          )}
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-85 mix-blend-multiply z-10`} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-20 container mx-auto px-6 text-center max-w-4xl mt-12">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full mb-8 shadow-lg">
            <span className="text-2xl">{country.flag}</span>
            <span className="text-sm font-bold tracking-wider text-white uppercase">{country.name} Admissions</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-none drop-shadow-2xl">
            Study in <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colors.accent}`}>{country.name}</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-200 mb-10 mx-auto font-light leading-relaxed drop-shadow-lg">
            {country.valueStatement || country.description}
          </p>
        </motion.div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-24">

            {/* 3. Who this country fits — and who should reconsider */}
            <section id="fit">
              <div className="flex items-center gap-3 mb-10">
                <div className={`p-3 rounded-xl ${colors.primary}`}><Scale className="w-6 h-6" /></div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Is {country.name} Right For You?</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                  <div className="flex items-center gap-2 mb-6">
                    <ThumbsUp className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-bold text-emerald-900">Who it fits</h3>
                  </div>
                  <ul className="space-y-4">
                    {country.whoItFits?.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-emerald-800/80 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                  <div className="flex items-center gap-2 mb-6">
                    <ThumbsDown className="w-6 h-6 text-rose-600" />
                    <h3 className="text-xl font-bold text-rose-900">Who should reconsider</h3>
                  </div>
                  <ul className="space-y-4">
                    {country.whoShouldReconsider?.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-rose-800/80 text-sm font-medium">
                        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. Education system and recognition */}
            <section id="recognition">
              <div className="flex items-center gap-3 mb-10">
                <div className={`p-3 rounded-xl ${colors.primary}`}><Shield className="w-6 h-6" /></div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Education & Recognition</h2>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-slate-600 leading-relaxed font-medium">
                <p>{country.educationSystemAndRecognition}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-bold"><Award className="w-4 h-4 text-amber-500"/> BMDC Recognized (Medical)</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-bold"><Globe className="w-4 h-4 text-blue-500"/> WHO Listed</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-bold"><FileCheck className="w-4 h-4 text-emerald-500"/> MOE Approved</span>
                </div>
              </div>
            </section>

            {/* 5. Program/university choices with evidence */}
            <section id="universities">
              <div className="flex items-center gap-3 mb-10">
                <div className={`p-3 rounded-xl ${colors.primary}`}><School className="w-6 h-6" /></div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Universities & Programs</h2>
              </div>
              <div className="space-y-8">
                {/* Popular Fields */}
                {country.popularProgramsList && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {country.popularProgramsList.map((cat, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center mb-4 pb-4 border-b border-slate-100">
                          <div className={`p-2.5 rounded-lg mr-3 bg-blue-50 text-blue-600`}>{renderIcon(cat.icon, "w-5 h-5")}</div>
                          <h4 className="font-extrabold text-slate-900">{cat.name}</h4>
                        </div>
                        <ul className="space-y-2">
                          {cat.programs.map((p, i) => (
                            <li key={i} className="flex items-center text-sm font-semibold text-slate-600">
                              <span className="w-1.5 h-1.5 bg-blue-200 rounded-full mr-2" />{p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Verified Universities */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Verified Partners & Routes</h3>
                  <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                    {country.universities.map((uni, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 sm:border-0 sm:border-b last:border-0">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold text-slate-500">{uni.charAt(0)}</div>
                        <span className="font-bold text-slate-800 text-sm">{uni}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Admission requirements for Bangladesh */}
            <section id="requirements">
              <div className="flex items-center gap-3 mb-10">
                <div className={`p-3 rounded-xl ${colors.primary}`}><FileText className="w-6 h-6" /></div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Admission Requirements</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[100px]" />
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10"><Languages className="w-5 h-5 text-blue-600" /> Language</h3>
                  <ul className="space-y-4 relative z-10">
                    {country.requirements.language.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />{req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-[100px]" />
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10"><FileCheck className="w-5 h-5 text-emerald-600" /> Documents</h3>
                  <ul className="space-y-4 relative z-10">
                    {country.requirements.documents.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />{req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 7. Total cost and funding reality */}
            <section id="cost">
              <div className="flex items-center gap-3 mb-10">
                <div className={`p-3 rounded-xl ${colors.primary}`}><Wallet className="w-6 h-6" /></div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Costs & Funding Reality</h2>
              </div>
              <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                
                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                  <div>
                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Est. Tuition Fee</h3>
                    <p className="text-3xl font-black text-white mb-2">{country.costs.tuition.split('(')[0]}</p>
                    <p className="text-sm text-slate-400 font-medium">*{country.costs.tuition.match(/\((.*?)\)/)?.[1] || 'Varies by program'}</p>
                  </div>
                  <div>
                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Est. Living Cost</h3>
                    <p className="text-3xl font-black text-white mb-2">{country.costs.living}</p>
                    <p className="text-sm text-slate-400 font-medium">Includes housing, food, and transport</p>
                  </div>
                </div>

                {country.scholarshipsList && country.scholarshipsList.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-slate-800 relative z-10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Crown className="w-5 h-5 text-amber-400" /> Funding Opportunities</h3>
                    <div className="space-y-4">
                      {country.scholarshipsList.map((s, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <div>
                            <div className="font-bold text-white text-sm">{s.name}</div>
                            <div className="text-xs text-slate-400 mt-1">{s.amount}</div>
                          </div>
                          <div className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg shrink-0 w-fit">Due: {s.deadline}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 8. Visa/residence process with official sources */}
            <section id="visa">
              <div className="flex items-center gap-3 mb-10">
                <div className={`p-3 rounded-xl ${colors.primary}`}><Plane className="w-6 h-6" /></div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Visa & Residence Process</h2>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <p className="text-slate-600 font-medium mb-6">The visa process for Bangladeshi students requires careful documentation and proof of funds. EduExpress handles the verification before submission.</p>
                <div className="space-y-4">
                  {country.requirements.visa.map((req, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">{i+1}</div>
                      <div className="pt-1.5 text-sm font-semibold text-slate-700">{req}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 9. Work rights and career pathways with caveats */}
            <section id="career">
              <div className="flex items-center gap-3 mb-10">
                <div className={`p-3 rounded-xl ${colors.primary}`}><Briefcase className="w-6 h-6" /></div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Work Rights & Career</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500"/> Student Rights</h3>
                  <p className="text-sm text-slate-600 font-medium">{country.workRightsAndCareer?.rights}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-500"/> Opportunities</h3>
                  <p className="text-sm text-slate-600 font-medium">{country.workRightsAndCareer?.opportunities}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm bg-amber-50/50">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500"/> Reality Check</h3>
                  <p className="text-sm text-slate-600 font-medium">{country.workRightsAndCareer?.caveats}</p>
                </div>
              </div>
            </section>

            {/* 11. Comparison with two alternatives */}
            <section id="compare">
              <div className="flex items-center gap-3 mb-10">
                <div className={`p-3 rounded-xl ${colors.primary}`}><Scale className="w-6 h-6" /></div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">How It Compares</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 pr-0 sm:pr-6">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alternative 1</div>
                    <div className="text-xl font-black text-slate-900">{country.comparisons?.countryA}</div>
                  </div>
                  <div className="w-full sm:w-2/3 text-sm text-slate-600 font-medium flex items-center">
                    {country.comparisons?.countryA_description}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 pr-0 sm:pr-6">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alternative 2</div>
                    <div className="text-xl font-black text-slate-900">{country.comparisons?.countryB}</div>
                  </div>
                  <div className="w-full sm:w-2/3 text-sm text-slate-600 font-medium flex items-center">
                    {country.comparisons?.countryB_description}
                  </div>
                </div>
              </div>
            </section>

            {/* 12. FAQ with visible answers */}
            {country.faqs && country.faqs.length > 0 && (
              <section id="faq">
                <div className="flex items-center gap-3 mb-10">
                  <div className={`p-3 rounded-xl ${colors.primary}`}><MessageSquare className="w-6 h-6" /></div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                  {country.faqs.map((faq, i) => (
                    <details key={i} className="group bg-white rounded-2xl border border-slate-200 shadow-sm [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900 text-lg">
                        {faq.question}
                        <span className="ml-4 flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-slate-50 group-open:bg-blue-50 group-open:text-blue-600 transition-colors">
                          <svg className="w-4 h-4 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 font-medium text-sm leading-relaxed border-t border-slate-50 pt-4">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* 13. Country reviewer, sources, last verified date */}
            <section id="verification" className="pt-8 border-t border-slate-200">
              <div className="bg-slate-100 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-16 h-16 rounded-full bg-blue-200 border-4 border-white shadow-sm shrink-0 flex items-center justify-center text-blue-700 font-bold text-xl">
                  {country.reviewerInfo?.name?.charAt(0) || 'E'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{country.reviewerInfo?.name}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-4">{country.reviewerInfo?.role}</p>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-600 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400"/> Last Verified: {country.reviewerInfo?.lastVerifiedDate}</span>
                    <span className="flex items-center gap-1.5"><Info className="w-4 h-4 text-slate-400"/> Status: {country.serviceStatus}</span>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    <span className="font-bold uppercase tracking-wider mr-2">Primary Sources:</span>
                    {country.reviewerInfo?.primarySources?.map((s, i) => (
                      <span key={i} className="inline-flex items-center mr-3 mb-1"><ExternalLink className="w-3 h-3 mr-1"/> {s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 space-y-6">

              {/* 10. Intakes/deadlines with automatic status */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1.5 ${colors.lineColor}`} />
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar className={`w-5 h-5 ${colors.iconColor}`} />
                  Upcoming Intakes
                </h3>
                
                <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Primary Intakes</div>
                  <div className="font-black text-slate-900">{country.intakesText || 'Varies'}</div>
                </div>

                <div className="flex items-center justify-between text-sm font-bold text-slate-700 bg-red-50 p-4 rounded-xl border border-red-100">
                  <span>Next Deadline</span>
                  <span className="text-red-600">{country.nextDeadline || 'Contact Us'}</span>
                </div>
              </div>

              {/* Consultation / Assessment Card */}
              <div className="bg-[#0b172a] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <h3 className="text-2xl font-bold mb-4 relative z-10">Education Fit Assessment</h3>
                <p className="text-slate-300 mb-8 relative z-10 text-sm leading-relaxed">
                  Submit your details and get an objective evaluation of your admission and scholarship prospects in {country.name}.
                </p>

                <ConsultationButton
                  text="Book Free Assessment"
                  source={`${country.slug}_sidebar`}
                  className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg relative z-10 hover:scale-[1.02] active:scale-[0.98] ${colors.button}`}
                />
              </div>
              
              {/* Need Quick Help Card */}
              <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                <h3 className="font-bold text-emerald-900 mb-1 leading-tight">Need Instant Help?</h3>
                <p className="text-xs text-emerald-700 mb-4 font-medium">Chat with our counselors on WhatsApp.</p>
                <a
                  href={`https://wa.me/8801983333566?text=Hi!%20I'm%20interested%20in%20studying%20in%20${country.name}.%20Can%20you%20help%20me?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors active:scale-95 text-xs"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  WhatsApp Us
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 14. CTA Section */}
      <section className="relative py-32 overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-slate-900 z-0">
          <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-90 z-10`} />
          {country.images[0] && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay grayscale"
              style={{ backgroundImage: `url('${country.images[0]}')` }}
            />
          )}
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Compare Before You Commit
          </h2>

          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            We compare education quality, cost, recognition and career fit before recommending an option. Get your written Proof Pack for {country.name}.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <ConsultationButton
              text="Get My Free Education Fit Assessment"
              source={`${country.slug}_footer_cta_primary`}
              className="px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-2xl min-w-[200px]"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
