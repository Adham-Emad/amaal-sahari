import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET(request: NextRequest) {
  // Check if SMTP env variables exist
  const smtpHost = process.env.HOSTINGER_SMTP_HOST
  const smtpPort = process.env.HOSTINGER_SMTP_PORT
  const smtpUser = process.env.HOSTINGER_SMTP_USER
  const smtpPass = process.env.HOSTINGER_SMTP_PASS
  const fromEmail = process.env.HOSTINGER_FROM_EMAIL

  console.log('[v0] SMTP Config Check:')
  console.log('[v0] Host:', smtpHost ? 'SET' : 'MISSING')
  console.log('[v0] Port:', smtpPort ? 'SET' : 'MISSING')
  console.log('[v0] User:', smtpUser ? 'SET' : 'MISSING')
  console.log('[v0] Pass:', smtpPass ? 'SET' : 'MISSING')
  console.log('[v0] From Email:', fromEmail ? 'SET' : 'MISSING')

  // Return config status
  return NextResponse.json({
    smtpConfigured: {
      host: !!smtpHost,
      port: !!smtpPort,
      user: !!smtpUser,
      pass: !!smtpPass,
      fromEmail: !!fromEmail,
    },
    envVars: {
      HOSTINGER_SMTP_HOST: smtpHost || 'NOT SET',
      HOSTINGER_SMTP_PORT: smtpPort || 'NOT SET',
      HOSTINGER_SMTP_USER: smtpUser ? smtpUser.substring(0, 5) + '***' : 'NOT SET',
      HOSTINGER_FROM_EMAIL: fromEmail || 'NOT SET',
    },
  })
}
