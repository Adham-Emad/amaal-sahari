"use client"

import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, User, Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomeNewsSection() {
  const { locale } = useLocale()
  const { content } = useContent()
  const isArabic = locale === "ar"

  // Get section title from CMS
  const sectionTitle = isArabic
    ? content?.homepageSections?.news?.ar?.title || "أخبار أمال الصحاري"
    : content?.homepageSections?.news?.en?.title || "Latest News"

  // Get the latest 3 news items
  const latestNews = content.news.items.slice(0, 3)

  if (latestNews.length === 0) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return isArabic
      ? date.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })
      : date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FAFBF0] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <Newspaper className="w-6 h-6 text-[#EA8936]" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#2F683E]">
            {sectionTitle}
          </h2>
        </div>
        <p className="text-[#666666] text-lg mb-12 max-w-2xl">
          {isArabic
            ? "ابقَ على اطلاع بآخر أخبار وتحديثات أمال الصحاري"
            : "Stay updated with the latest news and updates from Amaal Sahari"}
        </p>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {latestNews.map((newsItem) => {
            const newsData = isArabic ? newsItem.ar : newsItem.en

            return (
              <Link
                key={newsItem.id}
                href={`/news#${newsItem.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-[#FAFBF0] hover:border-[#EA8936]"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-[#2F683E]/10 to-[#EA8936]/10">
                  {newsItem.imageUrl && !newsItem.imageUrl.includes("placeholder") ? (
                    <Image
                      src={newsItem.imageUrl}
                      alt={newsData.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2F683E]/20 to-[#EA8936]/20" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="inline-block px-3 py-1 bg-[#EA8936]/10 text-[#EA8936] rounded-full text-xs font-semibold">
                      {newsData.category}
                    </span>
                    <div className="flex items-center gap-1 text-[#666666] text-xs">
                      <Calendar className="w-4 h-4" />
                      {formatDate(newsItem.date)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[#2F683E] text-lg line-clamp-2 group-hover:text-[#EA8936] transition-colors">
                    {newsData.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[#666666] text-sm line-clamp-2">{newsData.excerpt}</p>

                  {/* Author & Link */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#FAFBF0]">
                    <div className="flex items-center gap-2 text-xs text-[#666666]">
                      <User className="w-4 h-4" />
                      {newsData.author}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#EA8936] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        {content.news.items.length > 3 && (
          <div className="flex justify-center">
            <Link href="/news">
              <Button className="bg-[#EA8936] hover:bg-[#FAB076] text-[#2F683E] font-semibold px-8 py-3 text-lg rounded-lg flex items-center gap-2">
                {isArabic ? "عرض جميع الأخبار" : "View All News"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
