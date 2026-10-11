// Approved trust signals (see eduexpress-seo-strategy). Reused across pages so
// the promise reads consistently everywhere. Keep wording verbatim.
const SIGNALS = [
  'No file-opening charge for China',
  'No EduExpress service fee before China visa approval',
  'Written cost breakdown',
  'Verified information',
];

export default function TrustStrip({ className = '' }: { className?: string }) {
  return (
    <section
      className={`border-y border-[#0a1f33] bg-[#0a1f33] text-white ${className}`}
      aria-label="Our written service commitments"
    >
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <ul className="grid divide-y divide-white/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {SIGNALS.map((text, index) => (
            <li
              key={text}
              className="flex items-start gap-4 py-5 lg:border-l lg:border-white/15 lg:py-6 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="ed-label mt-1 shrink-0 text-[#9ecdf0]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-semibold leading-6 text-white/90">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
