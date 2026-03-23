import type { Metadata } from "next"
import { getCaseStudyMetadata } from "@/lib/metadata"
import CaseStudyClient from "./page-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return getCaseStudyMetadata(id)
}

export default function CaseStudyPage() {
  return <CaseStudyClient />
}
