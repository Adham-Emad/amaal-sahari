"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, ArrowLeft, AlertCircle, CheckCircle, Mail } from "lucide-react"
export function ForgotPasswordClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [step, setStep] = useState<"email" | "confirmation" | "reset" | "waiting-approval">("email")
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [adminApproved, setAdminApproved] = useState(false)

  // Handle token from URL only after component mounts (client-side)
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      setStep("reset")
    }
  }, [searchParams])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "request-reset" }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send reset link")
        setIsLoading(false)
        return
      }

      // Store email and token, show waiting for approval page
      setEmail(email)
      setToken(data.token)
      setStep("waiting-approval")
      setSuccess("Reset link has been sent to your email and admin approval has been requested. Please wait for admin to approve this request.")
      setIsLoading(false)
    } catch (err) {
      setError("Failed to send reset link. Please try again.")
      console.error("[v0] Reset request error:", err)
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    if (!token) {
      setError("Invalid reset token. Please request a new reset link.")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Verify token first
      const verifyResponse = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action: "verify-token" }),
      })

      const verifyData = await verifyResponse.json()
      if (!verifyResponse.ok) {
        // Check if it's an approval pending issue
        if (verifyResponse.status === 403) {
          setError("Admin approval is still pending. Please wait for admin to approve this request via email.")
          setStep("waiting-approval")
        } else {
          setError(verifyData.error || "Invalid reset link")
        }
        setIsLoading(false)
        return
      }

      // Mark as approved
      setAdminApproved(verifyData.adminApproved || false)

      // Confirm password reset on backend
      const resetResponse = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, action: "confirm-reset" }),
      })

      const resetData = await resetResponse.json()
      if (!resetResponse.ok) {
        setError(resetData.error || "Failed to reset password")
        setIsLoading(false)
        return
      }

      setSuccess("Password reset successfully! Redirecting to login...")
      setIsLoading(false)
      
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    } catch (err) {
      setError("Failed to reset password. Please try again.")
      console.error("[v0] Reset error:", err)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent-emerald/5 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <div className="px-6 pt-4">
          <button
            onClick={() => router.push("/admin")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>

        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription className="mt-2">
              {step === "email"
                ? "Enter your email address"
                : step === "waiting-approval"
                ? "Waiting for admin approval"
                : step === "confirmation"
                ? "Check your email for the reset link"
                : "Create your new password"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {step === "waiting-approval" ? (
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-yellow-600 animate-pulse" />
                </div>
              </div>

              {success && (
                <div className="flex items-start gap-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-700 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>{success}</div>
                </div>
              )}

              <div className="space-y-4 text-center text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Admin Approval Pending</p>
                <p>A password reset approval request has been sent to the admin at:</p>
                <p className="font-semibold text-foreground">admin@amaalsahari.com</p>
                <p className="text-xs pt-4 border-t pt-4">
                  The admin must approve this request via email before you can reset your password.
                </p>
                <p className="text-xs">
                  Once approved, you'll receive a confirmation email and can proceed with resetting your password.
                </p>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => {
                    setStep("email")
                    setEmail("")
                    setError("")
                    setSuccess("")
                    setAdminApproved(false)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Request With Different Email
                </Button>
              </div>
            </div>
          ) : step === "confirmation" ? (
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
              </div>

              {success && (
                <div className="flex items-start gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-700 text-sm">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>{success}</div>
                </div>
              )}

              <div className="space-y-4 text-center text-sm text-muted-foreground">
                <p>We've sent a password reset link to:</p>
                <p className="font-semibold text-foreground">{email}</p>
                <p>Click the link in the email to proceed with resetting your password.</p>
                <p className="text-xs pt-2">The link will expire in 1 hour for security.</p>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => {
                    setStep("email")
                    setEmail("")
                    setError("")
                    setSuccess("")
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Try Another Email
                </Button>
              </div>
            </div>
          ) : step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
