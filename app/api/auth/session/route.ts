import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const isValid = await requireAuth()
  return NextResponse.json({ authenticated: isValid })
}
