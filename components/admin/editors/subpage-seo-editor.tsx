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

export default function SubpageSeoEditor() {
  const { content, updateSection } = useContent()
  const [services, setServices] = useState(content.services)
  const [saved, setSaved] = useState(false)
  const [selectedService, setSelectedService] = useState(services.items[0]?.id || "")

  useEffect(() => {
    setServices(content.services)
  }, [content.services])

  const currentService = services.items.find((s) => s.id === selectedService)

  const handleUpdateService = (field: string, locale: string, value: string) => {
    setServices({
      ...services,
      items: services.items.map((service) =>
        service.id === selectedService
          ? {
              ...service,
              [locale]: {
                ...service[locale],
                [field]: value,
              },
            }
          : service
      ),
    })
  }

  const handleUpdateMeta = (field: string, locale: string, value: string) => {
    setServices({
      ...services,
      items: services.items.map((service) =>
        service.id === selectedService
          ? {
              ...service,
              seo: {
                ...service.seo,
                [locale]: {
                  ...service.seo?.[locale] || {},
                  [field]: value,
                },
              },
            }
          : service
      ),
    })
  }

  const handleSave = () => {
    updateSection("services", services)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!currentService) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No services found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subpage SEO Settings</h2>
          <p className="text-sm text-gray-600">Manage SEO for individual service pages</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Service Page</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {services.items.map((service) => (
              <option key={service.id} value={service.id}>
                {service.en.title} / {service.ar.title}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      <Tabs defaultValue="english" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="arabic">العربية</TabsTrigger>
        </TabsList>

        <TabsContent value="english" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="en-title">Title</Label>
                <Input
                  id="en-title"
                  value={currentService.en.title}
                  onChange={(e) => handleUpdateService("title", "en", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="en-description">Short Description</Label>
                <Textarea
                  id="en-description"
                  value={currentService.en.description}
                  onChange={(e) => handleUpdateService("description", "en", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="en-content">Detailed Content</Label>
                <Textarea
                  id="en-content"
                  value={currentService.en.detailedContent || ""}
                  onChange={(e) => handleUpdateService("detailedContent", "en", e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Metadata (English)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="en-meta-title">Meta Title (60 chars max)</Label>
                <Input
                  id="en-meta-title"
                  maxLength={60}
                  value={currentService.seo?.en?.metaTitle || ""}
                  onChange={(e) => handleUpdateMeta("metaTitle", "en", e.target.value)}
                  placeholder="Page title for search results"
                />
                <span className="text-xs text-gray-500">
                  {currentService.seo?.en?.metaTitle?.length || 0}/60
                </span>
              </div>

              <div>
                <Label htmlFor="en-meta-desc">Meta Description (160 chars max)</Label>
                <Textarea
                  id="en-meta-desc"
                  maxLength={160}
                  value={currentService.seo?.en?.metaDescription || ""}
                  onChange={(e) => handleUpdateMeta("metaDescription", "en", e.target.value)}
                  placeholder="Page description for search results"
                  rows={3}
                />
                <span className="text-xs text-gray-500">
                  {currentService.seo?.en?.metaDescription?.length || 0}/160
                </span>
              </div>

              <div>
                <Label htmlFor="en-keywords">Keywords</Label>
                <Input
                  id="en-keywords"
                  value={currentService.seo?.en?.keywords || ""}
                  onChange={(e) => handleUpdateMeta("keywords", "en", e.target.value)}
                  placeholder="Comma-separated keywords"
                />
              </div>

              <div>
                <Label htmlFor="en-slug">URL Slug</Label>
                <Input
                  id="en-slug"
                  value={currentService.slug}
                  onChange={(e) => 
                    setServices({
                      ...services,
                      items: services.items.map((s) =>
                        s.id === selectedService ? { ...s, slug: e.target.value } : s
                      ),
                    })
                  }
                  placeholder="e.g., housekeeping-services"
                />
              </div>

              <div>
                <Label htmlFor="en-og-title">OG Title (Social Media)</Label>
                <Input
                  id="en-og-title"
                  value={currentService.seo?.en?.ogTitle || ""}
                  onChange={(e) => handleUpdateMeta("ogTitle", "en", e.target.value)}
                  placeholder="How it appears on social media"
                />
              </div>

              <div>
                <Label htmlFor="en-og-desc">OG Description (Social Media)</Label>
                <Textarea
                  id="en-og-desc"
                  value={currentService.seo?.en?.ogDescription || ""}
                  onChange={(e) => handleUpdateMeta("ogDescription", "en", e.target.value)}
                  placeholder="Description for social media sharing"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arabic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>محتوى الصفحة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ar-title">العنوان</Label>
                <Input
                  id="ar-title"
                  value={currentService.ar.title}
                  onChange={(e) => handleUpdateService("title", "ar", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ar-description">الوصف القصير</Label>
                <Textarea
                  id="ar-description"
                  value={currentService.ar.description}
                  onChange={(e) => handleUpdateService("description", "ar", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ar-content">المحتوى المفصل</Label>
                <Textarea
                  id="ar-content"
                  value={currentService.ar.detailedContent || ""}
                  onChange={(e) => handleUpdateService("detailedContent", "ar", e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>بيانات SEO (العربية)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ar-meta-title">عنوان Meta (60 حرف كحد أقصى)</Label>
                <Input
                  id="ar-meta-title"
                  maxLength={60}
                  value={currentService.seo?.ar?.metaTitle || ""}
                  onChange={(e) => handleUpdateMeta("metaTitle", "ar", e.target.value)}
                  placeholder="عنوان الصفحة لنتائج البحث"
                />
                <span className="text-xs text-gray-500">
                  {currentService.seo?.ar?.metaTitle?.length || 0}/60
                </span>
              </div>

              <div>
                <Label htmlFor="ar-meta-desc">وصف Meta (160 حرف كحد أقصى)</Label>
                <Textarea
                  id="ar-meta-desc"
                  maxLength={160}
                  value={currentService.seo?.ar?.metaDescription || ""}
                  onChange={(e) => handleUpdateMeta("metaDescription", "ar", e.target.value)}
                  placeholder="وصف الصفحة لنتائج البحث"
                  rows={3}
                />
                <span className="text-xs text-gray-500">
                  {currentService.seo?.ar?.metaDescription?.length || 0}/160
                </span>
              </div>

              <div>
                <Label htmlFor="ar-keywords">الكلمات المفتاحية</Label>
                <Input
                  id="ar-keywords"
                  value={currentService.seo?.ar?.keywords || ""}
                  onChange={(e) => handleUpdateMeta("keywords", "ar", e.target.value)}
                  placeholder="كلمات مفصولة بفواصل"
                />
              </div>

              <div>
                <Label htmlFor="ar-og-title">عنوان OG (وسائل التواصل)</Label>
                <Input
                  id="ar-og-title"
                  value={currentService.seo?.ar?.ogTitle || ""}
                  onChange={(e) => handleUpdateMeta("ogTitle", "ar", e.target.value)}
                  placeholder="كيف يظهر على وسائل التواصل الاجتماعي"
                />
              </div>

              <div>
                <Label htmlFor="ar-og-desc">وصف OG (وسائل التواصل)</Label>
                <Textarea
                  id="ar-og-desc"
                  value={currentService.seo?.ar?.ogDescription || ""}
                  onChange={(e) => handleUpdateMeta("ogDescription", "ar", e.target.value)}
                  placeholder="الوصف لمشاركة وسائل التواصل الاجتماعي"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
