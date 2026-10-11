import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyTokenFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';

const authorized = (request: NextRequest) => verifyTokenFromRequest(request)?.role === 'admin';
const refreshPublicTrustPages = () => {
  revalidatePath('/');
  revalidatePath('/proof-library');
  revalidatePath('/about');
  revalidatePath('/for-parents');
};
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

const evidenceData = (body: Record<string, unknown>) => ({
  type: String(body.type || 'authorization').trim(),
  title: String(body.title || '').trim(),
  summary: optional(body.summary),
  organization: optional(body.organization),
  country: optional(body.country),
  universityId: optional(body.universityId),
  referenceLabel: optional(body.referenceLabel),
  documentUrl: optional(body.documentUrl),
  thumbnailUrl: optional(body.thumbnailUrl),
  sourceUrl: optional(body.sourceUrl),
  issuedAt: dateOrNull(body.issuedAt),
  validUntil: dateOrNull(body.validUntil),
  lastVerifiedAt: dateOrNull(body.lastVerifiedAt),
  privacyStatus: privacyStatus(body.privacyStatus),
  isPublished: body.isPublished === true && privacyStatus(body.privacyStatus) === 'redacted' && Boolean(optional(body.thumbnailUrl)),
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
  email: optional(body.email), hours: String(body.hours || '').trim(), mapUrl: optional(body.mapUrl), photoUrl: optional(body.photoUrl), isHeadOffice: body.isHeadOffice === true,
  isPublished: body.isPublished !== false, lastVerifiedAt: dateOrNull(body.lastVerifiedAt),
});

const teamData = (body: Record<string, unknown>) => ({
  slug: String(body.slug || '').trim(), name: String(body.name || '').trim(), role: String(body.role || '').trim(), shortRole: optional(body.shortRole),
  bio: optional(body.bio), specialties: JSON.stringify(list(body.specialties)), photoUrl: optional(body.photoUrl),
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
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const [metrics, evidence, offices, team, universities, servicePackages] = await Promise.all([
    prisma.trustMetric.findMany({ orderBy: [{ displayOrder: 'asc' }, { key: 'asc' }] }),
    prisma.evidenceAsset.findMany({ orderBy: [{ displayOrder: 'asc' }, { updatedAt: 'desc' }] }),
    prisma.office.findMany({ orderBy: [{ isHeadOffice: 'desc' }, { name: 'asc' }] }),
    prisma.teamMember.findMany({ orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }] }),
    prisma.university.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.servicePackage.findMany({ orderBy: [{ displayOrder: 'asc' }, { title: 'asc' }] }),
  ]);
  return NextResponse.json({ metrics, evidence, offices, team: team.map(member => ({ ...member, specialties: parseList(member.specialties) })), universities, packages: servicePackages.map(item => ({ ...item, includedItems: parseList(item.includedItems), excludedItems: parseList(item.excludedItems), securityOptions: parseList(item.securityOptions) })) });
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const body = await request.json() as Record<string, unknown>;
  if (body.kind === 'team') {
    if (!body.name || !body.role || !body.slug) return NextResponse.json({ error: 'Name, role and profile slug are required.' }, { status: 400 });
    const record = await prisma.teamMember.create({ data: teamData(body) });
    refreshPublicTrustPages();
    return NextResponse.json(record, { status: 201 });
  }
  if (body.kind !== 'evidence') return NextResponse.json({ error: 'Unknown record type.' }, { status: 400 });
  if (!body.title) return NextResponse.json({ error: 'Evidence title is required.' }, { status: 400 });
  if (body.isPublished === true && !optional(body.thumbnailUrl)) return NextResponse.json({ error: 'A privacy-safe preview is required before publication.' }, { status: 400 });
  const record = await prisma.evidenceAsset.create({ data: evidenceData(body) });
  refreshPublicTrustPages();
  return NextResponse.json(record, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const body = await request.json() as Record<string, unknown>;
  if (body.kind === 'metric') {
    const record = await prisma.trustMetric.update({ where: { id: String(body.id) }, data: metricData(body) });
    refreshPublicTrustPages();
    return NextResponse.json(record);
  }
  if (body.kind === 'office') {
    const record = await prisma.office.update({ where: { id: String(body.id) }, data: officeData(body) });
    refreshPublicTrustPages();
    return NextResponse.json(record);
  }
  if (body.kind === 'evidence') {
    if (body.isPublished === true && !optional(body.thumbnailUrl)) return NextResponse.json({ error: 'A privacy-safe preview is required before publication.' }, { status: 400 });
    const record = await prisma.evidenceAsset.update({ where: { id: String(body.id) }, data: evidenceData(body) });
    refreshPublicTrustPages();
    return NextResponse.json(record);
  }
  if (body.kind === 'package') {
    const record = await prisma.servicePackage.update({ where: { id: String(body.id) }, data: packageData(body) });
    refreshPublicTrustPages();
    return NextResponse.json(record);
  }
  if (body.kind === 'team') {
    const record = await prisma.teamMember.update({ where: { id: String(body.id) }, data: teamData(body) });
    refreshPublicTrustPages();
    return NextResponse.json(record);
  }
  return NextResponse.json({ error: 'Unknown trust record type.' }, { status: 400 });
}

export async function DELETE(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get('kind');
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Record id is required.' }, { status: 400 });
  if (kind === 'team') await prisma.teamMember.delete({ where: { id } });
  else if (kind === 'evidence') await prisma.evidenceAsset.delete({ where: { id } });
  else return NextResponse.json({ error: 'Unknown record type.' }, { status: 400 });
  refreshPublicTrustPages();
  return NextResponse.json({ ok: true });
}
