"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Globe } from "lucide-react"
import FileUpload from "../file-upload"

const STATIC_PAGES = [
  { slug: "",               label: "Home",           url: "/" },
  { slug: "about",          label: "About",          url: "/about" },
  { slug: "services",       label: "Services",       url: "/services" },
  { slug: "blog",           label: "Blog",           url: "/blog" },
  { slug: "news",           label: "News",           url: "/news" },
  { slug: "contact",        label: "Contact",        url: "/contact" },
  { slug: "careers",        label: "Careers",        url: "/careers" },
  { slug: "faqs",           label: "FAQs",           url: "/faqs" },
  { slug: "case-studies",   label: "Case Studies",   url: "/case-studies" },
  { slug: "privacy",        label: "Privacy Policy", url: "/privacy" },
  { slug: "terms",          label: "Terms of Service", url: "/terms" },
]

type PageSEOEntry = {
  id: string
  slug: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  canonicalUrl: string
  ogImage: string
  twitterCard: string
}

function blankEntry(slug: string): PageSEOEntry {
  return { id: slug || "home", slug, metaTitle: "", metaDescription: "", metaKeywords: "", canonicalUrl: "", ogImage: "", twitterCard: "" }
}

export default function SeoEditor() {
  const { content, updateSection } = useContent()
  const [seo, setSeo] = useState(content.seo)
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [selectedSlug, setSelectedSlug] = useState("")

  useEffect(() => {
    setSeo(content.seo)
  }, [content.seo])

  const handleSave = async () => {
    setSaveState("saving")
    try {
      const ok = await updateSection("seo", seo)
      if (ok) {
        setSaveState("saved")
        setTimeout(() => setSaveState("idle"), 3000)
      } else {
        setSaveState("error")
        setTimeout(() => setSaveState("idle"), 5000)
      }
    } catch {
      setSaveState("error")
      setTimeout(() => setSaveState("idle"), 5000)
    }
  }

  const getPageEntry = (slug: string): PageSEOEntry => {
    return seo.pages.find((p) => p.slug === slug) ?? blankEntry(slug)
  }

  const updatePage = (slug: string, field: keyof PageSEOEntry, value: string) => {
    const existing = seo.pages.find((p) => p.slug === slug)
    if (existing) {
      setSeo({
        ...seo,
        pages: seo.pages.map((p) => (p.slug === slug ? { ...p, [field]: value } : p)),
      })
    } else {
      const newEntry = { ...blankEntry(slug), [field]: value }
      setSeo({ ...seo, pages: [...seo.pages, newEntry] })
    }
  }

  const selectedPage = STATIC_PAGES.find((p) => p.slug === selectedSlug)!
  const entry = getPageEntry(selectedSlug)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">SEO Settings</h2>
        <Button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className={`gap-2 ${saveState === "error" ? "bg-red-600 hover:bg-red-700" : ""}`}
        >
          <Save className="w-4 h-4" />
          {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved!" : saveState === "error" ? "Save Failed — Retry" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General SEO</TabsTrigger>
          <TabsTrigger value="pages">Page SEO</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* ── GENERAL ── */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Meta Information</CardTitle>
              <CardDescription>These defaults apply to any page that doesn't have its own SEO settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta-title">Default Meta Title</Label>
                <Input
                  id="meta-title"
                  value={seo.general.defaultMetaTitle}
                  onChange={(e) =>
                    setSeo({ ...seo, general: { ...seo.general, defaultMetaTitle: e.target.value } })
                  }
                  placeholder="Page title for search engines"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-1">Max 60 characters</p>
              </div>

              <div>
                <Label htmlFor="meta-desc">Default Meta Description</Label>
                <Textarea
                  id="meta-desc"
                  value={seo.general.defaultMetaDescription}
                  onChange={(e) =>
                    setSeo({ ...seo, general: { ...seo.general, defaultMetaDescription: e.target.value } })
                  }
                  placeholder="Page description for search engines"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">Max 160 characters</p>
              </div>

              <div>
                <Label htmlFor="meta-keywords">Meta Keywords</Label>
                <Input
                  id="meta-keywords"
                  value={seo.general.metaKeywords}
                  onChange={(e) =>
                    setSeo({ ...seo, general: { ...seo.general, metaKeywords: e.target.value } })
                  }
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div>
                <FileUpload
                  label="Favicon"
                  description="Upload favicon image (ICO, PNG format)"
                  value={seo.general.faviconUrl}
                  onChange={(url) =>
                    setSeo({ ...seo, general: { ...seo.general, faviconUrl: url } })
                  }
                  accept="image/*"
                  fileType="image"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── PAGE SEO ── */}
        <TabsContent value="pages" className="space-y-6">
          <div className="flex gap-4">
            {/* Left: page list */}
            <div className="w-48 shrink-0 space-y-1">
              {STATIC_PAGES.map((page) => {
                const hasCustom = seo.pages.some(
                  (p) => p.slug === page.slug && (p.metaTitle || p.metaDescription || p.metaKeywords)
                )
                return (
                  <button
                    key={page.slug}
                    onClick={() => setSelectedSlug(page.slug)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between gap-2 transition-colors ${
                      selectedSlug === page.slug
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span>{page.label}</span>
                    {hasCustom && (
                      <Globe className="w-3 h-3 shrink-0 opacity-70" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Right: editor */}
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedPage ? `${selectedPage.label} — SEO` : "Select a page"}
                  </CardTitle>
                  {selectedPage && (
                    <CardDescription>
                      Overrides for <code className="text-xs">{selectedPage.url}</code>. Leave blank to use global defaults.
                    </CardDescription>
                  )}
                </CardHeader>

                {selectedPage ? (
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Meta Title</Label>
                      <Input
                        value={entry.metaTitle}
                        onChange={(e) => updatePage(selectedSlug, "metaTitle", e.target.value)}
                        placeholder={`e.g. ${selectedPage.label} | Amaal Sahari`}
                        maxLength={60}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.metaTitle.length}/60 characters
                      </p>
                    </div>

                    <div>
                      <Label>Meta Description</Label>
                      <Textarea
                        value={entry.metaDescription}
                        onChange={(e) => updatePage(selectedSlug, "metaDescription", e.target.value)}
                        placeholder="Brief description shown in search results"
                        maxLength={160}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {entry.metaDescription.length}/160 characters
                      </p>
                    </div>

                    <div>
                      <Label>Keywords</Label>
                      <Input
                        value={entry.metaKeywords}
                        onChange={(e) => updatePage(selectedSlug, "metaKeywords", e.target.value)}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>

                    <div>
                      <Label>Canonical URL <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Input
                        value={entry.canonicalUrl}
                        onChange={(e) => updatePage(selectedSlug, "canonicalUrl", e.target.value)}
                        placeholder={`https://amaalsahari.com${selectedPage.url}`}
                      />
                    </div>
                  </CardContent>
                ) : (
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Select a page from the list on the left to edit its SEO settings.
                    </p>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── INTEGRATIONS ── */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration IDs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="google-sc">Google Search Console ID</Label>
                <Input
                  id="google-sc"
                  value={seo.integrations.googleSearchConsoleId}
                  onChange={(e) =>
                    setSeo({ ...seo, integrations: { ...seo.integrations, googleSearchConsoleId: e.target.value } })
                  }
                  placeholder="Enter your Google Search Console verification ID"
                />
              </div>

              <div>
                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                <Input
                  id="google-analytics"
                  value={seo.integrations.googleAnalyticsId}
                  onChange={(e) =>
                    setSeo({ ...seo, integrations: { ...seo.integrations, googleAnalyticsId: e.target.value } })
                  }
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="google-gtm">Google Tag Manager ID</Label>
                <Input
                  id="google-gtm"
                  value={seo.integrations.googleTagManagerId}
                  onChange={(e) =>
                    setSeo({ ...seo, integrations: { ...seo.integrations, googleTagManagerId: e.target.value } })
                  }
                  placeholder="GTM-XXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
