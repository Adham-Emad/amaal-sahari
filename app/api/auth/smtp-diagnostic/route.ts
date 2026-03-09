import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  try {
    // Check environment variables
    const smtpHost = process.env.HOSTINGER_SMTP_HOST
    const smtpUser = process.env.HOSTINGER_SMTP_USER
    const smtpPass = process.env.HOSTINGER_SMTP_PASS
    const smtpPort = process.env.HOSTINGER_SMTP_PORT
    const fromEmail = process.env.HOSTINGER_FROM_EMAIL

    const config = {
      host: smtpHost || 'NOT SET',
      port: smtpPort || 'NOT SET',
      user: smtpUser ? smtpUser.substring(0, 5) + '***' : 'NOT SET',
      fromEmail: fromEmail || 'NOT SET',
      passwordSet: !!smtpPass,
    }

    // If no SMTP config, return immediately
    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json({
        status: 'UNCONFIGURED',
        message: 'SMTP environment variables are not fully configured',
        config,
        required: ['HOSTINGER_SMTP_HOST', 'HOSTINGER_SMTP_USER', 'HOSTINGER_SMTP_PASS'],
      })
    }

    // Try to verify SMTP connection
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || '465'),
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    await transporter.verify()

    return NextResponse.json({
      status: 'CONFIGURED',
      message: 'SMTP is properly configured and connection verified',
      config: {
        host: smtpHost,
        port: smtpPort,
        user: smtpUser,
        fromEmail: fromEmail,
      },
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({
      status: 'ERROR',
      message: 'SMTP configuration error',
      error: errorMsg,
      details: 'Check HOSTINGER_SMTP_HOST, HOSTINGER_SMTP_USER, and HOSTINGER_SMTP_PASS environment variables',
    }, { status: 500 })
  }
}
