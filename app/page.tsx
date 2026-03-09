"use client"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Footer from "@/components/footer"
import ValueHighlights from "@/components/value-highlights"
import ServicesCarousel from "@/components/services-carousel"
import WhyChooseUs from "@/components/why-choose-us"
import CaseStudies from "@/components/case-studies"
import Testimonials from "@/components/testimonials"
import ServicesVideoSection from "@/components/services-video-section"
import KPIs from "@/components/kpis"
import HomeNewsSection from "@/components/home-news-section"
import { useContent } from "@/lib/content-context"

export default function Home() {
  const { content } = useContent()
  const sections = content?.homepageSections

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {sections?.valueHighlights?.visible && (
          <div id="about">
            <ValueHighlights />
          </div>
        )}
        {sections?.servicesVideo?.visible && <ServicesVideoSection />}
        {sections?.kpis?.visible && <KPIs />}
        {sections?.services?.visible && <ServicesCarousel />}
        {sections?.whyChooseUs?.visible && <WhyChooseUs />}
        {sections?.projects?.visible && (
          <div id="projects">
            <CaseStudies />
          </div>
        )}
        {sections?.testimonials?.visible && <Testimonials />}
        {sections?.news?.visible && <HomeNewsSection />}
      </main>
      <Footer />
    </>
  )
}
