import type { NextConfig } from "next";
import { buildAdminSecurityHeaders, buildGlobalSecurityHeaders, IMAGE_REMOTE_PATTERNS } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  // Keep the live development compiler isolated from `next build`. Without
  // separate folders, a production build can replace the CSS/chunks currently
  // being served by localhost and leave the page unstyled until a restart.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',

  // Development chunk names are stable across restarts. A versioned local
  // prefix prevents browsers that once cached those URLs from mixing an old
  // client bundle with newly rendered HTML.
  assetPrefix: process.env.NODE_ENV !== 'production' ? '/_dev-assets/20260803-1' : undefined,

  // Output standalone for Docker deployments
  output: "standalone",
  
  // Simplified configuration for Vercel compatibility
  poweredByHeader: false,

  // Basic image optimization
  images: {
    // The bundled image runtime cannot decode local assets reliably in the
    // current desktop/Docker environment. Public assets are already resized
    // and compressed, so serve them directly instead of returning broken 400s.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: IMAGE_REMOTE_PATTERNS,
  },
  compress: true,

  experimental: {
    optimizePackageImports: ['framer-motion'],

    // Disable interactive upgrade halt so non-interactive CI/Docker builds succeed.
    agentUpgrade: false,
  },

  // Basic security headers
  async headers() {
    const securityHeaders = [
      {
        source: '/(.*)',
        headers: buildGlobalSecurityHeaders({
          isProduction: process.env.NODE_ENV === 'production',
        }),
      },
      {
        source: '/admin',
        headers: buildAdminSecurityHeaders(),
      },
      {
        source: '/admin/:path*',
        headers: buildAdminSecurityHeaders(),
      },
      {
        source: '/dashboard/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      {
        source: '/login',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      {
        source: '/sitemap-submission',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/track/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      {
        source: '/s/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ];

    if (process.env.NODE_ENV !== 'production') {
      return [
        ...securityHeaders,
        {
          source: '/_dev-assets/20260803-1/_next/static/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, max-age=0',
            },
          ],
        },
      ];
    }

    return [
      ...securityHeaders,
      // Tell browsers to always use HTTPS for this host for a year, so a
      // visitor who typed/bookmarked http:// never hits the insecure page
      // again. No includeSubDomains: legacy/other subdomains may run separately.
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000',
          },
        ],
      },
      // Cache static assets aggressively in production only. Development
      // bundles reuse filenames and must never be marked immutable.
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Basic redirects
  async redirects() {
    return [
      // Canonical host: force www → non-www (apex) with a single 301 hop.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.eduexpressint.com' }],
        destination: 'https://eduexpressint.com/:path*',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // Retire the unauthenticated legacy dashboard in favor of the secured
      // admin console. These are operational redirects, not public SEO URLs.
      { source: '/dashboard', destination: '/admin', permanent: false },
      { source: '/dashboard/content', destination: '/admin/content', permanent: false },
      { source: '/dashboard/leads', destination: '/admin/leads', permanent: false },
      { source: '/dashboard/partnerships', destination: '/admin/partnerships', permanent: false },
      { source: '/dashboard/testimonials', destination: '/admin/testimonials', permanent: false },
      { source: '/admin/dashboard', destination: '/admin', permanent: false },
      {
        source: '/success-stories/china',
        destination: '/china-success-stories',
        permanent: true,
      },
      // Merged 2026-08-16: /complaints-and-review duplicated
      // /complaints-and-resolution. Content was folded into the approved slug.
      {
        source: '/complaints-and-review',
        destination: '/complaints-and-resolution',
        permanent: true,
      },
      // 2027 Cycle URL Upgrade: complete-csc-universities-list-2026 -> complete-csc-universities-list-2027
      {
        source: '/updates/complete-csc-universities-list-2026',
        destination: '/updates/complete-csc-universities-list-2027',
        permanent: true,
      },
      {
        source: '/updates/complete-csc-universities-list',
        destination: '/updates/complete-csc-universities-list-2027',
        permanent: true,
      },
      {
        source: '/csc-universities-list-2027',
        destination: '/updates/complete-csc-universities-list-2027',
        permanent: true,
      },
      {
        source: '/destinations/united-kingdom',
        destination: '/study-in-uk-from-bangladesh',
        permanent: true,
      },
      {
        source: '/destinations/netherlands',
        destination: '/destinations',
        permanent: true,
      },
      {
        source: '/destinations/:country',
        destination: '/study-in-:country-from-bangladesh',
        permanent: true,
      },
      {
        source: '/assessment',
        destination: '/education-fit-assessment',
        permanent: true,
      },
      {
        source: '/universities/zhengzhou-university',
        destination: '/universities/zzu',
        permanent: true,
      },
      {
        source: '/universities/northwestern-polytechnical-university',
        destination: '/universities/npu',
        permanent: true,
      },
      {
        source: '/universities/jiangsu-normal-university',
        destination: '/universities/jsnu',
        permanent: true,
      },
      {
        source: '/universities/nanjing-university-of-posts-and-telecommunications',
        destination: '/universities/njupt',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/_dev-assets/20260803-1/_next/:path*',
        destination: '/_next/:path*',
      },
      {
        source: '/study-in-:country-from-bangladesh',
        destination: '/destinations/:country',
      }
    ];
  },
};

export default nextConfig;
