import type { Metadata } from "next"
import { getPageMetadata } from "@/lib/metadata"

export function generateMetadata(): Metadata {
  return getPageMetadata("contact")
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
