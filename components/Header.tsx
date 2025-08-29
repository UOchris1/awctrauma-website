import Image from 'next/image'

export default function Header() {
  return (
    <header className="relative bg-gradient-to-r from-navy-900 via-navy-800 to-primary text-white shadow-lg">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <Image 
                src="/logo_01.png" 
                alt="Abrazo West Campus Logo" 
                width={100} 
                height={100}
                className="bg-white/5 rounded-xl p-2"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1 text-silver-200">
                Abrazo West Campus
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-light">
                Level 1 Trauma Center Resources
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>24/7 Resource Portal</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}