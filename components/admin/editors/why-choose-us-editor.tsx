"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import FileUpload from "../file-upload"

export default function WhyChooseUsEditor() {
  const { content, updateSection } = useContent()
  const [whyChooseUs, setWhyChooseUs] = useState(content.whyChooseUs)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setWhyChooseUs(content.whyChooseUs)
  }, [content.whyChooseUs])

  const handleSave = () => {
    updateSection("whyChooseUs", whyChooseUs)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateImageUrl = (value: string) => {
    setWhyChooseUs({ ...whyChooseUs, imageUrl: value })
  }

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      en: { title: "New Feature", description: "Description" },
      ar: { title: "ميزة جديدة", description: "الوصف" },
    }
    setWhyChooseUs({
      ...whyChooseUs,
      items: [...whyChooseUs.items, newItem],
    })
  }

  const removeItem = (id: string) => {
    setWhyChooseUs({
      ...whyChooseUs,
      items: whyChooseUs.items.filter((i) => i.id !== id),
    })
  }

  const updateItem = (id: string, field: string, value: string, locale: "en" | "ar") => {
    setWhyChooseUs({
      ...whyChooseUs,
      items: whyChooseUs.items.map((item) =>
        item.id === id ? { ...item, [locale]: { ...item[locale], [field]: value } } : item
      ),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Why Choose Us Section</h3>
          <p className="text-sm text-muted-foreground">Manage your company's key features</p>
        </div>
        <Button onClick={handleSave} size="sm">
          <Save className="w-4 h-4 mr-2" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div>
        <FileUpload
          label="Section Image"
          description="Upload image or paste URL"
          value={whyChooseUs.imageUrl}
          onChange={(url) => updateImageUrl(url)}
          accept="image/*"
          fileType="image"
        />
      </div>

      <div className="flex justify-between items-center">
        <h4 className="font-medium">Features</h4>
        <Button onClick={addItem} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>

      <div className="space-y-4">
        {whyChooseUs.items.map((item) => (
          <Card key={item.id} className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Feature #{item.id}</h4>
              <Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title (English)</Label>
                <Input
                  value={item.en.title}
                  onChange={(e) => updateItem(item.id, "title", e.target.value, "en")}
                />
              </div>
              <div>
                <Label>Title (Arabic)</Label>
                <Input
                  value={item.ar.title}
                  onChange={(e) => updateItem(item.id, "title", e.target.value, "ar")}
                  className="text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Description (English)</Label>
                <Textarea
                  value={item.en.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value, "en")}
                  rows={2}
                />
              </div>
              <div>
                <Label>Description (Arabic)</Label>
                <Textarea
                  value={item.ar.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value, "ar")}
                  className="text-right"
                  dir="rtl"
                  rows={2}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
