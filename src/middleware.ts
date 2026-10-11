import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const normalizedHostname = hostname
    .replace(/^\[([^\]]+)\](?::\d+)?$/, '$1')
    .replace(/:\d+$/, '')
    .toLowerCase();
  const isLocalHostname =
    normalizedHostname === 'localhost' ||
    normalizedHostname === '127.0.0.1' ||
    normalizedHostname === '::1' ||
    normalizedHostname.endsWith('.localhost');

  // Force HTTPS. Traefik terminates TLS and forwards the ORIGINAL scheme in
  // x-forwarded-proto, so a plain-HTTP hit on the apex (the "Not Secure"
  // case) arrives here as 'http'. Explicit === 'http' comparison avoids the
  // redirect loop a loose 'http' regex would cause (it would also match
  // 'https'). Next.js may add the header locally, so local hostnames must be
  // excluded explicitly because the development server does not terminate TLS.
  const forwardedProto = (request.headers.get('x-forwarded-proto') || '').split(',')[0].trim();
  if (!isLocalHostname && forwardedProto === 'http') {
    return NextResponse.redirect(`https://${hostname}${url.pathname}${url.search}`, 301);
  }

  // Redirect eduexpress.info or staging to main domain
  if (
    normalizedHostname === 'eduexpress.info' ||
    normalizedHostname === 'www.eduexpress.info' ||
    normalizedHostname.endsWith('.vercel.app')
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

