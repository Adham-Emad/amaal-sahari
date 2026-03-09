"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Trash2, Eye, EyeOff } from "lucide-react"

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  submittedAt: string
  read: boolean
}

export default function ContactSubmissionsEditor() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all")

  // Load submissions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("contact_submissions")
    if (stored) {
      try {
        setSubmissions(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse submissions:", e)
      }
    }
  }, [])

  const filteredSubmissions = submissions.filter((sub) => {
    if (filterRead === "unread") return !sub.read
    if (filterRead === "read") return sub.read
    return true
  })

  const unreadCount = submissions.filter((s) => !s.read).length

  const handleMarkAsRead = (id: string) => {
    const updated = submissions.map((s) =>
      s.id === id ? { ...s, read: !s.read } : s
    )
    setSubmissions(updated)
    localStorage.setItem("contact_submissions", JSON.stringify(updated))
  }

  const handleDelete = (id: string) => {
    const updated = submissions.filter((s) => s.id !== id)
    setSubmissions(updated)
    localStorage.setItem("contact_submissions", JSON.stringify(updated))
  }

  const handleDeleteAll = () => {
    if (confirm("Are you sure you want to delete all submissions?")) {
      setSubmissions([])
      localStorage.removeItem("contact_submissions")
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
          `"${s.phone}"`,
          `"${s.company}"`,
          `"${s.service}"`,
          `"${s.message.replace(/"/g, '""')}"`,
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
          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          {submissions.length > 0 && (
            <Button
              onClick={handleDeleteAll}
              variant="ghost"
              className="text-red-600 hover:text-red-700 gap-2"
            >
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
          <TabsTrigger value="read">Read ({submissions.filter((s) => s.read).length})</TabsTrigger>
        </TabsList>

        {["all", "unread", "read"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {tab === "all" && filterRead === "all" && submissions.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No submissions yet
                </CardContent>
              </Card>
            )}
            {tab === "unread" && filterRead !== "unread" && (
              <div onClick={() => setFilterRead("unread")} className="w-full">
                {filteredSubmissions.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    isExpanded={expandedId === submission.id}
                    onToggleExpand={() =>
                      setExpandedId(expandedId === submission.id ? null : submission.id)
                    }
                    onMarkAsRead={() => handleMarkAsRead(submission.id)}
                    onDelete={() => handleDelete(submission.id)}
                    onSendEmail={() => handleSendEmail(submission.email)}
                  />
                ))}
              </div>
            )}
            {tab === "read" && filterRead !== "read" && (
              <div onClick={() => setFilterRead("read")} className="w-full">
                {filteredSubmissions.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    isExpanded={expandedId === submission.id}
                    onToggleExpand={() =>
                      setExpandedId(expandedId === submission.id ? null : submission.id)
                    }
                    onMarkAsRead={() => handleMarkAsRead(submission.id)}
                    onDelete={() => handleDelete(submission.id)}
                    onSendEmail={() => handleSendEmail(submission.email)}
                  />
                ))}
              </div>
            )}
            {tab === "all" && (
              <div className="space-y-4">
                {filteredSubmissions.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-500">
                      No submissions in this category
                    </CardContent>
                  </Card>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <SubmissionCard
                      key={submission.id}
                      submission={submission}
                      isExpanded={expandedId === submission.id}
                      onToggleExpand={() =>
                        setExpandedId(expandedId === submission.id ? null : submission.id)
                      }
                      onMarkAsRead={() => handleMarkAsRead(submission.id)}
                      onDelete={() => handleDelete(submission.id)}
                    />
                  ))
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

interface SubmissionCardProps {
  submission: ContactSubmission
  isExpanded: boolean
  onToggleExpand: () => void
  onMarkAsRead: () => void
  onDelete: () => void
}

function SubmissionCard({
  submission,
  isExpanded,
  onToggleExpand,
  onMarkAsRead,
  onDelete,
}: SubmissionCardProps) {
  return (
    <Card className={submission.read ? "opacity-60" : "border-blue-200 bg-blue-50"}>
      <CardHeader
        className="pb-3 cursor-pointer hover:bg-gray-50"
        onClick={onToggleExpand}
      >
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
            <p className="text-xs text-gray-500">{submission.submittedAt}</p>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 border-t pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-600 font-semibold">Phone</p>
              <p className="text-sm">{submission.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold">Company</p>
              <p className="text-sm">{submission.company}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold">Service</p>
              <p className="text-sm">{submission.service}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-600 font-semibold mb-1">Message</p>
            <p className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded">
              {submission.message}
            </p>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={onMarkAsRead}
              className="gap-2 flex-1"
            >
              {submission.read ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Mark Unread
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Mark Read
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 gap-2 flex-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
