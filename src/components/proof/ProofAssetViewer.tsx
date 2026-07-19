'use client';

import React, { useState } from 'react';
import { FileCheck, Shield, Award, CheckCircle2, FileText, Lock, ExternalLink, Eye, ChevronRight } from 'lucide-react';

interface ProofAsset {
  id: string;
  title: string;
  badge: string;
  shortDesc: string;
  specimenNumber: string;
  specimenDate: string;
  content: {
    sectionHeader: string;
    fields: { label: string; value: string; highlight?: boolean }[];
    bulletsHeader: string;
    bullets: string[];
    verificationNote: string;
  };
}

const proofAssets: ProofAsset[] = [
  {
    id: 'edufit-report',
    title: 'EduFit™ Decision Report',
    badge: 'TRUST ASSET 01',
    shortDesc: 'Side-by-side comparison of 3 recommended institutions based on GPA, budget, and career goals.',
    specimenNumber: 'EDUFIT-DH-2026-889',
    specimenDate: '15 July 2026',
    content: {
      sectionHeader: 'Student Profile & University Comparative Rationale',
      fields: [
        { label: 'Student Target', value: 'B.Sc. Computer Science & Engineering' },
        { label: 'Academic Standing', value: 'HSC GPA 4.80 / SSC GPA 5.00' },
        { label: 'Option 1 (Recommended)', value: 'Sichuan University (QS #320) — Type-A Full Scholarship', highlight: true },
        { label: 'Option 2 (Alternative)', value: 'Dalian University of Technology — Type-B Tuition+Hostel' },
        { label: 'Option 3 (Rejected)', value: 'Unaccredited Regional College — REJECTED (Failed EduFit Quality Check)' }
      ],
      bulletsHeader: 'Written Selection Rationale:',
      bullets: [
        'Sichuan University is accredited by MoE China and listed in WHO/WDOMS registries.',
        'Total 4-year tuition is 100% waived under CSC Government quota; campus hostel room provided.',
        'Career fit: Direct lab exposure in Artificial Intelligence & Big Data research centers.'
      ],
      verificationNote: 'Issued to student prior to application submission. Signed by Senior Counselor, Dhanmondi Desk.'
    }
  },
  {
    id: 'clearcost-sheet',
    title: 'ClearCost™ Fee Schedule',
    badge: 'TRUST ASSET 02',
    shortDesc: 'Written itemized breakdown separating university tuition, embassy fees, and consultancy service charges.',
    specimenNumber: 'COST-SCHED-2026-402',
    specimenDate: '16 July 2026',
    content: {
      sectionHeader: 'Itemized Financial Responsibility Agreement',
      fields: [
        { label: 'University Tuition Fee', value: '$0.00 USD (Covered by Type-A Scholarship)', highlight: true },
        { label: 'Campus Accommodation', value: '$0.00 USD (Free Dormitory Reserved)' },
        { label: 'Official JW202 Processing', value: '$150 USD (Paid directly to Ministry agent)' },
        { label: 'Embassy Visa & Medical', value: '$200 USD (Paid to Embassy & Authorized Hospital)' },
        { label: 'EduExpress Service Fee', value: '$500 USD (PAYABLE ONLY AFTER VISA APPROVAL)', highlight: true }
      ],
      bulletsHeader: 'Financial Transparency Terms:',
      bullets: [
        'Zero file opening charge. Zero EduExpress service fee collected prior to Visa issuance.',
        'Any third-party fee required earlier (e.g. university application or JW202) is itemized in writing with official receipt.',
        'Payment recipient, milestone trigger, and refund conditions defined in writing prior to processing.'
      ],
      verificationNote: 'Verified by EduExpress Billing Department. Attached as Annexure A to Student Agreement.'
    }
  },
  {
    id: 'proof-pack',
    title: 'Application Proof Pack',
    badge: 'TRUST ASSET 03',
    shortDesc: 'Written dossier containing timestamped submission receipts, offer records, and government tracking proof.',
    specimenNumber: 'PROOF-PACK-2026-119',
    specimenDate: '18 July 2026',
    content: {
      sectionHeader: 'Official Submission & Acceptance Evidence',
      fields: [
        { label: 'Application ID', value: 'CSC-2026-8849102' },
        { label: 'Submission Timestamp', value: '2026-07-10 14:22:05 UTC (Verified System Log)' },
        { label: 'JW202 Verification No.', value: 'JW202-2026-SCH-00941', highlight: true },
        { label: 'Official Admission Notice', value: 'Confirmed by University International Office' },
        { label: 'Responsible Desk Officer', value: 'Senior Processing Officer, Dhanmondi Branch' }
      ],
      bulletsHeader: 'Evidence Package Included:',
      bullets: [
        'Timestamped portal screenshot showing verified submission status.',
        'Original electronic JW202 government visa authorization form provided for verification.',
        'Official admission notice issued by university registrar with QR verification link.'
      ],
      verificationNote: 'Student retains full physical and digital copies of all submitted documents and portal logins.'
    }
  },
  {
    id: 'china-policy',
    title: 'China Visa-First Policy',
    badge: 'TRUST ASSET 04',
    shortDesc: 'Written policy guaranteeing $0 EduExpress service fee before student visa approval in Bangladesh.',
    specimenNumber: 'POLICY-CN-2026-001',
    specimenDate: '01 January 2026',
    content: {
      sectionHeader: 'Flagship Protection Standard for Bangladeshi Students',
      fields: [
        { label: 'File Opening Charge', value: '৳0 BDT (100% Free Consultation & Submission)', highlight: true },
        { label: 'EduExpress Service Charge', value: 'Payable ONLY after X1/X2 Visa is Stamped', highlight: true },
        { label: 'Third-Party Fee Guarantee', value: 'All official university/embassy fees itemized in advance' },
        { label: 'Governing Trade Licence', value: 'DSCC Trade Licence TRAD/005430/2023' }
      ],
      bulletsHeader: 'Core Governance Clause:',
      bullets: [
        '"No file opening charge. No EduExpress service fee before China visa approval. Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier must be itemized in writing before the student proceeds."',
        'If a student visa is rejected, EduExpress charges $0 service fee.',
        'Full operational oversight maintained at Dhanmondi, Dhaka office.'
      ],
      verificationNote: 'Signed and sealed by EduExpress International Management.'
    }
  }
];

export default function ProofAssetViewer() {
  const [activeAssetId, setActiveAssetId] = useState<string>('edufit-report');

  const activeAsset = proofAssets.find((a) => a.id === activeAssetId) || proofAssets[0];

  return (
    <div className="bg-white border-2 border-[#08263c] p-6 md:p-10 shadow-[10px_10px_0_0_#174f7a]">
      {/* Top Header */}
      <div className="border-b-2 border-[#08263c] pb-6 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#08263c] text-[#64b5df] font-mono text-[10px] font-black uppercase tracking-wider mb-2">
          <Shield className="w-3.5 h-3.5" />
          The 4 Productized Trust Assets
        </div>
        <h3 className="font-heading text-2xl md:text-3xl font-bold text-[#08263c]">
          Written Proof Specimen Viewer
        </h3>
        <p className="text-slate-600 text-xs mt-1">
          Inspect actual anonymized specimen documents provided to every EduExpress student.
        </p>
      </div>

      {/* Asset Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {proofAssets.map((asset) => (
          <button
            key={asset.id}
            onClick={() => setActiveAssetId(asset.id)}
            className={`p-4 text-left border-2 transition-all ${
              activeAssetId === asset.id
                ? 'border-[#08263c] bg-[#08263c] text-white shadow-[4px_4px_0_0_#174f7a]'
                : 'border-[#08263c]/30 bg-[#f4f8fa] text-[#08263c] hover:border-[#08263c]'
            }`}
          >
            <div className={`font-mono text-[9px] font-black uppercase tracking-wider mb-1 ${
              activeAssetId === asset.id ? 'text-[#8ed0ee]' : 'text-[#174f7a]'
            }`}>
              {asset.badge}
            </div>
            <div className="font-heading font-bold text-xs leading-snug">{asset.title}</div>
          </button>
        ))}
      </div>

      {/* Specimen Sheet Render */}
      <div className="bg-[#f4f8fa] border-2 border-[#08263c] p-6 md:p-8 relative">
        {/* Specimen Watermark Badge */}
        <div className="absolute top-4 right-4 bg-[#08263c]/10 border border-[#08263c]/30 px-3 py-1 text-[10px] font-mono font-bold text-[#08263c] uppercase tracking-wider">
          SAMPLE SPECIMEN
        </div>

        {/* Specimen Header */}
        <div className="border-b border-[#174f7a]/20 pb-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#174f7a]">
            <FileText className="w-4 h-4 text-[#174f7a]" />
            <span>Document ID: {activeAsset.specimenNumber}</span>
            <span className="text-slate-400">|</span>
            <span>Date: {activeAsset.specimenDate}</span>
          </div>
          <h4 className="font-heading text-xl font-bold text-[#08263c] mt-2">
            {activeAsset.title}
          </h4>
          <p className="text-xs text-slate-600 mt-1">{activeAsset.shortDesc}</p>
        </div>

        {/* Specimen Content Box */}
        <div className="bg-white border-2 border-[#08263c] p-6 shadow-sm mb-6">
          <h5 className="font-mono text-xs font-black uppercase tracking-wider text-[#174f7a] mb-4 border-b pb-2">
            {activeAsset.content.sectionHeader}
          </h5>

          {/* Fields Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {activeAsset.content.fields.map((field, idx) => (
              <div
                key={idx}
                className={`p-3 border text-xs ${
                  field.highlight
                    ? 'bg-[#e9f7fd] border-[#174f7a] text-[#08263c] font-bold'
                    : 'bg-[#f4f8fa] border-[#174f7a]/20 text-slate-700'
                }`}
              >
                <div className="font-mono text-[10px] uppercase text-[#174f7a] font-bold">{field.label}</div>
                <div className="font-semibold text-[#08263c] mt-0.5">{field.value}</div>
              </div>
            ))}
          </div>

          {/* Bullets */}
          <div className="bg-[#f4f8fa] p-4 border border-[#174f7a]/20">
            <div className="font-mono text-[11px] font-black uppercase text-[#08263c] mb-2">
              {activeAsset.content.bulletsHeader}
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {activeAsset.content.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2">
                  <span className="text-[#174f7a] font-bold mt-0.5">✓</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#08263c] text-white p-4 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#64b5df] shrink-0" />
            <span className="text-white/80">{activeAsset.content.verificationNote}</span>
          </div>
          <span className="font-mono text-[10px] font-bold text-[#8ed0ee] shrink-0 uppercase tracking-wider">
            Verified Evidence Standard
          </span>
        </div>
      </div>
    </div>
  );
}
