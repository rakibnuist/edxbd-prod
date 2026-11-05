import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { formatBangladeshPhone } from '@/lib/contact-format';
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  HeartHandshake,
  MapPin,
  Phone,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getPublicTrustRecords } from '@/lib/trust-records';

export const metadata: Metadata = {
  title: { absolute: 'Study Abroad Guide for Parents in Bangladesh | EduExpress International' },
  description: 'A practical guide for Bangladeshi parents comparing recognition, full study costs, student safety, application proof and visa responsibility.',
  alternates: { canonical: '/for-parents' },
  openGraph: {
    title: 'Study Abroad Guide for Parents in Bangladesh',
    description: 'Compare recognition, full study costs, student safety, application proof and visa responsibility before your child commits.',
    url: '/for-parents',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'EduExpress International — parent and student guidance in Dhanmondi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Abroad Guide for Parents in Bangladesh',
    description: 'Compare recognition, full study costs, student safety, application proof and visa responsibility before your child commits.',
    images: ['/og-image.jpg'],
  },
};

const parentChecks = [
  { title: 'Is the education recognized?', copy: 'We check the institution, selected program and the student’s intended career route.', icon: ShieldCheck, href: '/how-we-verify-universities' },
  { title: 'What will the family really pay?', copy: 'Tuition, living costs, official fees and EduExpress charges are separated.', icon: CircleDollarSign, href: '/fees-and-transparency' },
  { title: 'Who is responsible for each step?', copy: 'Documents, deadlines, payments and application actions should have a named owner.', icon: FileCheck2, href: '/services' },
  { title: 'Who can the family speak to?', copy: 'Parents can talk directly with the counseling desk before a student proceeds.', icon: UserRoundCheck, href: '/contact' },
];

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();

export default async function ParentsPage() {
  const { team, offices } = await getPublicTrustRecords();
  const counselors = team.filter(member => /Counselor|Founder/.test(member.role)).slice(0, 3);
  const office = offices[0];

  return (
    <article className="ed-page bg-ed-paper pt-[74px] text-ed-ink xl:pt-[106px]">
      <header className="relative overflow-hidden border-b border-[#12436b]/10 bg-[linear-gradient(180deg,#ffffff_0%,#f4f9fc_100%)] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="pointer-events-none absolute inset-0 ed-grid-lines-dark opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1240px]">
          <Breadcrumbs items={[{ name: 'For Parents' }]} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_.72fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#12436b]/12 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ed-navy">
                <HeartHandshake size={15} className="text-ed-teal" /> A parent-friendly decision guide
              </p>
              <h1 className="ed-home-display mt-6 max-w-4xl text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.03em]">
                Help your child choose with facts, not pressure.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Check recognition, complete cost and responsibility before your family commits.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {office && (
                  <a href={`tel:${office.phonePrimary}`} className="ed-btn ed-btn-primary">
                    <Phone size={17} /> Call {formatBangladeshPhone(office.phonePrimary)}
                  </a>
                )}
                <Link href="/contact?audience=parent" className="ed-btn ed-btn-outline">
                  Book a parent conversation <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <aside className="rounded-[28px] border border-[#12436b]/12 bg-ed-navy p-7 text-white shadow-[0_24px_70px_-40px_rgba(18,67,107,0.45)] sm:p-9">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ed-mist">Bring these to the conversation</p>
              <ul className="mt-6 space-y-4 text-sm text-white/78">
                {['Latest academic results', 'Preferred subject or career area', 'Family budget range', 'Questions about recognition or safety'].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={17} className="shrink-0 text-ed-mist" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-7 border-t border-white/15 pt-6 text-xs leading-5 text-white/55">
                No university choice is required before the conversation.
              </p>
            </aside>
          </div>
        </div>
      </header>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="ed-home-display max-w-3xl text-3xl leading-[1.05] sm:text-[2.5rem]">
            Four questions every family should answer first
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {parentChecks.map(({ title, copy, icon: Icon, href }) => (
              <Link key={title} href={href} className="group flex gap-4 rounded-[22px] border border-[#12436b]/10 bg-white p-5 shadow-[0_18px_50px_-42px_rgba(18,67,107,0.35)] transition hover:border-[#12436b]/25 hover:shadow-[0_22px_60px_-42px_rgba(18,67,107,0.4)]">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ed-sky/12 text-ed-navy">
                  <Icon size={21} />
                </span>
                <span>
                  <strong className="block text-lg text-ed-ink">{title}</strong>
                  <span className="mt-2 block text-sm leading-6 text-slate-600">{copy}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-ed-navy">
                    Check this <ArrowRight size={13} className="transition group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#12436b]/10 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ed-teal">Speak with a real person</p>
              <h2 className="ed-home-display mt-3 text-3xl leading-[1.05] sm:text-[2.5rem]">The counseling team welcomes parents.</h2>
            </div>
            <Link href="/about#team" className="inline-flex items-center gap-2 text-sm font-bold text-ed-navy">
              Meet the team <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {counselors.map(member => (
              <article key={member.name} className="rounded-[22px] border border-[#12436b]/8 bg-ed-paper p-5">
                <div className="flex items-center gap-4">
                  {member.photoUrl ? (
                    <Image src={member.photoUrl} alt={member.name} width={56} height={56} className="size-14 rounded-full object-cover" />
                  ) : (
                    <span className="grid size-14 place-items-center rounded-full bg-ed-navy ed-home-display text-lg font-bold text-white">{initials(member.name)}</span>
                  )}
                  <div>
                    <h3 className="font-bold text-ed-ink">{member.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-ed-teal">{member.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {office && (
        <section className="bg-[linear-gradient(180deg,#f7fbfd_0%,#edf5fa_100%)] px-5 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-7 rounded-[26px] border border-[#12436b]/10 bg-white p-6 shadow-[0_20px_60px_-45px_rgba(18,67,107,0.35)] lg:flex-row lg:items-center sm:p-8">
            <div className="flex gap-4">
              {office.photoUrl ? (
                <Image src={office.photoUrl} alt={office.name} width={96} height={96} className="size-16 shrink-0 rounded-2xl object-cover" />
              ) : (
                <MapPin size={24} className="mt-1 shrink-0 text-ed-navy" />
              )}
              <div>
                <h2 className="ed-home-display text-2xl leading-[1.05]">Visit together in Dhanmondi</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{office.address}. {office.hours}.</p>
              </div>
            </div>
            <Link href="/contact" className="ed-btn ed-btn-primary shrink-0">
              Office details <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}
