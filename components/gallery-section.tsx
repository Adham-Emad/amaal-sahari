"use client"

import { useState } from "react"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import Image from "next/image"
import { X, Play, Images } from "lucide-react"

export default function GallerySection() {
  const { locale } = useLocale()
  const { content } = useContent()
  const isArabic = locale === "ar"
  const gallery = content.gallery

  const [lightbox, setLightbox] = useState<string | null>(null)

  if (!gallery || gallery.items.length === 0) return null

  const title = isArabic ? gallery.ar.title : gallery.en.title
  const subtitle = isArabic ? gallery.ar.subtitle : gallery.en.subtitle

  const openItem = gallery.items.find((i) => i.id === lightbox)

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-[#FAFBF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Images className="w-6 h-6 text-[#EA8936]" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#2F683E]">{title}</h2>
        </div>
        <p className="text-[#666666] text-lg mb-12 max-w-2xl">{subtitle}</p>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.items.map((item) => {
            const itemData = isArabic ? item.ar : item.en
            const thumb = item.thumbnailUrl || item.url

            return (
              <div
                key={item.id}
                onClick={() => setLightbox(item.id)}
                className="group relative cursor-pointer rounded-xl overflow-hidden bg-gray-100 aspect-square hover:shadow-xl transition-all duration-300"
              >
                {item.type === "image" && item.url ? (
                  <Image
                    src={item.url}
                    alt={itemData.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : item.type === "video" && thumb ? (
                  <Image
                    src={thumb}
                    alt={itemData.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#2F683E]/20 to-[#EA8936]/20 flex items-center justify-center">
                    {item.type === "video" ? (
                      <Play className="w-8 h-8 text-[#2F683E]/40" />
                    ) : (
                      <Images className="w-8 h-8 text-[#2F683E]/40" />
                    )}
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  {item.type === "video" && (
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-[#2F683E] ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Caption */}
                {itemData.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs font-semibold line-clamp-1">{itemData.title}</p>
                    {itemData.description && (
                      <p className="text-xs text-white/70 line-clamp-1">{itemData.description}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && openItem && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {openItem.type === "image" ? (
              <div className="relative w-full h-[70vh]">
                <Image
                  src={openItem.url}
                  alt={(isArabic ? openItem.ar : openItem.en).title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            ) : (
              <div className="w-full aspect-video">
                <iframe
                  src={openItem.url}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}

            {(() => {
              const d = isArabic ? openItem.ar : openItem.en
              return d.title ? (
                <div className="text-center text-white">
                  <p className="font-semibold text-lg">{d.title}</p>
                  {d.description && <p className="text-white/70 text-sm mt-1">{d.description}</p>}
                </div>
              ) : null
            })()}
          </div>
        </div>
      )}
    </section>
  )
}
