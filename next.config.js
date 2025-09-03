/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-supabase-project.supabase.co'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
