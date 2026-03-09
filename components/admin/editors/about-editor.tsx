"use client"

import { useState, useEffect } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save } from "lucide-react"
import FileUpload from "../file-upload"

export default function AboutEditor() {
  const { content, updateSection } = useContent()
  const [about, setAbout] = useState<SiteContent["about"]>(content.about)
  const [saved, setSaved] = useState(false)

  // Sync local state when context changes
  useEffect(() => {
    setAbout(content.about)
  }, [content.about])

  const handleSave = () => {
    console.log("[v0] Saving about page:", about)
    updateSection("about", about)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateVisionPoint = (index: number, value: string, lang: "en" | "ar") => {
    const newPoints = [...about[lang].visionPoints]
    newPoints[index] = value
    setAbout({
      ...about,
      [lang]: { ...about[lang], visionPoints: newPoints },
    })
  }

  const updateMissionPoint = (index: number, value: string, lang: "en" | "ar") => {
    const newPoints = [...about[lang].missionPoints]
    newPoints[index] = value
    setAbout({
      ...about,
      [lang]: { ...about[lang], missionPoints: newPoints },
    })
  }

  const addVisionPoint = (lang: "en" | "ar") => {
    setAbout({
      ...about,
      [lang]: { ...about[lang], visionPoints: [...about[lang].visionPoints, ""] },
    })
  }

  const addMissionPoint = (lang: "en" | "ar") => {
    setAbout({
      ...about,
      [lang]: { ...about[lang], missionPoints: [...about[lang].missionPoints, ""] },
    })
  }

  const updateCoreValue = (id: string, field: string, value: string, lang?: "en" | "ar") => {
    setAbout({
      ...about,
      coreValues: about.coreValues.map((v) =>
        v.id === id
          ? lang
            ? { ...v, [lang]: { ...v[lang], [field]: value } }
            : { ...v, [field]: value }
          : v
      ),
    })
  }

  const addCoreValue = () => {
    const newId = Date.now().toString()
    setAbout({
      ...about,
      coreValues: [
        ...about.coreValues,
        {
          id: newId,
          icon: "Heart",
          en: { title: "", description: "" },
          ar: { title: "", description: "" },
        },
      ],
    })
  }

  const removeCoreValue = (id: string) => {
    setAbout({
      ...about,
      coreValues: about.coreValues.filter((v) => v.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2F683E]">About Page Editor</h2>
        <Button onClick={handleSave} className="bg-[#2F683E] hover:bg-[#2F683E]/90">
          <Save className="w-4 h-4 mr-2" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="vision">Vision</TabsTrigger>
          <TabsTrigger value="mission">Mission</TabsTrigger>
          <TabsTrigger value="values">Core Values</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                label="Hero Image"
                description="Upload or paste URL for hero background image"
                value={about.heroImageUrl}
                onChange={(url) => setAbout({ ...about, heroImageUrl: url })}
                fileType="image"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">English</h4>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={about.en.title}
                      onChange={(e) => setAbout({ ...about, en: { ...about.en, title: e.target.value } })}
                    />
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Textarea
                      value={about.en.subtitle}
                      onChange={(e) => setAbout({ ...about, en: { ...about.en, subtitle: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Arabic</h4>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={about.ar.title}
                      onChange={(e) => setAbout({ ...about, ar: { ...about.ar, title: e.target.value } })}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Textarea
                      value={about.ar.subtitle}
                      onChange={(e) => setAbout({ ...about, ar: { ...about.ar, subtitle: e.target.value } })}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vision" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vision Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                label="Vision Image"
                description="Upload or paste URL for vision section image"
                value={about.visionImageUrl || ""}
                onChange={(url) => setAbout({ ...about, visionImageUrl: url })}
                fileType="image"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">English</h4>
                  <div>
                    <Label>Vision Title</Label>
                    <Input
                      value={about.en.visionTitle}
                      onChange={(e) => setAbout({ ...about, en: { ...about.en, visionTitle: e.target.value } })}
                    />
                  </div>
                  <div>
                    <Label>Vision Description</Label>
                    <Textarea
                      value={about.en.visionDescription}
                      onChange={(e) => setAbout({ ...about, en: { ...about.en, visionDescription: e.target.value } })}
                    />
                  </div>
                  <div>
                    <Label>Vision Points</Label>
                    {about.en.visionPoints.map((point, index) => (
                      <Input
                        key={index}
                        value={point}
                        onChange={(e) => updateVisionPoint(index, e.target.value, "en")}
                        className="mb-2"
                      />
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addVisionPoint("en")}>
                      <Plus className="w-4 h-4 mr-1" /> Add Point
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Arabic</h4>
                  <div>
                    <Label>Vision Title</Label>
                    <Input
                      value={about.ar.visionTitle}
                      onChange={(e) => setAbout({ ...about, ar: { ...about.ar, visionTitle: e.target.value } })}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>Vision Description</Label>
                    <Textarea
                      value={about.ar.visionDescription}
                      onChange={(e) => setAbout({ ...about, ar: { ...about.ar, visionDescription: e.target.value } })}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>Vision Points</Label>
                    {about.ar.visionPoints.map((point, index) => (
                      <Input
                        key={index}
                        value={point}
                        onChange={(e) => updateVisionPoint(index, e.target.value, "ar")}
                        className="mb-2"
                        dir="rtl"
                      />
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addVisionPoint("ar")}>
                      <Plus className="w-4 h-4 mr-1" /> Add Point
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mission Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                label="Mission Image"
                description="Upload or paste URL for mission section image"
                value={about.missionImageUrl || ""}
                onChange={(url) => setAbout({ ...about, missionImageUrl: url })}
                fileType="image"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">English</h4>
                  <div>
                    <Label>Mission Title</Label>
                    <Input
                      value={about.en.missionTitle}
                      onChange={(e) => setAbout({ ...about, en: { ...about.en, missionTitle: e.target.value } })}
                    />
                  </div>
                  <div>
                    <Label>Mission Description</Label>
                    <Textarea
                      value={about.en.missionDescription}
                      onChange={(e) => setAbout({ ...about, en: { ...about.en, missionDescription: e.target.value } })}
                    />
                  </div>
                  <div>
                    <Label>Mission Points</Label>
                    {about.en.missionPoints.map((point, index) => (
                      <Input
                        key={index}
                        value={point}
                        onChange={(e) => updateMissionPoint(index, e.target.value, "en")}
                        className="mb-2"
                      />
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addMissionPoint("en")}>
                      <Plus className="w-4 h-4 mr-1" /> Add Point
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Arabic</h4>
                  <div>
                    <Label>Mission Title</Label>
                    <Input
                      value={about.ar.missionTitle}
                      onChange={(e) => setAbout({ ...about, ar: { ...about.ar, missionTitle: e.target.value } })}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>Mission Description</Label>
                    <Textarea
                      value={about.ar.missionDescription}
                      onChange={(e) => setAbout({ ...about, ar: { ...about.ar, missionDescription: e.target.value } })}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>Mission Points</Label>
                    {about.ar.missionPoints.map((point, index) => (
                      <Input
                        key={index}
                        value={point}
                        onChange={(e) => updateMissionPoint(index, e.target.value, "ar")}
                        className="mb-2"
                        dir="rtl"
                      />
                    ))}
                    <Button variant="outline" size="sm" onClick={() => addMissionPoint("ar")}>
                      <Plus className="w-4 h-4 mr-1" /> Add Point
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="values" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Core Values
                <Button variant="outline" size="sm" onClick={addCoreValue}>
                  <Plus className="w-4 h-4 mr-1" /> Add Value
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {about.coreValues.map((value) => (
                <div key={value.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Icon (Heart, Zap, Users, Globe)</Label>
                      <Input
                        value={value.icon}
                        onChange={(e) => updateCoreValue(value.id, "icon", e.target.value)}
                        className="w-40"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCoreValue(value.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">English</h4>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={value.en.title}
                          onChange={(e) => updateCoreValue(value.id, "title", e.target.value, "en")}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={value.en.description}
                          onChange={(e) => updateCoreValue(value.id, "description", e.target.value, "en")}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Arabic</h4>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={value.ar.title}
                          onChange={(e) => updateCoreValue(value.id, "title", e.target.value, "ar")}
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={value.ar.description}
                          onChange={(e) => updateCoreValue(value.id, "description", e.target.value, "ar")}
                          dir="rtl"
                        />
                      </div>
                    </div>
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
