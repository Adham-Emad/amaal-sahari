"use client"

import { useLocale } from "@/lib/locale-context"
import { translations } from "@/lib/i18n"
import { useContent } from "@/lib/content-context"
import AnimatedCounter from "./animated-counter"
import ScrollFade from "./scroll-fade"

export default function KPIs() {
  const { locale } = useLocale()
  const t = translations[locale].sections.kpis
  const { content } = useContent()
  const isArabic = locale === "ar"

  // Use content from context for dynamic KPIs
  const kpiItems = content.kpis.items.map((kpi) => ({
    value: kpi.value,
    label: kpi[locale as "en" | "ar"]?.label || "",
  }))

  const sectionTitle = isArabic
    ? content?.homepageSections?.kpis?.ar?.title || t.title
    : content?.homepageSections?.kpis?.en?.title || t.title

  const sectionSubtitle = isArabic
    ? content?.homepageSections?.kpis?.ar?.subtitle || t.subtitle
    : content?.homepageSections?.kpis?.en?.subtitle || t.subtitle

  return (
    <section className="py-16 md:py-24 bg-[#2F683E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFade>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-white">{sectionTitle}</h2>
          {sectionSubtitle && <p className="text-xl text-white/80 text-center mb-12 max-w-2xl mx-auto">{sectionSubtitle}</p>}
        </ScrollFade>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {kpiItems.map((kpi, index) => (
            <ScrollFade key={index} delay={index * 100}>
              <AnimatedCounter value={kpi.value} label={kpi.label} />
            </ScrollFade>
          ))}
        </div>
      </div>
    </section>
  )
}
