'use client';

import { useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  ExternalLink,
  Sliders,
  Sparkles,
  Palette,
  Layout,
  Share2,
  BookmarkCheck,
} from 'lucide-react';
import { OPEN_DATA_REPOSITORIES } from '@/lib/open-data';

type DefaultTab = 'china' | 'destinations';
type ThemeMode = 'light' | 'dark' | 'auto';

interface EmbedKitProps {
  compact?: boolean;
  chinaUniversitiesCount?: number;
  activeUniversitiesCount?: number;
  globalDestinationsCount?: number;
}

export default function EmbedCodeSnippet({
  compact = false,
  chinaUniversitiesCount = 353,
  activeUniversitiesCount = 416,
  globalDestinationsCount = 32,
}: EmbedKitProps) {
  const [defaultTab, setDefaultTab] = useState<DefaultTab>('china');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [maxWidth, setMaxWidth] = useState<number>(860);
  const [includeAttribution, setIncludeAttribution] = useState<boolean>(true);
  const [copiedType, setCopiedType] = useState<'iframe' | 'citation' | 'wordpress' | null>(null);

  const queryParams = new URLSearchParams();
  if (defaultTab === 'destinations') {
    queryParams.set('tab', 'destinations');
  }
  if (theme !== 'light') {
    queryParams.set('theme', theme);
  }

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const iframeSrc = `https://eduexpressint.com/embed/cost-calculator${queryString}`;
  const iframeHeight = defaultTab === 'destinations' ? 780 : 740;

  const attributionHtml = includeAttribution
    ? `\n<p style="font-size:12px;color:#64748b;margin-top:8px;font-family:system-ui,-apple-system,sans-serif;">Data provided by <a href="https://eduexpressint.com/compare-costs" target="_blank" rel="noopener" style="color:#0f766e;text-decoration:underline;">EduExpress International Open Dataset</a> (CC BY 4.0 · DOI: ${OPEN_DATA_REPOSITORIES.zenodoDoi})</p>`
    : '';

  const htmlCode = `<iframe src="${iframeSrc}" title="Bangladesh Study Abroad Cost & Scholarship Calculator — EduExpress International" width="100%" height="${iframeHeight}" style="border:0;border-radius:16px;max-width:${maxWidth}px;box-shadow:0 4px 20px -2px rgba(15,23,42,0.08);" loading="lazy"></iframe>${attributionHtml}`;

  const wordpressCode = `[html]\n${htmlCode}\n[/html]`;

  const academicCitation = `EduExpress International (${new Date().getFullYear()}). Bangladesh Global Study Abroad Cost & Scholarship Benchmark Dataset (2027). Zenodo. https://doi.org/${OPEN_DATA_REPOSITORIES.zenodoDoi}`;

  const handleCopy = async (type: 'iframe' | 'citation' | 'wordpress', textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2400);
    } catch {
      setCopiedType(null);
    }
  };

  return (
    <div
      className={`rounded-3xl border border-petrol-800/15 bg-white shadow-sm ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-emerald-800 border border-emerald-200/60">
            <Code2 size={13} aria-hidden="true" /> Publisher &amp; Blogger Embed Kit (CC BY 4.0)
          </span>
          <h3 className="mt-2.5 text-[22px] font-bold tracking-[-0.02em] text-petrol-800">
            Embed the Study Abroad Cost &amp; Scholarship Calculator
          </h3>
          <p className="mt-1.5 max-w-2xl text-[14.5px] leading-6 text-ink-soft">
            Designed for news desks, education portals, student union websites, and education counselors across Bangladesh. Embed our ad-free, mobile-responsive calculator widget with zero registration or API keys.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-petrol-800/20 bg-canvas-soft px-4 py-2 text-[13px] font-semibold text-petrol-800 hover:bg-petrol-800 hover:text-white transition shadow-xs"
          >
            Live Preview <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Widget Customization Toolbar */}
      <div className="mt-6 rounded-2xl border border-petrol-800/10 bg-canvas-soft/60 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-petrol-800">
          <Sliders size={14} aria-hidden="true" /> Customize Widget Parameters
        </div>

        <div className="mt-3.5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Default Tab Selection */}
          <div>
            <label className="block text-[12.5px] font-semibold text-ink-soft mb-1.5">
              Default Tab
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setDefaultTab('china')}
                className={`flex-1 rounded-xl px-2.5 py-1.5 text-[12px] font-semibold transition ${
                  defaultTab === 'china'
                    ? 'bg-petrol-800 text-lime shadow-xs'
                    : 'border border-petrol-800/20 bg-white text-petrol-800 hover:bg-canvas-soft'
                }`}
              >
                China ({chinaUniversitiesCount})
              </button>
              <button
                type="button"
                onClick={() => setDefaultTab('destinations')}
                className={`flex-1 rounded-xl px-2.5 py-1.5 text-[12px] font-semibold transition ${
                  defaultTab === 'destinations'
                    ? 'bg-petrol-800 text-lime shadow-xs'
                    : 'border border-petrol-800/20 bg-white text-petrol-800 hover:bg-canvas-soft'
                }`}
              >
                32 Global Countries
              </button>
            </div>
          </div>

          {/* Theme Option */}
          <div>
            <label className="block text-[12.5px] font-semibold text-ink-soft mb-1.5">
              Color Theme
            </label>
            <div className="flex gap-1.5">
              {(['light', 'dark', 'auto'] as ThemeMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTheme(m)}
                  className={`flex-1 rounded-xl px-2.5 py-1.5 text-[12px] font-semibold capitalize transition ${
                    theme === m
                      ? 'bg-petrol-800 text-lime shadow-xs'
                      : 'border border-petrol-800/20 bg-white text-petrol-800 hover:bg-canvas-soft'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Width Constraint */}
          <div>
            <label className="block text-[12.5px] font-semibold text-ink-soft mb-1.5">
              Max Width ({maxWidth}px)
            </label>
            <div className="flex gap-1.5">
              {[680, 860, 1080].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setMaxWidth(w)}
                  className={`flex-1 rounded-xl px-2.5 py-1.5 text-[12px] font-semibold transition ${
                    maxWidth === w
                      ? 'bg-petrol-800 text-lime shadow-xs'
                      : 'border border-petrol-800/20 bg-white text-petrol-800 hover:bg-canvas-soft'
                  }`}
                >
                  {w === 680 ? 'Compact' : w === 860 ? 'Standard' : 'Wide'}
                </button>
              ))}
            </div>
          </div>

          {/* Attribution Toggle */}
          <div>
            <label className="block text-[12.5px] font-semibold text-ink-soft mb-1.5">
              Attribution Link
            </label>
            <button
              type="button"
              onClick={() => setIncludeAttribution(!includeAttribution)}
              className={`w-full rounded-xl px-3 py-1.5 text-[12px] font-semibold transition flex items-center justify-center gap-1.5 ${
                includeAttribution
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-white border border-slate-300 text-slate-700'
              }`}
            >
              <BookmarkCheck size={14} /> {includeAttribution ? 'Included (CC BY 4.0)' : 'Omitted'}
            </button>
          </div>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-petrol-800/15 bg-[#0f2940]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5 text-[12px] text-white/75 bg-[#0b1f31]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Embed Code Snippet</span>
            <span className="text-white/40">·</span>
            <span className="text-[11px] text-emerald-400">Pulls live {activeUniversitiesCount} verified universities</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy('wordpress', wordpressCode)}
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11.5px] font-semibold text-white/90 hover:bg-white/20 transition"
              title="Copy for WordPress Custom HTML block"
            >
              {copiedType === 'wordpress' ? <Check size={12} className="text-lime" /> : <Copy size={12} />} WordPress
            </button>
            <button
              type="button"
              onClick={() => handleCopy('iframe', htmlCode)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-lime px-3 py-1 text-[12px] font-bold text-petrol-900 hover:bg-white transition shadow-xs"
            >
              {copiedType === 'iframe' ? (
                <>
                  <Check size={13} aria-hidden="true" /> Copied HTML!
                </>
              ) : (
                <>
                  <Copy size={13} aria-hidden="true" /> Copy iframe
                </>
              )}
            </button>
          </div>
        </div>

        <pre className="overflow-x-auto p-4 text-[12px] font-mono leading-5 text-slate-100 selection:bg-petrol-600">
          <code>{htmlCode}</code>
        </pre>
      </div>

      {/* Press & Academic Citation Box */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-petrol-800/10 bg-canvas-soft p-3.5 sm:p-4 text-[13px]">
        <div className="flex items-center gap-2 text-petrol-800">
          <Share2 size={15} className="text-emerald-700" aria-hidden="true" />
          <span className="font-semibold">Academic &amp; Media Citation:</span>
          <span className="hidden sm:inline text-ink-soft">DOI {OPEN_DATA_REPOSITORIES.zenodoDoi} (DataCite)</span>
        </div>

        <button
          type="button"
          onClick={() => handleCopy('citation', academicCitation)}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-petrol-800 hover:text-emerald-700 underline underline-offset-4 transition"
        >
          {copiedType === 'citation' ? <Check size={13} className="text-emerald-700" /> : <Copy size={13} />}
          {copiedType === 'citation' ? 'Copied Citation!' : 'Copy Citation Text'}
        </button>
      </div>
    </div>
  );
}
