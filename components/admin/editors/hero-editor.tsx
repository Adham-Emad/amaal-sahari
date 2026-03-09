"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Video } from "lucide-react"
import FileUpload from "../file-upload"

export default function HeroEditor() {
  const { content, updateSection } = useContent()
  const [hero, setHero] = useState(content.hero)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setHero(content.hero)
  }, [content.hero])

  const handleSave = () => {
    updateSection("hero", hero)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hero Section</h2>
          <p className="text-muted-foreground">Edit the main hero banner content</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Video Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Background Video
          </CardTitle>
          <CardDescription>Upload or paste URL for the hero background video</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            label="Hero Background Video"
            description="Supported formats: MP4, WebM (Max 50MB)"
            value={hero.videoUrl}
            onChange={(url) => setHero({ ...hero, videoUrl: url })}
            accept="video/*"
            fileType="video"
          />
        </CardContent>
      </Card>

      {/* Language Tabs */}
      <Tabs defaultValue="en" className="space-y-4">
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">Arabic</TabsTrigger>
        </TabsList>

        <TabsContent value="en">
          <Card>
            <CardHeader>
              <CardTitle>English Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="en-tagline">Tagline</Label>
                <Input
                  id="en-tagline"
                  value={hero.en.tagline}
                  onChange={(e) => setHero({ ...hero, en: { ...hero.en, tagline: e.target.value } })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="en-headline">Headline</Label>
                  <Input
                    id="en-headline"
                    value={hero.en.headline}
                    onChange={(e) => setHero({ ...hero, en: { ...hero.en, headline: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="en-highlighted">Highlighted Text</Label>
                  <Input
                    id="en-highlighted"
                    value={hero.en.highlightedText}
                    onChange={(e) => setHero({ ...hero, en: { ...hero.en, highlightedText: e.target.value } })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="en-subtitle">Subtitle</Label>
                <Textarea
                  id="en-subtitle"
                  value={hero.en.subtitle}
                  onChange={(e) => setHero({ ...hero, en: { ...hero.en, subtitle: e.target.value } })}
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="en-cta1">Primary Button</Label>
                  <Input
                    id="en-cta1"
                    value={hero.en.ctaPrimary}
                    onChange={(e) => setHero({ ...hero, en: { ...hero.en, ctaPrimary: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="en-cta2">Secondary Button</Label>
                  <Input
                    id="en-cta2"
                    value={hero.en.ctaSecondary}
                    onChange={(e) => setHero({ ...hero, en: { ...hero.en, ctaSecondary: e.target.value } })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ar">
          <Card>
            <CardHeader>
              <CardTitle>Arabic Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" dir="rtl">
              <div className="space-y-2">
                <Label htmlFor="ar-tagline">الشعار</Label>
                <Input
                  id="ar-tagline"
                  value={hero.ar.tagline}
                  onChange={(e) => setHero({ ...hero, ar: { ...hero.ar, tagline: e.target.value } })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ar-headline">العنوان الرئيسي</Label>
                  <Input
                    id="ar-headline"
                    value={hero.ar.headline}
                    onChange={(e) => setHero({ ...hero, ar: { ...hero.ar, headline: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ar-highlighted">النص المميز</Label>
                  <Input
                    id="ar-highlighted"
                    value={hero.ar.highlightedText}
                    onChange={(e) => setHero({ ...hero, ar: { ...hero.ar, highlightedText: e.target.value } })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ar-subtitle">العنوان الفرعي</Label>
                <Textarea
                  id="ar-subtitle"
                  value={hero.ar.subtitle}
                  onChange={(e) => setHero({ ...hero, ar: { ...hero.ar, subtitle: e.target.value } })}
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ar-cta1">الزر الرئيسي</Label>
                  <Input
                    id="ar-cta1"
                    value={hero.ar.ctaPrimary}
                    onChange={(e) => setHero({ ...hero, ar: { ...hero.ar, ctaPrimary: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ar-cta2">الزر الثانوي</Label>
                  <Input
                    id="ar-cta2"
                    value={hero.ar.ctaSecondary}
                    onChange={(e) => setHero({ ...hero, ar: { ...hero.ar, ctaSecondary: e.target.value } })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
