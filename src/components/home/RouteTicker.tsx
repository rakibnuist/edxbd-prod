import { Plane } from 'lucide-react';

const stops = ['Dhaka', 'Kunming', 'Beijing', 'Shanghai', 'Guangzhou', 'Wuhan', 'Shenyang', 'Chengdu'];

export default function RouteTicker() {
  const row = [...stops, ...stops];

  return (
    <section aria-label="Study destinations on the China route" className="border-b border-petrol-800 bg-petrol-900 py-3 text-white">
      <div className="home-ticker">
        <div className="home-ticker-track items-center">
          {row.map((city, index) => (
            <span
              key={`${city}-${index}`}
              className="flex items-center"
              aria-hidden={index >= stops.length ? 'true' : undefined}
            >
              <span className={`px-4 text-[13px] font-semibold uppercase tracking-[0.16em] ${index % 4 === 0 ? 'font-semibold text-mint-300' : 'text-white/65'}`}>
                {city}
              </span>
              <Plane size={12} className="rotate-45 text-marigold" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
