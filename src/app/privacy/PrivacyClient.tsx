'use client';

import { Shield, Eye, Lock, Database, Users, Globe, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export default function PrivacyClient() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Privacy"
        highlight="Policy"
        description="Learn how we protect your personal information and respect your privacy rights"
        icon={Shield}
        badgeText="Your Privacy Matters"
      >
        <p className="text-sm text-blue-100/80 mt-4">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </PageHeader>

      {/* Quick Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Data</h3>
                <p className="text-gray-600">
                  Your information is encrypted and stored securely with industry-standard protection.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparent Use</h3>
                <p className="text-gray-600">
                  We clearly explain how we collect, use, and share your personal information.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Control</h3>
                <p className="text-gray-600">
                  You have the right to access, update, or delete your personal information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
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
                  EduExpress International (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Database className="w-8 h-8 mr-3 text-green-600" />
                  Information We Collect
                </h2>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may collect the following types of personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Name, email address, phone number, and mailing address</li>
                  <li>Date of birth, nationality, and passport information</li>
                  <li>Academic records, transcripts, and educational background</li>
                  <li>Career goals, study preferences, and program interests</li>
                  <li>Financial information for scholarship and funding applications</li>
                  <li>Communication preferences and interaction history</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Technical Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We automatically collect certain technical information when you visit our website:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>IP address, browser type, and device information</li>
                  <li>Pages visited, time spent on pages, and navigation patterns</li>
                  <li>Referring website and search terms used</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              {/* How We Use Information */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Globe className="w-8 h-8 mr-3 text-orange-500" />
                  How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use your personal information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Provide study abroad consultation and guidance services</li>
                  <li>Assist with university applications and admissions</li>
                  <li>Help with visa applications and documentation</li>
                  <li>Identify and apply for scholarships and funding opportunities</li>
                  <li>Communicate with you about our services and updates</li>
                  <li>Improve our website and service offerings</li>
                  <li>Comply with legal obligations and regulatory requirements</li>
                  <li>Protect against fraud and ensure security</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Information Sharing and Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li><strong>With Universities:</strong> To facilitate your applications and admissions</li>
                  <li><strong>With Government Agencies:</strong> For visa applications and immigration purposes</li>
                  <li><strong>With Service Providers:</strong> Third-party companies that help us provide our services</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
              </div>

              {/* Data Security */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="w-8 h-8 mr-3 text-red-500" />
                  Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Staff training on data protection practices</li>
                  <li>Incident response procedures</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>

              {/* Your Rights */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <CheckCircle className="w-8 h-8 mr-3 text-green-600" />
                  Your Rights and Choices
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                  <li><strong>Restriction:</strong> Request limitation of how we process your information</li>
                  <li><strong>Objection:</strong> Object to certain types of processing</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  To exercise these rights, please contact us using the information provided in the &quot;Contact Us&quot; section below.
                </p>
              </div>

              {/* Cookies */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your experience on our website:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li><strong>Essential Cookies:</strong> Necessary for website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.
                </p>
              </div>

              {/* Data Retention */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We retain your personal information for as long as necessary to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Provide our services and support</li>
                  <li>Comply with legal and regulatory obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Improve our services and user experience</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  When personal information is no longer needed, we will securely delete or anonymize it.
                </p>
              </div>

              {/* International Transfers */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  As a study abroad consultancy, we may transfer your personal information to countries outside Bangladesh, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Universities and educational institutions worldwide</li>
                  <li>Government agencies in destination countries</li>
                  <li>Service providers located in other countries</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses and adequacy decisions.
                </p>
              </div>

              {/* Children's Privacy */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Children&apos;s Privacy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  For students under 18, we may require parental consent for certain services and data processing activities.
                </p>
              </div>

              {/* Policy Updates */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending email notifications to registered users</li>
                  <li>Displaying prominent notices on our website</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Your continued use of our services after any changes constitutes acceptance of the updated Privacy Policy.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
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

            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Questions About Your Privacy?</h2>
            <p className="text-xl mb-8 text-blue-100">
              We&apos;re here to help. Contact us if you have any questions about how we protect your information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105"
              >
                Contact Us
              </Link>
              <Link
                href="/"
                className="inline-flex items-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
