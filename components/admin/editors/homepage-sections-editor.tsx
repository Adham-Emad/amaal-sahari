"use client"

import { useState, useEffect } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Save, Eye, EyeOff, Info, Video } from "lucide-react"

export default function HomepageSectionsEditor() {
  const { content, updateSection } = useContent()
  const [sections, setSections] = useState<SiteContent["homepageSections"]>(content.homepageSections)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSections(content.homepageSections)
  }, [content.homepageSections])

  const genericSections = [
    { key: "valueHighlights", label: "Value Highlights", description: "Controls the Value Pillars section heading and subtitle. Edit the pillar cards in the Value Highlights tab." },
    { key: "kpis", label: "KPIs / Stats", description: "Controls the 'By The Numbers' statistics section. Edit KPI values in the KPIs tab." },
    { key: "services", label: "Services Carousel", description: "Controls the services carousel section heading and subtitle. Edit individual service cards in the Services tab." },
    { key: "projects", label: "Case Studies & Projects", description: "Controls the case studies section heading and subtitle. Edit case study cards in the Case Studies tab." },
    { key: "whyChooseUs", label: "Why Choose Us", description: "Controls the 'Why Choose Us' section heading and subtitle. Edit feature items in the Why Choose Us tab." },
    { key: "testimonials", label: "Testimonials", description: "Controls the testimonials section heading and subtitle. Edit individual testimonials in the Testimonials tab." },
    { key: "news", label: "Latest News", description: "Controls the news section heading and subtitle. Edit news articles in the News tab." },
  ] as const

  const handleSectionToggle = (key: keyof SiteContent["homepageSections"]) => {
    setSections({
      ...sections,
      [key]: {
        ...sections[key],
        visible: !sections[key].visible,
      },
    })
  }

  const handleFieldChange = (
    key: keyof SiteContent["homepageSections"],
    locale: "en" | "ar",
    field: string,
    value: string
  ) => {
    setSections({
      ...sections,
      [key]: {
        ...sections[key],
        [locale]: {
          ...(sections[key] as any)[locale],
          [field]: value,
        },
      },
    })
  }

  const handleVideoUrlChange = (value: string) => {
    setSections({
      ...sections,
      servicesVideo: {
        ...sections.servicesVideo,
        videoUrl: value,
      },
    })
  }

  const handleSave = () => {
    updateSection("homepageSections", sections)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sv = sections.servicesVideo

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Homepage Sections</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Control visibility, titles, subtitles, and section-specific settings for each section on the home page.
          </p>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white flex gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* ─── SERVICES VIDEO (special card with extra fields) ─── */}
      <Card className="bg-white border-primary/20">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" />
              Services Video Section
            </CardTitle>
            <CardDescription className="flex items-start gap-1.5 text-xs">
              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              The full-screen hero video section on the home page. Edit title, subtitle, button labels, and background video URL.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Label className="flex items-center gap-2 cursor-pointer">
              <Switch
                checked={sv.visible}
                onCheckedChange={() => handleSectionToggle("servicesVideo")}
              />
              {sv.visible ? (
                <Eye className="w-4 h-4 text-green-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </Label>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Background Video URL */}
          <div className="space-y-2">
            <Label>Background Video URL</Label>
            <Input
              value={sv.videoUrl || ""}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              placeholder="https://example.com/video.mp4"
            />
            <p className="text-xs text-muted-foreground">
              Direct link to an MP4 video file. Leave blank to keep the current video.
            </p>
          </div>

          {/* Titles */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Section Title</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sv-en-title" className="text-xs text-muted-foreground">English</Label>
                <Input
                  id="sv-en-title"
                  value={sv.en.title}
                  onChange={(e) => handleFieldChange("servicesVideo", "en", "title", e.target.value)}
                  placeholder="Enter English title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sv-ar-title" className="text-xs text-muted-foreground">Arabic</Label>
                <Input
                  id="sv-ar-title"
                  value={sv.ar.title}
                  onChange={(e) => handleFieldChange("servicesVideo", "ar", "title", e.target.value)}
                  placeholder="أدخل العنوان بالعربية"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Subtitles */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Section Subtitle</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sv-en-subtitle" className="text-xs text-muted-foreground">English</Label>
                <Input
                  id="sv-en-subtitle"
                  value={sv.en.subtitle || ""}
                  onChange={(e) => handleFieldChange("servicesVideo", "en", "subtitle", e.target.value)}
                  placeholder="Enter English subtitle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sv-ar-subtitle" className="text-xs text-muted-foreground">Arabic</Label>
                <Input
                  id="sv-ar-subtitle"
                  value={sv.ar.subtitle || ""}
                  onChange={(e) => handleFieldChange("servicesVideo", "ar", "subtitle", e.target.value)}
                  placeholder="أدخل العنوان الفرعي بالعربية"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* CTA 1 */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Primary Button (CTA 1)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sv-en-cta1" className="text-xs text-muted-foreground">English Label</Label>
                <Input
                  id="sv-en-cta1"
                  value={sv.en.cta1 || ""}
                  onChange={(e) => handleFieldChange("servicesVideo", "en", "cta1", e.target.value)}
                  placeholder="e.g. Get a Free Quote"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sv-ar-cta1" className="text-xs text-muted-foreground">Arabic Label</Label>
                <Input
                  id="sv-ar-cta1"
                  value={sv.ar.cta1 || ""}
                  onChange={(e) => handleFieldChange("servicesVideo", "ar", "cta1", e.target.value)}
                  placeholder="مثال: احصل على عرض مجاني"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* CTA 2 */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Secondary Button (CTA 2)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sv-en-cta2" className="text-xs text-muted-foreground">English Label</Label>
                <Input
                  id="sv-en-cta2"
                  value={sv.en.cta2 || ""}
                  onChange={(e) => handleFieldChange("servicesVideo", "en", "cta2", e.target.value)}
                  placeholder="e.g. Explore Services"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sv-ar-cta2" className="text-xs text-muted-foreground">Arabic Label</Label>
                <Input
                  id="sv-ar-cta2"
                  value={sv.ar.cta2 || ""}
                  onChange={(e) => handleFieldChange("servicesVideo", "ar", "cta2", e.target.value)}
                  placeholder="مثال: استكشف الخدمات"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── OTHER GENERIC SECTIONS ─── */}
      <div className="grid gap-6">
        {genericSections.map(({ key, label, description }) => {
          const section = sections[key]
          return (
            <Card key={key} className="bg-white">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{label}</CardTitle>
                  <CardDescription className="flex items-start gap-1.5 text-xs">
                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={section.visible}
                      onCheckedChange={() => handleSectionToggle(key)}
                    />
                    {section.visible ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </Label>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${key}-en-title`}>English Title</Label>
                    <Input
                      id={`${key}-en-title`}
                      value={section.en.title}
                      onChange={(e) => handleFieldChange(key, "en", "title", e.target.value)}
                      placeholder="Enter English title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${key}-ar-title`}>Arabic Title</Label>
                    <Input
                      id={`${key}-ar-title`}
                      value={section.ar.title}
                      onChange={(e) => handleFieldChange(key, "ar", "title", e.target.value)}
                      placeholder="أدخل العنوان بالعربية"
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${key}-en-subtitle`}>English Subtitle</Label>
                    <Input
                      id={`${key}-en-subtitle`}
                      value={section.en.subtitle || ""}
                      onChange={(e) => handleFieldChange(key, "en", "subtitle", e.target.value)}
                      placeholder="Enter English subtitle"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${key}-ar-subtitle`}>Arabic Subtitle</Label>
                    <Input
                      id={`${key}-ar-subtitle`}
                      value={section.ar.subtitle || ""}
                      onChange={(e) => handleFieldChange(key, "ar", "subtitle", e.target.value)}
                      placeholder="أدخل العنوان الفرعي بالعربية"
                      dir="rtl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
