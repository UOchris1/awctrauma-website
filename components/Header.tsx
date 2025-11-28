import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 text-white">
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Image
                src="/logo_01.png"
                alt="Abrazo West Campus Logo"
                width={56}
                height={56}
                className="rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Abrazo West Campus
              </h1>
              <p className="text-sm text-white/80">
                Level <span className="text-yellow-400 font-semibold">1</span> Trauma Center Resources
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-sm bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>24/7 Resource Portal</span>
          </div>
        </div>
      </div>
    </header>
  )
}
