"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save } from "lucide-react"

export default function SubpageSeoEditor() {
  const { content, updateSection } = useContent()
  const [mode, setMode] = useState<"services" | "case-studies">("services")

  // ── Services state ────────────────────────────────────────────────────────
  const [services, setServices] = useState(content.services)
  const [selectedService, setSelectedService] = useState(content.services.items[0]?.id || "")
  const [servicesSaved, setServicesSaved] = useState(false)

  useEffect(() => { setServices(content.services) }, [content.services])

  const currentService = services.items.find((s) => s.id === selectedService)

  const handleUpdateServiceMeta = (field: string, locale: string, value: string) => {
    setServices({
      ...services,
      items: services.items.map((s) =>
        s.id === selectedService
          ? { ...s, seo: { ...s.seo, [locale]: { ...s.seo?.[locale] ?? {}, [field]: value } } }
          : s
      ),
    })
  }

  const handleSaveServices = () => {
    updateSection("services", services)
    setServicesSaved(true)
    setTimeout(() => setServicesSaved(false), 2000)
  }

  // ── Case Studies state ────────────────────────────────────────────────────
  const [caseStudies, setCaseStudies] = useState(content.caseStudies)
  const [selectedCs, setSelectedCs] = useState(content.caseStudies.items[0]?.id || "")
  const [csSaved, setCsSaved] = useState(false)

  useEffect(() => { setCaseStudies(content.caseStudies) }, [content.caseStudies])

  const currentCs = caseStudies.items.find((c) => c.id === selectedCs)

  const handleUpdateCsMeta = (field: string, locale: string, value: string) => {
    setCaseStudies({
      ...caseStudies,
      items: caseStudies.items.map((c) =>
        c.id === selectedCs
          ? { ...c, seo: { ...c.seo, [locale]: { ...c.seo?.[locale] ?? {}, [field]: value } } }
          : c
      ),
    })
  }

  const handleSaveCaseStudies = () => {
    updateSection("caseStudies", caseStudies)
    setCsSaved(true)
    setTimeout(() => setCsSaved(false), 2000)
  }

  // ── Shared SEO field renderer ──────────────────────────────────────────────
  const renderSeoFields = (
    getVal: (field: string, locale: string) => string,
    setVal: (field: string, locale: string, value: string) => void
  ) => (
    <Tabs defaultValue="english" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="english">English</TabsTrigger>
        <TabsTrigger value="arabic">العربية</TabsTrigger>
      </TabsList>

      {(["english", "arabic"] as const).map((lang) => {
        const locale = lang === "english" ? "en" : "ar"
        const isAr = locale === "ar"
        return (
          <TabsContent key={lang} value={lang} className="space-y-4 mt-4">
            <div>
              <Label>{isAr ? "عنوان Meta" : "Meta Title"} <span className="text-muted-foreground text-xs">(60 {isAr ? "حرف كحد أقصى" : "chars max"})</span></Label>
              <Input
                maxLength={60}
                value={getVal("metaTitle", locale)}
                onChange={(e) => setVal("metaTitle", locale, e.target.value)}
                placeholder={isAr ? "عنوان الصفحة لنتائج البحث" : "Page title for search results"}
                dir={isAr ? "rtl" : "ltr"}
              />
              <p className="text-xs text-muted-foreground mt-1">{getVal("metaTitle", locale).length}/60</p>
            </div>

            <div>
              <Label>{isAr ? "وصف Meta" : "Meta Description"} <span className="text-muted-foreground text-xs">(160 {isAr ? "حرف كحد أقصى" : "chars max"})</span></Label>
              <Textarea
                maxLength={160}
                value={getVal("metaDescription", locale)}
                onChange={(e) => setVal("metaDescription", locale, e.target.value)}
                placeholder={isAr ? "وصف الصفحة لنتائج البحث" : "Page description for search results"}
                rows={3}
                dir={isAr ? "rtl" : "ltr"}
              />
              <p className="text-xs text-muted-foreground mt-1">{getVal("metaDescription", locale).length}/160</p>
            </div>

            <div>
              <Label>{isAr ? "الكلمات المفتاحية" : "Keywords"}</Label>
              <Input
                value={getVal("keywords", locale)}
                onChange={(e) => setVal("keywords", locale, e.target.value)}
                placeholder={isAr ? "كلمات مفصولة بفواصل" : "Comma-separated keywords"}
                dir={isAr ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <Label>{isAr ? "عنوان OG (وسائل التواصل)" : "OG Title (Social Media)"}</Label>
              <Input
                value={getVal("ogTitle", locale)}
                onChange={(e) => setVal("ogTitle", locale, e.target.value)}
                placeholder={isAr ? "كيف يظهر على وسائل التواصل الاجتماعي" : "How it appears on social media"}
                dir={isAr ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <Label>{isAr ? "وصف OG (وسائل التواصل)" : "OG Description (Social Media)"}</Label>
              <Textarea
                value={getVal("ogDescription", locale)}
                onChange={(e) => setVal("ogDescription", locale, e.target.value)}
                placeholder={isAr ? "الوصف لمشاركة وسائل التواصل الاجتماعي" : "Description for social media sharing"}
                rows={3}
                dir={isAr ? "rtl" : "ltr"}
              />
            </div>
          </TabsContent>
        )
      })}
    </Tabs>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subpage SEO Settings</h2>
          <p className="text-sm text-gray-600">Manage per-page SEO for services and case studies</p>
        </div>
        <Button
          onClick={mode === "services" ? handleSaveServices : handleSaveCaseStudies}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          {mode === "services"
            ? (servicesSaved ? "Saved!" : "Save Changes")
            : (csSaved ? "Saved!" : "Save Changes")}
        </Button>
      </div>

      {/* Mode switcher */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setMode("services")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "services" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
        >
          Services
        </button>
        <button
          onClick={() => setMode("case-studies")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "case-studies" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
        >
          Case Studies
        </button>
      </div>

      {/* ── SERVICES ── */}
      {mode === "services" && (
        <>
          <Card>
            <CardHeader><CardTitle>Select Service</CardTitle></CardHeader>
            <CardContent>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {services.items.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.en?.title} / {s.ar?.title}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {currentService && (
            <Card>
              <CardHeader>
                <CardTitle>{currentService.en?.title} — SEO</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSeoFields(
                  (field, locale) => currentService.seo?.[locale]?.[field] ?? "",
                  handleUpdateServiceMeta
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ── CASE STUDIES ── */}
      {mode === "case-studies" && (
        <>
          <Card>
            <CardHeader><CardTitle>Select Case Study</CardTitle></CardHeader>
            <CardContent>
              <select
                value={selectedCs}
                onChange={(e) => setSelectedCs(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {caseStudies.items.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.en?.title} / {c.ar?.title}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {currentCs && (
            <Card>
              <CardHeader>
                <CardTitle>{currentCs.en?.title} — SEO</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSeoFields(
                  (field, locale) => currentCs.seo?.[locale]?.[field] ?? "",
                  handleUpdateCsMeta
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
