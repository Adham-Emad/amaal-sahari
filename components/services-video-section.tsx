"use client"

import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const DEFAULT_VIDEO_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Video_Generation_for_Service_Website-T7bRSMOTVgzh5VSECwLZADIh2jQ5In.mp4"

function getVideoMimeType(url: string): string {
  const clean = url.split("?")[0].toLowerCase()
  if (clean.endsWith(".mov")) return "video/quicktime"
  if (clean.endsWith(".webm")) return "video/webm"
  if (clean.endsWith(".avi")) return "video/x-msvideo"
  if (clean.endsWith(".mkv")) return "video/x-matroska"
  if (clean.endsWith(".ogv")) return "video/ogg"
  return "video/mp4"
}

export default function ServicesVideoSection() {
  const { locale } = useLocale()
  const { content, isContentLoaded } = useContent()
  const isArabic = locale === "ar"
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  const sv = content?.homepageSections?.servicesVideo

  const sectionTitle = isArabic
    ? sv?.ar?.title || "خدمات ناعمة احترافية لأماكن العمل الحديثة"
    : sv?.en?.title || "Professional Soft Services for Modern Workplaces"

  const sectionSubtitle = isArabic
    ? sv?.ar?.subtitle || ""
    : sv?.en?.subtitle || ""

  const cta1Text = isArabic
    ? sv?.ar?.cta1 || "احصل على عرض مجاني"
    : sv?.en?.cta1 || "Get a Free Quote"

  const cta2Text = isArabic
    ? sv?.ar?.cta2 || "استكشف الخدمات"
    : sv?.en?.cta2 || "Explore Services"

  // Don't resolve the URL until content is confirmed from the server.
  // This prevents the hardcoded default video from flashing on every page load.
  const videoUrl = isContentLoaded ? (sv?.videoUrl || DEFAULT_VIDEO_URL) : null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* key=videoUrl forces full remount when URL changes so the browser loads the new video */}
      <video key={videoUrl ?? "none"} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        {videoUrl && <source src={videoUrl} type={getVideoMimeType(videoUrl)} />}
      </video>

      <div className="absolute inset-0 bg-black/35" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-background mb-6 leading-tight"
        >
          {sectionTitle}
        </motion.h1>

        {sectionSubtitle && (
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-background/95 mb-8 max-w-2xl mx-auto">
            {sectionSubtitle}
          </motion.p>
        )}

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">
              {cta1Text}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/#services">
            <Button
              size="lg"
              variant="outline"
              className="bg-background/90 hover:bg-background text-foreground border-background"
            >
              {cta2Text}
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-background/90"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-emerald rounded-full" />
            ISO 9001 Certified
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-emerald rounded-full" />
            OSHA Compliant
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-emerald rounded-full" />
            24/7 Support
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
