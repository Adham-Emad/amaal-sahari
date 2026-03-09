"use client"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import AdminLogin from "@/components/admin/admin-login"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  const { isAuthenticated } = useAdmin()

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return <AdminDashboard />
}
