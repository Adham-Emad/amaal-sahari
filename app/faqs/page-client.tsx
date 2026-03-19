"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import { useState } from "react"
import { ChevronDown, HelpCircle, Zap, Users, Lock } from "lucide-react"

export default function FAQsPage() {
  const { locale } = useLocale()
  const { content } = useContent()
  const isArabic = locale === "ar"
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = content.faqs.items.map((item) => ({
    question: isArabic ? item.ar.question : item.en.question,
    answer: isArabic ? item.ar.answer : item.en.answer,
  }))

  const features = [
    {
      icon: HelpCircle,
      title: locale === "ar" ? "دعم سريع" : "Quick Support",
      description: locale === "ar" ? "احصل على إجابات فوراً" : "Get instant answers",
    },
    {
      icon: Zap,
      title: locale === "ar" ? "حلول فعالة" : "Efficient Solutions",
      description: locale === "ar" ? "حلول موثوقة وسريعة" : "Reliable and fast solutions",
    },
    {
      icon: Users,
      title: locale === "ar" ? "فريق متخصص" : "Expert Team",
      description: locale === "ar" ? "متخصصون في الخدمات" : "Service specialists",
    },
    {
      icon: Lock,
      title: locale === "ar" ? "ضمان الرضا" : "Satisfaction Guarantee",
      description: locale === "ar" ? "100% مضمونة" : "100% guaranteed",
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary to-accent-emerald text-white py-24 md:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block mb-6 p-4 bg-white/10 rounded-full">
                <HelpCircle className="w-12 h-12" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-pretty">
                {locale === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto text-pretty">
                {locale === "ar"
                  ? "ابحث عن إجابات شاملة لجميع أسئلتك حول خدماتنا المتميزة."
                  : "Find comprehensive answers to all your questions about our premium services."}
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="text-center p-6 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    <Icon className="w-10 h-10 text-accent-orange mx-auto mb-3" />
                    <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-foreground-secondary">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl border border-border overflow-hidden hover:border-accent-orange transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-primary/2 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent-orange transition-colors pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-6 h-6 text-accent-orange flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-8 py-6 bg-gradient-to-r from-primary/5 to-accent-emerald/5 border-t border-border">
                      <p className="text-foreground-secondary leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-20 md:py-24 bg-gradient-to-r from-primary to-accent-emerald">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-pretty">
              {locale === "ar" ? "لم تجد إجابتك؟" : "Didn't Find Your Answer?"}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {locale === "ar"
                ? "فريقنا الماهر جاهز للمساعدة. تواصل معنا الآن للحصول على استشارة متخصصة."
                : "Our expert team is ready to help. Contact us now for specialized consultation."}
            </p>
            <a href="/contact">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg">
                {locale === "ar" ? "اتصل بنا الآن" : "Contact Us Now"}
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
