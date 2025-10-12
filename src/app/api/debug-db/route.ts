import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    }

    // Get database name
    const dbName = db.databaseName;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    
    // Get leads collection info
    const leadsCollection = db.collection('leads');
    const leadCount = await leadsCollection.countDocuments();
    
    // Get sample leads
    const sampleLeads = await leadsCollection.find({}).limit(5).toArray();
    
    return NextResponse.json({
      databaseName: dbName,
      collections: collections.map(col => col.name),
      leadsCount: leadCount,
      sampleLeads: sampleLeads.map(lead => ({
        id: lead._id,
        name: lead.name,
        email: lead.email,
        createdAt: lead.createdAt
      })),
      connectionString: process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@') // Hide credentials
    });
  } catch (error) {
    console.error('Debug DB error:', error);
    return NextResponse.json(
      { error: 'Failed to get database info', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
