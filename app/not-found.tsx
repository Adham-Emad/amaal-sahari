import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl md:text-8xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-lg text-white/90 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-[#EA8936] hover:bg-[#FAB076] text-[#2F683E] font-semibold px-8">
              Go to Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
