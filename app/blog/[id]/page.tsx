import type { Metadata } from "next"
import { getBlogPostMetadata } from "@/lib/metadata"
import BlogPostClient from "./page-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return getBlogPostMetadata(id)
}

export default function BlogPostPage() {
  return <BlogPostClient />
}
