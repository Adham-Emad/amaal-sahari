import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

// Store reset tokens in memory with dual approval tracking
const resetTokens = new Map<string, { 
  email: string
  token: string
  expiresAt: number
  used: boolean
  usedAt?: number
  adminApprovalToken?: string
  adminApproved?: boolean
  adminApprovedAt?: number
  adminApprovalEmailSent?: boolean
}>()

const ADMIN_EMAIL = 'admin@amaalsahari.com'
const CREDENTIALS_FILE = path.join(process.cwd(), '.admin-credentials.json')

// Simple secure password hashing using crypto (no native bindings needed)
function hashPassword(password: string, salt?: string): string {
  const useSalt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, useSalt, 100000, 64, 'sha512')
    .toString('hex')
  return `${useSalt}$${hash}`
}

// Get SMTP settings from environment
function getSMTPConfig() {
  if (
    process.env.HOSTINGER_SMTP_HOST &&
    process.env.HOSTINGER_SMTP_USER &&
    process.env.HOSTINGER_SMTP_PASS
  ) {
    return {
      host: process.env.HOSTINGER_SMTP_HOST,
      port: parseInt(process.env.HOSTINGER_SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.HOSTINGER_SMTP_USER,
        pass: process.env.HOSTINGER_SMTP_PASS,
      },
    }
  }
  return null
}

// Send email helper
async function sendEmail(to: string, subject: string, html: string, text: string) {
  const smtpConfig = getSMTPConfig()
  if (!smtpConfig) return false

  try {
    const transporter = nodemailer.createTransport(smtpConfig)
    const fromEmail = process.env.HOSTINGER_FROM_EMAIL || smtpConfig.auth.user

    await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
      text,
    })
    return true
  } catch (error) {
    console.error('[v0] Email send failed:', error)
    return false
  }
}

// Save password globally to file (not localStorage which is browser-only)
async function savePasswordGlobally(hashedPassword: string) {
  try {
    const credentials = {
      username: 'admin', // Ensure username is always stored
      password: hashedPassword,
      hashedPassword: hashedPassword, // Store in both fields for compatibility
      updatedAt: new Date().toISOString(),
    }
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2))
    console.log('[v0] Admin password saved globally with username field')
    return true
  } catch (error) {
    console.error('[v0] Failed to save password:', error)
    return false
  }
}

// Get stored password from file
function getStoredPassword(): string | null {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8')
      const creds = JSON.parse(data)
      return creds.password
    }
  } catch (error) {
    console.error('[v0] Failed to read stored password:', error)
  }
  return null
}

// Handle GET requests for approval links
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get('action')
    const token = url.searchParams.get('token')

    if (action === 'approve-admin' && token) {
      // Process approval from email link (GET request)
      const approvalToken = token
      let foundTokenData = null
      let foundResetToken = null

      // Find the reset token that matches this approval token
      for (const [resetToken, data] of resetTokens.entries()) {
        if (data.adminApprovalToken === approvalToken) {
          foundResetToken = resetToken
          foundTokenData = data
          break
        }
      }

      if (!foundTokenData || foundTokenData.expiresAt < Date.now()) {
        return NextResponse.json(
          { error: 'Invalid or expired approval link' },
          { status: 400 }
        )
      }

      if (foundTokenData.adminApproved) {
        return NextResponse.json(
          { error: 'This reset has already been approved' },
          { status: 400 }
        )
      }

      // Mark as admin approved
      foundTokenData.adminApproved = true
      foundTokenData.adminApprovedAt = Date.now()
      resetTokens.set(foundResetToken, foundTokenData)

      // Send notification to user that admin approved
      const userApprovedHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #d4edda; padding: 20px; border-radius: 8px; border: 1px solid #28a745;">
          <h2 style="color: #155724; margin-bottom: 20px;">Password Reset Approved</h2>
          <p style="color: #155724; line-height: 1.6;">The admin has approved your password reset request.</p>
          <p style="color: #155724; margin: 20px 0;">You can now proceed with resetting your password using your reset link.</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Your reset link remains valid for 1 hour from the original request time.
          </p>
        </div>
      `

      const userApprovedText = `Password Reset Approved\n\nThe admin has approved your password reset request.\nYou can now proceed with resetting your password.`

      await sendEmail(foundTokenData.email, 'Password Reset Approved - Amaal Sahari Admin', userApprovedHtml, userApprovedText)

      console.log('[v0] Admin approved password reset:', foundTokenData.email)

      return NextResponse.json({
        success: true,
        message: 'Password reset approved successfully. User has been notified. You can close this page.',
      })
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[v0] Approval GET error:', errorMsg)
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, action, newPassword, token } = body

    if (action === 'request-reset') {
      // Validate email
      if (!email || !email.includes('@')) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        )
      }

      // Security: Only allow admin email (don't reveal which email is correct)
      if (email !== ADMIN_EMAIL) {
        console.log('[v0] Reset attempt with non-admin email:', email)
        return NextResponse.json(
          { error: 'Invalid email address. Please check and try again.' },
          { status: 403 }
        )
      }

      // Generate reset token and separate admin approval token
      const resetToken = crypto.randomBytes(32).toString('hex')
      const adminApprovalToken = crypto.randomBytes(32).toString('hex')
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const resetUrl = `${baseUrl}/admin/forgot-password?token=${resetToken}`
      const adminApprovalUrl = `${baseUrl}/api/auth/reset-password?action=approve-admin&token=${adminApprovalToken}`

      // Store token with 1 hour expiration and admin approval tracking
      resetTokens.set(resetToken, {
        email,
        token: resetToken,
        expiresAt: Date.now() + 3600000, // 1 hour
        used: false,
        adminApprovalToken,
        adminApproved: false,
      })

      console.log('[v0] Password reset requested for:', email)

      // Send email to user
      const userEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
          <h2 style="color: #2d5016; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #555; line-height: 1.6;">We received a request to reset your admin password for Amaal Sahari Admin Panel.</p>
          <p style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This link will expire in 1 hour for security.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="color: #999; font-size: 11px;">
            If you didn't request this password reset, please ignore this email and your password will remain unchanged.
          </p>
        </div>
      `

      const userEmailText = `Password Reset Request\n\nClick the link to reset your password:\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`

      // Send email to admin notification with APPROVAL REQUEST
      const adminEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffc107;">
          <h2 style="color: #856404; margin-bottom: 20px;">Admin Approval Required: Password Reset Request</h2>
          <p style="color: #555; line-height: 1.6;">A password reset request has been initiated for the Amaal Sahari Admin Panel. Your approval is required to proceed.</p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Reset Requested From:</strong> ${email}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> <span style="color: #d9534f; font-weight: bold;">AWAITING YOUR APPROVAL</span></p>
          </div>
          <p style="color: #555; margin: 20px 0;">
            <strong>To approve this password reset, click the button below:</strong>
          </p>
          <p style="margin: 20px 0;">
            <a href="${adminApprovalUrl}" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
              Approve Password Reset
            </a>
          </p>
          <p style="color: #d9534f; font-weight: bold; margin-top: 20px;">Security Warning:</p>
          <ul style="color: #555;">
            <li>Only click approve if YOU initiated this request</li>
            <li>If you did not request this, click reject below (or do nothing)</li>
            <li>This link expires in 1 hour</li>
            <li>Do not share this email</li>
          </ul>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="color: #999; font-size: 11px;">
            This is an automated security approval request. Do not forward this email.
          </p>
        </div>
      `

      const adminEmailText = `Admin Approval Required: Password Reset Request\n\nA password reset has been requested.\nEmail: ${email}\nTime: ${new Date().toLocaleString()}\n\nApprove this request: ${adminApprovalUrl}\n\nOnly approve if YOU initiated this request.`

      // Send ONLY the reset email to user first
      // Admin approval email will be sent AFTER admin is found and ready to approve
      const smtpConfig = getSMTPConfig()
      if (!smtpConfig) {
        return NextResponse.json({
          success: false,
          error: 'Email service is not configured. Password reset requires SMTP settings. Please contact the administrator.',
        }, { status: 503 })
      }

      // Send ONLY the reset email to user (admin approval email will be sent when user accesses the reset link)
      const userEmailSent = await sendEmail(email, 'Password Reset Request - Amaal Sahari Admin', userEmailHtml, userEmailText)

      if (!userEmailSent) {
        console.error('[v0] Failed to send user reset email')
        return NextResponse.json({
          success: false,
          error: 'Failed to send reset link. Please check SMTP configuration and try again.',
        }, { status: 500 })
      }

      console.log('[v0] Password reset email sent to user. Admin approval email will be sent when user verifies token.')

      return NextResponse.json({
        success: true,
        message: 'Reset link has been sent to your email address.',
      })

    } else if (action === 'approve-admin') {
      // Admin approval endpoint
      const approvalToken = token
      let foundTokenData = null
      let foundResetToken = null

      // Find the reset token that matches this approval token
      for (const [resetToken, data] of resetTokens.entries()) {
        if (data.adminApprovalToken === approvalToken) {
          foundResetToken = resetToken
          foundTokenData = data
          break
        }
      }

      if (!foundTokenData || foundTokenData.expiresAt < Date.now()) {
        return NextResponse.json(
          { error: 'Invalid or expired approval link' },
          { status: 400 }
        )
      }

      if (foundTokenData.adminApproved) {
        return NextResponse.json(
          { error: 'This reset has already been approved' },
          { status: 400 }
        )
      }

      // Mark as admin approved
      foundTokenData.adminApproved = true
      foundTokenData.adminApprovedAt = Date.now()
      resetTokens.set(foundResetToken, foundTokenData)

      // Send notification to user that admin approved
      const userApprovedHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #d4edda; padding: 20px; border-radius: 8px; border: 1px solid #28a745;">
          <h2 style="color: #155724; margin-bottom: 20px;">Password Reset Approved</h2>
          <p style="color: #155724; line-height: 1.6;">The admin has approved your password reset request.</p>
          <p style="color: #155724; margin: 20px 0;">You can now proceed with resetting your password using your reset link.</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Your reset link remains valid for 1 hour from the original request time.
          </p>
        </div>
      `

      const userApprovedText = `Password Reset Approved\n\nThe admin has approved your password reset request.\nYou can now proceed with resetting your password.`

      await sendEmail(foundTokenData.email, 'Password Reset Approved - Amaal Sahari Admin', userApprovedHtml, userApprovedText)

      console.log('[v0] Admin approved password reset:', foundTokenData.email)

      return NextResponse.json({
        success: true,
        message: 'Password reset approved. User has been notified.',
      })

    } else if (action === 'verify-token') {
      const tokenData = resetTokens.get(token)

      if (!tokenData || tokenData.expiresAt < Date.now()) {
        return NextResponse.json(
          { error: 'Invalid or expired reset token' },
          { status: 400 }
        )
      }

      if (tokenData.used) {
        return NextResponse.json(
          { error: 'This reset link has already been used' },
          { status: 400 }
        )
      }

      // Send admin approval email ONLY when user verifies the reset token
      // This ensures emails are sent in sequence: reset -> admin approval -> confirmation
      if (!tokenData.adminApprovalEmailSent) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const adminApprovalUrl = `${baseUrl}/api/auth/reset-password?action=approve-admin&token=${tokenData.adminApprovalToken}`

        const adminEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff3cd; padding: 20px; border-radius: 8px; border: 1px solid #ffc107;">
            <h2 style="color: #856404; margin-bottom: 20px;">Admin Approval Required: Password Reset Request</h2>
            <p style="color: #555; line-height: 1.6;">A password reset request has been initiated for the Amaal Sahari Admin Panel. Your approval is required to proceed.</p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p><strong>Reset Requested From:</strong> ${tokenData.email}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Status:</strong> <span style="color: #d9534f; font-weight: bold;">AWAITING YOUR APPROVAL</span></p>
            </div>
            <p style="color: #555; margin: 20px 0;">
              <strong>To approve this password reset, click the button below:</strong>
            </p>
            <p style="margin: 20px 0;">
              <a href="${adminApprovalUrl}" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
                Approve Password Reset
              </a>
            </p>
            <p style="color: #d9534f; font-weight: bold; margin-top: 20px;">Security Warning:</p>
            <ul style="color: #555;">
              <li>Only click approve if YOU initiated this request</li>
              <li>If you did not request this, click reject below (or do nothing)</li>
              <li>This link expires in 1 hour</li>
              <li>Do not share this email</li>
            </ul>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
            <p style="color: #999; font-size: 11px;">
              This is an automated security approval request. Do not forward this email.
            </p>
          </div>
        `

        const adminEmailText = `Admin Approval Required: Password Reset Request\n\nA password reset has been requested.\nEmail: ${tokenData.email}\nTime: ${new Date().toLocaleString()}\n\nApprove this request: ${adminApprovalUrl}\n\nOnly approve if YOU initiated this request.`

        // Send admin approval request email (non-blocking, fire and forget)
        sendEmail(ADMIN_EMAIL, 'Admin Approval Required: Password Reset Request - Amaal Sahari', adminEmailHtml, adminEmailText).then(() => {
          console.log('[v0] Admin approval email sent after user verified token')
        }).catch(err => {
          console.error('[v0] Failed to send admin approval email:', err)
        })

        // Mark that we sent the approval email
        tokenData.adminApprovalEmailSent = true
        resetTokens.set(token, tokenData)
      }

      // CRITICAL: Check if admin has approved this request
      if (!tokenData.adminApproved) {
        return NextResponse.json(
          { error: 'Awaiting admin approval. Please check your email for the approval notification.' },
          { status: 403 }
        )
      }

      return NextResponse.json({
        success: true,
        email: tokenData.email,
        adminApproved: true,
      })

    } else if (action === 'confirm-reset') {
      // Validate inputs
      if (!token || !newPassword) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      const tokenData = resetTokens.get(token)

      // Verify token validity
      if (!tokenData || tokenData.expiresAt < Date.now()) {
        return NextResponse.json(
          { error: 'Invalid or expired reset token' },
          { status: 400 }
        )
      }

      // Check if already used
      if (tokenData.used) {
        return NextResponse.json(
          { error: 'This reset link has already been used' },
          { status: 400 }
        )
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }

      try {
        // Hash password with PBKDF2 (pure JavaScript, no native bindings)
        const hashedPassword = hashPassword(newPassword)

        // Save globally to file (backend) - this affects ALL users
        const saved = await savePasswordGlobally(hashedPassword)
        if (!saved) {
          return NextResponse.json(
            { error: 'Failed to save password. Please try again.' },
            { status: 500 }
          )
        }

        // Mark token as used
        tokenData.used = true
        tokenData.usedAt = Date.now()
        resetTokens.set(token, tokenData)

        // Send confirmation email to user
        const userConfirmHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #d4edda; padding: 20px; border-radius: 8px; border: 1px solid #28a745;">
            <h2 style="color: #155724; margin-bottom: 20px;">Password Reset Successful</h2>
            <p style="color: #155724; line-height: 1.6;">Your admin password has been successfully reset.</p>
            <p style="color: #155724; margin: 20px 0;">You can now log in with your new password.</p>
            <p style="color: #999; font-size: 12px;">
              <strong>If you did not make this change:</strong> Contact support immediately as your account may have been compromised.
            </p>
          </div>
        `

        const userConfirmText = `Password Reset Successful\n\nYour admin password has been successfully reset.\nYou can now log in with your new password.`

        // Send confirmation email to admin
        const adminConfirmHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #d4edda; padding: 20px; border-radius: 8px; border: 1px solid #28a745;">
            <h2 style="color: #155724; margin-bottom: 20px;">Admin Password Changed Successfully</h2>
            <p style="color: #155724; line-height: 1.6;">The admin password for Amaal Sahari Admin Panel has been changed.</p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p><strong>Changed At:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Changed From Email:</strong> ${tokenData.email}</p>
            </div>
            <p style="color: #155724; margin-top: 20px;">All admin sessions will need to re-authenticate with the new password for security.</p>
          </div>
        `

        const adminConfirmText = `Admin Password Changed Successfully\n\nThe admin password has been changed.\nChanged at: ${new Date().toLocaleString()}`

        await sendEmail(tokenData.email, 'Password Reset Confirmed - Amaal Sahari Admin', userConfirmHtml, userConfirmText)
        await sendEmail(ADMIN_EMAIL, 'Admin Password Changed - Amaal Sahari', adminConfirmHtml, adminConfirmText)

        console.log('[v0] Password reset completed and saved globally')

        return NextResponse.json({
          success: true,
          message: 'Password has been reset successfully. Confirmation emails sent.',
        })

      } catch (error) {
        console.error('[v0] Password reset error:', error)
        return NextResponse.json(
          { error: 'Failed to reset password. Please try again.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[v0] Reset password API error:', errorMsg)

    return NextResponse.json(
      { error: 'Failed to process request', details: errorMsg },
      { status: 500 }
    )
  }
}
