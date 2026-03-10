import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { createSessionToken, setSessionCookie } from '@/lib/auth'

const ADMIN_USERNAME = 'admin'
const CREDENTIALS_FILE = path.join(process.cwd(), '.admin-credentials.json')

function hashPassword(password: string, salt?: string): string {
  const useSalt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, useSalt, 100000, 64, 'sha512')
    .toString('hex')
  return `${useSalt}$${hash}`
}

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split('$')
    const hashToCompare = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex')
    return hash === hashToCompare
  } catch (error) {
    console.error('[v0] Password verification error:', error)
    return false
  }
}

function getAdminPasswordHash(): string {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8')
      const creds = JSON.parse(data)
      return creds.hashedPassword || creds.password
    }
  } catch (error) {
    console.error('[v0] Error reading credentials file:', error)
  }
  
  return ''
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    if (username !== ADMIN_USERNAME) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    const storedHash = getAdminPasswordHash()
    if (!storedHash) {
      return NextResponse.json(
        { error: 'No admin account configured. Please set up admin credentials.' },
        { status: 500 }
      )
    }

    const isValid = verifyPassword(password, storedHash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    const token = createSessionToken()
    const cookie = setSessionCookie(token)

    console.log('[v0] Admin login successful')
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      username: ADMIN_USERNAME,
    })

    response.cookies.set(cookie.name, cookie.value, cookie.options as any)

    return response
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[v0] Login API error:', errorMsg)
    
    return NextResponse.json(
      { error: 'Failed to process login' },
      { status: 500 }
    )
  }
}
