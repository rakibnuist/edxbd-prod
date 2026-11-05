import Image from 'next/image';
import { ArrowRight, CheckCircle2, Clock, FileText, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import EnhancedContactForm from '@/components/EnhancedContactForm';
import { CtaBand, JsonLd, PageHero, Section, TrustBar, kit } from '@/components/page/PageKit';
import { config } from '@/lib/config';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { ogImage, pageMetadata } from '@/lib/seo';
import { getPublicTrustRecords } from '@/lib/trust-records';
import PaymentRules from './PaymentRules';

const PATH = '/contact';

export const metadata = pageMetadata({
  title: 'Contact EduExpress | Study Abroad Office in Dhanmondi',
  description:
    'Call, WhatsApp or visit EduExpress in Dhanmondi, Dhaka, Saturday to Thursday. Parents welcome. Costs in writing, no service fee before China visa approval.',
  path: PATH,
  image: ogImage('contact', 'A counsellor meeting a student and a family member at the EduExpress office'),
});

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://eduexpressint.com/contact#webpage',
  url: 'https://eduexpressint.com/contact',
  name: 'Contact EduExpress International',
  description: 'Phone, WhatsApp, email and the Dhanmondi office address and hours for EduExpress International.',
  inLanguage: 'en-BD',
  about: { '@id': 'https://eduexpressint.com/#organization' },
  isPartOf: { '@id': 'https://eduexpressint.com/#website' },
  breadcrumb: { '@id': 'https://eduexpressint.com/contact#breadcrumb' },
};

const bringList = ['Latest academic results', 'Preferred subject or career area', 'Family budget range', 'Questions about recognition or safety'];


export default async function ContactPage() {
  const { offices } = await getPublicTrustRecords();
  const office = offices[0];
  const phone = office?.phonePrimary ?? config.contact.phone;
  const email = office?.email ?? config.contact.email;
  const whatsappNumber = (office?.phonePrimary ?? config.contact.whatsapp).replace(/\D/g, '');
  const whatsapp = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, I would like help comparing suitable study options and complete costs.')}`;

  const channels = [
    { icon: MessageCircle, title: 'WhatsApp', text: 'Send your first question directly.', cta: 'Start chat', href: whatsapp, external: true, tone: kit.cardLime },
    { icon: Phone, title: 'Call', text: formatBangladeshPhone(phone), cta: 'Call the office', href: `tel:${phone.replace(/[^\d+]/g, '')}`, tone: kit.cardSage },
    { icon: Mail, title: 'Email', text: email, cta: 'Write an email', href: `mailto:${email}`, tone: kit.cardSage },
    { icon: FileText, title: 'Online form', text: 'Share details in your own time.', cta: 'Open the form', href: '#contact-form', tone: kit.cardSage },
  ];

  return (
    <>
      <JsonLd data={structuredData} />

      <PageHero
        path={PATH}
        trail={[{ name: 'Contact' }]}
        eyebrow="Dhanmondi, Dhaka · Parents welcome"
        title="Contact EduExpress International."
        lead="Bring your questions and leave with a clearer next step. Ask about education fit, university options, complete costs, scholarship conditions or application readiness."
        actions={
          <>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-signal min-h-[52px] px-7">
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp a counsellor
            </a>
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="ed-btn ed-btn-outline min-h-[52px] px-7">
              <Phone size={18} aria-hidden="true" /> Call {formatBangladeshPhone(phone)}
            </a>
          </>
        }
        aside={
          office && (
            <article className="overflow-hidden rounded-3xl bg-white">
              {office.photoUrl && (
                <div className="relative aspect-[16/9]">
                  <Image
                    src={office.photoUrl}
                    alt="Reception of the EduExpress office in Dhanmondi, Dhaka"
                    fill
                    priority
                    sizes="(max-width:1024px) 100vw, 480px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6 sm:p-7">
                <p className={kit.badge}>Published office record</p>
                <h2 className="mt-4 text-[22px] font-semibold leading-snug tracking-[-0.02em] text-petrol-800">{office.name}</h2>
                <ul className="mt-5 space-y-3.5 text-[16px] leading-6 text-ink-soft">
                  <li className="flex gap-3"><MapPin size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" /><span>{office.address}</span></li>
                  <li className="flex gap-3"><Clock size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" /><span>{office.hours}</span></li>
                  <li className="flex gap-3">
                    <Phone size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
                    <span>
                      <a href={`tel:${office.phonePrimary}`} className="font-semibold text-petrol-800 hover:underline">{formatBangladeshPhone(office.phonePrimary)}</a>
                      {office.phoneSecondary && (
                        <>
                          {' · '}
                          <a href={`tel:${office.phoneSecondary}`} className="font-semibold text-petrol-800 hover:underline">{formatBangladeshPhone(office.phoneSecondary)}</a>
                        </>
                      )}
                    </span>
                  </li>
                  {office.email && (
                    <li className="flex gap-3"><Mail size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" /><a href={`mailto:${office.email}`} className="break-all hover:underline">{office.email}</a></li>
                  )}
                </ul>
                {office.mapUrl && (
                  <a href={office.mapUrl} target="_blank" rel="noopener noreferrer" className="ed-btn ed-btn-soft mt-6 min-h-[48px] w-full px-6">
                    Open in Google Maps <ArrowRight size={16} aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          )
        }
      />

      <TrustBar />

      <Section title="Choose how to reach us." intro="Every channel reaches the same counselling desk in Dhanmondi. Use whichever is easiest for your family.">
        <ul data-anim="stagger" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(item => (
            <li key={item.title}>
              <a
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={`${item.tone} group flex h-full flex-col transition hover:-translate-y-1`}
              >
                <span className={kit.icon}><item.icon size={22} aria-hidden="true" /></span>
                <h3 className={`mt-6 ${kit.h3}`}>{item.title}</h3>
                <p className="mt-1 break-words text-[16px] leading-7 text-ink-soft">{item.text}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[16px] font-semibold text-petrol-800">
                  {item.cta} <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sage" id="contact-form">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-14">
          <div data-anim="up">
            <h2 className={kit.h2}>No pressure to apply.</h2>
            <p className={`mt-5 ${kit.lead}`}>
              The first conversation is for understanding your profile and questions. A counsellor reviews your message and contacts you about the next step.
            </p>
            <div className={`mt-8 ${kit.card}`}>
              <h3 className={kit.h3}>Useful to have ready</h3>
              <ul className="mt-4 space-y-3">
                {bringList.map(item => (
                  <li key={item} className="flex items-start gap-3 text-[16px] leading-6 text-ink-soft">
                    <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-canvas-soft pt-4 text-[15px] leading-6 text-ink-soft">No university choice is required before the conversation.</p>
            </div>
          </div>
          <EnhancedContactForm
            formType="contact"
            source="contact_page"
            title="Tell us what you need"
            description="A counselor will review your message and contact you about the next step."
            showCountry
            showProgram={false}
            showMessage
            showLocation={false}
            className="rounded-3xl bg-white p-6 sm:p-9"
          />
        </div>
      </Section>

      <PaymentRules />

      <CtaBand
        title="Not ready to contact us?"
        text="Use the free assessment to organise your subject, budget and destination questions first. A counsellor can pick up from there whenever you are ready."
      />
    </>
  );
}
