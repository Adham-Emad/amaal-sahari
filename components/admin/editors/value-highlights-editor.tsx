"use client"

import { useState } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import FileUpload from "../file-upload"

export default function ValueHighlightsEditor() {
  const { content, updateContent } = useContent()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addPillar = () => {
    const newPillar = {
      id: Date.now().toString(),
      imageUrl: "/images/placeholder.png",
      en: { title: "New Pillar", description: "Description" },
      ar: { title: "ركيزة جديدة", description: "الوصف" },
    }
    updateContent({
      ...content,
      valueHighlights: {
        ...content.valueHighlights,
        pillars: [...content.valueHighlights.pillars, newPillar],
      },
    })
  }

  const removePillar = (id: string) => {
    updateContent({
      ...content,
      valueHighlights: {
        ...content.valueHighlights,
        pillars: content.valueHighlights.pillars.filter((p) => p.id !== id),
      },
    })
  }

  const updatePillar = (id: string, field: string, value: string, locale?: "en" | "ar") => {
    updateContent({
      ...content,
      valueHighlights: {
        ...content.valueHighlights,
        pillars: content.valueHighlights.pillars.map((p) =>
          p.id === id
            ? locale
              ? { ...p, [locale]: { ...p[locale], [field]: value } }
              : { ...p, [field]: value }
            : p
        ),
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Value Highlights</h3>
          <p className="text-sm text-muted-foreground">Manage your business value pillars</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addPillar} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Pillar
          </Button>
          <Button onClick={handleSave} size="sm">
            <Save className="w-4 h-4 mr-2" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {content.valueHighlights.pillars.map((pillar) => (
          <Card key={pillar.id} className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Pillar #{pillar.id}</h4>
              <Button variant="destructive" size="sm" onClick={() => removePillar(pillar.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <FileUpload
                label="Pillar Image"
                description="Upload image or paste URL"
                value={pillar.imageUrl}
                onChange={(url) => updatePillar(pillar.id, "imageUrl", url)}
                accept="image/*"
                fileType="image"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title (English)</Label>
                <Input
                  value={pillar.en.title}
                  onChange={(e) => updatePillar(pillar.id, "title", e.target.value, "en")}
                />
              </div>
              <div>
                <Label>Title (Arabic)</Label>
                <Input
                  value={pillar.ar.title}
                  onChange={(e) => updatePillar(pillar.id, "title", e.target.value, "ar")}
                  className="text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Description (English)</Label>
                <Textarea
                  value={pillar.en.description}
                  onChange={(e) => updatePillar(pillar.id, "description", e.target.value, "en")}
                  rows={3}
                />
              </div>
              <div>
                <Label>Description (Arabic)</Label>
                <Textarea
                  value={pillar.ar.description}
                  onChange={(e) => updatePillar(pillar.id, "description", e.target.value, "ar")}
                  className="text-right"
                  dir="rtl"
                  rows={3}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
