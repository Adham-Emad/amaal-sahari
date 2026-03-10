"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

const ADMIN_USERNAME = "admin"

interface AdminContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsAuthenticated(true)
        }
      })
      .catch(() => {})
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    setIsAuthenticated(false)
  }

  const changePassword = async (currentPass: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (newPassword.length < 6) {
      return { success: false, message: "New password must be at least 6 characters" }
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-password',
          username: ADMIN_USERNAME,
          currentPassword: currentPass,
          newPassword: newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        return { success: false, message: data.error || "Failed to change password" }
      }

      return { success: true, message: "Password changed successfully. You may need to login again." }
    } catch (error) {
      console.error('[v0] Change password error:', error)
      return { success: false, message: "Error changing password. Please try again." }
    }
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, changePassword }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider")
  }
  return context
}
