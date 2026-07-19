import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ArrowRight, ShieldCheck, Map, CheckCircle2 } from 'lucide-react';
import { generateLocalBusinessStructuredData } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: 'Education Consultant in Dhanmondi, Dhaka | EduExpress International',
  description: 'Visit EduExpress International in Dhanmondi, Dhaka for evidence-first overseas education guidance. We offer free Education Fit Assessments and verified university comparisons.',
  alternates: {
    canonical: '/education-consultant-dhaka',
  },
};

export default function EducationConsultantDhakaPage() {
  const localSchema = generateLocalBusinessStructuredData();

  return (
    <main className="bg-slate-50 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />
      
      {/* Hero Section */}
      <section className="bg-slate-950 px-5 pt-28 pb-20 text-white sm:px-8 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(100,181,223,0.15)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="mx-auto max-w-5xl relative z-10 text-center">
          <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-[#64b5df] flex items-center justify-center gap-2">
            <MapPin size={18} /> EduExpress International Bangladesh
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl mb-6">
            Dhanmondi&apos;s Most Transparent <br className="hidden md:block"/> Education Consultant
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
            Compare education quality, total cost, recognition, and career fit before choosing an overseas study route. Written proof over empty promises.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/contact?service=education-fit-assessment"
              className="bg-[#64b5df] text-slate-950 px-8 py-4 rounded-xl font-bold hover:bg-[#8ed0ee] transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Book an Appointment <ArrowRight size={18} />
            </Link>
            <a 
              href="tel:+8801983333566"
              className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center backdrop-blur-sm border border-white/10"
            >
              <Phone size={18} /> Call Now
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        
        {/* Main Content Area */}
        <div className="space-y-12">
          
          {/* Proof & Process */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-700">
                <ShieldCheck size={24} />
              </span>
              <h2 className="text-3xl font-bold text-slate-900">The Evidence-First Process</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We don&apos;t just sell destinations. We assess your academic profile, budget, and career goals to provide an <strong>Education Fit Assessment</strong>. Every recommendation comes with a ClearCost Sheet separating tuition from service fees, and an Application Proof Pack.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "No hidden charges", desc: "All third-party fees and our service charges are itemized in writing." },
                { title: "Visa-First China Policy", desc: "No EduExpress service fee before China visa approval." },
                { title: "Verified Universities", desc: "We check official recognition, tuition, and intake status directly." },
                { title: "Student Data Privacy", desc: "Your sensitive documents are secure and handled with consent." },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <CheckCircle2 className="text-emerald-500 mb-3" size={24} />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Location Map section full width on mobile, inline on desktop */}
          <section className="bg-white p-2 rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
             <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.202884783131!2d90.37130087596677!3d23.740143478677417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9fd0e50740f%3A0x5a73c108d952b70!2sEduExpress%20International!5e0!3m2!1sen!2sbd!4v1759446242229!5m2!1sen!2sbd"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: '1.5rem' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="EduExpress International Dhanmondi Location"
              ></iframe>
          </section>
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl sticky top-24">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Map size={20} className="text-[#64b5df]" /> 
              Office Information
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="text-[#64b5df] shrink-0 mt-1" size={20} />
                <div>
                  <strong className="block text-white mb-1">Visit Us</strong>
                  <span className="text-slate-300 leading-relaxed block">
                    House 12/1, Ground Floor<br/>
                    Road 4/A, Dhanmondi<br/>
                    Dhaka 1209
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Phone className="text-[#64b5df] shrink-0 mt-1" size={20} />
                <div>
                  <strong className="block text-white mb-1">Call Us</strong>
                  <a href="tel:+8801983333566" className="block text-slate-300 hover:text-white transition-colors">+880 1983-333566</a>
                  <a href="tel:+8801329663505" className="block text-slate-300 hover:text-white transition-colors mt-1">+880 1329-663505</a>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="text-[#64b5df] shrink-0 mt-1" size={20} />
                <div>
                  <strong className="block text-white mb-1">Email Us</strong>
                  <a href="mailto:info@eduexpressint.com" className="text-slate-300 hover:text-white transition-colors">info@eduexpressint.com</a>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="text-[#64b5df] shrink-0 mt-1" size={20} />
                <div>
                  <strong className="block text-white mb-1">Business Hours</strong>
                  <div className="text-slate-300 space-y-1">
                    <p>Saturday - Thursday:</p>
                    <p className="font-semibold text-white">11:00 AM - 6:00 PM</p>
                    <p className="text-red-400 mt-2">Friday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-800 my-8" />
            
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-4">Ready to start your journey?</p>
              <Link 
                href="/contact?service=education-fit-assessment"
                className="bg-[#64b5df] text-slate-950 px-6 py-3 rounded-xl font-bold hover:bg-[#8ed0ee] transition-colors inline-block w-full"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}
