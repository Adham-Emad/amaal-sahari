"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Save, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FileUpload from "../file-upload"

export default function NavbarEditor() {
  const { content, updateSection } = useContent()
  const defaultNavbar = {
    logo: { url: "", alt: "", height: 48 },
    colors: { background: "#2F683E", text: "#FAFBF0", hover: "#FAB076", accent: "#EA8936" },
    navigation: { en: [], ar: [] },
    cta: { en: "Get a Quote", ar: "احصل على عرض" },
  }
  
  const [navbar, setNavbar] = useState(content.navbar || defaultNavbar)
  const [saved, setSaved] = useState(false)
  
  // Check if there are unsaved changes
  const hasChanges = JSON.stringify(navbar) !== JSON.stringify(content.navbar)

  useEffect(() => {
    if (content.navbar) {
      setNavbar(content.navbar)
    }
  }, [content.navbar])

  const handleSave = () => {
    updateSection("navbar", navbar)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Navigation Bar Editor</h2>
          <p className="text-muted-foreground">Control navbar appearance and navigation links</p>
        </div>
          <Button 
            onClick={handleSave} 
            className="gap-2"
            variant={hasChanges ? "default" : "outline"}
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : hasChanges ? "Save Changes*" : "Saved"}
          </Button>
      </div>

      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>
          Changes to navbar configuration will affect the site&apos;s main navigation. Preview before deploying.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="links-en">Links (EN)</TabsTrigger>
          <TabsTrigger value="links-ar">Links (AR)</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo Settings</CardTitle>
              <CardDescription>Configure the navbar logo image and size</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                label="Logo Image"
                description="Upload logo from device or paste image URL"
                value={navbar.logo.url}
                onChange={(url) => setNavbar({ ...navbar, logo: { ...navbar.logo, url } })}
                fileType="image"
              />
              <div>
                <Label htmlFor="logo-alt">Logo Alt Text</Label>
                <Input
                  id="logo-alt"
                  value={navbar.logo.alt}
                  onChange={(e) =>
                    setNavbar({
                      ...navbar,
                      logo: { ...navbar.logo, alt: e.target.value },
                    })
                  }
                  placeholder="Logo description"
                />
              </div>
              <div>
                <Label htmlFor="logo-height">Logo Height (px)</Label>
                <Input
                  id="logo-height"
                  type="number"
                  value={navbar.logo.height}
                  onChange={(e) =>
                    setNavbar({
                      ...navbar,
                      logo: { ...navbar.logo, height: parseInt(e.target.value) },
                    })
                  }
                  min="32"
                  max="128"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call-to-Action Button</CardTitle>
              <CardDescription>Text shown on the "Get a Quote" button</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cta-en">English</Label>
                <Input
                  id="cta-en"
                  value={navbar.cta.en}
                  onChange={(e) =>
                    setNavbar({
                      ...navbar,
                      cta: { ...navbar.cta, en: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="cta-ar">Arabic</Label>
                <Input
                  id="cta-ar"
                  value={navbar.cta.ar}
                  onChange={(e) =>
                    setNavbar({
                      ...navbar,
                      cta: { ...navbar.cta, ar: e.target.value },
                    })
                  }
                  dir="rtl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Colors */}
        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>Customize navbar colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex gap-2">
                    <input
                      id="bg-color"
                      type="color"
                      value={navbar.colors.background}
                      onChange={(e) =>
                        setNavbar({
                          ...navbar,
                          colors: { ...navbar.colors, background: e.target.value },
                        })
                      }
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={navbar.colors.background}
                      onChange={(e) =>
                        setNavbar({
                          ...navbar,
                          colors: { ...navbar.colors, background: e.target.value },
                        })
                      }
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex gap-2">
                    <input
                      id="text-color"
                      type="color"
                      value={navbar.colors.text}
                      onChange={(e) =>
                        setNavbar({
                          ...navbar,
                          colors: { ...navbar.colors, text: e.target.value },
                        })
                      }
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={navbar.colors.text}
                      onChange={(e) =>
                        setNavbar({
                          ...navbar,
                          colors: { ...navbar.colors, text: e.target.value },
                        })
                      }
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hover-color">Hover Color</Label>
                  <div className="flex gap-2">
                    <input
                      id="hover-color"
                      type="color"
                      value={navbar.colors.hover}
                      onChange={(e) =>
                        setNavbar({
                          ...navbar,
                          colors: { ...navbar.colors, hover: e.target.value },
                        })
                      }
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={navbar.colors.hover}
                      onChange={(e) =>
                        setNavbar({
                          ...navbar,
                          colors: { ...navbar.colors, hover: e.target.value },
                        })
                      }
                      placeholder="#FFA500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex gap-2">
                    <input
                      id="accent-color"
                      type="color"
                      value={navbar.colors.accent}
                      onChange={(e) =>
                        setNavbar({
                          ...navbar,
                          colors: { ...navbar.colors, accent: e.target.value },
                        })
                      }
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={navbar.colors.accent}
                      onChange={(e) =>
                        setNavbar({
                          ...navbar,
                          colors: { ...navbar.colors, accent: e.target.value },
                        })
                      }
                      placeholder="#FF6B6B"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* English Links */}
        <TabsContent value="links-en" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Links (English)</CardTitle>
              <CardDescription>Manage English navigation menu items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {navbar.navigation.en.map((link, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={link.label}
                      onChange={(e) => {
                        const newNav = [...navbar.navigation.en]
                        newNav[idx].label = e.target.value
                        setNavbar({
                          ...navbar,
                          navigation: { ...navbar.navigation, en: newNav },
                        })
                      }}
                    />
                  </div>
                  <div>
                    <Label>URL</Label>
                    <Input
                      value={link.href}
                      onChange={(e) => {
                        const newNav = [...navbar.navigation.en]
                        newNav[idx].href = e.target.value
                        setNavbar({
                          ...navbar,
                          navigation: { ...navbar.navigation, en: newNav },
                        })
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Arabic Links */}
        <TabsContent value="links-ar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Links (Arabic)</CardTitle>
              <CardDescription>Manage Arabic navigation menu items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {navbar.navigation.ar.map((link, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={link.label}
                      onChange={(e) => {
                        const newNav = [...navbar.navigation.ar]
                        newNav[idx].label = e.target.value
                        setNavbar({
                          ...navbar,
                          navigation: { ...navbar.navigation, ar: newNav },
                        })
                      }}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>URL</Label>
                    <Input
                      value={link.href}
                      onChange={(e) => {
                        const newNav = [...navbar.navigation.ar]
                        newNav[idx].href = e.target.value
                        setNavbar({
                          ...navbar,
                          navigation: { ...navbar.navigation, ar: newNav },
                        })
                      }}
                      dir="rtl"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
