"use client"

import { useState } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"

export default function CareersEditor() {
  const { content, updateSection } = useContent()
  const [careers, setCareers] = useState<SiteContent["careers"]>(content.careers)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateSection("careers", careers)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updatePosition = (id: string, field: string, value: string, lang: "en" | "ar") => {
    setCareers({
      ...careers,
      positions: careers.positions.map((p) =>
        p.id === id ? { ...p, [lang]: { ...p[lang], [field]: value } } : p
      ),
    })
  }

  const addPosition = () => {
    const newId = Date.now().toString()
    setCareers({
      ...careers,
      positions: [
        ...careers.positions,
        {
          id: newId,
          en: { title: "", department: "", location: "", description: "" },
          ar: { title: "", department: "", location: "", description: "" },
        },
      ],
    })
  }

  const removePosition = (id: string) => {
    setCareers({
      ...careers,
      positions: careers.positions.filter((p) => p.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2F683E]">Careers / Job Positions Editor</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addPosition}>
            <Plus className="w-4 h-4 mr-2" />
            Add Position
          </Button>
          <Button onClick={handleSave} className="bg-[#2F683E] hover:bg-[#2F683E]/90">
            <Save className="w-4 h-4 mr-2" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {careers.positions.map((position) => (
          <Card key={position.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{position.en.title || "New Position"}</span>
                <Button variant="ghost" size="icon" onClick={() => removePosition(position.id)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 border-r pr-4">
                  <h4 className="font-semibold">English</h4>
                  <div>
                    <Label>Job Title</Label>
                    <Input
                      value={position.en.title}
                      onChange={(e) => updatePosition(position.id, "title", e.target.value, "en")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Department</Label>
                      <Input
                        value={position.en.department}
                        onChange={(e) => updatePosition(position.id, "department", e.target.value, "en")}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={position.en.location}
                        onChange={(e) => updatePosition(position.id, "location", e.target.value, "en")}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={position.en.description}
                      onChange={(e) => updatePosition(position.id, "description", e.target.value, "en")}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Arabic</h4>
                  <div>
                    <Label>Job Title</Label>
                    <Input
                      value={position.ar.title}
                      onChange={(e) => updatePosition(position.id, "title", e.target.value, "ar")}
                      dir="rtl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Department</Label>
                      <Input
                        value={position.ar.department}
                        onChange={(e) => updatePosition(position.id, "department", e.target.value, "ar")}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={position.ar.location}
                        onChange={(e) => updatePosition(position.id, "location", e.target.value, "ar")}
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={position.ar.description}
                      onChange={(e) => updatePosition(position.id, "description", e.target.value, "ar")}
                      dir="rtl"
                    />
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
