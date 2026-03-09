"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import FileUpload from "../file-upload"

export default function WhatsAppEditor() {
  const { content, updateSection } = useContent()
  const [whatsapp, setWhatsApp] = useState(content.whatsapp)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setWhatsApp(content.whatsapp)
  }, [content.whatsapp])

  const handleSave = () => {
    updateSection("whatsapp", whatsapp)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">WhatsApp Control</h2>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Configure the WhatsApp floating icon that appears on your website
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div>
              <Label className="text-base font-semibold">Enable WhatsApp Icon</Label>
              <p className="text-sm text-muted-foreground mt-1">Show/hide the floating WhatsApp button</p>
            </div>
            <button
              onClick={() => setWhatsApp({ ...whatsapp, enabled: !whatsapp.enabled })}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                whatsapp.enabled ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  whatsapp.enabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {whatsapp.enabled && (
            <>
              {/* Phone Number */}
              <div>
                <Label htmlFor="phone">WhatsApp Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={whatsapp.phoneNumber}
                  onChange={(e) => setWhatsApp({ ...whatsapp, phoneNumber: e.target.value })}
                  placeholder="+1234567890"
                />
                <p className="text-xs text-muted-foreground mt-1">Include country code</p>
              </div>

              {/* Pre-filled Message */}
              <div>
                <Label htmlFor="message">Pre-filled Message</Label>
                <Textarea
                  id="message"
                  value={whatsapp.prefilledMessage}
                  onChange={(e) => setWhatsApp({ ...whatsapp, prefilledMessage: e.target.value })}
                  placeholder="Message that appears in WhatsApp when user clicks"
                  rows={3}
                />
              </div>

              {/* Position */}
              <div>
                <Label>Icon Position</Label>
                <div className="flex gap-4 mt-2">
                  {(["left", "right"] as const).map((pos) => (
                    <label key={pos} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="position"
                        value={pos}
                        checked={whatsapp.position === pos}
                        onChange={() => setWhatsApp({ ...whatsapp, position: pos })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm capitalize">{pos}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Icon */}
              <div>
                <FileUpload
                  label="Custom WhatsApp Icon"
                  description="Upload custom icon (PNG, SVG) or leave empty for default"
                  value={whatsapp.customIconUrl}
                  onChange={(url) => setWhatsApp({ ...whatsapp, customIconUrl: url })}
                  accept="image/*"
                  fileType="image"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
