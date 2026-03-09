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

export default function FooterContactEditor() {
  const { content, updateSection } = useContent()
  const [contact, setContact] = useState<SiteContent["contact"]>(content.contact)
  const [footer, setFooter] = useState<SiteContent["footer"]>(content.footer)
  const [saved, setSaved] = useState(false)

  // Sync with global content state changes
  useEffect(() => {
    setContact(content.contact)
  }, [content.contact])

  useEffect(() => {
    setFooter(content.footer)
  }, [content.footer])

  const handleSave = () => {
    updateSection("contact", contact)
    updateSection("footer", footer)
    // Also sync footer stats to KPIs
    updateSection("kpis", {
      items: footer.stats.map((stat) => ({
        id: stat.id,
        value: stat.value,
        en: { label: stat.en.label },
        ar: { label: stat.ar.label },
      })),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateLocation = (id: string, field: string, value: string, lang?: "en" | "ar") => {
    setContact({
      ...contact,
      locations: contact.locations.map((l) =>
        l.id === id
          ? lang
            ? { ...l, [lang]: { ...l[lang], [field]: value } }
            : { ...l, [field]: value }
          : l
      ),
    })
  }

  const addLocation = () => {
    const newId = Date.now().toString()
    setContact({
      ...contact,
      locations: [
        ...contact.locations,
        {
          id: newId,
          phone: "",
          email: "",
          en: { city: "", address: "" },
          ar: { city: "", address: "" },
        },
      ],
    })
  }

  const removeLocation = (id: string) => {
    setContact({
      ...contact,
      locations: contact.locations.filter((l) => l.id !== id),
    })
  }

  const updateFooterStat = (id: string, field: string, value: string, lang?: "en" | "ar") => {
    // Update both footer.stats and kpis.items for backward compatibility
    setFooter({
      ...footer,
      stats: footer.stats.map((s) =>
        s.id === id
          ? lang
            ? { ...s, [lang]: { ...s[lang], [field]: value } }
            : { ...s, [field]: value }
          : s
      ),
    })
  }
  
  const handleSaveFooterStats = () => {
    // Sync footer stats to KPI items
    const kpisToUpdate = {
      ...content,
      kpis: {
        items: footer.stats.map((stat) => ({
          id: stat.id,
          value: stat.value,
          en: { label: stat.en.label },
          ar: { label: stat.ar.label },
        })),
      },
      footer: footer,
    }
    updateSection("kpis", kpisToUpdate.kpis)
    updateSection("footer", footer)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Footer & Contact Editor</h2>
          <p className="text-muted-foreground">Manage footer layout, links, and contact information</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="stats">Footer Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Main Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    value={contact.whatsapp}
                    onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Address (English)</Label>
                  <Textarea
                    value={contact.address.en}
                    onChange={(e) =>
                      setContact({ ...contact, address: { ...contact.address, en: e.target.value } })
                    }
                  />
                </div>
                <div>
                  <Label>Address (Arabic)</Label>
                  <Textarea
                    value={contact.address.ar}
                    onChange={(e) =>
                      setContact({ ...contact, address: { ...contact.address, ar: e.target.value } })
                    }
                    dir="rtl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={addLocation}>
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
          </div>

          {contact.locations.map((location) => (
            <Card key={location.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{location.en.city || "New Location"}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLocation(location.id)}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={location.phone}
                      onChange={(e) => updateLocation(location.id, "phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={location.email}
                      onChange={(e) => updateLocation(location.id, "email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">English</h4>
                    <div>
                      <Label>City</Label>
                      <Input
                        value={location.en.city}
                        onChange={(e) => updateLocation(location.id, "city", e.target.value, "en")}
                      />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Textarea
                        value={location.en.address}
                        onChange={(e) => updateLocation(location.id, "address", e.target.value, "en")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Arabic</h4>
                    <div>
                      <Label>City</Label>
                      <Input
                        value={location.ar.city}
                        onChange={(e) => updateLocation(location.id, "city", e.target.value, "ar")}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Textarea
                        value={location.ar.address}
                        onChange={(e) => updateLocation(location.id, "address", e.target.value, "ar")}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Footer Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {footer.stats.map((stat) => (
                <div key={stat.id} className="grid grid-cols-3 gap-4 border-b pb-4">
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => updateFooterStat(stat.id, "value", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Label (English)</Label>
                    <Input
                      value={stat.en.label}
                      onChange={(e) => updateFooterStat(stat.id, "label", e.target.value, "en")}
                    />
                  </div>
                  <div>
                    <Label>Label (Arabic)</Label>
                    <Input
                      value={stat.ar.label}
                      onChange={(e) => updateFooterStat(stat.id, "label", e.target.value, "ar")}
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
