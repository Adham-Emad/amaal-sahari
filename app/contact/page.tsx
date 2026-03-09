"use client"

import { LocaleProvider } from "@/lib/locale-context"
import { useLocale } from "@/lib/locale-context"
import { useContent } from "@/lib/content-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ContactForm from "@/components/contact-form"
import { Mail, MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

function ContactPageContent() {
  const { locale } = useLocale()
  const { content } = useContent()

  const locations = content.contact.locations.map((loc) => ({
    city: locale === "ar" ? loc.ar.city : loc.en.city,
    address: locale === "ar" ? loc.ar.address : loc.en.address,
    phone: loc.phone,
    email: loc.email,
  }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-background via-background to-background py-16 md:py-24 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              {locale === "ar" ? "تواصل معنا" : "Get in Touch"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {locale === "ar"
                ? "هل لديك أسئلة؟ نود أن نسمع منك. أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن."
                : "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <Mail className="w-6 h-6 text-accent" />
                      <h3 className="text-lg font-semibold text-primary">
                        {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">{content.contact.email}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <MapPin className="w-6 h-6 text-accent" />
                      <h3 className="text-lg font-semibold text-primary">{locale === "ar" ? "العنوان" : "Address"}</h3>
                    </div>
                    <p className="text-muted-foreground">
                      {locale === "ar" ? content.contact.address.ar : content.contact.address.en}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <MessageCircle className="w-6 h-6 text-accent" />
                      <h3 className="text-lg font-semibold text-primary">WhatsApp</h3>
                    </div>
                    <p className="text-muted-foreground">{content.contact.whatsapp}</p>
                  </div>

                  <div className="pt-8 space-y-3">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      <a
                        href={`https://wa.me/${content.contact.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg p-8 border border-border shadow-sm">
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    {locale === "ar" ? "أرسل لنا رسالة" : "Send us a Message"}
                  </h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary mb-12 text-center">
              {locale === "ar" ? "مواقعنا في الإمارات" : "Our Locations in UAE"}
            </h2>

            {/* Locations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {locations.map((location, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg p-6 border border-border hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-primary mb-4">{location.city}</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">{location.address}</p>
                    </div>
                    <div className="flex gap-3">
                      <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">{location.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.7319255325446!2d55.27461!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348c5555ab%3A0x12345678!2sDubai%2C%20UAE!5e0!3m2!1sen!2s!4v1234567890"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function ContactPage() {
  return (
    <LocaleProvider>
      <ContactPageContent />
    </LocaleProvider>
  )
}
