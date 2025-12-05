/** @type {import('next').NextConfig} */
const internalBase = (process.env.INTERNAL_API_URL || 'http://backend:8080/api').replace(/\/api$/, '')
const nextConfig = {
  env: {},
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${internalBase}/:path*` },
    ];
  },
}

module.exports = nextConfig
