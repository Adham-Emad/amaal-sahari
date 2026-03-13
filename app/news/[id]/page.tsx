"use client"

import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import { ArrowLeft, Calendar, User } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function NewsDetailPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string
  const { locale } = useLocale()
  const { content, isContentLoaded } = useContent()
  const isArabic = locale === "ar"

  const item = content.news.items.find((n) => n.id === itemId)

  if (!isContentLoaded) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
        <Footer />
      </>
    )
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {isArabic ? "الخبر غير موجود" : "Article Not Found"}
            </h1>
            <Button onClick={() => router.push("/news")} className="bg-primary text-white">
              {isArabic ? "العودة إلى الأخبار" : "Back to News"}
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const itemData = isArabic ? item.ar : item.en
  const title = itemData.title
  const excerpt = itemData.excerpt
  const fullContent = itemData.fullContent && itemData.fullContent.trim() !== "" && itemData.fullContent !== excerpt
    ? itemData.fullContent
    : null
  const author = itemData.author
  const category = itemData.category
  const date = item.date

  const isHTML = (str: string) => /<[a-z][\s\S]*>/i.test(str)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="relative w-full h-96 overflow-hidden bg-gray-900">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60" />
          )}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
              <div className="mb-4">
                <span className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(date).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {author}
              </div>
            </div>

            <p className="mb-8 text-lg text-muted-foreground italic leading-relaxed">{excerpt}</p>

            {fullContent && (
              <div className="prose prose-lg max-w-none mb-12">
                {isHTML(fullContent) ? (
                  <div
                    className="text-foreground leading-relaxed rich-content"
                    dangerouslySetInnerHTML={{ __html: fullContent }}
                  />
                ) : (
                  <div
                    className="text-foreground leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: fullContent.replace(/\n/g, "<br />") }}
                  />
                )}
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-border">
              <Button
                onClick={() => router.push("/news")}
                className="bg-primary text-white inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {isArabic ? "العودة إلى الأخبار" : "Back to News"}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
