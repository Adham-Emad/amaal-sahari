"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Mail, Phone, MapPin, MessageCircle, Plus, Trash2 } from "lucide-react"

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contact Information</h2>
          <p className="text-muted-foreground">Manage all business contact details and locations</p>
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
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* Main Contact */}
        <TabsContent value="main" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email
                </CardTitle>
                <CardDescription>Primary contact email</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="info@company.com"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Phone
                </CardTitle>
                <CardDescription>Primary phone number</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="+966 50 000 0000"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </CardTitle>
                <CardDescription>WhatsApp contact number</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={contact.whatsapp || ""}
                    onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                    placeholder="+966 50 000 0000"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Main Address
              </CardTitle>
              <CardDescription>Business address in both languages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address-en">English Address</Label>
                  <Input
                    id="address-en"
                    value={contact.address.en}
                    onChange={(e) =>
                      setContact({ ...contact, address: { ...contact.address, en: e.target.value } })
                    }
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address-ar">Arabic Address</Label>
                  <Input
                    id="address-ar"
                    value={contact.address.ar}
                    onChange={(e) =>
                      setContact({ ...contact, address: { ...contact.address, ar: e.target.value } })
                    }
                    placeholder="المدينة، البلد"
                    dir="rtl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multiple Locations</CardTitle>
              <CardDescription>Add and manage branch office locations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contact.locations && contact.locations.length > 0 ? (
                contact.locations.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Phone</Label>
                        <Input value={location.phone} placeholder="+966..." readOnly />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={location.email} placeholder="email@company.com" readOnly />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {location.en?.city || "Location"} - {location.ar?.city}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No additional locations configured</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication */}
        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Channels</CardTitle>
              <CardDescription>Manage how customers can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Support
                  </h4>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                  <p className="text-xs text-muted-foreground">Primary email for customer inquiries</p>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Support
                  </h4>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  <p className="text-xs text-muted-foreground">Available during business hours</p>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </h4>
                  <p className="text-sm text-muted-foreground">{contact.whatsapp || "Not configured"}</p>
                  <p className="text-xs text-muted-foreground">Instant messaging support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information Preview</CardTitle>
              <CardDescription>How your contact info will appear on the website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{contact.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">{contact.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <p className="font-semibold">{contact.whatsapp || "Not set"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address (English)</p>
                  <p className="font-semibold">{contact.address.en}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address (Arabic)</p>
                  <p className="font-semibold text-right" dir="rtl">{contact.address.ar}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
