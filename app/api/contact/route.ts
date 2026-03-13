import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

const SUBMISSIONS_FILE = path.join(process.cwd(), 'data', 'contact-submissions.json')

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

function saveSubmission(submission: Record<string, unknown>) {
  try {
    const dir = path.dirname(SUBMISSIONS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    let submissions: Record<string, unknown>[] = []
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'))
    }
    submissions.unshift(submission)
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2))
    return true
  } catch (error) {
    console.error('[v0] Failed to save contact submission:', error)
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('admin_session_token')
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let submissions: Record<string, unknown>[] = []
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'))
    }
    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('[contact] GET submissions error:', error)
    return NextResponse.json({ error: 'Failed to load submissions' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('admin_session_token')
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

    let submissions: Record<string, unknown>[] = []
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'))
    }

    if (id) {
      submissions = submissions.filter((s) => s.id !== id)
    } else {
      submissions = []
    }

    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact] DELETE submissions error:', error)
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const submission = {
      id: `submission_${Date.now()}`,
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone || '').slice(0, 50),
      company: String(company || '').slice(0, 200),
      service: String(service || '').slice(0, 100),
      message: String(message).slice(0, 5000),
      submittedAt: new Date().toISOString(),
    }

    saveSubmission(submission)

    const smtpConfig = getSMTPConfig()
    let emailSent = false

    if (smtpConfig) {
      try {
        const transporter = nodemailer.createTransport(smtpConfig)
        const fromEmail = process.env.HOSTINGER_FROM_EMAIL || smtpConfig.auth.user

        await transporter.sendMail({
          from: fromEmail,
          to: fromEmail,
          replyTo: email,
          subject: `New Contact Form Submission - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2F683E;">New Contact Form Submission</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${submission.name}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${submission.email}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${submission.phone || 'N/A'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${submission.company || 'N/A'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Service</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${submission.service || 'N/A'}</td></tr>
              </table>
              <div style="margin-top: 16px; padding: 12px; background: #f9f9f9; border-radius: 4px;">
                <strong>Message:</strong><br/>${submission.message.replace(/\n/g, '<br/>')}
              </div>
              <p style="color: #999; font-size: 12px; margin-top: 20px;">Submitted at ${submission.submittedAt}</p>
            </div>
          `,
          text: `New Contact: ${submission.name} (${submission.email})\nPhone: ${submission.phone}\nCompany: ${submission.company}\nService: ${submission.service}\nMessage: ${submission.message}`,
        })
        emailSent = true
      } catch (error) {
        console.error('[v0] Failed to send contact email:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will get back to you soon.',
      emailSent,
    })
  } catch (error) {
    console.error('[v0] Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    )
  }
}
