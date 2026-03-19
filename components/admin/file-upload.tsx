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

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = [
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
  'video/x-matroska', 'video/ogg', 'video/3gpp', 'video/x-ms-wmv',
]

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function FileUpload({
  label,
  description,
  value,
  onChange,
  accept = "image/*,video/*",
  maxSize,
  fileType = "any",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadingLabel, setUploadingLabel] = useState("Uploading...")
  const [error, setError] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [uploadedFileType, setUploadedFileType] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isVideoFile = file.type.startsWith("video/")
    const isImageFile = file.type.startsWith("image/")

    // Client-side MIME type check — catch bad types before any network request
    if (fileType === "image" && !isImageFile) {
      setError(`Please upload an image file (JPEG, PNG, WebP, GIF). Got: ${file.type || "unknown type"}`)
      return
    }
    if (fileType === "video" && !isVideoFile) {
      setError(`Please upload a video file (MP4, MOV, WebM, etc.). Got: ${file.type || "unknown type"}`)
      return
    }
    if (isImageFile && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(`Unsupported image type: ${file.type}. Please use JPEG, PNG, WebP, or GIF.`)
      return
    }
    if (isVideoFile && !ALLOWED_VIDEO_TYPES.includes(file.type) && !file.type.startsWith("video/")) {
      setError(`Unsupported file type: ${file.type}`)
      return
    }

    // Size limits: 5 MB for images, 200 MB for videos
    const effectiveMaxSize = maxSize ?? (isVideoFile ? 200 * 1024 * 1024 : 5 * 1024 * 1024)
    if (file.size > effectiveMaxSize) {
      setError(`File too large (${formatBytes(file.size)}). Maximum is ${formatBytes(effectiveMaxSize)}.`)
      return
    }

    setError("")
    setUploading(true)
    setUploadingLabel(
      isVideoFile
        ? `Uploading video (${formatBytes(file.size)}) — this may take a minute…`
        : `Uploading…`
    )

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || `Upload failed (${response.status})`)
      }

      const data = await response.json()
      onChange(data.url)
      setUploadedFileType(data.type || file.type)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.")
    } finally {
      setUploading(false)
      setUploadingLabel("Uploading...")
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput("")
    }
  }

  const isImage = fileType === "image" || (fileType === "any" && (uploadedFileType.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif)$/i.test(value)))
  const isVideo = fileType === "video" || (fileType === "any" && (uploadedFileType.startsWith("video/") || /\.(mp4|mov|webm|avi|mkv|ogv)$/i.test(value)))

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
                  <Image src={value} alt="Preview" fill className="object-contain" />
                </div>
              )}
              {isVideo && (
                <video src={value} controls className="w-full h-40 bg-background rounded" />
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
        {/* File Upload Button */}
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
                {uploadingLabel}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload from Device
              </>
            )}
          </Button>
          {uploading && (
            <p className="text-xs text-muted-foreground text-center">
              Please wait — do not close this page during upload.
            </p>
          )}
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Or paste a direct URL..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleUrlSubmit() }}
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim() || uploading}
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
