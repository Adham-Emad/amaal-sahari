"use client"

import { useContent } from "@/lib/content-context"
import Link from "next/link"
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Music,
  Share2,
  MessageCircle,
} from "lucide-react"

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  facebook: <Facebook className="w-5 h-5" />,
  messenger: <MessageCircle className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  tiktok: <Music className="w-5 h-5" />,
  snapchat: <Share2 className="w-5 h-5" />,
}

interface SocialMediaIconsProps {
  position?: "header" | "footer" | "floating"
  className?: string
}

export default function SocialMediaIcons({ position = "footer", className = "" }: SocialMediaIconsProps) {
  const { content } = useContent()

  const socialItems = content.socialMedia.items.filter(
    (item) => item.enabled && item.position === position
  )

  if (socialItems.length === 0) {
    return null
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialItems.map((item) => (
        <Link
          key={item.id}
          href={item.url}
          target={item.openInNewTab ? "_blank" : "_self"}
          rel={item.openInNewTab ? "noopener noreferrer" : undefined}
          className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
          title={item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
        >
          {item.customIconUrl ? (
            <img
              src={item.customIconUrl}
              alt={item.platform}
              className="w-5 h-5"
            />
          ) : (
            PLATFORM_ICONS[item.platform]
          )}
        </Link>
      ))}
    </div>
  )
}
