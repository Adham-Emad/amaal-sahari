"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import { ArrowRight, Mail, MapPin, Briefcase, X } from "lucide-react"
import { useState } from "react"

function ApplicationModal({
  jobPosition,
  positionId,
  locale,
}: {
  jobPosition: string
  positionId: number
  locale: string
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resume: "",
    coverLetter: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const isArabic = locale === "ar"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const application = {
      id: `app_${Date.now()}`,
      jobPosition,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      resume: formData.resume,
      coverLetter: formData.coverLetter,
      submittedAt: new Date().toLocaleString(),
      status: "pending" as const,
      notes: "",
      replies: [],
    }

    try {
      const existing = JSON.parse(localStorage.getItem("job_applications") || "[]")
      const updated = [application, ...existing]
      localStorage.setItem("job_applications", JSON.stringify(updated))
    } catch (error) {
      console.error("Failed to save application:", error)
    }

    setSubmitted(true)
    setTimeout(() => {
      const modal = document.getElementById(`apply-modal-${positionId}`)
      if (modal instanceof HTMLDialogElement) modal.close()
      setSubmitted(false)
      setFormData({ fullName: "", email: "", phone: "", resume: "", coverLetter: "" })
    }, 2000)
  }

  return (
    <dialog id={`apply-modal-${positionId}`} className="rounded-2xl backdrop:bg-black/50 w-full max-w-2xl shadow-2xl">
      <div className="p-8 bg-white">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {isArabic ? "تقديم طلب لـ" : "Apply for"}
            </h2>
            <p className="text-lg text-accent-orange font-semibold mt-2">{jobPosition}</p>
          </div>
          <button
            onClick={() => {
              const modal = document.getElementById(`apply-modal-${positionId}`)
              if (modal instanceof HTMLDialogElement) modal.close()
            }}
            className="text-foreground-secondary hover:text-foreground transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl font-bold text-accent-emerald">✓</div>
            <p className="text-2xl text-foreground font-bold">
              {isArabic ? "تم استلام طلبك بنجاح!" : "Application Submitted Successfully!"}
            </p>
            <p className="text-foreground-secondary text-lg">
              {isArabic
                ? "سيتواصل معك فريقنا قريباً بخصوص طلبك."
                : "Our team will be in touch with you soon regarding your application."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-base font-semibold text-foreground mb-2 block">
                {isArabic ? "الاسم الكامل" : "Full Name"}
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                placeholder={isArabic ? "أدخل اسمك الكامل" : "Enter your full name"}
                className="h-12 text-base border-2 border-gray-200 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email" className="text-base font-semibold text-foreground mb-2 block">
                  {isArabic ? "البريد الإلكتروني" : "Email"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder={isArabic ? "بريدك الإلكتروني" : "your@email.com"}
                  className="h-12 text-base border-2 border-gray-200 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-base font-semibold text-foreground mb-2 block">
                  {isArabic ? "رقم الهاتف" : "Phone"}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder={isArabic ? "رقم هاتفك" : "+1 (555) 000-0000"}
                  className="h-12 text-base border-2 border-gray-200 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="resume" className="text-base font-semibold text-foreground mb-2 block">
                {isArabic ? "رابط السيرة الذاتية" : "Resume Link"}
              </Label>
              <Input
                id="resume"
                type="url"
                value={formData.resume}
                onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                required
                placeholder={isArabic ? "https://example.com/resume.pdf" : "https://example.com/resume.pdf"}
                className="h-12 text-base border-2 border-gray-200 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20"
              />
              <p className="text-sm text-foreground-secondary mt-2 font-medium">
                {isArabic ? "💡 يمكنك استخدام Google Drive أو Dropbox" : "💡 You can use Google Drive or Dropbox"}
              </p>
            </div>

            <div>
              <Label htmlFor="coverLetter" className="text-base font-semibold text-foreground mb-2 block">
                {isArabic ? "رسالة التقديم" : "Cover Letter"}
              </Label>
              <Textarea
                id="coverLetter"
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                required
                placeholder={isArabic ? "أخبرنا عن نفسك..." : "Tell us about yourself..."}
                className="resize-none border-2 border-gray-200 focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 text-base"
                rows={6}
              />
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button 
                type="submit" 
                className="flex-1 h-12 text-base font-bold bg-accent-orange hover:bg-accent-orange/90 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                {isArabic ? "إرسال الطلب" : "Submit Application"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const modal = document.getElementById(`apply-modal-${positionId}`)
                  if (modal instanceof HTMLDialogElement) modal.close()
                }}
                className="px-6 h-12 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  )
}

export default function CareersPage() {
  const { locale } = useLocale()
  const { content } = useContent()
  const isArabic = locale === "ar"
  const careersEmail = content?.contact?.email || "careers@amaalsahari.com"

  // Safe access with fallback
  const positions = (content?.careers?.positions || []).map((position, index) => ({
    id: index,
    title: isArabic ? position?.ar?.title || "Position" : position?.en?.title || "Position",
    department: isArabic ? position?.ar?.department || "Department" : position?.en?.department || "Department",
    location: isArabic ? position?.ar?.location || "Location" : position?.en?.location || "Location",
    description: isArabic ? position?.ar?.description || "Description" : position?.en?.description || "Description",
  }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-accent-emerald/50 text-white py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {locale === "ar" ? "انضم إلى فريقنا" : "Join Our Team"}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              {locale === "ar"
                ? "نحن نبحث عن مواهب متميزة للانضمام إلى فريقنا المتنامي والمساهمة في نجاحنا."
                : "We're looking for talented individuals to join our growing team and contribute to our success."}
            </p>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-foreground mb-12">
              {locale === "ar" ? "الوظائف المتاحة" : "Open Positions"}
            </h2>
            {positions && positions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {positions.map((position) => (
                <div
                  key={position.id}
                  className="bg-white rounded-lg p-8 border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Briefcase className="w-8 h-8 text-accent-orange" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{position.title}</h3>
                  <div className="space-y-2 mb-4 text-sm text-foreground-secondary">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{position.department}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {position.location}
                    </p>
                  </div>
                  <p className="text-foreground-secondary mb-6">{position.description}</p>
                  <Button 
                    onClick={() => {
                      const modal = document.getElementById(`apply-modal-${position.id}`)
                      if (modal instanceof HTMLDialogElement) modal.showModal()
                    }}
                    className="w-full bg-accent-orange hover:bg-accent-orange/90 text-white"
                  >
                    {locale === "ar" ? "تقديم طلب" : "Apply Now"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>

                  {/* Application Modal */}
                  <ApplicationModal
                    jobPosition={position.title}
                    positionId={position.id}
                    locale={locale}
                  />
                </div>
              ))}
            </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground-secondary text-lg">
                  {locale === "ar" ? "لا توجد وظائف متاحة حالياً" : "No open positions at the moment"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              {locale === "ar" ? "لم تجد الوظيفة المناسبة؟" : "Don't See Your Position?"}
            </h2>
            <p className="text-xl text-foreground-secondary mb-8">
              {locale === "ar"
                ? "أرسل لنا سيرتك الذاتية وسنتواصل معك عند توفر فرصة مناسبة."
                : "Send us your resume and we'll reach out when a suitable opportunity arises."}
            </p>
            <a href={`mailto:${careersEmail}`}>
              <Button className="bg-accent-orange hover:bg-accent-orange/90 text-white">
                <Mail className="mr-2 w-5 h-5" />
                {locale === "ar" ? "أرسل سيرتك الذاتية" : "Send Your Resume"}
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
