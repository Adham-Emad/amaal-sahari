"use client"

import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"

export default function PrivacyPolicy() {
  const { locale } = useLocale()
  const { content } = useContent()

  const isArabic = locale === "ar"
  const privacyContent = content.privacyPolicy || {
    title: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
    lastUpdated: { en: "Last Updated: November 2025", ar: "آخر تحديث: نوفمبر 2025" },
    sections: []
  }

  return (
    <main className="min-h-screen bg-[#FAFBF0]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#2F683E] to-[#1a3a24] text-[#FAFBF0] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            {privacyContent.title[locale]}
          </h1>
          <p className="text-lg text-[#FAFBF0]/80">
            {privacyContent.lastUpdated[locale]}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`space-y-8 ${isArabic ? "text-right" : "text-left"}`}>
          {privacyContent.sections.map((section, index) => (
            <div key={section.id}>
              <h2 className="text-2xl font-bold text-[#2F683E] mb-4">
                {index + 1}. {section.title[locale]}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {section.content[locale]}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
