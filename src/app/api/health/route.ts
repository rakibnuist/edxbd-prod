import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: Request) {
  try {
    // Check environment variables
    const envCheck = {
      mongodb: !!process.env.MONGODB_URI,
      jwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
    };

    // Check if we're in production
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = !!process.env.VERCEL;

    // Test database connection if MONGODB_URI is available
    let dbStatus = 'not_configured';
    if (process.env.MONGODB_URI) {
      try {
        const connectDB = (await import('@/lib/mongodb')).default;
        await connectDB();
        dbStatus = 'connected';
      } catch (dbError) {
        dbStatus = 'connection_failed';
        console.error('Database connection test failed:', dbError);
      }
    }

    return NextResponse.json({
      status: envCheck.mongodb ? 'healthy' : 'missing_env_vars',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: isVercel,
        vercelEnv: process.env.VERCEL_ENV,
        region: process.env.VERCEL_REGION,
      },
      envCheck,
      database: {
        status: dbStatus,
        configured: envCheck.mongodb,
      },
      deployment: {
        isProduction,
        isVercel,
        region: process.env.VERCEL_REGION,
      },
      message: envCheck.mongodb
        ? 'API is running successfully'
        : 'Missing required environment variables (MONGODB_URI)',
      instructions: envCheck.mongodb
        ? 'All systems operational'
        : 'Please set MONGODB_URI environment variable in Vercel dashboard'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        instructions: 'Check Vercel logs for detailed error information'
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
