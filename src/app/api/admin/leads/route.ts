import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request);
    
    console.log('Leads API - Token verification result:', decoded);
    console.log('Leads API - Request headers:', Object.fromEntries(request.headers.entries()));
    
    if (!decoded || decoded.role !== 'admin') {
      console.log('Leads API - Authentication failed:', { decoded, role: decoded?.role });
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    await connectDB();

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

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    console.log(`Found ${leads.length} leads in database`);
    console.log('Query used:', query);
    console.log('Database name:', mongoose.connection.db?.databaseName);
    console.log('Collection name:', Lead.collection.name);
    console.log('Sample lead:', leads[0] ? { id: leads[0]._id, name: leads[0].name, email: leads[0].email } : 'No leads found');
    console.log('All lead IDs:', leads.map(lead => lead._id));

    return NextResponse.json(leads);
  } catch (error) {
    // Error fetching leads
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();
    const lead = new Lead(body);
    await lead.save();

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const decoded = verifyTokenFromRequest(request);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const deletedLead = await Lead.findByIdAndDelete(leadId);

    if (!deletedLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    console.log(`Lead deleted: ${deletedLead._id} - ${deletedLead.name}`);

    return NextResponse.json({ message: 'Lead deleted successfully', deletedLead });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
