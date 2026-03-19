import type { Metadata } from "next"
import { getServiceMetadata } from "@/lib/metadata"
import ServicePageClient from "./service-page-client"

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return getServiceMetadata(slug)
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  await params
  return <ServicePageClient />
}
