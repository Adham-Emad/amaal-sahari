"use client"

import { useContent } from "@/lib/content-context"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function WhatsAppWidget() {
  const { content } = useContent()
  const [isHovered, setIsHovered] = useState(false)

  if (!content.whatsapp.enabled) {
    return null
  }

  const { phoneNumber, prefilledMessage, position, customIconUrl } = content.whatsapp
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(prefilledMessage)}`
  const positionClasses = position === "left" ? "left-6" : "right-6"

  return (
    <div
      className={`fixed bottom-6 ${positionClasses} z-40`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 group"
      >
        {isHovered && (
          <div className="bg-white rounded-lg shadow-lg px-4 py-2 mr-2 animate-fade-in">
            <p className="text-sm font-medium text-gray-800 whitespace-nowrap">Message us on WhatsApp</p>
          </div>
        )}
        <div className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110">
          {customIconUrl ? (
            <img
              src={customIconUrl}
              alt="WhatsApp"
              className="w-6 h-6"
            />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </div>
      </Link>
    </div>
  )
}
