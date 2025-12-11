'use client';

import { FileText, Scale, Users, Shield, AlertTriangle, CheckCircle, Globe, Phone } from 'lucide-react';
import Link from 'next/link';

export default function TermsClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Scale className="w-4 h-4 mr-2" />
              Legal Terms
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Terms of <span className="text-blue-600">Service</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Clear Terms</h3>
                <p className="text-gray-600">
                  Simple, understandable terms that protect both you and us.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Fair Service</h3>
                <p className="text-gray-600">
                  Transparent service agreements that benefit all parties involved.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Protection</h3>
                <p className="text-gray-600">
                  Comprehensive legal framework that protects your rights and interests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">

              {/* Introduction */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-8 h-8 mr-3 text-blue-600" />
                  Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to EduExpress International. These Terms of Service (&quot;Terms&quot;) govern your use of our website, services, and any related applications (collectively, the &quot;Service&quot;) operated by EduExpress International (&quot;us,&quot; &quot;we,&quot; or &quot;our&quot;).
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These Terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </div>

              {/* Acceptance of Terms */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use our Service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these Terms at any time. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                </p>
              </div>

              {/* Description of Service */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Globe className="w-8 h-8 mr-3 text-green-600" />
                  Description of Service
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  EduExpress International provides study abroad consultancy services, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>University selection and application assistance</li>
                  <li>Scholarship identification and application support</li>
                  <li>Visa application guidance and documentation assistance</li>
                  <li>Pre-departure orientation and support</li>
                  <li>Educational counseling and career guidance</li>
                  <li>Document verification and translation services</li>
                  <li>Test preparation guidance (IELTS, TOEFL, GRE, GMAT, etc.)</li>
                  <li>Accommodation and travel assistance</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Our services are provided on a consultation basis, and we act as intermediaries between students and educational institutions, government agencies, and other relevant parties.
                </p>
              </div>

              {/* User Responsibilities */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">User Responsibilities</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  As a user of our Service, you agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
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
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="w-8 h-8 mr-3 text-orange-500" />
                  Service Limitations and Disclaimers
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  While we strive to provide the best possible service, please understand that:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>We cannot guarantee admission to any specific university or program</li>
                  <li>Visa approval is subject to government discretion and policy changes</li>
                  <li>Scholarship availability and amounts may vary and are not guaranteed</li>
                  <li>University admission requirements and deadlines may change</li>
                  <li>Government policies and regulations may affect our services</li>
                  <li>We are not responsible for decisions made by third parties</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Our role is to provide guidance, support, and assistance. Final decisions regarding admissions, visas, and scholarships rest with the respective authorities and institutions.
                </p>
              </div>

              {/* Fees and Payment */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Fees and Payment</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our fee structure is as follows:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li><strong>Initial Consultation:</strong> Free of charge</li>
                  <li><strong>Service Fees:</strong> As per our published fee schedule</li>
                  <li><strong>Third-party Fees:</strong> University application fees, visa fees, and other government charges are separate</li>
                  <li><strong>Payment Terms:</strong> Fees are due as specified in your service agreement</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  All fees are non-refundable unless otherwise specified in writing. We reserve the right to change our fees with reasonable notice.
                </p>
              </div>

              {/* Intellectual Property */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Intellectual Property Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of EduExpress International and its licensors. The Service is protected by copyright, trademark, and other laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You may not reproduce, distribute, modify, or create derivative works of our content without our express written permission.
                </p>
              </div>

              {/* Privacy and Data Protection */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Privacy and Data Protection</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our Service, you consent to the collection and use of information in accordance with our Privacy Policy.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In no event shall EduExpress International, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our total liability to you for any damages arising from or related to these Terms or the Service shall not exceed the amount you paid us for the specific service giving rise to the claim.
                </p>
              </div>

              {/* Indemnification */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Indemnification</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You agree to defend, indemnify, and hold harmless EduExpress International and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney&apos;s fees).
                </p>
              </div>

              {/* Termination */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Termination</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service.
                </p>
              </div>

              {/* Governing Law */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Governing Law</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These Terms shall be interpreted and governed by the laws of Bangladesh, without regard to its conflict of law provisions.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </div>

              {/* Dispute Resolution */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Dispute Resolution</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Any disputes arising out of or relating to these Terms or the Service shall be resolved through:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Good faith negotiations between the parties</li>
                  <li>Mediation through a mutually agreed mediator</li>
                  <li>Arbitration in accordance with the Arbitration Act of Bangladesh</li>
                  <li>Jurisdiction of the courts of Dhaka, Bangladesh</li>
                </ul>
              </div>

              {/* Changes to Terms */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Phone className="w-8 h-8 mr-3 text-blue-600" />
                  Contact Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="space-y-3">
                    <p className="text-gray-700"><strong>EduExpress International</strong></p>
                    <p className="text-gray-700">House: 12/1, Ground Floor, Road: 4/A</p>
                    <p className="text-gray-700">Dhanmondi, Dhaka-1209, Bangladesh</p>
                    <p className="text-gray-700">Phone: +880-1983-333566</p>
                    <p className="text-gray-700">Email: info@eduexpressint.com</p>
                  </div>
                </div>
              </div>

              {/* Acknowledgment */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Acknowledgment</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By using our Service, you acknowledge that you have read these Terms of Service and agree to be bound by them.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These Terms constitute the entire agreement between you and EduExpress International regarding the use of our Service.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Questions About Our Terms?</h2>
            <p className="text-xl mb-8 text-blue-100">
              We&apos;re here to help clarify any questions you may have about our terms and conditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105"
              >
                Contact Us
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
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
