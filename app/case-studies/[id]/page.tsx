"use client"

import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import { ArrowLeft, TrendingUp } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function CaseStudyDetailPage() {
  const router = useRouter()
  const params = useParams()
  const caseStudyId = params.id as string
  const { locale } = useLocale()
  const { content, isContentLoaded } = useContent()
  const isArabic = locale === "ar"

  // Find the case study
  const caseStudy = content.caseStudies.items.find((c) => c.id === caseStudyId)

  // Wait for content to load before showing "not found" to avoid flash on refresh
  if (!isContentLoaded) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    )
  }

  if (!caseStudy) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {locale === "ar" ? "دراسة الحالة غير موجودة" : "Case Study Not Found"}
            </h1>
            <Button
              onClick={() => router.push("/#case-studies")}
              className="bg-accent-orange hover:bg-accent-orange/90 text-white"
            >
              {locale === "ar" ? "العودة" : "Go Back"}
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const data = isArabic ? caseStudy.ar : caseStudy.en
  const title = data.title
  const description = data.description
  const metrics = data.metrics
  const challenges = data.challenges || ""
  const solution = data.solution || ""
  const results = data.results || ""

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section with Image */}
        <section className="relative w-full h-96 overflow-hidden bg-gray-900">
          {caseStudy.imageUrl ? (
            <Image
              src={caseStudy.imageUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
          )}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-accent-orange" />
                <span className="text-lg font-semibold text-accent-orange">{metrics}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Overview */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {locale === "ar" ? "نظرة عامة" : "Overview"}
              </h2>
              <p className="text-lg text-foreground-secondary leading-relaxed mb-4">{description}</p>
            </div>

            {/* Challenges Section */}
            {challenges && (
              <div className="mb-12 p-8 bg-accent-orange/10 rounded-lg border border-accent-orange/20">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {locale === "ar" ? "التحديات" : "Challenges"}
                </h3>
                <p className="text-foreground-secondary leading-relaxed whitespace-pre-wrap">{challenges}</p>
              </div>
            )}

            {/* Solution Section */}
            {solution && (
              <div className="mb-12 p-8 bg-primary/10 rounded-lg border border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {locale === "ar" ? "الحل" : "Solution"}
                </h3>
                <p className="text-foreground-secondary leading-relaxed whitespace-pre-wrap">{solution}</p>
              </div>
            )}

            {/* Results Section */}
            {results && (
              <div className="mb-12 p-8 bg-accent-emerald/10 rounded-lg border border-accent-emerald/20">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {locale === "ar" ? "النتائج" : "Results"}
                </h3>
                <p className="text-foreground-secondary leading-relaxed whitespace-pre-wrap">{results}</p>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-12 pt-8 border-t border-border">
              <Button
                onClick={() => router.push("/#case-studies")}
                className="bg-accent-orange hover:bg-accent-orange/90 text-white inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {locale === "ar" ? "العودة" : "Go Back"}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
