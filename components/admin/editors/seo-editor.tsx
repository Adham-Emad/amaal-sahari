"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save } from "lucide-react"
import FileUpload from "../file-upload"

export default function SeoEditor() {
  const { content, updateSection } = useContent()
  const [seo, setSeo] = useState(content.seo)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSeo(content.seo)
  }, [content.seo])

  const handleSave = () => {
    updateSection("seo", seo)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">SEO Settings</h2>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General SEO</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta-title">Default Meta Title</Label>
                <Input
                  id="meta-title"
                  value={seo.general.defaultMetaTitle}
                  onChange={(e) =>
                    setSeo({
                      ...seo,
                      general: { ...seo.general, defaultMetaTitle: e.target.value },
                    })
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
                    setSeo({
                      ...seo,
                      general: { ...seo.general, defaultMetaDescription: e.target.value },
                    })
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
                    setSeo({
                      ...seo,
                      general: { ...seo.general, metaKeywords: e.target.value },
                    })
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
                    setSeo({
                      ...seo,
                      general: { ...seo.general, faviconUrl: url },
                    })
                  }
                  accept="image/*"
                  fileType="image"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                    setSeo({
                      ...seo,
                      integrations: { ...seo.integrations, googleSearchConsoleId: e.target.value },
                    })
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
                    setSeo({
                      ...seo,
                      integrations: { ...seo.integrations, googleAnalyticsId: e.target.value },
                    })
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
                    setSeo({
                      ...seo,
                      integrations: { ...seo.integrations, googleTagManagerId: e.target.value },
                    })
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
