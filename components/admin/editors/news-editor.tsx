"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save } from "lucide-react"
import FileUpload from "../file-upload"

export default function NewsEditor() {
  const { content, updateSection } = useContent()
  const [newsItems, setNewsItems] = useState(content.news.items)
  const [saved, setSaved] = useState(false)

  // Sync local state when context changes
  useEffect(() => {
    setNewsItems(content.news.items)
  }, [content.news.items])

  const handleSave = () => {
    console.log("[v0] Saving news items:", newsItems)
    updateSection("news", { items: newsItems })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addNews = () => {
    const newId = Math.max(...newsItems.map((n) => parseInt(n.id)), 0) + 1
    setNewsItems([
      ...newsItems,
      {
        id: newId.toString(),
        imageUrl: "",
        date: new Date().toISOString().split("T")[0],
        en: { title: "", excerpt: "", fullContent: "", author: "", category: "" },
        ar: { title: "", excerpt: "", fullContent: "", author: "", category: "" },
      },
    ])
  }

  const removeNews = (id: string) => {
    setNewsItems(newsItems.filter((n) => n.id !== id))
  }

  const updateNews = (id: string, field: string, value: string, language?: string) => {
    setNewsItems(
      newsItems.map((news) => {
        if (news.id === id) {
          if (language) {
            return { ...news, [language]: { ...news[language as keyof typeof news], [field]: value } }
          }
          return { ...news, [field]: value }
        }
        return news
      })
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>News Management</CardTitle>
          <div className="flex gap-2">
            <Button onClick={addNews} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add News
            </Button>
            <Button onClick={handleSave} size="sm" className="gap-2" variant={saved ? "default" : "outline"}>
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {newsItems.map((news) => (
              <Card key={news.id} className="border-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">News #{news.id}</CardTitle>
                    <Button
                      onClick={() => removeNews(news.id)}
                      size="sm"
                      variant="destructive"
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image and Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FileUpload
                      label="News Image"
                      description="Upload image or paste URL"
                      value={news.imageUrl}
                      onChange={(url) => updateNews(news.id, "imageUrl", url)}
                      accept="image/*"
                      fileType="image"
                    />
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={news.date}
                        onChange={(e) => updateNews(news.id, "date", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* English Content */}
                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                    </TabsList>

                    <TabsContent value="en" className="space-y-4 mt-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={news.en.title}
                          onChange={(e) => updateNews(news.id, "title", e.target.value, "en")}
                          placeholder="News title"
                        />
                      </div>
                      <div>
                        <Label>Author</Label>
                        <Input
                          value={news.en.author}
                          onChange={(e) => updateNews(news.id, "author", e.target.value, "en")}
                          placeholder="Author name"
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={news.en.category}
                          onChange={(e) => updateNews(news.id, "category", e.target.value, "en")}
                          placeholder="News category"
                        />
                      </div>
                      <div>
                        <Label>Excerpt</Label>
                        <Textarea
                          value={news.en.excerpt}
                          onChange={(e) => updateNews(news.id, "excerpt", e.target.value, "en")}
                          placeholder="Short summary"
                          className="h-20"
                        />
                      </div>
                      <div>
                        <Label>Full Content</Label>
                        <Textarea
                          value={news.en.fullContent}
                          onChange={(e) => updateNews(news.id, "fullContent", e.target.value, "en")}
                          placeholder="Complete article content"
                          className="h-40"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="ar" className="space-y-4 mt-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={news.ar.title}
                          onChange={(e) => updateNews(news.id, "title", e.target.value, "ar")}
                          placeholder="عنوان الأخبار"
                        />
                      </div>
                      <div>
                        <Label>Author</Label>
                        <Input
                          value={news.ar.author}
                          onChange={(e) => updateNews(news.id, "author", e.target.value, "ar")}
                          placeholder="اسم المؤلف"
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={news.ar.category}
                          onChange={(e) => updateNews(news.id, "category", e.target.value, "ar")}
                          placeholder="فئة الأخبار"
                        />
                      </div>
                      <div>
                        <Label>Excerpt</Label>
                        <Textarea
                          value={news.ar.excerpt}
                          onChange={(e) => updateNews(news.id, "excerpt", e.target.value, "ar")}
                          placeholder="ملخص قصير"
                          className="h-20"
                        />
                      </div>
                      <div>
                        <Label>Full Content</Label>
                        <Textarea
                          value={news.ar.fullContent}
                          onChange={(e) => updateNews(news.id, "fullContent", e.target.value, "ar")}
                          placeholder="محتوى المقالة الكاملة"
                          className="h-40"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
