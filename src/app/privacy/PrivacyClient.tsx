'use client';

import { Shield, Lock, Eye, Users, FileText, Database, Globe, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export default function PrivacyClient() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PageHeader
        title="Privacy"
        highlight="Policy"
        description="Learn how we protect your personal information and respect your privacy rights"
        icon={Shield}
        badgeText="Your Privacy Matters"
      >
        <p className="text-sm text-slate-600 mt-4 font-medium bg-white/50 inline-block px-4 py-2 rounded-full border border-slate-200 backdrop-blur-sm">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </PageHeader>

      {/* Quick Overview */}
      <section className="py-24 bg-slate-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-8 bg-white rounded-[2rem] border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-green-400 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-100 group-hover:bg-green-100 transition-colors">
                  <Lock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-wide group-hover:text-green-700 transition-colors">Secure Data</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Your information is encrypted and stored securely with industry-standard protection.
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-[2rem] border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100 group-hover:bg-blue-100 transition-colors">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-wide group-hover:text-blue-700 transition-colors">Transparent Use</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  We clearly explain how we collect, use, and share your personal information.
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-[2rem] border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-violet-400 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-violet-100 group-hover:bg-violet-100 transition-colors">
                  <Users className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-wide group-hover:text-violet-700 transition-colors">Your Control</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  You have the right to access, update, or delete your personal information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
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
                  EduExpress International (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
                </p>
                <p className="leading-relaxed">
                  By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-slate-900">
                  <Database className="w-8 h-8 mr-3 text-green-600" />
                  Information We Collect
                </h2>

                <h3 className="text-2xl font-semibold text-slate-800 mb-4">Personal Information</h3>
                <p className="leading-relaxed mb-4">
                  We may collect the following types of personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 marker:text-blue-500 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <li>Name, email address, phone number, and mailing address</li>
                  <li>Date of birth, nationality, and passport information</li>
                  <li>Academic records, transcripts, and educational background</li>
                  <li>Career goals, study preferences, and program interests</li>
                  <li>Financial information for scholarship and funding applications</li>
                  <li>Communication preferences and interaction history</li>
                </ul>

                <h3 className="text-2xl font-semibold text-slate-800 mb-4">Technical Information</h3>
                <p className="leading-relaxed mb-4">
                  We automatically collect certain technical information when you visit our website:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 marker:text-blue-500 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <li>IP address, browser type, and device information</li>
                  <li>Pages visited, time spent on pages, and navigation patterns</li>
                  <li>Referring website and search terms used</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              {/* How We Use Information */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-slate-900">
                  <Globe className="w-8 h-8 mr-3 text-amber-500" />
                  How We Use Your Information
                </h2>
                <p className="leading-relaxed mb-4">
                  We use your personal information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 marker:text-amber-500 bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
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
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Information Sharing and Disclosure</h2>
                <p className="leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 marker:text-slate-400">
                  <li><strong className="text-slate-900">With Universities:</strong> To facilitate your applications and admissions</li>
                  <li><strong className="text-slate-900">With Government Agencies:</strong> For visa applications and immigration purposes</li>
                  <li><strong className="text-slate-900">With Service Providers:</strong> Third-party companies that help us provide our services</li>
                  <li><strong className="text-slate-900">Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong className="text-slate-900">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                  <li><strong className="text-slate-900">With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
              </div>

              {/* Data Security */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-slate-900">
                  <Shield className="w-8 h-8 mr-3 text-rose-500" />
                  Data Security
                </h2>
                <p className="leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 marker:text-rose-500 bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Staff training on data protection practices</li>
                  <li>Incident response procedures</li>
                </ul>
                <p className="leading-relaxed text-sm text-slate-500 mt-4 italic">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>

              {/* Your Rights */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center text-slate-900">
                  <CheckCircle className="w-8 h-8 mr-3 text-emerald-500" />
                  Your Rights and Choices
                </h2>
                <p className="leading-relaxed mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 marker:text-emerald-500 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                  <li><strong className="text-slate-900">Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong className="text-slate-900">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong className="text-slate-900">Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong className="text-slate-900">Portability:</strong> Request transfer of your data to another service provider</li>
                  <li><strong className="text-slate-900">Restriction:</strong> Request limitation of how we process your information</li>
                  <li><strong className="text-slate-900">Objection:</strong> Object to certain types of processing</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  To exercise these rights, please contact us using the information provided in the &quot;Contact Us&quot; section below.
                </p>
              </div>

              {/* Cookies */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Cookies and Tracking Technologies</h2>
                <p className="leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your experience on our website:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 marker:text-slate-400">
                  <li><strong className="text-slate-900">Essential Cookies:</strong> Necessary for website functionality</li>
                  <li><strong className="text-slate-900">Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                  <li><strong className="text-slate-900">Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                  <li><strong className="text-slate-900">Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                <p className="leading-relaxed">
                  You can control cookie settings through your browser preferences. However, disabling certain cookies may affect website functionality.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Contact Us</h2>
                <p className="leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] shadow-sm">
                  <div className="space-y-3 text-slate-600">
                    <p className="text-slate-900 text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <strong>EduExpress International</strong>
                    </p>
                    <p>House: 12/1, Ground Floor, Road: 4/A</p>
                    <p>Dhanmondi, Dhaka-1209, Bangladesh</p>
                    <p>Phone: +880-1983-333566</p>
                    <p>Email: info@eduexpressint.com</p>
                  </div>
                </div>
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white text-center tracking-tight">Questions About Your Privacy?</h2>
            <p className="text-xl mb-10 text-slate-300 text-center leading-relaxed font-medium">
              We&apos;re here to help. Contact us if you have any questions about how we protect your information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-amber-500 text-slate-900 hover:bg-amber-400 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/20"
              >
                Contact Us
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-transparent border-2 border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300"
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
