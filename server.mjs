/**
 * server.mjs — Custom SEO-aware production server.
 *
 * Intercepts every HTML page response from Next.js and replaces
 * <title>, meta description, keywords, og:* and twitter:* tags with
 * live values from data/content.json — without any rebuild or redeploy.
 *
 * Works regardless of whether Hostinger statically pre-rendered the pages
 * or serves them dynamically via next start.
 */

import { createServer }                 from 'node:http'
import { parse }                        from 'node:url'
import next                             from 'next'
import { readFileSync, existsSync }     from 'node:fs'
import { join }                         from 'node:path'

const PORT = parseInt(process.env.PORT || '5000', 10)
const dev  = process.env.NODE_ENV === 'development'

// ── Content cache ─────────────────────────────────────────────────────────────
let _content = null
let _cacheAt = 0
const CACHE_TTL = 5000   // re-read content.json every 5 s at most

function getContent() {
  const now = Date.now()
  if (_content && (now - _cacheAt) < CACHE_TTL) return _content
  try {
    const f = join(process.cwd(), 'data', 'content.json')
    if (existsSync(f)) {
      _content = JSON.parse(readFileSync(f, 'utf8'))
      _cacheAt = now
    }
  } catch (e) {
    console.error('[seo-server] content.json read error:', e.message)
  }
  return _content
}

// Call this after admin saves content so the cache refreshes immediately
export function invalidateServerCache() { _content = null; _cacheAt = 0 }

// ── URL → slug mapping ────────────────────────────────────────────────────────
const SLUG_MAP = {
  '/':         '',
  '/about':    'about',
  '/contact':  'contact',
  '/blog':     'blog',
  '/careers':  'careers',
  '/news':     'news',
  '/faqs':     'faqs',
  '/privacy':  'privacy',
  '/terms':    'terms',
  '/services': 'services',
}

function getMeta(pathname) {
  const c = getContent()
  if (!c) return null
  const g    = c?.seo?.general || {}
  const norm = pathname.replace(/\/+$/, '') || '/'
  const slug = Object.prototype.hasOwnProperty.call(SLUG_MAP, norm)
    ? SLUG_MAP[norm] : '_dynamic_'
  const page = (slug && slug !== '_dynamic_')
    ? (c?.seo?.pages || []).find(p => p.slug === slug) : null
  return {
    title:       page?.metaTitle       || g.defaultMetaTitle       || 'Amaal Sahari',
    description: page?.metaDescription || g.defaultMetaDescription || '',
    keywords:    page?.metaKeywords    || g.metaKeywords           || '',
  }
}

// ── HTML meta injection ───────────────────────────────────────────────────────
function safe(s) {
  return String(s || '')
    .replace(/&(?![#a-zA-Z0-9]+;)/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function patch(html, selector, val) {
  // Matches: <meta ... selector ... content="OLD" ...>  (attribute in either order)
  const a = new RegExp(`(<meta\\b[^>]*\\b${selector}[^>]*\\bcontent=")[^"]*("(?:[^>]*)>)`, 'gi')
  const b = new RegExp(`(<meta\\b[^>]*\\bcontent=")[^"]*("(?:[^>]*\\b)${selector}[^>]*>)`, 'gi')
  return html.replace(a, `$1${val}$2`).replace(b, `$1${val}$2`)
}

function injectMeta(html, { title, description, keywords }) {
  const t = safe(title), d = safe(description), k = safe(keywords)
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${t}</title>`)
  html = patch(html, `name=["']description["']`,        d)
  html = patch(html, `name=["']keywords["']`,           k)
  html = patch(html, `property=["']og:title["']`,       t)
  html = patch(html, `property=["']og:description["']`, d)
  html = patch(html, `name=["']twitter:title["']`,       t)
  html = patch(html, `name=["']twitter:description["']`, d)
  return html
}

// ── Request filter ────────────────────────────────────────────────────────────
function isPage(pathname) {
  if (pathname.startsWith('/_next/'))    return false
  if (pathname.startsWith('/api/'))      return false
  if (pathname.startsWith('/uploads/'))  return false
  if (pathname.startsWith('/images/'))   return false
  if (/\.[a-zA-Z0-9]{1,6}$/.test(pathname)) return false
  return true
}

// ── Buffer helper (handles Buffer, Uint8Array, and strings) ──────────────────
function toBuffer(chunk, encoding) {
  if (Buffer.isBuffer(chunk)) return chunk
  // Uint8Array (common in Next.js 16 streaming) — must NOT use String()
  if (chunk instanceof Uint8Array) return Buffer.from(chunk)
  if (typeof chunk === 'string') {
    return Buffer.from(chunk, typeof encoding === 'string' ? encoding : 'utf8')
  }
  return Buffer.alloc(0)
}

// ── Next.js app ───────────────────────────────────────────────────────────────
const nextApp = next({ dev, hostname: '0.0.0.0', port: PORT })
const handle  = nextApp.getRequestHandler()
await nextApp.prepare()

// ── Server ────────────────────────────────────────────────────────────────────
createServer((req, res) => {
  const url      = parse(req.url, true)
  const pathname = url.pathname || '/'

  if (!isPage(pathname)) return handle(req, res, url)

  const meta = getMeta(pathname)
  if (!meta)             return handle(req, res, url)

  // Prevent compression so we can modify raw text
  req.headers['accept-encoding'] = 'identity'

  // ── Snapshot original methods before any override ─────────────────────────
  const origWriteHead = res.writeHead.bind(res)
  const origWrite     = res.write.bind(res)
  const origEnd       = res.end.bind(res)

  let isHtml        = false   // determined from Content-Type
  let ended         = false   // guard against double-end calls
  const chunks      = []      // buffered HTML chunks

  // ── Intercept writeHead ────────────────────────────────────────────────────
  // Next.js calls writeHead(200, {'Content-Type':'text/html',...}) which would
  // "commit" headers (set res._header), preventing later removeHeader() calls.
  // We defer it for HTML so we can modify headers at flush time.
  let deferredHead = null      // { statusCode, statusMessage, headers }

  res.writeHead = function (statusCode, statusMessage, headers) {
    // Normalise overloaded signature: (code, headers) or (code, msg, headers)
    let msg = statusMessage, hdrs = headers
    if (typeof statusMessage === 'object' && statusMessage !== null) {
      hdrs = statusMessage; msg = undefined
    }
    const ct = (hdrs && (hdrs['content-type'] || hdrs['Content-Type'])) || ''
    isHtml = ct.includes('text/html')

    if (!isHtml) {
      // Not HTML — send headers immediately as normal
      res.writeHead = origWriteHead
      return origWriteHead(statusCode, msg, hdrs)
    }

    // HTML — defer until we've modified the body
    deferredHead = { statusCode, msg, hdrs: { ...(hdrs || {}) } }
    return res   // return res so chaining works
  }

  // ── Intercept write ────────────────────────────────────────────────────────
  res.write = function (chunk, encoding, callback) {
    // If isHtml still unknown, check headers now
    if (!isHtml) {
      const ct = res.getHeader('content-type') || ''
      isHtml = ct.includes('text/html')
    }
    if (!isHtml) return origWrite(chunk, encoding, callback)

    // Next.js 16 may pass Uint8Array (not Buffer). String(Uint8Array) gives
    // "60,33,68,79..." — so we must use Buffer.from() for all typed arrays.
    const buf = toBuffer(chunk, encoding)
    chunks.push(buf)
    if (typeof callback === 'function') process.nextTick(callback)
    return true
  }

  // ── Intercept end ─────────────────────────────────────────────────────────
  res.end = function (chunk, encoding, callback) {
    if (ended) return   // prevent double-end
    ended = true

    // Resolve isHtml if not yet known
    if (!isHtml) {
      const ct = res.getHeader('content-type') || ''
      isHtml = ct.includes('text/html')
    }

    // Restore originals FIRST — origEnd/origWrite must work cleanly below
    res.writeHead = origWriteHead
    res.write     = origWrite
    res.end       = origEnd

    if (!isHtml) return origEnd(chunk, encoding, callback)

    // Add trailing chunk if any
    if (chunk) {
      const buf = toBuffer(chunk, encoding)
      if (buf.length) chunks.push(buf)
    }

    // Build complete HTML and inject metadata
    let html = Buffer.concat(chunks).toString('utf8')
    if (html.includes('<title>')) {
      try { html = injectMeta(html, meta) }
      catch (e) { console.error('[seo-server] inject error:', e.message) }
    }

    const outBuf = Buffer.from(html, 'utf8')

    // Flush deferred writeHead (or set headers directly)
    if (deferredHead) {
      const h = deferredHead.hdrs
      delete h['transfer-encoding']
      delete h['Transfer-Encoding']
      h['content-length']            = String(outBuf.byteLength)
      h['cache-control']             = 'no-store, no-cache, must-revalidate'
      h['pragma']                    = 'no-cache'
      h['expires']                   = '0'
      h['x-litespeed-cache-control'] = 'no-cache'
      h['surrogate-control']         = 'no-store'
      origWriteHead(deferredHead.statusCode, deferredHead.msg, h)
    } else {
      try { res.removeHeader('Transfer-Encoding') } catch (_) {}
      res.setHeader('Content-Length',            outBuf.byteLength)
      res.setHeader('Cache-Control',             'no-store, no-cache, must-revalidate')
      res.setHeader('Pragma',                    'no-cache')
      res.setHeader('Expires',                   '0')
      res.setHeader('X-LiteSpeed-Cache-Control', 'no-cache')
      res.setHeader('Surrogate-Control',         'no-store')
    }

    return origEnd(outBuf, typeof callback === 'function' ? callback : undefined)
  }

  // Mark this response as handled by our SEO server so headers are checkable
  res.setHeader('X-SEO-Server', '1')

  handle(req, res, url)

}).listen(PORT, '0.0.0.0', err => {
  if (err) throw err
  console.log(`> SEO server ready on http://0.0.0.0:${PORT}`)
  console.log(`> Meta tags injected from content.json on every HTML request`)
})
