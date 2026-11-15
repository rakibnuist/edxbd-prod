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

    const body = await readLimitedJson(request, 64 * 1024);
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
