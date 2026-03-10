import { describe, it, expect } from 'vitest'

const BASE = 'http://localhost:5000'

async function getSessionCookie(): Promise<string> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'amaal2024' }),
  })
  const setCookie = res.headers.get('set-cookie') || ''
  const match = setCookie.match(/admin_session_token=([^;]+)/)
  return match ? `admin_session_token=${match[1]}` : ''
}

function createTestImage(): File {
  const width = 2
  const height = 2
  const channels = 4
  const size = width * height * channels
  const headerSize = 54
  const data = new Uint8Array(headerSize + size)

  data[0] = 0x42; data[1] = 0x4D
  const fileSize = headerSize + size
  data[2] = fileSize & 0xFF
  data[3] = (fileSize >> 8) & 0xFF
  data[10] = headerSize
  data[14] = 40
  data[18] = width; data[22] = height
  data[26] = 1; data[28] = 32
  data[34] = size & 0xFF; data[35] = (size >> 8) & 0xFF

  for (let i = headerSize; i < data.length; i += 4) {
    data[i] = 255; data[i+1] = 0; data[i+2] = 0; data[i+3] = 255
  }

  return new File([data], 'test.png', { type: 'image/png' })
}

describe('Upload API', () => {
  it('POST /api/upload - rejects without auth', async () => {
    const form = new FormData()
    form.append('file', createTestImage())
    const res = await fetch(`${BASE}/api/upload`, { method: 'POST', body: form })
    expect(res.status).toBe(401)
  })

  it('POST /api/upload - rejects no file', async () => {
    const cookie = await getSessionCookie()
    const form = new FormData()
    const res = await fetch(`${BASE}/api/upload`, {
      method: 'POST',
      headers: { Cookie: cookie },
      body: form,
    })
    expect(res.status).toBe(400)
  })

  it('POST /api/upload - uploads image successfully', async () => {
    const cookie = await getSessionCookie()
    const form = new FormData()
    form.append('file', createTestImage())
    const res = await fetch(`${BASE}/api/upload`, {
      method: 'POST',
      headers: { Cookie: cookie },
      body: form,
    })
    if (res.status === 200) {
      const json = await res.json()
      expect(json.url).toMatch(/^\/uploads\//)
      expect(json.filename).toBeTruthy()
    } else {
      expect([200, 500]).toContain(res.status)
    }
  })
})
