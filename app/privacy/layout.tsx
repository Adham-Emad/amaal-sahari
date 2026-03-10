import type { Metadata } from "next"
import { getPageMetadata } from "@/lib/metadata"

export function generateMetadata(): Metadata {
  return getPageMetadata("privacy")
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
