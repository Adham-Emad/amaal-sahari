"use client"

import { useState, useEffect } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Plus, Trash2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import FileUpload from "../file-upload"

type SocialPlatform = "facebook" | "messenger" | "instagram" | "linkedin" | "twitter" | "youtube" | "tiktok" | "snapchat"
type Position = "header" | "footer" | "floating"

const platformOptions: SocialPlatform[] = ["facebook", "messenger", "instagram", "linkedin", "twitter", "youtube", "tiktok", "snapchat"]
const positionOptions: Position[] = ["header", "footer", "floating"]

export default function SocialMediaEditor() {
  const { content, updateSection } = useContent()
  const [socialMedia, setSocialMedia] = useState(content.socialMedia)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSocialMedia(content.socialMedia)
  }, [content.socialMedia])

  const handleSave = () => {
    updateSection("socialMedia", socialMedia)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateItem = (id: string, field: string, value: any) => {
    setSocialMedia({
      ...socialMedia,
      items: socialMedia.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })
  }

  const addItem = () => {
    const newId = Date.now().toString()
    setSocialMedia({
      ...socialMedia,
      items: [
        ...socialMedia.items,
        {
          id: newId,
          platform: "facebook",
          enabled: true,
          url: "",
          customIconUrl: "",
          position: "footer",
          openInNewTab: true,
        },
      ],
    })
  }

  const removeItem = (id: string) => {
    setSocialMedia({
      ...socialMedia,
      items: socialMedia.items.filter((item) => item.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Social Media Control</h2>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Manage all social media icons and links displayed on your website
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {socialMedia.items.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Platform Selection */}
                <div>
                  <Label htmlFor={`platform-${item.id}`}>Platform</Label>
                  <select
                    id={`platform-${item.id}`}
                    value={item.platform}
                    onChange={(e) => updateItem(item.id, "platform", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background mt-1"
                  >
                    {platformOptions.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <Label>Enabled</Label>
                  <button
                    onClick={() => updateItem(item.id, "enabled", !item.enabled)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      item.enabled ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        item.enabled ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {item.enabled && (
                  <>
                    {/* URL */}
                    <div>
                      <Label htmlFor={`url-${item.id}`}>Profile URL</Label>
                      <Input
                        id={`url-${item.id}`}
                        type="url"
                        value={item.url}
                        onChange={(e) => updateItem(item.id, "url", e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    {/* Position */}
                    <div>
                      <Label>Display Position</Label>
                      <div className="flex gap-3 mt-2 flex-wrap">
                        {positionOptions.map((pos) => (
                          <label key={pos} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`position-${item.id}`}
                              value={pos}
                              checked={item.position === pos}
                              onChange={() => updateItem(item.id, "position", pos)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm capitalize">{pos}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Open in New Tab */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                      <Label>Open Link in New Tab</Label>
                      <button
                        onClick={() => updateItem(item.id, "openInNewTab", !item.openInNewTab)}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          item.openInNewTab ? "bg-green-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            item.openInNewTab ? "translate-x-7" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Custom Icon */}
                    <FileUpload
                      label="Custom Icon"
                      description="Upload custom icon (PNG, SVG) or leave empty for default"
                      value={item.customIconUrl}
                      onChange={(url) => updateItem(item.id, "customIconUrl", url)}
                      accept="image/*"
                      fileType="image"
                    />
                  </>
                )}

                {/* Delete Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="w-full gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove {item.platform}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addItem} variant="outline" className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Add Social Media Link
        </Button>
      </div>
    </div>
  )
}
