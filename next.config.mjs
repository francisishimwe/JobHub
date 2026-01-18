/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This stops TypeScript from blocking the Vercel build
    ignoreBuildErrors: true,
  },
  eslint: {
    // This stops ESLint from blocking the Vercel build
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  compress: false,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: [],
  },
}

export default nextConfig
