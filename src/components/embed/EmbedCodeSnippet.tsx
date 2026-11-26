'use client';

import { useState } from 'react';
import { Check, Code2, Copy, ExternalLink } from 'lucide-react';
import { OPEN_DATA_REPOSITORIES } from '@/lib/open-data';

type DefaultTab = 'china' | 'destinations';

export default function EmbedCodeSnippet({
  compact = false,
  chinaUniversitiesCount = 150,
  activeUniversitiesCount = 159,
  globalDestinationsCount = 32,
}: {
  compact?: boolean;
  chinaUniversitiesCount?: number;
  activeUniversitiesCount?: number;
  globalDestinationsCount?: number;
}) {
  const [defaultTab, setDefaultTab] = useState<DefaultTab>('china');
  const [copied, setCopied] = useState(false);

  const iframeSrc =
    defaultTab === 'destinations'
      ? 'https://eduexpressint.com/embed/cost-calculator?tab=destinations'
      : 'https://eduexpressint.com/embed/cost-calculator';

  const iframeHeight = defaultTab === 'destinations' ? 760 : 720;

  const htmlCode = `<iframe src="${iframeSrc}" title="Bangladesh Study Abroad Cost & Scholarship Calculator — EduExpress International" width="100%" height="${iframeHeight}" style="border:0;border-radius:16px;max-width:860px;" loading="lazy"></iframe>\n<p style="font-size:12px;color:#475569;">Data: <a href="https://eduexpressint.com/compare-costs" target="_blank" rel="noopener">EduExpress International Study Abroad Cost &amp; Scholarship Benchmark</a> (CC BY 4.0 · DOI: ${OPEN_DATA_REPOSITORIES.zenodoDoi})</p>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className={`rounded-3xl border border-petrol-800/15 bg-white ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-7'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-petrol-800/10 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-petrol-800">
            <Code2 size={13} aria-hidden="true" /> Free Embeddable Widget (CC BY 4.0)
          </span>
          <h3 className="mt-2.5 text-[20px] font-bold tracking-[-0.02em] text-petrol-800">
            Embed the Bangladesh Study Abroad Cost &amp; Scholarship Calculator
          </h3>
          <p className="mt-1.5 max-w-2xl text-[14.5px] leading-6 text-ink-soft">
            Schools, university career portals, student blogs, and journalists can embed this live, ad-free calculator with one line of HTML. Pulls directly from our verified {activeUniversitiesCount}-university catalog ({chinaUniversitiesCount} in China with scholarship &amp; language filters) and {globalDestinationsCount}-country global benchmark.
          </p>
        </div>

        <a
          href={iframeSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-petrol-800/20 bg-canvas-soft px-3.5 py-2 text-[13px] font-semibold text-petrol-800 hover:bg-petrol-800 hover:text-white transition"
        >
          Open live preview <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>

      {/* Default View Selector */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] font-semibold text-ink-soft">Default tab:</span>
        <button
          type="button"
          onClick={() => setDefaultTab('china')}
          className={`rounded-full px-3 py-1 text-[12.5px] font-semibold transition ${
            defaultTab === 'china'
              ? 'bg-petrol-800 text-lime'
              : 'border border-petrol-800/20 bg-canvas-soft text-petrol-800 hover:bg-petrol-800/10'
          }`}
        >
          China Cost &amp; Scholarships ({chinaUniversitiesCount} Universities)
        </button>
        <button
          type="button"
          onClick={() => setDefaultTab('destinations')}
          className={`rounded-full px-3 py-1 text-[12.5px] font-semibold transition ${
            defaultTab === 'destinations'
              ? 'bg-petrol-800 text-lime'
              : 'border border-petrol-800/20 bg-canvas-soft text-petrol-800 hover:bg-petrol-800/10'
          }`}
        >
          {globalDestinationsCount}-Country Global &amp; Scholarship Matrix
        </button>
      </div>

      {/* Code Block */}
      <div className="mt-3.5 overflow-hidden rounded-2xl border border-petrol-800/15 bg-[#0f2940]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[12px] text-white/75">
          <span>HTML iframe embed snippet</span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1 text-[12px] font-bold text-petrol-900 transition hover:bg-white"
          >
            {copied ? (
              <>
                <Check size={13} aria-hidden="true" /> Copied HTML
              </>
            ) : (
              <>
                <Copy size={13} aria-hidden="true" /> Copy embed code
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-[12.5px] leading-5 text-slate-100">
          <code>{htmlCode}</code>
        </pre>
      </div>
    </div>
  );
}
