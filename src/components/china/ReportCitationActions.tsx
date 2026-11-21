'use client';

import { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { trackCostSheetDownloaded } from '@/lib/conversion-events';

type Props = {
  citationText: string;
  datasetUrl: string;
  downloadPath?: string;
  downloadFilename?: string;
  analyticsDestination?: string;
  analyticsLabel?: string;
};

/** Copyable media/academic citation and tracked JSON dataset download actions. */
export default function ReportCitationActions({
  citationText,
  datasetUrl,
  downloadPath = '/china-study-report.json',
  downloadFilename = 'eduexpress-china-study-report.json',
  analyticsDestination = 'china',
  analyticsLabel = 'china_study_report_json',
}: Props) {
  const [copied, setCopied] = useState<'citation' | 'url' | null>(null);

  const copyText = async (text: string, kind: 'citation' | 'url') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied((prev) => (prev === kind ? null : prev)), 2500);
    } catch {
      /* clipboard may be blocked in unprivileged contexts */
    }
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => copyText(citationText, 'citation')}
        className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-white/20"
      >
        {copied === 'citation' ? (
          <>
            <Check size={15} className="text-lime" aria-hidden="true" />
            Citation copied
          </>
        ) : (
          <>
            <Copy size={15} aria-hidden="true" />
            Copy APA citation
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => copyText(datasetUrl, 'url')}
        className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-white/20"
      >
        {copied === 'url' ? (
          <>
            <Check size={15} className="text-lime" aria-hidden="true" />
            JSON URL copied
          </>
        ) : (
          <>
            <Copy size={15} aria-hidden="true" />
            Copy JSON URL
          </>
        )}
      </button>

      <a
        href={downloadPath}
        download={downloadFilename}
        onClick={() =>
          trackCostSheetDownloaded({
            destination: analyticsDestination,
            label: analyticsLabel,
          })
        }
        className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-lime px-4 py-2 text-[14px] font-bold text-petrol-800 transition hover:bg-lime/90"
      >
        <Download size={15} aria-hidden="true" />
        Download JSON dataset
      </a>
    </div>
  );
}
