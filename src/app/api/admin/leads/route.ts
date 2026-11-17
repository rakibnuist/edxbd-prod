import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/lib/auth';
import { verifyLiveAdminUser } from '@/lib/auth-user';
import { isLeadStatus } from '@/lib/lead-workflow';
import { validateAdminLeadCreate } from '@/lib/payload-validation';
import { jsonBodyErrorResponse, readLimitedJson } from '@/lib/request-body';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);

    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const country = searchParams.get('country');

    let query = {};
    if (status && status !== 'all') {
      query = { ...query, status };
    }
    if (source && source !== 'all') {
      query = { ...query, source };
    }
    if (country && country !== 'all') {
      query = { ...query, country };
    }

    const leads = await prisma.lead.findMany({
      where: query,
      orderBy: { createdAt: 'desc' }
    });






    return NextResponse.json(leads, { headers: { 'Cache-Control': 'no-store, private' } });
  } catch {
    // Error fetching leads
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await readLimitedJson(request, 512 * 1024);

    if (Array.isArray(body.leads)) {
      if (body.leads.length === 0) {
        return NextResponse.json({ error: 'Provide at least one lead to import.' }, { status: 400 });
      }
      if (body.leads.length > 500) {
        return NextResponse.json({ error: 'Batch import is limited to 500 leads per request.' }, { status: 400 });
      }

      const existing = await prisma.lead.findMany({ select: { phone: true } });
      const existingPhones = new Set(
        existing.map((l) => String(l.phone || '').replace(/\D/g, '').slice(-10)).filter(Boolean),
      );

      const created: Awaited<ReturnType<typeof prisma.lead.create>>[] = [];
      let skippedCount = 0;
      let invalidCount = 0;

      for (const item of body.leads) {
        const validated = validateAdminLeadCreate(item, isLeadStatus);
        if (!validated.data) {
          invalidCount++;
          continue;
        }
        const key10 = validated.data.phone.replace(/\D/g, '').slice(-10);
        if (key10 && existingPhones.has(key10)) {
          skippedCount++;
          continue;
        }
        const lead = await prisma.lead.create({
          data: {
            ...validated.data,
            ...(validated.data.source.startsWith('meta_') ? { adTrackingConsent: true } : {}),
          },
        });
        created.push(lead);
        if (key10) existingPhones.add(key10);
      }

      if (created.length === 0 && skippedCount === 0 && invalidCount > 0) {
        return NextResponse.json({ error: 'No valid lead rows in import batch.' }, { status: 400 });
      }

      return NextResponse.json(
        { created, importedCount: created.length, skippedCount, invalidCount },
        { status: 201 }
      );
    }

    const validated = validateAdminLeadCreate(body, isLeadStatus);
    if (!validated.data) {
      return NextResponse.json({ error: validated.error || 'Invalid lead payload' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: validated.data,
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    const bodyError = jsonBodyErrorResponse(error);
    if (bodyError) return bodyError;
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const decoded = await verifyLiveAdminUser(request);
    
    if (!decoded || !isAdminRole(decoded.role)) {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const deletedLead = await prisma.lead.delete({
      where: { id: leadId }
    }).catch(() => null);

    if (!deletedLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Lead deleted successfully', deletedLead });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
