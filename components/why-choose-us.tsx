"use client"

import { useLocale } from "@/lib/locale-context"
import { translations } from "@/lib/i18n"
import { useContent } from "@/lib/content-context"
import { CheckCircle2 } from "lucide-react"
import ScrollFade from "./scroll-fade"
import Image from "next/image"

export default function WhyChooseUs() {
  const { locale } = useLocale()
  const t = translations[locale].sections.whyChooseUs
  const { content } = useContent()
  const isArabic = locale === "ar"

  // Get section title from CMS
  const sectionTitle = isArabic
    ? content?.homepageSections?.whyChooseUs?.ar?.title || t.title
    : content?.homepageSections?.whyChooseUs?.en?.title || t.title

  const items = content.whyChooseUs.items.map((item) => ({
    title: item[locale].title,
    description: item[locale].description,
  }))

  return (
    <section className="py-16 md:py-24 bg-[#FAFBF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollFade>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-[#3EB249]/10 to-[#EA8936]/10">
              {content.whyChooseUs.imageUrl && !content.whyChooseUs.imageUrl.includes("placeholder") ? (
                <Image
                  src={content.whyChooseUs.imageUrl}
                  alt="Why Choose Us"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#3EB249]/20 to-[#EA8936]/20" />
              )}
            </div>
          </ScrollFade>

          <div>
            <ScrollFade>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2F683E] mb-8">{sectionTitle}</h2>
            </ScrollFade>

            <div className="grid grid-cols-1 gap-6">
              {items.map((item, index) => (
                <ScrollFade key={index} delay={index * 50}>
                  <div className="flex gap-4 group text-left">
                    <CheckCircle2 className="w-6 h-6 text-[#EA8936] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-semibold text-[#2F683E] mb-2">{item.title}</h3>
                      <p className="text-black">{item.description}</p>
                    </div>
                  </div>
                </ScrollFade>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
