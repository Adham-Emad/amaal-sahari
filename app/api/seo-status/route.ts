import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SLUG_MAP: Record<string, string> = {
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

function readContent() {
  try {
    const f = path.join(process.cwd(), 'data', 'content.json')
    if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'))
  } catch (e) { /* ignore */ }
  return null
}

export async function GET() {
  const c = readContent()
  const general = c?.seo?.general || {}
  const pages   = c?.seo?.pages   || []

  const pageStatus = Object.entries(SLUG_MAP).map(([url, slug]) => {
    const page = slug !== undefined ? pages.find((p: any) => p.slug === slug) : null
    return {
      url,
      title:       page?.metaTitle       || general.defaultMetaTitle       || '(default)',
      description: page?.metaDescription || general.defaultMetaDescription || '(default)',
      source:      page?.metaTitle ? 'page-specific' : 'general-default',
    }
  })

  const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID')
  const buildId = fs.existsSync(buildIdPath)
    ? fs.readFileSync(buildIdPath, 'utf8').trim()
    : 'unknown'

  return NextResponse.json({
    server_mjs_active: false,
    note: 'If X-SEO-Server: 1 header appears on page responses, server.mjs IS running. This API endpoint shows what metadata server.mjs would inject.',
    build_id: buildId,
    general_seo: {
      defaultTitle:       general.defaultMetaTitle       || '',
      defaultDescription: general.defaultMetaDescription || '',
    },
    pages: pageStatus,
    content_json_exists: fs.existsSync(path.join(process.cwd(), 'data', 'content.json')),
    content_json_size:   (() => {
      try {
        const f = path.join(process.cwd(), 'data', 'content.json')
        return fs.existsSync(f) ? fs.statSync(f).size : 0
      } catch { return 0 }
    })(),
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache',
      'Content-Type':  'application/json',
    }
  })
}
