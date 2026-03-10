"use client"

import { useState, useEffect } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Save, Eye, EyeOff, Info } from "lucide-react"

export default function HomepageSectionsEditor() {
  const { content, updateSection } = useContent()
  const [sections, setSections] = useState<SiteContent["homepageSections"]>(content.homepageSections)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSections(content.homepageSections)
  }, [content.homepageSections])

  const sectionsList = [
    { key: "valueHighlights", label: "Value Highlights", description: "Controls the Value Pillars section heading and subtitle on the home page. Edit the pillar cards themselves in the Value Highlights tab." },
    { key: "servicesVideo", label: "Services Video", description: "Controls the services video section heading and subtitle on the home page." },
    { key: "kpis", label: "KPIs / Stats", description: "Controls the 'By The Numbers' statistics section heading and subtitle. Edit the actual KPI values in the KPIs tab." },
    { key: "services", label: "Services Carousel", description: "Controls the services carousel section heading and subtitle on the home page. Edit individual service cards in the Services tab, and detail page content in the Service Details tab." },
    { key: "projects", label: "Case Studies & Projects", description: "Controls the case studies section heading and subtitle. Edit case study cards in the Case Studies tab, and detail content in Case Studies Details tab." },
    { key: "whyChooseUs", label: "Why Choose Us", description: "Controls the 'Why Choose Us' section heading and subtitle. Edit the feature items in the Why Choose Us tab." },
    { key: "testimonials", label: "Testimonials", description: "Controls the testimonials section heading and subtitle. Edit individual testimonials in the Testimonials tab." },
    { key: "news", label: "Latest News", description: "Controls the news section heading and subtitle on the home page. Edit news articles in the News tab." },
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
    field: "title" | "subtitle",
    value: string
  ) => {
    setSections({
      ...sections,
      [key]: {
        ...sections[key],
        [locale]: {
          ...sections[key][locale],
          [field]: value,
        },
      },
    })
  }

  const handleSave = () => {
    updateSection("homepageSections", sections)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Homepage Sections</h2>
          <p className="text-sm text-muted-foreground mt-1">Control visibility, titles, and subtitles for each section on the home page. Use the individual tabs (Services, KPIs, etc.) to edit the section content itself.</p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-white flex gap-2"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {sectionsList.map(({ key, label, description }) => {
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
