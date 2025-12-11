'use client';

import { FileText, Scale, Users, Shield, AlertTriangle, CheckCircle, Globe, Phone } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export default function TermsClient() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PageHeader
        title="Terms of"
        highlight="Service"
        description="Please read these terms carefully before using our services"
        icon={Scale}
        badgeText="Legal Terms"
      >
        <p className="text-sm text-slate-600 mt-4 font-medium bg-white/50 inline-block px-4 py-2 rounded-full border border-slate-200 backdrop-blur-sm">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </PageHeader>

      {/* Quick Overview */}
      <section className="py-24 bg-slate-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-8 bg-white rounded-[2rem] border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-green-400 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-100 group-hover:bg-green-100 transition-colors">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-wide group-hover:text-green-700 transition-colors">Clear Terms</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Simple, understandable terms that protect both you and us.
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-[2rem] border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100 group-hover:bg-blue-100 transition-colors">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-wide group-hover:text-blue-700 transition-colors">Fair Service</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Transparent service agreements that benefit all parties involved.
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-[2rem] border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-orange-400 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-orange-100 group-hover:bg-orange-100 transition-colors">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-wide group-hover:text-orange-700 transition-colors">Legal Protection</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Comprehensive legal framework that protects your rights and interests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-8 prose-li:text-slate-600 prose-strong:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-700">

              {/* Introduction */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-slate-900">
                  <FileText className="w-8 h-8 mr-3 text-blue-600" />
                  Introduction
                </h2>
                <p className="leading-relaxed mb-4">
                  Welcome to EduExpress International. These Terms of Service (&quot;Terms&quot;) govern your use of our website, services, and any related applications (collectively, the &quot;Service&quot;) operated by EduExpress International (&quot;us,&quot; &quot;we,&quot; or &quot;our&quot;).
                </p>
                <p className="leading-relaxed mb-4">
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
                </p>
                <p className="leading-relaxed">
                  These Terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </div>

              {/* Acceptance of Terms */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Acceptance of Terms</h2>
                <p className="leading-relaxed mb-4">
                  By using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use our Service.
                </p>
                <p className="leading-relaxed">
                  We reserve the right to modify these Terms at any time. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                </p>
              </div>

              {/* Description of Service */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-slate-900">
                  <Globe className="w-8 h-8 mr-3 text-green-600" />
                  Description of Service
                </h2>
                <p className="leading-relaxed mb-4">
                  EduExpress International provides study abroad consultancy services, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 marker:text-green-500 bg-green-50/50 p-6 rounded-2xl border border-green-100">
                  <li>University selection and application assistance</li>
                  <li>Scholarship identification and application support</li>
                  <li>Visa application guidance and documentation assistance</li>
                  <li>Pre-departure orientation and support</li>
                  <li>Educational counseling and career guidance</li>
                  <li>Document verification and translation services</li>
                  <li>Test preparation guidance (IELTS, TOEFL, GRE, GMAT, etc.)</li>
                  <li>Accommodation and travel assistance</li>
                </ul>
                <p className="leading-relaxed">
                  Our services are provided on a consultation basis, and we act as intermediaries between students and educational institutions, government agencies, and other relevant parties.
                </p>
              </div>

              {/* User Responsibilities */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">User Responsibilities</h2>
                <p className="leading-relaxed mb-4">
                  As a user of our Service, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 marker:text-slate-400">
                  <li>Provide accurate, complete, and up-to-date information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use the Service only for lawful purposes</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Respect the intellectual property rights of others</li>
                  <li>Not engage in any fraudulent, abusive, or illegal activities</li>
                  <li>Pay all applicable fees and charges in a timely manner</li>
                  <li>Provide necessary documentation and information as requested</li>
                </ul>
              </div>

              {/* Service Limitations */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-slate-900">
                  <AlertTriangle className="w-8 h-8 mr-3 text-orange-500" />
                  Service Limitations and Disclaimers
                </h2>
                <p className="leading-relaxed mb-4">
                  While we strive to provide the best possible service, please understand that:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 marker:text-orange-500 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                  <li>We cannot guarantee admission to any specific university or program</li>
                  <li>Visa approval is subject to government discretion and policy changes</li>
                  <li>Scholarship availability and amounts may vary and are not guaranteed</li>
                  <li>University admission requirements and deadlines may change</li>
                  <li>Government policies and regulations may affect our services</li>
                  <li>We are not responsible for decisions made by third parties</li>
                </ul>
              </div>

              {/* Fees and Payment */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Fees and Payment</h2>
                <p className="leading-relaxed mb-4">
                  Our fee structure is as follows:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 marker:text-slate-400">
                  <li><strong className="text-slate-900">Initial Consultation:</strong> Free of charge</li>
                  <li><strong className="text-slate-900">Service Fees:</strong> As per our published fee schedule</li>
                  <li><strong className="text-slate-900">Third-party Fees:</strong> University application fees, visa fees, and other government charges are separate</li>
                  <li><strong className="text-slate-900">Payment Terms:</strong> Fees are due as specified in your service agreement</li>
                </ul>
                <p className="leading-relaxed">
                  All fees are non-refundable unless otherwise specified in writing. We reserve the right to change our fees with reasonable notice.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                  <Phone className="w-8 h-8 mr-3 text-blue-600" />
                  Contact Information
                </h2>
                <p className="leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] shadow-sm">
                  <div className="space-y-3 text-slate-600">
                    <p className="text-slate-900 text-lg flex items-center gap-2">
                      <Scale className="w-5 h-5 text-amber-600" />
                      <strong>EduExpress International</strong>
                    </p>
                    <p>House: 12/1, Ground Floor, Road: 4/A</p>
                    <p>Dhanmondi, Dhaka-1209, Bangladesh</p>
                    <p>Phone: +880-1983-333566</p>
                    <p>Email: info@eduexpressint.com</p>
                  </div>
                </div>
              </div>

              {/* Acknowledgment */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Acknowledgment</h2>
                <p className="leading-relaxed mb-4">
                  By using our Service, you acknowledge that you have read these Terms of Service and agree to be bound by them.
                </p>
                <p className="leading-relaxed">
                  These Terms constitute the entire agreement between you and EduExpress International regarding the use of our Service.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white text-center tracking-tight">Questions About Our Terms?</h2>
            <p className="text-xl mb-10 text-slate-300 text-center leading-relaxed font-medium">
              We&apos;re here to help clarify any questions you may have about our terms and conditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-amber-500 text-slate-900 hover:bg-amber-400 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/20"
              >
                Contact Us
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center justify-center bg-transparent border-2 border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
