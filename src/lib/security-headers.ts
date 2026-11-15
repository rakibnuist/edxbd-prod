export const IMAGE_REMOTE_PATTERNS = [
  { protocol: 'https' as const, hostname: 'eduexpressint.com' },
  { protocol: 'https' as const, hostname: 'www.eduexpressint.com' },
  { protocol: 'https' as const, hostname: 'images.unsplash.com' },
  { protocol: 'https' as const, hostname: 'grainy-gradients.vercel.app' },
  { protocol: 'https' as const, hostname: 'i.ibb.co.com' },
  { protocol: 'https' as const, hostname: 'subsites.chinadaily.com.cn' },
  { protocol: 'https' as const, hostname: 'www.polito.it' },
  { protocol: 'https' as const, hostname: '**.edu.cn' },
];

export const PERMISSIONS_POLICY =
  'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()';

export function buildContentSecurityPolicy(options: { isProduction: boolean }): string {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(options.isProduction ? [] : ["'unsafe-eval'"]),
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://connect.facebook.net',
    'https://va.vercel-scripts.com',
  ].join(' ');

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net https://vitals.vercel-insights.com https://va.vercel-scripts.com",
    'frame-src https://www.googletagmanager.com https://www.facebook.com',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://www.facebook.com",
    "frame-ancestors 'none'",
    ...(options.isProduction ? ['upgrade-insecure-requests'] : []),
  ];

  return directives.join('; ');
}

export function buildGlobalSecurityHeaders(options: { isProduction: boolean }) {
  return [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: PERMISSIONS_POLICY },
    { key: 'Content-Security-Policy', value: buildContentSecurityPolicy(options) },
  ];
}
