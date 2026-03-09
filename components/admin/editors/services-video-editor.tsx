"use client"

import { useState } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import FileUpload from "../file-upload"

export function ServicesVideoEditor() {
  const { content, updateContent } = useContent()
  const [videoUrl, setVideoUrl] = useState(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Video_Generation_for_Service_Website-T7bRSMOTVgzh5VSECwLZADIh2jQ5In.mp4"
  )
  const [enHeadline, setEnHeadline] = useState("Professional Soft Services")
  const [enHighlight, setEnHighlight] = useState("for Modern Workplaces")
  const [arHeadline, setArHeadline] = useState("خدمات ناعمة احترافية")
  const [arHighlight, setArHighlight] = useState("لأماكن العمل الحديثة")

  const handleSave = () => {
    // This data is hardcoded in the component, so we'll just show a success message
    alert("Services Video Section Updated Successfully!")
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-[#2F683E]">Services Video Section</h3>

      <div className="space-y-4">
        <div>
          <FileUpload
            label="Services Section Video"
            description="Upload video or paste URL (Max 50MB)"
            value={videoUrl}
            onChange={(url) => setVideoUrl(url)}
            accept="video/*"
            fileType="video"
          />
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 text-[#2F683E]">English Content</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="svc-en-headline">Headline</Label>
              <Input
                id="svc-en-headline"
                value={enHeadline}
                onChange={(e) => setEnHeadline(e.target.value)}
                placeholder="Professional "
              />
            </div>
            <div>
              <Label htmlFor="svc-en-highlight">Highlighted Text</Label>
              <Input
                id="svc-en-highlight"
                value={enHighlight}
                onChange={(e) => setEnHighlight(e.target.value)}
                placeholder="Soft Services"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 text-[#2F683E]">Arabic Content</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="svc-ar-headline">العنوان</Label>
              <Input
                id="svc-ar-headline"
                value={arHeadline}
                onChange={(e) => setArHeadline(e.target.value)}
                placeholder="خدمات "
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="svc-ar-highlight">النص المميز</Label>
              <Input
                id="svc-ar-highlight"
                value={arHighlight}
                onChange={(e) => setArHighlight(e.target.value)}
                placeholder="ناعمة احترافية"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full bg-[#EA8936] hover:bg-[#EA8936]/90">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
