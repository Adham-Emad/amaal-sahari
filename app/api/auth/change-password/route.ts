import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import crypto from 'crypto'
import { requireAuth } from '@/lib/auth'

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

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(CREDENTIALS_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read current credentials from file
const readCredentials = (): { username?: string; password?: string; hashedPassword?: string } | null => {
  try {
    ensureDataDir()
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8')
      const creds = JSON.parse(data)
      return creds
    }
  } catch (error) {
    console.error('[v0] Error reading credentials file:', error)
  }
  return null
}

// Write credentials to file
const writeCredentials = (username: string, plainPassword: string): boolean => {
  try {
    ensureDataDir()
    const hashedPassword = hashPassword(plainPassword)
    const credentials = {
      username,
      hashedPassword,
    }
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2))
    console.log('[v0] Credentials updated successfully')
    return true
  } catch (error) {
    console.error('[v0] Error writing credentials:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  const isAuthed = await requireAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action, username, currentPassword, newPassword } = body

    if (!action || !username) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const credentials = readCredentials()

    // CHANGE PASSWORD - requires current password verification
    if (action === 'change-password') {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, error: 'Current and new passwords are required' },
          { status: 400 }
        )
      }

      if (!credentials) {
        return NextResponse.json(
          { success: false, error: 'No credentials found. Please reset password first.' },
          { status: 400 }
        )
      }

      // Validate username - accept either stored username or default 'admin'
      const storedUsername = credentials.username || 'admin'
      if (username !== storedUsername) {
        console.error(`[v0] Username mismatch: received "${username}", expected "${storedUsername}"`)
        return NextResponse.json(
          { success: false, error: 'Invalid username' },
          { status: 403 }
        )
      }

      // Verify current password using hashed password field
      const hashedPasswordToCheck = credentials.hashedPassword || credentials.password
      if (!hashedPasswordToCheck) {
        return NextResponse.json(
          { success: false, error: 'Unable to verify current password' },
          { status: 500 }
        )
      }

      const isPasswordValid = verifyPassword(currentPassword, hashedPasswordToCheck)
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 403 }
        )
      }

      // Password is valid, update to new password
      // Ensure username is saved in credentials file
      const success = writeCredentials(username || 'admin', newPassword)
      if (!success) {
        return NextResponse.json(
          { success: false, error: 'Failed to update password' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Password changed successfully. Please login with your new password.',
        username,
      })
    }

    // VERIFY CURRENT PASSWORD - used by frontend to validate before change
    if (action === 'verify-current') {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password is required' },
          { status: 400 }
        )
      }

      if (!credentials) {
        return NextResponse.json(
          { success: false, error: 'No credentials found' },
          { status: 400 }
        )
      }

      const hashedPasswordToCheck = credentials.hashedPassword || credentials.password
      if (!hashedPasswordToCheck) {
        return NextResponse.json(
          { success: false, error: 'Unable to verify password' },
          { status: 500 }
        )
      }

      const isPasswordValid = verifyPassword(currentPassword, hashedPasswordToCheck)
      return NextResponse.json({
        success: isPasswordValid,
        message: isPasswordValid ? 'Password verified' : 'Password incorrect',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[v0] Change password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
