"use client"

import { useState } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Trash2, Save, Image as ImageIcon, Video } from "lucide-react"
import FileUpload from "../file-upload"

type GalleryItem = NonNullable<SiteContent["gallery"]>["items"][number]
type Gallery = NonNullable<SiteContent["gallery"]>

export default function GalleryEditor() {
  const { content, updateSection } = useContent()
  const [gallery, setGallery] = useState<Gallery>(
    content.gallery || {
      en: { title: "Our Gallery", subtitle: "Explore our projects and facilities" },
      ar: { title: "معرض صورنا", subtitle: "استعرض مشاريعنا ومرافقنا" },
      items: [],
    }
  )
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateSection("gallery", gallery)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addItem = () => {
    const newItem: GalleryItem = {
      id: `gallery_${Date.now()}`,
      type: "image",
      url: "",
      thumbnailUrl: "",
      en: { title: "", description: "" },
      ar: { title: "", description: "" },
    }
    setGallery({ ...gallery, items: [...gallery.items, newItem] })
  }

  const updateItem = (id: string, field: "type" | "url" | "thumbnailUrl", value: string) => {
    setGallery({
      ...gallery,
      items: gallery.items.map((item) =>
        item.id !== id ? item : { ...item, [field]: value }
      ),
    })
  }

  const updateItemLang = (id: string, lang: "en" | "ar", field: "title" | "description", value: string) => {
    setGallery({
      ...gallery,
      items: gallery.items.map((item) =>
        item.id !== id ? item : { ...item, [lang]: { ...item[lang], [field]: value } }
      ),
    })
  }

  const removeItem = (id: string) => {
    setGallery({ ...gallery, items: gallery.items.filter((item) => item.id !== id) })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gallery</h2>
          <p className="text-muted-foreground">Manage images and videos shown in the gallery section</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Section Title */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery Section Title</CardTitle>
          <CardDescription>The heading and subtitle shown above the gallery grid</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <Label>English Title</Label>
              <Input
                value={gallery.en.title}
                onChange={(e) => setGallery({ ...gallery, en: { ...gallery.en, title: e.target.value } })}
                placeholder="Our Gallery"
              />
            </div>
            <div>
              <Label>English Subtitle</Label>
              <Input
                value={gallery.en.subtitle}
                onChange={(e) => setGallery({ ...gallery, en: { ...gallery.en, subtitle: e.target.value } })}
                placeholder="Explore our projects and facilities"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <Label>Arabic Title</Label>
              <Input
                value={gallery.ar.title}
                onChange={(e) => setGallery({ ...gallery, ar: { ...gallery.ar, title: e.target.value } })}
                placeholder="معرض صورنا"
                dir="rtl"
              />
            </div>
            <div>
              <Label>Arabic Subtitle</Label>
              <Input
                value={gallery.ar.subtitle}
                onChange={(e) => setGallery({ ...gallery, ar: { ...gallery.ar, subtitle: e.target.value } })}
                placeholder="استعرض مشاريعنا ومرافقنا"
                dir="rtl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Items */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gallery Items ({gallery.items.length})</h3>
        <Button onClick={addItem} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {gallery.items.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No gallery items yet. Click "Add Item" to start building your gallery.
          </CardContent>
        </Card>
      )}

      {gallery.items.map((item, index) => (
        <Card key={item.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.type === "video" ? (
                  <Video className="w-4 h-4 text-blue-500" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-green-500" />
                )}
                <CardTitle className="text-base">
                  {item.en.title || `Item ${index + 1}`}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Type + Upload */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Media Type</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={item.type === "image" ? "default" : "outline"}
                    onClick={() => updateItem(item.id, "type", "image")}
                    className="gap-1"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Image
                  </Button>
                  <Button
                    size="sm"
                    variant={item.type === "video" ? "default" : "outline"}
                    onClick={() => updateItem(item.id, "type", "video")}
                    className="gap-1"
                  >
                    <Video className="w-4 h-4" />
                    Video
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{item.type === "video" ? "Video URL / File" : "Image Upload"}</Label>
                {item.type === "image" ? (
                  <FileUpload
                    label="Upload Image"
                    value={item.url}
                    onChange={(url) => updateItem(item.id, "url", url)}
                    accept="image/*"
                    fileType="image"
                  />
                ) : (
                  <Input
                    value={item.url}
                    onChange={(e) => updateItem(item.id, "url", e.target.value)}
                    placeholder="https://youtube.com/embed/... or direct video URL"
                  />
                )}
              </div>
            </div>

            {/* Thumbnail (for videos) */}
            {item.type === "video" && (
              <div className="space-y-2">
                <Label>Thumbnail Image (optional)</Label>
                <FileUpload
                  label="Upload Thumbnail"
                  value={item.thumbnailUrl || ""}
                  onChange={(url) => updateItem(item.id, "thumbnailUrl", url)}
                  accept="image/*"
                  fileType="image"
                />
              </div>
            )}

            {/* Titles & Descriptions */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">English</h4>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={item.en.title}
                    onChange={(e) => updateItemLang(item.id, "en", "title", e.target.value)}
                    placeholder="Gallery item title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={item.en.description}
                    onChange={(e) => updateItemLang(item.id, "en", "description", e.target.value)}
                    placeholder="Short description..."
                    rows={2}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Arabic</h4>
                <div>
                  <Label>العنوان</Label>
                  <Input
                    value={item.ar.title}
                    onChange={(e) => updateItemLang(item.id, "ar", "title", e.target.value)}
                    placeholder="عنوان العنصر"
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label>الوصف</Label>
                  <Textarea
                    value={item.ar.description}
                    onChange={(e) => updateItemLang(item.id, "ar", "description", e.target.value)}
                    placeholder="وصف قصير..."
                    rows={2}
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {gallery.items.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save All Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
