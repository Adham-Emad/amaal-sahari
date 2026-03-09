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

export default function BlogDetailPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  const { locale } = useLocale()
  const { content } = useContent()
  const isArabic = locale === "ar"

  // Find the blog post
  const post = content.blog.posts.find((p) => p.id === postId)

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {locale === "ar" ? "المقالة غير موجودة" : "Post Not Found"}
            </h1>
            <Button
              onClick={() => router.push("/blog")}
              className="bg-accent-orange hover:bg-accent-orange/90 text-white"
            >
              {locale === "ar" ? "العودة إلى المدونة" : "Back to Blog"}
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const postData = isArabic ? post.ar : post.en
  const title = postData.title
  const excerpt = postData.excerpt
  const fullContent = postData.fullContent || excerpt
  const author = postData.author
  const category = postData.category
  const date = post.date

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section with Image */}
        <section className="relative w-full h-96 overflow-hidden bg-gray-900">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
          )}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
              <div className="mb-4">
                <span className="inline-block bg-accent-orange text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-foreground-secondary mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-6 flex-wrap">
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
            </div>

            {/* Excerpt */}
            <div className="mb-8 text-lg text-foreground-secondary italic">{excerpt}</div>

            {/* Full Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div
                className="text-foreground leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: fullContent.replace(/\n/g, "<br />"),
                }}
              />
            </div>

            {/* Back Button */}
            <div className="mt-12 pt-8 border-t border-border">
              <Button
                onClick={() => router.push("/blog")}
                className="bg-accent-orange hover:bg-accent-orange/90 text-white inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {locale === "ar" ? "العودة إلى المدونة" : "Back to Blog"}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
