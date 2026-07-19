'use client';

import React from 'react';
import PageHeader from '@/components/PageHeader';
import ClearCostCalculator from '@/components/proof/ClearCostCalculator';
import ProofAssetViewer from '@/components/proof/ProofAssetViewer';
import { ShieldCheck, Scale, FileText, Calculator, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FeesAndTransparencyClient() {
  return (
    <div className="min-h-screen bg-[#f4f8fa] text-[#08263c] font-sans">
      <PageHeader
        title="Fees & Written"
        highlight="Transparency"
        description="Verify every cost, inspect our 4 productized trust assets, and calculate your total financial outlay with zero hidden fees."
        icon={Scale}
        badgeText="Evidence-First Verification Hub"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-start mt-8">
          <button
            onClick={() => document.getElementById('clearcost-calculator')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#08263c] text-white font-black px-6 py-4 text-xs uppercase tracking-wider hover:bg-[#174f7a] transition-all shadow-[4px_4px_0_0_#174f7a]"
          >
            Calculate Costs Now
          </button>
          <button
            onClick={() => document.getElementById('trust-assets-viewer')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-2 border-[#08263c] bg-white/70 text-[#08263c] hover:bg-white font-black px-6 py-4 text-xs uppercase tracking-wider transition-all"
          >
            Inspect Written Proof
          </button>
        </div>
      </PageHeader>

      {/* Core Philosophy Banner */}
      <section className="py-14 bg-white border-b border-[#174f7a]/15">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12 max-w-4xl text-center">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a] mb-2">Our Standard</p>
          <h2 className="font-heading text-3xl font-bold text-[#08263c] mb-4">
            Better Education. Clear Costs. Written Proof.
          </h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            In an educational consultancy sector plagued by hidden charges and unwritten verbal promises, EduExpress International operates under strict evidence-first governance. Every tuition schedule, third-party official fee, and service terms agreement is provided in writing before you commit.
          </p>
        </div>
      </section>

      {/* ClearCost Calculator Section */}
      <section id="clearcost-calculator" className="py-20 px-5 sm:px-8 lg:px-12 container mx-auto">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">
            Tool 01 — Financial Transparency
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#08263c] mt-2">
            The ClearCost™ Financial Estimator
          </h2>
          <p className="text-xs text-slate-600 mt-2">
            Select your target study destination and scholarship tier to view an exact itemized fee breakdown.
          </p>
        </div>

        <ClearCostCalculator />
      </section>

      {/* Proof Assets Specimen Viewer Section */}
      <section id="trust-assets-viewer" className="py-20 bg-white border-t border-b border-[#174f7a]/15">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">
              Tool 02 — Document Verification
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#08263c] mt-2">
              Inspect Our 4 Trust Assets
            </h2>
            <p className="text-xs text-slate-600 mt-2">
              Every student who consults EduExpress receives these 4 written proof documents prior to payment.
            </p>
          </div>

          <ProofAssetViewer />
        </div>
      </section>

      {/* Flagship Policy Principles */}
      <section className="py-20 px-5 sm:px-8 lg:px-12 container mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Legal Foundations</p>
          <h2 className="font-heading text-3xl font-bold text-[#08263c] mt-2">
            The 4 Pillars of Fee Governance
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            {
              num: '01',
              title: 'Zero File Opening Charge',
              text: 'We never charge Bangladeshi students money to open a file, review transcripts, or provide initial university options.'
            },
            {
              num: '02',
              title: 'China Visa-First Guarantee',
              text: 'For all China placements, EduExpress service charges are payable ONLY after student visa approval is granted.'
            },
            {
              num: '03',
              title: 'Itemized Third-Party Fees',
              text: 'Official university registration, JW202 government forms, visa medicals, and embassy charges are itemized separately with official receipts.'
            },
            {
              num: '04',
              title: 'Dhanmondi Decision Desk',
              text: 'All records, document receipts, and agreements are verified in person at our licensed Dhanmondi office in Dhaka.'
            }
          ].map((pillar) => (
            <div
              key={pillar.num}
              className="bg-white border-2 border-[#08263c] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#174f7a]"
            >
              <div className="font-mono text-sm font-black text-[#174f7a] mb-2">{pillar.num}</div>
              <h3 className="font-heading text-lg font-bold text-[#08263c] mb-2">{pillar.title}</h3>
              <p className="text-xs text-slate-700 leading-5">{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-[#08263c] text-white text-center">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12 max-w-3xl">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee] mb-3">Compare Before You Commit</p>
          <h2 className="font-heading text-4xl font-bold mb-4">
            Get Your Free Education Fit Assessment
          </h2>
          <p className="text-sm text-white/75 mb-8 leading-relaxed">
            Receive a written 3-university comparison report with full ClearCost breakdown tailored to your GPA and target budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/education-fit-assessment"
              className="bg-[#64b5df] text-[#08263c] font-black px-8 py-4 text-xs uppercase tracking-wider hover:bg-white transition-all shadow-[4px_4px_0_0_#174f7a]"
            >
              Start Free Assessment
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white font-black px-8 py-4 text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              Visit Dhanmondi Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
