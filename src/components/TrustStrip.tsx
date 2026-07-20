import { CircleDollarSign, ShieldCheck, FileCheck2, BadgeCheck } from 'lucide-react';

// Approved trust signals (see eduexpress-seo-strategy). Reused across pages so
// the promise reads consistently everywhere. Keep wording verbatim.
const SIGNALS = [
  { icon: CircleDollarSign, text: 'No file-opening charge for China' },
  { icon: ShieldCheck, text: 'No EduExpress service fee before China visa approval' },
  { icon: FileCheck2, text: 'Written cost breakdown' },
  { icon: BadgeCheck, text: 'Verified information' },
];

export default function TrustStrip({ className = '' }: { className?: string }) {
  return (
    <section className={`border-y border-[#174f7a]/15 bg-[#08263c] text-white ${className}`} aria-label="Our guarantees">
      <div className="mx-auto grid max-w-[1440px] gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {SIGNALS.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-start gap-3 bg-[#08263c] px-5 py-4 lg:px-6 lg:py-5">
            <Icon size={20} className="mt-0.5 shrink-0 text-[#64b5df]" />
            <span className="text-sm font-semibold leading-5 text-white/90">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
