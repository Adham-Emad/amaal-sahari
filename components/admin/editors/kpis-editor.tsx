"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Plus, Trash2 } from "lucide-react"

export default function KpisEditor() {
  const { content, updateSection } = useContent()
  const [kpis, setKpis] = useState(content.kpis)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setKpis(content.kpis)
  }, [content.kpis])

  const handleSave = () => {
    updateSection("kpis", kpis)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addKpi = () => {
    setKpis({
      items: [
        ...kpis.items,
        {
          id: Date.now().toString(),
          value: "0",
          en: { label: "New KPI" },
          ar: { label: "مؤشر جديد" },
        },
      ],
    })
  }

  const removeKpi = (id: string) => {
    setKpis({
      items: kpis.items.filter((item) => item.id !== id),
    })
  }

  const updateKpi = (id: string, field: string, value: string, lang?: "en" | "ar") => {
    setKpis({
      items: kpis.items.map((item) => {
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
          <h2 className="text-2xl font-bold">KPIs / Statistics</h2>
          <p className="text-muted-foreground">Edit the key performance indicators displayed on the site</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addKpi} className="gap-2">
            <Plus className="w-4 h-4" />
            Add KPI
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {kpis.items.map((kpi, index) => (
          <Card key={kpi.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">KPI #{index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeKpi(kpi.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  value={kpi.value}
                  onChange={(e) => updateKpi(kpi.id, "value", e.target.value)}
                  placeholder="e.g., 500+, 98%, 24/7"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>English Label</Label>
                  <Input
                    value={kpi.en.label}
                    onChange={(e) => updateKpi(kpi.id, "label", e.target.value, "en")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Arabic Label</Label>
                  <Input
                    value={kpi.ar.label}
                    onChange={(e) => updateKpi(kpi.id, "label", e.target.value, "ar")}
                    dir="rtl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
