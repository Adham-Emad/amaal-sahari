"use client"

import { useParams } from "next/navigation"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import DOMPurify from "dompurify"
import { useEffect, useState } from "react"

function sanitizeHTML(html: string): string {
  if (typeof window === "undefined") return html
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr",
      "ul", "ol", "li", "a", "strong", "em", "b", "i", "u",
      "blockquote", "pre", "code", "img", "div", "span",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "target", "rel", "width", "height", "style"],
  })
}

export default function CustomPage() {
  const params = useParams()
  const slug = params.slug as string
  const { locale } = useLocale()
  const { content, isContentLoaded } = useContent()
  const isArabic = locale === "ar"
  const [sanitized, setSanitized] = useState("")

  const page = content.customPages?.find(
    (p) => p.slug === slug && p.status === "published"
  )

  const pageData = isArabic ? page?.ar : page?.en

  useEffect(() => {
    if (pageData?.content) {
      setSanitized(sanitizeHTML(pageData.content))
    }
  }, [pageData?.content])

  if (!isContentLoaded) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    )
  }

  if (!page || !pageData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{isArabic ? "الصفحة غير موجودة" : "Page Not Found"}</h1>
            <p className="text-muted-foreground mb-8">{isArabic ? "الصفحة التي تبحث عنها غير موجودة." : "The page you're looking for doesn't exist."}</p>
            <Link href="/">
              <Button>{isArabic ? "العودة للرئيسية" : "Go Home"}</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section
          className="relative py-16 md:py-24 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: page.heroImage
              ? `url('${page.heroImage}')`
              : "linear-gradient(135deg, rgba(47, 104, 62, 0.1) 0%, rgba(47, 104, 62, 0.05) 100%)",
          }}
        >
          {page.heroImage && <div className="absolute inset-0 bg-white/90"></div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">{pageData.title}</h1>
            {pageData.subtitle && (
              <p className="text-xl text-muted-foreground max-w-3xl">{pageData.subtitle}</p>
            )}
          </div>
        </section>

        {pageData.content && (
          <section className="py-16 md:py-24 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className="prose prose-lg max-w-none"
                dir={isArabic ? "rtl" : "ltr"}
                dangerouslySetInnerHTML={{ __html: sanitized }}
              />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
