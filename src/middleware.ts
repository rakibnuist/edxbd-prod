import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  // Only redirect if we're on the non-www domain and not in development
  if (host === 'eduexpressint.com' && process.env.NODE_ENV === 'production') {
    const url = new URL(request.nextUrl);
    url.host = 'www.eduexpressint.com';
    return NextResponse.redirect(url, 308);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/health).*)',
  ],
};


