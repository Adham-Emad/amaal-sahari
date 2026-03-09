"use client"

import { useState, useEffect } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Save, Eye, EyeOff } from "lucide-react"

export default function HomepageSectionsEditor() {
  const { content, updateSection } = useContent()
  const [sections, setSections] = useState<SiteContent["homepageSections"]>(content.homepageSections)
  const [saved, setSaved] = useState(false)

  // Sync local state when context changes
  useEffect(() => {
    setSections(content.homepageSections)
  }, [content.homepageSections])

  const sectionsList = [
    { key: "valueHighlights", label: "Value Highlights" },
    { key: "servicesVideo", label: "Services Video" },
    { key: "kpis", label: "KPIs" },
    { key: "services", label: "Services" },
    { key: "projects", label: "Projects & Case Studies" },
    { key: "whyChooseUs", label: "Why Choose Us" },
    { key: "testimonials", label: "Testimonials" },
    { key: "news", label: "News" },
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

  const handleTitleChange = (
    key: keyof SiteContent["homepageSections"],
    locale: "en" | "ar",
    value: string
  ) => {
    setSections({
      ...sections,
      [key]: {
        ...sections[key],
        [locale]: {
          ...sections[key][locale],
          title: value,
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
        <h2 className="text-3xl font-bold text-foreground">Homepage Sections</h2>
        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-white flex gap-2"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {sectionsList.map(({ key, label }) => {
          const section = sections[key]
          return (
            <Card key={key} className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{label}</CardTitle>
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
                    <Label htmlFor={`${key}-en`}>English Title</Label>
                    <Input
                      id={`${key}-en`}
                      value={section.en.title}
                      onChange={(e) =>
                        handleTitleChange(key, "en", e.target.value)
                      }
                      placeholder="Enter English title"
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${key}-ar`}>Arabic Title</Label>
                    <Input
                      id={`${key}-ar`}
                      value={section.ar.title}
                      onChange={(e) =>
                        handleTitleChange(key, "ar", e.target.value)
                      }
                      placeholder="أدخل العنوان بالعربية"
                      className="cursor-pointer"
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
