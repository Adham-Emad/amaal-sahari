"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Home,
  BarChart3,
  MessageSquare,
  Briefcase,
  Phone,
  Wrench,
  Info,
  FileText,
  Users,
  HelpCircle,
  Layout,
  Search,
  MessageCircle,
  Share2,
  Menu
} from "lucide-react"
import ChangePasswordDialog from "./change-password-dialog"
import HeroEditor from "./editors/hero-editor"
import KpisEditor from "./editors/kpis-editor"
import TestimonialsEditor from "./editors/testimonials-editor"
import CaseStudiesEditor from "./editors/case-studies-editor"
import ContactEditor from "./editors/contact-editor"
import NavbarEditor from "./editors/navbar-editor"
import ServicesEditor from "./editors/services-editor"
import ValueHighlightsEditor from "./editors/value-highlights-editor"
import WhyChooseUsEditor from "./editors/why-choose-us-editor"
import AboutEditor from "./editors/about-editor"
import BlogEditor from "./editors/blog-editor"
import CareersEditor from "./editors/careers-editor"
import FAQsEditor from "./editors/faqs-editor"
import FooterContactEditor from "./editors/footer-editor"
import SeoEditor from "./editors/seo-editor"
import WhatsAppEditor from "./editors/whatsapp-editor"
import SocialMediaEditor from "./editors/social-media-editor"
import NewsEditor from "./editors/news-editor"
import HomepageSectionsEditor from "./editors/homepage-sections-editor"
import ServiceDetailsEditor from "./editors/service-details-editor"
import PrivacyPolicyEditor from "./editors/privacy-policy-editor"
import TermsOfServiceEditor from "./editors/terms-of-service-editor"
import KpisEditorUpdated from "./editors/kpis-updated-editor"
import SubpageSeoEditor from "./editors/subpage-seo-editor"
import ContactSubmissionsEditor from "./editors/contact-submissions-editor"
import JobApplicationsEditor from "./editors/job-applications-editor"
import BlogDetailsEditor from "./editors/blog-details-editor"
import CaseStudyDetailsEditor from "./editors/case-study-details-editor"
import CustomPagesEditor from "./editors/custom-pages-editor"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("hero")

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Admin Controls - Inside Admin Dashboard Only */}
      <div className="border-b bg-background px-4 py-3 flex justify-end gap-2">
        <ChangePasswordDialog />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
  <ScrollArea className="w-full whitespace-nowrap rounded-md border">
    <TabsList className="inline-flex w-max p-1">
      <TabsTrigger value="hero" className="flex items-center gap-2">
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Hero</span>
      </TabsTrigger>
      <TabsTrigger value="navbar" className="flex items-center gap-2">
        <Menu className="w-4 h-4" />
        <span className="hidden sm:inline">Navbar</span>
      </TabsTrigger>
      <TabsTrigger value="value-highlights" className="flex items-center gap-2">
        <Layout className="w-4 h-4" />
        <span className="hidden sm:inline">Value Highlights</span>
      </TabsTrigger>
      <TabsTrigger value="services" className="flex items-center gap-2">
        <Wrench className="w-4 h-4" />
        <span className="hidden sm:inline">Services</span>
      </TabsTrigger>
      <TabsTrigger value="kpis" className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        <span className="hidden sm:inline">KPIs</span>
      </TabsTrigger>
      <TabsTrigger value="why-choose-us" className="flex items-center gap-2">
        <Info className="w-4 h-4" />
        <span className="hidden sm:inline">Why Choose Us</span>
      </TabsTrigger>
      <TabsTrigger value="testimonials" className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">Testimonials</span>
      </TabsTrigger>
      <TabsTrigger value="case-studies" className="flex items-center gap-2">
        <Briefcase className="w-4 h-4" />
        <span className="hidden sm:inline">Case Studies</span>
      </TabsTrigger>
      <TabsTrigger value="about" className="flex items-center gap-2">
        <Info className="w-4 h-4" />
        <span className="hidden sm:inline">About</span>
      </TabsTrigger>
      <TabsTrigger value="blog" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Blog</span>
      </TabsTrigger>
      <TabsTrigger value="news" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">News</span>
      </TabsTrigger>
      <TabsTrigger value="careers" className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        <span className="hidden sm:inline">Careers</span>
      </TabsTrigger>
      <TabsTrigger value="faqs" className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4" />
        <span className="hidden sm:inline">FAQs</span>
      </TabsTrigger>
      <TabsTrigger value="contact" className="flex items-center gap-2">
        <Phone className="w-4 h-4" />
        <span className="hidden sm:inline">Contact</span>
      </TabsTrigger>
      <TabsTrigger value="footer" className="flex items-center gap-2">
        <Layout className="w-4 h-4" />
        <span className="hidden sm:inline">Footer</span>
      </TabsTrigger>
      <TabsTrigger value="seo" className="flex items-center gap-2">
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">SEO</span>
      </TabsTrigger>
      <TabsTrigger value="whatsapp" className="flex items-center gap-2">
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">WhatsApp</span>
      </TabsTrigger>
      <TabsTrigger value="social-media" className="flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Social Media</span>
      </TabsTrigger>
      <TabsTrigger value="homepage-sections" className="flex items-center gap-2">
        <Layout className="w-4 h-4" />
        <span className="hidden sm:inline">Homepage Sections</span>
      </TabsTrigger>
      <TabsTrigger value="service-details" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Service Details</span>
      </TabsTrigger>
      <TabsTrigger value="privacy-policy" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Privacy Policy</span>
      </TabsTrigger>
      <TabsTrigger value="terms-of-service" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Terms of Service</span>
      </TabsTrigger>
      <TabsTrigger value="kpis-advanced" className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        <span className="hidden sm:inline">KPIs Advanced</span>
      </TabsTrigger>
      <TabsTrigger value="subpage-seo" className="flex items-center gap-2">
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Subpage SEO</span>
      </TabsTrigger>
      <TabsTrigger value="submissions" className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">Submissions</span>
      </TabsTrigger>
      <TabsTrigger value="job-applications" className="flex items-center gap-2">
        <Briefcase className="w-4 h-4" />
        <span className="hidden sm:inline">Job Applications</span>
      </TabsTrigger>
      <TabsTrigger value="blog-details" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Blog Details</span>
      </TabsTrigger>
      <TabsTrigger value="case-studies-details" className="flex items-center gap-2">
        <Briefcase className="w-4 h-4" />
        <span className="hidden sm:inline">Case Studies Details</span>
      </TabsTrigger>
      <TabsTrigger value="custom-pages" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Custom Pages</span>
      </TabsTrigger>
    </TabsList>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>

  <TabsContent value="hero" className="space-y-4">
    <HeroEditor />
  </TabsContent>

  <TabsContent value="navbar" className="space-y-4">
    <NavbarEditor />
  </TabsContent>

  <TabsContent value="value-highlights" className="space-y-4">
    <ValueHighlightsEditor />
  </TabsContent>

  <TabsContent value="services" className="space-y-4">
    <ServicesEditor />
  </TabsContent>

  <TabsContent value="kpis" className="space-y-4">
    <KpisEditor />
  </TabsContent>

  <TabsContent value="why-choose-us" className="space-y-4">
    <WhyChooseUsEditor />
  </TabsContent>

  <TabsContent value="testimonials" className="space-y-4">
    <TestimonialsEditor />
  </TabsContent>

  <TabsContent value="case-studies" className="space-y-4">
    <CaseStudiesEditor />
  </TabsContent>

  <TabsContent value="about" className="space-y-4">
    <AboutEditor />
  </TabsContent>

  <TabsContent value="blog" className="space-y-4">
    <BlogEditor />
  </TabsContent>

  <TabsContent value="news" className="space-y-4">
    <NewsEditor />
  </TabsContent>

  <TabsContent value="careers" className="space-y-4">
    <CareersEditor />
  </TabsContent>

  <TabsContent value="faqs" className="space-y-4">
    <FAQsEditor />
  </TabsContent>

  <TabsContent value="contact" className="space-y-4">
    <ContactEditor />
  </TabsContent>

  <TabsContent value="footer" className="space-y-4">
    <FooterContactEditor />
  </TabsContent>

  <TabsContent value="seo" className="space-y-4">
    <SeoEditor />
  </TabsContent>

  <TabsContent value="whatsapp" className="space-y-4">
    <WhatsAppEditor />
  </TabsContent>

  <TabsContent value="social-media" className="space-y-4">
    <SocialMediaEditor />
  </TabsContent>

  <TabsContent value="homepage-sections" className="space-y-4">
    <HomepageSectionsEditor />
  </TabsContent>

  <TabsContent value="service-details" className="space-y-4">
    <ServiceDetailsEditor />
  </TabsContent>

  <TabsContent value="privacy-policy" className="space-y-4">
    <PrivacyPolicyEditor />
  </TabsContent>

  <TabsContent value="terms-of-service" className="space-y-4">
    <TermsOfServiceEditor />
  </TabsContent>

  <TabsContent value="kpis-advanced" className="space-y-4">
    <KpisEditorUpdated />
  </TabsContent>

  <TabsContent value="subpage-seo" className="space-y-4">
    <SubpageSeoEditor />
  </TabsContent>

  <TabsContent value="submissions" className="space-y-4">
    <ContactSubmissionsEditor />
  </TabsContent>

  <TabsContent value="job-applications" className="space-y-4">
    <JobApplicationsEditor />
  </TabsContent>

  <TabsContent value="blog-details" className="space-y-4">
    <BlogDetailsEditor />
  </TabsContent>

  <TabsContent value="case-studies-details" className="space-y-4">
    <CaseStudyDetailsEditor />
  </TabsContent>

  <TabsContent value="custom-pages" className="space-y-4">
    <CustomPagesEditor />
  </TabsContent>
</Tabs>
      </main>
    </div>
  )
}
