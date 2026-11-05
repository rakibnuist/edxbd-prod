import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Check, Clock3, MessageCircle, Phone, ShieldCheck } from 'lucide-react';

import HomeLeadForm from '@/components/lead/HomeLeadForm';

type HomeHeroProps = {
  universityCount: number;
  whatsappHref: string;
};

export default function HomeHero({ universityCount, whatsappHref }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden bg-chalk">
      <div className="mx-auto max-w-shell px-4 pb-20 pt-[92px] sm:px-6 sm:pb-24 lg:px-10 lg:pb-28 lg:pt-[136px]">
        <div className="grid gap-5 lg:grid-cols-[1.06fr_0.94fr] lg:items-stretch lg:gap-7">
          {/* Photo panel — the real Dhanmondi counselling room, not a stock scene. */}
          <div className="relative min-h-[480px] overflow-hidden rounded-[20px] bg-petrol-900 sm:min-h-[560px] lg:min-h-[660px]">
            <Image
              src="/images/home/consultation-student-parent.webp"
              alt="EduExpress counsellor meeting a student and parent at the Dhanmondi office in Dhaka"
              fill
              priority
              sizes="(max-width:1024px) 100vw, 660px"
              className="ed-photo-settle object-cover object-[center_42%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-petrol-900 via-petrol-900/90 to-petrol-900/0" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-r from-petrol-900/60 via-petrol-900/10 to-transparent" aria-hidden="true" />

            <div className="relative flex h-full flex-col justify-end p-5 sm:p-8 lg:p-10">
              <span className="ed-chip-dark w-fit">
                <span className="ed-chip-dark-dot" aria-hidden="true" />
                Study abroad · Dhanmondi, Dhaka
              </span>

              <div className="mt-4 overflow-hidden pb-1">
                <h1 className="ed-home-display ed-rise max-w-[13ch] text-[clamp(2.4rem,4.4vw,3.9rem)] text-white">
                  Study abroad, with the costs in writing.
                </h1>
              </div>

              <p className="mt-3 max-w-[44ch] text-[15px] leading-6 text-white/85 sm:mt-4 sm:text-[14px] sm:leading-7">
                Compare universities, tuition, scholarships and visa requirements with a counsellor. You leave with
                the full cost, the documents and the next step in writing.
              </p>

              <ul className="mt-4 grid gap-1.5 sm:mt-5 sm:grid-cols-2 sm:gap-2">
                {[
                  'Written costs, sources and dates',
                  'No service fee before China visa approval',
                  'Parents welcome in every session',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] leading-5 text-white/80 sm:text-[14px]">
                    <span className="mt-0.5 grid size-[17px] shrink-0 place-items-center rounded-full bg-mint-300/20 text-mint-300">
                      <Check size={10} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-2.5">
                <a href="#assessment" className="ed-btn ed-btn-signal min-h-11 px-5 text-[15px] sm:min-h-12 sm:text-[14px]">
                  Get my free assessment <ArrowRight size={15} aria-hidden="true" />
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ed-btn ed-btn-on-dark min-h-11 bg-white/10 px-5 text-[15px] backdrop-blur-sm sm:min-h-12 sm:text-[14px]"
                >
                  <MessageCircle size={15} aria-hidden="true" /> WhatsApp a counsellor
                </a>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/15 pt-3 text-[12px] text-white/65 sm:mt-5 sm:pt-4 sm:text-[13px]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-mint-300" aria-hidden="true" /> {universityCount} university records
                </span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <a href="tel:+8801983333566" className="inline-flex items-center gap-1.5 font-semibold text-white/85 hover:text-white">
                  <Phone size={11} aria-hidden="true" /> 01983-333566
                </a>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={11} aria-hidden="true" /> Sat–Thu, 11:00–18:00
                </span>
              </div>
            </div>
          </div>

          {/* Lead form — white, short, and visible without scrolling past the photo. */}
          <div className="flex flex-col rounded-[20px] border border-rule bg-white p-4 shadow-lift sm:p-6 lg:p-7">
            <div id="assessment" className="scroll-mt-28 sm:scroll-mt-32">
              <HomeLeadForm whatsappHref={whatsappHref} embedded />
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-ink-soft">
              <BadgeCheck size={12} className="text-jade" aria-hidden="true" />
              Free assessment · no payment details requested
            </p>
            <p className="mt-2 text-center text-[12px] leading-5 text-ink-mute">
              Your details are used only to review your enquiry. Read the{' '}
              <Link href="/privacy" className="font-semibold text-petrol-700 underline underline-offset-2">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
