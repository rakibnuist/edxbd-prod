'use client';

import { Users, Award, Globe, Heart, GraduationCap, Shield, DollarSign, ArrowRight, BookOpen, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { trackConsultationRequest } from '@/lib/analytics';
import PageHeader from '@/components/PageHeader';
import TeamSection from '@/components/about/TeamSection';

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="About"
        highlight="EduExpress"
        description="Your trusted partner in global education since 2018. We've helped over 3,000 students achieve their dreams of studying abroad with 6+ years of proven experience."
        icon={BookOpen}
        badgeText="Trusted Since 2018"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <button
            onClick={() => {
              trackConsultationRequest('about_page_hero_start_journey');
              window.dispatchEvent(new CustomEvent('openQuickForm'));
            }}
            className="inline-flex items-center justify-center bg-white text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-95 w-full sm:w-auto"
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </button>
          <Link
            href="/services"
            className="inline-flex items-center justify-center bg-blue-700 text-white hover:bg-blue-800 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-700/20 active:scale-95 w-full sm:w-auto"
          >
            Our Services
          </Link>
        </div>
      </PageHeader>

      {/* Key Numbers - Simple & Clean */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              <div className="text-center group">
                <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-200">6</div>
                <div className="text-gray-600 font-medium">Education Checks</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-200">Written</div>
                <div className="text-gray-600 font-medium">Cost Clarity</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-orange-500 mb-2 group-hover:scale-110 transition-transform duration-200">3+</div>
                <div className="text-gray-600 font-medium">Options Compared</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-200">25+</div>
                <div className="text-gray-600 font-medium">Countries</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-red-500 mb-2 group-hover:scale-110 transition-transform duration-200">$5M+</div>
                <div className="text-gray-600 font-medium">Scholarships</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-200">6+</div>
                <div className="text-gray-600 font-medium">Years</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story & History */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
              <div className="text-lg text-gray-600 leading-relaxed text-left space-y-6">
                <p>
                  EduExpress International’s journey began on 8 March 2018 through Founder and CEO Abdullah Al Rakib’s work in Chinese higher education. In 2019, he established Wuxi Haiying Culture and Art Consulting Co., Ltd. in China and developed institutional cooperation with Chinese universities, including a formal student-recruitment cooperation agreement with Linyi University.
                </p>
                <p>
                  Regional partner operations were also developed in Thailand and Vietnam. Following a temporary suspension during the COVID-19 period, EduExpress relaunched its Bangladesh operation in 2023 and now supports both students and education-agency partners.
                </p>
              </div>
            </div>

            {/* China Specialist Positioning */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl p-8 md:p-12 mb-20 text-center border border-blue-200/50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
              <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
                EduExpress International — Bangladesh’s China Admission and Scholarship Specialist
              </h3>
              <p className="text-lg md:text-xl text-blue-800/80 leading-relaxed max-w-3xl mx-auto font-medium">
                Through experience dating back to 2018, a former China-registered operating company, university agent portals and institutional relationships, EduExpress provides specialised support for Chinese university admission, scholarships, documentation and student visa preparation.
              </p>
            </div>

            {/* Historical Timeline */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-16">Our Historical Timeline</h3>
              
              <div className="relative border-l-2 border-blue-200 pl-8 ml-4 md:pl-0 md:ml-0 md:border-l-0">
                {/* Desktop Center Line */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 -translate-x-1/2"></div>
                
                <div className="space-y-12">
                  {[
                    { year: "2018", title: "Journey began", desc: "Abdullah Al Rakib entered the Chinese international-education and student-admission sector." },
                    { year: "2019", title: "China company established", desc: "Wuxi Haiying Culture and Art Consulting Co., Ltd. was formed in China." },
                    { year: "2019", title: "Regional expansion", desc: "Partner offices and cooperation were developed in Thailand and Vietnam." },
                    { year: "Pre-COVID period", title: "Institutional cooperation", desc: "The China company entered university recruitment relationships, including the attached agreement with Linyi University." },
                    { year: "COVID period", title: "Operations suspended", desc: "International operations were temporarily closed because of pandemic disruption." },
                    { year: "2023", title: "Bangladesh relaunch", desc: "EduExpress resumed operations from RK Tower, Banglamotor." },
                    { year: "Present", title: "Dhanmondi operation", desc: "EduExpress operates from Dhanmondi 4/A, serving both students and education agencies." },
                  ].map((item, idx) => (
                    <div key={idx} className={`relative flex flex-col md:flex-row items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      
                      {/* Timeline Dot */}
                      <div className="absolute left-[-41px] md:left-1/2 top-1 md:top-1/2 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-md md:-translate-x-1/2 md:-translate-y-1/2 z-10"></div>
                      
                      {/* Content Card */}
                      <div className={`w-full md:w-[45%] ${idx % 2 === 0 ? 'md:pl-10 text-left' : 'md:pr-10 md:text-right'}`}>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-bold text-sm rounded-full mb-3">{item.year}</div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                          <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* What We Do - Simple Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What We Do</h2>
            <p className="text-xl text-gray-600">
              We provide end-to-end support for your study abroad journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">University Selection</h3>
              <p className="text-gray-600">
                Find the perfect university match based on your academic profile, career goals, and budget.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Visa Support</h3>
              <p className="text-gray-600">
                Complete visa processing assistance with expert guidance and high success rates.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Scholarship Assistance</h3>
              <p className="text-gray-600">
                Maximize your funding opportunities with our comprehensive scholarship support.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pre-Departure Support</h3>
              <p className="text-gray-600">
                Smooth transition to your new country with comprehensive pre-departure assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Simple & Clear */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose EduExpress?</h2>
            <p className="text-xl text-gray-600">
              Three reasons why thousands of students trust us with their future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Proven Success</h3>
              <p className="text-gray-600 text-lg">
                Recommendations explain education fit, recognition, costs and decision factors. Each university, scholarship body and authority issues its official outcome.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalized Support</h3>
              <p className="text-gray-600 text-lg">
                Dedicated consultant for each student with 24/7 support throughout your journey.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Network</h3>
              <p className="text-gray-600 text-lg">
                Direct partnerships with 150+ universities across 25+ countries worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Simple & Direct */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-10 text-blue-100">
              Join thousands of successful students who achieved their dreams with EduExpress
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  trackConsultationRequest('about_page_cta_get_consultation');
                  window.dispatchEvent(new CustomEvent('openQuickForm'));
                }}
                className="inline-flex items-center bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105"
              >
                Get Free Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
              >
                Start Application
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Form Modal */}
    </div>
  );
}
