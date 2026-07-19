import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { ArrowRight, Check, X, CircleDollarSign, FileCheck2, GraduationCap, Landmark, ShieldCheck, Briefcase, Calendar, Info, HelpCircle, FileText, Globe } from 'lucide-react';
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
  const title = country.metaTitle || (china ? 'Study in China from Bangladesh' : `Study in ${country.name} from Bangladesh`);
  const description = country.metaDescription || (china
    ? 'Compare Chinese education options, recognition, costs, scholarships and visa readiness with written evidence.'
    : `Explore active ${country.name} education guidance for Bangladeshi students with program fit, institution checks, clear costs and visa readiness.`);

  return {
    title,
    description,
    alternates: { canonical: china ? '/study-in-china-from-bangladesh' : `/study-in-${slug}-from-bangladesh` },
    robots: { index: country.serviceStatus === 'Active' || country.serviceStatus === 'Flagship', follow: true },
    openGraph: { title, description, url: china ? '/study-in-china-from-bangladesh' : `/study-in-${slug}-from-bangladesh` },
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
      <div className="mx-auto max-w-4xl">
        {/* Module 1: Breadcrumbs + service-status badge */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#174f7a]">
          <Link href="/">Home</Link><span>/</span><Link href="/destinations">Destinations</Link><span>/</span><span>Study in {country.name}</span>
        </nav>

        {/* Module 2: H1 + 50-word direct value statement */}
        <header className="relative mt-8 overflow-hidden bg-[#0b2f4a] p-8 text-white md:p-14 rounded-3xl">
          <div className="absolute right-0 top-0 size-72 rounded-full border-[42px] border-[#64b5df]/15" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 bg-[#64b5df] px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#08263c] rounded-sm">
              <Globe size={14} /> {country.serviceStatus || 'Researching'} education service
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Study in {country.name} from Bangladesh
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80">
              {country.valueStatement || `EduExpress supports Bangladeshi students with education fit, institution and program checks, a written cost view, application guidance and visa readiness for ${country.name}. Every recommendation is assessed before an application decision.`}
            </p>
          </div>
        </header>

        {/* Module 3: Who this country fits — and who should reconsider */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 md:p-9">
            <div className="flex items-center gap-3 text-emerald-800">
              <Check size={24} className="rounded-full bg-emerald-200 p-1" />
              <h2 className="font-heading text-2xl font-bold">Who this route fits</h2>
            </div>
            <ul className="mt-5 grid gap-4">
              {(country.whoItFits || ['Students prepared to compare program quality, recognition, and total affordability.']).map((point, i) => (
                <li key={i} className="flex gap-3 text-emerald-900 leading-7">
                  <span className="shrink-0 text-emerald-600 mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-7 md:p-9">
            <div className="flex items-center gap-3 text-rose-800">
              <X size={24} className="rounded-full bg-rose-200 p-1" />
              <h2 className="font-heading text-2xl font-bold">Who should reconsider</h2>
            </div>
            <ul className="mt-5 grid gap-4">
              {(country.whoShouldReconsider || ['Students looking for guaranteed visas or jobs without verifying official rules.']).map((point, i) => (
                <li key={i} className="flex gap-3 text-rose-900 leading-7">
                  <span className="shrink-0 text-rose-600 mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Module 4: Education system and recognition */}
        <section className="mt-10 rounded-3xl border border-[#174f7a]/20 bg-white p-7 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 text-[#174f7a]">
            <Landmark size={28} />
            <h2 className="font-heading text-3xl font-bold">Education system & recognition</h2>
          </div>
          <p className="mt-5 leading-8 text-slate-700 text-lg">
            {country.educationSystemAndRecognition || 'Education quality, recognition, and accreditation are currently under review by our team against the Better Education Standard.'}
          </p>
        </section>

        {/* Module 5: Program/university choices with evidence */}
        <section className="mt-10 rounded-3xl border border-[#174f7a]/20 bg-white p-7 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 text-[#174f7a]">
            <GraduationCap size={28} />
            <h2 className="font-heading text-3xl font-bold">University & program choices</h2>
          </div>
          <p className="mt-5 leading-7 text-slate-700">
            EduExpress maintains active verification for specific institutions in {country.name}. Popular study areas for Bangladeshi students include:
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {programAreas.map(p => (
              <span key={p} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 border border-blue-100">{p}</span>
            ))}
          </div>
          {country.universities && country.universities.length > 0 && (
             <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="font-bold text-lg mb-4">Verified Institutions / Network Access:</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {country.universities.map(u => (
                    <li key={u} className="flex items-center gap-2 text-slate-700 text-sm"><Check size={16} className="text-[#64b5df]"/> {u}</li>
                  ))}
                </ul>
             </div>
          )}
        </section>

        {/* Module 6: Admission requirements for Bangladesh */}
        <section className="mt-10 rounded-3xl border border-[#174f7a]/20 bg-white p-7 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 text-[#174f7a]">
            <FileText size={28} />
            <h2 className="font-heading text-3xl font-bold">Admission requirements</h2>
          </div>
          <p className="mt-4 text-slate-600">Specific requirements vary by institution, but standard expectations for Bangladeshi students include:</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="bg-slate-50 p-5 rounded-2xl">
              <h3 className="font-bold text-[#08263c] mb-3">Language & Academics</h3>
              <ul className="grid gap-2">
                {country.requirements?.language.map((req, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-[#64b5df]">•</span><span>{req}</span></li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl">
              <h3 className="font-bold text-[#08263c] mb-3">Required Documents</h3>
              <ul className="grid gap-2">
                {country.requirements?.documents.map((req, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-[#64b5df]">•</span><span>{req}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Module 7: Total cost and funding reality */}
        <section className="mt-10 rounded-3xl border border-[#174f7a]/20 bg-[#f8fbff] p-7 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 text-[#174f7a]">
            <CircleDollarSign size={28} />
            <h2 className="font-heading text-3xl font-bold">Cost & funding reality</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 border border-blue-100">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Est. Tuition</p>
              <p className="mt-2 text-xl font-bold text-[#08263c]">{country.costs?.tuition || 'Varies widely'}</p>
            </div>
            <div className="rounded-2xl bg-white p-6 border border-blue-100">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Est. Living Costs</p>
              <p className="mt-2 text-xl font-bold text-[#08263c]">{country.costs?.living || 'Varies by city'}</p>
            </div>
          </div>
          {country.scholarships && country.scholarships.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-3">Funding Opportunities</h3>
              <div className="flex flex-col gap-2">
                {country.scholarships.map(s => (
                  <div key={s} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-100">
                    <span className="bg-amber-100 text-amber-700 p-1 rounded"><Check size={16}/></span>
                    <span className="font-medium text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Module 8: Visa/residence process with official sources */}
        <section className="mt-10 rounded-3xl border border-[#174f7a]/20 bg-white p-7 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 text-[#174f7a]">
            <FileCheck2 size={28} />
            <h2 className="font-heading text-3xl font-bold">Visa & residence process</h2>
          </div>
          <p className="mt-5 leading-7 text-slate-700">
            Visa decisions are made solely by the relevant immigration authority. Our role is to ensure your application meets current published guidelines.
          </p>
          <ul className="mt-5 grid gap-3">
             {country.requirements?.visa.map((v, i) => (
                <li key={i} className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="shrink-0 text-blue-600">→</span>
                  <span>{v}</span>
                </li>
             ))}
          </ul>
        </section>

        {/* Module 9: Work rights and career pathways with caveats */}
        <section className="mt-10 rounded-3xl border border-[#174f7a]/20 bg-white p-7 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 text-[#174f7a]">
            <Briefcase size={28} />
            <h2 className="font-heading text-3xl font-bold">Work rights & career pathways</h2>
          </div>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-bold text-lg text-[#08263c] flex items-center gap-2"><Check size={18} className="text-emerald-600"/> Legal Work Rights</h3>
              <p className="mt-2 text-slate-700 leading-7">{country.workRightsAndCareer?.rights || 'Verify standard rules with immigration.'}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#08263c] flex items-center gap-2"><ArrowRight size={18} className="text-blue-600"/> Career Opportunities</h3>
              <p className="mt-2 text-slate-700 leading-7">{country.workRightsAndCareer?.opportunities || 'Outcomes depend heavily on student networking and academic performance.'}</p>
            </div>
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
              <h3 className="font-bold text-amber-900 flex items-center gap-2"><Info size={18}/> Reality Check</h3>
              <p className="mt-2 text-amber-800 leading-7">{country.workRightsAndCareer?.caveats || 'Post-study work rules change frequently. Do not rely entirely on part-time jobs to fund your tuition.'}</p>
            </div>
          </div>
        </section>

        {/* Module 10: Intakes/deadlines with automatic status */}
        <section className="mt-10 rounded-3xl border border-[#174f7a]/20 bg-white p-7 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 text-[#174f7a]">
            <Calendar size={28} />
            <h2 className="font-heading text-3xl font-bold">Intakes & deadlines</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] bg-slate-50 p-5 rounded-2xl border border-slate-100">
               <p className="text-sm font-semibold text-slate-500 uppercase">Primary Intakes</p>
               <p className="mt-2 font-bold text-lg text-[#08263c]">{country.intakesText || 'Varies by university'}</p>
            </div>
            <div className="flex-1 min-w-[200px] bg-slate-50 p-5 rounded-2xl border border-slate-100">
               <p className="text-sm font-semibold text-slate-500 uppercase">Next Major Deadline</p>
               <p className="mt-2 font-bold text-lg text-[#08263c]">{country.nextDeadline || 'Contact us for exact dates'}</p>
            </div>
          </div>
        </section>

        {/* Module 11: Comparison with two alternatives */}
        <section className="mt-10 rounded-3xl border border-[#174f7a]/20 bg-white p-7 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 text-[#174f7a]">
            <ShieldCheck size={28} />
            <h2 className="font-heading text-3xl font-bold">Compare destinations</h2>
          </div>
          <p className="mt-4 text-slate-600 mb-6">How does {country.name} compare to alternative study destinations for Bangladeshi students?</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-lg">Vs. {country.comparisons?.countryA || 'Alternative'}</h3>
              <p className="mt-3 text-slate-700 leading-7 text-sm">{country.comparisons?.countryA_description || 'Compare education fit based on budget and goals.'}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-lg">Vs. {country.comparisons?.countryB || 'Alternative'}</h3>
              <p className="mt-3 text-slate-700 leading-7 text-sm">{country.comparisons?.countryB_description || 'Assess total cost of attendance and post-study opportunities.'}</p>
            </div>
          </div>
        </section>

        {/* Module 12: FAQ with visible answers */}
        {country.faqs && country.faqs.length > 0 && (
          <section className="mt-10 rounded-3xl border border-[#174f7a]/20 bg-white p-7 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 text-[#174f7a]">
              <HelpCircle size={28} />
              <h2 className="font-heading text-3xl font-bold">Frequently asked questions</h2>
            </div>
            <div className="mt-8 space-y-6">
              {country.faqs.map((faq, i) => (
                <div key={i} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                  <h3 className="font-bold text-[#08263c] text-lg">{faq.question}</h3>
                  <p className="mt-3 text-slate-700 leading-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Module 13: Country reviewer, sources, last verified date */}
        <section className="mt-10 rounded-3xl bg-slate-100 p-7 md:p-10">
          <h2 className="font-heading text-xl font-bold mb-4 text-[#08263c]">Trust & Verification</h2>
          <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
             <div>
               <p className="font-bold uppercase tracking-wider text-xs mb-1">Reviewed By</p>
               <p>{country.reviewerInfo?.name || 'EduExpress Review Team'}</p>
               <p className="text-slate-500">{country.reviewerInfo?.role || 'Compliance'}</p>
             </div>
             <div>
               <p className="font-bold uppercase tracking-wider text-xs mb-1">Last Verified</p>
               <p>{country.reviewerInfo?.lastVerifiedDate || 'Current'}</p>
             </div>
             <div>
               <p className="font-bold uppercase tracking-wider text-xs mb-1">Primary Sources</p>
               <ul className="list-disc pl-4 space-y-1">
                 {(country.reviewerInfo?.primarySources || ['Embassy Guidelines', 'Ministry of Education']).map((s, i) => (
                   <li key={i}>{s}</li>
                 ))}
               </ul>
             </div>
          </div>
        </section>

        {/* Module 14: CTA: Education Fit Assessment */}
        <section className="mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#64b5df] p-7 md:flex-row md:items-center md:p-10">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#174f7a]">Next Step</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-[#08263c]">Start with an Education Fit Assessment</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#08263c]/80 font-medium">Bring your academic results, subject goal, budget and constraints. Compare {country.name} directly against other realistic options.</p>
          </div>
          <Link href={`/contact?destination=${country.slug}`} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#08263c] px-6 py-4 font-black text-white hover:bg-[#174f7a] transition-colors">
            Assess my options <ArrowRight size={18} />
          </Link>
        </section>

      </div>
    </article>
  );
}
