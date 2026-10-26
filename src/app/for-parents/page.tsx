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
    <article className="bg-[#f7fafc] pt-[74px] text-[#08263c] xl:pt-[106px]">
      <header className="border-b border-[#174f7a]/15 bg-white px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <Breadcrumbs items={[{ name: 'For Parents' }]} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_.7fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#e9f7fd] px-4 py-2 text-xs font-black text-[#174f7a]"><HeartHandshake size={15} /> A parent-friendly decision guide</p>
              <h1 className="mt-6 max-w-4xl font-heading text-[clamp(2.5rem,5vw,4.7rem)] font-bold leading-[1.02] tracking-[-0.035em]">Help your child choose with facts, not pressure.</h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Check recognition, complete cost and responsibility before your family commits.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">{office && <a href={`tel:${office.phonePrimary}`} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#08263c] px-6 text-sm font-black text-white"><Phone size={17} /> Call {formatBangladeshPhone(office.phonePrimary)}</a>}<Link href="/contact?audience=parent" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 border-[#08263c] bg-white px-6 text-sm font-black">Book a parent conversation <ArrowRight size={16} /></Link></div>
            </div>
            <aside className="rounded-[2rem] bg-[#08263c] p-7 text-white sm:p-9">
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#8ed0ee]">Bring these to the conversation</p>
              <ul className="mt-6 space-y-4 text-sm text-white/75">
                {['Latest academic results', 'Preferred subject or career area', 'Family budget range', 'Questions about recognition or safety'].map(item => <li key={item} className="flex items-center gap-3"><CheckCircle2 size={17} className="shrink-0 text-[#64b5df]" />{item}</li>)}
              </ul>
              <p className="mt-7 border-t border-white/15 pt-6 text-xs leading-5 text-white/50">No university choice is required before the conversation.</p>
            </aside>
          </div>
        </div>
      </header>

      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="max-w-3xl font-heading text-3xl font-bold sm:text-4xl">Four questions every family should answer first</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {parentChecks.map(({ title, copy, icon: Icon, href }) => <Link key={title} href={href} className="group flex gap-4 rounded-2xl border border-[#174f7a]/15 bg-white p-5 shadow-sm transition hover:border-[#174f7a]/40"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e9f7fd] text-[#174f7a]"><Icon size={21} /></span><span><strong className="block text-lg">{title}</strong><span className="mt-2 block text-sm leading-6 text-slate-500">{copy}</span><span className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#174f7a]">Check this <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span></span></Link>)}
          </div>
        </div>
      </section>

      <section className="border-y border-[#174f7a]/15 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#174f7a]">Speak with a real person</p><h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">The counseling team welcomes parents.</h2></div><Link href="/about#team" className="inline-flex items-center gap-2 text-sm font-black text-[#174f7a]">Meet the team <ArrowRight size={15} /></Link></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {counselors.map(member => <article key={member.name} className="rounded-2xl bg-[#f7fafc] p-5"><div className="flex items-center gap-4">{member.photoUrl ? <Image src={member.photoUrl} alt={member.name} width={56} height={56} className="size-14 rounded-full object-cover" /> : <span className="grid size-14 place-items-center rounded-full bg-[#174f7a] font-heading font-bold text-white">{initials(member.name)}</span>}<div><h3 className="font-black">{member.name}</h3><p className="mt-1 text-xs font-bold text-[#174f7a]">{member.role}</p></div></div></article>)}
          </div>
        </div>
      </section>

      {office && <section className="bg-[#dff3fb] px-5 py-12 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-7 lg:flex-row lg:items-center"><div className="flex gap-4">{office.photoUrl ? <Image src={office.photoUrl} alt={office.name} width={96} height={96} className="size-16 shrink-0 rounded-2xl object-cover" /> : <MapPin size={24} className="mt-1 shrink-0 text-[#174f7a]" />}<div><h2 className="font-heading text-2xl font-bold">Visit together in Dhanmondi</h2><p className="mt-2 text-sm leading-6 text-slate-600">{office.address}. {office.hours}.</p></div></div><Link href="/contact" className="inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#08263c] px-6 text-sm font-black text-white">Office details <ArrowRight size={15} /></Link></div></section>}
    </article>
  );
}
