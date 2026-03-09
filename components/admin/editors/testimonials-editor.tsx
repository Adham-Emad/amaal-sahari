"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Plus, Trash2, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FileUpload from "@/components/admin/file-upload"

export default function TestimonialsEditor() {
  const { content, updateSection } = useContent()
  const [testimonials, setTestimonials] = useState(content.testimonials)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setTestimonials(content.testimonials)
  }, [content.testimonials])

  const handleSave = () => {
    updateSection("testimonials", testimonials)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addTestimonial = () => {
    setTestimonials({
      items: [
        ...testimonials.items,
        {
          id: Date.now().toString(),
          rating: 5,
          image: "",
          en: { quote: "New testimonial quote", author: "Author Name", company: "Company Name" },
          ar: { quote: "اقتباس شهادة جديد", author: "اسم المؤلف", company: "اسم الشركة" },
        },
      ],
    })
  }

  const removeTestimonial = (id: string) => {
    setTestimonials({
      items: testimonials.items.filter((item) => item.id !== id),
    })
  }

  const updateTestimonial = (
    id: string,
    field: string,
    value: string | number,
    lang?: "en" | "ar"
  ) => {
    setTestimonials({
      items: testimonials.items.map((item) => {
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
          <h2 className="text-2xl font-bold">Testimonials</h2>
          <p className="text-muted-foreground">Manage customer testimonials and reviews</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addTestimonial} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Testimonial
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {testimonials.items.map((testimonial, index) => (
          <Card key={testimonial.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <CardTitle className="text-lg">Testimonial #{index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTestimonial(testimonial.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Label>Rating</Label>
                <Select
                  value={testimonial.rating.toString()}
                  onValueChange={(value) => updateTestimonial(testimonial.id, "rating", parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        <div className="flex items-center gap-1">
                          {rating} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <FileUpload
                  label="Client Image/Avatar"
                  description="Upload a profile image for the client (recommended: square image)"
                  value={testimonial.image || ""}
                  onChange={(url) => updateTestimonial(testimonial.id, "image", url)}
                  accept="image/*"
                  fileType="image"
                />
              </div>

              <Tabs defaultValue="en" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">Arabic</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quote</Label>
                    <Textarea
                      value={testimonial.en.quote}
                      onChange={(e) => updateTestimonial(testimonial.id, "quote", e.target.value, "en")}
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Author Name</Label>
                      <Input
                        value={testimonial.en.author}
                        onChange={(e) => updateTestimonial(testimonial.id, "author", e.target.value, "en")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={testimonial.en.company}
                        onChange={(e) => updateTestimonial(testimonial.id, "company", e.target.value, "en")}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ar" className="space-y-4" dir="rtl">
                  <div className="space-y-2">
                    <Label>الاقتباس</Label>
                    <Textarea
                      value={testimonial.ar.quote}
                      onChange={(e) => updateTestimonial(testimonial.id, "quote", e.target.value, "ar")}
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>اسم المؤلف</Label>
                      <Input
                        value={testimonial.ar.author}
                        onChange={(e) => updateTestimonial(testimonial.id, "author", e.target.value, "ar")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الشركة</Label>
                      <Input
                        value={testimonial.ar.company}
                        onChange={(e) => updateTestimonial(testimonial.id, "company", e.target.value, "ar")}
                      />
                    </div>
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
