import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // One quality and format keep each source/width from creating extra variants.
    qualities: [85],
    formats: ['image/avif'],
    // Cards / portraits / mobile heroes / desktop heroes / retina heroes.
    // Small logos use their CDN's already-sized files without a transformation.
    imageSizes: [384],
    deviceSizes: [768, 1280, 1920, 3840],
    minimumCacheTTL: 60 * 60 * 24 * 31,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/vi/**',
      },
    ],
  },
  experimental: {
    // Reuse visited page segments; OTT lists have their own 30-minute cache.
    staleTimes: { dynamic: 300, static: 300 },
  },
  reactStrictMode: true,
}

export default nextConfig
