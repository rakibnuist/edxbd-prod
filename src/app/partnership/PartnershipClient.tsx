'use client';

import { motion } from 'framer-motion';
import {
  Handshake,
  Users,
  TrendingUp,
  Award,
  Globe,
  Shield,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Star,
  Briefcase,
  Headphones,
  Zap,
  GraduationCap,
  Landmark,
  Microscope,
  Languages,
  Banknote,
  GraduationCap as GradCap,
  Link as LinkIcon,
  MapPin,
  ClipboardCheck,
  FileCheck,
  DollarSign
} from 'lucide-react';
import PartnershipForm from '@/components/PartnershipForm';
import PageHeader from '@/components/PageHeader';

const PartnershipClient = () => {

  const partnershipTypes = [
    {
      title: 'Global Authorized Agent',
      description: 'Represent EduExpress in your region with exclusive territory rights',
      features: [
        'Exclusive territory rights',
        'Complete training & support',
        'Marketing materials & leads',
        '10-20% commission on global placements',
        'Priority student support'
      ],
      icon: Shield,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'China Strategic Partner',
      description: 'Specialized partnership for China placements via our transparent Service-Charge model.',
      features: [
        'Direct access to 150+ Chinese Universities',
        'Transparent Service Charge pricing',
        'High success rate on Government Scholarships',
        'End-to-end Visa and on-arrival support',
        'Dedicated account manager'
      ],
      icon: Handshake,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      title: 'Referral Partner',
      description: 'Simple referral program for new education consultants',
      features: [
        'Easy referral process',
        'No upfront investment required',
        'Flexible arrangements',
        'Fixed referral bonuses',
        'Quick approval process'
      ],
      icon: Users,
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Revenue Growth',
      description: 'Earn lucrative commissions globally and competitive margins on China service charges.',
      stat: 'High Yield Returns'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Access to universities across 15+ countries, including 150+ directly affiliated Chinese institutions.',
      stat: '500+ Universities'
    },
    {
      icon: BookOpen,
      title: 'Training & Resources',
      description: 'Receive our complete, current directory for university requirements and scholarships.',
      stat: 'Full Documentation'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock dedicated WhatsApp support for you and your students.',
      stat: 'Instant Response'
    }
  ];

  const chinaAdvantages = [
    {
      icon: Landmark,
      title: "Global Rankings",
      badge: "QS-Ranked",
      badgeColor: "text-emerald-700 bg-emerald-100 border-emerald-200",
      description: "China's leading universities consistently feature in QS and THE world rankings."
    },
    {
      icon: Microscope,
      title: "Technology Leadership",
      badge: "Innovation",
      badgeColor: "text-blue-700 bg-blue-100 border-blue-200",
      description: "Study at the frontier of AI, clean energy, and biomedical research."
    },
    {
      icon: Languages,
      title: "English Medium",
      badge: "No Barrier",
      badgeColor: "text-indigo-700 bg-indigo-100 border-indigo-200",
      description: "Hundreds of accredited programmes are delivered entirely in English."
    },
    {
      icon: GradCap,
      title: "Scholarship Access",
      badge: "Fully-Funded",
      badgeColor: "text-amber-700 bg-amber-100 border-amber-200",
      description: "CSC Government and Silk Road awards make fully-funded degrees realistic."
    }
  ];

  const successStats = [
    { number: '500+', label: 'Active Partners', icon: Users },
    { number: '5,000+', label: 'Students Placed', icon: BookOpen },
    { number: '7 Yrs', label: 'In Market', icon: Award },
    { number: '24/7', label: 'Support Available', icon: Headphones }
  ];

  const process = [
    {
      step: 1,
      title: 'You Refer',
      description: 'Submit your partnership application and refer qualified students to us.'
    },
    {
      step: 2,
      title: 'We Apply',
      description: 'We evaluate the profile, select the university, and manage the scholarship application.'
    },
    {
      step: 3,
      title: 'Admission Confirmed',
      description: 'We secure the admission notice and JW202 government form.'
    },
    {
      step: 4,
      title: 'Visa Guided',
      description: 'Comprehensive support across document preparation and embassy requirements.'
    },
    {
      step: 5,
      title: 'Student Arrives',
      description: 'Our in-country team coordinates airport pickup and campus transfer.'
    }
  ];

  const pricingTable = [
    { type: 'Type-A', badgeColor: 'bg-amber-100 text-amber-700 border-amber-200', coverage: 'Full Tuition · Hostel · Monthly Stipend', price: '$500' },
    { type: 'Type-B', badgeColor: 'bg-blue-100 text-blue-700 border-blue-200', coverage: 'Full Tuition · Hostel Free', price: '$450' },
    { type: 'Type-C', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200', coverage: 'Tuition Waiver Only', price: '$400' },
    { type: 'Type-D', badgeColor: 'bg-orange-100 text-orange-700 border-orange-200', coverage: 'Partial Scholarship  (50–80% Off)', price: '$300' },
    { type: 'Add-On', badgeColor: 'bg-slate-100 text-slate-700 border-slate-200', coverage: 'Airport Pickup — Per Student (Optional)', price: '$150' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PageHeader
        title="Grow Your"
        highlight="Education Consultancy"
        description="Partner with EduExpress International and expand your student placement business with our global network"
        icon={Handshake}
        badgeText="Global Partner Programme 2026"
      >
        <div className="flex flex-col items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-full text-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/universities'}
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-full text-lg transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10 border border-blue-100"
            >
              <GraduationCap className="w-5 h-5" />
              <span>View Universities</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://calendly.com/eduexpressint/partnership-consultation', '_blank')}
              className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold px-8 py-4 rounded-full text-lg transition-all flex items-center justify-center space-x-2"
            >
              <Headphones className="w-5 h-5" />
              <span>Consultation</span>
            </motion.button>
          </motion.div>

          {/* Success Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full"
          >
            {successStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-center bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{stat.number}</div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </PageHeader>

      {/* Intro Context */}
      <section className="py-16 px-6 bg-white border-b border-slate-100">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            <strong className="text-slate-900">EduExpress International</strong> is a government-licensed educational consultancy with seven years of experience placing international students into China&apos;s leading universities and global institutions worldwide. We refer the student. We deliver the outcome.
          </p>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-24 px-6 bg-slate-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.05)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
              Partnership <span className="text-blue-600">Models</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the partnership model that best fits your education consultancy business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {partnershipTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 hover:border-blue-200 transition-all duration-300 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-200 group-hover:scale-110 transition-transform`}>
                    <type.icon className="w-8 h-8 text-blue-600" />
                  </div>

                  <h3 className="text-2xl font-heading font-bold text-slate-900 mb-4">
                    {type.title}
                  </h3>

                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {type.description}
                  </p>

                  <ul className="space-y-3">
                    {type.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: China Specific Service Charges (Light Theme) */}
      <section className="py-24 px-6 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.05)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-3 py-1 bg-amber-100 border border-amber-200 text-amber-700 rounded-full text-sm font-bold mb-4">
              China Placements
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
              Service Charge <span className="text-amber-500">Structure</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200">
              Unlike Western universities which operate on a commission basis, Chinese Universities <strong className="text-slate-900">do not pay agency commissions</strong>. Instead, charges are determined by the <strong className="text-slate-900">scholarship type secured</strong> and covered by the partner agency. Fees are quoted in <strong>USD</strong> and payment is triggered by JW202 issuance — not before.
            </p>
          </motion.div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">Scholarship Type</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider">Coverage</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-right">Fee (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pricingTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <span className={`inline-block px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide border ${row.badgeColor}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-700 font-medium">
                        {row.coverage}
                      </td>
                      <td className="px-6 py-5 text-right text-xl font-heading font-bold text-slate-900">
                        {row.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 border-t border-amber-100 p-5 text-sm text-amber-800">
              <strong className="text-amber-900 font-bold">Security Note:</strong> The original JW202 will not be dispatched until full service charge payment is confirmed. Upon issuance, we provide your agency with a JW202 screenshot for independent verification — before any payment is requested.
            </div>
          </div>

          {/* Why China Commands Attention Grid integrated into this section */}
          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-10 text-center">
              Why China Commands Attention
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {chinaAdvantages.map((adv, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <adv.icon className="w-8 h-8 text-blue-600 mb-4" />
                  <div className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest mb-3 border ${adv.badgeColor}`}>
                    {adv.badge}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{adv.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{adv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global Benefits Section */}
      <section className="py-24 px-6 bg-slate-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(30,58,138,0.05)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
              Why Partner With <span className="text-blue-600">EduExpress?</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join successful education consultants who have grown their business with our network
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-slate-200 shadow-sm">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>

                <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">
                  {benefit.title}
                </h3>

                <p className="text-slate-600 leading-relaxed mb-4">
                  {benefit.description}
                </p>

                <div className="inline-flex items-center px-3 py-1 bg-blue-100 border border-blue-200 text-blue-700 rounded-full text-sm font-semibold">
                  {benefit.stat}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Process Map */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-8">
                Built For <span className="text-blue-600">Serious Partnerships</span>
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Landmark, title: 'Government Licensed', subtitle: 'DSCC Trade Licence TRAD/005430/2023' },
                  { icon: FileCheck, title: 'Formal MOU', subtitle: 'English-language agreement provided to all' },
                  { icon: DollarSign, title: 'Zero Joining Cost', subtitle: 'No onboarding fee. Pay only per placement.' },
                  { icon: ClipboardCheck, title: 'University Directory', subtitle: 'Full dataset provided to global partners' },
                ].map((requirement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-5 bg-slate-50 rounded-xl shadow-sm border border-slate-200 text-center"
                  >
                    <requirement.icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <div className="font-bold text-slate-900 mb-1">{requirement.title}</div>
                    <span className="text-sm text-slate-600">{requirement.subtitle}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Process */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-8">
                The <span className="text-blue-600">End-to-End Journey</span>
              </h2>

              <div className="space-y-6">
                {process.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-sm">
                      <span className="text-blue-600 font-bold text-lg">{step.step}</span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-heading font-bold text-slate-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partnership Form Section */}
      <section id="partnership-form" className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
              Ready to <span className="text-blue-600">Partner?</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Complete our comprehensive partnership application to get started with EduExpress International.
            </p>
          </motion.div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-xl">
            <PartnershipForm />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Start the <span className="text-amber-400">Conversation</span>
            </h2>

            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              WhatsApp is the fastest route to a response. We&apos;ll share our full university and scholarship directory and walk you through every detail — at your pace.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://wa.me/8801410585926?text=Hello%2C%20I%27m%20interested%20in%20the%20EduExpress%20International%20Global%20Partner%20Programme.', '_blank')}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-full text-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
              >
                <Zap className="w-5 h-5" />
                <span>WhatsApp Us Now</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://calendly.com/eduexpressint/partnership-consultation', '_blank')}
                className="border-2 border-slate-500 text-white hover:bg-slate-800 font-bold px-8 py-4 rounded-full text-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Headphones className="w-5 h-5" />
                <span>Schedule Consultation</span>
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-slate-400"
            >
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span>500+ Active Partners</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-amber-500" />
                <span>Government Licensed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Industry Leader</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PartnershipClient;
