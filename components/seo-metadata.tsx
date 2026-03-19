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

    const gaId = seoConfig.integrations?.googleAnalyticsId?.trim()
    const gtmId = seoConfig.integrations?.googleTagManagerId?.trim()

    const pageSlug = pathname === '/' ? '' : pathname.split('/')[1]
    const pageSEO = seoConfig.pages?.find((p) => p.slug === pageSlug)
    const metaTitle = (pageSEO?.metaTitle && pageSEO.metaTitle.trim())
      ? pageSEO.metaTitle.trim()
      : seoConfig.general?.defaultMetaTitle || 'Amaal Sahari'

    const ensureGtagScript = (id: string) => {
      if (!id) return

      if (gaScriptLoadedRef.current !== id) {
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
