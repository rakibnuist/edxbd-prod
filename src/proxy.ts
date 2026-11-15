import { NextResponse, NextRequest } from 'next/server';
import { resolveProxyRedirect } from '@/lib/proxy-redirect';

export function proxy(request: NextRequest) {
  const redirectUrl = resolveProxyRedirect({
    hostHeader: request.headers.get('host'),
    forwardedProtoHeader: request.headers.get('x-forwarded-proto'),
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
  });

  if (redirectUrl) {
    return NextResponse.redirect(redirectUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/health).*)',
  ],
};
