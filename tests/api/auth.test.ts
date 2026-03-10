import { describe, it, expect, beforeAll } from 'vitest'

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

describe('Auth API', () => {
  it('POST /api/auth/login - succeeds with valid credentials', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'amaal2024' }),
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.username).toBe('admin')
    const cookie = res.headers.get('set-cookie')
    expect(cookie).toContain('admin_session_token')
  })

  it('POST /api/auth/login - rejects wrong password', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrongpassword' }),
    })
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })

  it('POST /api/auth/login - rejects wrong username', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'notadmin', password: 'amaal2024' }),
    })
    expect(res.status).toBe(401)
  })

  it('POST /api/auth/login - rejects empty body', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
  })

  it('GET /api/auth/session - returns authenticated with valid cookie', async () => {
    const cookie = await getSessionCookie()
    expect(cookie).toBeTruthy()
    const res = await fetch(`${BASE}/api/auth/session`, {
      headers: { Cookie: cookie },
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.authenticated).toBe(true)
  })

  it('GET /api/auth/session - returns unauthenticated without cookie', async () => {
    const res = await fetch(`${BASE}/api/auth/session`)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.authenticated).toBe(false)
  })

  it('POST /api/auth/logout - clears session', async () => {
    const cookie = await getSessionCookie()
    const res = await fetch(`${BASE}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: cookie },
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })
})
