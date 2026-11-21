import { ArrowRight, Clock, Compass, MapPin, Navigation, Phone } from 'lucide-react';
import { formatBangladeshPhone } from '@/lib/contact-format';
import { DEFAULT_OFFICE_LATITUDE, DEFAULT_OFFICE_LONGITUDE } from '@/lib/office-location';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';
import { toSafeSitePathOrUrl } from '@/lib/safe-url';

type OfficeInput = {
  name?: string | null;
  address?: string | null;
  hours?: string | null;
  phonePrimary?: string | null;
  phoneSecondary?: string | null;
  mapUrl?: string | null;
};

const EMBED_MAP_URL = `https://maps.google.com/maps?q=${DEFAULT_OFFICE_LATITUDE},${DEFAULT_OFFICE_LONGITUDE}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

const DHANMONDI_DIRECTIONS = [
  'Ground Floor of Evergreen Latif (House 12/1, Road 4/A), off Satmasjid Road & Dhanmondi 4/A.',
  'Easy 3–6 minute access from Science Lab, Jigatola, Kalabagan, and LabAid Hospital junctions.',
  'Serving in-person walk-ins across Dhanmondi, Lalmatia, Mohammadpur, Mirpur, Uttara, Banani, Gulshan, and nationwide online.',
] as const;

export default function DhanmondiMapCard({
  office,
  heading = 'Find our Dhanmondi, Dhaka office on Google Maps',
}: {
  office?: OfficeInput | null;
  heading?: string;
}) {
  const name = office?.name || DEFAULT_OFFICE_RECORD.name;
  const address = office?.address || DEFAULT_OFFICE_RECORD.address;
  const hours = office?.hours || DEFAULT_OFFICE_RECORD.hours;
  const primaryPhone = office?.phonePrimary || DEFAULT_OFFICE_RECORD.phonePrimary;
  const secondaryPhone = office?.phoneSecondary || DEFAULT_OFFICE_RECORD.phoneSecondary;
  const directionsHref = toSafeSitePathOrUrl(office?.mapUrl || DEFAULT_OFFICE_RECORD.mapUrl) || DEFAULT_OFFICE_RECORD.mapUrl;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-stretch">
      <div className="overflow-hidden rounded-3xl border border-petrol-800/10 bg-white shadow-sm">
        <iframe
          src={EMBED_MAP_URL}
          title="EduExpress International Dhanmondi Office location map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[340px] w-full border-0 lg:h-full lg:min-h-[380px]"
        />
      </div>

      <div className="flex flex-col justify-between rounded-3xl border border-petrol-800/10 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-pale px-3.5 py-1.5 text-[13.5px] font-semibold text-lime-deep">
            <Navigation size={14} aria-hidden="true" /> Google Business Profile &amp; Directions
          </span>
          <h3 className="mt-4 text-[21px] font-semibold leading-snug tracking-[-0.02em] text-petrol-800">
            {heading}
          </h3>
          <p className="mt-2 text-[14.5px] font-semibold text-petrol-800">{name}</p>

          <ul className="mt-4 space-y-3 text-[15px] leading-6 text-ink-soft">
            <li className="flex items-start gap-2.5">
              <MapPin size={18} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
              <span>{address}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone size={18} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
              <span>
                {[primaryPhone, secondaryPhone].filter((v): v is string => Boolean(v)).map(formatBangladeshPhone).join(' / ')}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={18} className="mt-0.5 shrink-0 text-petrol-800" aria-hidden="true" />
              <span>{hours} (Friday closed)</span>
            </li>
          </ul>

          <div className="mt-5 rounded-2xl bg-canvas-soft p-4">
            <p className="flex items-center gap-2 text-[14px] font-bold text-petrol-800">
              <Compass size={16} aria-hidden="true" /> Local Landmarks &amp; Dhaka Access
            </p>
            <ul className="mt-2 space-y-1.5 text-[13.5px] leading-6 text-ink-soft">
              {DHANMONDI_DIRECTIONS.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-btn ed-btn-signal min-h-[48px] px-6"
          >
            Get directions on Google Maps <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
