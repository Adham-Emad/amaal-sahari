"use client"

import type React from "react"

import { useState } from "react"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import SocialMediaIcons from "./social-media-icons"

export default function Navbar() {
  const { locale, setLocale, dir } = useLocale()
  const { content } = useContent()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navConfig = content.navbar

  const cmsNavItems = (navConfig.navigation?.[locale] || []).map((item) => {
    const hasHash = item.href.includes("#")
    if (hasHash) {
      const [path, anchor] = item.href.split("#")
      return { label: item.label, href: path || "/", anchor }
    }
    return { label: item.label, href: item.href, anchor: undefined }
  })

  const customPageItems = (content.customPages || [])
    .filter((p) => p.showInNavbar && p.status === "published")
    .sort((a, b) => (a.navbarOrder || 0) - (b.navbarOrder || 0))
    .map((p) => ({ label: p[locale].title, href: `/p/${p.slug}`, anchor: undefined }))

  const navItems = [...cmsNavItems, ...customPageItems]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, anchor?: string) => {
    if (anchor) {
      e.preventDefault()
      if (typeof window !== "undefined" && window.location.pathname === (href || "/")) {
        const element = document.getElementById(anchor)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
          setMobileMenuOpen(false)
        }
      } else {
        window.location.href = `${href || "/"}#${anchor}`
      }
    }
  }

  // Get localized company name for alt text from config or use default
  const logoAltText = navConfig.logo.alt || (locale === "ar" ? "أمال ساهري" : "Amaal Sahari")

  return (
    <>
      <nav 
        className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300"
        style={{
          backgroundColor: navConfig.colors.background,
          color: navConfig.colors.text,
          borderColor: `${navConfig.colors.background}33`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity">
              <div className="relative" style={{ height: `${navConfig.logo.height}px`, minWidth: "40px" }}>
                {navConfig.logo.url ? (
                  navConfig.logo.url.startsWith('data:') || navConfig.logo.url.startsWith('blob:') ? (
                    <img
                      src={navConfig.logo.url}
                      alt={logoAltText}
                      className="object-contain h-full w-auto"
                      style={{ maxHeight: `${navConfig.logo.height}px`, display: "block" }}
                    />
                  ) : (
                    <Image
                      src={navConfig.logo.url}
                      alt={logoAltText}
                      width={200}
                      height={200}
                      className="object-contain"
                      priority
                      loading="eager"
                      unoptimized
                      style={{ width: "auto", height: "100%", maxWidth: "none" }}
                    />
                  )
                ) : (
                  <div className="text-sm font-bold">{logoAltText}</div>
                )}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.anchor)}
                  className="cursor-pointer transition-colors relative group"
                  style={{ color: navConfig.colors.text }}
                >
                  {item.label}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: navConfig.colors.accent }}
                  />
                </Link>
              ))}
            </div>

            {/* Desktop CTAs and Language Switcher */}
            <div className="hidden md:flex items-center gap-4">
              <SocialMediaIcons position="header" className="border-r pr-4" style={{ color: navConfig.colors.text, borderColor: `${navConfig.colors.text}33` }} />
              <Link href="/contact" className="cursor-pointer">
                <Button 
                  size="sm" 
                  className="font-semibold transition-colors cursor-pointer"
                  style={{ 
                    backgroundColor: navConfig.colors.accent,
                    color: navConfig.colors.background
                  }}
                >
                  {navConfig.cta[locale]}
                </Button>
              </Link>
              <button
                onClick={() => setLocale(locale === "en" ? "ar" : "en")}
                className="cursor-pointer ml-4 px-3 py-1 rounded-full transition-colors"
                style={{
                  color: navConfig.colors.text,
                  borderColor: `${navConfig.colors.text}33`,
                  borderWidth: '1px'
                }}
              >
                {locale === "en" ? "العربية" : "English"}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setLocale(locale === "en" ? "ar" : "en")}
                className="cursor-pointer px-2 py-1 text-sm rounded border transition-colors"
                style={{
                  color: navConfig.colors.text,
                  borderColor: `${navConfig.colors.text}33`
                }}
              >
                {locale === "en" ? "AR" : "EN"}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="cursor-pointer p-2" style={{ color: navConfig.colors.text }}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-t animate-in slide-in-from-${dir === "rtl" ? "right" : "left"}`}
            style={{
              backgroundColor: navConfig.colors.background,
              borderColor: `${navConfig.colors.text}33`
            }}
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.anchor)}
                  className="cursor-pointer block px-4 py-2 rounded transition-colors"
                  style={{
                    color: navConfig.colors.text,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${navConfig.colors.hover}33`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t" style={{ borderColor: `${navConfig.colors.text}33` }}>
                <Link href="/contact" className="cursor-pointer block">
                  <Button 
                    className="w-full font-semibold transition-colors cursor-pointer"
                    style={{
                      backgroundColor: navConfig.colors.accent,
                      color: navConfig.colors.background
                    }}
                  >
                    {navConfig.cta[locale]}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
