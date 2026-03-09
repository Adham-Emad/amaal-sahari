"use client"

import { useState } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CaseStudyDetailsEditor() {
  const { content, updateSection } = useContent()
  const [caseStudies, setCaseStudies] = useState<SiteContent["caseStudies"]>(content.caseStudies)
  const [saved, setSaved] = useState(false)
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string | null>(
    caseStudies.items[0]?.id || null
  )

  const selectedCaseStudy = caseStudies.items.find((c) => c.id === selectedCaseStudyId)

  const handleSave = () => {
    updateSection("caseStudies", caseStudies)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateCaseStudyContent = (field: string, value: string, lang: "en" | "ar") => {
    if (!selectedCaseStudyId) return
    setCaseStudies({
      ...caseStudies,
      items: caseStudies.items.map((c) =>
        c.id === selectedCaseStudyId ? { ...c, [lang]: { ...c[lang], [field]: value } } : c
      ),
    })
  }

  if (!selectedCaseStudy) {
    return (
      <div className="p-8 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-800">
          No case studies available. Please create a case study in the Case Studies Editor first.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2F683E]">Case Study Details Editor</h2>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="bg-[#2F683E] hover:bg-[#2F683E]/90">
            <Save className="w-4 h-4 mr-2" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Case Study Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Case Study</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCaseStudyId || ""} onValueChange={setSelectedCaseStudyId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a case study" />
            </SelectTrigger>
            <SelectContent>
              {caseStudies.items.map((study) => (
                <SelectItem key={study.id} value={study.id}>
                  {study.en.title || "Untitled"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Content Editor */}
      {selectedCaseStudy && (
        <div className="grid grid-cols-2 gap-6">
          {/* English Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">English Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Case Study Title</Label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded mt-1">{selectedCaseStudy.en.title}</div>
              </div>
              <div>
                <Label>Overview</Label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded mt-1 max-h-16 overflow-y-auto">
                  {selectedCaseStudy.en.description}
                </div>
              </div>
              <div>
                <Label>Metrics</Label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded mt-1">{selectedCaseStudy.en.metrics}</div>
              </div>
              <div>
                <Label htmlFor="en-challenges">Challenges</Label>
                <Textarea
                  id="en-challenges"
                  value={selectedCaseStudy.en.challenges || ""}
                  onChange={(e) => updateCaseStudyContent("challenges", e.target.value, "en")}
                  placeholder="Describe the challenges faced in this project..."
                  className="min-h-32 font-mono text-sm"
                />
              </div>
              <div>
                <Label htmlFor="en-solution">Solution</Label>
                <Textarea
                  id="en-solution"
                  value={selectedCaseStudy.en.solution || ""}
                  onChange={(e) => updateCaseStudyContent("solution", e.target.value, "en")}
                  placeholder="Describe the solution implemented..."
                  className="min-h-32 font-mono text-sm"
                />
              </div>
              <div>
                <Label htmlFor="en-results">Results</Label>
                <Textarea
                  id="en-results"
                  value={selectedCaseStudy.en.results || ""}
                  onChange={(e) => updateCaseStudyContent("results", e.target.value, "en")}
                  placeholder="Describe the results achieved..."
                  className="min-h-32 font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Arabic Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Arabic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Case Study Title</Label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded mt-1">{selectedCaseStudy.ar.title}</div>
              </div>
              <div>
                <Label>Overview</Label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded mt-1 max-h-16 overflow-y-auto">
                  {selectedCaseStudy.ar.description}
                </div>
              </div>
              <div>
                <Label>Metrics</Label>
                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded mt-1">{selectedCaseStudy.ar.metrics}</div>
              </div>
              <div>
                <Label htmlFor="ar-challenges">التحديات</Label>
                <Textarea
                  id="ar-challenges"
                  value={selectedCaseStudy.ar.challenges || ""}
                  onChange={(e) => updateCaseStudyContent("challenges", e.target.value, "ar")}
                  placeholder="صف التحديات التي واجهت المشروع..."
                  className="min-h-32 font-mono text-sm"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="ar-solution">الحل</Label>
                <Textarea
                  id="ar-solution"
                  value={selectedCaseStudy.ar.solution || ""}
                  onChange={(e) => updateCaseStudyContent("solution", e.target.value, "ar")}
                  placeholder="صف الحل الذي تم تنفيذه..."
                  className="min-h-32 font-mono text-sm"
                  dir="rtl"
                />
              </div>
              <div>
                <Label htmlFor="ar-results">النتائج</Label>
                <Textarea
                  id="ar-results"
                  value={selectedCaseStudy.ar.results || ""}
                  onChange={(e) => updateCaseStudyContent("results", e.target.value, "ar")}
                  placeholder="صف النتائج المحققة..."
                  className="min-h-32 font-mono text-sm"
                  dir="rtl"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2 justify-between">
        <Button variant="outline" onClick={() => window.history.back()} className="inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
        <Button onClick={handleSave} className="bg-[#2F683E] hover:bg-[#2F683E]/90">
          <Save className="w-4 h-4 mr-2" />
          {saved ? "Saved!" : "Save All Changes"}
        </Button>
      </div>
    </div>
  )
}
