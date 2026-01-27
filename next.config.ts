import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: 'output: export' removed to support Guest Snap API routes
  // Guest Snap requires server-side API routes for secure NAS credentials
  // Deploy to Vercel, Railway, or similar platforms that support Next.js API routes
  //
  // For static export without Guest Snap:
  // output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages 배포 시 주석 해제
  // basePath: '/wedding-invitation',
};

export default nextConfig;
