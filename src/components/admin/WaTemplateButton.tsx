'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink, MessageCircle } from 'lucide-react';
import type { LeadRecord } from '@/lib/lead-workflow';
import {
  WA_TEMPLATE_OPTIONS,
  buildWhatsAppUrl,
  formatWaTemplateMessage,
  normalizeWhatsappDigits,
  type WaTemplateKey,
} from '@/lib/wa-templates';

type Props = {
  lead: LeadRecord;
  compact?: boolean;
  onEnsureToken?: (leadId: string) => Promise<string | null>;
};

export default function WaTemplateButton({ lead, compact = false, onEnsureToken }: Props) {
  const [open, setOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const digits = normalizeWhatsappDigits(lead.phone);
  if (!digits) return null;

  const resolvePortalUrl = async (): Promise<string | null> => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://eduexpressint.com';
    if (lead.publicToken) return `${origin}/track/${lead.publicToken}`;
    if (!onEnsureToken) return null;
    const token = await onEnsureToken(lead.id);
    return token ? `${origin}/track/${token}` : null;
  };

  const handleOpenWa = async (key: WaTemplateKey) => {
    setBusyKey(key);
    // Open window synchronously before any await so browsers don't block the popup
    const needsAsyncToken = key === 'portal_invite' && !lead.publicToken && Boolean(onEnsureToken);
    const popup = needsAsyncToken && typeof window !== 'undefined' ? window.open('', '_blank') : null;
    try {
      const portalUrl = key === 'portal_invite' ? await resolvePortalUrl() : null;
      const msg = formatWaTemplateMessage(key, lead, portalUrl);
      const url = buildWhatsAppUrl(lead.phone, msg);
      if (url && typeof window !== 'undefined') {
        if (popup && !popup.closed) {
          popup.opener = null;
          popup.location.href = url;
        } else {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      } else if (popup && !popup.closed) {
        popup.close();
      }
      setOpen(false);
    } catch {
      if (popup && !popup.closed) popup.close();
    } finally {
      setBusyKey(null);
    }
  };

  const handleCopyText = async (key: WaTemplateKey) => {
    setBusyKey(key);
    try {
      const portalUrl = key === 'portal_invite' ? await resolvePortalUrl() : null;
      const msg = formatWaTemplateMessage(key, lead, portalUrl);
      await navigator.clipboard?.writeText(msg);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Clipboard API may be unavailable on insecure contexts
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        title={`WhatsApp templates for ${lead.name}`}
        className={
          compact
            ? 'inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition-colors'
            : 'min-h-10 inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors'
        }
      >
        <MessageCircle size={compact ? 12 : 15} className="text-emerald-600" />
        <span>WhatsApp</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 z-50 mt-1.5 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
          >
            <div className="border-b border-slate-100 px-2.5 py-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Bengali WhatsApp
              </p>
              <p className="text-xs font-semibold text-slate-800 truncate">{lead.name}</p>
            </div>
            <div className="mt-1 space-y-1">
              {WA_TEMPLATE_OPTIONS.map((tpl) => {
                const isBusy = busyKey === tpl.key;
                const isCopied = copiedKey === tpl.key;
                return (
                  <div
                    key={tpl.key}
                    className="flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-slate-50 transition-colors"
                  >
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleOpenWa(tpl.key)}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <span>{tpl.labelBn}</span>
                        <ExternalLink size={11} className="text-emerald-600" />
                      </div>
                      <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{tpl.description}</p>
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleCopyText(tpl.key)}
                      title="Copy Bengali text"
                      className="shrink-0 rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                    >
                      {isCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
