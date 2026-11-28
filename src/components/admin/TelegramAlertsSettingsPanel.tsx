'use client';

import { useEffect, useState } from 'react';
import { BellRing, CheckCircle2, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function TelegramAlertsSettingsPanel() {
  const { authenticatedFetch } = useAuth();
  const [tokenInput, setTokenInput] = useState('');
  const [tokenIsSet, setTokenIsSet] = useState(false);
  const [chatId, setChatId] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [alertOnNewLead, setAlertOnNewLead] = useState(true);
  const [alertOnHighGpaOnly, setAlertOnHighGpaOnly] = useState(false);
  const [minGpaThreshold, setMinGpaThreshold] = useState('3.5');
  const [alertOnPortalActivity, setAlertOnPortalActivity] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let active = true;
    authenticatedFetch('/api/admin/notifications', { cache: 'no-store' })
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.telegramConfig) return;
        const cfg = data.telegramConfig;
        setTokenIsSet(Boolean(cfg.telegramBotTokenSet));
        setChatId(typeof cfg.telegramChatId === 'string' ? cfg.telegramChatId : '');
        if (cfg.preferences) {
          setEnabled(Boolean(cfg.preferences.enabled));
          setAlertOnNewLead(Boolean(cfg.preferences.alertOnNewLead));
          setAlertOnHighGpaOnly(Boolean(cfg.preferences.alertOnHighGpaOnly));
          setMinGpaThreshold(String(cfg.preferences.minGpaThreshold ?? 3.5));
          setAlertOnPortalActivity(Boolean(cfg.preferences.alertOnPortalActivity));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [authenticatedFetch]);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const parsedGpa = Number.parseFloat(minGpaThreshold);
      const res = await authenticatedFetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(tokenInput.trim() ? { telegramBotToken: tokenInput.trim() } : {}),
          telegramChatId: chatId.trim(),
          preferences: {
            enabled,
            alertOnNewLead,
            alertOnHighGpaOnly,
            minGpaThreshold: Number.isFinite(parsedGpa) ? parsedGpa : 3.5,
            alertOnPortalActivity,
          },
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || json.message || 'Could not save alert settings.');
      setTokenInput('');
      setTokenIsSet(Boolean(json.telegramConfig?.telegramBotTokenSet));
      setFeedback({ ok: true, text: 'Telegram & live notification settings saved.' });
    } catch (err) {
      setFeedback({ ok: false, text: err instanceof Error ? err.message : 'Save failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setFeedback(null);
    try {
      const res = await authenticatedFetch('/api/admin/notifications', { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || json.message || 'Test alert failed.');
      setFeedback({ ok: true, text: 'Test alert delivered cleanly to Telegram!' });
    } catch (err) {
      setFeedback({ ok: false, text: err instanceof Error ? err.message : 'Test alert failed.' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white shadow ring-1 ring-gray-100">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <BellRing size={18} className="text-[#12436b]" />
          <div>
            <h2 className="text-lg font-semibold text-[#0f3a5c]">Real-Time Hot Lead &amp; Student Portal Alerts</h2>
            <p className="text-xs text-gray-500">
              Instant Telegram notifications when high-GPA leads arrive or students upload documents / message on /track/[token].
            </p>
          </div>
        </div>
        {tokenIsSet && chatId && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
            <CheckCircle2 size={13} /> Configured
          </span>
        )}
      </div>

      <div className="space-y-4 p-6">
        {feedback && (
          <div
            className={`rounded-xl px-4 py-3 text-xs font-semibold ${
              feedback.ok ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Telegram Bot Token {tokenIsSet && <span className="text-xs font-normal text-emerald-700">(Saved &amp; encrypted — leave blank to keep)</span>}
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder={tokenIsSet ? '•••••••••••••• (saved)' : '1234567890:AAH...'}
              autoComplete="off"
              className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-[#12436b] focus:bg-white focus:outline-none"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Telegram Group / Chat ID
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="-1001234567890 or 123456789"
              className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-[#12436b] focus:bg-white focus:outline-none"
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1">
          <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="size-4 rounded text-[#12436b]"
            />
            Enable Telegram Push
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={alertOnNewLead}
              onChange={(e) => setAlertOnNewLead(e.target.checked)}
              className="size-4 rounded text-[#12436b]"
            />
            Alert on New Leads
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-800">
            <input
              type="checkbox"
              checked={alertOnPortalActivity}
              onChange={(e) => setAlertOnPortalActivity(e.target.checked)}
              className="size-4 rounded text-[#12436b]"
            />
            Alert on Student Uploads/Msgs
          </label>
          <label className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-800">
            <span className="inline-flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={alertOnHighGpaOnly}
                onChange={(e) => setAlertOnHighGpaOnly(e.target.checked)}
                className="size-4 rounded text-[#12436b]"
              />
              Hot GPA Only (&gt;=)
            </span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5.5"
              value={minGpaThreshold}
              onChange={(e) => setMinGpaThreshold(e.target.value)}
              className="w-14 rounded border border-gray-300 bg-white px-1.5 py-0.5 text-center text-xs"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
          {Boolean(tokenInput.trim()) && (
            <span className="text-[11px] font-medium text-amber-700">
              Save preferences first to test the new bot token.
            </span>
          )}
          <button
            type="button"
            disabled={testing || !tokenIsSet || Boolean(tokenInput.trim())}
            onClick={handleTest}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
          >
            <Send size={13} /> {testing ? 'Sending Test…' : 'Send Test Alert'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="rounded-lg bg-[#12436b] px-4 py-2 text-xs font-bold text-white hover:bg-[#0f3a5c] disabled:opacity-60"
          >
            {saving ? 'Saving Alerts…' : 'Save Alert Preferences'}
          </button>
        </div>
      </div>
    </section>
  );
}
