'use client'

import { useState } from 'react'
import ImageLightbox from './ImageLightbox'

// Medical icons as SVG components
const icons = {
  ribs: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" opacity="0.3"/>
      <path d="M4 8h16M4 12h16M4 16h16" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  pelvis: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4C8 4 4 8 4 12c0 2 1 4 3 5l1 3h8l1-3c2-1 3-3 3-5 0-4-4-8-8-8z" opacity="0.3"/>
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
    </svg>
  ),
  vascular: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 4v16M8 8c0-2 2-4 4-4s4 2 4 4M8 16c0 2 2 4 4 4s4-2 4-4"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),
  spleen: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="12" rx="6" ry="8" opacity="0.3"/>
      <ellipse cx="12" cy="12" rx="4" ry="6"/>
    </svg>
  ),
  liver: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 10c0-4 4-6 8-6s8 2 8 6c0 6-4 10-8 10s-8-4-8-10z" opacity="0.3"/>
      <path d="M8 10c0-2 2-3 4-3s4 1 4 3c0 3-2 5-4 5s-4-2-4-5z"/>
    </svg>
  ),
  kidney: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 4c-3 0-5 4-5 8s2 8 5 8c2 0 3-2 4-4 1 2 2 4 4 4 3 0 5-4 5-8s-2-8-5-8c-2 0-3 2-4 4-1-2-2-4-4-4z" opacity="0.3"/>
    </svg>
  ),
  airway: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-2 0-4 2-4 4v4c0 2 2 4 4 4s4-2 4-4V6c0-2-2-4-4-4z" opacity="0.3"/>
      <path d="M12 14v6M8 20h8" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  brain: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8 2 4 6 4 10c0 3 2 6 4 8v2c0 1 1 2 2 2h4c1 0 2-1 2-2v-2c2-2 4-5 4-8 0-4-4-8-8-8z" opacity="0.3"/>
      <path d="M9 10c0-1 1-2 3-2s3 1 3 2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  endocrine: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9 2 7 4 7 7v2c0 1.5.5 3 2 4v7c0 1 1 2 3 2s3-1 3-2v-7c1.5-1 2-2.5 2-4V7c0-3-2-5-5-5z" opacity="0.3"/>
      <circle cx="12" cy="7" r="2" fill="currentColor"/>
      <path d="M10 13h4M12 13v5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  heme: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="8" opacity="0.3"/>
      <circle cx="12" cy="12" r="5" opacity="0.5"/>
      <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  ortho: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 2v8l-2 2v8h4v-6h4v6h4v-8l-2-2V2h-3v6h-2V2H8z" opacity="0.3"/>
      <path d="M10 8h4M6 12h12M10 18h4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  default: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" opacity="0.3"/>
      <path d="M9 12h6m-6 4h6" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  )
}

type IconType = keyof typeof icons

interface Algorithm {
  id: string
  title: string
  shortTitle: string
  imageSrc: string
  iconType: IconType
}

interface AlgorithmsSectionProps {
  algorithms: Algorithm[]
}

export default function AlgorithmsSection({ algorithms }: AlgorithmsSectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null)

  const openLightbox = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {algorithms.map((algorithm) => (
          <button
            key={algorithm.id}
            onClick={() => openLightbox(algorithm)}
            className="group flex flex-col items-center p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-navy-300 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-navy-200"
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-xl bg-navy-100 flex items-center justify-center mb-3 group-hover:bg-navy-200 transition-colors">
              <div className="text-navy-600">
                {icons[algorithm.iconType]}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-800 text-center leading-tight mb-2">
              {algorithm.shortTitle}
            </h3>

            {/* View button */}
            <span className="text-xs px-4 py-1.5 rounded-full bg-navy-600 text-white group-hover:bg-navy-700 transition-all shadow-sm">
              View Flowchart
            </span>
          </button>
        ))}
      </div>

      {selectedAlgorithm && (
        <ImageLightbox
          src={selectedAlgorithm.imageSrc}
          alt={selectedAlgorithm.title}
          isOpen={lightboxOpen}
          onClose={() => {
            setLightboxOpen(false)
            setSelectedAlgorithm(null)
          }}
        />
      )}
    </>
  )
}
