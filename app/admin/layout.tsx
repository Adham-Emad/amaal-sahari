"use client"

import type React from "react"
import { AdminProvider } from "@/lib/admin-context"
import { ContentProvider } from "@/lib/content-context"
import AdminHeader from "@/components/admin/admin-header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <ContentProvider>
        <div className="min-h-screen bg-background">
          <AdminHeader />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </ContentProvider>
    </AdminProvider>
  )
}
