import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { ArrowRight, Check, CircleDollarSign, FileCheck2, GraduationCap, Landmark, ShieldCheck } from 'lucide-react';
import { countries } from '@/lib/countries';

type Props = { params: Promise<{ country: string }> };

export function generateStaticParams() {
  return countries.map(({ slug }) => ({ country: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const country = countries.find((item) => item.slug === slug);
  if (!country) return { title: 'Country Not Found' };

  const china = country.slug === 'china';
  const title = china ? 'Study in China from Bangladesh' : `Study in ${country.name} from Bangladesh`;
  const description = china
    ? 'Compare Chinese education options, recognition, costs, scholarships and visa readiness with written evidence.'
    : `Explore active ${country.name} education guidance for Bangladeshi students with program fit, institution checks, clear costs and visa readiness.`;

  return {
    title,
    description,
    alternates: { canonical: china ? '/study-in-china-from-bangladesh' : `/destinations/${slug}` },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: china ? '/study-in-china-from-bangladesh' : `/destinations/${slug}` },
  };
}

export default async function CountryPage({ params }: Props) {
  const { country: slug } = await params;
  const country = countries.find((item) => item.slug === slug);
  if (!country) notFound();
  if (country.slug === 'china') permanentRedirect('/study-in-china-from-bangladesh');

  const programAreas = country.programs.length ? country.programs : ['Business', 'Technology', 'Health and Social Sciences', 'International programs'];

  return (
    <article className="min-h-screen bg-[#f4f8fa] px-4 pb-24 pt-32 text-[#08263c]">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#174f7a]">
          <Link href="/">Home</Link><span>/</span><Link href="/destinations">Destinations</Link><span>/</span><span>{country.name}</span>
        </nav>

        <header className="relative mt-8 overflow-hidden bg-[#0b2f4a] p-8 text-white md:p-14">
          <div className="absolute right-0 top-0 size-72 rounded-full border-[42px] border-[#64b5df]/15" />
          <div className="relative">
            <span className="inline-flex bg-[#64b5df] px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#08263c]">Active education service</span>
            <h1 className="mt-6 max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight md:text-7xl">Study in {country.name} from Bangladesh</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">EduExpress supports Bangladeshi students with education fit, institution and program checks, a written cost view, application guidance and visa readiness for {country.name}. Every recommendation is assessed before an application decision.</p>
          </div>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="border border-[#174f7a]/25 bg-white p-7 md:p-9">
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#174f7a]">Education fit</p>
            <h2 className="mt-3 font-heading text-3xl font-bold">Who this route may fit</h2>
            <p className="mt-4 leading-7 text-slate-700">Students prepared to compare program quality, recognition, total affordability and the requirements of the responsible university and authority.</p>
            <p className="mt-4 leading-7 text-slate-700">This service works best for students who value evidence based guidance and understand that responsible institutions and authorities issue individual admission, visa, scholarship and employment decisions.</p>
          </section>

          <section className="border border-[#174f7a]/25 bg-[#bde7f8] p-7 md:p-9">
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#174f7a]">Program exploration</p>
            <h2 className="mt-3 font-heading text-3xl font-bold">Study areas students ask about</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {programAreas.slice(0, 6).map((program) => <li key={program} className="flex items-center gap-2 font-bold"><Check size={17} />{program}</li>)}
            </ul>
          </section>
        </div>

        <section className="mt-6 grid border-l border-t border-[#174f7a] bg-white sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Recognition', 'Institution, program and jurisdiction evidence', Landmark],
            ['Academic fit', 'Entry requirements and curriculum match', GraduationCap],
            ['Cost reality', 'Tuition, living and outside fees separated', CircleDollarSign],
            ['Visa readiness', 'Current documents and gaps checked', FileCheck2],
          ].map(([title, copy, Icon]) => (
            <div key={String(title)} className="min-h-52 border-b border-r border-[#174f7a] p-6">
              <Icon className="text-[#64b5df]" size={28} />
              <h2 className="mt-8 font-heading text-xl font-bold">{String(title)}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{String(copy)}</p>
            </div>
          ))}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <section className="border border-[#174f7a]/25 bg-white p-7 md:p-9">
            <h2 className="font-heading text-3xl font-bold">University and study group access</h2>
            <p className="mt-4 leading-7 text-slate-700">EduExpress has active university or study group routes for this destination. The exact relationship, application route and responsible institution are explained before the student proceeds.</p>
            <p className="mt-4 leading-7 text-slate-700">Program availability, entry rules, fees, intakes and visa requirements can change. Current information is checked for the specific student and intake instead of being generalized.</p>
          </section>

          <aside className="bg-[#174f7a] p-7 text-white md:p-9">
            <ShieldCheck className="text-[#8ed0ee]" size={34} />
            <h2 className="mt-6 font-heading text-3xl font-bold">Proof stays destination specific</h2>
            <p className="mt-4 leading-7 text-white/75">EduExpress does not apply China statistics or China student stories to {country.name}. A destination receives its own proof only when consent and supporting records exist.</p>
          </aside>
        </div>

        <section className="mt-10 flex flex-col items-start justify-between gap-6 bg-[#64b5df] p-7 md:flex-row md:items-center md:p-10">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#174f7a]">Service status reviewed 19 July 2026</p>
            <h2 className="mt-2 font-heading text-3xl font-bold">Start with an Education Fit Assessment</h2>
            <p className="mt-3 max-w-2xl leading-7">Bring your academic results, subject goal, budget and constraints. The first step is a clearer education decision.</p>
          </div>
          <Link href={`/contact?destination=${country.slug}`} className="inline-flex shrink-0 items-center gap-2 bg-[#08263c] px-6 py-4 font-black text-white">Assess my {country.name} options <ArrowRight size={18} /></Link>
        </section>
      </div>
    </article>
  );
}
