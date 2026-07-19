'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsState {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  facebookUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  metaPixelId: string;
  metaAccessToken: string;
  gtmId: string;
  ga4Id: string;
}

const DEFAULTS: SettingsState = {
  siteName: 'EduExpress International',
  siteDescription: "Bangladesh's Evidence-First Education Consultancy",
  contactEmail: 'info@eduexpressint.com',
  contactPhone: '+880 1983-333566',
  whatsappNumber: '+880 1983-333566',
  address: 'House 12/1, Ground Floor, Road 4/A, Dhanmondi, Dhaka 1209',
  facebookUrl: 'https://www.facebook.com/eduexpressint',
  linkedinUrl: 'https://www.linkedin.com/company/eduexpress',
  instagramUrl: 'https://www.instagram.com/eduexpressint/',
  youtubeUrl: 'https://www.youtube.com/@EduExpressInt',
  metaPixelId: '',
  metaAccessToken: '',
  gtmId: '',
  ga4Id: '',
};

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${active ? 'bg-green-500' : 'bg-gray-400'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

export default function SettingsPage() {
  const { isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS);
  const [pixelActive, setPixelActive] = useState(false);
  const [capiActive, setCapiActive] = useState(false);
  const [tokenIsSet, setTokenIsSet] = useState(false);
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
        setPixelActive(!!data.metaPixelId);
        setCapiActive(!!data.metaAccessTokenSet);
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not load settings.' });
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) load();
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
      // Only send the token if the admin typed a new one.
      if (!settings.metaAccessToken) delete payload.metaAccessToken;
      const res = await authenticatedFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const s = data.settings || {};
      setTokenIsSet(!!s.metaAccessTokenSet);
      setPixelActive(!!s.metaPixelId);
      setCapiActive(!!s.metaAccessTokenSet);
      setSettings((prev) => ({ ...prev, metaAccessToken: '' }));
      setMessage({ type: 'success', text: 'Settings saved.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
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
        <section className="rounded-2xl bg-white shadow ring-1 ring-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-[#08263c]">Meta Connectivity Status</h2>
              <p className="text-xs text-gray-500">Facebook Pixel &amp; Conversions API for ad tracking.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Meta Pixel</div>
                <StatusBadge active={pixelActive} />
              </div>
              <div className="text-right">
                <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Conversion API</div>
                <StatusBadge active={capiActive} />
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="metaPixelId">
                Pixel ID {pixelActive ? <span className="text-green-600">• Set</span> : <span className="text-gray-400">• Not set</span>}
              </label>
              <input
                id="metaPixelId"
                name="metaPixelId"
                value={settings.metaPixelId}
                onChange={handleChange}
                placeholder="e.g. 1234567890123456"
                className={field}
              />
              <p className="mt-1 text-xs text-gray-400">Found in Meta Events Manager → Data Sources.</p>
            </div>
            <div>
              <label className={label} htmlFor="metaAccessToken">
                Access Token {tokenIsSet ? <span className="text-green-600">• Set</span> : <span className="text-gray-400">• Not set</span>}
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
              <p className="mt-1 text-xs text-gray-400">Stored securely; never shown again after saving.</p>
            </div>
          </div>
        </section>

        {/* Analytics & Tags */}
        <section className="rounded-2xl bg-white shadow ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#08263c]">Analytics &amp; Tags</h2>
            <p className="text-xs text-gray-500">Google Tag Manager &amp; GA4. Loaded on the public site at runtime.</p>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="gtmId">Google Tag Manager ID</label>
              <input id="gtmId" name="gtmId" value={settings.gtmId} onChange={handleChange} placeholder="GTM-XXXXXXX" className={field} />
              <p className="mt-1 text-xs text-gray-400">Container ID from tagmanager.google.com.</p>
            </div>
            <div>
              <label className={label} htmlFor="ga4Id">GA4 Measurement ID</label>
              <input id="ga4Id" name="ga4Id" value={settings.ga4Id} onChange={handleChange} placeholder="G-XXXXXXXXXX" className={field} />
              <p className="mt-1 text-xs text-gray-400">Only needed if you are not managing GA4 through GTM.</p>
            </div>
          </div>
        </section>

        {/* Site details */}
        <section className="rounded-2xl bg-white shadow ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#08263c]">Site &amp; Contact</h2>
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
            <div>
              <label className={label} htmlFor="contactEmail">Contact email</label>
              <input id="contactEmail" name="contactEmail" value={settings.contactEmail} onChange={handleChange} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="contactPhone">Contact phone</label>
              <input id="contactPhone" name="contactPhone" value={settings.contactPhone} onChange={handleChange} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="whatsappNumber">WhatsApp number</label>
              <input id="whatsappNumber" name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange} className={field} />
            </div>
            <div>
              <label className={label} htmlFor="address">Address</label>
              <input id="address" name="address" value={settings.address} onChange={handleChange} className={field} />
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
                <input id={key} name={key} value={settings[key]} onChange={handleChange} className={field} />
              </div>
            ))}
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
