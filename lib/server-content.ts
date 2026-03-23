import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const CONTENT_FILE = path.join(DATA_DIR, 'content.json')

let cachedContent: any = null
let cacheTime = 0
const CACHE_TTL = 5000

export function invalidateContentCache() {
  cachedContent = null
  cacheTime = 0
}

export function getServerContent(): any {
  const now = Date.now()
  if (cachedContent && now - cacheTime < CACHE_TTL) {
    return cachedContent
  }

  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, 'utf-8')
      cachedContent = JSON.parse(raw)
      cacheTime = now
      return cachedContent
    }
  } catch (e) {
    console.error('[SEO] Failed to read content file:', e)
  }

  return null
}

export function getPageSEO(slug: string) {
  const content = getServerContent()
  if (!content?.seo) return null

  const pageSEO = content.seo.pages?.find((p: any) => p.slug === slug)
  const general = content.seo.general

  return {
    title: pageSEO?.metaTitle || general?.defaultMetaTitle || 'Amaal Sahari',
    description: pageSEO?.metaDescription || general?.defaultMetaDescription || '',
    keywords: pageSEO?.metaKeywords || general?.metaKeywords || '',
    ogImage: pageSEO?.ogImage || general?.faviconUrl || '',
    canonicalUrl: pageSEO?.canonicalUrl || '',
  }
}

export function getServiceBySlug(slug: string) {
  const content = getServerContent()
  if (!content?.services?.items) return null
  return content.services.items.find((s: any) => s.slug === slug) || null
}

export function getCaseStudyById(id: string) {
  const content = getServerContent()
  if (!content?.caseStudies?.items) return null
  return content.caseStudies.items.find((c: any) => c.id === id) || null
}

export function getCustomPageBySlug(slug: string) {
  const content = getServerContent()
  if (!content?.customPages) return null
  return content.customPages.find(
    (p: any) => p.slug === slug && p.status === 'published'
  ) || null
}

export function getBlogPostById(id: string) {
  const content = getServerContent()
  if (!content?.blog?.posts) return null
  return content.blog.posts.find((p: any) => p.id === id) || null
}

export function getNewsItemById(id: string) {
  const content = getServerContent()
  if (!content?.news?.items) return null
  return content.news.items.find((n: any) => n.id === id) || null
}
