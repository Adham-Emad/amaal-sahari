"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  label: string
  description?: string
  value: string
  onChange: (url: string) => void
  accept?: string
  maxSize?: number
  fileType?: "image" | "video" | "any"
}

export default function FileUpload({
  label,
  description,
  value,
  onChange,
  accept = "image/*,video/*",
  maxSize = 50 * 1024 * 1024,
  fileType = "any",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [uploadedFileType, setUploadedFileType] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
      return
    }

    setError("")
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        try {
          const data = await response.json()
          throw new Error(data.error || `Upload failed (${response.status})`)
        } catch {
          throw new Error(`Upload failed (${response.status}). Please check your file and try again.`)
        }
      }

      const data = await response.json()
      onChange(data.url)
      setUploadedFileType(data.type)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput("")
    }
  }

  const isImage = fileType === "image" || (fileType === "any" && (uploadedFileType.startsWith("image/") || value.includes(".jpg") || value.includes(".png") || value.includes(".webp")))
  const isVideo = fileType === "video" || (fileType === "any" && (uploadedFileType.startsWith("video/") || value.includes(".mp4") || value.includes(".webm")))

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">{label}</Label>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>

      {/* Current Media Preview */}
      {value && (
        <Card className="p-4 bg-muted">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {isImage && (
                <div className="relative w-full h-40 bg-background rounded overflow-hidden">
                  <Image
                    src={value}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              {isVideo && (
                <video
                  src={value}
                  controls
                  className="w-full h-40 bg-background rounded"
                />
              )}
              {!isImage && !isVideo && (
                <p className="text-sm text-muted-foreground truncate">{value}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Upload Options */}
      <div className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload from Device
              </>
            )}
          </Button>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Or paste URL..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleUrlSubmit()
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  )
}
