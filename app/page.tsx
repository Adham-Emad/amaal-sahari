import type { Metadata } from "next"
import { getGlobalMetadata } from "@/lib/metadata"
import HomePageClient from "./home-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  return getGlobalMetadata()
}

export default function HomePage() {
  return <HomePageClient />
}
