import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import prisma from '@/lib/prisma';
import { DEFAULT_OFFICE_RECORD } from '@/lib/office-record';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import { toSafeExternalUrl, toSafeSitePathOrUrl } from '@/lib/safe-url';

const NO_STORE = { 'Cache-Control': 'no-store, private' };
const authorized = async (request: NextRequest) => Boolean(await verifyLiveAdminUser(request));
const refreshPublicTrustPages = () => {
  revalidatePath('/', 'layout');
  revalidatePath('/proof-library');
  revalidatePath('/about');
  revalidatePath('/for-parents');
  revalidatePath('/contact');
  revalidatePath('/education-consultant-dhaka');
};

function trustPrismaErrorResponse(error: unknown, fallback: string) {
  const code = (error as { code?: string })?.code;
  if (code === 'P2002') {
    return NextResponse.json({ error: 'A record with this unique slug or key already exists.' }, { status: 409, headers: NO_STORE });
  }
  if (code === 'P2025') {
    return NextResponse.json({ error: 'Record not found.' }, { status: 404, headers: NO_STORE });
  }
  if (code === 'P2003') {
    return NextResponse.json({ error: 'Referenced university or linked record does not exist.' }, { status: 400, headers: NO_STORE });
  }
  console.error('[admin/trust]', error);
  return NextResponse.json({ error: fallback }, { status: 500, headers: NO_STORE });
}
const optional = (value: unknown) => String(value || '').trim() || null;
const list = (value: unknown) => Array.isArray(value) ? value.map(item => String(item).trim()).filter(Boolean) : String(value || '').split('\n').map(item => item.trim()).filter(Boolean);
const parseList = (value: string) => { try { return JSON.parse(value) as string[]; } catch { return []; } };
const dateOrNull = (value: unknown) => {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
};
const privacyStatus = (value: unknown) => {
  const status = String(value || 'pending');
  return ['pending', 'redacted', 'restricted'].includes(status) ? status : 'pending';
};

const validateTrustUrls = (
  body: Record<string, unknown>,
  fields: Array<{ key: string; allowSitePath: boolean }>
): string | null => {
  for (const { key, allowSitePath } of fields) {
    if (!(key in body) || body[key] === undefined || body[key] === null) continue;
    if (typeof body[key] !== 'string') return `${key} must be a URL string.`;
    const trimmed = body[key].trim();
    if (!trimmed) continue;
    const valid = allowSitePath ? toSafeSitePathOrUrl(trimmed) : toSafeExternalUrl(trimmed);
    if (!valid) {
      return allowSitePath
        ? `${key} must be a site path (/...) or a valid http(s) URL.`
        : `${key} must be a valid http:// or https:// URL.`;
    }
  }
  return null;
};

const evidenceData = (body: Record<string, unknown>) => ({
  type: String(body.type || 'authorization').trim(),
  title: String(body.title || '').trim(),
  summary: optional(body.summary),
  organization: optional(body.organization),
  country: optional(body.country),
  universityId: optional(body.universityId),
  referenceLabel: optional(body.referenceLabel),
  documentUrl: toSafeSitePathOrUrl(body.documentUrl),
  thumbnailUrl: toSafeSitePathOrUrl(body.thumbnailUrl),
  sourceUrl: toSafeExternalUrl(body.sourceUrl),
  issuedAt: dateOrNull(body.issuedAt),
  validUntil: dateOrNull(body.validUntil),
  lastVerifiedAt: dateOrNull(body.lastVerifiedAt),
  privacyStatus: privacyStatus(body.privacyStatus),
  isPublished: body.isPublished === true && privacyStatus(body.privacyStatus) === 'redacted' && Boolean(toSafeSitePathOrUrl(body.thumbnailUrl)),
  displayOrder: Number(body.displayOrder) || 0,
});

const metricData = (body: Record<string, unknown>) => ({
  key: String(body.key || '').trim(), value: String(body.value || '').trim(), label: String(body.label || '').trim(),
  definition: String(body.definition || '').trim(), evidenceNote: optional(body.evidenceNote), lastVerifiedAt: dateOrNull(body.lastVerifiedAt),
  isPublished: body.isPublished === true, displayOrder: Number(body.displayOrder) || 0,
});

const officeData = (body: Record<string, unknown>) => ({
  name: String(body.name || '').trim(), slug: String(body.slug || '').trim(), address: String(body.address || '').trim(), city: String(body.city || '').trim(),
  postalCode: optional(body.postalCode), phonePrimary: String(body.phonePrimary || '').trim(), phoneSecondary: optional(body.phoneSecondary),
  email: optional(body.email), hours: String(body.hours || '').trim(), mapUrl: toSafeSitePathOrUrl(body.mapUrl), photoUrl: toSafeSitePathOrUrl(body.photoUrl), isHeadOffice: body.isHeadOffice === true,
  isPublished: body.isPublished !== false, lastVerifiedAt: dateOrNull(body.lastVerifiedAt),
});
const validOffice = (body: Record<string, unknown>) => {
  const required = ['name', 'slug', 'address', 'city', 'phonePrimary', 'hours'];
  if (required.some(key => !String(body[key] || '').trim())) return 'Office name, slug, address, city, primary phone and hours are required.';
  const email = optional(body.email);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid office email address.';
  return validateTrustUrls(body, [
    { key: 'mapUrl', allowSitePath: true },
    { key: 'photoUrl', allowSitePath: true },
  ]);
};

const teamData = (body: Record<string, unknown>) => ({
  slug: String(body.slug || '').trim(), name: String(body.name || '').trim(), role: String(body.role || '').trim(), shortRole: optional(body.shortRole),
  bio: optional(body.bio), specialties: JSON.stringify(list(body.specialties)), photoUrl: toSafeSitePathOrUrl(body.photoUrl),
  consentConfirmedAt: dateOrNull(body.consentConfirmedAt), isPublished: body.isPublished === true, displayOrder: Number(body.displayOrder) || 0,
});

const packageData = (body: Record<string, unknown>) => ({
  slug: String(body.slug || '').trim(), destination: String(body.destination || 'China').trim(), title: String(body.title || '').trim(),
  packageType: String(body.packageType || '').trim(), priceLabel: String(body.priceLabel || '').trim(), summary: String(body.summary || '').trim(),
  outcomeScope: String(body.outcomeScope || '').trim(), includedItems: JSON.stringify(list(body.includedItems)), excludedItems: JSON.stringify(list(body.excludedItems)),
  paymentTerms: String(body.paymentTerms || '').trim(), refundTerms: String(body.refundTerms || '').trim(), securityOptions: JSON.stringify(list(body.securityOptions)),
  complianceNote: String(body.complianceNote || '').trim(), isPublished: body.isPublished === true, displayOrder: Number(body.displayOrder) || 0,
});

export async function GET(request: NextRequest) {
  if (!(await authorized(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403, headers: NO_STORE });
  try {
    const [metrics, evidence, offices, team, universities, servicePackages] = await Promise.all([
      prisma.trustMetric.findMany({ orderBy: [{ displayOrder: 'asc' }, { key: 'asc' }] }),
      prisma.evidenceAsset.findMany({ orderBy: [{ displayOrder: 'asc' }, { updatedAt: 'desc' }] }),
      prisma.office.findMany({ orderBy: [{ isHeadOffice: 'desc' }, { name: 'asc' }] }),
      prisma.teamMember.findMany({ orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }] }),
      prisma.university.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
      prisma.servicePackage.findMany({ orderBy: [{ displayOrder: 'asc' }, { title: 'asc' }] }),
    ]);
    return NextResponse.json(
      {
        metrics,
        evidence,
        offices,
        team: team.map(member => ({ ...member, specialties: parseList(member.specialties) })),
        universities,
        packages: servicePackages.map(item => ({
          ...item,
          includedItems: parseList(item.includedItems),
          excludedItems: parseList(item.excludedItems),
          securityOptions: parseList(item.securityOptions),
        })),
      },
      { headers: NO_STORE },
    );
  } catch (error) {
    return trustPrismaErrorResponse(error, 'Failed to load trust records.');
  }
}

export async function POST(request: NextRequest) {
  if (!(await authorized(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403, headers: NO_STORE });
  let body: Record<string, unknown>;
  try {
    body = await readLimitedJson(request, 64 * 1024);
  } catch (error) {
    return jsonBodyErrorResponse(error) || NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400, headers: NO_STORE });
  }
  try {
    if (body.kind === 'team') {
      if (!String(body.name || '').trim() || !String(body.role || '').trim() || !String(body.slug || '').trim()) {
        return NextResponse.json({ error: 'Name, role and profile slug are required.' }, { status: 400, headers: NO_STORE });
      }
      const urlError = validateTrustUrls(body, [{ key: 'photoUrl', allowSitePath: true }]);
      if (urlError) return NextResponse.json({ error: urlError }, { status: 400, headers: NO_STORE });
      const record = await prisma.teamMember.create({ data: teamData(body) });
      refreshPublicTrustPages();
      return NextResponse.json(record, { status: 201, headers: NO_STORE });
    }
    if (body.kind === 'office') {
      const existingOffice = await prisma.office.findFirst();
      if (existingOffice) return NextResponse.json({ error: 'An office record already exists.' }, { status: 409, headers: NO_STORE });
      const record = await prisma.office.create({ data: DEFAULT_OFFICE_RECORD });
      refreshPublicTrustPages();
      return NextResponse.json(record, { status: 201, headers: NO_STORE });
    }
    if (body.kind !== 'evidence') return NextResponse.json({ error: 'Unknown record type.' }, { status: 400, headers: NO_STORE });
    if (!String(body.title || '').trim()) return NextResponse.json({ error: 'Evidence title is required.' }, { status: 400, headers: NO_STORE });
    const evidenceUrlError = validateTrustUrls(body, [
      { key: 'documentUrl', allowSitePath: true },
      { key: 'thumbnailUrl', allowSitePath: true },
      { key: 'sourceUrl', allowSitePath: false },
    ]);
    if (evidenceUrlError) return NextResponse.json({ error: evidenceUrlError }, { status: 400, headers: NO_STORE });
    if (body.isPublished === true && !toSafeSitePathOrUrl(body.thumbnailUrl)) {
      return NextResponse.json({ error: 'A privacy-safe preview is required before publication.' }, { status: 400, headers: NO_STORE });
    }
    const record = await prisma.evidenceAsset.create({ data: evidenceData(body) });
    refreshPublicTrustPages();
    return NextResponse.json(record, { status: 201, headers: NO_STORE });
  } catch (error) {
    return trustPrismaErrorResponse(error, 'Failed to create trust record.');
  }
}

export async function PUT(request: NextRequest) {
  if (!(await authorized(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403, headers: NO_STORE });
  let body: Record<string, unknown>;
  try {
    body = await readLimitedJson(request, 64 * 1024);
  } catch (error) {
    return jsonBodyErrorResponse(error) || NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400, headers: NO_STORE });
  }
  if (!String(body.id || '').trim()) {
    return NextResponse.json({ error: 'Record id is required.' }, { status: 400, headers: NO_STORE });
  }
  try {
    if (body.kind === 'metric') {
      const record = await prisma.trustMetric.update({ where: { id: String(body.id) }, data: metricData(body) });
      refreshPublicTrustPages();
      return NextResponse.json(record, { headers: NO_STORE });
    }
    if (body.kind === 'office') {
      const error = validOffice(body);
      if (error) return NextResponse.json({ error }, { status: 400, headers: NO_STORE });
      const record = await prisma.office.update({ where: { id: String(body.id) }, data: officeData(body) });
      refreshPublicTrustPages();
      return NextResponse.json(record, { headers: NO_STORE });
    }
    if (body.kind === 'evidence') {
      if (!String(body.title || '').trim()) return NextResponse.json({ error: 'Evidence title is required.' }, { status: 400, headers: NO_STORE });
      const evidenceUrlError = validateTrustUrls(body, [
        { key: 'documentUrl', allowSitePath: true },
        { key: 'thumbnailUrl', allowSitePath: true },
        { key: 'sourceUrl', allowSitePath: false },
      ]);
      if (evidenceUrlError) return NextResponse.json({ error: evidenceUrlError }, { status: 400, headers: NO_STORE });
      if (body.isPublished === true && !toSafeSitePathOrUrl(body.thumbnailUrl)) {
        return NextResponse.json({ error: 'A privacy-safe preview is required before publication.' }, { status: 400, headers: NO_STORE });
      }
      const record = await prisma.evidenceAsset.update({ where: { id: String(body.id) }, data: evidenceData(body) });
      refreshPublicTrustPages();
      return NextResponse.json(record, { headers: NO_STORE });
    }
    if (body.kind === 'package') {
      const record = await prisma.servicePackage.update({ where: { id: String(body.id) }, data: packageData(body) });
      refreshPublicTrustPages();
      return NextResponse.json(record, { headers: NO_STORE });
    }
    if (body.kind === 'team') {
      if (!String(body.name || '').trim() || !String(body.role || '').trim() || !String(body.slug || '').trim()) {
        return NextResponse.json({ error: 'Name, role and profile slug are required.' }, { status: 400, headers: NO_STORE });
      }
      const urlError = validateTrustUrls(body, [{ key: 'photoUrl', allowSitePath: true }]);
      if (urlError) return NextResponse.json({ error: urlError }, { status: 400, headers: NO_STORE });
      const record = await prisma.teamMember.update({ where: { id: String(body.id) }, data: teamData(body) });
      refreshPublicTrustPages();
      return NextResponse.json(record, { headers: NO_STORE });
    }
    return NextResponse.json({ error: 'Unknown trust record type.' }, { status: 400, headers: NO_STORE });
  } catch (error) {
    return trustPrismaErrorResponse(error, 'Failed to update trust record.');
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await authorized(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403, headers: NO_STORE });
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get('kind');
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Record id is required.' }, { status: 400, headers: NO_STORE });
  try {
    if (kind === 'team') await prisma.teamMember.delete({ where: { id } });
    else if (kind === 'evidence') await prisma.evidenceAsset.delete({ where: { id } });
    else return NextResponse.json({ error: 'Unknown record type.' }, { status: 400, headers: NO_STORE });
    refreshPublicTrustPages();
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch (error) {
    return trustPrismaErrorResponse(error, 'Failed to delete trust record.');
  }
}
