# Amaal Sahari - Facility Management Website

A Next.js 16 website for Amaal Sahari, an integrated facility management company. Supports Arabic and English (bilingual), with an admin panel for content management.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Email**: Nodemailer (SMTP via Hostinger credentials)
- **Package Manager**: npm

## Project Structure

- `app/` - Next.js App Router pages and API routes
  - `app/api/auth/` - Authentication endpoints (login, change-password, reset-password)
  - `app/api/content/` - Content management API
  - `app/api/upload/` - File upload handler
  - `app/admin/` - Admin panel pages
- `components/` - Reusable UI components
- `lib/` - Context providers, utilities, i18n, data

## Environment Variables

The app uses the following secrets (set via Replit Secrets):
- `HOSTINGER_SMTP_HOST` - SMTP host for email sending
- `HOSTINGER_SMTP_PORT` - SMTP port
- `HOSTINGER_SMTP_USER` - SMTP username
- `HOSTINGER_SMTP_PASS` - SMTP password
- `HOSTINGER_FROM_EMAIL` - From address for emails
- `NEXT_PUBLIC_BASE_URL` - Public base URL of the app (optional)

## Running the App

- **Dev**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Start**: `npm run start` (runs on port 5000)

## Replit Configuration

- Workflow: "Start application" → `npm run dev` on port 5000
- Next.js configured to listen on `0.0.0.0:5000` for Replit proxy compatibility
