"use client"

import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Calendar, User } from "lucide-react"
import Image from "next/image"

export default function NewsPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const { content } = useContent()
  const isArabic = locale === "ar"

  const newsItems = content.news.items.map((item) => ({
    id: item.id,
    imageUrl: item.imageUrl,
    date: item.date,
    title: isArabic ? item.ar.title : item.en.title,
    excerpt: isArabic ? item.ar.excerpt : item.en.excerpt,
    author: isArabic ? item.ar.author : item.en.author,
    category: isArabic ? item.ar.category : item.en.category,
  }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 md:py-32 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {isArabic ? "الأخبار والمستجدات" : "News & Updates"}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                {isArabic
                  ? "ابقَ على اطلاع بأحدث أخبار أمال الصحاري والتطورات في صناعة إدارة المرافق"
                  : "Stay updated with the latest news and developments from Amaal Sahari"}
              </p>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {newsItems.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                {isArabic ? "لا توجد أخبار حالياً" : "No news articles yet."}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/news/${item.id}`)}
                    className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {item.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <time>{new Date(item.date).toLocaleDateString(isArabic ? "ar-SA" : "en-US")}</time>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{item.author}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.excerpt}</p>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/news/${item.id}`)
                        }}
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                      >
                        {isArabic ? "اقرأ المزيد" : "Read More"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
