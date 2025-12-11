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
  Zap
} from 'lucide-react';
import PartnershipForm from '@/components/PartnershipForm';
import PageHeader from '@/components/PageHeader';

const PartnershipClient = () => {

  const partnershipTypes = [
    {
      title: 'Authorized Agent',
      description: 'Represent EduExpress in your region with exclusive territory rights',
      features: [
        'Exclusive territory rights',
        'Complete training & support',
        'Marketing materials & leads',
        '15% commission on placements',
        'Priority student support'
      ],
      icon: Shield,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Strategic Partner',
      description: 'Long-term partnership for established education consultancies',
      features: [
        'Joint marketing initiatives',
        'Shared resources & leads',
        'Customized partnership terms',
        '20% commission on placements',
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
        '10% commission on referrals',
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
      description: 'Earn up to 20% commission on successful student placements',
      stat: 'Up to 20% commission'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Access to 500+ universities across 15+ countries',
      stat: '500+ Universities'
    },
    {
      icon: BookOpen,
      title: 'Training & Support',
      description: 'Complete training program and ongoing business support',
      stat: '100% Success Rate'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock support for you and your students',
      stat: 'Instant Response'
    }
  ];

  const successStats = [
    { number: '500+', label: 'Active Partners', icon: Users },
    { number: '50,000+', label: 'Students Placed', icon: BookOpen },
    { number: '95%', label: 'Success Rate', icon: Award },
    { number: '24/7', label: 'Support Available', icon: Headphones }
  ];


  const requirements = [
    'Valid business license or registration',
    '1+ years education consultancy experience',
    'Strong local student network',
    'Ethical business practices & student welfare focus',
    'Basic understanding of study abroad processes',
    'Commitment to student success'
  ];

  const process = [
    {
      step: 1,
      title: 'Apply',
      description: 'Submit your partnership application with business details'
    },
    {
      step: 2,
      title: 'Review',
      description: 'We evaluate your education consultancy experience'
    },
    {
      step: 3,
      title: 'Interview',
      description: 'Virtual discussion about your goals and capabilities'
    },
    {
      step: 4,
      title: 'Training',
      description: 'Complete our partner training program'
    },
    {
      step: 5,
      title: 'Launch',
      description: 'Start referring students and earning commissions'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PageHeader
        title="Grow Your"
        highlight="Education Consultancy"
        description="Partner with EduExpress International and expand your student placement business with our global network"
        icon={Handshake}
        badgeText="B2B Partnership"
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
              className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold px-8 py-4 rounded-full text-lg transition-all"
            >
              Download Brochure
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

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-white relative">
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
              Join successful education consultants who have grown their business with our global network
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8 shadow-sm border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-slate-200 shadow-sm">
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


      {/* Requirements & Process */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-8">
                Partner <span className="text-blue-600">Requirements</span>
              </h2>

              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-slate-200"
                  >
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-slate-700">{requirement}</span>
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
                Partnership <span className="text-blue-600">Process</span>
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
      <section id="partnership-form" className="py-24 px-6 bg-white">
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

          <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-xl">
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
              Ready to <span className="text-amber-400">Grow Your Business?</span>
            </h2>

            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Join EduExpress International and start earning commissions on student placements today
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
                onClick={() => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-full text-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
              >
                <Briefcase className="w-5 h-5" />
                <span>Apply for Partnership</span>
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
                <Zap className="w-5 h-5 text-amber-500" />
                <span>24/7 Support</span>
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
