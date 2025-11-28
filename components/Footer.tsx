import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-navy-900 via-navy-800/95 to-primary-900 text-white py-6 px-4 mt-auto border-t border-white/10">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-silver-400">
          <p>
            Built by Chris Gonzales, MD
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-silver-500/50 hover:text-silver-300 transition-colors text-xs"
              title="Admin"
            >
              Admin
            </Link>
            <p>
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
