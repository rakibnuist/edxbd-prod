'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import MetaConnectionPanel from '@/components/admin/MetaConnectionPanel';

interface SettingsState {
  siteName: string;
  siteDescription: string;
  facebookUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  introVideoTitle: string;
  introVideoUrl: string;
  introVideoPoster: string;
  metaPixelId: string;
  metaAccessToken: string;
  gtmId: string;
  ga4Id: string;
}

const DEFAULTS: SettingsState = {
  siteName: 'EduExpress International',
  siteDescription: "Bangladesh's Evidence-First Education Consultancy",
  facebookUrl: 'https://www.facebook.com/eduexpressint',
  linkedinUrl: 'https://www.linkedin.com/company/eduexpress',
  instagramUrl: 'https://www.instagram.com/eduexpressint/',
  youtubeUrl: 'https://www.youtube.com/@EduExpressInt',
  introVideoTitle: 'Meet EduExpress before you visit',
  introVideoUrl: '',
  introVideoPoster: '/images/office/dhanmondi-brandwall.webp',
  metaPixelId: '',
  metaAccessToken: '',
  gtmId: '',
  ga4Id: '',
};

export default function SettingsPage() {
  const { isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS);
  const [pixelActive, setPixelActive] = useState(false);
  const [trackingRefresh, setTrackingRefresh] = useState(0);
  const [tokenIsSet, setTokenIsSet] = useState(false);
  const [pixelSource, setPixelSource] = useState<'settings' | 'environment' | 'default'>('settings');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authenticatedFetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({
          ...prev,
          ...Object.fromEntries(Object.entries(data).filter(([, v]) => typeof v === 'string')),
          metaAccessToken: '', // never prefill the secret
        }));
        setTokenIsSet(!!data.metaAccessTokenSet);
        setPixelActive(!!data.metaPixelIdSet);
        setPixelSource(['default', 'environment'].includes(data.metaPixelIdSource) ? data.metaPixelIdSource : 'settings');

      }
    } catch {
      setMessage({ type: 'error', text: 'Could not load settings.' });
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [authLoading, isAuthenticated, load]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setSettings((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const payload: Record<string, string> = { ...settings };
      // Contact details are managed only by the canonical Office record.
      delete payload.contactEmail;
      delete payload.contactPhone;
      delete payload.whatsappNumber;
      delete payload.address;
      // Only send the token if the admin typed a new one.
      if (!settings.metaAccessToken) delete payload.metaAccessToken;
      const res = await authenticatedFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to save settings.');
      }
      const data = await res.json();
      const s = data.settings || {};
      setTokenIsSet(!!s.metaAccessTokenSet);
      setPixelActive(!!s.metaPixelIdSet);
      setPixelSource(['default', 'environment'].includes(s.metaPixelIdSource) ? s.metaPixelIdSource : 'settings');
      setTrackingRefresh(value => value + 1);
      setSettings((prev) => ({ ...prev, metaAccessToken: '' }));
      setMessage({ type: 'success', text: 'Settings saved.' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const field = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#174f7a] focus:outline-none focus:ring-2 focus:ring-[#174f7a]/20';
  const label = 'mb-1 block text-sm font-medium text-gray-700';

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading settings…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#08263c] sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage site details and marketing integrations.</p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 ring-1 ring-green-200'
              : 'bg-red-50 text-red-800 ring-1 ring-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meta Connectivity */}
        <section id="meta-tracking" className="scroll-mt-6 rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-[#08263c]">Meta Connectivity Status</h2>
              <p className="text-xs text-gray-500">Facebook Pixel &amp; Conversions API for ad tracking.</p>
            </div>
            <button type="submit" disabled={isSaving} className="min-h-10 rounded-lg bg-gray-900 px-4 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60">{isSaving ? 'Saving…' : 'Save settings'}</button>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="metaPixelId">
                Pixel ID {pixelActive ? <span className="text-green-600">• Set</span> : <span className="text-gray-600">• Not set</span>}
              </label>
              <input
                id="metaPixelId"
                name="metaPixelId"
                value={settings.metaPixelId}
                onChange={handleChange}
                placeholder="e.g. 1234567890123456"
                inputMode="numeric"
                pattern="[0-9]{10,32}"
                maxLength={32}
                className={field}
              />
              <p className="mt-1 text-xs text-gray-600">Found in Meta Events Manager → Data Sources.{pixelSource === 'default' && !settings.metaPixelId ? ' The approved default Pixel is currently configured.' : pixelSource === 'environment' && !settings.metaPixelId ? ' The server-configured Pixel is currently configured.' : ''}</p>
            </div>
            <div>
              <label className={label} htmlFor="metaAccessToken">
                Access Token {tokenIsSet ? <span className="text-green-600">• Set</span> : <span className="text-gray-600">• Not set</span>}
              </label>
              <input
                id="metaAccessToken"
                name="metaAccessToken"
                type="password"
                value={settings.metaAccessToken}
                onChange={handleChange}
                placeholder={tokenIsSet ? '•••••••• (leave blank to keep)' : 'Paste Conversions API token'}
                className={field}
                autoComplete="new-password"
              />
              <p className="mt-1 text-xs text-gray-600">Kept server-side and never returned to the browser. Generate the token for this dataset in Meta Events Manager → Settings → Conversions API → Set up manually.</p>
            </div>
          </div>
        </section>

        <MetaConnectionPanel refreshKey={trackingRefresh} pendingChanges={Boolean(settings.metaAccessToken)} />

        {/* Analytics & Tags */}
        <section className="rounded-2xl bg-white shadow ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#08263c]">Analytics &amp; Tags</h2>
            <p className="text-xs text-gray-500">Google Tag Manager &amp; GA4. Loaded on the public site at runtime.</p>
            <p className="mt-2 text-xs text-amber-700">Use either GTM to manage GA4, or enter GA4 directly—not both. Tracking loads only after a visitor accepts cookies.</p>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="gtmId">Google Tag Manager ID</label>
              <input id="gtmId" name="gtmId" value={settings.gtmId} onChange={handleChange} placeholder="GTM-XXXXXXX" pattern="GTM-[A-Za-z0-9]+" maxLength={32} className={field} />
              <p className="mt-1 text-xs text-gray-600">Container ID from tagmanager.google.com.</p>
            </div>
            <div>
              <label className={label} htmlFor="ga4Id">GA4 Measurement ID</label>
              <input id="ga4Id" name="ga4Id" value={settings.ga4Id} onChange={handleChange} placeholder="G-XXXXXXXXXX" pattern="G-[A-Za-z0-9]+" maxLength={32} className={field} />
              <p className="mt-1 text-xs text-gray-600">Only needed if you are not managing GA4 through GTM.</p>
            </div>
          </div>
        </section>

        {/* Site details */}
        <section className="rounded-2xl bg-white shadow ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#08263c]">Site Identity</h2>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label} htmlFor="siteName">Site name</label>
              <input id="siteName" name="siteName" value={settings.siteName} onChange={handleChange} className={field} />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="siteDescription">Site description</label>
              <textarea id="siteDescription" name="siteDescription" value={settings.siteDescription} onChange={handleChange} rows={2} className={field} />
            </div>
            <div className="sm:col-span-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              Phone numbers, email, address and opening hours have one source of truth. Manage them in{' '}
              <Link href="/admin/trust#office-records" className="font-bold underline">Company Records → Real offices</Link>.
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="rounded-2xl bg-white shadow ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#08263c]">Social Links</h2>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {(['facebookUrl', 'linkedinUrl', 'instagramUrl', 'youtubeUrl'] as const).map((key) => (
              <div key={key}>
                <label className={label} htmlFor={key}>{key.replace('Url', '')}</label>
                <input id={key} name={key} type="url" maxLength={500} value={settings[key]} onChange={handleChange} className={field} />
              </div>
            ))}
          </div>
        </section>

        {/* Homepage video */}
        <section className="rounded-2xl bg-white shadow ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#08263c]">Homepage Video Introduction</h2>
            <p className="text-xs text-gray-500">Add a YouTube link, YouTube embed link, or direct MP4/WebM URL. Leave the URL empty to show the office poster with a YouTube button.</p>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label} htmlFor="introVideoTitle">Section title</label>
              <input id="introVideoTitle" name="introVideoTitle" value={settings.introVideoTitle} onChange={handleChange} className={field} />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="introVideoUrl">Video URL</label>
              <input id="introVideoUrl" name="introVideoUrl" type="url" value={settings.introVideoUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." className={field} />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="introVideoPoster">Poster image path or URL</label>
              <input id="introVideoPoster" name="introVideoPoster" value={settings.introVideoPoster} onChange={handleChange} placeholder="/images/office/dhanmondi-brandwall.webp" className={field} />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-[#174f7a] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#08263c] disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
