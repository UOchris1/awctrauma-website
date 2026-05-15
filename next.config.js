/** @type {import('next').NextConfig} */
const supabaseHostname = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').hostname
  } catch {
    return 'umivnjhsafvlazjohqhj.supabase.co'
  }
})()

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname || 'umivnjhsafvlazjohqhj.supabase.co',
        pathname: '/storage/v1/object/public/**'
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
}

module.exports = nextConfig
