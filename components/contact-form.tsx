"use client"

import type React from "react"

import { useState } from "react"
import { useLocale } from "@/lib/locale-context"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ContactForm() {
  const { locale } = useLocale()
  const [submitted, setSubmitted] = useState(false)
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
      success: "Thank you! We'll be in touch soon.",
    },
    ar: {
      name: "الاسم الكامل",
      email: "عنوان البريد الإلكتروني",
      phone: "رقم الهاتف",
      company: "اسم الشركة",
      service: "اهتمام الخدمة",
      message: "الرسالة",
      submit: "إرسال الرسالة",
      success: "شكراً! سنتواصل معك قريباً.",
    },
  }

  const t = labels[locale]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Save to localStorage for CMS access
    const submission = {
      id: `submission_${Date.now()}`,
      ...formData,
      submittedAt: new Date().toLocaleString(),
      read: false,
    }
    
    try {
      const existing = JSON.parse(localStorage.getItem("contact_submissions") || "[]")
      const updated = [submission, ...existing]
      localStorage.setItem("contact_submissions", JSON.stringify(updated))
    } catch (error) {
      console.error("Failed to save submission:", error)
    }
    
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", email: "", phone: "", company: "", service: "", message: "" })
    }, 3000)
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

      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white">
        {t.submit}
      </Button>
    </form>
  )
}
