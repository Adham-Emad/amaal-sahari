import type { Metadata } from "next"
import { getPageMetadata } from "@/lib/metadata"

export function generateMetadata(): Metadata {
  return getPageMetadata("careers")
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children
}
