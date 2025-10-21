import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'API endpoint not found',
      message: 'The requested API endpoint does not exist',
      availableEndpoints: [
        '/api/auth/login',
        '/api/auth/logout', 
        '/api/auth/me',
        '/api/leads',
        '/api/partnership',
        '/api/testimonials',
        '/api/contact',
        '/api/upload',
        '/api/admin/*',
        '/api/meta-conversion',
        '/api/indexnow'
      ]
    },
    { status: 404 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'API endpoint not found',
      message: 'The requested API endpoint does not exist'
    },
    { status: 404 }
  );
}
