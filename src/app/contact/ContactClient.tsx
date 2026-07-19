'use client';

import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar, Send, Fingerprint } from 'lucide-react';
import EnhancedContactForm from '@/components/EnhancedContactForm';
import PageHeader from '@/components/PageHeader';

export default function ContactClient() {
  return (
    <div className="overflow-hidden bg-[#f4f8fa] text-[#08263c] font-sans">
      {/* Homepage Hero Header Style */}
      <section className="relative px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 md:pt-40 lg:px-12 border-b border-[#174f7a]/15">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(23,79,122,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,79,122,0.07)_1px,transparent_1px)] bg-[size:76px_76px]" />
        <div className="pointer-events-none absolute right-[4%] top-28 size-72 rounded-full border-[44px] border-[#64b5df]/15 md:size-[460px]" />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#174f7a]/25 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#174f7a]">
            <span>EduExpress International Bangladesh</span>
            <span>Dhanmondi Decision Desk</span>
            <span>Direct WhatsApp & In-Person</span>
          </div>

          <div className="max-w-4xl">
            <p className="flex w-full max-w-full items-start gap-3 bg-[#174f7a] px-4 py-2 text-[11px] font-black uppercase leading-5 tracking-[0.16em] text-white sm:inline-flex sm:w-auto sm:items-center sm:text-xs sm:tracking-[0.2em]">
              <Fingerprint className="mt-0.5 shrink-0 text-[#8ed0ee] sm:mt-0" size={16} />
              <span className="min-w-0 whitespace-normal">Decision Desk Open in Dhanmondi</span>
            </p>

            <h1 className="mt-7 w-full max-w-4xl break-words text-balance font-heading text-[clamp(2.4rem,5.6vw,4.2rem)] font-bold leading-[1.06] tracking-[-0.022em]">
              Speak directly with our <span className="relative mt-2 inline-block bg-[#64b5df] px-2 pb-2 text-[#08263c] sm:px-3 sm:pb-3">Dhaka counseling desk</span>
            </h1>

            <p className="mt-7 max-w-2xl border-l-4 border-[#64b5df] pl-5 text-base leading-7 text-slate-700 md:text-lg md:leading-8">
              Visit our licensed Dhanmondi office or send us your academic details to receive a free, written Education Fit Assessment and ClearCost schedule.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Options */}
      <section className="py-16 bg-white border-b border-[#174f7a]/15">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Direct Access Channels</p>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-bold text-[#08263c]">How Would You Like to Connect?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* WhatsApp Option */}
            <div className="bg-[#f4f8fa] border-2 border-[#08263c] p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#174f7a]">
              <div className="w-12 h-12 bg-[#e9f7fd] border border-[#174f7a]/20 flex items-center justify-center mx-auto mb-4 text-[#174f7a]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#08263c] mb-2">WhatsApp Direct</h3>
              <p className="text-slate-600 text-xs leading-5 mb-6">Connect directly with our senior counseling team</p>
              <a
                href="https://wa.me/8801983333566?text=Hi!%20I'm%20interested%20in%20study%20abroad%20consultation.%20Can%20you%20help%20me?"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#08263c] hover:bg-[#174f7a] text-white py-3.5 font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center shadow-[3px_3px_0_0_#64b5df]"
              >
                Start WhatsApp Chat
              </a>
            </div>

            {/* Book Appointment Option */}
            <div className="bg-[#f4f8fa] border-2 border-[#08263c] p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#174f7a]">
              <div className="w-12 h-12 bg-[#e9f7fd] border border-[#174f7a]/20 flex items-center justify-center mx-auto mb-4 text-[#174f7a]">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#08263c] mb-2">Fit Assessment</h3>
              <p className="text-slate-600 text-xs leading-5 mb-6">Request a written education decision summary</p>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openQuickForm'));
                }}
                className="w-full bg-[#64b5df] hover:bg-white text-[#08263c] py-3.5 font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center shadow-[3px_3px_0_0_#174f7a]"
              >
                Request Assessment
              </button>
            </div>

            {/* Contact Form Option */}
            <div className="bg-[#f4f8fa] border-2 border-[#08263c] p-6 sm:p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#174f7a]">
              <div className="w-12 h-12 bg-[#e9f7fd] border border-[#174f7a]/20 flex items-center justify-center mx-auto mb-4 text-[#174f7a]">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#08263c] mb-2">Written Inquiry</h3>
              <p className="text-slate-600 text-xs leading-5 mb-6">Send your detailed academic requirement</p>
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-[#08263c] hover:bg-[#174f7a] text-white py-3.5 font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center shadow-[3px_3px_0_0_#64b5df]"
              >
                Fill Inquiry Form
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Office Information & Map */}
      <section className="py-16 bg-[#f4f8fa] border-b border-[#174f7a]/15">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#174f7a]">Dhanmondi Location</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-[#08263c]">Visit Our Office</h2>
            <p className="text-base text-slate-600 mt-2">House 12/1, Ground Floor, Road 4/A, Dhanmondi, Dhaka 1209</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Office Information */}
            <div className="space-y-6">
              <div className="bg-white border-2 border-[#08263c] p-8 shadow-sm">
                <h3 className="font-heading text-xl font-bold text-[#08263c] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#174f7a]" />
                  Main Decision Desk
                </h3>
                <div className="space-y-2 text-slate-700">
                  <p className="font-heading text-lg font-bold text-[#08263c]">EduExpress International</p>
                  <p className="text-sm">House 12/1, Ground Floor, Road 4/A</p>
                  <p className="text-sm">Dhanmondi, Dhaka 1209, Bangladesh</p>
                  <p className="font-mono text-xs font-bold text-[#174f7a] mt-2">DSCC Trade Licence TRAD/005430/2023</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-[#08263c] p-6 shadow-sm">
                  <Phone className="w-6 h-6 text-[#174f7a] mb-3" />
                  <h4 className="font-mono text-[10px] font-black uppercase tracking-wider text-[#174f7a] mb-1">Phone Numbers</h4>
                  <a href="tel:+8801983333566" className="block text-sm font-bold text-[#08263c] hover:text-[#174f7a]">+880 1983-333566</a>
                  <a href="tel:+8801329663505" className="mt-1 block text-sm font-bold text-[#08263c] hover:text-[#174f7a]">+880 1329-663505</a>
                </div>

                <div className="bg-white border-2 border-[#08263c] p-6 shadow-sm">
                  <Mail className="w-6 h-6 text-[#174f7a] mb-3" />
                  <h4 className="font-mono text-[10px] font-black uppercase tracking-wider text-[#174f7a] mb-1">Email Inquiry</h4>
                  <p className="text-sm font-bold text-[#08263c]">info@eduexpressint.com</p>
                </div>
              </div>

              <div className="bg-white border-2 border-[#08263c] p-6 shadow-sm">
                <Clock className="w-6 h-6 text-[#174f7a] mb-3" />
                <h4 className="font-mono text-[10px] font-black uppercase tracking-wider text-[#174f7a] mb-1">Office Hours</h4>
                <p className="text-sm font-bold text-[#08263c]">Saturday-Thursday 11:00 AM-6:00 PM, Friday closed</p>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white border-2 border-[#08263c] p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-[#08263c] mb-4">Location Map</h3>
              <div className="border border-[#174f7a]/20 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.202884783131!2d90.37130087596677!3d23.740143478677417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9fd0e50740f%3A0x5a73c108d952b70!2sEduExpress%20International!5e0!3m2!1sen!2sbd!4v1759446242229!5m2!1sen!2sbd"
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="EduExpress International Location"
                ></iframe>
              </div>
              <p className="font-mono text-[10px] font-bold text-slate-500 mt-3 text-center uppercase tracking-wider">
                House 12/1, Ground Floor, Road 4/A, Dhanmondi, Dhaka 1209
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-16 bg-white border-b border-[#174f7a]/15">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <EnhancedContactForm
              formType="contact"
              source="contact_page"
              title="Send Us a Message"
              description="Tell us about your study abroad goals and we'll help you achieve them with written proof"
              showCountry={true}
              showProgram={false}
              showMessage={true}
              showLocation={false}
              className="bg-[#f4f8fa] border-2 border-[#08263c] p-6 sm:p-8 shadow-[8px_8px_0_0_#174f7a]"
            />
          </div>
        </div>
      </section>

      {/* Bring 01-03 CTA Banner */}
      <section className="bg-[#64b5df] px-5 py-16 text-[#08263c] sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#174f7a]">Preparing for your visit</p>
            <h2 className="mt-4 max-w-4xl font-heading text-3xl font-bold leading-tight tracking-tight md:text-5xl">What to bring to your consultation</h2>
          </div>
          <div className="mt-10 grid border-l border-t border-[#08263c]/35 sm:grid-cols-3">
            {[
              ['01', 'Academic record', 'Your latest SSC/HSC or Bachelor transcripts'],
              ['02', 'Subject direction', 'The program or career area you want to explore'],
              ['03', 'Budget reality', 'A practical range for tuition and living costs']
            ].map(([number, title, copy]) => (
              <div key={number} className="border-b border-r border-[#08263c]/35 p-5 sm:p-6">
                <span className="font-mono text-[10px] font-black text-[#174f7a]">BRING {number}</span>
                <h3 className="mt-3 font-heading text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#0b2f4a]/70">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
