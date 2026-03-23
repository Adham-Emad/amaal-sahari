import type { Metadata } from 'next'
import { unstable_noStore as noStore } from 'next/cache'
import {
  getServerContent,
  getPageSEO,
  getServiceBySlug,
  getCaseStudyById,
  getCustomPageBySlug,
  getBlogPostById,
  getNewsItemById,
} from './server-content'

const DEFAULT_TITLE = 'Amaal Sahari - Integrated Facility Management Solutions'
const DEFAULT_DESCRIPTION = 'Comprehensive facility management services providing integrated workplace solutions that enhance productivity and comfort'
const DEFAULT_KEYWORDS = 'facility management, cleaning services, security, workplace solutions'
const SITE_NAME = 'Amaal Sahari'

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://amaalsahari.com'
}

export function buildMetadata(overrides: {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  canonicalUrl?: string
  path?: string
}): Metadata {
  noStore()
  const content = getServerContent()
  const general = content?.seo?.general

  const title = overrides.title || general?.defaultMetaTitle || DEFAULT_TITLE
  const description = overrides.description || general?.defaultMetaDescription || DEFAULT_DESCRIPTION
  const keywords = overrides.keywords || general?.metaKeywords || DEFAULT_KEYWORDS
  const ogImage = overrides.ogImage || general?.faviconUrl || ''
  const canonicalUrl = overrides.canonicalUrl || (overrides.path ? `${getBaseUrl()}${overrides.path}` : getBaseUrl())

  return {
    title,
    description,
    keywords,
    robots: 'index, follow',
    authors: [{ name: SITE_NAME }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_US',
      alternateLocale: ['ar_SA'],
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export function getGlobalMetadata(): Metadata {
  noStore()
  const base = getPageMetadata('')
  const content = getServerContent()
  const scId = content?.seo?.integrations?.googleSearchConsoleId?.trim()
  if (scId) {
    base.verification = { google: scId }
  }
  return base
}

export function getPageMetadata(slug: string): Metadata {
  noStore()
  const seo = getPageSEO(slug)
  if (!seo) return buildMetadata({ path: slug ? `/${slug}` : '/' })
  return buildMetadata({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    ogImage: seo.ogImage,
    canonicalUrl: seo.canonicalUrl || undefined,
    path: slug ? `/${slug}` : '/',
  })
}

export function getServiceMetadata(slug: string): Metadata {
  noStore()
  const service = getServiceBySlug(slug)
  if (!service) return buildMetadata({ path: `/services/${slug}` })

  const serviceData = service.en || {}
  const seo = service.seo?.en

  const title = seo?.metaTitle || (serviceData.title ? `${serviceData.title} | ${SITE_NAME}` : undefined)
  const description = seo?.metaDescription || serviceData.description || undefined

  const base = buildMetadata({
    title,
    description,
    keywords: seo?.keywords || undefined,
    ogImage: service.imageUrl || undefined,
    path: `/services/${slug}`,
  })

  if (seo?.ogTitle || seo?.ogDescription) {
    base.openGraph = {
      ...base.openGraph,
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
    }
  }

  return base
}

export function getCaseStudyMetadata(id: string): Metadata {
  noStore()
  const caseStudy = getCaseStudyById(id)
  if (!caseStudy) return buildMetadata({ path: `/case-studies/${id}` })

  const data = caseStudy.en || {}
  const seo = caseStudy.seo?.en

  const title = seo?.metaTitle || (data.title ? `${data.title} | ${SITE_NAME}` : undefined)
  const description = seo?.metaDescription || data.description || undefined

  const base = buildMetadata({
    title,
    description,
    keywords: seo?.keywords || undefined,
    ogImage: caseStudy.imageUrl || undefined,
    path: `/case-studies/${id}`,
  })

  if (seo?.ogTitle || seo?.ogDescription) {
    base.openGraph = {
      ...base.openGraph,
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
    }
  }

  return base
}

export function getCustomPageMetadata(slug: string): Metadata {
  noStore()
  const page = getCustomPageBySlug(slug)
  if (!page) return buildMetadata({ path: `/${slug}` })

  const pageSeo = page.seo?.en
  const pageData = page.en || {}

  return buildMetadata({
    title: pageSeo?.metaTitle || (pageData.title ? `${pageData.title} | ${SITE_NAME}` : undefined),
    description: pageSeo?.metaDescription || pageData.subtitle || undefined,
    keywords: pageSeo?.keywords || undefined,
    path: `/${slug}`,
  })
}

export function getBlogPostMetadata(id: string): Metadata {
  noStore()
  const post = getBlogPostById(id)
  if (!post) return buildMetadata({ path: `/blog/${id}` })
  const data = post.en || {}
  return buildMetadata({
    title: data.title ? `${data.title} | ${SITE_NAME}` : undefined,
    description: data.summary || data.excerpt || data.description || undefined,
    ogImage: post.imageUrl || undefined,
    path: `/blog/${id}`,
  })
}

export function getNewsItemMetadata(id: string): Metadata {
  noStore()
  const item = getNewsItemById(id)
  if (!item) return buildMetadata({ path: `/news/${id}` })
  const data = item.en || {}
  return buildMetadata({
    title: data.title ? `${data.title} | ${SITE_NAME}` : undefined,
    description: data.summary || data.excerpt || data.description || undefined,
    ogImage: item.imageUrl || undefined,
    path: `/news/${id}`,
  })
}
