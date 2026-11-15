'use client';

import Link from 'next/link';
import { ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import type { CscDirectoryEnrichment } from '@/lib/csc-directory-enrichment';

/**
 * Top orientation block and verified CSC university comparison table rendered
 * above the 300+ university directory body on `complete-csc-universities-list-2026`.
 */
export function CscDirectoryOverview({ data }: { data: CscDirectoryEnrichment }) {
  return (
    <div className="mb-10 space-y-8">
      <section className="rounded-3xl bg-canvas-soft p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />
          <div className="space-y-3">
            <h2 className="text-[19px] font-bold text-petrol-800">
              2027 CSC Quick Navigation for Bangladeshi Students
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              Every highlighted Chinese university below links directly to its EduExpress admission profile (
              <strong>{data.matchedListCount}</strong> matched profiles in this list). Confirm 5-digit Type B Agency
              Numbers and updated international admissions emails on the official CSC portal alongside our verified guides:
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1 text-sm font-medium">
              <Link
                href="/csc-scholarship-bangladesh"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-petrol-800 shadow-sm ring-1 ring-slate-200 transition hover:ring-petrol-600"
              >
                CSC Scholarship Bangladesh Guide
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/bn/csc-scholarship-bangladesh"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-petrol-800 shadow-sm ring-1 ring-slate-200 transition hover:ring-petrol-600"
              >
                বাংলাদেশি শিক্ষার্থীদের CSC গাইড
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/china-universities"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-petrol-800 shadow-sm ring-1 ring-slate-200 transition hover:ring-petrol-600"
              >
                Verified China University Profiles
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <a
                href="https://www.campuschina.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-teal-800 shadow-sm ring-1 ring-slate-200 transition hover:ring-teal-600"
              >
                Official CSC Portal (campuschina.org)
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {data.featuredUniversities.length > 0 && (
        <section aria-labelledby="csc-verified-universities-heading">
          <h2 id="csc-verified-universities-heading" className="mb-2 text-[22px] font-bold text-petrol-800">
            Featured CSC Universities with Verified EduExpress Profiles
          </h2>
          <p className="mb-4 text-sm text-slate-600">
            Quick comparison of active Chinese university records showing city, baseline tuition guidance, recorded
            scholarship categories, and direct links to live 2027 CSC guides.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-canvas-soft text-xs font-semibold uppercase tracking-wide text-petrol-800">
                <tr>
                  <th scope="col" className="px-4 py-3">University</th>
                  <th scope="col" className="px-4 py-3">City</th>
                  <th scope="col" className="px-4 py-3">Tuition Baseline</th>
                  <th scope="col" className="px-4 py-3">Recorded Scholarships</th>
                  <th scope="col" className="px-4 py-3">Resources</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {data.featuredUniversities.map((row) => (
                  <tr key={row.slug} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-semibold text-petrol-800">
                      <Link href={`/universities/${row.slug}`} className="hover:underline">
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.city}</td>
                    <td className="px-4 py-3">{row.tuitionSummary}</td>
                    <td className="px-4 py-3">{row.scholarshipSummary}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <Link
                          href={`/universities/${row.slug}`}
                          className="font-medium text-teal-800 hover:underline"
                        >
                          University Profile
                        </Link>
                        {row.guideSlug && (
                          <Link
                            href={`/updates/${row.guideSlug}`}
                            className="text-xs font-medium text-petrol-700 hover:underline"
                          >
                            2027 CSC Guide
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Active 2027 CSC guide directory, Type B agency number verification guidance,
 * and structured FAQ block rendered below the directory body.
 */
export function CscDirectoryFooter({ data }: { data: CscDirectoryEnrichment }) {
  return (
    <div className="mt-12 space-y-10">
      <section className="rounded-3xl bg-canvas-soft p-6">
        <h2 className="mb-2 text-[19px] font-bold text-petrol-800">
          How to Verify 5-Digit CSC Agency Numbers &amp; Official Admissions Emails
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          CSC Type B requires selecting one institution on the China Scholarship Council portal using its official
          5-digit Agency Number alongside a separate university portal submission. Because international admissions emails
          and degree quotas change every intake, always confirm the active 5-digit code and current international office
          address directly on{' '}
          <a
            href="https://www.campuschina.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal-800 underline"
          >
            campuschina.org
          </a>{' '}
          and the university&apos;s current Type B call rather than relying on outdated third-party spreadsheets.
        </p>
      </section>

      {data.cscGuides.length > 0 && (
        <section aria-labelledby="csc-guides-heading">
          <h2 id="csc-guides-heading" className="mb-4 text-[22px] font-bold text-petrol-800">
            Active 2027 CSC Scholarship Guides &amp; University Calls
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {data.cscGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/updates/${guide.slug}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-petrol-800 transition hover:border-petrol-600"
              >
                <span className="line-clamp-2">{guide.title}</span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-petrol-700"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.faqs.length > 0 && (
        <section aria-labelledby="csc-faq-heading">
          <h2 id="csc-faq-heading" className="mb-4 text-[22px] font-bold text-petrol-800">
            Frequently Asked Questions: CSC University List 2027
          </h2>
          <div className="space-y-4">
            {data.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-bold text-petrol-800">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
