"use client"

import { useState, useEffect } from "react"
import { useContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Trash2, Download, Mail, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface JobApplication {
  id: string
  jobPosition: string
  fullName: string
  email: string
  phone: string
  resume: string
  coverLetter: string
  submittedAt: string
  status: "pending" | "reviewing" | "accepted" | "rejected"
  notes: string
}

export default function JobApplicationsEditor() {
  const { content, updateSection } = useContent()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [filter, setFilter] = useState<"all" | "pending" | "reviewing" | "accepted" | "rejected">("all")
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null)
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<JobApplication["status"]>("pending")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("job_applications")
    if (stored) {
      setApplications(JSON.parse(stored))
    }
  }, [])

  const filteredApplications = applications.filter((app) => filter === "all" || app.status === filter)

  const handleStatusChange = (appId: string, newStatus: JobApplication["status"]) => {
    const updated = applications.map((app) =>
      app.id === appId ? { ...app, status: newStatus } : app
    )
    setApplications(updated)
    localStorage.setItem("job_applications", JSON.stringify(updated))
    if (selectedApp?.id === appId) {
      setSelectedApp({ ...selectedApp, status: newStatus })
      setStatus(newStatus)
    }
  }

  const handleUpdateNotes = () => {
    if (!selectedApp) return

    const updated = applications.map((app) =>
      app.id === selectedApp.id ? { ...app, notes } : app
    )
    setApplications(updated)
    localStorage.setItem("job_applications", JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDeleteApplication = (appId: string) => {
    const updated = applications.filter((app) => app.id !== appId)
    setApplications(updated)
    localStorage.setItem("job_applications", JSON.stringify(updated))
    if (selectedApp?.id === appId) {
      setSelectedApp(null)
    }
  }

  const handleExportCSV = () => {
    const headers = ["ID", "Job Position", "Full Name", "Email", "Phone", "Status", "Submitted At"]
    const rows = filteredApplications.map((app) => [
      app.id,
      app.jobPosition,
      app.fullName,
      app.email,
      app.phone,
      app.status,
      app.submittedAt,
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `job_applications_${new Date().toISOString()}.csv`
    a.click()
  }

  const getStatusColor = (status: JobApplication["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewing":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: JobApplication["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "reviewing":
        return <AlertCircle className="w-4 h-4" />
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2F683E]">{stats.total}</div>
              <p className="text-sm text-foreground-secondary">Total Applications</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-sm text-foreground-secondary">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.reviewing}</div>
              <p className="text-sm text-foreground-secondary">Reviewing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
              <p className="text-sm text-foreground-secondary">Accepted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-sm text-foreground-secondary">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Export */}
      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            size="sm"
          >
            Pending
          </Button>
          <Button
            variant={filter === "reviewing" ? "default" : "outline"}
            onClick={() => setFilter("reviewing")}
            size="sm"
          >
            Reviewing
          </Button>
          <Button
            variant={filter === "accepted" ? "default" : "outline"}
            onClick={() => setFilter("accepted")}
            size="sm"
          >
            Accepted
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            onClick={() => setFilter("rejected")}
            size="sm"
          >
            Rejected
          </Button>
        </div>
        <Button onClick={handleExportCSV} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Applications List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto space-y-2">
              {filteredApplications.length === 0 ? (
                <p className="text-sm text-foreground-secondary">No applications found</p>
              ) : (
                filteredApplications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app)
                      setNotes(app.notes)
                      setStatus(app.status)
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedApp?.id === app.id
                        ? "border-[#2F683E] bg-[#2F683E]/5"
                        : "border-border hover:border-[#2F683E]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{app.fullName}</p>
                      <Badge className={`text-xs ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        <span className="ml-1">{app.status}</span>
                      </Badge>
                    </div>
                    <p className="text-xs text-foreground-secondary">{app.jobPosition}</p>
                    <p className="text-xs text-foreground-secondary">{app.email}</p>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedApp.fullName}</CardTitle>
                  <Badge className={getStatusColor(selectedApp.status)}>
                    {selectedApp.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Application Info */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">Job Position</Label>
                    <p className="text-sm text-foreground-secondary">{selectedApp.jobPosition}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">Email</Label>
                      <p className="text-sm text-foreground-secondary break-all">{selectedApp.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Phone</Label>
                      <p className="text-sm text-foreground-secondary">{selectedApp.phone}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Submitted At</Label>
                    <p className="text-sm text-foreground-secondary">{selectedApp.submittedAt}</p>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">Cover Letter</Label>
                    <p className="text-sm text-foreground-secondary whitespace-pre-wrap bg-gray-50 p-3 rounded mt-2">
                      {selectedApp.coverLetter}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Resume Link</Label>
                    <a
                      href={selectedApp.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#EA8936] hover:underline"
                    >
                      Download Resume
                    </a>
                  </div>
                </div>

                {/* Status Update */}
                <div className="border-t pt-6 space-y-4">
                  <div>
                    <Label htmlFor="status" className="text-sm font-semibold">
                      Status
                    </Label>
                    <Select
                      value={status}
                      onValueChange={(value) => {
                        setStatus(value as JobApplication["status"])
                        handleStatusChange(selectedApp.id, value as JobApplication["status"])
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div className="border-t pt-6 space-y-4">
                  <div>
                    <Label htmlFor="notes" className="text-sm font-semibold">
                      Internal Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add internal notes about this application..."
                      className="mt-2 resize-none"
                      rows={3}
                    />
                    <Button onClick={handleUpdateNotes} size="sm" className="mt-2">
                      Save Notes
                    </Button>
                  </div>
                </div>

                {/* Contact Applicant */}
                <div className="border-t pt-6 space-y-4">
                  <Label className="text-sm font-semibold">Contact Applicant</Label>
                  <p className="text-sm text-foreground-secondary">
                    Click the email address to send acceptance or rejection message:
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${selectedApp.email}?subject=${encodeURIComponent(
                        `Update on Your Application for ${selectedApp.jobPosition}`
                      )}&body=${encodeURIComponent(
                        `Dear ${selectedApp.fullName},\n\nThank you for applying for the ${selectedApp.jobPosition} position at Amaal Sahari.\n\n[Your message here]\n\nBest regards,\nHuman Resources Team\nAmaal Sahari`
                      )}`}
                      className="flex-1"
                    >
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Mail className="w-4 h-4 mr-2" />
                        {selectedApp.email}
                      </Button>
                    </a>
                    <Button
                      onClick={() => handleDeleteApplication(selectedApp.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {saved && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded text-sm">
                    Changes saved successfully!
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-foreground-secondary">Select an application to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
