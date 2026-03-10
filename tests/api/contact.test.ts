import { describe, it, expect } from 'vitest'

const BASE = 'http://localhost:5000'

describe('Contact API', () => {
  it('POST /api/contact - submits valid contact form', async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        company: 'Test Corp',
        service: 'Cleaning',
        message: 'This is a test message from automated testing.',
      }),
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.message).toBeTruthy()
  })

  it('POST /api/contact - rejects missing name', async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        message: 'Test',
      }),
    })
    expect(res.status).toBe(400)
  })

  it('POST /api/contact - rejects missing email', async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        message: 'Test',
      }),
    })
    expect(res.status).toBe(400)
  })

  it('POST /api/contact - rejects missing message', async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        email: 'test@example.com',
      }),
    })
    expect(res.status).toBe(400)
  })

  it('POST /api/contact - rejects invalid email', async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        email: 'not-an-email',
        message: 'Test',
      }),
    })
    expect(res.status).toBe(400)
  })

  it('POST /api/contact - handles optional fields', async () => {
    const res = await fetch(`${BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Minimal User',
        email: 'minimal@example.com',
        message: 'Minimal test with no optional fields.',
      }),
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })
})
