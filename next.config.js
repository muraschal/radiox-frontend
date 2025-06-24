/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14 - no experimental flag needed
  images: {
    domains: ['zwcvvbgkqhexfcldwuxq.supabase.co'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
}

module.exports = nextConfig 