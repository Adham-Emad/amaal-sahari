"use client"

import { useState } from "react"
import { useContent, type SiteContent } from "@/lib/content-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"

export default function FAQsEditor() {
  const { content, updateSection } = useContent()
  const [faqs, setFaqs] = useState<SiteContent["faqs"]>(content.faqs)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateSection("faqs", faqs)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateFaq = (id: string, field: string, value: string, lang: "en" | "ar") => {
    setFaqs({
      ...faqs,
      items: faqs.items.map((f) =>
        f.id === id ? { ...f, [lang]: { ...f[lang], [field]: value } } : f
      ),
    })
  }

  const addFaq = () => {
    const newId = Date.now().toString()
    setFaqs({
      ...faqs,
      items: [
        ...faqs.items,
        {
          id: newId,
          en: { question: "", answer: "" },
          ar: { question: "", answer: "" },
        },
      ],
    })
  }

  const removeFaq = (id: string) => {
    setFaqs({
      ...faqs,
      items: faqs.items.filter((f) => f.id !== id),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2F683E]">FAQs Editor</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addFaq}>
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
          <Button onClick={handleSave} className="bg-[#2F683E] hover:bg-[#2F683E]/90">
            <Save className="w-4 h-4 mr-2" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.items.map((faq, index) => (
          <Card key={faq.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>FAQ #{index + 1}</span>
                <Button variant="ghost" size="icon" onClick={() => removeFaq(faq.id)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 border-r pr-4">
                  <h4 className="font-semibold">English</h4>
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={faq.en.question}
                      onChange={(e) => updateFaq(faq.id, "question", e.target.value, "en")}
                    />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.en.answer}
                      onChange={(e) => updateFaq(faq.id, "answer", e.target.value, "en")}
                      rows={4}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Arabic</h4>
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={faq.ar.question}
                      onChange={(e) => updateFaq(faq.id, "question", e.target.value, "ar")}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.ar.answer}
                      onChange={(e) => updateFaq(faq.id, "answer", e.target.value, "ar")}
                      rows={4}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
