"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Plus, Trash2, Image } from "lucide-react"
import FileUpload from "../file-upload"

export default function CaseStudiesEditor() {
  const { content, updateSection } = useContent()
  const [caseStudies, setCaseStudies] = useState(content.caseStudies)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setCaseStudies(content.caseStudies)
  }, [content.caseStudies])

  const handleSave = () => {
    updateSection("caseStudies", caseStudies)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addCaseStudy = () => {
    setCaseStudies({
      items: [
        ...caseStudies.items,
        {
          id: Date.now().toString(),
          imageUrl: "/placeholder.svg?height=400&width=600",
          en: { title: "New Case Study", description: "Description here", metrics: "Key metric", challenges: "", solution: "", results: "" },
          ar: { title: "دراسة حالة جديدة", description: "الوصف هنا", metrics: "المقياس الرئيسي", challenges: "", solution: "", results: "" },
        },
      ],
    })
  }

  const removeCaseStudy = (id: string) => {
    setCaseStudies({
      items: caseStudies.items.filter((item) => item.id !== id),
    })
  }

  const updateCaseStudy = (
    id: string,
    field: string,
    value: string,
    lang?: "en" | "ar"
  ) => {
    setCaseStudies({
      items: caseStudies.items.map((item) => {
        if (item.id !== id) return item
        if (lang) {
          return {
            ...item,
            [lang]: { ...item[lang], [field]: value },
          }
        }
        return { ...item, [field]: value }
      }),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Case Studies</h2>
          <p className="text-muted-foreground">Manage project case studies and success stories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addCaseStudy} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Case Study
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {caseStudies.items.map((caseStudy, index) => (
          <Card key={caseStudy.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <CardTitle className="text-lg">Case Study #{index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCaseStudy(caseStudy.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FileUpload
                  label="Case Study Image"
                  description="Upload image or paste URL"
                  value={caseStudy.imageUrl}
                  onChange={(url) => updateCaseStudy(caseStudy.id, "imageUrl", url)}
                  accept="image/*"
                  fileType="image"
                />
                {caseStudy.imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border bg-muted aspect-video max-w-xs">
                    <img
                      src={caseStudy.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <Tabs defaultValue="en" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">Arabic</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={caseStudy.en.title}
                      onChange={(e) => updateCaseStudy(caseStudy.id, "title", e.target.value, "en")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={caseStudy.en.description}
                      onChange={(e) => updateCaseStudy(caseStudy.id, "description", e.target.value, "en")}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Key Metrics</Label>
                    <Input
                      value={caseStudy.en.metrics}
                      onChange={(e) => updateCaseStudy(caseStudy.id, "metrics", e.target.value, "en")}
                      placeholder="e.g., 95% improvement"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="ar" className="space-y-4" dir="rtl">
                  <div className="space-y-2">
                    <Label>العنوان</Label>
                    <Input
                      value={caseStudy.ar.title}
                      onChange={(e) => updateCaseStudy(caseStudy.id, "title", e.target.value, "ar")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الوصف</Label>
                    <Textarea
                      value={caseStudy.ar.description}
                      onChange={(e) => updateCaseStudy(caseStudy.id, "description", e.target.value, "ar")}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>المقاييس الرئيسية</Label>
                    <Input
                      value={caseStudy.ar.metrics}
                      onChange={(e) => updateCaseStudy(caseStudy.id, "metrics", e.target.value, "ar")}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
