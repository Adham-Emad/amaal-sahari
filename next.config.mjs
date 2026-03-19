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
  async headers() {
    return [
      // Prevent browsers from caching HTML pages so chunk hashes are always fresh after a deploy
      {
        source: '/((?!_next/static|_next/image|favicon|uploads|images).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        source: '/uploads/:file*.mov',
        headers: [{ key: 'Content-Type', value: 'video/quicktime' }],
      },
      {
        source: '/uploads/:file*.avi',
        headers: [{ key: 'Content-Type', value: 'video/x-msvideo' }],
      },
      {
        source: '/uploads/:file*.mkv',
        headers: [{ key: 'Content-Type', value: 'video/x-matroska' }],
      },
      {
        source: '/uploads/:file*.mp4',
        headers: [{ key: 'Content-Type', value: 'video/mp4' }],
      },
      {
        source: '/uploads/:file*.webm',
        headers: [{ key: 'Content-Type', value: 'video/webm' }],
      },
    ]
  },
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
