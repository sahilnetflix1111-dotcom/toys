import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['lavish-bucket-vastness.ngrok-free.dev'],
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.sensual.co.in',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.node'],
    '/*': ['./node_modules/**/*.wasm', './node_modules/**/*.node']
  },
};

export default nextConfig;
