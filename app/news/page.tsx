"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { X, Calendar, User, Tag } from "lucide-react"
import Image from "next/image"

export default function NewsPage() {
  const { locale } = useLocale()
  const { content } = useContent()
  const isArabic = locale === "ar"
  const [selectedNews, setSelectedNews] = useState<string | null>(null)

  const newsItems = content.news.items.map((item) => ({
    id: item.id,
    imageUrl: item.imageUrl,
    date: item.date,
    title: isArabic ? item.ar.title : item.en.title,
    excerpt: isArabic ? item.ar.excerpt : item.en.excerpt,
    fullContent: isArabic ? item.ar.fullContent : item.en.fullContent,
    author: isArabic ? item.ar.author : item.en.author,
    category: isArabic ? item.ar.category : item.en.category,
  }))

  const selectedItem = newsItems.find((item) => item.id === selectedNews)

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedNews(item.id)}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
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
                        <time>{new Date(item.date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}</time>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{item.author}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.excerpt}</p>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedNews(item.id)
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                    >
                      {isArabic ? "اقرأ المزيد" : "Read More"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* News Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
              <button
                onClick={() => setSelectedNews(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Featured Image */}
              <div className="relative h-96 rounded-xl overflow-hidden mb-6 bg-gray-100">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{new Date(selectedItem.date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5 text-primary" />
                  <span>{selectedItem.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold text-sm">
                    {selectedItem.category}
                  </span>
                </div>
              </div>

              {/* Full Content */}
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {selectedItem.fullContent.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
