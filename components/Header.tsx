import Image from 'next/image'

export default function Header() {
  return (
    // Gemini's gradient: navy to primary blend for professional look
    <header className="bg-gradient-to-r from-navy-900 via-navy-800/95 to-primary-900 text-white shadow-lg border-b border-white/10 relative overflow-hidden">
      {/* Grid pattern with increased opacity (Gemini) */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]"></div>

      <div className="container mx-auto max-w-6xl px-4 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
          </div>

          {/* 24/7 indicator with Opus's animated ping + Gemini's styling */}
          <div className="hidden sm:flex items-center space-x-2 text-sm bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 shadow-sm hover:bg-white/20 transition-all cursor-default">
            {/* Opus's animated ping indicator */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal"></span>
            </span>
            <span className="font-medium text-silver-100">24/7 Resource Portal</span>
          </div>
        </div>
      </div>
    </header>
  )
}
