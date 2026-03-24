import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware: Prevent CDN-level caching of HTML pages.
 *
 * Hostinger's hcdn layer caches HTML responses with a 300-second TTL
 * regardless of Next.js `force-dynamic` or `revalidatePath`. This middleware
 * adds Surrogate-Control and LiteSpeed-specific headers so the CDN treats every
 * page response as non-cacheable, ensuring the Next.js-generated <title> and
 * <meta> tags (from generateMetadata) are always fresh.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Skip API routes, static assets, and Next.js internals
  const { pathname } = request.nextUrl
  const isPage =
    !pathname.startsWith('/_next/') &&
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/uploads/') &&
    !pathname.startsWith('/images/') &&
    !/\.[a-zA-Z0-9]{1,6}$/.test(pathname)

  if (isPage) {
    // Tell CDNs (Hostinger hcdn, Varnish, Cloudflare, etc.) not to cache HTML
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    // LiteSpeed-specific (Hostinger uses LiteSpeed): disable object cache
    response.headers.set('X-LiteSpeed-Cache-Control', 'no-cache')
    // RFC 7234 surrogate directive — tells any shared proxy/CDN not to cache
    response.headers.set('Surrogate-Control', 'no-store')
    // Vary to prevent cross-user caching
    response.headers.set('Vary', 'Accept-Language')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
