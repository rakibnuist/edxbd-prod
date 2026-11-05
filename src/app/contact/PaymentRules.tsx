import Link from 'next/link';
import { FileText, ShieldCheck, Wallet } from 'lucide-react';
import { Section, kit } from '@/components/page/PageKit';

/**
 * The three money-and-outcome rules a family should see before paying,
 * worded as on /fees-and-transparency and /your-study-journey. Shared by the
 * contact, Dhaka-consultant and parents pages.
 */
const rules = [
  {
    icon: Wallet,
    title: 'No EduExpress fee before China visa approval',
    text: 'No file opening charge. No EduExpress service fee is due before China visa approval.',
  },
  {
    icon: FileText,
    title: 'Third-party costs itemised in writing',
    text: 'Any university, embassy, medical, translation, courier, deposit or other third-party fee required earlier is itemised in writing before the student proceeds.',
  },
  {
    icon: ShieldCheck,
    title: 'No guaranteed outcome',
    text: 'Universities decide admission and scholarships. Government authorities decide visas. We compare, prepare, check and explain, but cannot replace an official decision.',
  },
];

export default function PaymentRules({
  title = 'Before your family pays anything.',
  intro = 'The same rules apply whether you call, visit or write.',
}: {
  title?: string;
  intro?: string;
}) {
  return (
    <Section tone="navy" title={title} intro={intro}>
      <ul data-anim="stagger" className="grid gap-5 md:grid-cols-3">
        {rules.map(item => (
          <li key={item.title} className="rounded-3xl border border-white/15 p-6 sm:p-7">
            <span className={kit.iconLime}><item.icon size={22} aria-hidden="true" /></span>
            <h3 className="mt-6 text-[21px] font-semibold leading-[1.3] tracking-[-0.02em] text-lime">{item.title}</h3>
            <p className="mt-2 text-[16px] leading-7 text-white/80">{item.text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/fees-and-transparency" className="ed-btn ed-btn-signal min-h-[52px] px-7">How we handle fees</Link>
        <Link href="/china-visa-first-policy" className="ed-btn ed-btn-on-dark min-h-[52px] px-7">Read the visa-first policy</Link>
      </div>
    </Section>
  );
}
