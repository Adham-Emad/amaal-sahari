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

describe('Content API', () => {
  it('GET /api/content - returns content without auth', async () => {
    const res = await fetch(`${BASE}/api/content`)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.source).toBe('server-file-persistent')
  })

  it('GET /api/content - returns proper structure', async () => {
    const res = await fetch(`${BASE}/api/content`)
    const json = await res.json()
    if (json.data) {
      expect(json.data).toHaveProperty('hero')
      expect(json.data).toHaveProperty('services')
      expect(json.data).toHaveProperty('contact')
    }
  })

  it('POST /api/content - rejects without auth', async () => {
    const res = await fetch(`${BASE}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { test: true } }),
    })
    expect(res.status).toBe(401)
  })

  it('POST /api/content - saves with valid auth', async () => {
    const cookie = await getSessionCookie()
    const getRes = await fetch(`${BASE}/api/content`)
    const existing = await getRes.json()
    const data = existing.data || {}
    data._testMarker = Date.now()

    const res = await fetch(`${BASE}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ data }),
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)

    const verify = await fetch(`${BASE}/api/content`)
    const verifyJson = await verify.json()
    expect(verifyJson.data?._testMarker).toBe(data._testMarker)
  })

  it('POST /api/content - rejects empty data', async () => {
    const cookie = await getSessionCookie()
    const res = await fetch(`${BASE}/api/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })
})
