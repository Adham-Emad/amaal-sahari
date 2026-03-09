'use client'

import { useEffect } from 'react'
import { useContent } from '@/lib/content-context'
import { usePathname } from 'next/navigation'

export default function SEOMetadata() {
  const { content } = useContent()
  const pathname = usePathname()

  useEffect(() => {
    const seoConfig = content.seo
    const baseUrl = 'https://amaalsahari.com'
    const currentUrl = `${baseUrl}${pathname}`

    // Get page-specific SEO or use general settings
    const pageSEO = seoConfig.pages.find((p) => p.slug === pathname.replace('/', ''))
    const metaTitle = pageSEO?.metaTitle || seoConfig.general.defaultMetaTitle
    const metaDescription = pageSEO?.metaDescription || seoConfig.general.defaultMetaDescription
    const metaKeywords = pageSEO?.metaKeywords || seoConfig.general.metaKeywords
    const ogImage = pageSEO?.ogImage || seoConfig.general.faviconUrl
    const canonicalUrl = pageSEO?.canonicalUrl || currentUrl

    // Update document title
    document.title = metaTitle

    // Update or create meta tags
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

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = canonicalUrl

    // Load Google Analytics if ID exists
    if (seoConfig.integrations.googleAnalyticsId) {
      const gaScript = document.createElement('script')
      gaScript.async = true
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${seoConfig.integrations.googleAnalyticsId}`
      document.head.appendChild(gaScript)

      window.dataLayer = window.dataLayer || []
      function gtag(...args: unknown[]) {
        (window.dataLayer as unknown[]).push(args)
      }
      gtag('js', new Date())
      gtag('config', seoConfig.integrations.googleAnalyticsId)
    }

    // Load Google Tag Manager if ID exists
    if (seoConfig.integrations.googleTagManagerId) {
      const gtmScript = document.createElement('script')
      gtmScript.async = true
      gtmScript.src = `https://www.googletagmanager.com/gtag/js?id=${seoConfig.integrations.googleTagManagerId}`
      document.head.appendChild(gtmScript)

      window.dataLayer = window.dataLayer || []
      function gtag(...args: unknown[]) {
        (window.dataLayer as unknown[]).push(args)
      }
      gtag('js', new Date())
      gtag('config', seoConfig.integrations.googleTagManagerId)
    }
  }, [content.seo, pathname])

  return null
}
