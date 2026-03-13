"use client"

import { useParams } from "next/navigation"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ServicePageClient() {
  const params = useParams()
  const slug = params.slug as string
  const { locale } = useLocale()
  const { content, isContentLoaded } = useContent()
  const isArabic = locale === "ar"

  if (!isContentLoaded) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    )
  }

  const service = content?.services?.items?.find((s) => s.slug === slug)
  const serviceData = isArabic ? service?.ar : service?.en

  if (!service || !serviceData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{isArabic ? "الخدمة غير موجودة" : "Service Not Found"}</h1>
            <p className="text-foreground-secondary mb-8">{isArabic ? "الخدمة التي تبحث عنها غير موجودة." : "The service you're looking for doesn't exist."}</p>
            <Link href="/services">
              <Button>{isArabic ? "العودة للخدمات" : "Go Back to Services"}</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const phoneNumber = content.contact?.phone || ""
  const whatsappNumber = (content.contact?.whatsapp || "").replace(/[^0-9]/g, "")
  const prefilledMessage = content.whatsapp?.prefilledMessage || ""
  const whatsappUrl = `https://wa.me/${whatsappNumber}${prefilledMessage ? `?text=${encodeURIComponent(prefilledMessage)}` : ""}`

  const hasImage = Boolean(service.imageUrl)

  return (
    <>
      <Navbar />
      <main className="min-h-screen">

        {/* ── Hero ── */}
        <section
          className="relative py-24 md:py-32 overflow-hidden"
          style={
            hasImage
              ? { backgroundImage: `url('${service.imageUrl}')`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          {/* overlay */}
          {hasImage ? (
            <div className="absolute inset-0 bg-black/55" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2F683E] to-[#1a3a24]" />
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {serviceData.title}
            </h1>
            <p className="text-xl text-white/85 max-w-3xl leading-relaxed">
              {serviceData.description}
            </p>
          </div>
        </section>

        {/* ── Standalone image (below hero, when image exists) ── */}
        {hasImage && (
          <section className="bg-background">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={service.imageUrl}
                  alt={serviceData.title}
                  width={1200}
                  height={600}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                  priority
                />
              </div>
            </div>
          </section>
        )}

        {/* ── Detailed content ── */}
        {serviceData.detailedContent && (
          <section className={`py-16 md:py-24 bg-background ${hasImage ? "pt-12" : ""}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg max-w-none">
                {/<[a-z][\s\S]*>/i.test(serviceData.detailedContent) ? (
                  <div
                    className="text-foreground leading-relaxed rich-content"
                    dangerouslySetInnerHTML={{ __html: serviceData.detailedContent }}
                  />
                ) : (
                  <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {serviceData.detailedContent}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <section className="py-16 md:py-24 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {isArabic ? "هل أنت مستعد للبدء؟" : "Ready to Get Started?"}
            </h2>
            <p className="text-xl text-white/80 mb-8">
              {isArabic
                ? "تواصل معنا اليوم لمناقشة كيفية أن نستطيع دعم احتياجات منشأتك."
                : "Contact us today to discuss how we can support your facility needs."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-accent-emerald hover:bg-accent-emerald/90 text-white cursor-pointer w-full sm:w-auto">
                  {isArabic ? "احصل على عرض" : "Get a Quote"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {phoneNumber && (
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent cursor-pointer" asChild>
                  <a href={`tel:${phoneNumber}`}>
                    <Phone className="mr-2 h-5 w-5" />
                    {isArabic ? "اتصل الآن" : "Call Now"}
                  </a>
                </Button>
              )}
              {whatsappNumber && (
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent cursor-pointer" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
