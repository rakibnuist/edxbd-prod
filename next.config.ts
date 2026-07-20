import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone for Docker deployments
  output: "standalone",
  
  // Simplified configuration for Vercel compatibility
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Aggressive tree-shaking for icon libraries
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      skipDefaultConversion: true,
    },
  },

  experimental: {
    optimizePackageImports: ['framer-motion'],
  },

  // Basic image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compress: true,

  // Basic security headers
  async headers() {
    const securityHeaders = [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];

    if (process.env.NODE_ENV !== 'production') {
      return securityHeaders;
    }

    return [
      ...securityHeaders,
      // Tell browsers to always use HTTPS for this host for a year, so a
      // visitor who typed/bookmarked http:// never hits the insecure page
      // again. No includeSubDomains: crm/portal/study run on a separate
      // server and may not have their own certificate.
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
      {
        source: '/_next/static/:path*',
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
      {
        source: '/china-universities',
        destination: '/universities?country=China',
        permanent: true,
      },
      {
        source: '/china-success-stories',
        destination: '/success-stories',
        permanent: true,
      },
      {
        source: '/success-stories/china',
        destination: '/success-stories',
        permanent: true,
      },
      {
        source: '/destinations/united-kingdom',
        destination: '/destinations/uk',
        permanent: true,
      }
    ];
  },

  async rewrites() {
    return [
      {
        source: '/study-in-:country-from-bangladesh',
        destination: '/destinations/:country',
      }
    ];
  },
};

export default nextConfig;
