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

export default function BlogEditor() {
  const { content, updateSection } = useContent()
  const [blog, setBlog] = useState<SiteContent["blog"]>(content.blog)
  const [saved, setSaved] = useState(false)

  // Sync local state when context changes
  useEffect(() => {
    setBlog(content.blog)
  }, [content.blog])

  const handleSave = () => {
    console.log("[v0] Saving blog posts:", blog)
    updateSection("blog", blog)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updatePost = (id: string, field: string, value: string, lang?: "en" | "ar") => {
    setBlog({
      ...blog,
      posts: blog.posts.map((p) =>
        p.id === id
          ? lang
            ? { ...p, [lang]: { ...p[lang], [field]: value } }
            : { ...p, [field]: value }
          : p
      ),
    })
  }

  const addPost = () => {
    const newId = Date.now().toString()
    setBlog({
      ...blog,
      posts: [
        ...blog.posts,
        {
          id: newId,
          imageUrl: "/placeholder.svg",
          date: new Date().toISOString().split("T")[0],
          en: { title: "", excerpt: "", fullContent: "", author: "", category: "" },
          ar: { title: "", excerpt: "", fullContent: "", author: "", category: "" },
        },
      ],
    })
  }

  const removePost = (id: string) => {
    setBlog({
      ...blog,
      posts: blog.posts.filter((p) => p.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2F683E]">Blog Posts Editor</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addPost}>
            <Plus className="w-4 h-4 mr-2" />
            Add Post
          </Button>
          <Button onClick={handleSave} className="bg-[#2F683E] hover:bg-[#2F683E]/90">
            <Save className="w-4 h-4 mr-2" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {blog.posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{post.en.title || "New Post"}</span>
                <Button variant="ghost" size="icon" onClick={() => removePost(post.id)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <FileUpload
                    label="Blog Post Image"
                    description="Upload image or paste URL"
                    value={post.imageUrl}
                    onChange={(url) => updatePost(post.id, "imageUrl", url)}
                    accept="image/*"
                    fileType="image"
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={post.date}
                    onChange={(e) => updatePost(post.id, "date", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 border-r pr-4">
                  <h4 className="font-semibold">English</h4>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={post.en.title}
                      onChange={(e) => updatePost(post.id, "title", e.target.value, "en")}
                    />
                  </div>
                  <div>
                    <Label>Excerpt</Label>
                    <Textarea
                      value={post.en.excerpt}
                      onChange={(e) => updatePost(post.id, "excerpt", e.target.value, "en")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Author</Label>
                      <Input
                        value={post.en.author}
                        onChange={(e) => updatePost(post.id, "author", e.target.value, "en")}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={post.en.category}
                        onChange={(e) => updatePost(post.id, "category", e.target.value, "en")}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Arabic</h4>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={post.ar.title}
                      onChange={(e) => updatePost(post.id, "title", e.target.value, "ar")}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>Excerpt</Label>
                    <Textarea
                      value={post.ar.excerpt}
                      onChange={(e) => updatePost(post.id, "excerpt", e.target.value, "ar")}
                      dir="rtl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Author</Label>
                      <Input
                        value={post.ar.author}
                        onChange={(e) => updatePost(post.id, "author", e.target.value, "ar")}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={post.ar.category}
                        onChange={(e) => updatePost(post.id, "category", e.target.value, "ar")}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
