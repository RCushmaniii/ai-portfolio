import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
