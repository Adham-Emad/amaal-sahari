"use client"

import { useState, useEffect } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import FileUpload from "../file-upload"

export default function ServicesEditor() {
  const { content, updateSection } = useContent()
  const [services, setServices] = useState<SiteContent["services"]>(content.services)
  const [saved, setSaved] = useState(false)

  // Sync local state when context changes
  useEffect(() => {
    setServices(content.services)
  }, [content.services])

  const handleSave = () => {
    updateSection("services", services)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateService = (id: string, field: string, value: string, lang?: "en" | "ar") => {
    setServices({
      ...services,
      items: services.items.map((s) =>
        s.id === id
          ? lang
            ? { ...s, [lang]: { ...s[lang], [field]: value } }
            : { ...s, [field]: value }
          : s
      ),
    })
  }

  const addService = () => {
    const newId = Date.now().toString()
    setServices({
      ...services,
      items: [
        ...services.items,
        {
          id: newId,
          slug: "new-service",
          imageUrl: "/placeholder.svg",
          en: { title: "", description: "" },
          ar: { title: "", description: "" },
        },
      ],
    })
  }

  const removeService = (id: string) => {
    setServices({
      ...services,
      items: services.items.filter((s) => s.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2F683E]">Services Editor</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addService}>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
          <Button onClick={handleSave} className="bg-[#2F683E] hover:bg-[#2F683E]/90">
            <Save className="w-4 h-4 mr-2" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.items.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{service.en.title || "New Service"}</span>
                <Button variant="ghost" size="icon" onClick={() => removeService(service.id)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={service.slug}
                    onChange={(e) => updateService(service.id, "slug", e.target.value)}
                  />
                </div>
                <FileUpload
                  label="Service Image"
                  description="Upload image or paste URL"
                  value={service.imageUrl}
                  onChange={(url) => updateService(service.id, "imageUrl", url)}
                  accept="image/*"
                  fileType="image"
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">English</h4>
                <Input
                  placeholder="Title"
                  value={service.en.title}
                  onChange={(e) => updateService(service.id, "title", e.target.value, "en")}
                />
                <Textarea
                  placeholder="Description"
                  value={service.en.description}
                  onChange={(e) => updateService(service.id, "description", e.target.value, "en")}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Arabic</h4>
                <Input
                  placeholder="Title"
                  value={service.ar.title}
                  onChange={(e) => updateService(service.id, "title", e.target.value, "ar")}
                  dir="rtl"
                />
                <Textarea
                  placeholder="Description"
                  value={service.ar.description}
                  onChange={(e) => updateService(service.id, "description", e.target.value, "ar")}
                  rows={2}
                  dir="rtl"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
