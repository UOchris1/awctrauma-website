'use client'

import { useState } from 'react'
import ImageLightbox from './ImageLightbox'

interface AlgorithmCardProps {
  title: string
  shortTitle: string
  imageSrc: string
  icon: React.ReactNode
  color: string
}

export default function AlgorithmCard({ title, shortTitle, imageSrc, icon, color }: AlgorithmCardProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsLightboxOpen(true)}
        className={`group flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-${color}-400 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-${color}-200`}
      >
        {/* Icon */}
        <div className={`w-16 h-16 rounded-xl bg-${color}-100 flex items-center justify-center mb-3 group-hover:bg-${color}-200 transition-colors`}>
          <div className={`text-${color}-600`}>
            {icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800 text-center leading-tight">
          {shortTitle}
        </h3>

        {/* View button */}
        <span className="mt-2 text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600 group-hover:bg-navy-700 group-hover:text-white group-hover:border-navy-700 transition-all">
          View Flowchart
        </span>
      </button>

      <ImageLightbox
        src={imageSrc}
        alt={title}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  )
}
