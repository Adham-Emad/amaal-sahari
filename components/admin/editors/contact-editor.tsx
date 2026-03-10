"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Mail, Phone, MapPin, MessageCircle, Plus, Trash2, Map } from "lucide-react"

export default function ContactEditor() {
  const { content, updateSection } = useContent()
  const [contact, setContact] = useState(content.contact)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setContact(content.contact)
  }, [content.contact])

  const handleSave = () => {
    updateSection("contact", contact)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addLocation = () => {
    const newLocation = {
      id: `loc_${Date.now()}`,
      phone: "",
      email: "",
      en: { city: "", address: "" },
      ar: { city: "", address: "" },
    }
    setContact({ ...contact, locations: [...(contact.locations || []), newLocation] })
  }

  const removeLocation = (id: string) => {
    setContact({ ...contact, locations: contact.locations.filter((l) => l.id !== id) })
  }

  const updateLocation = (id: string, field: string, value: string) => {
    setContact({
      ...contact,
      locations: contact.locations.map((l) => {
        if (l.id !== id) return l
        if (field.startsWith("en.") || field.startsWith("ar.")) {
          const [locale, key] = field.split(".")
          return { ...l, [locale]: { ...l[locale as "en" | "ar"], [key]: value } }
        }
        return { ...l, [field]: value }
      }),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contact Information</h2>
          <p className="text-muted-foreground">Manage all business contact details, locations, and map</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="main">Main Contact</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5" />Email</CardTitle>
                <CardDescription>Primary contact email</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="info@company.com" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Phone className="w-5 h-5" />Phone</CardTitle>
                <CardDescription>Primary phone number</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+971 50 000 0000" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5" />WhatsApp</CardTitle>
                <CardDescription>WhatsApp contact number</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input id="whatsapp" type="tel" value={contact.whatsapp || ""} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} placeholder="+971 50 000 0000" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" />Main Address</CardTitle>
              <CardDescription>Business address in both languages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>English Address</Label>
                  <Input value={contact.address.en} onChange={(e) => setContact({ ...contact, address: { ...contact.address, en: e.target.value } })} placeholder="City, Country" />
                </div>
                <div className="space-y-2">
                  <Label>Arabic Address</Label>
                  <Input value={contact.address.ar} onChange={(e) => setContact({ ...contact, address: { ...contact.address, ar: e.target.value } })} placeholder="المدينة، البلد" dir="rtl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Branch Locations</CardTitle>
                  <CardDescription>Add and manage branch office locations shown on the contact page</CardDescription>
                </div>
                <Button onClick={addLocation} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Location
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {contact.locations && contact.locations.length > 0 ? (
                contact.locations.map((location, index) => (
                  <div key={location.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Location {index + 1}</h4>
                      <Button variant="ghost" size="sm" onClick={() => removeLocation(location.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>City (English)</Label>
                        <Input value={location.en?.city || ""} onChange={(e) => updateLocation(location.id, "en.city", e.target.value)} placeholder="Dubai" />
                      </div>
                      <div className="space-y-2">
                        <Label>City (Arabic)</Label>
                        <Input value={location.ar?.city || ""} onChange={(e) => updateLocation(location.id, "ar.city", e.target.value)} placeholder="دبي" dir="rtl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Address (English)</Label>
                        <Input value={location.en?.address || ""} onChange={(e) => updateLocation(location.id, "en.address", e.target.value)} placeholder="Street, Area" />
                      </div>
                      <div className="space-y-2">
                        <Label>Address (Arabic)</Label>
                        <Input value={location.ar?.address || ""} onChange={(e) => updateLocation(location.id, "ar.address", e.target.value)} placeholder="شارع، منطقة" dir="rtl" />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input value={location.phone || ""} onChange={(e) => updateLocation(location.id, "phone", e.target.value)} placeholder="+971 4 XXX XXXX" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={location.email || ""} onChange={(e) => updateLocation(location.id, "email", e.target.value)} placeholder="branch@company.com" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No locations configured. Click "Add Location" to add a branch office.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Map className="w-5 h-5" />Google Maps Embed</CardTitle>
              <CardDescription>Paste your Google Maps embed URL here. Go to Google Maps, find your location, click Share, choose Embed, and copy the src URL from the iframe code.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Map Embed URL</Label>
                <Textarea
                  value={contact.mapEmbedUrl || ""}
                  onChange={(e) => setContact({ ...contact, mapEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  rows={3}
                />
              </div>
              {(contact.mapEmbedUrl) && (
                <div className="border rounded-lg overflow-hidden">
                  <p className="text-xs text-muted-foreground p-2 bg-muted">Preview:</p>
                  <iframe src={contact.mapEmbedUrl} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information Preview</CardTitle>
              <CardDescription>How your contact info will appear on the website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-muted-foreground">Email</p><p className="font-semibold">{contact.email}</p></div>
                  <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-semibold">{contact.phone}</p></div>
                  <div><p className="text-sm text-muted-foreground">WhatsApp</p><p className="font-semibold">{contact.whatsapp || "Not set"}</p></div>
                </div>
                <div><p className="text-sm text-muted-foreground">Address (English)</p><p className="font-semibold">{contact.address.en}</p></div>
                <div><p className="text-sm text-muted-foreground">Address (Arabic)</p><p className="font-semibold text-right" dir="rtl">{contact.address.ar}</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
