"use client"

import { useLocale } from "@/lib/locale-context"
import { translations } from "@/lib/i18n"
import { useContent } from "@/lib/content-context"
import Link from "next/link"
import Image from "next/image"
import SocialMediaIcons from "./social-media-icons"

export default function Footer() {
  const { locale } = useLocale()
  const t = translations[locale]
  const { content } = useContent()

  return (
    <footer className="bg-[#2F683E] text-[#FAFBF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <span className="text-lg font-bold text-[#FAFBF0]">Amaal Sahari</span>
        </div>

        <div className="mb-12 py-8 border-b border-[#FAFBF0]/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {(content.kpis?.items || []).map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#EA8936] mb-2">{stat.value}</div>
                <p className="text-[#FAFBF0]/80">{stat[locale]?.label || ""}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">{t.footer.company}</h3>
            <ul className="space-y-2 text-sm text-[#FAFBF0]/80">
              <li>
                <Link href="/about" className="hover:text-[#EA8936] transition-colors">
                  {t.footer.aboutUs || "About Us"}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[#EA8936] transition-colors">
                  {t.footer.careers || "Careers"}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#EA8936] transition-colors">
                  {t.footer.blog || "Blog"}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">{t.footer.services}</h3>
            <ul className="space-y-2 text-sm text-[#FAFBF0]/80">
              <li>
                <Link href="/services/housekeeping-janitorial" className="hover:text-[#EA8936] transition-colors">
                  {t.footer.housekeeping || "Housekeeping"}
                </Link>
              </li>
              <li>
                <Link href="/services/hospitality-services" className="hover:text-[#EA8936] transition-colors">
                  {t.footer.hospitality || "Hospitality"}
                </Link>
              </li>
              <li>
                <Link href="/services/manned-security" className="hover:text-[#EA8936] transition-colors">
                  {t.footer.security || "Security"}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">{t.footer.resources}</h3>
            <ul className="space-y-2 text-sm text-[#FAFBF0]/80">
              <li>
                <Link href="/faqs" className="hover:text-[#EA8936] transition-colors">
                  {t.footer.faqs || "FAQs"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#EA8936] transition-colors">
                  {t.footer.support || "Support"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#EA8936] transition-colors">
                  {t.footer.contact || "Contact"}
                </Link>
              </li>
            </ul>
          </div>
          <div>
<h3 className="font-bold mb-4">{t.footer.contact}</h3>
  <ul className="space-y-2 text-sm text-[#FAFBF0]/80">
    <li>
      Phone:{" "}
      <a href={`tel:${content.contact.phone}`} className="hover:text-[#EA8936] transition-colors">
        {content.contact.phone}
      </a>
    </li>
    <li>
      Email:{" "}
      <a href={`mailto:${content.contact.email}`} className="hover:text-[#EA8936] transition-colors">
        {content.contact.email}
      </a>
    </li>
    <li>
      WhatsApp:{" "}
      <a
        href={`https://wa.me/${(content.contact.whatsapp || "").replace(/[^0-9]/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-[#EA8936] transition-colors"
      >
        {content.contact.whatsapp || "+201021454545"}
      </a>
    </li>
  </ul>
          </div>
        </div>

        <div className="border-t border-[#FAFBF0]/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#FAFBF0]/60">
          <p>&copy; 2025 Amaal Sahari. {t.footer.rights}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-[#FAFBF0] transition-colors">
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-[#FAFBF0] transition-colors">
              {t.footer.terms}
            </Link>
          </div>
          <div className="mt-4 md:mt-0">
            <SocialMediaIcons position="footer" className="text-[#FAFBF0]" />
          </div>
        </div>
      </div>
    </footer>
  )
}
