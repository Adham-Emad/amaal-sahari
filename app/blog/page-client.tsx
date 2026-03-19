"use client"

import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import { ArrowRight, Calendar, User } from "lucide-react"
import Image from "next/image"

export default function BlogPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const { content } = useContent()
  const isArabic = locale === "ar"

  const posts = content.blog.posts.map((post) => ({
    id: post.id,
    title: isArabic ? post.ar.title : post.en.title,
    excerpt: isArabic ? post.ar.excerpt : post.en.excerpt,
    date: post.date,
    author: isArabic ? post.ar.author : post.en.author,
    category: isArabic ? post.ar.category : post.en.category,
    image: post.imageUrl,
  }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent-emerald/50 text-white py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{locale === "ar" ? "مدونتنا" : "Our Blog"}</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {locale === "ar"
                ? "اقرأ أحدث المقالات والأفكار حول الخدمات المتميزة والممارسات الفضلى."
                : "Read the latest articles and insights on premium services and best practices."}
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        No image
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-foreground mb-3">{post.title}</h3>
                    <p className="text-foreground-secondary mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-foreground-secondary mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push(`/blog/${post.id}`)}
                      className="w-full bg-accent-orange hover:bg-accent-orange/90 text-white"
                    >
                      {locale === "ar" ? "اقرأ المزيد" : "Read More"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
