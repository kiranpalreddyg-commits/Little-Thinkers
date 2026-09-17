import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Tree-shake lucide-react and other icon libraries at module level
    optimizePackageImports: ['lucide-react'],
    // Disabled: on an 8 GB Mac the persistent Turbopack dev cache wrote >100 MB/s
    // to .next/dev/cache and drove the machine into swap-thrash kernel panics.
    turbopackFileSystemCacheForDev: false,
  },
  // PostHog reverse proxy — routes analytics through this domain to avoid ad-blockers
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/array/:path*',
        destination: 'https://us-assets.i.posthog.com/array/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      // Removed the /_next/static/ override to allow Next.js to manage its own caching
      {
        source: '/icons/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;