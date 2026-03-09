"use client"

import { LocaleProvider } from "@/lib/locale-context"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowRight, Zap, Users, Target, Heart, Globe } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

function AboutPageContent() {
  const { locale } = useLocale()
  const { content } = useContent()
  const isArabic = locale === "ar"
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const animationDelay = content?.animations?.aboutPageAnimationDelay || 50

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.1 })

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
      // Check if already in viewport on mount
      const rect = sectionRef.current.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setIsVisible(true)
      }
    }

    return () => observer.disconnect()
  }, [])

  const aboutData = content.about
  
  const visionContent = {
    en: {
      title: aboutData.en.visionTitle,
      description: aboutData.en.visionDescription,
      points: aboutData.en.visionPoints,
    },
    ar: {
      title: aboutData.ar.visionTitle,
      description: aboutData.ar.visionDescription,
      points: aboutData.ar.visionPoints,
    },
  }

  const missionContent = {
    en: {
      title: aboutData.en.missionTitle,
      description: aboutData.en.missionDescription,
      points: aboutData.en.missionPoints,
    },
    ar: {
      title: aboutData.ar.missionTitle,
      description: aboutData.ar.missionDescription,
      points: aboutData.ar.missionPoints,
    },
  }

  const iconMap: Record<string, typeof Heart> = {
    Heart,
    Zap,
    Users,
    Globe,
  }

  const coreValues = {
    en: aboutData.coreValues.map((v) => ({
      icon: iconMap[v.icon] || Heart,
      title: v.en.title,
      description: v.en.description,
    })),
    ar: aboutData.coreValues.map((v) => ({
      icon: iconMap[v.icon] || Heart,
      title: v.ar.title,
      description: v.ar.description,
    })),
  }

  const vision = visionContent[isArabic ? "ar" : "en"]
  const mission = missionContent[isArabic ? "ar" : "en"]
  const values = coreValues[isArabic ? "ar" : "en"]

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section 
          className="relative py-20 md:py-32 text-white overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: aboutData.heroImageUrl 
              ? `url('${aboutData.heroImageUrl}')`
              : "linear-gradient(135deg, rgb(47, 104, 62) 0%, rgba(47, 104, 62, 0.9) 50%, rgba(47, 104, 62, 0.8) 100%)",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                {isArabic ? aboutData.ar.title : aboutData.en.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                {isArabic ? aboutData.ar.subtitle : aboutData.en.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 md:py-28 bg-background relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up transition-all duration-1000">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-accent" />
                  <span className="text-accent font-semibold text-lg">{vision.title}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">{vision.title}</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{vision.description}</p>
                <ul className="space-y-4">
                  {vision.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <ArrowRight className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-gray-700 group-hover:text-primary transition-colors">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="animate-fade-in relative h-96 transition-all duration-1000 delay-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl"></div>
                {aboutData.visionImageUrl ? (
                  <Image
                    src={aboutData.visionImageUrl}
                    alt="Vision - Innovation and Partnerships"
                    fill
                    className="object-cover rounded-2xl shadow-2xl w-auto h-auto"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-background to-background/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div
                className="animate-fade-in relative h-96 transition-all duration-1000 delay-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl"></div>
                {aboutData.missionImageUrl ? (
                  <Image
                    src={aboutData.missionImageUrl}
                    alt="Mission - Excellence and Sustainability"
                    fill
                    className="object-cover rounded-2xl shadow-2xl w-auto h-auto"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>

              <div
                className="animate-fade-in-up transition-all duration-1000 delay-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-accent" />
                  <span className="text-accent font-semibold text-lg">{mission.title}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">{mission.title}</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{mission.description}</p>
                <ul className="space-y-4">
                  {mission.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <ArrowRight className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-gray-700 group-hover:text-primary transition-colors">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-20 md:py-28 bg-background" ref={sectionRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {isArabic ? "قيمنا الأساسية" : "Our Core Values"}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {isArabic
                  ? "المبادئ التي توجه كل قرار وإجراء نتخذه"
                  : "The principles that guide every decision and action we take"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-xl p-8 border border-border hover:shadow-xl transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * animationDelay}ms` }}
                  >
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-all duration-300">
                        <Icon className="w-8 h-8 text-accent group-hover:scale-125 transition-transform duration-300" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-3 group-hover:text-accent transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function AboutPage() {
  return (
    <LocaleProvider>
      <AboutPageContent />
    </LocaleProvider>
  )
}
