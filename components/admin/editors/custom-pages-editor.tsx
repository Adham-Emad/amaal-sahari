"use client"

import { useState, useEffect } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Save, Plus, Trash2, Eye, EyeOff, Globe, FileText, ArrowUp, ArrowDown, AlertCircle } from "lucide-react"

type CustomPage = NonNullable<SiteContent["customPages"]>[number]

const RESERVED_SLUGS = [
  "about", "admin", "api", "blog", "careers", "case-studies",
  "contact", "faqs", "forgot-password", "login", "news",
  "p", "privacy", "projects", "services", "terms",
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export default function CustomPagesEditor() {
  const { content, updateSection } = useContent()
  const [pages, setPages] = useState<CustomPage[]>(content.customPages || [])
  const [saved, setSaved] = useState(false)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [slugError, setSlugError] = useState<string>("")

  useEffect(() => {
    setPages(content.customPages || [])
  }, [content.customPages])

  const selectedPage = pages.find((p) => p.id === selectedPageId)

  const handleSave = () => {
    const hasErrors = pages.some((p) => {
      const err = validateSlug(p.slug, p.id)
      return err !== ""
    })
    if (hasErrors) {
      setSlugError("Fix slug errors before saving")
      return
    }
    updateSection("customPages", pages)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addPage = () => {
    const newPage: CustomPage = {
      id: `page_${Date.now()}`,
      slug: `new-page-${pages.length + 1}`,
      status: "draft",
      showInNavbar: false,
      navbarOrder: pages.length,
      en: { title: "New Page", subtitle: "", content: "" },
      ar: { title: "صفحة جديدة", subtitle: "", content: "" },
      seo: {
        en: { metaTitle: "", metaDescription: "", keywords: "" },
        ar: { metaTitle: "", metaDescription: "", keywords: "" },
      },
      heroImage: "",
      template: "default",
    }
    setPages([...pages, newPage])
    setSelectedPageId(newPage.id)
  }

  const removePage = (id: string) => {
    setPages(pages.filter((p) => p.id !== id))
    if (selectedPageId === id) setSelectedPageId(null)
  }

  const updatePage = (id: string, updates: Partial<CustomPage>) => {
    setPages(pages.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const updatePageLocale = (id: string, locale: "en" | "ar", field: string, value: string) => {
    setPages(pages.map((p) => {
      if (p.id !== id) return p
      return { ...p, [locale]: { ...p[locale], [field]: value } }
    }))
  }

  const updatePageSEO = (id: string, locale: "en" | "ar", field: string, value: string) => {
    setPages(pages.map((p) => {
      if (p.id !== id) return p
      return {
        ...p,
        seo: {
          ...p.seo,
          [locale]: { ...(p.seo?.[locale] || {}), [field]: value },
        },
      }
    }))
  }

  const validateSlug = (slug: string, currentId: string): string => {
    if (!slug) return "Slug is required"
    if (!/^[a-z0-9-]+$/.test(slug)) return "Slug can only contain lowercase letters, numbers, and hyphens"
    if (RESERVED_SLUGS.includes(slug)) return `"${slug}" is reserved. Choose a different slug.`
    if (pages.some((p) => p.slug === slug && p.id !== currentId)) return "This slug is already used by another page"
    return ""
  }

  const handleSlugChange = (id: string, value: string) => {
    const cleanSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    const error = validateSlug(cleanSlug, id)
    setSlugError(error)
    updatePage(id, { slug: cleanSlug })
  }

  if (!selectedPage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Custom Pages</h2>
            <p className="text-muted-foreground">Create and manage additional pages for your website</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Changes"}
            </Button>
            <Button onClick={addPage} className="gap-2" variant="outline">
              <Plus className="w-4 h-4" />
              Add Page
            </Button>
          </div>
        </div>

        {pages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Custom Pages Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first custom page to add new content to your website.</p>
              <Button onClick={addPage} className="gap-2">
                <Plus className="w-4 h-4" />
                Create First Page
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pages.map((page) => (
              <Card key={page.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedPageId(page.id)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${page.status === "published" ? "bg-green-500" : "bg-yellow-500"}`} />
                    <div>
                      <h3 className="font-semibold">{page.en.title}</h3>
                      <p className="text-sm text-muted-foreground">/{page.slug} • {page.status} {page.showInNavbar && "• In Navbar"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); removePage(page.id) }} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setSelectedPageId(null)}>Back to Pages</Button>
          <h2 className="text-2xl font-bold">{selectedPage.en.title}</h2>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>English Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={selectedPage.en.title} onChange={(e) => updatePageLocale(selectedPage.id, "en", "title", e.target.value)} placeholder="Page Title" />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={selectedPage.en.subtitle} onChange={(e) => updatePageLocale(selectedPage.id, "en", "subtitle", e.target.value)} placeholder="Optional subtitle" />
              </div>
              <div className="space-y-2">
                <Label>Content (HTML supported)</Label>
                <Textarea value={selectedPage.en.content} onChange={(e) => updatePageLocale(selectedPage.id, "en", "content", e.target.value)} placeholder="Page content..." rows={12} className="font-mono text-sm" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Arabic Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title (Arabic)</Label>
                <Input value={selectedPage.ar.title} onChange={(e) => updatePageLocale(selectedPage.id, "ar", "title", e.target.value)} placeholder="عنوان الصفحة" dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label>Subtitle (Arabic)</Label>
                <Input value={selectedPage.ar.subtitle} onChange={(e) => updatePageLocale(selectedPage.id, "ar", "subtitle", e.target.value)} placeholder="العنوان الفرعي" dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label>Content (Arabic, HTML supported)</Label>
                <Textarea value={selectedPage.ar.content} onChange={(e) => updatePageLocale(selectedPage.id, "ar", "content", e.target.value)} placeholder="محتوى الصفحة..." rows={12} className="font-mono text-sm" dir="rtl" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/</span>
                  <Input value={selectedPage.slug} onChange={(e) => handleSlugChange(selectedPage.id, e.target.value)} placeholder="page-url" className="font-mono" />
                  <Button variant="outline" size="sm" onClick={() => handleSlugChange(selectedPage.id, generateSlug(selectedPage.en.title))}>Auto</Button>
                </div>
                {slugError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {slugError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Status</Label>
                  <p className="text-sm text-muted-foreground">Published pages are visible on the website</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={selectedPage.status === "published"} onCheckedChange={(checked) => updatePage(selectedPage.id, { status: checked ? "published" : "draft" })} />
                  {selectedPage.status === "published" ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show in Navbar</Label>
                  <p className="text-sm text-muted-foreground">Add a link to this page in the navigation menu</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={selectedPage.showInNavbar} onCheckedChange={(checked) => updatePage(selectedPage.id, { showInNavbar: checked })} />
                  <Globe className="w-4 h-4" />
                </div>
              </div>

              {selectedPage.showInNavbar && (
                <div className="space-y-2">
                  <Label>Navbar Order</Label>
                  <Input type="number" value={selectedPage.navbarOrder} onChange={(e) => updatePage(selectedPage.id, { navbarOrder: parseInt(e.target.value) || 0 })} min={0} className="w-32" />
                </div>
              )}

              <div className="space-y-2">
                <Label>Hero Image URL (optional)</Label>
                <Input value={selectedPage.heroImage || ""} onChange={(e) => updatePage(selectedPage.id, { heroImage: e.target.value })} placeholder="https://..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>English SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input value={selectedPage.seo?.en?.metaTitle || ""} onChange={(e) => updatePageSEO(selectedPage.id, "en", "metaTitle", e.target.value)} placeholder="Page Title | Amaal Sahari" />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea value={selectedPage.seo?.en?.metaDescription || ""} onChange={(e) => updatePageSEO(selectedPage.id, "en", "metaDescription", e.target.value)} placeholder="Brief description for search engines..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Keywords</Label>
                <Input value={selectedPage.seo?.en?.keywords || ""} onChange={(e) => updatePageSEO(selectedPage.id, "en", "keywords", e.target.value)} placeholder="keyword1, keyword2, keyword3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Arabic SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Meta Title (Arabic)</Label>
                <Input value={selectedPage.seo?.ar?.metaTitle || ""} onChange={(e) => updatePageSEO(selectedPage.id, "ar", "metaTitle", e.target.value)} placeholder="عنوان الصفحة" dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label>Meta Description (Arabic)</Label>
                <Textarea value={selectedPage.seo?.ar?.metaDescription || ""} onChange={(e) => updatePageSEO(selectedPage.id, "ar", "metaDescription", e.target.value)} placeholder="وصف مختصر..." rows={3} dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label>Keywords (Arabic)</Label>
                <Input value={selectedPage.seo?.ar?.keywords || ""} onChange={(e) => updatePageSEO(selectedPage.id, "ar", "keywords", e.target.value)} placeholder="كلمة1، كلمة2" dir="rtl" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Preview (English)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 space-y-4">
                <h1 className="text-3xl font-bold">{selectedPage.en.title}</h1>
                {selectedPage.en.subtitle && <p className="text-xl text-muted-foreground">{selectedPage.en.subtitle}</p>}
                <div className="prose max-w-none whitespace-pre-wrap">{selectedPage.en.content || "No content yet"}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
