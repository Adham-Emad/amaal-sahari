import type { Metadata } from "next"
import { getPageMetadata } from "@/lib/metadata"
import ContactPageClient from "./page-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("contact")
}

export default function ContactPage() {
  return <ContactPageClient />
}
