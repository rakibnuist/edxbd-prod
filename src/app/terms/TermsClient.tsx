'use client';

import { FileText, Scale, Users, Shield, AlertTriangle, CheckCircle, Globe, Phone, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export default function TermsClient() {
  const termsPillars = [
    {
      num: '01',
      title: 'Written Proof Standard',
      icon: CheckCircle,
      copy: 'Every cost schedule, decision report, and document checklist is provided in writing before you proceed.'
    },
    {
      num: '02',
      title: 'Explicit Fee Separation',
      icon: Scale,
      copy: 'Unambiguous separation of host university tuition, third-party government fees, and EduExpress service charges.'
    },
    {
      num: '03',
      title: 'China Visa-First Guarantee',
      icon: Shield,
      copy: 'No EduExpress service fee collected for China placements prior to official student visa issuance.'
    },
    {
      num: '04',
      title: 'Outcome Responsibility Limits',
      icon: AlertTriangle,
      copy: 'Admissions and visa decisions rest exclusively with host universities and relevant government embassies.'
    }
  ];

  return (
    <div className="overflow-hidden bg-[#f4f8fa] text-[#08263c] font-sans">
      {/* Homepage Hero Header Style */}
      <section className="relative px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 md:pt-40 lg:px-12 border-b border-[#174f7a]/15">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(23,79,122,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,79,122,0.07)_1px,transparent_1px)] bg-[size:76px_76px]" />
        <div className="pointer-events-none absolute right-[4%] top-28 size-72 rounded-full border-[44px] border-[#64b5df]/15 md:size-[460px]" />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#174f7a]/25 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#174f7a]">
            <span>EduExpress International Bangladesh</span>
            <span>Terms of Service Agreement</span>
            <span>Policy Version 2026-07-19</span>
          </div>

          <div className="max-w-4xl">
            <p className="flex w-full max-w-full items-start gap-3 bg-[#174f7a] px-4 py-2 text-[11px] font-black uppercase leading-5 tracking-[0.16em] text-white sm:inline-flex sm:w-auto sm:items-center sm:text-xs sm:tracking-[0.2em]">
              <Scale className="mt-0.5 shrink-0 text-[#8ed0ee] sm:mt-0" size={16} />
              <span className="min-w-0 whitespace-normal">Evidence-First Terms of Service</span>
            </p>

            <h1 className="mt-7 w-full max-w-4xl break-words text-balance font-heading text-[clamp(2.4rem,5.6vw,4.2rem)] font-bold leading-[1.06] tracking-[-0.022em]">
              Written operational terms <span className="relative mt-2 inline-block bg-[#64b5df] px-2 pb-2 text-[#08263c] sm:px-3 sm:pb-3">governing your consultation</span>
            </h1>

            <p className="mt-7 max-w-2xl border-l-4 border-[#64b5df] pl-5 text-base leading-7 text-slate-700 md:text-lg md:leading-8">
              These terms govern all student evaluations, written fee schedules, and university application dossiers managed by EduExpress International from Dhanmondi, Dhaka.
            </p>
          </div>
        </div>
      </section>

      {/* Universal Promise Dark Section */}
      <section className="border-y border-[#08263c] bg-[#08263c] text-white">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[.8fr_repeat(4,1fr)]">
          <div className="bg-[#64b5df] p-6 text-[#08263c] lg:p-7">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Four Operational Clauses</p>
            <h2 className="mt-3 font-heading text-2xl font-bold leading-tight">Service Framework</h2>
          </div>
          {termsPillars.map(({ num, title, copy, icon: Icon }) => (
            <div key={title} className="group relative border-b border-white/15 p-5 hover:bg-white/5 lg:border-b-0 lg:border-r lg:p-6">
              <div className="flex items-center justify-between"><span className="font-mono text-[9px] text-[#64b5df]">TERM {num}</span><Icon size={19} className="text-[#64b5df]" /></div>
              <h3 className="mt-7 font-heading text-lg font-bold leading-6">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-white/50">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Terms Content */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24 border-b border-[#174f7a]/15">
        <div className="container mx-auto max-w-4xl bg-[#f4f8fa] border-2 border-[#08263c] p-8 md:p-12 shadow-[8px_8px_0_0_#174f7a]">
          <div className="space-y-10">
            <div>
              <h2 className="font-heading text-2xl font-bold mb-4 flex items-center text-[#08263c]">
                <FileText className="w-6 h-6 mr-2.5 text-[#174f7a]" />
                1. Scope of Consultation
              </h2>
              <p className="text-slate-700 text-sm leading-6">
                EduExpress International provides educational evaluation, university matching, scholarship assessment, document preparation, and visa readiness coaching under written evidence standards.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold mb-4 flex items-center text-[#08263c]">
                <Globe className="w-6 h-6 mr-2.5 text-[#174f7a]" />
                2. Fee Schedule & Payment Policy
              </h2>
              <ul className="space-y-2 bg-white p-5 border border-[#174f7a]/20 text-xs text-slate-700 font-semibold">
                <li className="flex items-center"><span className="text-[#174f7a] mr-2">✓</span> Initial EduFit Evaluation & Document Review: 100% Free ($0 File Opening Fee)</li>
                <li className="flex items-center"><span className="text-[#174f7a] mr-2">✓</span> China Placement Service Fee: Payable ONLY after Student Visa is Approved</li>
                <li className="flex items-center"><span className="text-[#174f7a] mr-2">✓</span> Official Third-Party Fees: JW202, Embassy Visa & Medicals itemized in advance with receipts</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold mb-4 flex items-center text-[#08263c]">
                <AlertTriangle className="w-6 h-6 mr-2.5 text-[#174f7a]" />
                3. Outcome Disclaimers
              </h2>
              <div className="bg-[#e9f7fd] p-5 border border-[#174f7a]/30 text-xs text-[#08263c] space-y-2 font-medium">
                <p><strong>Admissions:</strong> Official admission offers and JW202 government forms are issued solely by host university registrars and Chinese ministry departments.</p>
                <p><strong>Visas:</strong> Visa issuance decisions rest exclusively with the relevant embassy consular section.</p>
              </div>
            </div>

            <div className="border-t border-[#174f7a]/15 pt-6">
              <h3 className="font-heading text-lg font-bold text-[#08263c] mb-2">Licensed Operating Entity</h3>
              <p className="text-xs text-slate-700">EduExpress International — House 12/1, Ground Floor, Road 4/A, Dhanmondi, Dhaka 1209 (DSCC Trade Licence TRAD/005430/2023)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bring 01-03 CTA Banner */}
      <section className="bg-[#64b5df] px-5 py-16 text-[#08263c] sm:px-8 sm:py-24 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#174f7a]">Compare before you commit</p>
              <h2 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">Questions about our written terms? Speak to our Dhanmondi desk.</h2>
            </div>
            <Link href="/contact" className="inline-flex w-full items-center justify-center gap-3 bg-[#08263c] px-7 py-5 text-base font-black text-white hover:bg-[#174f7a] sm:text-lg lg:w-auto lg:min-w-64">Contact Decision Desk <ArrowUpRight size={20} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
