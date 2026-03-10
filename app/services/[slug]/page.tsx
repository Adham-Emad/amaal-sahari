"use client"

import { useParams } from "next/navigation"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle, Phone } from "lucide-react"
import Link from "next/link"

export default function ServicePage() {
  const params = useParams()
  const slug = params.slug as string
  const { locale } = useLocale()
  const { content } = useContent()
  const isArabic = locale === "ar"

  // Get service from content context
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section 
          className="relative py-16 md:py-24 text-foreground bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: service.imageUrl 
              ? `url('${service.imageUrl}')`
              : "linear-gradient(135deg, rgba(47, 104, 62, 0.1) 0%, rgba(47, 104, 62, 0.05) 100%)",
          }}
        >
          <div className="absolute inset-0 bg-white/95"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">{serviceData.title}</h1>
            <p className="text-xl text-foreground-secondary max-w-3xl">{serviceData.description}</p>
          </div>
        </section>

        {/* Detailed Content Section */}
        {serviceData.detailedContent && (
          <section className="py-16 md:py-24 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {serviceData.detailedContent}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
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
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent cursor-pointer">
                <Phone className="mr-2 h-5 w-5" />
                {isArabic ? "اتصل الآن" : "Call Now"}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent cursor-pointer">
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
