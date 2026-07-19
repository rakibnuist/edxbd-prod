import Link from 'next/link';
import { Quote, Star, ArrowUpRight } from 'lucide-react';

export type HomeTestimonial = {
  id: string;
  studentName: string;
  content: string;
  university: string | null;
  country: string | null;
  rating: number;
};

export default function HomeTestimonials({ testimonials }: { testimonials: HomeTestimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <section className="bg-white px-5 py-16 text-[#08263c] sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#174f7a]">
              Consent-based student outcomes
            </p>
            <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Real students. Written proof. Their words.
            </h2>
          </div>
          <Link
            href="/success-stories"
            className="inline-flex items-center gap-2 border-b-2 border-[#174f7a] pb-1 text-sm font-bold text-[#174f7a] transition hover:gap-3"
          >
            Read all success stories <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex flex-col border border-[#174f7a]/15 bg-[#f4f8fa] p-6 transition hover:border-[#174f7a]/40 hover:shadow-[8px_8px_0_0_#e9f7fd]"
            >
              <div className="mb-4 flex items-center justify-between">
                <Quote className="text-[#64b5df]" size={28} />
                <div className="flex gap-0.5" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={i < t.rating ? 'fill-[#f5b301] text-[#f5b301]' : 'text-[#174f7a]/20'}
                    />
                  ))}
                </div>
              </div>
              <blockquote className="flex-1 text-sm leading-6 text-[#0b2f4a]/85">
                “{t.content.length > 260 ? `${t.content.slice(0, 257)}…` : t.content}”
              </blockquote>
              <figcaption className="mt-5 border-t border-[#174f7a]/15 pt-4">
                <div className="font-heading text-base font-bold">{t.studentName}</div>
                <div className="mt-0.5 text-xs font-medium text-[#174f7a]">
                  {[t.university, t.country].filter(Boolean).join(' · ')}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
