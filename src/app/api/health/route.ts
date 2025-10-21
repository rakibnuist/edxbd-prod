import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      mongodb: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
    };

    // Check if we're in production
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = !!process.env.VERCEL;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: isVercel,
        vercelEnv: process.env.VERCEL_ENV,
      },
      envCheck,
      deployment: {
        isProduction,
        isVercel,
        region: process.env.VERCEL_REGION,
      },
      message: 'API is running successfully'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Health check endpoint - use GET method',
    method: 'POST not supported'
  }, { status: 405 });
}
