import type { Metadata } from "next"
import { getPageMetadata } from "@/lib/metadata"
import NewsPageClient from "./page-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("news")
}

export default function NewsPage() {
  return <NewsPageClient />
}
