"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Plus, Trash2 } from "lucide-react"

export default function KpisEditorUpdated() {
  const { content, updateSection } = useContent()
  const [kpis, setKpis] = useState(content.kpis)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setKpis(content.kpis)
  }, [content.kpis])

  const handleAddKpi = () => {
    const newKpi = {
      id: `kpi_${Date.now()}`,
      value: "",
      en: { label: "" },
      ar: { label: "" },
    }
    setKpis({
      ...kpis,
      items: [...kpis.items, newKpi],
    })
  }

  const handleRemoveKpi = (id: string) => {
    setKpis({
      ...kpis,
      items: kpis.items.filter((item) => item.id !== id),
    })
  }

  const handleUpdateKpi = (id: string, field: string, value: string) => {
    setKpis({
      ...kpis,
      items: kpis.items.map((item) =>
        item.id === id
          ? field === "value"
            ? { ...item, value }
            : field.startsWith("en.")
              ? { ...item, en: { ...item.en, [field.split(".")[1]]: value } }
              : { ...item, ar: { ...item.ar, [field.split(".")[1]]: value } }
          : item
      ),
    })
  }

  const handleSave = () => {
    updateSection("kpis", kpis)
    // Also sync KPIs to footer stats to keep them in sync
    updateSection("footer", {
      ...content.footer,
      stats: kpis.items,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Statistics & KPIs</h2>
          <p className="text-sm text-gray-600">Manage company statistics and key performance indicators</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-4">
        {kpis.items.map((kpi) => (
          <Card key={kpi.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">KPI Item</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveKpi(kpi.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`value-${kpi.id}`}>Value (e.g., 500+)</Label>
                <Input
                  id={`value-${kpi.id}`}
                  placeholder="e.g., 500+"
                  value={kpi.value}
                  onChange={(e) => handleUpdateKpi(kpi.id, "value", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`en-${kpi.id}`}>Label (English)</Label>
                  <Input
                    id={`en-${kpi.id}`}
                    placeholder="e.g., Happy Clients"
                    value={kpi.en.label}
                    onChange={(e) => handleUpdateKpi(kpi.id, "en.label", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`ar-${kpi.id}`}>Label (Arabic)</Label>
                  <Input
                    id={`ar-${kpi.id}`}
                    placeholder="e.g., العملاء السعداء"
                    value={kpi.ar.label}
                    onChange={(e) => handleUpdateKpi(kpi.id, "ar.label", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleAddKpi} variant="outline" className="w-full gap-2">
        <Plus className="w-4 h-4" />
        Add KPI
      </Button>
    </div>
  )
}
