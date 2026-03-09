"use client"

import { useState, useEffect } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, FileText, Image as ImageIcon } from "lucide-react"
import FileUpload from "../file-upload"

export default function ServiceDetailsEditor() {
  const { content, updateSection } = useContent()
  const [services, setServices] = useState<SiteContent["services"]>(content.services)
  const [saved, setSaved] = useState(false)

  // Sync local state when context changes
  useEffect(() => {
    setServices(content.services)
  }, [content.services])

  const updateService = (
    serviceId: string,
    updates: Record<string, any>
  ) => {
    setServices({
      ...services,
      items: services.items.map((service) =>
        service.id === serviceId
          ? { ...service, ...updates }
          : service
      ),
    })
  }

  const updateServiceContent = (
    serviceId: string,
    field: "en" | "ar",
    subfield: string,
    value: string
  ) => {
    setServices({
      ...services,
      items: services.items.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              [field]: {
                ...service[field],
                [subfield]: value,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Service Details Manager</h2>
          <p className="text-muted-foreground">Edit service titles, descriptions, images and detailed content</p>
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
        {services.items.map((service) => (
          <Card key={service.id} className="bg-white border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {service.en.title} / {service.ar.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Service Image */}
              <div className="space-y-3 border-b pb-6">
                <Label className="flex items-center gap-2 font-semibold">
                  <ImageIcon className="w-4 h-4" />
                  Service Image
                </Label>
                <FileUpload
                  label="Service Image"
                  description="Upload or paste URL for service image"
                  value={service.imageUrl}
                  onChange={(url) => updateService(service.id, { imageUrl: url })}
                  accept="image/*"
                  fileType="image"
                />
              </div>

              {/* Language Tabs */}
              <Tabs defaultValue="en" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">Arabic</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${service.id}-en-title`}>
                      Service Title
                    </Label>
                    <Input
                      id={`${service.id}-en-title`}
                      value={service.en.title}
                      onChange={(e) =>
                        updateServiceContent(
                          service.id,
                          "en",
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Enter service title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${service.id}-en-desc`}>
                      Short Description
                    </Label>
                    <Textarea
                      id={`${service.id}-en-desc`}
                      value={service.en.description}
                      onChange={(e) =>
                        updateServiceContent(
                          service.id,
                          "en",
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Enter short description (shown in service cards)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${service.id}-en-detail`}>
                      Detailed Content
                    </Label>
                    <Textarea
                      id={`${service.id}-en-detail`}
                      value={service.en.detailedContent || ""}
                      onChange={(e) =>
                        updateServiceContent(
                          service.id,
                          "en",
                          "detailedContent",
                          e.target.value
                        )
                      }
                      placeholder="Enter detailed service description, features, benefits, and specifications..."
                      rows={8}
                      className="resize-none"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="ar" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${service.id}-ar-title`}>
                      عنوان الخدمة
                    </Label>
                    <Input
                      id={`${service.id}-ar-title`}
                      value={service.ar.title}
                      onChange={(e) =>
                        updateServiceContent(
                          service.id,
                          "ar",
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="أدخل عنوان الخدمة"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${service.id}-ar-desc`}>
                      الوصف المختصر
                    </Label>
                    <Textarea
                      id={`${service.id}-ar-desc`}
                      value={service.ar.description}
                      onChange={(e) =>
                        updateServiceContent(
                          service.id,
                          "ar",
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="أدخل وصف الخدمة المختصر"
                      rows={3}
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${service.id}-ar-detail`}>
                      محتوى تفصيلي
                    </Label>
                    <Textarea
                      id={`${service.id}-ar-detail`}
                      value={service.ar.detailedContent || ""}
                      onChange={(e) =>
                        updateServiceContent(
                          service.id,
                          "ar",
                          "detailedContent",
                          e.target.value
                        )
                      }
                      placeholder="أدخل الوصف التفصيلي للخدمة والميزات والفوائد..."
                      rows={8}
                      className="resize-none"
                      dir="rtl"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.items.length === 0 && (
        <Card className="bg-gray-50 border-2 border-dashed">
          <CardContent className="py-8 text-center text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No services found. Add services from the Services Editor first.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
