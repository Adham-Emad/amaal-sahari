import crypto from 'crypto'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'admin_session_token'
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is required')
  }
  return secret
}

export function createSessionToken(): string {
  const secret = getSessionSecret()
  const payload = {
    sub: 'admin',
    iat: Date.now(),
    exp: Date.now() + SESSION_EXPIRY_MS,
    jti: crypto.randomBytes(16).toString('hex'),
  }
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64url')
  return `${payloadB64}.${signature}`
}

export function verifySessionToken(token: string): boolean {
  try {
    const secret = getSessionSecret()
    const [payloadB64, signature] = token.split('.')
    if (!payloadB64 || !signature) return false

    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(payloadB64)
      .digest('base64url')

    if (signature !== expectedSig) return false

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
    if (payload.exp < Date.now()) return false

    return true
  } catch {
    return false
  }
}

export function setSessionCookie(token: string): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: SESSION_EXPIRY_MS / 1000,
    },
  }
}

export function clearSessionCookie(): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0,
    },
  }
}

export async function requireAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)
  if (!token?.value) return false
  return verifySessionToken(token.value)
}
