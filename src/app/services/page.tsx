import { Metadata } from 'next';
import Link from 'next/link';
import ConsultationButton from '@/components/ConsultationButton';
import PageHeader from '@/components/PageHeader';
import { Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Study Abroad Services | University Selection, Visa & Scholarship Support',
  description: 'Expert study abroad services including university selection, visa assistance, scholarship support, and career guidance since 2018. 95% success rate with 300+ partner universities worldwide.',
  keywords: [
    'study abroad services',
    'university selection',
    'visa assistance',
    'scholarship support',
    'career guidance',
    'study abroad consultancy',
    'international education',
    'student visa',
    'university application',
    'education consultant'
  ],
  openGraph: {
    title: 'Study Abroad Services | Expert Guidance for International Education',
    description: 'Comprehensive study abroad solutions with 95% success rate since 2018. Expert guidance for university selection, visa assistance, and scholarship support.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.eduexpressint.com/services',
  },
};

export default function ServicesPage() {
  const mainServices = [
    {
      title: 'University Selection & Applications',
      description: 'Expert guidance to choose the perfect university and program for your academic goals and career aspirations.',
      features: [
        'Personalized university matching',
        'Program selection guidance',
        'Application form assistance',
        'Document preparation support',
        'Admission interview preparation'
      ],
      icon: '🎓',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Visa Assistance',
      description: 'Complete visa processing support with high success rates and personalized guidance for all study destinations.',
      features: [
        'Visa application preparation',
        'Document verification',
        'Interview coaching',
        'Appeal support if needed',
        '95% success rate'
      ],
      icon: '📋',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Scholarship Support',
      description: 'Access to exclusive scholarships and financial aid opportunities worldwide to make your education affordable.',
      features: [
        'Scholarship research & matching',
        'Application assistance',
        'Essay writing support',
        'Merit-based opportunities',
        'Need-based financial aid'
      ],
      icon: '💰',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Career Guidance',
      description: 'Post-graduation career support and job placement assistance to help you succeed in your chosen field.',
      features: [
        'Career counseling sessions',
        'Resume & CV optimization',
        'Interview preparation',
        'Job placement assistance',
        'Industry networking'
      ],
      icon: '🚀',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const additionalServices = [
    {
      title: 'Destination Counseling',
      description: 'Comprehensive guidance on choosing the right study destination based on your preferences, budget, and career goals.',
      icon: '🌍'
    },
    {
      title: 'Documentation Support',
      description: 'Complete assistance with document preparation, attestation, and submission for university and visa applications.',
      icon: '📄'
    },
    {
      title: 'Pre-departure Orientation',
      description: 'Essential information and training to help you prepare for life in your new study destination.',
      icon: '✈️'
    },
    {
      title: 'Progress Tracking',
      description: 'Regular updates and monitoring of your application status throughout the entire process.',
      icon: '📊'
    }
  ];

  const processSteps = [
    {
      step: '1',
      title: 'Initial Consultation',
      description: 'Free assessment of your academic background, goals, and preferences'
    },
    {
      step: '2',
      title: 'Service Selection',
      description: 'Choose the services that best fit your needs and budget'
    },
    {
      step: '3',
      title: 'Documentation',
      description: 'Gather and prepare all required documents with our guidance'
    },
    {
      step: '4',
      title: 'Application Submission',
      description: 'Submit applications to universities and visa offices'
    },
    {
      step: '5',
      title: 'Follow-up & Support',
      description: 'Continuous support until you arrive at your destination'
    }
  ];

  const whyChooseUs = [
    {
      title: 'Expert Team',
      description: 'Our experienced counselors have helped thousands of students achieve their study abroad dreams.',
      icon: '👥'
    },
    {
      title: 'Proven Success',
      description: '95% visa success rate and 500+ partner universities worldwide ensure your success.',
      icon: '🏆'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock assistance and guidance throughout your entire journey.',
      icon: '🕐'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Our"
        highlight="Services"
        description="Comprehensive study abroad solutions designed to make your international education journey seamless and successful. Trusted since 2018 with 6+ years of proven experience."
        icon={<Briefcase />}
        badgeText="Expert Educational Services"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ConsultationButton
            text="Get Free Consultation"
            source="services_page_hero_consultation"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          />
          <Link
            href="/destinations"
            className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1"
          >
            Explore Destinations
          </Link>
        </div>
      </PageHeader>

      {/* Main Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From university selection to career guidance, we&apos;re with you every step of the way. 6+ years of experience since 2018.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mainServices.map((service, index) => (
              <article key={index} className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-500 transform hover:-translate-y-2">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Additional Support</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive support services to ensure your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Simple Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make your study abroad journey simple with our proven 5-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 transform translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose EduExpress?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of students worldwide since 2018.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Get a free consultation with our expert counselors and take the first step towards your international education. 6+ years of proven experience since 2018.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationButton
              text="Get Free Consultation"
              source="services_page_cta_consultation"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            />
            <Link
              href="/destinations"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
