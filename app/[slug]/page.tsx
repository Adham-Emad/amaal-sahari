import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCustomPageBySlug } from "@/lib/server-content"
import { getCustomPageMetadata } from "@/lib/metadata"
import CustomPageClient from "./custom-page-client"

export const dynamic = 'force-dynamic'

const RESERVED_SLUGS = new Set([
  "about", "admin", "api", "blog", "careers", "case-studies",
  "contact", "faqs", "forgot-password", "login", "news",
  "p", "privacy", "projects", "services", "terms",
])

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (RESERVED_SLUGS.has(slug)) {
    return {}
  }
  const page = getCustomPageBySlug(slug)
  if (!page) return {}
  return getCustomPageMetadata(slug)
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (RESERVED_SLUGS.has(slug)) {
    notFound()
  }

  const page = getCustomPageBySlug(slug)
  if (!page) {
    notFound()
  }

  return <CustomPageClient />
}
