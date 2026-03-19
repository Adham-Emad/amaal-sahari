import type { Metadata } from "next"
import { getPageMetadata } from "@/lib/metadata"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateMetadata(): Metadata {
  return getPageMetadata("case-studies")
}

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children
}
