import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BellRing, CalendarClock, Check, MessageCircle, Newspaper, Sparkles } from 'lucide-react';

import UpdatesClient, { type LibraryItem } from './UpdatesClient';
import DarkCrumbs from '@/components/page/DarkCrumbs';
import { JsonLd, kit } from '@/components/page/PageKit';
import HomeLeadForm from '@/components/lead/HomeLeadForm';
import UpdateCard from '@/components/updates/UpdateCard';
import { getPublishedUpdates } from '@/lib/content-records';
import { config } from '@/lib/config';
import { pageMetadata } from '@/lib/seo';
import { fmtDay, openByDeadline, requestTime } from '@/lib/update-deadlines';
import type { Update } from '@/lib/types';

// Server-rendered so every title and excerpt is in the HTML for search engines
// and AI crawlers. ISR: regenerated at most every 5 minutes (admin saves also revalidate).
export const revalidate = 300;

const PATH = '/updates';

async function getUpdates(): Promise<{ updates: Update[]; loaded: boolean }> {
  try {
    // Newest first: the library is a news feed, so a pinned old post must not sit on top.
    return { updates: await getPublishedUpdates(undefined, false), loaded: true };
  } catch (error) {
    console.error('Error fetching updates server-side:', error);
    return { updates: [], loaded: false };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { updates, loaded } = await getUpdates();
  const base = pageMetadata({
    title: 'Scholarships & Admissions 2027: China Updates | EduExpress',
    description:
      'New 2027 scholarships, university admissions, deadlines and exam dates for Bangladeshi students. Every update is dated, sourced and checked by EduExpress.',
    path: PATH,
    // An empty archive is a thin page; a failed read is not treated as empty.
    noindex: loaded && updates.length === 0,
  });
  return {
    ...base,
    authors: [{ name: 'EduExpress International' }],
    creator: 'EduExpress International',
    publisher: 'EduExpress International',
    other: { 'geo.region': 'BD-DH', 'geo.placename': 'Dhaka', 'geo.position': '23.8103;90.4125', ICBM: '23.8103, 90.4125' },
  };
}

const plain = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export default async function UpdatesPage() {
  const { updates } = await getUpdates();
  const now = requestTime();
  const live = updates.filter(update => !update.archived);
  const closing = openByDeadline(live, now).slice(0, 4);
  const openCount = openByDeadline(live, now).length;
  const latest = updates[0]?.publishedAt || updates[0]?.createdAt;

  const waNumber = config.contact.whatsapp.replace(/\D/g, '');
  const alertsHref = `https://wa.me/${waNumber}?text=${encodeURIComponent('Assalamu alaikum. Please send me new 2027 scholarship and admission updates on WhatsApp.')}`;
  const formWa = `https://wa.me/${waNumber}?text=${encodeURIComponent('Assalamu alaikum. I saw the scholarship updates on your website. Please suggest the right options for me.')}`;

  // Slim records for the client: card fields plus a search string, never the full HTML.
  const library: LibraryItem[] = updates.map(update => ({
    id: update.id,
    slug: update.slug,
    title: update.title,
    excerpt: update.excerpt,
    featuredImage: update.featuredImage,
    category: update.category,
    categories: update.categories,
    deadlineAt: update.deadlineAt,
    publishedAt: update.publishedAt,
    createdAt: update.createdAt,
    archived: update.archived,
    search: `${update.title} ${update.excerpt || ''} ${(update.tags || []).join(' ')} ${(update.categories || []).join(' ')} ${plain(update.content).slice(0, 600)}`.toLowerCase(),
  }));

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://eduexpressint.com/updates#blog',
    url: 'https://eduexpressint.com/updates',
    name: 'EduExpress Education Updates',
    description: 'Dated scholarship, admission and exam updates for Bangladeshi students, written and checked by EduExpress International.',
    inLanguage: 'en-BD',
    publisher: { '@id': 'https://eduexpressint.com/#organization' },
    blogPost: updates.slice(0, 30).map(update => ({
      '@type': 'BlogPosting',
      headline: update.title,
      url: `https://eduexpressint.com/updates/${update.slug}`,
      datePublished: update.publishedAt || update.createdAt,
      ...(update.featuredImage ? { image: update.featuredImage.startsWith('/') ? `https://eduexpressint.com${update.featuredImage}` : update.featuredImage } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={structuredData} />

      {/* Hero: what this library is + the zero-friction lead (WhatsApp alerts) */}
      <section className="relative overflow-hidden bg-petrol-800 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-lime/10 blur-3xl" />
        <div className={`${kit.wrap} relative grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-14 lg:py-20`}>
          <div>
            <DarkCrumbs trail={[{ name: 'Updates' }]} path={PATH} />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[14px] font-semibold text-lime">
              <Sparkles size={15} aria-hidden="true" /> Education updates · 2027 intake
            </p>
            <h1 className="mt-5 font-display text-[42px] font-black leading-[0.95] tracking-[-0.015em] text-white sm:text-[60px] lg:text-[68px]">
              New scholarships, admissions and <span className="text-lime">deadlines.</span>
            </h1>
            <p className="mt-5 max-w-[58ch] text-[18px] leading-[1.6] text-white/80">
              Fresh 2027 notices from Chinese universities, rewritten in plain English for Bangladeshi students: what is covered, who can apply, the documents and the exact deadline.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2.5 text-[15px]">
              <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <Newspaper size={16} className="text-lime" aria-hidden="true" /> <strong>{updates.length}</strong> updates
              </li>
              {openCount > 0 && (
                <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                  <CalendarClock size={16} className="text-lime" aria-hidden="true" /> <strong>{openCount}</strong> deadlines open now
                </li>
              )}
              {latest && (
                <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">Last added {fmtDay(latest)}</li>
              )}
            </ul>
          </div>

          <aside className="rounded-3xl bg-lime p-6 text-petrol-800 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] sm:p-8">
            <span className="grid size-12 place-items-center rounded-full bg-petrol-800 text-lime">
              <BellRing size={22} aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-[30px] font-black leading-[1] tracking-[-0.01em]">Get new scholarships first.</h2>
            <p className="mt-3 text-[16px] leading-7 text-petrol-800/80">
              We send new 2027 scholarships and closing deadlines to your WhatsApp, matched to your study level. Free, and you can stop any time.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={alertsHref} target="_blank" rel="noopener noreferrer" className="ed-btn min-h-[52px] flex-1 whitespace-nowrap bg-petrol-800 px-5 text-white hover:bg-petrol-700">
                <MessageCircle size={18} aria-hidden="true" /> Get WhatsApp alerts
              </a>
              <a href="#shortlist" className="ed-btn min-h-[52px] flex-1 whitespace-nowrap border border-petrol-800 bg-transparent px-5 text-petrol-800 hover:bg-white/40">
                Free shortlist <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </section>

      {closing.length > 0 && (
        <section aria-labelledby="closing-soon" className="bg-canvas py-14 lg:py-16">
          <div className={kit.wrap}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-clay">Deadlines</p>
                <h2 id="closing-soon" className="mt-2 font-display text-[34px] font-black leading-[0.98] tracking-[-0.01em] text-petrol-800 sm:text-[44px]">
                  Closing soon.
                </h2>
              </div>
              <a href="#shortlist" className="ed-btn ed-btn-signal min-h-11 px-5 text-[15px]">
                Check my eligibility <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {closing.map((update, index) => (
                <li key={update.id}>
                  <UpdateCard update={update} now={now} priority={index < 2} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section id="library" className="scroll-mt-24 bg-white py-14 lg:py-20">
        <div className={kit.wrap}>
          <UpdatesClient items={library} now={now} />
        </div>
      </section>

      {/* Lead magnet: personal shortlist */}
      <section id="shortlist" className="scroll-mt-24 bg-petrol-800 py-16 text-white lg:py-20" data-cta-band>
        <div className={`${kit.wrap} grid gap-10 lg:grid-cols-[1fr_.95fr] lg:items-center lg:gap-16`}>
          <div>
            <h2 className="font-display text-[38px] font-black leading-[0.95] tracking-[-0.01em] text-lime sm:text-[52px]">Too many options? Get your own shortlist.</h2>
            <p className="mt-5 max-w-xl text-[18px] leading-[1.6] text-white/85">
              Tell us your level, results and budget. A counsellor matches you with the scholarships and universities above that you can realistically get, and the deadline for each.
            </p>
            <ul className="mt-6 grid gap-2.5 text-[16px] text-white/85">
              <li className="flex gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> Scholarships that match your CGPA and level</li>
              <li className="flex gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> Deadlines and documents in one checklist</li>
              <li className="flex gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> Reply within one working day, free of charge</li>
            </ul>
            <p className="mt-6 text-[15px] text-white/60">Admission and scholarship decisions are made by the universities.</p>
          </div>
          <div className="rounded-3xl bg-white p-1 text-ink">
            <HomeLeadForm
              whatsappHref={formWa}
              source="updates_index"
              topic="Scholarship shortlist from the updates page"
              eyebrow="Free scholarship shortlist"
              heading="Find my scholarships."
              intro="Share a few details. A counsellor calls you within one working day."
            />
          </div>
        </div>
      </section>

      <nav aria-label="Study in China guides" className="bg-canvas py-12">
        <div className={`${kit.wrap} flex flex-wrap items-center gap-3 text-[15px] font-semibold`}>
          <span className="text-ink-soft">Before you apply:</span>
          {[
            ['/csc-scholarship-bangladesh', 'CSC scholarship guide'],
            ['/china-admission-requirements', 'Admission requirements'],
            ['/china-intakes-deadlines', 'Intakes and deadlines'],
            ['/study-in-china-cost-bangladesh', 'Complete cost'],
            ['/china-student-visa-bangladesh', 'Student visa'],
            ['/universities', 'University finder'],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-petrol-800 transition-colors hover:bg-lime-pale">
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
