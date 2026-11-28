'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import LeadFlowSettingsPanel from '@/components/admin/LeadFlowSettingsPanel';
import MetaConnectionPanel from '@/components/admin/MetaConnectionPanel';
import TelegramAlertsSettingsPanel from '@/components/admin/TelegramAlertsSettingsPanel';
import {
  buildGoogleMapsUrl,
  DEFAULT_OFFICE_LABEL,
  DEFAULT_OFFICE_LATITUDE,
  DEFAULT_OFFICE_LONGITUDE,
  DEFAULT_OFFICE_RADIUS_METERS,
} from '@/lib/office-location';

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
  officeLatitude: string;
  officeLongitude: string;
  officeRadiusMeters: string;
  officeLocationStrict: string;
}

const DEFAULTS: SettingsState = {
  siteName: 'EduExpress International',
  siteDescription: "Bangladesh's Evidence-First Education Consultancy",
  facebookUrl: 'https://www.facebook.com/eduexpressint',
  linkedinUrl: 'https://www.linkedin.com/company/eduexpressint',
  instagramUrl: 'https://www.instagram.com/eduexpressint/',
  youtubeUrl: 'https://www.youtube.com/@EduExpressInt',
  introVideoTitle: 'Meet EduExpress before you visit',
  introVideoUrl: '',
  introVideoPoster: '/images/office/dhanmondi-brandwall.webp',
  metaPixelId: '',
  metaAccessToken: '',
  gtmId: '',
  ga4Id: '',
  officeLatitude: '',
  officeLongitude: '',
  officeRadiusMeters: '',
  officeLocationStrict: 'false',
};

const ALLOWED_SETTINGS_FORM_KEYS = Object.keys(DEFAULTS) as Array<keyof SettingsState>;

export default function SettingsPage() {
  const { isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS);
  const [savedMetaPixelId, setSavedMetaPixelId] = useState('');
  const [loadFailed, setLoadFailed] = useState(false);
  const [pixelActive, setPixelActive] = useState(false);
  const [trackingRefresh, setTrackingRefresh] = useState(0);
  const [tokenIsSet, setTokenIsSet] = useState(false);
  const [tokenSavedAt, setTokenSavedAt] = useState<string | null>(null);
  const [pixelSource, setPixelSource] = useState<'settings' | 'environment' | 'default'>('settings');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setLoadFailed(false);
      const res = await authenticatedFetch('/api/admin/settings', { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoadFailed(true);
        setMessage({
          type: 'error',
          text: data.error || data.message || `Could not load settings (${res.status}).`,
        });
        return;
      }
      // Strictly whitelist only the 17 form fields so LeadFlowSettingsPanel keys are never overwritten!
      const picked: Partial<SettingsState> = {};
      for (const key of ALLOWED_SETTINGS_FORM_KEYS) {
        if (key === 'metaAccessToken') continue;
        if (typeof data[key] === 'string') {
          picked[key] = data[key];
        }
      }
      setSettings((prev) => ({
        ...prev,
        ...picked,
        metaAccessToken: '', // never prefill the secret
      }));
      setSavedMetaPixelId(typeof data.metaPixelId === 'string' ? data.metaPixelId : '');
      setTokenIsSet(!!data.metaAccessTokenSet);
      setTokenSavedAt(typeof data.metaAccessTokenSavedAt === 'string' ? data.metaAccessTokenSavedAt : null);
      setPixelActive(!!data.metaPixelIdSet);
      setPixelSource(['default', 'environment'].includes(data.metaPixelIdSource) ? data.metaPixelIdSource : 'settings');
    } catch {
      setLoadFailed(true);
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
    if (loadFailed) {
      setMessage({ type: 'error', text: 'Reload settings first before saving so existing values are not overwritten.' });
      return;
    }
    setIsSaving(true);
    setMessage(null);
    try {
      const payload: Record<string, string> = {};
      for (const key of ALLOWED_SETTINGS_FORM_KEYS) {
        if (key === 'metaAccessToken' && !settings.metaAccessToken) continue;
        payload[key] = settings[key];
      }
      const res = await authenticatedFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to save settings.');
      }
      const s = data.settings || {};
      setSavedMetaPixelId(typeof s.metaPixelId === 'string' ? s.metaPixelId : settings.metaPixelId);
      setTokenIsSet(!!s.metaAccessTokenSet);
      setTokenSavedAt(typeof s.metaAccessTokenSavedAt === 'string' ? s.metaAccessTokenSavedAt : null);
      setPixelActive(!!s.metaPixelIdSet);
      setPixelSource(['default', 'environment'].includes(s.metaPixelIdSource) ? s.metaPixelIdSource : 'settings');
      setTrackingRefresh(value => value + 1);
      setSettings((prev) => ({ ...prev, metaAccessToken: '' }));
      setMessage({ type: 'success', text: payload.metaAccessToken ? 'Settings saved, including the new Meta access token.' : 'Settings saved.' });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
      // The result banner sits at the top of the page; bring it into view.
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const field = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#12436b] focus:outline-none focus:ring-2 focus:ring-[#12436b]/20';
  const label = 'mb-1 block text-sm font-medium text-gray-700';

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading settings…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0f3a5c] sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage site details, GPS attendance verification, lead flow routing, and marketing integrations.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <a href="#office-location" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[#0f3a5c] hover:bg-slate-50">
            GPS Office Location
          </a>
          <a href="#lead-flow" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-indigo-800 hover:bg-indigo-100">
            Lead Flow Control ↓
          </a>
        </div>
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

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Meta Connectivity */}
        <section id="meta-tracking" className="scroll-mt-6 rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-[#0f3a5c]">Meta Connectivity Status</h2>
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
                autoComplete="off"
                data-1p-ignore
                data-lpignore="true"
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
              {tokenSavedAt && (
                <p className="mt-1 text-xs font-medium text-gray-700">
                  Token last saved {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Dhaka' }).format(new Date(tokenSavedAt))} (Dhaka time)
                </p>
              )}
              <p className="mt-1 text-xs text-gray-600">Kept server-side and never returned to the browser. Generate the token for this dataset in Meta Events Manager → Settings → Conversions API → Set up manually.</p>
            </div>
          </div>
        </section>

        <MetaConnectionPanel
          refreshKey={trackingRefresh}
          pendingChanges={Boolean(settings.metaAccessToken) || settings.metaPixelId !== savedMetaPixelId}
        />

        {/* Office Location & GPS Attendance Verification */}
        <section id="office-location" className="scroll-mt-6 rounded-2xl bg-white shadow ring-1 ring-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-[#0f3a5c]">Office Location &amp; GPS Attendance Verification</h2>
              <p className="text-xs text-gray-500">
                Verify employee check-ins by GPS coordinates and geofence radius — works independently of office Wi-Fi or your current travel location.
              </p>
            </div>
            <Link href="/admin" className="text-xs font-bold text-[#0f3a5c] hover:underline">
              Open Remote Office Pulse →
            </Link>
          </div>
          <div className="space-y-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs text-emerald-950">
              <div>
                <p className="font-bold">Built-in Office Pin Active: {DEFAULT_OFFICE_LABEL}</p>
                <p className="mt-0.5 text-emerald-800">
                  Leave Latitude / Longitude blank to automatically use verified coordinates ({DEFAULT_OFFICE_LATITUDE}, {DEFAULT_OFFICE_LONGITUDE}) and a {DEFAULT_OFFICE_RADIUS_METERS}m radius.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const previewUrl = buildGoogleMapsUrl(
                    settings.officeLatitude.trim() || DEFAULT_OFFICE_LATITUDE,
                    settings.officeLongitude.trim() || DEFAULT_OFFICE_LONGITUDE,
                  );
                  return previewUrl ? (
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 font-bold text-emerald-800 hover:bg-emerald-100"
                    >
                      Open Pin in Google Maps ↗
                    </a>
                  ) : null;
                })()}
                <button
                  type="button"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      officeLatitude: '',
                      officeLongitude: '',
                      officeRadiusMeters: '',
                    }))
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Use Default Pin
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={label} htmlFor="officeLatitude">
                  Office Latitude
                </label>
                <input
                  id="officeLatitude"
                  name="officeLatitude"
                  value={settings.officeLatitude}
                  onChange={handleChange}
                  placeholder={String(DEFAULT_OFFICE_LATITUDE)}
                  maxLength={32}
                  className={field}
                />
              </div>
              <div>
                <label className={label} htmlFor="officeLongitude">
                  Office Longitude
                </label>
                <input
                  id="officeLongitude"
                  name="officeLongitude"
                  value={settings.officeLongitude}
                  onChange={handleChange}
                  placeholder={String(DEFAULT_OFFICE_LONGITUDE)}
                  maxLength={32}
                  className={field}
                />
              </div>
              <div>
                <label className={label} htmlFor="officeRadiusMeters">
                  Geofence Radius (meters)
                </label>
                <input
                  id="officeRadiusMeters"
                  name="officeRadiusMeters"
                  type="number"
                  min={50}
                  max={10000}
                  value={settings.officeRadiusMeters}
                  onChange={handleChange}
                  placeholder={String(DEFAULT_OFFICE_RADIUS_METERS)}
                  className={field}
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={settings.officeLocationStrict === 'true'}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    officeLocationStrict: e.target.checked ? 'true' : 'false',
                  }))
                }
                className="mt-0.5 size-4 rounded border-slate-300 text-[#0f3a5c]"
              />
              <span>
                <strong className="block font-bold text-slate-900">
                  Require GPS permission to allow employee check-in
                </strong>
                When checked, counselors who block browser Location access cannot clock in until GPS is enabled. When unchecked (recommended), check-ins still save and any missing or remote GPS is flagged on Remote Office Pulse with exact Google Maps distance.
              </span>
            </label>
          </div>
        </section>

        {/* Analytics & Tags */}
        <section className="rounded-2xl bg-white shadow ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-[#0f3a5c]">Analytics &amp; Tags</h2>
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
            <h2 className="text-lg font-semibold text-[#0f3a5c]">Site Identity</h2>
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
            <h2 className="text-lg font-semibold text-[#0f3a5c]">Social Links</h2>
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
            <h2 className="text-lg font-semibold text-[#0f3a5c]">Homepage Video Introduction</h2>
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
            className="rounded-lg bg-[#12436b] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f3a5c] disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>

      <LeadFlowSettingsPanel />

      <TelegramAlertsSettingsPanel />
    </div>
  );
}
