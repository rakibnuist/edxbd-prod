'use client';

import { useState } from 'react';
import { Check, Code2, Copy } from 'lucide-react';

type Props = {
  briefId: string;
  englishBriefText: string;
  bengaliBriefText: string;
  htmlBacklinkSnippet: string;
};

/** One-click clipboard actions for journalists and editors to copy EN/BN press briefs and HTML backlinks. */
export default function PressBriefCopyActions({
  briefId,
  englishBriefText,
  bengaliBriefText,
  htmlBacklinkSnippet,
}: Props) {
  const [copied, setCopied] = useState<'en' | 'bn' | 'html' | null>(null);

  const copyText = async (text: string, kind: 'en' | 'bn' | 'html') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied((prev) => (prev === kind ? null : prev)), 2500);
    } catch {
      /* clipboard may be blocked in unprivileged contexts */
    }
  };

  return (
    <div data-brief-id={briefId} className="mt-5 flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={() => copyText(englishBriefText, 'en')}
        className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-petrol-800 px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-petrol-800/90"
      >
        {copied === 'en' ? (
          <>
            <Check size={15} className="text-lime" aria-hidden="true" />
            English brief copied
          </>
        ) : (
          <>
            <Copy size={15} aria-hidden="true" />
            Copy English brief
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => copyText(bengaliBriefText, 'bn')}
        className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-petrol-800/20 bg-white px-4 py-2 text-[14px] font-semibold text-petrol-800 transition hover:border-petrol-800 hover:bg-lime-pale"
      >
        {copied === 'bn' ? (
          <>
            <Check size={15} className="text-lime-deep" aria-hidden="true" />
            বাংলা ব্রিফ কপি হয়েছে
          </>
        ) : (
          <>
            <Copy size={15} aria-hidden="true" />
            Copy বাংলা ব্রিফ
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => copyText(htmlBacklinkSnippet, 'html')}
        className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-petrol-800/20 bg-white px-4 py-2 text-[14px] font-semibold text-petrol-800 transition hover:border-petrol-800 hover:bg-lime-pale"
      >
        {copied === 'html' ? (
          <>
            <Check size={15} className="text-lime-deep" aria-hidden="true" />
            HTML backlink copied
          </>
        ) : (
          <>
            <Code2 size={15} aria-hidden="true" />
            Copy HTML backlink
          </>
        )}
      </button>
    </div>
  );
}
