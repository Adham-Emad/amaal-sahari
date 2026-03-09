"use client"
import { useState, useRef, useEffect } from "react"
import { useLocale } from "@/lib/locale-context"
import { translations } from "@/lib/i18n"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import ScrollFade from "./scroll-fade"
import Link from "next/link"
import Image from "next/image"

export default function ServicesCarousel() {
  const { locale } = useLocale()
  const t = translations[locale].sections.services
  const { content } = useContent()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout>()
  const isArabic = locale === "ar"

  const services = content.services.items
  const sectionTitle = isArabic 
    ? content?.homepageSections?.services?.ar?.title || t.title
    : content?.homepageSections?.services?.en?.title || t.title

  // Handle empty services array
  if (!services || services.length === 0) {
    return (
      <section id="services" className="py-16 md:py-24 bg-[#FAFBF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#EA8936] font-semibold mb-2 uppercase tracking-wider">
              {locale === "ar" ? "خدماتنا" : "OUR SERVICES"}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2F683E] mb-4">{sectionTitle}</h2>
            <p className="text-xl text-black max-w-2xl mx-auto">{t.subtitle}</p>
          </div>
          <div className="text-center text-gray-500">
            {locale === "ar" ? "لا توجد خدمات متاحة حالياً" : "No services available at the moment"}
          </div>
        </div>
      </section>
    )
  }

  useEffect(() => {
    if (!isAutoPlay) return

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length)
    }, 5000)

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isAutoPlay, services.length])

const handlePrev = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length)
  }

  const handleNext = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % services.length)
  }

  const handleMouseEnter = () => setIsAutoPlay(false)
  const handleMouseLeave = () => setIsAutoPlay(true)

  // Only show carousel if there are 2 or more services, otherwise show single service
  const showCarousel = services.length >= 2
  const visibleServices = showCarousel
    ? [
        services[(currentIndex - 1 + services.length) % services.length],
        services[currentIndex],
        services[(currentIndex + 1) % services.length],
      ]
    : [services[0]]

  return (
    <section id="services" className="py-16 md:py-24 bg-[#FAFBF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollFade>
          <div className="text-center mb-16">
            <p className="text-[#EA8936] font-semibold mb-2 uppercase tracking-wider">
              {locale === "ar" ? "خدماتنا" : "OUR SERVICES"}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2F683E] mb-4">{sectionTitle}</h2>
            <p className="text-xl text-black max-w-2xl mx-auto">{t.subtitle}</p>
          </div>
        </ScrollFade>

        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {showCarousel && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 bg-[#FAFBF0] rounded-full p-3 hover:bg-[#EA8936] transition-colors"
                aria-label="Previous service"
              >
                <ChevronLeft className="w-6 h-6 text-[#2F683E]" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 bg-[#FAFBF0] rounded-full p-3 hover:bg-[#EA8936] transition-colors"
                aria-label="Next service"
              >
                <ChevronRight className="w-6 h-6 text-[#2F683E]" />
              </button>
            </>
          )}

          <div className={`grid ${showCarousel ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'} gap-6 px-8`}>
            {visibleServices.map((service, idx) => {
              const isCenter = idx === 1 || (services.length === 1 && idx === 0)
              const serviceData = service[locale] || { title: "", description: "" }
              const slug = service.slug || serviceData.title.toLowerCase().replace(/\s+/g, "-")
              const imageUrl = service.imageUrl || "/images/landscaping-plants.png"

              return (
                <ScrollFade key={`${currentIndex}-${idx}`}>
                  <div
                    className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                      isCenter
                        ? "md:scale-105 md:shadow-2xl ring-2 ring-[#EA8936]"
                        : showCarousel ? "opacity-60 md:opacity-100 md:scale-95" : "md:scale-100"
                    }`}
                  >
                    <div className="relative h-96 md:h-[500px] w-full overflow-hidden group bg-gray-700">
                      {imageUrl && !imageUrl.includes("placeholder") ? (
                        <Image
                          src={imageUrl}
                          alt={serviceData.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <p className="text-[#EA8936] font-semibold text-sm uppercase tracking-wider mb-2">
                          {locale === "ar" ? "الخدمات" : "SERVICES"}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">{serviceData.title}</h3>
                        <p className="text-white mb-4 line-clamp-2">{serviceData.description}</p>

                        <Link href={`/services/${slug}`}>
                          <Button className="bg-[#EA8936] hover:bg-[#EA8936]/90 text-white w-fit font-semibold">
                            {locale === "ar" ? "عرض الخدمة" : "View Service"}
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollFade>
              )
            })}
          </div>

          {showCarousel && (
            <div className="flex justify-center gap-2 mt-8">
              {services.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlay(false)
                    setCurrentIndex(idx)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? "bg-[#EA8936] w-8" : "bg-[#2F683E]/40 w-2 hover:bg-[#2F683E]/60"
                  }`}
                  aria-label={`Go to service ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
