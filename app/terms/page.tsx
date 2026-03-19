import type { Metadata } from "next"
import { getPageMetadata } from "@/lib/metadata"
import TermsPageClient from "./page-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("terms")
}

export default function TermsPage() {
  return <TermsPageClient />
}
