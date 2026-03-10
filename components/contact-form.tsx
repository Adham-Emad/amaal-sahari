"use client"

import type React from "react"

import { useState } from "react"
import { useLocale } from "@/lib/locale-context"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ContactForm() {
  const { locale } = useLocale()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  })

  const labels = {
    en: {
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      company: "Company Name",
      service: "Service Interest",
      message: "Message",
      submit: "Send Message",
      submitting: "Sending...",
      success: "Thank you! We'll be in touch soon.",
      error: "Failed to send message. Please try again.",
    },
    ar: {
      name: "الاسم الكامل",
      email: "عنوان البريد الإلكتروني",
      phone: "رقم الهاتف",
      company: "اسم الشركة",
      service: "اهتمام الخدمة",
      message: "الرسالة",
      submit: "إرسال الرسالة",
      submitting: "جارِ الإرسال...",
      success: "شكراً! سنتواصل معك قريباً.",
      error: "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.",
    },
  }

  const t = labels[locale]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t.error)
        setIsSubmitting(false)
        return
      }

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: "", email: "", phone: "", company: "", service: "", message: "" })
      }, 3000)
    } catch {
      setError(t.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle className="w-16 h-16 text-accent-emerald mb-4" />
        <p className="text-lg text-foreground font-semibold">{t.success}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">{t.name}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={t.name}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">{t.email}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={t.email}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">{t.phone}</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={t.phone}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">{t.company}</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={t.company}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">{t.service}</label>
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Select a service</option>
          <option value="housekeeping">Housekeeping & Janitorial</option>
          <option value="hospitality">Hospitality Services</option>
          <option value="landscaping">Landscaping & Plants</option>
          <option value="pest-control">Pest Control</option>
          <option value="facade">Façade Cleaning</option>
          <option value="waste">Waste Management</option>
          <option value="security">Manned Security</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">{t.message}</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="w-full px-4 py-2 border border-border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder={t.message}
        />
      </div>

      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={isSubmitting}>
        {isSubmitting ? t.submitting : t.submit}
      </Button>
    </form>
  )
}
