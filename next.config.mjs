/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    process.env.REPLIT_DEV_DOMAIN,
    '*.replit.dev',
    '*.janeway.replit.dev',
    '*.kirk.replit.dev',
    '*.repl.co',
    'localhost',
    '127.0.0.1',
  ].filter(Boolean),
  async redirects() {
    return [
      {
        source: '/page',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
