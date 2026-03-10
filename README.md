# Amaal Sahari - Facility Management Website

A Next.js 16 website for Amaal Sahari, an integrated facility management company. Supports Arabic and English (bilingual), with an admin panel for content management.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Email**: Nodemailer (SMTP via Hostinger credentials)
- **Package Manager**: npm

## Project Structure

- `app/` - Next.js App Router pages and API routes
  - `app/api/auth/` - Authentication endpoints (login, logout, session, change-password, reset-password)
  - `app/api/content/` - Content management API (GET public, POST requires auth)
  - `app/api/upload/` - File upload handler (requires auth)
  - `app/api/contact/` - Contact form endpoint (saves + emails)
  - `app/admin/` - Admin panel pages
- `components/` - Reusable UI components
- `lib/` - Context providers, utilities, i18n
  - `lib/auth.ts` - Server-side session auth (HMAC tokens, HttpOnly cookies)
  - `lib/admin-context.tsx` - Client-side admin state (cookie-based, no credential storage)
  - `lib/locale-context.tsx` - Bilingual locale management
  - `lib/content-context.tsx` - CMS content management
- `public/` - Static assets (placeholder.svg)
- `data/` - Server-side data files (content, contact submissions)

## Authentication

- Login sets HttpOnly secure cookie (`admin_session_token`) via HMAC-signed session token
- Session verified via `lib/auth.ts` requireAuth() on protected endpoints
- Admin credentials stored in `.admin-credentials.json` (PBKDF2-hashed)
- Default credentials: admin / amaal2024 (change after first login)

## Environment Variables

The app uses the following secrets (set via Replit Secrets):
- `SESSION_SECRET` - Required for session token signing
- `HOSTINGER_SMTP_HOST` - SMTP host for email sending
- `HOSTINGER_SMTP_PORT` - SMTP port (default 465)
- `HOSTINGER_SMTP_USER` - SMTP username
- `HOSTINGER_SMTP_PASS` - SMTP password
- `HOSTINGER_FROM_EMAIL` - From address for emails
- `NEXT_PUBLIC_BASE_URL` - Public base URL (optional, defaults to amaalsahari.com)

## Running the App

- **Dev**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Start**: `npm run start` (runs on port 5000)

## Replit Configuration

- Workflow: "Start application" → `npm run dev` on port 5000
- Next.js configured to listen on `0.0.0.0:5000` for Replit proxy compatibility
- `allowedDevOrigins` configured for Replit domains
