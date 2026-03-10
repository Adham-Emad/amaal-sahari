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

describe('SMTP Diagnostic API', () => {
  it('GET /api/auth/smtp-diagnostic - rejects without auth', async () => {
    const res = await fetch(`${BASE}/api/auth/smtp-diagnostic`)
    expect(res.status).toBe(401)
  })

  it('GET /api/auth/smtp-diagnostic - returns status with auth', async () => {
    const cookie = await getSessionCookie()
    const res = await fetch(`${BASE}/api/auth/smtp-diagnostic`, {
      headers: { Cookie: cookie },
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(['CONFIGURED', 'UNCONFIGURED']).toContain(json.status)
    expect(json.config).toBeDefined()
  })
})
