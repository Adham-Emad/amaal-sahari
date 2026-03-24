import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth'
import { invalidateContentCache } from '@/lib/server-content'

// All page paths that have SEO metadata and must be revalidated after any content save
const ALL_PAGE_PATHS = [
  '/',
  '/about',
  '/contact',
  '/blog',
  '/news',
  '/careers',
  '/faqs',
  '/privacy',
  '/terms',
  '/services',
  '/case-studies',
]

function revalidateAllPages() {
  let count = 0
  try {
    // Revalidate the root layout — this cascades to all nested pages
    revalidatePath('/', 'layout')
    count++
  } catch (e) {
    console.warn('[v0] revalidatePath layout failed:', e)
  }
  for (const p of ALL_PAGE_PATHS) {
    try {
      revalidatePath(p, 'page')
      count++
    } catch (e) {
      console.warn('[v0] revalidatePath failed for', p, e)
    }
  }
  console.log('[v0] revalidatePath called for', count, 'paths — ISR cache cleared')
}

// File-based persistent storage with Hostinger optimization
const DATA_DIR = path.join(process.cwd(), 'data')
const CONTENT_FILE = path.join(DATA_DIR, 'content.json')
const BACKUP_FILE = path.join(DATA_DIR, 'content-backup.json')
const TEMP_DIR = path.join(DATA_DIR, '.tmp')

// Configuration for handling large files
const MAX_JSON_SIZE = 15 * 1024 * 1024 // 15MB limit before splitting
const CHUNK_SIZE = 512 * 1024 // 512KB chunks for writing
const WRITE_TIMEOUT = 45000 // 45 seconds timeout for write operations
const CLEAN_TEMP_INTERVAL = 300000 // Clean temp files every 5 minutes

// In-memory cache for fast reads (loaded from file on first access)
let cachedContent: any = null
let cacheLoaded = false
let lastModifiedTime = 0
let lastTempClean = 0

// Write lock to prevent concurrent writes
let isWriting = false
let writeQueue: Array<{ data: any; resolve: (val: boolean) => void; reject: (err: Error) => void }> = []

// Ensure data directory exists and has proper permissions
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o755 })
    }
    
    // Create temp directory for intermediate writes
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true, mode: 0o755 })
    }

    // Check write permissions
    try {
      fs.accessSync(DATA_DIR, fs.constants.W_OK)
      console.log('[v0] Data directory is writable')
    } catch {
      console.warn('[v0] Warning: Data directory may not be writable')
    }

    // Clean old temp files periodically
    const now = Date.now()
    if (now - lastTempClean > CLEAN_TEMP_INTERVAL) {
      cleanOldTempFiles()
      lastTempClean = now
    }
  } catch (error) {
    console.error('[v0] Failed to create/check data directory:', error)
  }
}

// Clean up orphaned temp files from Hostinger crashes
function cleanOldTempFiles() {
  try {
    if (!fs.existsSync(TEMP_DIR)) return
    
    const files = fs.readdirSync(TEMP_DIR)
    let cleaned = 0
    
    files.forEach(file => {
      try {
        const filePath = path.join(TEMP_DIR, file)
        const stat = fs.statSync(filePath)
        const ageMs = Date.now() - stat.mtimeMs
        
        // Delete temp files older than 1 hour
        if (ageMs > 3600000) {
          fs.unlinkSync(filePath)
          cleaned++
        }
      } catch (err) {
        console.warn('[v0] Could not clean temp file:', err)
      }
    })
    
    if (cleaned > 0) {
      console.log('[v0] Cleaned', cleaned, 'orphaned temp files')
    }
  } catch (error) {
    console.warn('[v0] Temp file cleanup error:', error)
  }
}

// Remove images/large base64 data from content for size calculation
function stripLargeData(obj: any): any {
  if (!obj) return obj
  
  if (typeof obj === 'string') {
    if (obj.startsWith('data:')) {
      return '[BASE64_IMAGE_STRIPPED]'
    }
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => stripLargeData(item))
  }
  
  if (typeof obj === 'object') {
    const result: any = {}
    for (const key of Object.keys(obj)) {
      if (key.includes('imageUrl') || key.includes('image') || key.includes('url') || key.includes('Url')) {
        result[key] = stripLargeData(obj[key])
      } else {
        result[key] = stripLargeData(obj[key])
      }
    }
    return result
  }
  
  return obj
}

// Load content from JSON file on disk
function loadFromFile(): any {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, 'utf-8')
      const parsed = JSON.parse(raw)
      lastModifiedTime = fs.statSync(CONTENT_FILE).mtimeMs
      console.log('[v0] Content loaded from disk file:', CONTENT_FILE, 'Size:', (raw.length / 1024).toFixed(1), 'KB')
      return parsed
    }
  } catch (error) {
    console.error('[v0] Failed to read main content file:', error)
    // Try backup file if main file is corrupted
    try {
      if (fs.existsSync(BACKUP_FILE)) {
        const raw = fs.readFileSync(BACKUP_FILE, 'utf-8')
        const parsed = JSON.parse(raw)
        console.log('[v0] Content recovered from backup file')
        return parsed
      }
    } catch (backupError) {
      console.error('[v0] Failed to read backup file too:', backupError)
    }
  }
  return null
}

// Smart write with Hostinger-specific error handling
function saveToFileChunked(data: any): boolean | Promise<boolean> {
  try {
    ensureDataDir()

    const jsonString = JSON.stringify(data, null, 2)
    const fileSize = jsonString.length / 1024 / 1024 // Size in MB

    console.log('[v0] Starting save operation - File size:', fileSize.toFixed(2), 'MB')

    // Create backup of existing file first
    if (fs.existsSync(CONTENT_FILE)) {
      try {
        const stat = fs.statSync(CONTENT_FILE)
        
        // Always create backup, but use temp location for large files
        if (stat.size > 20 * 1024 * 1024) {
          console.log('[v0] Large existing file - using temp backup')
          const tempBackup = path.join(TEMP_DIR, 'content-' + Date.now() + '.json.bak')
          fs.copyFileSync(CONTENT_FILE, tempBackup)
        } else {
          fs.copyFileSync(CONTENT_FILE, BACKUP_FILE)
        }
      } catch (backupErr) {
        console.warn('[v0] Backup creation warning (non-critical):', backupErr)
        // Don't fail the save if backup fails
      }
    }

    // Hostinger fix: Use separate temp directory for safety
    const tempFile = path.join(TEMP_DIR, 'content-write-' + Date.now() + '.json.tmp')
    
    // For large files, use stream-based writing to avoid memory issues
    const buffer = Buffer.from(jsonString, 'utf-8')
    
    if (buffer.length > MAX_JSON_SIZE) {
      console.log('[v0] Large file detected - using stream-based write')
      
      return new Promise((resolve) => {
        try {
          const stream = fs.createWriteStream(tempFile, { flags: 'w', mode: 0o644 })
          
          stream.on('error', (err) => {
            console.error('[v0] Stream write error:', err)
            try {
              fs.unlinkSync(tempFile)
            } catch (e) {
              /* ignore */
            }
            resolve(false)
          })
          
          stream.on('finish', () => {
            try {
              // Atomic rename: move temp to final location
              fs.renameSync(tempFile, CONTENT_FILE)
              console.log('[v0] Large file saved successfully via stream')
              resolve(true)
            } catch (renameErr) {
              console.error('[v0] Rename after stream failed:', renameErr)
              try {
                fs.unlinkSync(tempFile)
              } catch (e) {
                /* ignore */
              }
              resolve(false)
            }
          })
          
          stream.end(buffer, 'utf-8')
        } catch (err) {
          console.error('[v0] Stream creation failed:', err)
          resolve(false)
        }
      })
    } else {
      // For smaller files, write directly with proper error handling
      try {
        fs.writeFileSync(tempFile, jsonString, { encoding: 'utf-8', flag: 'w', mode: 0o644 })
        
        // Verify temp file was written correctly
        const tempStat = fs.statSync(tempFile)
        if (tempStat.size !== buffer.length) {
          throw new Error(`Temp file size mismatch: expected ${buffer.length}, got ${tempStat.size}`)
        }
        
        // Atomic rename
        fs.renameSync(tempFile, CONTENT_FILE)
        console.log('[v0] Content saved to disk - Size:', fileSize.toFixed(2), 'MB')
        return true
      } catch (writeErr) {
        console.error('[v0] Write error:', writeErr)
        
        // Cleanup failed temp file
        try {
          fs.unlinkSync(tempFile)
        } catch (e) {
          /* ignore */
        }
        
        // Hostinger fallback: Try alternative write path
        try {
          console.log('[v0] Attempting fallback write to:', CONTENT_FILE)
          fs.writeFileSync(CONTENT_FILE, jsonString, { encoding: 'utf-8', flag: 'w', mode: 0o644 })
          console.log('[v0] Fallback write succeeded')
          return true
        } catch (fallbackErr) {
          console.error('[v0] All write methods failed:', fallbackErr)
          return false
        }
      }
    }
  } catch (error) {
    console.error('[v0] Unexpected error in saveToFileChunked:', error)
    return false
  }
}

// Save content to JSON file on disk with proper async handling
async function saveToFile(data: any): Promise<boolean> {
  return new Promise((resolve) => {
    // Queue write operation if another write is in progress
    if (isWriting) {
      console.log('[v0] Write already in progress, queueing operation - Queue size:', writeQueue.length)
      writeQueue.push({
        data,
        resolve,
        reject: (err) => {
          console.error('[v0] Queued write rejected:', err)
          resolve(false)
        }
      })
      return
    }

    isWriting = true

    // Execute write with timeout
    const timeoutId = setTimeout(() => {
      console.error('[v0] Write operation timed out after', WRITE_TIMEOUT, 'ms')
      isWriting = false
      processWriteQueue()
      resolve(false)
    }, WRITE_TIMEOUT)

    try {
      const result = saveToFileChunked(data)
      
      // Handle both sync and async results
      if (result instanceof Promise) {
        result
          .then((writeSuccess) => {
            clearTimeout(timeoutId)
            if (writeSuccess) {
              cachedContent = data
              cacheLoaded = true
              console.log('[v0] Write succeeded (async), cache updated')
            }
            isWriting = false
            processWriteQueue()
            resolve(writeSuccess)
          })
          .catch((err) => {
            clearTimeout(timeoutId)
            console.error('[v0] Async write failed:', err)
            isWriting = false
            processWriteQueue()
            resolve(false)
          })
      } else {
        clearTimeout(timeoutId)
        if (result) {
          cachedContent = data
          cacheLoaded = true
          console.log('[v0] Write succeeded (sync), cache updated')
        }
        isWriting = false
        processWriteQueue()
        resolve(result)
      }
    } catch (err) {
      clearTimeout(timeoutId)
      console.error('[v0] Write exception:', err)
      isWriting = false
      processWriteQueue()
      resolve(false)
    }
  })
}

// Process queued write operations
function processWriteQueue() {
  if (writeQueue.length > 0 && !isWriting) {
    const next = writeQueue.shift()
    if (next) {
      saveToFile(next.data).then(next.resolve).catch(next.reject)
    }
  }
}

// Get content (from cache or load from file)
function getContent(): any {
  if (cacheLoaded && cachedContent !== null) {
    return cachedContent
  }

  // Cold start: load from disk file into memory cache
  ensureDataDir()
  cachedContent = loadFromFile()
  cacheLoaded = true
  return cachedContent
}

// GET: Load centralized content from persistent file storage
export async function GET(request: NextRequest) {
  try {
    const content = getContent()

    return NextResponse.json({
      success: true,
      data: content,
      timestamp: new Date().toISOString(),
      source: 'server-file-persistent',
      queuedOperations: writeQueue.length
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.warn('[v0] GET error:', error)
    return NextResponse.json({
      success: false,
      data: null,
      error: 'Failed to retrieve content'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0'
      }
    })
  }
}

export async function POST(request: NextRequest) {
  const isAuthed = await requireAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const startTime = Date.now()
    
    // Increase timeout for large payloads
    const contentLength = request.headers.get('content-length')
    const isLargePayload = contentLength ? parseInt(contentLength) > 5 * 1024 * 1024 : false
    
    if (isLargePayload) {
      console.log('[v0] Large payload detected:', (parseInt(contentLength!) / 1024 / 1024).toFixed(2), 'MB')
    }

    let body: any
    try {
      body = await request.json()
    } catch (jsonErr) {
      console.error('[v0] Failed to parse JSON:', jsonErr)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON payload. File may be too large for direct parsing.'
        },
        { status: 413 } // Payload Too Large
      )
    }

    const { data } = body

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'No data provided'
        },
        { status: 400 }
      )
    }

    console.log('[v0] Processing save request - Queue length:', writeQueue.length, 'Is writing:', isWriting)

    // Save to disk file (PERSISTENT across server restarts)
    const fileSaved = await saveToFile(data)
    const elapsed = Date.now() - startTime

    if (!fileSaved) {
      console.error('[v0] Save failed after', elapsed, 'ms - Write queue:', writeQueue.length)
      return NextResponse.json({
        success: false,
        error: 'Failed to save content to disk. The server may be overwhelmed. Try again in a few seconds.',
        queueLength: writeQueue.length,
        timestamp: new Date().toISOString(),
      }, { status: 503 }) // Service Unavailable
    }

    console.log('[v0] Save VERIFIED - content persisted to disk permanently in', elapsed, 'ms')
    invalidateContentCache()

    // Invalidate Next.js ISR cache so every page re-renders with fresh metadata
    // on the very next request — works with Hostinger's `next start` ISR setup.
    revalidateAllPages()

    return NextResponse.json({
      success: true,
      message: 'Content saved permanently to server disk - will persist across restarts',
      timestamp: new Date().toISOString(),
      source: 'server-file-persistent',
      elapsedMs: elapsed,
      queuedOperations: writeQueue.length
    }, { status: 200 })
  } catch (error) {
    console.error('[v0] POST /api/content error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save content'
      },
      { status: 500 }
    )
  }
}
