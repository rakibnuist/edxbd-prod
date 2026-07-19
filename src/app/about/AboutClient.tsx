'use client';

import { Users, Award, Globe, Heart, GraduationCap, Shield, DollarSign, ArrowRight, BookOpen, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { trackConsultationRequest } from '@/lib/analytics';
import PageHeader from '@/components/PageHeader';
import TeamSection from '@/components/about/TeamSection';

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-[#f4f8fa] text-[#08263c] font-sans">
      <PageHeader
        title="About"
        highlight="EduExpress"
        description="Bangladesh's Evidence-First Education Consultancy since 2018. We compare education quality, costs, recognition, and career fit before recommending an overseas study route."
        icon={BookOpen}
        badgeText="Evidence-First Since 2018"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-start">
          <button
            onClick={() => {
              trackConsultationRequest('about_page_hero_start_journey');
              window.dispatchEvent(new CustomEvent('openQuickForm'));
            }}
            className="inline-flex items-center justify-center bg-[#08263c] text-white px-6 py-4 font-black text-sm hover:bg-[#174f7a] transition-all shadow-[4px_4px_0_0_#174f7a] w-full sm:w-auto"
          >
            Start Your Fit Assessment
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          <Link
            href="/fees-and-transparency"
            className="inline-flex items-center justify-center border-2 border-[#08263c] bg-white/70 text-[#08263c] hover:bg-white px-6 py-4 font-black text-sm transition-all w-full sm:w-auto"
          >
            Our Transparency System
          </Link>
        </div>
      </PageHeader>

      {/* Key Numbers Grid */}
      <section className="py-16 bg-[#08263c] text-white border-b border-[#174f7a]/30">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="border border-[#174f7a]/40 bg-[#061b2a] p-5 text-center">
              <div className="font-heading text-4xl font-bold text-[#8ed0ee] mb-1">06</div>
              <div className="font-mono text-[10px] font-black uppercase tracking-wider text-white/65">Better Education Checks</div>
            </div>
            <div className="border border-[#174f7a]/40 bg-[#061b2a] p-5 text-center">
              <div className="font-heading text-4xl font-bold text-[#64b5df] mb-1">Written</div>
              <div className="font-mono text-[10px] font-black uppercase tracking-wider text-white/65">ClearCost Schedule</div>
            </div>
            <div className="border border-[#174f7a]/40 bg-[#061b2a] p-5 text-center">
              <div className="font-heading text-4xl font-bold text-[#8ed0ee] mb-1">3+</div>
              <div className="font-mono text-[10px] font-black uppercase tracking-wider text-white/65">Routes Compared</div>
            </div>
            <div className="border border-[#174f7a]/40 bg-[#061b2a] p-5 text-center">
              <div className="font-heading text-4xl font-bold text-[#64b5df] mb-1">10</div>
              <div className="font-mono text-[10px] font-black uppercase tracking-wider text-white/65">Active Destinations</div>
            </div>
            <div className="border border-[#174f7a]/40 bg-[#061b2a] p-5 text-center">
              <div className="font-heading text-4xl font-bold text-[#8ed0ee] mb-1">Flagship</div>
              <div className="font-mono text-[10px] font-black uppercase tracking-wider text-white/65">China Proof Engine</div>
            </div>
            <div className="border border-[#174f7a]/40 bg-[#061b2a] p-5 text-center">
              <div className="font-heading text-4xl font-bold text-[#64b5df] mb-1">2018</div>
              <div className="font-mono text-[10px] font-black uppercase tracking-wider text-white/65">Founded Year</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story & History */}
      <section className="py-20 bg-white border-b border-[#174f7a]/15">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12 max-w-5xl">
          <div className="text-center mb-16">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Institutional Evolution</p>
            <h2 className="mt-2 font-heading text-4xl font-bold text-[#08263c]">Our Story & Purpose</h2>
            <div className="mt-6 text-base leading-8 text-slate-700 text-left space-y-6 max-w-4xl mx-auto border-l-4 border-[#174f7a] pl-6">
              <p>
                EduExpress International’s journey began on 8 March 2018 through Founder and CEO Abdullah Al Rakib’s work in Chinese higher education. In 2019, he established Wuxi Haiying Culture and Art Consulting Co., Ltd. in China and developed institutional cooperation with Chinese universities, including a formal student-recruitment cooperation agreement with Linyi University.
              </p>
              <p>
                Regional partner operations were also developed in Thailand and Vietnam. Following a temporary suspension during the COVID-19 period, EduExpress relaunched its Bangladesh operation in 2023 and now operates from Dhanmondi 4/A, Dhaka, serving students and education agency partners under strict transparency standards.
              </p>
            </div>
          </div>

          {/* China Specialist Positioning Callout */}
          <div className="border-2 border-[#08263c] bg-[#08263c] p-8 md:p-12 mb-20 text-[#08263c] shadow-[10px_10px_0_0_#64b5df]">
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee]">Flagship Specialization</span>
            <h3 className="mt-2 font-heading text-2xl md:text-3xl font-bold text-white">
              EduExpress International — Bangladesh’s China Admission and Scholarship Specialist
            </h3>
            <p className="mt-4 text-base md:text-lg text-white/80 leading-relaxed max-w-3xl">
              Through experience dating back to 2018, university agent portals and direct institutional relationships, EduExpress provides specialized support for Chinese university admission, scholarships, documentation and student visa preparation under our Visa-First Service Policy.
            </p>
          </div>

          {/* Historical Timeline */}
          <div className="mb-8">
            <h3 className="font-heading text-3xl font-bold text-center text-[#08263c] mb-12">Historical Timeline</h3>
            
            <div className="relative border-l-2 border-[#174f7a] pl-6 ml-2 space-y-8">
              {[
                { year: "2018", title: "Journey Began", desc: "Abdullah Al Rakib entered the Chinese international-education and student-admission sector." },
                { year: "2019", title: "China Entity Formed", desc: "Wuxi Haiying Culture and Art Consulting Co., Ltd. was established in China." },
                { year: "2019", title: "Regional Expansion", desc: "Partner offices and cooperation were developed in Thailand and Vietnam." },
                { year: "Pre-COVID", title: "Institutional Cooperation", desc: "Formal university recruitment relationships were established, including with Linyi University." },
                { year: "COVID Period", title: "Operations Suspended", desc: "International operations were temporarily paused due to pandemic disruptions." },
                { year: "2023", title: "Bangladesh Relaunch", desc: "EduExpress resumed operations from RK Tower, Banglamotor." },
                { year: "Present", title: "Dhanmondi Decision Desk", desc: "Operating from House 12/1, Road 4/A, Dhanmondi, Dhaka under the Evidence-First standard." },
              ].map((item, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute left-[-31px] top-1.5 size-4 bg-[#64b5df] border-2 border-[#08263c]" />
                  <div className="border border-[#174f7a]/20 bg-[#f4f8fa] p-5 shadow-sm">
                    <span className="inline-block px-3 py-1 bg-[#174f7a] text-[#8ed0ee] font-mono text-[10px] font-black uppercase tracking-wider mb-2">{item.year}</span>
                    <h4 className="font-heading text-xl font-bold text-[#08263c] mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* What We Do */}
      <section className="py-20 bg-[#f4f8fa]">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12 max-w-5xl">
          <div className="text-center mb-14">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Our Core Pillars</p>
            <h2 className="mt-2 font-heading text-4xl font-bold text-[#08263c]">What We Do</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-[#08263c] bg-white p-8 shadow-sm">
              <div className="w-10 h-10 bg-[#e9f7fd] border border-[#174f7a]/20 flex items-center justify-center mb-5 text-[#174f7a]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#08263c] mb-2">Education Fit Assessment</h3>
              <p className="text-sm leading-6 text-slate-700">
                We compare education quality, program entry logic, recognition, and total financial reality before making an option recommendation.
              </p>
            </div>

            <div className="border-2 border-[#08263c] bg-white p-8 shadow-sm">
              <div className="w-10 h-10 bg-[#e9f7fd] border border-[#174f7a]/20 flex items-center justify-center mb-5 text-[#174f7a]">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#08263c] mb-2">Visa Readiness Records</h3>
              <p className="text-sm leading-6 text-slate-700">
                Document checklists, missing requirements, official embassy guidance, and assigned responsibilities recorded in writing.
              </p>
            </div>

            <div className="border-2 border-[#08263c] bg-white p-8 shadow-sm">
              <div className="w-10 h-10 bg-[#e9f7fd] border border-[#174f7a]/20 flex items-center justify-center mb-5 text-[#174f7a]">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#08263c] mb-2">ClearCost Transparency</h3>
              <p className="text-sm leading-6 text-slate-700">
                Itemized cost schedule separating university tuition, hostel, deposit, embassy, medical, and courier costs from EduExpress service charges.
              </p>
            </div>

            <div className="border-2 border-[#08263c] bg-white p-8 shadow-sm">
              <div className="w-10 h-10 bg-[#e9f7fd] border border-[#174f7a]/20 flex items-center justify-center mb-5 text-[#174f7a]">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#08263c] mb-2">Application Proof Pack</h3>
              <p className="text-sm leading-6 text-slate-700">
                Timestamped submission references, receipts, offer letters, deadlines, and direct university tracking recorded for every student.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#08263c] text-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12 text-center max-w-3xl">
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8ed0ee] mb-3">Compare Before You Commit</p>
          <h2 className="font-heading text-4xl font-bold mb-6">Ready to inspect your options?</h2>
          <p className="text-base text-white/75 mb-10 leading-relaxed">
            Visit our Dhanmondi decision desk or submit your Education Fit Assessment online for a written summary of suitable routes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                trackConsultationRequest('about_page_cta_get_consultation');
                window.dispatchEvent(new CustomEvent('openQuickForm'));
              }}
              className="inline-flex items-center justify-center bg-[#64b5df] text-[#08263c] px-8 py-4 font-black text-sm hover:bg-white transition-all shadow-[4px_4px_0_0_#174f7a]"
            >
              Get My Fit Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white/10 px-8 py-4 font-black text-sm transition-all"
            >
              Contact Dhanmondi Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
