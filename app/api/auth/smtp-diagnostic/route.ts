import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const isAuthed = await requireAuth()
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const host = process.env.HOSTINGER_SMTP_HOST || ''
  const port = process.env.HOSTINGER_SMTP_PORT || ''
  const user = process.env.HOSTINGER_SMTP_USER || ''
  const pass = process.env.HOSTINGER_SMTP_PASS || ''
  const fromEmail = process.env.HOSTINGER_FROM_EMAIL || ''

  const required = ['HOSTINGER_SMTP_HOST', 'HOSTINGER_SMTP_PORT', 'HOSTINGER_SMTP_USER', 'HOSTINGER_SMTP_PASS', 'HOSTINGER_FROM_EMAIL']
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    return NextResponse.json({
      status: 'UNCONFIGURED',
      message: `SMTP is not fully configured. Missing ${missing.length} environment variable(s).`,
      required: missing,
      config: {
        host: host || '(not set)',
        port: port || '(not set)',
        user: user || '(not set)',
        fromEmail: fromEmail || '(not set)',
      },
    })
  }

  return NextResponse.json({
    status: 'CONFIGURED',
    message: 'SMTP environment variables are configured.',
    config: {
      host,
      port,
      user,
      fromEmail,
    },
  })
}
