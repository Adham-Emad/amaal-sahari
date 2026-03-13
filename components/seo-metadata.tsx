'use client'

import { useEffect } from 'react'
import { useContent } from '@/lib/content-context'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export default function SEOMetadata() {
  const { content } = useContent()
  const pathname = usePathname()

  useEffect(() => {
    const seoConfig = content.seo
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amaalsahari.com'
    const currentUrl = `${baseUrl}${pathname}`

    const pageSlug = pathname === '/' ? '' : pathname.split('/')[1]
    const pageSEO = seoConfig.pages.find((p) => p.slug === pageSlug)
    const metaTitle = pageSEO?.metaTitle || seoConfig.general.defaultMetaTitle
    const metaDescription = pageSEO?.metaDescription || seoConfig.general.defaultMetaDescription
    const metaKeywords = pageSEO?.metaKeywords || seoConfig.general.metaKeywords
    const ogImage = pageSEO?.ogImage || seoConfig.general.faviconUrl
    const canonicalUrl = pageSEO?.canonicalUrl || currentUrl

    document.title = metaTitle

    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      let element = document.querySelector(`meta[${isProperty ? 'property' : 'name'}="${name}"]`) as HTMLMetaElement
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(isProperty ? 'property' : 'name', name)
        document.head.appendChild(element)
      }
      element.content = content
    }

    updateMetaTag('description', metaDescription)
    updateMetaTag('keywords', metaKeywords)
    updateMetaTag('og:type', 'website', true)
    updateMetaTag('og:url', currentUrl, true)
    updateMetaTag('og:title', metaTitle, true)
    updateMetaTag('og:description', metaDescription, true)
    updateMetaTag('og:image', ogImage, true)
    updateMetaTag('twitter:card', 'summary_large_image', true)
    updateMetaTag('twitter:url', currentUrl, true)
    updateMetaTag('twitter:title', metaTitle, true)
    updateMetaTag('twitter:description', metaDescription, true)
    updateMetaTag('twitter:image', ogImage, true)

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = canonicalUrl

    const loadGtag = (id: string) => {
      const existing = document.querySelector(`script[data-ga-id="${id}"]`)
      if (existing) return

      window.dataLayer = window.dataLayer || []
      window.gtag = function (...args: unknown[]) {
        window.dataLayer.push(args)
      }

      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
      script.setAttribute('data-ga-id', id)
      document.head.appendChild(script)

      window.gtag('js', new Date())
      window.gtag('config', id)
    }

    if (seoConfig.integrations.googleAnalyticsId) {
      loadGtag(seoConfig.integrations.googleAnalyticsId)
    }

    if (seoConfig.integrations.googleTagManagerId) {
      loadGtag(seoConfig.integrations.googleTagManagerId)
    }
  }, [content.seo, pathname])

  return null
}
