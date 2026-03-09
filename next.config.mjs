/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable static file serving for uploads
  staticFileGlobPatterns: ['public/**/*'],
  // Increase request body size limit for Hostinger
  serverRuntimeConfig: {
    maxRequestSize: '50mb',
  },
  async redirects() {
    return [
      {
        // هذا السطر يعالج الرابط المكسور في جوجل ويحوله للرئيسية
        source: '/page',
        destination: '/',
        permanent: true, // 301 redirect لإخبار جوجل أن الرابط انتقل نهائياً
      },
    ]
  },
}

export default nextConfig
