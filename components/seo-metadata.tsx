'use client'

import { useEffect, useRef } from 'react'
import { useContent } from '@/lib/content-context'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export default function SEOMetadata() {
  const { content, isContentLoaded } = useContent()
  const pathname = usePathname()
  const gaScriptLoadedRef = useRef<string>('')

  useEffect(() => {
    if (!isContentLoaded) return

    const seoConfig = content.seo
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amaalsahari.com'
    const currentUrl = `${baseUrl}${pathname}`

    const pageSlug = pathname === '/' ? '' : pathname.split('/')[1]
    const pageSEO = seoConfig.pages?.find((p) => p.slug === pageSlug)
    const metaTitle = (pageSEO?.metaTitle && pageSEO.metaTitle.trim())
      ? pageSEO.metaTitle.trim()
      : seoConfig.general.defaultMetaTitle
    const metaDescription = (pageSEO?.metaDescription && pageSEO.metaDescription.trim())
      ? pageSEO.metaDescription.trim()
      : seoConfig.general.defaultMetaDescription
    const metaKeywords = (pageSEO?.metaKeywords && pageSEO.metaKeywords.trim())
      ? pageSEO.metaKeywords.trim()
      : seoConfig.general.metaKeywords
    const ogImage = (pageSEO?.ogImage && pageSEO.ogImage.trim())
      ? pageSEO.ogImage.trim()
      : seoConfig.general.faviconUrl
    const canonicalUrl = (pageSEO?.canonicalUrl && pageSEO.canonicalUrl.trim())
      ? pageSEO.canonicalUrl.trim()
      : currentUrl

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

    // Google Search Console verification
    if (seoConfig.integrations.googleSearchConsoleId) {
      const scId = seoConfig.integrations.googleSearchConsoleId.trim()
      if (scId) {
        let scMeta = document.querySelector('meta[name="google-site-verification"]') as HTMLMetaElement
        if (!scMeta) {
          scMeta = document.createElement('meta')
          scMeta.name = 'google-site-verification'
          document.head.appendChild(scMeta)
        }
        scMeta.content = scId
      }
    }

    const gaId = seoConfig.integrations.googleAnalyticsId?.trim()
    const gtmId = seoConfig.integrations.googleTagManagerId?.trim()

    const ensureGtagScript = (id: string) => {
      if (!id) return

      // If the script for this GA ID isn't loaded yet, inject it once
      if (gaScriptLoadedRef.current !== id) {
        // Remove any old GA script for a different ID
        const oldScript = document.querySelector('script[data-ga-id]')
        if (oldScript) oldScript.remove()

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
        gaScriptLoadedRef.current = id
      }

      // Always send page_view on every route change (SPA navigation)
      if (window.gtag) {
        window.gtag('config', id, {
          page_path: pathname,
          page_location: currentUrl,
          page_title: metaTitle,
        })
      }
    }

    if (gaId) ensureGtagScript(gaId)
    if (gtmId && gtmId !== gaId) ensureGtagScript(gtmId)

  }, [content.seo, pathname, isContentLoaded])

  return null
}
