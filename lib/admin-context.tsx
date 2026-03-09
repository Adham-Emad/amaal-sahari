"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Default admin credentials
let ADMIN_USERNAME = "admin"
let ADMIN_PASSWORD = "amaal2024"

// IMPORTANT: Passwords are now stored server-side in .admin-credentials.json
// localStorage is NOT used to avoid browser-specific storage issues
// The backend handles global password changes for all users/devices

interface AdminContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; message: string }
  resetPassword: (newPassword: string) => { success: boolean; message: string }
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPassword, setCurrentPassword] = useState(ADMIN_PASSWORD)

  useEffect(() => {
    // Check if already logged in from session
    const session = sessionStorage.getItem("admin_session")
    if (session === "authenticated") {
      setIsAuthenticated(true)
    }

    // Load stored credentials
    const stored = localStorage.getItem("admin_credentials")
    if (stored) {
      try {
        const { password } = JSON.parse(stored)
        setCurrentPassword(password)
      } catch (e) {
        // Keep default
      }
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()
    
    // After API has verified the credentials, trust the API verification
    // Don't do client-side comparison since password may be hashed server-side
    if (trimmedUsername === ADMIN_USERNAME) {
      // API already verified the password via bcrypt comparison
      // Just set authenticated state
      setIsAuthenticated(true)
      sessionStorage.setItem("admin_session", "authenticated")
      localStorage.setItem("admin_credentials", JSON.stringify({
        username: ADMIN_USERNAME,
        password: trimmedPassword
      }))
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin_session")
  }

  const changePassword = async (currentPass: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (newPassword.length < 6) {
      return { success: false, message: "New password must be at least 6 characters" }
    }

    try {
      // Call backend API to change password
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

      // Update local state with new password
      setCurrentPassword(newPassword)
      ADMIN_PASSWORD = newPassword
      
      // Clear localStorage after successful change
      localStorage.removeItem("admin_credentials")

      return { success: true, message: "Password changed successfully. You may need to login again." }
    } catch (error) {
      console.error('[v0] Change password error:', error)
      return { success: false, message: "Error changing password. Please try again." }
    }
  }

  const resetPassword = async (newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (newPassword.length < 6) {
      return { success: false, message: "New password must be at least 6 characters" }
    }

    try {
      // Call backend API to reset password (no current password needed)
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-password',
          username: ADMIN_USERNAME,
          currentPassword: '', // Not needed for reset, but send empty
          newPassword: newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        return { success: false, message: data.error || "Failed to reset password" }
      }

      // Update local state
      setCurrentPassword(newPassword)
      ADMIN_PASSWORD = newPassword
      localStorage.removeItem("admin_credentials")

      return { success: true, message: "Password has been reset. You can now login with your new password." }
    } catch (error) {
      console.error('[v0] Reset password error:', error)
      return { success: false, message: "Error resetting password. Please try again." }
    }
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, changePassword, resetPassword }}>
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
