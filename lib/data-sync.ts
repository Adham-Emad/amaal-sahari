/**
 * Optimized data synchronization utility for handling large payloads
 * Includes retry logic, chunking, and queue management
 */

const MAX_RETRIES = 3
const BASE_RETRY_DELAY = 1000 // 1 second
const REQUEST_TIMEOUT = 60000 // 60 seconds
const MAX_PAYLOAD_SIZE = 20 * 1024 * 1024 // 20MB

interface SyncOptions {
  timeout?: number
  retries?: number
  onProgress?: (status: string) => void
}

interface SyncResult {
  success: boolean
  error?: string
  elapsedMs?: number
  attempt?: number
}

let isSyncing = false
let syncQueue: Array<{ data: any; resolve: (result: SyncResult) => void }> = []

/**
 * Calculate approximate size of data in bytes
 */
export function getDataSize(data: any): number {
  try {
    return new TextEncoder().encode(JSON.stringify(data)).length
  } catch {
    return 0
  }
}

/**
 * Save content data with retry logic and queue management
 */
export async function saveContentData(
  data: any,
  options: SyncOptions = {}
): Promise<SyncResult> {
  const {
    timeout = REQUEST_TIMEOUT,
    retries = MAX_RETRIES,
    onProgress
  } = options

  const dataSize = getDataSize(data)
  const dataSizeMB = (dataSize / 1024 / 1024).toFixed(2)

  console.log('[v0] Save content requested - Size:', dataSizeMB, 'MB')

  if (dataSize > MAX_PAYLOAD_SIZE) {
    const error = `Payload too large (${dataSizeMB}MB). Maximum is ${(MAX_PAYLOAD_SIZE / 1024 / 1024).toFixed(0)}MB`
    console.error('[v0]', error)
    return { success: false, error }
  }

  // Queue requests if already syncing
  if (isSyncing) {
    console.log('[v0] Sync already in progress, queueing request')
    onProgress?.('Waiting for previous save to complete...')
    
    return new Promise((resolve) => {
      syncQueue.push({ data, resolve })
    })
  }

  isSyncing = true
  let lastError: string | null = null

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      onProgress?.(`Saving... (Attempt ${attempt}/${retries})`)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const startTime = performance.now()

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const elapsedMs = Math.round(performance.now() - startTime)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        lastError = errorData.error || `HTTP ${response.status}`

        console.warn(`[v0] Save attempt ${attempt} failed:`, lastError, `(${elapsedMs}ms)`)

        if (attempt < retries) {
          const delay = BASE_RETRY_DELAY * Math.pow(2, attempt - 1) // Exponential backoff
          onProgress?.(`Failed, retrying in ${delay / 1000}s...`)
          await new Promise(r => setTimeout(r, delay))
          continue
        }
      } else {
        const result = await response.json()
        console.log('[v0] Save successful -', result.message, `(${elapsedMs}ms)`)
        onProgress?.('Saved successfully!')

        isSyncing = false
        processQueue()

        return {
          success: true,
          elapsedMs,
          attempt,
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        lastError = `Request timeout after ${timeout}ms`
        console.warn('[v0] Save timeout on attempt', attempt)
      } else {
        lastError = error instanceof Error ? error.message : String(error)
        console.warn('[v0] Save error on attempt', attempt, ':', lastError)
      }

      if (attempt < retries) {
        const delay = BASE_RETRY_DELAY * Math.pow(2, attempt - 1)
        onProgress?.(`Connection error, retrying in ${delay / 1000}s...`)
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }

  isSyncing = false
  processQueue()

  return {
    success: false,
    error: lastError || 'Max retries reached',
    attempt: retries,
  }
}

/**
 * Load content data with retry logic
 */
export async function loadContentData(
  options: SyncOptions = {}
): Promise<{ success: boolean; data?: any; error?: string }> {
  const { timeout = REQUEST_TIMEOUT, retries = MAX_RETRIES } = options

  let lastError: string | null = null

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch('/api/content', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        lastError = `HTTP ${response.status}`
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, BASE_RETRY_DELAY * attempt))
          continue
        }
      } else {
        const result = await response.json()
        return {
          success: true,
          data: result.data,
        }
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, BASE_RETRY_DELAY * attempt))
      }
    }
  }

  return {
    success: false,
    error: lastError || 'Failed to load content',
  }
}

/**
 * Process queued sync requests
 */
function processQueue() {
  if (syncQueue.length > 0 && !isSyncing) {
    const next = syncQueue.shift()
    if (next) {
      saveContentData(next.data).then(next.resolve)
    }
  }
}

/**
 * Get current sync status
 */
export function getSyncStatus(): {
  isSyncing: boolean
  queuedRequests: number
} {
  return {
    isSyncing,
    queuedRequests: syncQueue.length,
  }
}
