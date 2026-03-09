import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const ADMIN_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'amaal2024'
const CREDENTIALS_FILE = path.join(process.cwd(), '.admin-credentials.json')

// Simple secure password hashing using crypto (no native bindings needed)
function hashPassword(password: string, salt?: string): string {
  const useSalt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, useSalt, 100000, 64, 'sha512')
    .toString('hex')
  return `${useSalt}$${hash}`
}

// Verify password against hash
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

// Get stored password hash from file, or return default if not exists
function getAdminPasswordHash(): string {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8')
      const creds = JSON.parse(data)
      // Support both field names for backwards compatibility
      return creds.hashedPassword || creds.password
    }
  } catch (error) {
    console.error('[v0] Error reading credentials file:', error)
  }
  
  // Initialize with default password on first run
  try {
    const hashedDefault = hashPassword(DEFAULT_PASSWORD)
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify({
      username: ADMIN_USERNAME,
      hashedPassword: hashedDefault,
      updatedAt: new Date().toISOString(),
      initialized: true
    }, null, 2))
    console.log('[v0] Initialized credentials file with default password')
    return hashedDefault
  } catch (error) {
    console.error('[v0] Failed to initialize credentials:', error)
    return ''
  }
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

    // Check username
    if (username !== ADMIN_USERNAME) {
      console.log('[v0] Invalid username attempt:', username)
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Get stored password hash
    const storedHash = getAdminPasswordHash()
    if (!storedHash) {
      return NextResponse.json(
        { error: 'Authentication service error' },
        { status: 500 }
      )
    }

    // Compare password with hash
    const isValid = verifyPassword(password, storedHash)

    if (!isValid) {
      console.log('[v0] Invalid password attempt for user:', username)
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    console.log('[v0] Admin login successful')
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      username: ADMIN_USERNAME,
    })

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[v0] Login API error:', errorMsg)
    
    return NextResponse.json(
      { error: 'Failed to process login', details: errorMsg },
      { status: 500 }
    )
  }
}
