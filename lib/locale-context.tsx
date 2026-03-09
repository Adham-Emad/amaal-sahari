"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Locale } from "./i18n"

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  dir: "ltr" | "rtl"
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get saved locale from localStorage
    const saved = localStorage.getItem("locale") as Locale | null
    const initial = saved || "en"
    setLocaleState(initial)

    // Update document attributes
    document.documentElement.lang = initial
    document.documentElement.dir = initial === "ar" ? "rtl" : "ltr"
    document.documentElement.setAttribute("data-locale", initial)

    setMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
    document.documentElement.lang = newLocale
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr"
    document.documentElement.setAttribute("data-locale", newLocale)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dir: locale === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider")
  }
  return context
}
