"use client"

import { useState } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, ArrowRight, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BlogDetailsEditor() {
  const { content, updateSection } = useContent()
  const [blog, setBlog] = useState<SiteContent["blog"]>(content.blog)
  const [saved, setSaved] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(blog.posts[0]?.id || null)

  const selectedPost = blog.posts.find((p) => p.id === selectedPostId)

  const handleSave = () => {
    updateSection("blog", blog)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updatePostContent = (field: string, value: string, lang: "en" | "ar") => {
    if (!selectedPostId) return
    setBlog({
      ...blog,
      posts: blog.posts.map((p) =>
        p.id === selectedPostId ? { ...p, [lang]: { ...p[lang], [field]: value } } : p
      ),
    })
  }

  if (!selectedPost) {
    return (
      <div className="p-8 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-800">No blog posts available. Please create a post in the Blog Posts Editor first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2F683E]">Blog Posts Full Content Editor</h2>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="bg-[#2F683E] hover:bg-[#2F683E]/90">
            <Save className="w-4 h-4 mr-2" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Post Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedPostId || ""} onValueChange={setSelectedPostId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a post" />
            </SelectTrigger>
            <SelectContent>
              {blog.posts.map((post) => (
                <SelectItem key={post.id} value={post.id}>
                  {post.en.title || "Untitled"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Content Editor */}
      {selectedPost && (
        <div className="grid grid-cols-2 gap-6">
          {/* English Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">English Full Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Post Title</Label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded mt-1">{selectedPost.en.title}</div>
              </div>
              <div>
                <Label>Excerpt</Label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded mt-1 max-h-20 overflow-y-auto">
                  {selectedPost.en.excerpt}
                </div>
              </div>
              <div>
                <Label htmlFor="en-fullcontent">Full Article Content</Label>
                <Textarea
                  id="en-fullcontent"
                  value={selectedPost.en.fullContent || ""}
                  onChange={(e) => updatePostContent("fullContent", e.target.value, "en")}
                  placeholder="Enter the full article content here. You can use line breaks for formatting."
                  className="min-h-64 font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Arabic Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Arabic Full Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Post Title</Label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded mt-1">{selectedPost.ar.title}</div>
              </div>
              <div>
                <Label>Excerpt</Label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded mt-1 max-h-20 overflow-y-auto">
                  {selectedPost.ar.excerpt}
                </div>
              </div>
              <div>
                <Label htmlFor="ar-fullcontent">Full Article Content</Label>
                <Textarea
                  id="ar-fullcontent"
                  value={selectedPost.ar.fullContent || ""}
                  onChange={(e) => updatePostContent("fullContent", e.target.value, "ar")}
                  placeholder="أدخل محتوى المقالة الكاملة هنا"
                  className="min-h-64 font-mono text-sm"
                  dir="rtl"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2 justify-between">
        <Button variant="outline" onClick={() => window.history.back()} className="inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
        <Button onClick={handleSave} className="bg-[#2F683E] hover:bg-[#2F683E]/90">
          <Save className="w-4 h-4 mr-2" />
          {saved ? "Saved!" : "Save All Changes"}
        </Button>
      </div>
    </div>
  )
}
