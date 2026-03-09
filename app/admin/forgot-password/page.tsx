import { Suspense } from "react"
import { ForgotPasswordClient } from "@/components/admin/forgot-password-client"
import { Card, CardContent } from "@/components/ui/card"

function ForgotPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent-emerald/5 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-16 bg-gray-200 rounded-full mx-auto w-16" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordLoading />}>
      <ForgotPasswordClient />
    </Suspense>
  )
}
