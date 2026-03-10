import type React from "react"
import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"
import { LocaleProvider } from "@/lib/locale-context"
import { ContentProvider } from "@/lib/content-context"
import WhatsAppWidget from "@/components/whatsapp-widget"
import SEOMetadata from "@/components/seo-metadata"
import { getGlobalMetadata } from "@/lib/metadata"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-arabic" })

export function generateMetadata(): Metadata {
  return getGlobalMetadata()
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2F683E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <link rel="icon" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Amaal%20Sahari%20Web%20Logo-JeTkcT88yuJW3ZTgu8RnID1sBhHFbs.png" type="image/png" />
        <link rel="apple-touch-icon" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Amaal%20Sahari%20Web%20Logo-JeTkcT88yuJW3ZTgu8RnID1sBhHFbs.png" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Amaal Sahari",
              "image": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Amaal%20Sahari%20Web%20Logo-JeTkcT88yuJW3ZTgu8RnID1sBhHFbs.png",
              "description": "Comprehensive facility management services providing integrated workplace solutions",
              "url": process.env.NEXT_PUBLIC_BASE_URL || "https://amaalsahari.com",
              "telephone": "+201021454545",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "EG"
              },
              "sameAs": [
                "https://facebook.com",
                "https://instagram.com",
                "https://linkedin.com",
                "https://twitter.com",
                "https://youtube.com"
              ]
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${cairo.variable} font-sans antialiased`}>
        <LocaleProvider>
          <ContentProvider>
            <SEOMetadata />
            {children}
            <WhatsAppWidget />
          </ContentProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
