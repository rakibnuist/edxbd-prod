import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Simplified configuration for Vercel compatibility
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable SWC for offline environments
  swcMinify: false,

  // Aggressive tree-shaking for icon libraries
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      skipDefaultConversion: true,
    },
  },

  experimental: {
    optimizePackageImports: ['framer-motion'],
    optimizeCss: {
      critters: true,
    },
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
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
