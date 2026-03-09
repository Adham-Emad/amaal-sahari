"use client"

import { useState } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface PrivacyPolicyContent {
  title: {
    en: string
    ar: string
  }
  lastUpdated: {
    en: string
    ar: string
  }
  sections: Array<{
    id: string
    title: {
      en: string
      ar: string
    }
    content: {
      en: string
      ar: string
    }
  }>
}

export default function PrivacyPolicyEditor() {
  const { content, updateContent } = useContent()
  const [formData, setFormData] = useState<PrivacyPolicyContent>(
    content.privacyPolicy || {
      title: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
      lastUpdated: { en: "Last Updated: November 2025", ar: "آخر تحديث: نوفمبر 2025" },
      sections: []
    }
  )

  const handleTitleChange = (lang: "en" | "ar", value: string) => {
    setFormData({
      ...formData,
      title: { ...formData.title, [lang]: value }
    })
  }

  const handleLastUpdatedChange = (lang: "en" | "ar", value: string) => {
    setFormData({
      ...formData,
      lastUpdated: { ...formData.lastUpdated, [lang]: value }
    })
  }

  const handleSectionChange = (index: number, field: string, lang: string, value: string) => {
    const newSections = [...formData.sections]
    if (field === "title") {
      newSections[index].title = { ...newSections[index].title, [lang]: value }
    } else if (field === "content") {
      newSections[index].content = { ...newSections[index].content, [lang]: value }
    }
    setFormData({ ...formData, sections: newSections })
  }

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          id: `section-${Date.now()}`,
          title: { en: "", ar: "" },
          content: { en: "", ar: "" }
        }
      ]
    })
  }

  const removeSection = (index: number) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, i) => i !== index)
    })
  }

  const handleSave = () => {
    updateContent({ privacyPolicy: formData })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title-en">Title (English)</Label>
              <Input
                id="title-en"
                value={formData.title.en}
                onChange={(e) => handleTitleChange("en", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="title-ar">Title (Arabic)</Label>
              <Input
                id="title-ar"
                value={formData.title.ar}
                onChange={(e) => handleTitleChange("ar", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="updated-en">Last Updated (English)</Label>
              <Input
                id="updated-en"
                value={formData.lastUpdated.en}
                onChange={(e) => handleLastUpdatedChange("en", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="updated-ar">Last Updated (Arabic)</Label>
              <Input
                id="updated-ar"
                value={formData.lastUpdated.ar}
                onChange={(e) => handleLastUpdatedChange("ar", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Sections</h3>
          <Button onClick={addSection} variant="outline">
            Add Section
          </Button>
        </div>

        {formData.sections.map((section, index) => (
          <Card key={section.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Section Title (English)</Label>
                  <Input
                    value={section.title.en}
                    onChange={(e) => handleSectionChange(index, "title", "en", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Section Title (Arabic)</Label>
                  <Input
                    value={section.title.ar}
                    onChange={(e) => handleSectionChange(index, "title", "ar", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Content (English)</Label>
                  <Textarea
                    value={section.content.en}
                    onChange={(e) => handleSectionChange(index, "content", "en", e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Content (Arabic)</Label>
                  <Textarea
                    value={section.content.ar}
                    onChange={(e) => handleSectionChange(index, "content", "ar", e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <Button
                onClick={() => removeSection(index)}
                variant="destructive"
                size="sm"
              >
                Remove Section
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Privacy Policy
      </Button>
    </div>
  )
}
