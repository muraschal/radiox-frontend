// 🎯 CLEAN NEXT.JS CONFIG - FRONTEND ONLY

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  images: {
    domains: ['zwcvvbgkqhexfcldwuxq.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compiler optimizations
  swcMinify: true,
  
  // React optimizations
  reactStrictMode: true,
  
  // Build optimizations
  compress: true,
  poweredByHeader: false,
  
  // Progressive Web App optimizations
  ...(process.env.NODE_ENV === 'production' && {
    generateEtags: true,
    trailingSlash: false,
  }),
  
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Fast refresh is enabled by default in Next.js 14
  }),
}

module.exports = nextConfig 