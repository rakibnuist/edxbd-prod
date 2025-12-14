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
        description="Your trusted partner in global education since 2018. We've helped over 3000 students achieve their dreams of studying abroad with 6+ years of proven experience."
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
            className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg transition-all duration-300 min-h-[48px] w-full sm:w-auto"
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
                <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-200">3000+</div>
                <div className="text-gray-600 font-medium">Students Placed</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-200">95%</div>
                <div className="text-gray-600 font-medium">Success Rate</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-orange-500 mb-2 group-hover:scale-110 transition-transform duration-200">300+</div>
                <div className="text-gray-600 font-medium">Universities</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-200">25+</div>
                <div className="text-gray-600 font-medium">Countries</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-red-500 mb-2 group-hover:scale-110 transition-transform duration-200">€2M+</div>
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

      {/* Our Story - Simple & Focused */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Since 2018, we&apos;ve been helping students turn their study abroad dreams into reality.
                Our mission is simple: make world-class education accessible to everyone with our proven 6+ years of experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-600">
                  To democratize access to world-class education through personalized guidance and comprehensive support.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Impact</h3>
                <p className="text-gray-600">
                  Over 3000 successful placements with a 95% success rate across 25+ countries worldwide.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Promise</h3>
                <p className="text-gray-600">
                  Every student gets personalized attention and dedicated support throughout their journey.
                </p>
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
                95% success rate with over 3000 students placed in top universities worldwide since 2018.
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
                Direct partnerships with 300+ universities across 25+ countries worldwide.
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
