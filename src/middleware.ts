import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Force HTTPS. Traefik terminates TLS and forwards the ORIGINAL scheme in
  // x-forwarded-proto, so a plain-HTTP hit on the apex (the "Not Secure"
  // case) arrives here as 'http'. Explicit === 'http' comparison avoids the
  // redirect loop a loose 'http' regex would cause (it would also match
  // 'https'). Localhost/dev sends no such header, so it is unaffected.
  const forwardedProto = (request.headers.get('x-forwarded-proto') || '').split(',')[0].trim();
  if (forwardedProto === 'http') {
    return NextResponse.redirect(`https://${hostname}${url.pathname}${url.search}`, 301);
  }

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


