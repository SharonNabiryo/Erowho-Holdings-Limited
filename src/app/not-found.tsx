import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-section-dark flex items-center justify-center">
      <div className="text-center px-4">
        <p className="font-playfair text-[8rem] font-bold text-gold leading-none mb-4">404</p>
        <h1 className="font-playfair text-3xl font-bold text-white mb-3">Page not found</h1>
        <p className="font-dm text-white/55 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-lg btn-gold">
            <Home size={16} /> Go Home
          </Link>
          <Link href="/listings" className="btn-lg btn-white">
            <ArrowLeft size={16} /> Browse Properties
          </Link>
        </div>
      </div>
    </div>
  )
}
