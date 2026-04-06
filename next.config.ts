import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'opengraph.githubassets.com',
      },
      // Project deploy domains (thumbnails/hero images served from each project's deployment)
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.netlify.app',
      },
      {
        protocol: 'https',
        hostname: 'cushlabs.ai',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cushlabs.ai',
      },
      {
        protocol: 'https',
        hostname: 'voice.cushlabs.ai',
      },
      {
        protocol: 'https',
        hostname: 'www.nyenglishteacher.com',
      },
      {
        protocol: 'https',
        hostname: 'aistockalert.app',
      },
      {
        protocol: 'https',
        hostname: 'getexpatdrive.com',
      },
    ],
  },
};

export default nextConfig;
