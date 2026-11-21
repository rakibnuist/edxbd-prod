'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  buildLinkedInCommentary,
  DEFAULT_LINKEDIN_API_VERSION,
  DEFAULT_LINKEDIN_ORGANIZATION_ID,
  LINKEDIN_COMPANY_URL,
  type PostTargetChannels,
} from '@/lib/gbp-posts';
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Eye,
  Plus,
  RefreshCw,
  Trash2,
  Pencil,
  Save,
  Webhook,
  KeyRound,
  Copy,
  Check,
  Linkedin,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface GbpPostRecord {
  id: string;
  slug: string;
  topicType: string;
  title: string | null;
  summary: string;
  callToAction: string;
  ctaUrl: string;
  mediaUrl: string | null;
  offerCouponCode: string | null;
  offerRedeemUrl: string | null;
  offerTerms: string | null;
  startDate: string | null;
  endDate: string | null;
  language: string;
  category: string;
  targetChannels: PostTargetChannels;
  linkedinCopy: string | null;
  sortOrder: number;
  status: string;
  isRecurring: boolean;
  publishedCount: number;
  lastPublishedAt: string | null;
  lastExternalId: string | null;
  lastError: string | null;
  lastLinkedinPublishedAt: string | null;
  lastLinkedinExternalId: string | null;
  lastLinkedinError: string | null;
}

interface GbpConfigState {
  enabled: boolean;
  cadenceDays: 7 | 15;
  mode: 'google_api' | 'webhook';
  accountId: string;
  locationId: string;
  clientId: string;
  clientSecretSet: boolean;
  refreshTokenSet: boolean;
  webhookUrlSet: boolean;
  webhookHostPreview: string;
  webhookSecretSet: boolean;
  telegramNotify: boolean;
  googleApiConfigured: boolean;
  webhookConfigured: boolean;
  isReadyToPublish: boolean;
  lastRunAt: string | null;
  lastStatus: string | null;
  lastError: string | null;
  lastPostId: string | null;
  linkedinEnabled: boolean;
  linkedinMode: 'linkedin_api' | 'webhook';
  linkedinOrganizationId: string;
  linkedinApiVersion: string;
  linkedinAccessTokenSet: boolean;
  linkedinWebhookUrlSet: boolean;
  linkedinWebhookHostPreview: string;
  linkedinWebhookSecretSet: boolean;
  linkedinApiConfigured: boolean;
  linkedinWebhookConfigured: boolean;
  linkedinReadyToPublish: boolean;
  linkedinLastRunAt: string | null;
  linkedinLastStatus: string | null;
  linkedinLastError: string | null;
  anyChannelReady: boolean;
  schedule: {
    cadenceDays: 7 | 15;
    lastRunAt: string | null;
    nextDueAt: string | null;
    isDue: boolean;
    remainingMs: number;
  };
}

interface PostFormState {
  id?: string;
  slug: string;
  topicType: 'STANDARD' | 'OFFER' | 'EVENT';
  title: string;
  summary: string;
  callToAction: 'LEARN_MORE' | 'BOOK' | 'SIGN_UP';
  ctaUrl: string;
  mediaUrl: string;
  offerRedeemUrl: string;
  offerTerms: string;
  language: 'en' | 'bn' | 'bilingual';
  category: string;
  targetChannels: PostTargetChannels;
  linkedinCopy: string;
  sortOrder: number;
  status: 'queued' | 'paused';
  isRecurring: boolean;
}

const GBP_OFFICE_MEDIA_PRESETS = [
  { label: 'Dhanmondi Brandwall (1200x900)', value: '/images/gbp/dhanmondi-brandwall.jpg' },
  { label: 'Dhanmondi Consultation Desk', value: '/images/gbp/dhanmondi-desk.jpg' },
  { label: 'Counselor Office Session', value: '/images/gbp/counselor-office.jpg' },
  { label: 'Shanghai Partner Wall', value: '/images/gbp/dhanmondi-shanghai-wall.jpg' },
  { label: 'Dhanmondi Reception', value: '/images/gbp/dhanmondi-reception.jpg' },
];

const EMPTY_FORM: PostFormState = {
  slug: '',
  topicType: 'STANDARD',
  title: '',
  summary: '',
  callToAction: 'LEARN_MORE',
  ctaUrl: 'https://eduexpressint.com/study-in-china-from-bangladesh?utm_source=google&utm_medium=organic&utm_campaign=gbp_post',
  mediaUrl: '/images/gbp/dhanmondi-brandwall.jpg',
  offerRedeemUrl: '',
  offerTerms: '',
  language: 'en',
  category: 'china',
  targetChannels: 'both',
  linkedinCopy: '',
  sortOrder: 90,
  status: 'queued',
  isRecurring: true,
};

function formatDhakaTime(iso: string | null | undefined): string {
  if (!iso) return 'Not yet published';
  try {
    return (
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dhaka',
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso)) + ' BST'
    );
  } catch {
    return iso;
  }
}

export default function AdminGbpPostsPage() {
  const { isAuthenticated, loading: authLoading, authenticatedFetch } = useAuth();
  const [config, setConfig] = useState<GbpConfigState | null>(null);
  const [posts, setPosts] = useState<GbpPostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [runningAction, setRunningAction] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [previewJson, setPreviewJson] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // GBP config inputs
  const [enabledInput, setEnabledInput] = useState(true);
  const [cadenceInput, setCadenceInput] = useState<7 | 15>(7);
  const [modeInput, setModeInput] = useState<'google_api' | 'webhook'>('google_api');
  const [telegramNotifyInput, setTelegramNotifyInput] = useState(true);
  const [accountIdInput, setAccountIdInput] = useState('');
  const [locationIdInput, setLocationIdInput] = useState('');
  const [clientIdInput, setClientIdInput] = useState('');
  const [clientSecretInput, setClientSecretInput] = useState('');
  const [refreshTokenInput, setRefreshTokenInput] = useState('');
  const [webhookUrlInput, setWebhookUrlInput] = useState('');
  const [webhookSecretInput, setWebhookSecretInput] = useState('');

  // LinkedIn config inputs
  const [linkedinEnabledInput, setLinkedinEnabledInput] = useState(true);
  const [linkedinModeInput, setLinkedinModeInput] = useState<'linkedin_api' | 'webhook'>('linkedin_api');
  const [linkedinOrgIdInput, setLinkedinOrgIdInput] = useState(DEFAULT_LINKEDIN_ORGANIZATION_ID);
  const [linkedinApiVersionInput, setLinkedinApiVersionInput] = useState(DEFAULT_LINKEDIN_API_VERSION);
  const [linkedinAccessTokenInput, setLinkedinAccessTokenInput] = useState('');
  const [linkedinWebhookUrlInput, setLinkedinWebhookUrlInput] = useState('');
  const [linkedinWebhookSecretInput, setLinkedinWebhookSecretInput] = useState('');

  // Post form state
  const [showPostForm, setShowPostForm] = useState(false);
  const [postForm, setPostForm] = useState<PostFormState>({ ...EMPTY_FORM });
  const [savingPost, setSavingPost] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authenticatedFetch('/api/admin/gbp-posts');
      if (!res.ok) {
        setFeedback({ type: 'error', text: 'Failed to load GBP & LinkedIn auto-post manager.' });
        return;
      }
      const data = await res.json();
      if (data.config) {
        const c = data.config as GbpConfigState;
        setConfig(c);
        setEnabledInput(c.enabled);
        setCadenceInput(c.cadenceDays);
        setModeInput(c.mode);
        setTelegramNotifyInput(c.telegramNotify);
        setAccountIdInput(c.accountId || '');
        setLocationIdInput(c.locationId || '');
        setClientIdInput(c.clientId || '');
        setLinkedinEnabledInput(c.linkedinEnabled);
        setLinkedinModeInput(c.linkedinMode);
        setLinkedinOrgIdInput(c.linkedinOrganizationId || DEFAULT_LINKEDIN_ORGANIZATION_ID);
        setLinkedinApiVersionInput(c.linkedinApiVersion || DEFAULT_LINKEDIN_API_VERSION);
      }
      if (Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error while loading scheduled posts.' });
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [authLoading, isAuthenticated, loadData]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setFeedback(null);
    try {
      const payload: Record<string, unknown> = {
        enabled: enabledInput,
        cadenceDays: cadenceInput,
        mode: modeInput,
        telegramNotify: telegramNotifyInput,
        accountId: accountIdInput,
        locationId: locationIdInput,
        clientId: clientIdInput,
        linkedinEnabled: linkedinEnabledInput,
        linkedinMode: linkedinModeInput,
        linkedinOrganizationId: linkedinOrgIdInput,
        linkedinApiVersion: linkedinApiVersionInput,
      };
      if (clientSecretInput.trim()) payload.clientSecret = clientSecretInput.trim();
      if (refreshTokenInput.trim()) payload.refreshToken = refreshTokenInput.trim();
      if (webhookUrlInput.trim()) payload.webhookUrl = webhookUrlInput.trim();
      if (webhookSecretInput.trim()) payload.webhookSecret = webhookSecretInput.trim();
      if (linkedinAccessTokenInput.trim()) payload.linkedinAccessToken = linkedinAccessTokenInput.trim();
      if (linkedinWebhookUrlInput.trim()) payload.linkedinWebhookUrl = linkedinWebhookUrlInput.trim();
      if (linkedinWebhookSecretInput.trim()) payload.linkedinWebhookSecret = linkedinWebhookSecretInput.trim();

      const res = await authenticatedFetch('/api/admin/gbp-posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_config', config: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: 'error', text: data.error || 'Could not save automation settings.' });
        return;
      }
      setConfig(data.config);
      setClientSecretInput('');
      setRefreshTokenInput('');
      setWebhookUrlInput('');
      setWebhookSecretInput('');
      setLinkedinAccessTokenInput('');
      setLinkedinWebhookUrlInput('');
      setLinkedinWebhookSecretInput('');
      setFeedback({
        type: 'success',
        text: `Dual-channel settings saved (Every ${cadenceInput} days · GBP: ${enabledInput ? modeInput : 'paused'} · LinkedIn Org ${linkedinOrgIdInput}: ${linkedinEnabledInput ? linkedinModeInput : 'paused'}).`,
      });
    } catch {
      setFeedback({ type: 'error', text: 'Failed to save configuration.' });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleDryRunPreview = async (postId?: string) => {
    setRunningAction(true);
    setFeedback(null);
    try {
      const res = await authenticatedFetch('/api/admin/gbp-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'preview_next', postId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: 'error', text: data.error || 'Preview failed.' });
        return;
      }
      setPreviewJson(JSON.stringify(data, null, 2));
      setFeedback({
        type: 'info',
        text: data.post
          ? `Next queued post: ${data.post.slug} (${data.post.targetChannels || 'both'}) — GBP & LinkedIn REST payloads generated below.`
          : `No eligible post (${data.skippedReason || 'queue empty'}).`,
      });
    } catch {
      setFeedback({ type: 'error', text: 'Could not preview next dual-channel payload.' });
    } finally {
      setRunningAction(false);
    }
  };

  const handlePublishNow = async (postId?: string, channel: PostTargetChannels = 'both') => {
    setRunningAction(true);
    setFeedback(null);
    try {
      const res = await authenticatedFetch('/api/admin/gbp-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_now', postId, channel }),
      });
      const data = await res.json();
      if (data.config) setConfig(data.config);
      if (Array.isArray(data.posts)) setPosts(data.posts);

      const result = data.result || {};
      if (result.executed) {
        const gbpOk = result.channels?.gbp?.executed;
        const liOk = result.channels?.linkedin?.executed;
        const summary = [
          gbpOk ? 'GBP: Published' : result.channels?.gbp?.error ? `GBP: ${result.channels.gbp.error}` : null,
          liOk ? 'LinkedIn: Published' : result.channels?.linkedin?.error ? `LinkedIn: ${result.channels.linkedin.error}` : null,
        ]
          .filter(Boolean)
          .join(' | ');
        setFeedback({
          type: 'success',
          text: `Published "${result.post?.slug || 'post'}" (${summary || result.transport}).`,
        });
      } else {
        setFeedback({
          type: result.skippedReason === 'credentials_missing' ? 'info' : 'error',
          text: result.error || `Run skipped: ${result.skippedReason || 'check credentials'}`,
        });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Publish trigger failed.' });
    } finally {
      setRunningAction(false);
    }
  };

  const handleAckManualPublish = async (post: GbpPostRecord, channel: PostTargetChannels = 'both') => {
    setRunningAction(true);
    setFeedback(null);
    try {
      const res = await authenticatedFetch('/api/admin/gbp-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ack_manual', postId: post.id, channel }),
      });
      const data = await res.json();
      if (data.config) setConfig(data.config);
      if (Array.isArray(data.posts)) setPosts(data.posts);
      setFeedback({
        type: 'success',
        text: `Marked "${post.title || post.slug}" synced (${channel.toUpperCase()}) and reset the ${config?.cadenceDays ?? 7}-day countdown.`,
      });
    } catch {
      setFeedback({ type: 'error', text: 'Failed to mark post as synced.' });
    } finally {
      setRunningAction(false);
    }
  };

  const handleCopyChannelText = async (post: GbpPostRecord, channel: 'gbp' | 'linkedin') => {
    const text =
      channel === 'linkedin'
        ? buildLinkedInCommentary(post)
        : `${post.summary}\n\n${post.callToAction}: ${post.ctaUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      const key = `${post.id}:${channel}`;
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((cur) => (cur === key ? null : cur)), 2000);
    } catch {
      setFeedback({ type: 'error', text: 'Clipboard copy blocked by browser.' });
    }
  };

  const handleQuickToggleStatus = async (post: GbpPostRecord) => {
    const nextStatus = post.status === 'queued' ? 'paused' : 'queued';
    try {
      const res = await authenticatedFetch('/api/admin/gbp-posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, quickToggle: true, status: nextStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) => prev.map((item) => (item.id === post.id ? data.post : item)));
      }
    } catch {
      setFeedback({ type: 'error', text: 'Failed to toggle post status.' });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Delete this scheduled post from the GBP & LinkedIn rotation queue?')) return;
    try {
      const res = await authenticatedFetch(`/api/admin/gbp-posts?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((item) => item.id !== id));
        setFeedback({ type: 'success', text: 'Post removed from rotation queue.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Could not delete post.' });
    }
  };

  const openEditForm = (post: GbpPostRecord) => {
    setPostForm({
      id: post.id,
      slug: post.slug,
      topicType: post.topicType === 'OFFER' || post.topicType === 'EVENT' ? post.topicType : 'STANDARD',
      title: post.title || '',
      summary: post.summary,
      callToAction: post.callToAction === 'BOOK' || post.callToAction === 'SIGN_UP' ? post.callToAction : 'LEARN_MORE',
      ctaUrl: post.ctaUrl,
      mediaUrl: post.mediaUrl || '',
      offerRedeemUrl: post.offerRedeemUrl || '',
      offerTerms: post.offerTerms || '',
      language: post.language === 'bn' || post.language === 'bilingual' ? post.language : 'en',
      category: post.category || 'general',
      targetChannels: post.targetChannels || 'both',
      linkedinCopy: post.linkedinCopy || '',
      sortOrder: post.sortOrder,
      status: post.status === 'paused' ? 'paused' : 'queued',
      isRecurring: post.isRecurring,
    });
    setShowPostForm(true);
    setFeedback(null);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPost(true);
    setFeedback(null);
    try {
      const isEdit = Boolean(postForm.id);
      const res = await authenticatedFetch('/api/admin/gbp-posts', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: 'error', text: data.error || 'Could not save scheduled post.' });
        return;
      }
      setShowPostForm(false);
      setPostForm({ ...EMPTY_FORM });
      await loadData();
      setFeedback({
        type: 'success',
        text: isEdit ? 'Scheduled post updated.' : 'New post added to GBP & LinkedIn rotation queue.',
      });
    } catch {
      setFeedback({ type: 'error', text: 'Network error while saving post.' });
    } finally {
      setSavingPost(false);
    }
  };

  if (loading && !config) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-600">
          Loading GBP &amp; LinkedIn weekly scheduler...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-emerald-700" />
            GBP &amp; LinkedIn Weekly Auto-Poster
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Unified Weekly (7-day) or Bi-Weekly (15-day) rotating posts for EduExpress International on{' '}
            <strong>Google Business Profile</strong> and{' '}
            <a
              href={LINKEDIN_COMPANY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 underline underline-offset-2 hover:text-sky-900"
            >
              LinkedIn (Org {config?.linkedinOrganizationId || DEFAULT_LINKEDIN_ORGANIZATION_ID})
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void handleDryRunPreview()}
            disabled={runningAction}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            Preview Next
          </button>
          <button
            type="button"
            onClick={() => void handlePublishNow(undefined, 'both')}
            disabled={runningAction}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {runningAction ? 'Running...' : 'Publish Next Now'}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm flex items-start gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : feedback.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* 4 Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Weekly Cadence</div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                config?.enabled || config?.linkedinEnabled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {config?.enabled || config?.linkedinEnabled ? 'Active' : 'Paused'}
            </span>
            <span className="text-sm font-semibold text-slate-900">
              Every {config?.cadenceDays ?? 7} days
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Queued posts: <strong>{posts.filter((p) => p.status === 'queued').length}</strong> / {posts.length}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Timing &amp; Rotation</div>
          <div className="mt-2 text-xs text-slate-800 space-y-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Last: {formatDhakaTime(config?.lastRunAt)}</span>
            </div>
            <div className="text-slate-600">
              Next due:{' '}
              {config?.schedule.isDue ? (
                <span className="font-semibold text-emerald-700">Due on next cron tick</span>
              ) : (
                formatDhakaTime(config?.schedule.nextDueAt)
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            Google Business Profile
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-900">
            {config?.mode === 'webhook' ? (
              <Webhook className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>{config?.mode === 'webhook' ? 'Webhook / n8n' : 'Google OAuth API'}</span>
          </div>
          <p className="mt-1.5 text-xs">
            {!config?.enabled ? (
              <span className="text-slate-500">Channel paused</span>
            ) : config?.isReadyToPublish ? (
              <span className="text-emerald-700 font-medium">Ready (Loc {config.locationId || 'set'})</span>
            ) : (
              <span className="text-amber-700 font-medium">Add GBP OAuth or Webhook below</span>
            )}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
            <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
            LinkedIn Company Page
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-900">
            {config?.linkedinMode === 'webhook' ? (
              <Webhook className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <KeyRound className="w-3.5 h-3.5 text-[#0A66C2]" />
            )}
            <span>{config?.linkedinMode === 'webhook' ? 'Webhook / n8n' : 'LinkedIn REST API'}</span>
          </div>
          <p className="mt-1.5 text-xs">
            {!config?.linkedinEnabled ? (
              <span className="text-slate-500">Channel paused</span>
            ) : config?.linkedinReadyToPublish ? (
              <span className="text-emerald-700 font-medium">
                Ready (Org {config.linkedinOrganizationId})
              </span>
            ) : (
              <span className="text-amber-700 font-medium">Add LinkedIn token or Webhook below</span>
            )}
          </p>
        </div>
      </div>

      {/* Unified Automation Settings & Credentials */}
      <form onSubmit={handleSaveConfig} className="bg-white rounded-xl border border-slate-200 p-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Schedule &amp; Dual-Channel Connection Settings</h2>
            <p className="text-xs text-slate-500">
              VPS cron checks daily at 15:00 BST and publishes to both enabled channels whenever the 7-day or 15-day interval elapses.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingConfig}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {savingConfig ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>

        {/* Shared Cadence & Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Auto-Post Cadence (GBP + LinkedIn)</span>
            <select
              value={cadenceInput}
              onChange={(e) => setCadenceInput(Number(e.target.value) === 15 ? 15 : 7)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value={7}>Every 7 Days (Weekly)</option>
              <option value={15}>Every 15 Days (Bi-Weekly)</option>
            </select>
          </label>

          <div className="flex flex-col justify-end gap-2 text-sm pb-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enabledInput}
                onChange={(e) => setEnabledInput(e.target.checked)}
                className="rounded border-slate-300 text-emerald-700"
              />
              <span className="font-medium text-slate-800">Enable Google Business Profile auto-post</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={linkedinEnabledInput}
                onChange={(e) => setLinkedinEnabledInput(e.target.checked)}
                className="rounded border-slate-300 text-sky-700"
              />
              <span className="font-medium text-slate-800">Enable LinkedIn Company Page auto-post</span>
            </label>
          </div>

          <div className="flex flex-col justify-end gap-2 text-sm pb-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={telegramNotifyInput}
                onChange={(e) => setTelegramNotifyInput(e.target.checked)}
                className="rounded border-slate-300 text-emerald-700"
              />
              <span className="text-slate-700">Notify Telegram when weekly post publishes</span>
            </label>
            <a
              href={LINKEDIN_COMPANY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:underline"
            >
              Open LinkedIn Page ({linkedinOrgIdInput}) <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Channel 1: Google Business Profile Settings */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              Channel 1 — Google Business Profile
            </h3>
            <select
              value={modeInput}
              onChange={(e) => setModeInput(e.target.value === 'webhook' ? 'webhook' : 'google_api')}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium bg-white"
            >
              <option value="google_api">Direct Google Business Profile OAuth API</option>
              <option value="webhook">n8n / Custom Webhook (n8n.eduexpress.info)</option>
            </select>
          </div>

          {modeInput === 'google_api' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <label className="block text-sm">
                <span className="font-medium text-slate-700">GBP Account ID</span>
                <input
                  type="text"
                  value={accountIdInput}
                  onChange={(e) => setAccountIdInput(e.target.value)}
                  placeholder="Numeric Account ID (from accounts API)"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">GBP Location ID</span>
                <input
                  type="text"
                  value={locationIdInput}
                  onChange={(e) => setLocationIdInput(e.target.value)}
                  placeholder="e.g. 16688138993497254676"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">Google OAuth Client ID</span>
                <input
                  type="text"
                  value={clientIdInput}
                  onChange={(e) => setClientIdInput(e.target.value)}
                  placeholder="xxxx.apps.googleusercontent.com"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">
                  OAuth Client Secret {config?.clientSecretSet && <span className="text-emerald-700">(Saved)</span>}
                </span>
                <input
                  type="password"
                  value={clientSecretInput}
                  onChange={(e) => setClientSecretInput(e.target.value)}
                  placeholder={config?.clientSecretSet ? '•••••••• (leave blank to keep)' : 'Enter Client Secret'}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm md:col-span-2">
                <span className="font-medium text-slate-700">
                  OAuth Refresh Token (business.manage){' '}
                  {config?.refreshTokenSet && <span className="text-emerald-700">(Saved)</span>}
                </span>
                <input
                  type="password"
                  value={refreshTokenInput}
                  onChange={(e) => setRefreshTokenInput(e.target.value)}
                  placeholder={config?.refreshTokenSet ? '•••••••• (leave blank to keep)' : 'Paste Google OAuth Refresh Token'}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="font-medium text-slate-700">
                  Unified / GBP Webhook URL{' '}
                  {config?.webhookUrlSet && (
                    <span className="text-emerald-700">({config.webhookHostPreview})</span>
                  )}
                </span>
                <input
                  type="url"
                  value={webhookUrlInput}
                  onChange={(e) => setWebhookUrlInput(e.target.value)}
                  placeholder="https://n8n.eduexpress.info/webhook/gbp-linkedin-autopost"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">
                  Optional Webhook Secret (X-GBP-Webhook-Secret){' '}
                  {config?.webhookSecretSet && <span className="text-emerald-700">(Saved)</span>}
                </span>
                <input
                  type="password"
                  value={webhookSecretInput}
                  onChange={(e) => setWebhookSecretInput(e.target.value)}
                  placeholder={config?.webhookSecretSet ? '•••••••• (leave blank to keep)' : 'Shared bearer / HMAC secret'}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>
            </div>
          )}

          {config?.lastError && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-900">
              <strong>GBP status ({config.lastStatus || 'info'}):</strong> {config.lastError}
            </div>
          )}
        </div>

        {/* Channel 2: LinkedIn Company Page Settings */}
        <div className="rounded-xl border border-sky-200/80 bg-sky-50/40 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-[#0A66C2]" />
              Channel 2 — LinkedIn Company Page (urn:li:organization:{linkedinOrgIdInput || DEFAULT_LINKEDIN_ORGANIZATION_ID})
            </h3>
            <select
              value={linkedinModeInput}
              onChange={(e) => setLinkedinModeInput(e.target.value === 'webhook' ? 'webhook' : 'linkedin_api')}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium bg-white"
            >
              <option value="linkedin_api">Direct LinkedIn REST Posts API (/rest/posts)</option>
              <option value="webhook">n8n / Make / Buffer Webhook Bridge</option>
            </select>
          </div>

          {linkedinModeInput === 'linkedin_api' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="block text-sm">
                <span className="font-medium text-slate-700">LinkedIn Organization ID</span>
                <input
                  type="text"
                  value={linkedinOrgIdInput}
                  onChange={(e) => setLinkedinOrgIdInput(e.target.value)}
                  placeholder="30919158"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">LinkedIn-Version Header (YYYYMM)</span>
                <input
                  type="text"
                  value={linkedinApiVersionInput}
                  onChange={(e) => setLinkedinApiVersionInput(e.target.value)}
                  placeholder="202610"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">
                  OAuth Access Token (w_organization_social){' '}
                  {config?.linkedinAccessTokenSet && <span className="text-emerald-700">(Saved)</span>}
                </span>
                <input
                  type="password"
                  value={linkedinAccessTokenInput}
                  onChange={(e) => setLinkedinAccessTokenInput(e.target.value)}
                  placeholder={config?.linkedinAccessTokenSet ? '•••••••• (leave blank to keep)' : 'Paste LinkedIn Bearer Token'}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="font-medium text-slate-700">
                  LinkedIn Webhook URL (optional if sharing GBP webhook above){' '}
                  {config?.linkedinWebhookUrlSet && (
                    <span className="text-emerald-700">({config.linkedinWebhookHostPreview})</span>
                  )}
                </span>
                <input
                  type="url"
                  value={linkedinWebhookUrlInput}
                  onChange={(e) => setLinkedinWebhookUrlInput(e.target.value)}
                  placeholder="Leave blank to share GBP Webhook URL, or enter dedicated URL"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-slate-700">
                  LinkedIn Webhook Secret{' '}
                  {config?.linkedinWebhookSecretSet && <span className="text-emerald-700">(Saved)</span>}
                </span>
                <input
                  type="password"
                  value={linkedinWebhookSecretInput}
                  onChange={(e) => setLinkedinWebhookSecretInput(e.target.value)}
                  placeholder={config?.linkedinWebhookSecretSet ? '•••••••• (leave blank to keep)' : 'Optional header secret'}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>
            </div>
          )}

          {config?.linkedinLastError && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-900">
              <strong>LinkedIn status ({config.linkedinLastStatus || 'info'}):</strong> {config.linkedinLastError}
            </div>
          )}
        </div>
      </form>

      {/* Dry-run Dual Payload Preview */}
      {previewJson && (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-300">Dry-Run GBP + LinkedIn Payload Preview</span>
            <button
              type="button"
              onClick={() => setPreviewJson(null)}
              className="text-slate-300 hover:text-white underline"
            >
              Close
            </button>
          </div>
          <pre className="text-xs overflow-x-auto max-h-80">{previewJson}</pre>
        </div>
      )}

      {/* Rotating Post Queue */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Rotating Weekly Post Library ({posts.length})</h2>
            <p className="text-xs text-slate-500">
              Never-published posts run first by Sort Order, then oldest published recurring posts rotate evenly across Google Business Profile &amp; LinkedIn. Phone numbers and guarantee claims are blocked automatically.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadData()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                setPostForm({ ...EMPTY_FORM });
                setShowPostForm((v) => !v);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              <Plus className="w-3.5 h-3.5" />
              {showPostForm ? 'Hide Form' : 'Add Post'}
            </button>
          </div>
        </div>

        {showPostForm && (
          <form onSubmit={handleSavePost} className="p-5 bg-slate-50 border-b border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {postForm.id ? 'Edit Scheduled GBP & LinkedIn Post' : 'Create Scheduled GBP & LinkedIn Post'}
              </h3>
              <span className="text-xs text-slate-500">{postForm.summary.length} / 1500 chars</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <label className="block text-xs">
                <span className="font-semibold text-slate-700">Target Channels</span>
                <select
                  value={postForm.targetChannels}
                  onChange={(e) =>
                    setPostForm((p) => ({
                      ...p,
                      targetChannels: e.target.value as PostTargetChannels,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-sm"
                >
                  <option value="both">Both (GBP + LinkedIn)</option>
                  <option value="gbp">GBP Only</option>
                  <option value="linkedin">LinkedIn Only</option>
                </select>
              </label>

              <label className="block text-xs">
                <span className="font-semibold text-slate-700">GBP Topic Type</span>
                <select
                  value={postForm.topicType}
                  onChange={(e) =>
                    setPostForm((p) => ({
                      ...p,
                      topicType: e.target.value as 'STANDARD' | 'OFFER' | 'EVENT',
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-sm"
                >
                  <option value="STANDARD">Update (STANDARD)</option>
                  <option value="OFFER">Offer (OFFER)</option>
                  <option value="EVENT">Event (EVENT)</option>
                </select>
              </label>

              <label className="block text-xs">
                <span className="font-semibold text-slate-700">CTA Button</span>
                <select
                  value={postForm.callToAction}
                  onChange={(e) =>
                    setPostForm((p) => ({
                      ...p,
                      callToAction: e.target.value as 'LEARN_MORE' | 'BOOK' | 'SIGN_UP',
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-sm"
                >
                  <option value="LEARN_MORE">Learn more</option>
                  <option value="BOOK">Book</option>
                  <option value="SIGN_UP">Sign up</option>
                </select>
              </label>

              <label className="block text-xs">
                <span className="font-semibold text-slate-700">Language</span>
                <select
                  value={postForm.language}
                  onChange={(e) =>
                    setPostForm((p) => ({
                      ...p,
                      language: e.target.value as 'en' | 'bn' | 'bilingual',
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-sm"
                >
                  <option value="en">English</option>
                  <option value="bn">Bengali (বাংলা)</option>
                  <option value="bilingual">Bilingual</option>
                </select>
              </label>

              <label className="block text-xs">
                <span className="font-semibold text-slate-700">Sort Order</span>
                <input
                  type="number"
                  min={0}
                  max={9999}
                  value={postForm.sortOrder}
                  onChange={(e) => setPostForm((p) => ({ ...p, sortOrder: Number(e.target.value || 100) }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-sm"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block text-xs">
                <span className="font-semibold text-slate-700">
                  Title {postForm.topicType === 'OFFER' || postForm.topicType === 'EVENT' ? '(Required, max 58 chars)' : '(Headline & LinkedIn title)'}
                </span>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) => setPostForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="China March 2027 Intake Update"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-sm"
                />
              </label>

              <label className="block text-xs">
                <span className="font-semibold text-slate-700">CTA Destination URL (LinkedIn UTM auto-rewritten)</span>
                <input
                  type="url"
                  required
                  value={postForm.ctaUrl}
                  onChange={(e) => setPostForm((p) => ({ ...p, ctaUrl: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-sm"
                />
              </label>
            </div>

            <label className="block text-xs">
              <span className="font-semibold text-slate-700">
                Core Post Body (20-1500 chars — strictly NO phone numbers or visa guarantees)
              </span>
              <textarea
                rows={4}
                required
                value={postForm.summary}
                onChange={(e) => setPostForm((p) => ({ ...p, summary: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-sm"
              />
            </label>

            <label className="block text-xs">
              <span className="font-semibold text-slate-700">
                Optional Custom LinkedIn Commentary (leave blank to auto-generate with LinkedIn UTM &amp; hashtags)
              </span>
              <textarea
                rows={3}
                value={postForm.linkedinCopy}
                onChange={(e) => setPostForm((p) => ({ ...p, linkedinCopy: e.target.value }))}
                placeholder="Optional custom LinkedIn text (max 2900 chars). Leave empty to auto-format Title + Body + LinkedIn UTM URL + hashtags."
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-sm"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block text-xs">
                <span className="font-semibold text-slate-700">Post Photo (Office JPEG Preset or URL)</span>
                <select
                  value={GBP_OFFICE_MEDIA_PRESETS.some((x) => x.value === postForm.mediaUrl) ? postForm.mediaUrl : ''}
                  onChange={(e) => {
                    if (e.target.value) setPostForm((p) => ({ ...p, mediaUrl: e.target.value }));
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 bg-white text-sm"
                >
                  <option value="">Custom media path / URL below</option>
                  {GBP_OFFICE_MEDIA_PRESETS.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={postForm.mediaUrl}
                  onChange={(e) => setPostForm((p) => ({ ...p, mediaUrl: e.target.value }))}
                  placeholder="/images/gbp/dhanmondi-brandwall.jpg"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-1.5 bg-white text-xs"
                />
              </label>

              <div className="flex flex-col justify-between text-xs pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={postForm.isRecurring}
                    onChange={(e) => setPostForm((p) => ({ ...p, isRecurring: e.target.checked }))}
                  />
                  <span className="font-medium text-slate-700">
                    Recurring rotation (stay in queue after publishing so library rotates automatically)
                  </span>
                </label>

                <div className="flex justify-end gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPostForm(false);
                      setPostForm({ ...EMPTY_FORM });
                    }}
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPost}
                    className="px-4 py-2 rounded-lg bg-emerald-700 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                  >
                    {savingPost ? 'Saving...' : postForm.id ? 'Update Post' : 'Add to Queue'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        <div className="divide-y divide-slate-200">
          {posts.map((post) => {
            const channels = post.targetChannels || 'both';
            return (
              <div key={post.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-mono text-slate-400">#{post.sortOrder}</span>
                    {(channels === 'both' || channels === 'gbp') && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                        <MapPin className="w-3 h-3" /> GBP
                      </span>
                    )}
                    {(channels === 'both' || channels === 'linkedin') && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-[#0A66C2] text-[11px] font-semibold">
                        <Linkedin className="w-3 h-3" /> LinkedIn
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        post.topicType === 'OFFER'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {post.topicType}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold uppercase">
                      {post.language}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        post.status === 'queued'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {post.status === 'queued' ? (post.isRecurring ? 'Queued (Rotating)' : 'Queued (Once)') : post.status}
                    </span>
                    <span className="text-xs text-slate-500">Published {post.publishedCount}x</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{post.title || post.slug}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{post.summary}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                    <span>
                      CTA: {post.callToAction} -&gt; {post.ctaUrl}
                    </span>
                    {post.lastPublishedAt && <span>GBP sent: {formatDhakaTime(post.lastPublishedAt)}</span>}
                    {post.lastLinkedinPublishedAt && (
                      <span className="text-[#0A66C2]">
                        LinkedIn sent: {formatDhakaTime(post.lastLinkedinPublishedAt)}
                      </span>
                    )}
                    {post.lastError && <span className="text-red-600">GBP err: {post.lastError}</span>}
                    {post.lastLinkedinError && (
                      <span className="text-red-600">LinkedIn err: {post.lastLinkedinError}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => void handleCopyChannelText(post, 'linkedin')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-sky-200 bg-sky-50/70 text-xs font-medium text-[#0A66C2] hover:bg-sky-100"
                  >
                    {copiedKey === `${post.id}:linkedin` ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    Copy LI
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleCopyChannelText(post, 'gbp')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {copiedKey === `${post.id}:gbp` ? (
                      <Check className="w-3 h-3 text-emerald-700" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    Copy GBP
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleAckManualPublish(post, channels)}
                    disabled={runningAction}
                    title="Mark this post as published on GBP & LinkedIn and reset the weekly timer"
                    className="px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
                  >
                    Mark Synced
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleQuickToggleStatus(post)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {post.status === 'queued' ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDryRunPreview(post.id)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditForm(post)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeletePost(post.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
