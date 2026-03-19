import type { Metadata } from "next"
import { getPageMetadata } from "@/lib/metadata"

export const dynamic = 'force-dynamic'

export function generateMetadata(): Metadata {
  return getPageMetadata("news")
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children
}
