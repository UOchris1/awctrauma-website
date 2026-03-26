'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const isQuickGuides = pathname === '/sicu-deliverables' || pathname.startsWith('/sicu-deliverables/')
  const isHome = pathname === '/'

  const activeStyle = 'bg-primary-600 border-primary-500 text-white font-medium shadow-md'
  const inactiveStyle = 'bg-primary-600/60 border-primary-400/40 hover:bg-primary-600/80 text-white/90'

  return (
    <header className="bg-gradient-to-r from-navy-900 via-navy-800/95 to-primary-900 text-white shadow-lg border-b border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]"></div>

      <div className="container mx-auto max-w-6xl px-4 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
            <div className="flex-shrink-0">
              <Image
                src="/logo_02.jpg"
                alt="Level 1 Trauma Center Logo"
                width={56}
                height={56}
                className="rounded-lg shadow-md"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Level <span className="text-accent-gold">1</span> Trauma
              </h1>
            </div>
          </Link>

          <nav className="flex items-center space-x-2">
            <Link
              href="/#documents"
              className={`text-sm rounded-full px-4 py-2 border transition-all ${isHome ? activeStyle : inactiveStyle}`}
            >
              Algorithms & Docs
            </Link>
            <Link
              href="/sicu-deliverables"
              className={`text-sm rounded-full px-4 py-2 border transition-all ${isQuickGuides ? activeStyle : inactiveStyle}`}
            >
              Quick Guides
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
