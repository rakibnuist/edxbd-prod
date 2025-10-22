import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  // Handle domain redirects in production
  if (process.env.NODE_ENV === 'production') {
    // Redirect eduexpressint.com to www.eduexpressint.com
    if (host === 'eduexpressint.com') {
      const url = new URL(request.nextUrl);
      url.host = 'www.eduexpressint.com';
      return NextResponse.redirect(url, 308);
    }
    
    // Ensure www.eduexpressint.com is the canonical domain
    if (host === 'www.eduexpressint.com') {
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/health).*)',
  ],
};


