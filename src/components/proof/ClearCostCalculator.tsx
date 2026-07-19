'use client';

import React, { useState } from 'react';
import { Calculator, DollarSign, ShieldCheck, CheckCircle2, FileText, Info, ArrowRight, Sparkles } from 'lucide-react';

interface DestinationFeeStructure {
  id: string;
  name: string;
  flag: string;
  currency: string;
  exchangeRateBDT: number; // 1 USD in BDT approx
  scholarships: {
    id: string;
    label: string;
    tuitionUSD: number;
    hostelUSD: number;
    officialThirdPartyUSD: number;
    eduExpressFeeUSD: number;
    serviceFeePolicy: string;
    description: string;
  }[];
}

const feeData: DestinationFeeStructure[] = [
  {
    id: 'china',
    name: 'China (Flagship Visa-First)',
    flag: '🇨🇳',
    currency: 'USD',
    exchangeRateBDT: 120,
    scholarships: [
      {
        id: 'type-a',
        label: 'Type-A (Full Tuition + Free Hostel + Monthly Stipend)',
        tuitionUSD: 0,
        hostelUSD: 0,
        officialThirdPartyUSD: 350, // JW202, Visa, Medical, Courier
        eduExpressFeeUSD: 500,
        serviceFeePolicy: 'Payable ONLY after Student Visa is approved. $0 upfront.',
        description: 'Full scholarship covering complete tuition, university accommodation, plus monthly living stipend.'
      },
      {
        id: 'type-b',
        label: 'Type-B (Full Tuition + Free Hostel)',
        tuitionUSD: 0,
        hostelUSD: 0,
        officialThirdPartyUSD: 350,
        eduExpressFeeUSD: 450,
        serviceFeePolicy: 'Payable ONLY after Student Visa is approved. $0 upfront.',
        description: 'Full tuition waiver and free campus hostel room.'
      },
      {
        id: 'type-c',
        label: 'Type-C (Full Tuition Waiver)',
        tuitionUSD: 0,
        hostelUSD: 600, // Avg yearly hostel
        officialThirdPartyUSD: 350,
        eduExpressFeeUSD: 400,
        serviceFeePolicy: 'Payable ONLY after Student Visa is approved. $0 upfront.',
        description: '100% tuition fee waived. Student covers campus accommodation.'
      },
      {
        id: 'type-d',
        label: 'Type-D (Partial Scholarship 50%–80% Off)',
        tuitionUSD: 900,
        hostelUSD: 600,
        officialThirdPartyUSD: 350,
        eduExpressFeeUSD: 300,
        serviceFeePolicy: 'Payable ONLY after Student Visa is approved. $0 upfront.',
        description: 'Significant tuition reduction for qualified applicants.'
      }
    ]
  },
  {
    id: 'hungary',
    name: 'Hungary (Stipendium Hungaricum / Self)',
    flag: '🇭🇺',
    currency: 'EUR',
    exchangeRateBDT: 130,
    scholarships: [
      {
        id: 'stipendium',
        label: 'Stipendium Hungaricum (Full Grant)',
        tuitionUSD: 0,
        hostelUSD: 0,
        officialThirdPartyUSD: 250,
        eduExpressFeeUSD: 350,
        serviceFeePolicy: 'Itemized written milestones. Refund terms defined in agreement.',
        description: 'Government scholarship covering tuition, accommodation allowance, and medical insurance.'
      },
      {
        id: 'self-funded',
        label: 'Self-Funded Degree',
        tuitionUSD: 3000,
        hostelUSD: 1800,
        officialThirdPartyUSD: 300,
        eduExpressFeeUSD: 450,
        serviceFeePolicy: 'Itemized written milestones. Refund terms defined in agreement.',
        description: 'Direct entry to EU accredited degree programs.'
      }
    ]
  },
  {
    id: 'south-korea',
    name: 'South Korea (GKS / University Waiver)',
    flag: '🇰🇷',
    currency: 'USD',
    exchangeRateBDT: 120,
    scholarships: [
      {
        id: 'gks',
        label: 'GKS / University Merit Waiver',
        tuitionUSD: 1200,
        hostelUSD: 1000,
        officialThirdPartyUSD: 300,
        eduExpressFeeUSD: 400,
        serviceFeePolicy: 'Written cost breakdown prior to submission.',
        description: 'Tuition discount based on academic GPA and TOPIK/IELTS proficiency.'
      }
    ]
  },
  {
    id: 'uk',
    name: 'United Kingdom (Direct Entry)',
    flag: '🇬🇧',
    currency: 'GBP',
    exchangeRateBDT: 155,
    scholarships: [
      {
        id: 'uk-standard',
        label: 'Standard University Entry + Automatic Merit Bursary',
        tuitionUSD: 14000,
        hostelUSD: 6000,
        officialThirdPartyUSD: 800, // CAS, Visa, IHS Health Surcharge
        eduExpressFeeUSD: 0, // University funded service
        serviceFeePolicy: 'Free guidance for partner universities. Official fees paid directly to UKVI.',
        description: 'Direct application to UK universities with £1,000–£4,000 automatic merit awards.'
      }
    ]
  }
];

export default function ClearCostCalculator() {
  const [selectedDestId, setSelectedDestId] = useState<string>('china');
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>('type-a');

  const currentDest = feeData.find((d) => d.id === selectedDestId) || feeData[0];
  const currentScholarship =
    currentDest.scholarships.find((s) => s.id === selectedScholarshipId) || currentDest.scholarships[0];

  const totalThirdParty = currentScholarship.officialThirdPartyUSD;
  const totalTuitionHostel = currentScholarship.tuitionUSD + currentScholarship.hostelUSD;
  const eduExpressFee = currentScholarship.eduExpressFeeUSD;
  const grandTotalUSD = totalThirdParty + totalTuitionHostel + eduExpressFee;
  const grandTotalBDT = grandTotalUSD * currentDest.exchangeRateBDT;

  const handleDestChange = (destId: string) => {
    setSelectedDestId(destId);
    const newDest = feeData.find((d) => d.id === destId);
    if (newDest && newDest.scholarships.length > 0) {
      setSelectedScholarshipId(newDest.scholarships[0].id);
    }
  };

  return (
    <div className="bg-white border-2 border-[#08263c] p-6 md:p-10 shadow-[10px_10px_0_0_#174f7a]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-[#08263c] pb-6 mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#174f7a] text-[#8ed0ee] font-mono text-[10px] font-black uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            ClearCost™ Estimator
          </div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-[#08263c]">
            Itemized Cost Breakdown
          </h3>
          <p className="text-slate-600 text-xs mt-1">
            Calculate your total financial obligation before committing to any application.
          </p>
        </div>

        <div className="bg-[#f4f8fa] border border-[#174f7a]/30 p-3 flex items-center gap-3 text-xs">
          <ShieldCheck className="w-6 h-6 text-[#174f7a] shrink-0" />
          <div>
            <div className="font-bold text-[#08263c]">Zero Hidden Charges</div>
            <div className="text-slate-500 text-[11px]">All third-party & service fees written upfront</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Destination Selection */}
        <div>
          <label className="block font-mono text-xs font-black uppercase tracking-wider text-[#08263c] mb-2">
            1. Select Study Destination
          </label>
          <div className="grid grid-cols-2 gap-2">
            {feeData.map((dest) => (
              <button
                key={dest.id}
                onClick={() => handleDestChange(dest.id)}
                className={`p-3 text-left border-2 transition-all flex items-center gap-2 ${
                  selectedDestId === dest.id
                    ? 'border-[#08263c] bg-[#08263c] text-white shadow-[3px_3px_0_0_#174f7a]'
                    : 'border-[#08263c]/30 bg-[#f4f8fa] text-[#08263c] hover:border-[#08263c]'
                }`}
              >
                <span className="text-lg">{dest.flag}</span>
                <span className="font-bold text-xs truncate">{dest.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scholarship / Tier Selection */}
        <div>
          <label className="block font-mono text-xs font-black uppercase tracking-wider text-[#08263c] mb-2">
            2. Select Award Tier / Funding Type
          </label>
          <div className="space-y-2">
            {currentDest.scholarships.map((sch) => (
              <button
                key={sch.id}
                onClick={() => setSelectedScholarshipId(sch.id)}
                className={`w-full p-3 text-left border-2 transition-all ${
                  selectedScholarshipId === sch.id
                    ? 'border-[#08263c] bg-[#e9f7fd] text-[#08263c] font-bold shadow-[3px_3px_0_0_#174f7a]'
                    : 'border-[#08263c]/20 bg-white text-slate-700 hover:border-[#08263c]'
                }`}
              >
                <div className="text-xs font-heading font-bold">{sch.label}</div>
                <div className="text-[11px] font-normal text-slate-500 mt-0.5 line-clamp-1">
                  {sch.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown Display */}
      <div className="bg-[#f4f8fa] border-2 border-[#08263c] p-6 mb-8">
        <h4 className="font-mono text-xs font-black uppercase tracking-wider text-[#174f7a] mb-4 flex items-center justify-between">
          <span>Detailed Fee Table ({currentDest.name})</span>
          <span>1 USD ≈ ৳{currentDest.exchangeRateBDT} BDT</span>
        </h4>

        <div className="space-y-3 divide-y divide-[#174f7a]/15 text-xs">
          {/* Row 1: University Tuition */}
          <div className="pt-2 flex justify-between items-center">
            <div>
              <span className="font-bold text-[#08263c]">1. University Tuition Fee</span>
              <p className="text-[11px] text-slate-500">Paid directly to host university account</p>
            </div>
            <div className="text-right">
              <span className="font-heading font-bold text-[#08263c]">
                ${currentScholarship.tuitionUSD.toLocaleString()} USD
              </span>
              <div className="text-[10px] text-slate-500">
                ≈ ৳{(currentScholarship.tuitionUSD * currentDest.exchangeRateBDT).toLocaleString()} BDT
              </div>
            </div>
          </div>

          {/* Row 2: Hostel & Living */}
          <div className="pt-3 flex justify-between items-center">
            <div>
              <span className="font-bold text-[#08263c]">2. Campus Hostel / Accommodation</span>
              <p className="text-[11px] text-slate-500">Covered or paid directly on campus</p>
            </div>
            <div className="text-right">
              <span className="font-heading font-bold text-[#08263c]">
                ${currentScholarship.hostelUSD.toLocaleString()} USD
              </span>
              <div className="text-[10px] text-slate-500">
                ≈ ৳{(currentScholarship.hostelUSD * currentDest.exchangeRateBDT).toLocaleString()} BDT
              </div>
            </div>
          </div>

          {/* Row 3: Official Third-Party Fees */}
          <div className="pt-3 flex justify-between items-center">
            <div>
              <span className="font-bold text-[#08263c]">3. Government & Third-Party Official Fees</span>
              <p className="text-[11px] text-slate-500">JW202, Embassy Visa, Medical, Courier & Translations</p>
            </div>
            <div className="text-right">
              <span className="font-heading font-bold text-[#08263c]">
                ${currentScholarship.officialThirdPartyUSD.toLocaleString()} USD
              </span>
              <div className="text-[10px] text-slate-500">
                ≈ ৳{(currentScholarship.officialThirdPartyUSD * currentDest.exchangeRateBDT).toLocaleString()} BDT
              </div>
            </div>
          </div>

          {/* Row 4: EduExpress Service Fee */}
          <div className="pt-3 flex justify-between items-center bg-[#e9f7fd] p-3 border border-[#174f7a]/30 -mx-2">
            <div>
              <span className="font-bold text-[#08263c] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#174f7a]" />
                4. EduExpress Service Charge
              </span>
              <p className="text-[11px] text-[#174f7a] font-semibold mt-0.5">
                {currentScholarship.serviceFeePolicy}
              </p>
            </div>
            <div className="text-right">
              <span className="font-heading text-lg font-black text-[#08263c]">
                ${currentScholarship.eduExpressFeeUSD.toLocaleString()} USD
              </span>
              <div className="text-[10px] font-bold text-[#174f7a]">
                ≈ ৳{(currentScholarship.eduExpressFeeUSD * currentDest.exchangeRateBDT).toLocaleString()} BDT
              </div>
            </div>
          </div>
        </div>

        {/* Total Box */}
        <div className="mt-6 pt-4 border-t-2 border-[#08263c] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#08263c] text-white p-5">
          <div>
            <div className="font-mono text-[10px] font-black uppercase tracking-wider text-[#8ed0ee]">
              Estimated Total First-Year Outlay
            </div>
            <div className="text-xs text-white/75 mt-0.5">
              Includes tuition, hostel, government fees & consultancy
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="font-heading text-3xl font-black text-[#64b5df]">
              ${grandTotalUSD.toLocaleString()} USD
            </div>
            <div className="font-mono text-xs text-[#8ed0ee] font-bold">
              ≈ ৳{grandTotalBDT.toLocaleString()} BDT
            </div>
          </div>
        </div>
      </div>

      {/* Written Terms Notice */}
      <div className="bg-white border border-[#174f7a]/20 p-4 flex items-start gap-3 text-xs text-slate-700">
        <Info className="w-5 h-5 text-[#174f7a] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#08263c] font-bold">Written Guarantee:</strong> Prior to starting any application, EduExpress provides a signed <strong>ClearCost™ Schedule</strong> detailing every item above. No additional fees will ever be demanded without written authorization.
        </div>
      </div>
    </div>
  );
}
