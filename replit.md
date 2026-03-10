# Amaal Sahari - Integrated Facility Management Website

## Overview
A Next.js 16 bilingual (Arabic/English) website for "Amaal Sahari" — an integrated facility management company. Features a full CMS admin panel with content editing, file uploads, contact form, and SEO management.

## Tech Stack
- **Framework**: Next.js 16.1.6 (Turbopack, App Router)
- **UI**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript
- **Image Processing**: sharp
- **HTML Sanitization**: dompurify
- **Fonts**: Inter (Latin), Cairo (Arabic)

## Architecture
- **Content Management**: Client-side CMS via `lib/content-context.tsx` (React Context). Content is stored as JSON on disk (`data/content.json`) and loaded via `/api/content` endpoint. Falls back to IndexedDB → localStorage → defaults.
- **Authentication**: Server-side auth with PBKDF2 password hashing, HMAC session tokens stored in HttpOnly cookies. Credentials in `.admin-credentials.json`.
- **File Uploads**: `/api/upload` endpoint processes images with sharp, stores in `public/uploads/`. MIME-to-format mapping ensures filename extensions match actual output format.
- **Locale**: Bilingual EN/AR with RTL support via `lib/locale-context.tsx`. Locale persisted in localStorage.
- **SEO**: Server-side `generateMetadata()` exports on all pages via `lib/metadata.ts` (reads from `lib/server-content.ts`). Client-side dynamic updates via `components/seo-metadata.tsx`.

## Key Files
- `lib/content-context.tsx` — Content model (SiteContent type), default content, ContentProvider with `isContentLoaded` state
- `lib/auth.ts` — Server-side authentication (PBKDF2, HMAC sessions)
- `lib/server-content.ts` — Server-side content reading for SEO/metadata
- `lib/metadata.ts` — Server-side generateMetadata helpers for all page types
- `components/admin/admin-dashboard.tsx` — Admin CMS with 25+ editor tabs
- `components/navbar.tsx` — CMS-driven navigation with custom page support
- `app/[slug]/page.tsx` — Dynamic route for custom pages (server component with generateMetadata + client render)
- `app/[slug]/custom-page-client.tsx` — Client component for custom page rendering
- `app/services/[slug]/page.tsx` — Service detail pages (server component with generateMetadata)
- `app/services/[slug]/service-page-client.tsx` — Client component for service page rendering
- `app/p/[slug]/page.tsx` — Legacy redirect from /p/[slug] to /[slug]

## Admin Panel
- **URL**: `/admin`
- **Credentials**: admin / amaal2024
- **Tabs**: Hero, Navbar, Value Highlights, Services, KPIs, Why Choose Us, Testimonials, Case Studies, About, Blog, News, Careers, FAQs, Contact, Footer, SEO, WhatsApp, Social Media, Homepage Sections, Service Details, Privacy Policy, Terms of Service, KPIs Advanced, Subpage SEO, Submissions, Job Applications, Blog Details, Case Studies Details, Custom Pages

## Custom Pages System
- Admin creates pages via Custom Pages tab (CRUD, draft/published, bilingual)
- Pages rendered at `/[slug]` with DOMPurify HTML sanitization
- Legacy `/p/[slug]` URLs redirect to `/[slug]` for backward compatibility
- Optional navbar integration (showInNavbar flag with ordering)
- Slug validation prevents conflicts with reserved routes (about, admin, api, blog, careers, case-studies, contact, faqs, forgot-password, login, news, p, privacy, projects, services, terms)

## Environment Secrets
- `SESSION_SECRET` — HMAC signing key for session tokens
- `HOSTINGER_*` — SMTP config (not yet configured)
- SMTP diagnostic endpoint: `/api/auth/smtp-diagnostic` (GET, auth-protected)

## Development
- **Port**: 5000 with `-H 0.0.0.0`
- **Package Manager**: npm
- **Run**: `npm run dev`

## Content Model Notes
- `homepageSections` entries have `en/ar` objects with `title` and optional `subtitle`
- `contact.mapEmbedUrl` — Google Maps embed URL (default provided, renders on contact page)
- `contact.locations` — array of branch offices with bilingual city/address
- `customPages` — optional array of custom pages with full bilingual content, SEO, and navbar integration
- `isContentLoaded` — boolean on context, used to prevent "Not Found" flash on dynamic pages
