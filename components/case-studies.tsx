"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "@/lib/locale-context"
import { translations } from "@/lib/i18n"
import { useContent } from "@/lib/content-context"
import { TrendingUp } from "lucide-react"
import ScrollFade from "./scroll-fade"
import Image from "next/image"

export default function CaseStudies() {
  const router = useRouter()
  const { locale } = useLocale()
  const t = translations[locale].sections.caseStudies
  const { content } = useContent()
  const isArabic = locale === "ar"

  // Get section title from CMS
  const sectionTitle = isArabic
    ? content?.homepageSections?.projects?.ar?.title || t.title
    : content?.homepageSections?.projects?.en?.title || t.title

  const defaultImages = [
    "/images/case-study-corporate-transformation.jpg",
    "/images/case-study-hospitality-excellence.jpg",
    "/images/case-study-facility-optimization.jpg",
  ]

  // Use content from context for dynamic case studies
  const caseStudyItems = content.caseStudies.items.map((item, index) => ({
    title: item[locale].title,
    description: item[locale].description,
    metrics: item[locale].metrics,
    imageUrl: item.imageUrl || defaultImages[index] || "/placeholder.svg",
  }))

  return (
    <section className="py-16 md:py-24 bg-[#FAFBF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFade>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2F683E] mb-4">{sectionTitle}</h2>
            <p className="text-xl text-black">{t.subtitle}</p>
          </div>
        </ScrollFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudyItems.map((study, index) => (
            <ScrollFade key={index} delay={index * 100}>
              <div
                onClick={() => router.push(`/case-studies/${content.caseStudies.items[index].id}`)}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#EA8936]/20 hover:shadow-md transition-all hover:border-[#EA8936] group cursor-pointer"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-[#EA8936]/10 to-[#3EB249]/10">
                  {study.imageUrl && !study.imageUrl.includes("placeholder") ? (
                    <Image
                      src={study.imageUrl}
                      alt={study.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EA8936]/20 to-[#3EB249]/20">
                      <span className="text-gray-400 text-sm">Image not available</span>
                    </div>
                  )}
                </div>
                <div className="p-8 text-center">
                  <div className="flex items-center gap-3 mb-4 justify-center">
                    <TrendingUp className="w-6 h-6 text-[#EA8936] group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold text-[#EA8936]">{study.metrics}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#2F683E] mb-3">{study.title}</h3>
                  <p className="text-black">{study.description}</p>
                </div>
              </div>
            </ScrollFade>
          ))}
        </div>
      </div>
    </section>
  )
}
