import type { Metadata } from "next"
import { getNewsItemMetadata } from "@/lib/metadata"
import NewsItemClient from "./page-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return getNewsItemMetadata(id)
}

export default function NewsItemPage() {
  return <NewsItemClient />
}
