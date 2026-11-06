'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarClock, Check, ChevronRight, Clock, ExternalLink, Link2, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import HomeLeadForm from '@/components/lead/HomeLeadForm';
import { teamMembers } from '@/data/teamMembers';
import { config } from '@/lib/config';
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/conversion-events';
import type { UpdateClientProps } from '@/lib/types';

const SITE = 'https://eduexpressint.com';
const wrap = 'mx-auto max-w-[1200px] px-5 lg:px-8';

// Deterministic date formatting (avoids locale-dependent server/client mismatch)
const fmtDate = (iso?: string) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
};

const host = (url: string) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
};

export default function UpdateClient({ update, related = [], stale }: UpdateClientProps) {
  const [copied, setCopied] = useState(false);
  const teamMember = teamMembers.find(m => m.name.toLowerCase() === (update.author || '').trim().toLowerCase());
  const pageUrl = `${SITE}/updates/${update.slug}`;
  const category = update.category || update.categories?.[0] || 'Update';
  const words = update.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readTime = `${Math.max(1, Math.round(words / 220))} min read`;
  const published = fmtDate(update.publishedAt || update.createdAt);
  const checked = fmtDate(update.lastVerifiedAt);
  // The application deadline this post is about (deadlineAt). Before it the
  // hero says "Apply by"; after it the post stays live with a closed-round
  // notice that turns late readers into next-intake leads.
  const deadlineIso = update.deadlineAt;
  const deadline = fmtDate(deadlineIso);
  const deadlinePassed = Boolean(deadlineIso && new Date(deadlineIso).toISOString().slice(0, 10) < new Date().toISOString().slice(0, 10));
  const stalePost = stale?.enabled ?? false;

  const waNumber = config.contact.whatsapp.replace(/\D/g, '');
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Assalamu alaikum. I read "${update.title}" on your website. Please check my eligibility.`)}`;
  const telHref = `tel:${config.contact.phone.replace(/[^\d+]/g, '')}`;
  const shareWhatsApp = `https://wa.me/?text=${encodeURIComponent(`${update.title} ${pageUrl}`)}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the share links still work */
    }
  };

  return (
    <article>
      {/* Hero */}
      <header className="bg-canvas-soft pb-12 pt-[96px] sm:pt-[112px] lg:pb-16 lg:pt-[136px]">
        <div className={wrap}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold text-ink-soft">
              <li><Link href="/" className="hover:text-petrol-800 hover:underline">Home</Link></li>
              <li className="flex items-center gap-1.5"><ChevronRight size={14} className="text-ink-mute" aria-hidden="true" /><Link href="/updates" className="hover:text-petrol-800 hover:underline">Updates</Link></li>
              <li className="flex min-w-0 items-center gap-1.5"><ChevronRight size={14} className="text-ink-mute" aria-hidden="true" /><span aria-current="page" className="truncate text-petrol-800">{category}</span></li>
            </ol>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-lime-pale px-3.5 py-1.5 text-[14px] font-semibold text-lime-deep">
              {stale?.archived ? 'Closed intake · Archive' : category}
            </span>
            {deadline && !stale?.archived && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[14px] font-semibold ${deadlinePassed ? 'bg-white text-ink-soft' : 'bg-peach text-petrol-800'}`}>
                <CalendarClock size={15} aria-hidden="true" /> {deadlinePassed ? `Deadline passed ${deadline}` : `Apply by ${deadline}`}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[14px] font-semibold text-ink-soft">
              <Clock size={15} aria-hidden="true" /> {readTime}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl font-display text-[36px] font-black leading-[1.02] tracking-[-0.01em] text-petrol-800 sm:text-[48px] lg:text-[56px]">
            {update.title}
          </h1>
          {update.excerpt && <p className="mt-5 max-w-3xl text-[18px] leading-[1.6] text-ink-soft sm:text-[20px]">{update.excerpt}</p>}

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px] text-ink-soft">
            <span>
              By <strong className="text-petrol-800">{update.author || 'EduExpress International'}</strong>
              {teamMember ? `, ${teamMember.role}` : ''}
            </span>
            {published && <span>Published <time dateTime={update.publishedAt || update.createdAt}>{published}</time></span>}
            {checked && (
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={16} className="text-green-600" aria-hidden="true" /> Updated {checked}</span>
            )}
            <span className="flex items-center gap-2">
              <a href={shareWhatsApp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[14px] font-semibold text-petrol-800 transition hover:bg-lime-pale">Share on WhatsApp</a>
              <a href={shareFacebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[14px] font-semibold text-petrol-800 transition hover:bg-lime-pale">Facebook</a>
              <button type="button" onClick={copyLink} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[14px] font-semibold text-petrol-800 transition hover:bg-lime-pale" aria-live="polite">
                {copied ? <><Check size={14} aria-hidden="true" /> Copied</> : <><Link2 size={14} aria-hidden="true" /> Copy link</>}
              </button>
            </span>
          </div>
        </div>
      </header>

      {/* Body + sticky lead sidebar */}
      <div className="bg-white py-12 lg:py-16">
        <div className={`${wrap} grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14`}>
          <div className="min-w-0">
            {update.featuredImage && (
              <div className="relative mb-10 aspect-[1200/630] overflow-hidden rounded-3xl bg-canvas-soft">
                <Image src={update.featuredImage} alt={update.title} fill priority sizes="(max-width:1024px) 100vw, 760px" className="object-cover" />
              </div>
            )}

            {stale?.archived && (
              <aside className="mb-10 rounded-3xl bg-peach/60 p-6" aria-label="Closed intake notice">
                <p className="text-[14px] font-semibold uppercase tracking-[0.1em] text-petrol-800">Archive · closed intake</p>
                <h2 className="mt-2 font-display text-[26px] font-black leading-tight text-petrol-800">This intake has closed</h2>
                <p className="mt-2 text-[16px] leading-7 text-ink-soft">
                  This page records an earlier admissions window and is kept for transparency. Deadlines, fees and scholarship terms below may no longer apply. Check the live calendar before you act.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/china-march-2027-intake" className="ed-btn ed-btn-primary min-h-11 px-5 text-[15px]">See the March 2027 intake <ArrowRight size={15} aria-hidden="true" /></Link>
                  <Link href="/china-intakes-deadlines" className="ed-btn ed-btn-outline min-h-11 px-5 text-[15px]">Check live deadlines</Link>
                </div>
              </aside>
            )}

            {deadlinePassed && !stale?.archived && (
              <aside className="mb-10 rounded-3xl bg-petrol-800 p-6 text-white" aria-label="Application round closed">
                <p className="text-[14px] font-semibold uppercase tracking-[0.1em] text-lime">This round has closed</p>
                <h2 className="mt-2 font-display text-[26px] font-black leading-tight text-white">Get ready for the next intake.</h2>
                <p className="mt-2 text-[16px] leading-7 text-white/85">
                  The deadline for this round was {deadline}. Universities usually open the next round on a similar timeline. Tell us your profile and we will tell you when it opens and what to prepare now.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="#apply-help" className="ed-btn ed-btn-signal min-h-11 px-5 text-[15px]">Notify me for the next intake <ArrowRight size={15} aria-hidden="true" /></a>
                  <Link href="/china-intakes-deadlines" className="ed-btn ed-btn-on-dark min-h-11 px-5 text-[15px]">See open intakes</Link>
                </div>
              </aside>
            )}

            <div className="update-body" dangerouslySetInnerHTML={{ __html: update.content }} />

            {update.sourceUrls?.length ? (
              <aside className="mt-12 rounded-3xl bg-canvas-soft p-6">
                <h2 className="text-[19px] font-bold text-petrol-800">Official sources</h2>
                <ul className="mt-3 grid gap-2">
                  {update.sourceUrls.map(source => (
                    <li key={source}>
                      <a href={source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[15px] font-semibold text-petrol-600 underline-offset-4 hover:underline">
                        {host(source)} <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 flex items-start gap-2 text-[14px] leading-6 text-ink-soft">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-green-600" aria-hidden="true" />
                  <span>
                    {checked ? `Last reviewed ${checked}` : 'Being re-checked for the current cycle'}
                    {update.reviewer ? ` · Reviewed by ${update.reviewer}` : ''}
                    {fmtDate(update.nextReviewAt) ? ` · Next review ${fmtDate(update.nextReviewAt)}` : ''}
                  </span>
                </p>
              </aside>
            ) : null}

            {stalePost && (
              <aside className="mt-10 rounded-3xl bg-canvas-soft p-6">
                <h2 className="text-[19px] font-bold text-petrol-800">{stale?.archived ? 'This post is from an earlier intake' : 'Intake dates change every cycle'}</h2>
                <p className="mt-2 text-[15px] leading-6 text-ink-soft">
                  Published on {published}. Before you act on any deadline shown, check the live application calendar.
                </p>
                {(stale?.windows ?? []).length > 0 && (
                  <ul className="mt-4 grid gap-2">
                    {(stale?.windows ?? []).map(window => (
                      <li key={window.name} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-white px-4 py-3 text-[15px]">
                        <span className="font-semibold text-petrol-800">{window.name}</span>
                        <span className="rounded-full bg-lime-pale px-2.5 py-0.5 text-[13px] font-semibold text-lime-deep">{window.status}</span>
                        <span className="text-ink-soft">{window.summary}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href="/china-intakes-deadlines" className="ed-btn ed-btn-primary mt-4 min-h-11 px-5 text-[15px]">Check intake deadlines <ArrowRight size={15} aria-hidden="true" /></Link>
              </aside>
            )}
          </div>

          {/* Sticky lead magnet */}
          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Get help with this application">
            <div className="rounded-3xl bg-petrol-800 p-6 text-white">
              <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[14px] font-semibold text-lime">Free eligibility check</p>
              <h2 className="mt-4 font-display text-[28px] font-black leading-[1.02] text-lime">Want to apply for this?</h2>
              <p className="mt-3 text-[16px] leading-7 text-white/85">
                Send your results to EduExpress. A counsellor checks whether you qualify, which documents you need and the full cost, before you pay anything.
              </p>
              <div className="mt-5 grid gap-2.5">
                <a href="#apply-help" className="ed-btn ed-btn-signal min-h-12 text-[15px]">Check my eligibility <ArrowRight size={16} aria-hidden="true" /></a>
                <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick({ label: 'update_sidebar' })} className="ed-btn ed-btn-on-dark min-h-12 text-[15px]">
                  <MessageCircle size={16} aria-hidden="true" /> Ask on WhatsApp
                </a>
                <a href={telHref} onClick={() => trackPhoneClick({ label: 'update_sidebar' })} className="inline-flex min-h-11 items-center justify-center gap-2 text-[15px] font-semibold text-white/85 hover:text-white">
                  <Phone size={15} aria-hidden="true" /> {config.contact.phone}
                </a>
              </div>
              <ul className="mt-5 grid gap-2 border-t border-white/15 pt-5 text-[14px] leading-6 text-white/80">
                <li className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-lime" aria-hidden="true" /> No EduExpress fee before your China visa is approved</li>
                <li className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-lime" aria-hidden="true" /> Every cost in writing</li>
                <li className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-lime" aria-hidden="true" /> Office in Dhanmondi, Dhaka since 2018</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Lead form tied to this post */}
      <section id="apply-help" className="scroll-mt-24 bg-petrol-800 py-16 text-white lg:py-20" data-cta-band>
        <div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_.95fr] lg:items-center lg:gap-16`}>
          <div>
            <h2 className="font-display text-[38px] font-black leading-[0.95] tracking-[-0.01em] text-lime sm:text-[52px]">Apply with a counsellor beside you.</h2>
            <p className="mt-5 max-w-xl text-[18px] leading-[1.6] text-white/85">
              Tell us your study level and results. We reply within one working day with whether this opportunity fits you, the documents to prepare and the realistic timeline.
            </p>
            <ul className="mt-6 grid gap-2.5 text-[16px] text-white/85">
              <li className="flex gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> Eligibility check against the official requirements</li>
              <li className="flex gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> Study plan and document checklist</li>
              <li className="flex gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" /> Admission and scholarship decisions stay with the university</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-1 text-ink">
            <HomeLeadForm
              whatsappHref={waHref}
              source="update_post"
              topic={update.title}
              eyebrow="Free eligibility check"
              heading="Check if you qualify."
              intro="Share a few details. A counsellor calls you within one working day."
            />
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <nav aria-label="Related posts" className="bg-canvas-soft py-16 lg:py-20">
          <div className={wrap}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-[34px] font-black leading-[0.98] text-petrol-800 sm:text-[44px]">Keep reading.</h2>
              <Link href="/updates" className="ed-btn ed-btn-outline min-h-11 px-5 text-[15px]">All updates <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-3">
              {related.map(post => (
                <li key={post.id}>
                  <Link href={`/updates/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white transition hover:-translate-y-1">
                    <div className="relative aspect-[16/10] bg-petrol-800">
                      {post.featuredImage
                        ? <Image src={post.featuredImage} alt="" fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                        : <div className="grid h-full place-items-center font-display text-[22px] font-black text-lime">EduExpress</div>}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <span className="text-[14px] font-semibold text-ink-mute">{post.category || post.categories?.[0] || 'Update'}</span>
                      <span className="mt-1.5 line-clamp-2 text-[18px] font-semibold leading-snug text-petrol-800 group-hover:underline">{post.title}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </article>
  );
}
