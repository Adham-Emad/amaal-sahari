"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react"

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  submittedAt: string
  read?: boolean
}

export default function ContactSubmissionsEditor() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReadState = () => {
    try {
      const stored = localStorage.getItem("contact_read_ids")
      return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>()
    } catch {
      return new Set<string>()
    }
  }

  const saveReadState = (ids: Set<string>) => {
    localStorage.setItem("contact_read_ids", JSON.stringify(Array.from(ids)))
  }

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/contact")
      if (!res.ok) throw new Error("Failed to load submissions")
      const data = await res.json()
      setSubmissions(data.submissions || [])
      setReadIds(loadReadState())
    } catch (err) {
      setError("Could not load submissions from server.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  const isRead = (id: string) => readIds.has(id)
  const unreadCount = submissions.filter((s) => !isRead(s.id)).length

  const handleMarkAsRead = (id: string) => {
    const updated = new Set(readIds)
    if (updated.has(id)) {
      updated.delete(id)
    } else {
      updated.add(id)
    }
    setReadIds(updated)
    saveReadState(updated)
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/contact", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setSubmissions((prev) => prev.filter((s) => s.id !== id))
      const updated = new Set(readIds)
      updated.delete(id)
      setReadIds(updated)
      saveReadState(updated)
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete all submissions?")) return
    try {
      await fetch("/api/contact", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      setSubmissions([])
      setReadIds(new Set())
      localStorage.removeItem("contact_read_ids")
    } catch (err) {
      console.error("Delete all failed:", err)
    }
  }

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Company", "Service", "Message", "Submitted At"]
    const csvContent = [
      headers.join(","),
      ...submissions.map((s) =>
        [
          `"${s.name}"`,
          `"${s.email}"`,
          `"${s.phone || ""}"`,
          `"${s.company || ""}"`,
          `"${s.service || ""}"`,
          `"${(s.message || "").replace(/"/g, '""')}"`,
          s.submittedAt,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contact-submissions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const allSubmissions = submissions.map((s) => ({ ...s, read: isRead(s.id) }))
  const unreadSubmissions = allSubmissions.filter((s) => !s.read)
  const readSubmissions = allSubmissions.filter((s) => s.read)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        Loading submissions...
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchSubmissions} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contact Form Submissions</h2>
          <p className="text-sm text-gray-600">
            {submissions.length} total submissions • {unreadCount} unread
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchSubmissions} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          {submissions.length > 0 && (
            <Button onClick={handleDeleteAll} variant="ghost" className="text-red-600 hover:text-red-700 gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Read ({readSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {allSubmissions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">No submissions yet</CardContent>
            </Card>
          ) : (
            allSubmissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                isExpanded={expandedId === submission.id}
                onToggleExpand={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                onMarkAsRead={() => handleMarkAsRead(submission.id)}
                onDelete={() => handleDelete(submission.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4 mt-4">
          {unreadSubmissions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">No unread submissions</CardContent>
            </Card>
          ) : (
            unreadSubmissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                isExpanded={expandedId === submission.id}
                onToggleExpand={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                onMarkAsRead={() => handleMarkAsRead(submission.id)}
                onDelete={() => handleDelete(submission.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4 mt-4">
          {readSubmissions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">No read submissions</CardContent>
            </Card>
          ) : (
            readSubmissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                isExpanded={expandedId === submission.id}
                onToggleExpand={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                onMarkAsRead={() => handleMarkAsRead(submission.id)}
                onDelete={() => handleDelete(submission.id)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface SubmissionCardProps {
  submission: ContactSubmission & { read: boolean }
  isExpanded: boolean
  onToggleExpand: () => void
  onMarkAsRead: () => void
  onDelete: () => void
}

function SubmissionCard({ submission, isExpanded, onToggleExpand, onMarkAsRead, onDelete }: SubmissionCardProps) {
  return (
    <Card className={submission.read ? "opacity-70" : "border-blue-200 bg-blue-50"}>
      <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50" onClick={onToggleExpand}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{submission.name}</CardTitle>
              {!submission.read && (
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{submission.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {new Date(submission.submittedAt).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 border-t pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-600 font-semibold">Phone</p>
              <p className="text-sm">{submission.phone || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold">Company</p>
              <p className="text-sm">{submission.company || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold">Service</p>
              <p className="text-sm">{submission.service || "—"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Message</p>
            <p className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded">{submission.message}</p>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button size="sm" variant="outline" onClick={onMarkAsRead} className="gap-2 flex-1">
              {submission.read ? (
                <><EyeOff className="w-4 h-4" />Mark Unread</>
              ) : (
                <><Eye className="w-4 h-4" />Mark Read</>
              )}
            </Button>
            <a href={`mailto:${submission.email}`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full gap-2">
                Reply by Email
              </Button>
            </a>
            <Button size="sm" variant="ghost" onClick={onDelete} className="text-red-600 hover:text-red-700 gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
