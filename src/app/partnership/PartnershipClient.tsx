'use client';

import { ArrowRight, ArrowUpRight, GraduationCap, Handshake, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import PartnershipForm from '@/components/PartnershipForm';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function PartnershipClient() {
  const partnershipTypes = [
    {
      number: '01',
      title: 'Regional Agency Partner',
      label: 'Territory-based cooperation',
      description: 'Build a documented regional cooperation arrangement with training, support and responsibilities confirmed in the final agreement.',
      features: [
        'Territory and scope confirmed in writing',
        'Onboarding and process training',
        'Approved information and campaign materials',
        'Placement terms defined by destination',
        'Named support contact'
      ],
      icon: Shield
    },
    {
      number: '02',
      title: 'China Strategic Partner',
      label: 'Flagship China cooperation',
      description: 'Support China applicants through a written service-charge structure, collaborating university routes and documented application tracking.',
      features: [
        'Governed China university route records',
        'Itemized service-charge structure',
        'Scholarship options matched by profile',
        'Application and visa-readiness support',
        'Dedicated partner contact'
      ],
      icon: Handshake
    },
    {
      number: '03',
      title: 'Referral Partner',
      label: 'Student referral cooperation',
      description: 'Refer suitable students through a simple written arrangement with clear ownership, updates and payment terms.',
      features: [
        'Simple student handover process',
        'No partner setup charge',
        'Written referral responsibilities',
        'Defined referral payment terms',
        'Application status updates'
      ],
      icon: Users
    }
  ];

  const pricingTable = [
    { type: 'Type-A', coverage: 'Full Tuition · Hostel · Monthly Stipend', price: '$500' },
    { type: 'Type-B', coverage: 'Full Tuition · Hostel Free', price: '$450' },
    { type: 'Type-C', coverage: 'Tuition Waiver Only', price: '$400' },
    { type: 'Type-D', coverage: 'Partial Scholarship (50–80% Off)', price: '$300' },
    { type: 'Add-On', coverage: 'Airport Pickup — Per Student (Optional)', price: '$150' },
  ];

  return (
    <div className="overflow-hidden bg-[#f1f5f9] text-ed-ink font-sans">
      {/* Homepage Hero Header Style */}
      <section className="relative px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 md:pt-40 lg:px-12 border-b border-[#12436b]/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(18,67,107,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(18,67,107,0.07)_1px,transparent_1px)] bg-[size:76px_76px]" />
        <div className="pointer-events-none absolute right-[4%] top-28 size-72 rounded-full border-[44px] border-[#a9d6ee]/15 md:size-[460px]" />

        <div className="relative mx-auto max-w-[1440px]">
          <Breadcrumbs items={[{ name: 'Partnership' }]} className="mb-7" />
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#12436b]/18 py-3 font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-ed-navy">
            <span>EduExpress International Bangladesh</span>
            <span>Global Partner Network</span>
            <span>Institutional Cooperation 2027</span>
          </div>

          <div className="max-w-4xl">
            <p className="flex w-full max-w-full items-start gap-3 bg-[#12436b] px-4 py-2 text-[13px] font-black uppercase leading-5 tracking-[0.16em] text-white sm:inline-flex sm:w-auto sm:items-center sm:text-xs sm:tracking-[0.2em]">
              <Handshake className="mt-0.5 shrink-0 text-ed-mist sm:mt-0" size={16} />
              <span className="min-w-0 whitespace-normal">Global Partner Programme 2027</span>
            </p>

            <h1 className="mt-7 w-full max-w-4xl break-words text-balance ed-home-display text-[clamp(2.4rem,5.6vw,4.2rem)] font-bold leading-[1.06] tracking-[-0.022em]">
              Expand your consultancy <span className="relative mt-2 inline-block bg-ed-mist px-2 pb-2 text-ed-ink sm:px-3 sm:pb-3">with written proof</span> and direct university links
            </h1>

            <p className="mt-7 max-w-2xl border-l-4 border-[#a9d6ee] pl-5 text-base leading-7 text-slate-700 md:text-lg md:leading-8">
              Choose a documented cooperation model for 12 active destinations — China plus 11 side destinations — or the flagship China route, with responsibilities and commercial terms confirmed before work begins.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center justify-center gap-3 bg-ed-navy px-6 py-4 text-sm font-black text-white hover:bg-[#12436b] shadow-[4px_4px_0_0_#12436b]"
              >
                Apply for Partnership <ArrowUpRight className="shrink-0 transition group-hover:translate-x-1 group-hover:-translate-y-1" size={18} />
              </button>
              <Link
                href="/universities"
                className="inline-flex items-center justify-center gap-3 border-2 border-[#0f3a5c] bg-white/70 px-6 py-4 text-sm font-black text-ed-ink hover:bg-white"
              >
                Explore University Records <GraduationCap className="shrink-0" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Partnership page sections" className="border-y border-[#12436b]/20 bg-ed-navy text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-px bg-white/15 sm:flex-row sm:items-stretch sm:justify-center">
          {[
            ['01', 'Choose a model', '#partnership-models'],
            ['02', 'Review China terms', '#china-partner-terms'],
            ['03', 'Apply for review', '#partnership-form'],
          ].map(([number, label, href]) => (
            <a key={href} href={href} className="group flex min-h-16 flex-1 items-center justify-between bg-ed-navy px-5 text-sm font-black hover:bg-[#12436b] sm:max-w-sm">
              <span className="flex items-center gap-3"><span className="font-mono text-[12px] text-ed-mist">{number}</span>{label}</span>
              <ArrowRight size={15} className="text-ed-mist transition group-hover:translate-x-1" />
            </a>
          ))}
        </div>
      </nav>

      {/* Partnership Models Grid */}
      <section id="partnership-models" className="scroll-mt-28 border-b border-[#12436b]/10 bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-12 max-w-3xl">
            <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-ed-navy">Step 01 · Partnership models</p>
            <h2 className="mt-3 ed-home-display text-4xl font-bold tracking-tight text-ed-ink md:text-5xl">Choose the cooperation route that fits your work</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">Each route begins with a suitability review. Territory, responsibilities, payments and student-data handling are documented in the final agreement.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {partnershipTypes.map(({ number, title, label, description, icon: Icon, features }, index) => (
              <article
                key={title}
                className={`group relative overflow-hidden border-2 border-[#0f3a5c] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#12436b] ${
                  index === 1 ? 'bg-[#12436b] text-white' : 'bg-[#f1f5f9] text-ed-ink'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm font-black">MODEL {number}</span>
                  <Icon size={35} strokeWidth={1.6} className={index === 1 ? 'text-ed-mist' : 'text-ed-navy'} />
                </div>

                <div className="mt-6">
                  <p className={`text-xs font-black uppercase tracking-[0.18em] ${index === 1 ? 'text-[#cfe7f5]' : 'text-ed-navy'}`}>{label}</p>
                  <h3 className="mt-2 ed-home-display text-2xl leading-[1.05] tracking-tight">{title}</h3>
                  <p className={`mt-3 leading-6 text-xs ${index === 1 ? 'text-white/80' : 'text-slate-700'}`}>{description}</p>

                  <ul className="mt-6 space-y-2 border-t border-[#12436b]/20 pt-4 bg-white/60 p-4 border border-[#0f3a5c]/20">
                    {features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center text-xs font-semibold text-ed-ink">
                        <span className="text-ed-navy font-bold mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* China Service Charges Schedule Table */}
      <section id="china-partner-terms" className="scroll-mt-28 border-b border-[#12436b]/10 bg-[#f1f5f9] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="font-mono text-[12px] font-black uppercase tracking-[0.2em] text-ed-navy">
              Flagship Specialization
            </span>
            <h2 className="mt-2 ed-home-display text-4xl font-bold text-ed-ink">
              China Partner Service Schedule
            </h2>
            <p className="text-sm text-slate-700 max-w-3xl mx-auto mt-3 bg-white p-5 border-2 border-[#0f3a5c]">
              China cooperation uses a written service schedule separate from destination commission arrangements. The selected scholarship coverage, included support and payment trigger are confirmed on the partner cost sheet before a student proceeds.
            </p>
          </div>

          <div className="border-2 border-[#0f3a5c] bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-ed-navy text-white font-mono text-[12px] font-black uppercase tracking-wider">
                    <th className="px-6 py-4">Scholarship Type</th>
                    <th className="px-6 py-4">Coverage</th>
                    <th className="px-6 py-4 text-right">Fee (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#12436b]/15">
                  {pricingTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#f1f5f9]">
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-[#12436b] text-ed-mist font-mono text-xs font-black uppercase">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-ed-ink">
                        {row.coverage}
                      </td>
                      <td className="px-6 py-4 text-right ed-home-display text-xl font-bold text-ed-ink">
                        {row.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-ed-navy p-4 text-xs text-white/80 border-t border-[#12436b]/30">
              <strong className="text-ed-mist font-bold">Written confirmation:</strong> The applicable coverage, university record, student responsibility and payment stage are confirmed in the case document. University and authority decisions remain independent.
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Form Section */}
      <section id="partnership-form" className="scroll-mt-28 border-b border-[#12436b]/10 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-[12px] font-black uppercase tracking-[0.2em] text-ed-navy">Step 03 · Cooperation request</p>
            <h2 className="mt-2 ed-home-display text-4xl font-bold text-ed-ink">
              Apply for Partnership
            </h2>
          </div>

          <div className="bg-[#f1f5f9] border-2 border-[#0f3a5c] p-6 md:p-10 max-w-4xl mx-auto shadow-[8px_8px_0_0_#12436b]">
            <PartnershipForm />
          </div>
        </div>
      </section>

      {/* Bring 01-03 CTA Banner */}
      <section className="bg-ed-mist px-5 py-16 text-ed-ink sm:px-8 sm:py-24 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-ed-navy">Compare before you commit</p>
              <h2 className="mt-4 max-w-4xl ed-home-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">Expand your student placement business with written proof and clear terms.</h2>
            </div>
            <button
              onClick={() => window.open('https://wa.me/8801983333566?text=Hello%2C%20I%27m%20interested%20in%20the%20EduExpress%20International%20Global%20Partner%20Programme.', '_blank')}
              className="inline-flex w-full items-center justify-center gap-3 bg-ed-navy px-7 py-5 text-base font-black text-white hover:bg-[#12436b] sm:text-lg lg:w-auto lg:min-w-64"
            >
              WhatsApp Partner Desk <ArrowUpRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
