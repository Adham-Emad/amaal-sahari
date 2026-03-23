# Amaal Sahari - Integrated Facility Management Website

## Overview
A Next.js 16 bilingual (Arabic/English) website for "Amaal Sahari" — an integrated facility management company. Features a full CMS admin panel with content editing, file uploads, contact form, and SEO management.

## Tech Stack
- **Framework**: Next.js 16.1.6 (Turbopack, App Router)
- **UI**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript
- **Image Processing**: sharp
- **HTML Sanitization**: dompurify
- **Rich Text Editor**: TipTap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`)
- **Fonts**: Inter (Latin), Cairo (Arabic)

## Architecture
- **Content Management**: Client-side CMS via `lib/content-context.tsx` (React Context). Content is stored as JSON on disk (`data/content.json`) and loaded via `/api/content` endpoint. Falls back to IndexedDB → localStorage → defaults.
- **Authentication**: Server-side auth with PBKDF2 password hashing, HMAC session tokens stored in HttpOnly cookies. Credentials in `.admin-credentials.json`.
- **File Uploads**: `/api/upload` endpoint processes images with sharp, stores in `public/uploads/`. MIME-to-format mapping ensures filename extensions match actual output format.
- **Locale**: Bilingual EN/AR with RTL support via `lib/locale-context.tsx`. Locale persisted in localStorage.
- **SEO**: Custom HTTP server (`server.mjs`) intercepts every HTML response and injects live meta tags (title, description, keywords, og:*, twitter:*) from `data/content.json` at request time (5-second cache). This bypasses Hostinger's static pre-rendering. All pages also export `force-dynamic` + `generateMetadata()` via `lib/metadata.ts` as a fallback. Admin-panel changes propagate within 5 seconds — no rebuild or redeploy required.
- **Rich Text Rendering**: `isHTML()` helper detects HTML content; HTML rendered via `dangerouslySetInnerHTML` with `.rich-content` class; plain text rendered with `whitespace-pre-wrap`.

## Key Files
- `server.mjs` — **CRITICAL**: Custom Node.js HTTP server that intercepts HTML responses and injects live SEO meta tags from content.json on every request. Used as the production start command. Handles Next.js 16's Uint8Array chunks, deferred writeHead for HTML, 5-second content cache, and LiteSpeed cache-control headers.
- `create-zip.mjs` — Creates deployment zip for Hostinger. Ships content.json as content-init.json; production data is preserved across deployments.
- `restore-build.mjs` — Run on server startup: restores `.next` from backup, seeds content.json from content-init.json only on first deploy.
- `lib/content-context.tsx` — Content model (SiteContent type), default content, ContentProvider with `isContentLoaded` state
- `lib/auth.ts` — Server-side authentication (PBKDF2, HMAC sessions)
- `lib/server-content.ts` — Server-side content reading for SEO/metadata
- `lib/metadata.ts` — Server-side generateMetadata helpers for all page types
- `components/admin/admin-dashboard.tsx` — Admin CMS with 25+ editor tabs including Gallery
- `components/admin/rich-text-editor.tsx` — TipTap-based rich text editor (bold, italic, headings, lists, links, images)
- `components/admin/editors/gallery-editor.tsx` — Admin editor for gallery items
- `components/gallery-section.tsx` — Homepage gallery grid + lightbox component
- `components/navbar.tsx` — CMS-driven navigation with custom page support
- `app/[slug]/page.tsx` — Dynamic route for custom pages (server component with generateMetadata + client render)
- `app/[slug]/custom-page-client.tsx` — Client component for custom page rendering
- `app/services/[slug]/page.tsx` — Service detail pages (server component with generateMetadata)
- `app/services/[slug]/service-page-client.tsx` — Client component for service page rendering (renders HTML via dangerouslySetInnerHTML)
- `app/news/[id]/page.tsx` — News article detail page
- `app/p/[slug]/page.tsx` — Legacy redirect from /p/[slug] to /[slug]

## Admin Panel
- **URL**: `/admin`
- **Credentials**: admin / amaal2024
- **Tabs**: Hero, Navbar, Value Highlights, Services, KPIs, Why Choose Us, Testimonials, Case Studies, About, Blog, News, Careers, FAQs, Contact, Footer, SEO, WhatsApp, Social Media, Homepage Sections, Service Details, Privacy Policy, Terms of Service, KPIs Advanced, Subpage SEO, Submissions, Job Applications, Blog Details, Case Studies Details, Custom Pages, **Gallery**

## Custom Pages System
- Admin creates pages via Custom Pages tab (CRUD, draft/published, bilingual)
- Pages rendered at `/[slug]` with DOMPurify HTML sanitization
- Legacy `/p/[slug]` URLs redirect to `/[slug]` for backward compatibility
- Optional navbar integration (showInNavbar flag with ordering)
- Slug validation prevents conflicts with reserved routes (about, admin, api, blog, careers, case-studies, contact, faqs, forgot-password, login, news, p, privacy, projects, services, terms)

## Contact Submissions
- **API**: `GET /api/contact` (auth-protected) returns submissions from `data/contact-submissions.json`
- **API**: `DELETE /api/contact` accepts `{ id }` to delete one, or `{}` to clear all
- **Read state**: Stored in `localStorage` key `contact_read_ids`
- **Admin editor**: `components/admin/editors/contact-submissions-editor.tsx` fetches from the API

## Gallery
- Optional `gallery` array in content model; `GallerySection` returns null if no items
- Each item: `{ id, type: "image"|"video", url, title?: { en, ar } }`
- Frontend: grid layout with lightbox, rendered on homepage
- Admin: Gallery tab in admin dashboard

## Google Analytics
- `window.gtag` is assigned directly (not closure-scoped) to ensure proper initialization
- GA script deduped via `data-ga-id` attribute check before injection

## Environment Secrets
- `SESSION_SECRET` — HMAC signing key for session tokens
- `HOSTINGER_*` — SMTP config (not yet configured)
- SMTP diagnostic endpoint: `/api/auth/smtp-diagnostic` (GET, auth-protected)

## Development
- **Port**: 5000 with `-H 0.0.0.0`
- **Package Manager**: npm
- **Run**: `npm run dev`
- **Dev Origins**: `next.config.mjs` has `allowedDevOrigins` configured for Replit's iframe proxy (uses `REPLIT_DEV_DOMAIN` env var + wildcard patterns)
- **Hydration**: Locale initialization deferred to `useEffect` in `LocaleProvider` to prevent SSR/client mismatch. No inline locale scripts in layout.

## Content Model Notes
- `homepageSections` entries have `en/ar` objects with `title` and optional `subtitle`
- `contact.mapEmbedUrl` — Google Maps embed URL (default provided, renders on contact page)
- `contact.locations` — array of branch offices with bilingual city/address
- `contact.locationsTitle` — `{ en, ar }` — editable section heading on contact page
- `gallery` — optional array of media items displayed as a grid+lightbox section on homepage
- `customPages` — optional array of custom pages with full bilingual content, SEO, and navbar integration
- `isContentLoaded` — boolean on context, used to prevent "Not Found" flash on dynamic pages
- Blog and news items use simple string IDs (`"1"`, `"2"`, etc.); detail pages at `/blog/[id]` and `/news/[id]`
