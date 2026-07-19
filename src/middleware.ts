import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Redirect eduexpress.info or staging to main domain
  if (
    hostname === 'eduexpress.info' ||
    hostname === 'www.eduexpress.info' ||
    hostname.includes('vercel.app')
  ) {
    return NextResponse.redirect(`https://eduexpressint.com${url.pathname}${url.search}`, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/health).*)',
  ],
};


