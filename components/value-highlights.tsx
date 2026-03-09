"use client"

import { useLocale } from "@/lib/locale-context"
import { translations } from "@/lib/i18n"
import { useContent } from "@/lib/content-context"
import { CheckCircle } from "lucide-react"
import ScrollFade from "./scroll-fade"
import Image from "next/image"

export default function ValueHighlights() {
  const { locale } = useLocale()
  const t = translations[locale].sections.valueHighlights
  const { content } = useContent()
  const isArabic = locale === "ar"

  // Get section title from CMS
  const sectionTitle = isArabic
    ? content?.homepageSections?.valueHighlights?.ar?.title || t.title
    : content?.homepageSections?.valueHighlights?.en?.title || t.title

  const pillars = content.valueHighlights.pillars.map((pillar) => ({
    title: pillar[locale].title,
    description: pillar[locale].description,
    imageUrl: pillar.imageUrl,
  }))

  return (
    <section className="py-16 md:py-24 bg-[#FAFBF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFade>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2F683E] mb-4">{sectionTitle}</h2>
            <p className="text-xl text-[#2F683E]/70 max-w-2xl mx-auto">{t.subtitle}</p>
          </div>
        </ScrollFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <ScrollFade key={index} delay={index * 100}>
              <div className="bg-[#FFEDE2] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#EA8936]/20 hover:border-[#EA8936] group cursor-pointer">
                <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-[#3EB249]/10 to-[#EA8936]/10">
                  {pillar.imageUrl && !pillar.imageUrl.includes("placeholder") ? (
                    <Image
                      src={pillar.imageUrl}
                      alt={pillar.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#3EB249]/20 to-[#EA8936]/20" />
                  )}
                </div>
                <div className="p-6 text-center">
                  <div className="flex items-start gap-4 justify-center">
                    <CheckCircle className="w-6 h-6 text-[#EA8936] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-semibold text-[#2F683E] mb-2">{pillar.title}</h3>
                      <p className="text-sm text-[#2F683E]/70">{pillar.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollFade>
          ))}
        </div>
      </div>
    </section>
  )
}
