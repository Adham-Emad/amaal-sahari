import type { Metadata } from 'next'
import { getServerContent, getPageSEO, getServiceBySlug, getCustomPageBySlug } from './server-content'

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
  return buildMetadata({ path: '/' })
}

export function getPageMetadata(slug: string): Metadata {
  const seo = getPageSEO(slug)
  if (!seo) return buildMetadata({ path: `/${slug}` })
  return buildMetadata({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    ogImage: seo.ogImage,
    canonicalUrl: seo.canonicalUrl || undefined,
    path: `/${slug}`,
  })
}

export function getServiceMetadata(slug: string): Metadata {
  const service = getServiceBySlug(slug)
  if (!service) return buildMetadata({ path: `/services/${slug}` })

  const serviceData = service.en || {}
  const seo = getPageSEO(`services/${slug}`)

  return buildMetadata({
    title: seo?.title || (serviceData.title ? `${serviceData.title} | ${SITE_NAME}` : undefined),
    description: seo?.description || serviceData.description || undefined,
    keywords: seo?.keywords || undefined,
    ogImage: seo?.ogImage || service.imageUrl || undefined,
    canonicalUrl: seo?.canonicalUrl || undefined,
    path: `/services/${slug}`,
  })
}

export function getCustomPageMetadata(slug: string): Metadata {
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
