import Link from 'next/link';
import { ArrowRight, Building2, ShieldCheck } from 'lucide-react';
import { B2B_SERVICE_TRACKS, B2B_SLAS } from '@/lib/b2b-catalog';

type B2BHomeBannerProps = {
  containerClassName?: string;
};

export default function B2BHomeBanner({
  containerClassName = 'mx-auto max-w-[1200px] px-5 sm:px-8',
}: B2BHomeBannerProps) {
  const bannerSlas = B2B_SLAS.slice(0, 3);

  return (
    <section id="b2b-partner-desk" aria-labelledby="b2b-home-heading" className="pb-20 lg:pb-24">
      <div className={containerClassName}>
        <div className="overflow-hidden rounded-3xl bg-petrol-800 p-6 text-white shadow-[0_24px_60px_rgba(15,58,92,0.16)] sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full bg-lime px-3.5 py-1 text-[13px] font-extrabold text-petrol-800">
                  <Building2 size={14} aria-hidden="true" />
                  B2B Agency &amp; Institutional Desk
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[13px] font-semibold text-white/90">
                  <ShieldCheck size={14} className="text-lime" aria-hidden="true" />
                  Written non-poaching protection
                </span>
              </div>

              <h2
                id="b2b-home-heading"
                data-anim="up"
                className="mt-5 font-display text-[34px] font-black leading-[0.98] tracking-[-0.015em] text-white sm:text-[46px]"
              >
                Partner desk for <span className="text-lime">study abroad agencies &amp; sub-agents.</span>
              </h2>

              <p className="mt-4 max-w-xl text-[17px] leading-[1.6] text-white/85">
                Submit student files across China, Malaysia, and our active destination desks through one verified B2B
                channel — with 24–48 hour file audits, timestamped portal IDs, and bilateral MOU terms agreed in writing.
              </p>

              <dl className="mt-6 grid grid-cols-1 gap-3.5 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10 sm:grid-cols-3 sm:gap-4 sm:p-5">
                {bannerSlas.map((sla, index) => (
                  <div key={sla.label} className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-white/70">
                      {sla.label}
                    </dt>
                    <dd
                      className={`mt-1 font-display text-[22px] font-black leading-tight sm:text-[23px] ${
                        index === 1 ? 'text-lime' : 'text-white'
                      }`}
                    >
                      {sla.metric}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/b2b" className="ed-btn ed-btn-signal min-h-[52px] px-7">
                  Explore B2B Services <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link href="/b2b#b2b-inquiry" className="ed-btn ed-btn-on-dark min-h-[52px] px-7">
                  Submit Partner Inquiry
                </Link>
              </div>
            </div>

            <div className="min-w-0 rounded-3xl bg-white p-6 text-petrol-800 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#2c6a97]">Dedicated Agency Channels</p>
                  <h3 className="mt-0.5 text-[20px] font-bold leading-snug text-petrol-800">
                    Four structured B2B desks
                  </h3>
                </div>
                <span className="shrink-0 rounded-full bg-lime-pale px-3 py-1 text-xs font-bold text-lime-deep">
                  MOU Terms
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {B2B_SERVICE_TRACKS.map(track => (
                  <Link
                    key={track.id}
                    href="/b2b#b2b-tracks"
                    className="group flex min-w-0 flex-col justify-between rounded-2xl border border-slate-200/90 bg-canvas-soft/60 p-3.5 transition hover:-translate-y-0.5 hover:border-petrol-800 hover:bg-white hover:shadow-sm"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="shrink-0 text-[11px] font-extrabold uppercase tracking-wider text-[#2c6a97]">
                          Track {track.number}
                        </span>
                        <span className="max-w-full rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold leading-tight text-petrol-800 ring-1 ring-slate-200">
                          {track.turnaround}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[14.5px] font-bold leading-snug text-petrol-800">{track.title}</p>
                      <p className="mt-1 text-[12.5px] leading-5 text-ink-soft">{track.deliverables[0]}</p>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-petrol-800 group-hover:underline">
                      View desk details <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-canvas-soft px-4 py-3 text-xs font-semibold text-petrol-800">
                <span>Need China Type-A / Type-B / Type-C partner terms?</span>
                <Link href="/partnership#china-partner-terms" className="font-bold underline underline-offset-4">
                  View USD schedule →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
