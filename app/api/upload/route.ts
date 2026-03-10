import { type NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { requireAuth } from '@/lib/auth'

export const maxDuration = 120

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')
const TEMP_UPLOADS_DIR = path.join(process.cwd(), 'data', 'temp-uploads')

function ensureUploadsDir() {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true, mode: 0o755 })
    }
    if (!fs.existsSync(TEMP_UPLOADS_DIR)) {
      fs.mkdirSync(TEMP_UPLOADS_DIR, { recursive: true, mode: 0o755 })
    }
  } catch (error) {
    console.error('[v0] Failed to create uploads directory:', error)
  }
}

const FORMAT_TO_EXT: Record<string, string> = {
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
  gif: 'gif',
}

const FORMAT_TO_MIME: Record<string, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

const MIME_TO_FORMAT: Record<string, string> = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

function generateFilename(outputFormat: string): string {
  const timestamp = Date.now()
  const random = crypto.randomBytes(4).toString('hex')
  const ext = FORMAT_TO_EXT[outputFormat] || 'png'
  return `${timestamp}-${random}.${ext}`
}

export async function POST(request: NextRequest) {
  const isAuthed = await requireAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('[v0] Upload endpoint called - NEW FILE STORAGE MODE')
    
    ensureUploadsDir()
    
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.error('[v0] No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('[v0] Processing file:', file.name, 'Type:', file.type, 'Size:', (file.size / 1024).toFixed(1), 'KB')

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const allowedVideoTypes = ['video/mp4', 'video/webm']
    const isImage = allowedImageTypes.includes(file.type)
    const isVideo = allowedVideoTypes.includes(file.type)

    if (!isImage && !isVideo) {
      console.error('[v0] Invalid file type:', file.type)
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM` },
        { status: 400 }
      )
    }

    const maxImageSize = 5 * 1024 * 1024
    const maxVideoSize = 50 * 1024 * 1024
    const maxSize = isVideo ? maxVideoSize : maxImageSize

    if (file.size > maxSize) {
      console.error('[v0] File too large:', (file.size / 1024 / 1024).toFixed(2), 'MB')
      const maxSizeDisplay = isVideo ? '50MB' : '5MB'
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is ${maxSizeDisplay}` },
        { status: 413 }
      )
    }

    try {
      const buffer = await file.arrayBuffer()
      let processedBuffer = Buffer.from(buffer)

      const outputFormat = MIME_TO_FORMAT[file.type] || 'png'
      const isGif = file.type === 'image/gif'

      if (isImage && !isGif) {
        console.log('[v0] Processing image as', outputFormat)
        try {
          processedBuffer = await sharp(processedBuffer)
            .rotate()
            .resize(2000, 2000, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .toFormat(outputFormat as keyof sharp.FormatEnum, { quality: 85 })
            .toBuffer()
          
          console.log('[v0] Image processed:', (processedBuffer.length / 1024).toFixed(1), 'KB')
        } catch (compressErr) {
          console.warn('[v0] Image processing failed, using original:', compressErr)
          processedBuffer = Buffer.from(buffer)
          return NextResponse.json({
            url: `/uploads/${generateFilename(outputFormat)}`,
            error: 'Image processing failed. Please try a different image.',
          }, { status: 500 })
        }
      } else if (isGif) {
        console.log('[v0] GIF detected, saving without processing')
      }

      const videoExtMap: Record<string, string> = { 'video/mp4': 'mp4', 'video/webm': 'webm' }
      const filename = isVideo
        ? `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${videoExtMap[file.type] || 'mp4'}`
        : generateFilename(outputFormat)
      const filepath = path.join(UPLOADS_DIR, filename)

      fs.writeFileSync(filepath, processedBuffer)
      
      const stat = fs.statSync(filepath)
      console.log('[v0] File saved to disk:', filename, 'Size:', (stat.size / 1024).toFixed(1), 'KB')

      const urlPath = `/uploads/${filename}`
      const finalMime = isVideo ? file.type : (FORMAT_TO_MIME[outputFormat] || file.type)

      return NextResponse.json({
        url: urlPath,
        filename: filename,
        originalName: file.name,
        size: file.size,
        processedSize: processedBuffer.length,
        type: finalMime,
        isFile: true,
      })
    } catch (conversionError) {
      console.error('[v0] File save failed:', conversionError)
      const errorMessage = conversionError instanceof Error ? conversionError.message : 'Unknown error'
      return NextResponse.json(
        { error: `File processing failed: ${errorMessage}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[v0] Upload error details:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[v0] Upload error message:', errorMessage)
    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
