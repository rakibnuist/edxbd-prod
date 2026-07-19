import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { trackStudyAbroadLead } from '@/lib/meta-conversion-api';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.country || body.consent !== true || !body.consentTimestamp || !body.consentPolicyVersion) {
      return NextResponse.json(
        { error: 'Name, email, phone, country and recorded privacy consent are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Create new lead
    const lead = new Lead({
      ...body,
      source: body.source || 'website',
      status: 'new',
      consentTimestamp: new Date(body.consentTimestamp),
      consentPolicyVersion: body.consentPolicyVersion,
      landingPage: body.landingPage,
      utm: body.utm || {}
    });
    
    await lead.save();

    // Track lead with Meta Conversion API
    try {
      await trackStudyAbroadLead({
        name: body.name || 'Unknown',
        email: body.email || '',
        phone: body.phone || '',
        country: body.country || 'Not specified',
        program: body.program || 'Not specified',
        message: body.message || ''
      }, body.source || 'website', request);
    } catch (trackingError) {
      console.error('Meta Conversion API tracking error:', trackingError);
      // Don't fail the request if tracking fails
    }

    // Return success response
    return NextResponse.json(
      { 
        message: 'Lead submitted successfully',
        leadId: lead._id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lead submission error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'A lead with this email already exists' },
          { status: 409 }
        );
      }
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { error: 'Invalid data provided' },
          { status: 400 }
        );
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Failed to submit lead. Please try again.' },
      { status: 500 }
    );
  }
}
