import type { Metadata } from "next"
import { getPageMetadata } from "@/lib/metadata"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateMetadata(): Metadata {
  return getPageMetadata("about")
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
