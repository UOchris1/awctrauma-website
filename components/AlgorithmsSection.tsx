'use client'

import { useState } from 'react'
import ImageLightbox from './ImageLightbox'

// Medical icons as SVG components
const icons = {
  ribs: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" opacity="0.3" />
      <path d="M4 8h16M4 12h16M4 16h16" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  pelvis: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4C8 4 4 8 4 12c0 2 1 4 3 5l1 3h8l1-3c2-1 3-3 3-5 0-4-4-8-8-8z" opacity="0.3" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  ),
  vascular: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 4v16M8 8c0-2 2-4 4-4s4 2 4 4M8 16c0 2 2 4 4 4s4-2 4-4" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  spleen: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="12" rx="6" ry="8" opacity="0.3" />
      <ellipse cx="12" cy="12" rx="4" ry="6" />
    </svg>
  ),
  liver: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 10c0-4 4-6 8-6s8 2 8 6c0 6-4 10-8 10s-8-4-8-10z" opacity="0.3" />
      <path d="M8 10c0-2 2-3 4-3s4 1 4 3c0 3-2 5-4 5s-4-2-4-5z" />
    </svg>
  ),
  kidney: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 4c-3 0-5 4-5 8s2 8 5 8c2 0 3-2 4-4 1 2 2 4 4 4 3 0 5-4 5-8s-2-8-5-8c-2 0-3 2-4 4-1-2-2-4-4-4z" opacity="0.3" />
    </svg>
  ),
  airway: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-2 0-4 2-4 4v4c0 2 2 4 4 4s4-2 4-4V6c0-2-2-4-4-4z" opacity="0.3" />
      <path d="M12 14v6M8 20h8" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  brain: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8 2 4 6 4 10c0 3 2 6 4 8v2c0 1 1 2 2 2h4c1 0 2-1 2-2v-2c2-2 4-5 4-8 0-4-4-8-8-8z" opacity="0.3" />
      <path d="M9 10c0-1 1-2 3-2s3 1 3 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  endocrine: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9 2 7 4 7 7v2c0 1.5.5 3 2 4v7c0 1 1 2 3 2s3-1 3-2v-7c1.5-1 2-2.5 2-4V7c0-3-2-5-5-5z" opacity="0.3" />
      <circle cx="12" cy="7" r="2" fill="currentColor" />
      <path d="M10 13h4M12 13v5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  heme: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="8" opacity="0.3" />
      <circle cx="12" cy="12" r="5" opacity="0.5" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  ortho: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 2v8l-2 2v8h4v-6h4v6h4v-8l-2-2V2h-3v6h-2V2H8z" opacity="0.3" />
      <path d="M10 8h4M6 12h12M10 18h4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  default: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" opacity="0.3" />
      <path d="M9 12h6m-6 4h6" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  )
}

type IconType = keyof typeof icons
type CardColor = 'auto' | 'blue' | 'rose' | 'emerald' | 'amber' | 'sky' | 'indigo' | 'purple' | 'teal' | 'orange'

interface Algorithm {
  id: string
  title: string
  shortTitle: string
  imageSrc: string
  iconType: IconType
  cardColor?: CardColor
}

interface AlgorithmsSectionProps {
  algorithms: Algorithm[]
}

// Category mapping based on PROMPT.md spec
const categoryMap: Record<IconType, 'ortho' | 'vascular' | 'solid' | 'endocrine' | 'airway' | 'neuro'> = {
  ribs: 'ortho',
  pelvis: 'ortho',
  ortho: 'ortho',
  vascular: 'vascular',
  heme: 'vascular',
  spleen: 'solid',
  liver: 'solid',
  kidney: 'solid',
  endocrine: 'endocrine',
  airway: 'airway',
  brain: 'neuro',
  default: 'neuro'
}

// Color styles for each medical category (Gemini's border-t-4 approach)
const colorStyles = {
  ortho: {
    cardHover: 'hover:shadow-lg focus:ring-blue-200/50',
    iconBg: 'bg-blue-100 group-hover:bg-blue-200',
    iconText: 'text-blue-800',
    button: 'bg-blue-700 hover:bg-blue-800',
    borderTop: 'border-t-blue-600'
  },
  vascular: {
    cardHover: 'hover:shadow-lg focus:ring-rose-200/50',
    iconBg: 'bg-rose-100 group-hover:bg-rose-200',
    iconText: 'text-rose-700',
    button: 'bg-rose-600 hover:bg-rose-700',
    borderTop: 'border-t-rose-500'
  },
  solid: {
    cardHover: 'hover:shadow-lg focus:ring-emerald-200/50',
    iconBg: 'bg-emerald-100 group-hover:bg-emerald-200',
    iconText: 'text-emerald-700',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    borderTop: 'border-t-emerald-500'
  },
  endocrine: {
    cardHover: 'hover:shadow-lg focus:ring-amber-200/50',
    iconBg: 'bg-amber-100 group-hover:bg-amber-200',
    iconText: 'text-amber-700',
    button: 'bg-amber-600 hover:bg-amber-700',
    borderTop: 'border-t-amber-500'
  },
  airway: {
    cardHover: 'hover:shadow-lg focus:ring-sky-200/50',
    iconBg: 'bg-sky-100 group-hover:bg-sky-200',
    iconText: 'text-sky-700',
    button: 'bg-sky-600 hover:bg-sky-700',
    borderTop: 'border-t-sky-500'
  },
  neuro: {
    cardHover: 'hover:shadow-lg focus:ring-indigo-200/50',
    iconBg: 'bg-indigo-100 group-hover:bg-indigo-200',
    iconText: 'text-indigo-700',
    button: 'bg-indigo-600 hover:bg-indigo-700',
    borderTop: 'border-t-indigo-500'
  }
}

// Custom color overrides (when user picks a specific color)
const customColorStyles: Record<Exclude<CardColor, 'auto'>, typeof colorStyles.ortho> = {
  blue: colorStyles.ortho,
  rose: colorStyles.vascular,
  emerald: colorStyles.solid,
  amber: colorStyles.endocrine,
  sky: colorStyles.airway,
  indigo: colorStyles.neuro,
  purple: {
    cardHover: 'hover:shadow-lg focus:ring-purple-200/50',
    iconBg: 'bg-purple-100 group-hover:bg-purple-200',
    iconText: 'text-purple-700',
    button: 'bg-purple-600 hover:bg-purple-700',
    borderTop: 'border-t-purple-600'
  },
  teal: {
    cardHover: 'hover:shadow-lg focus:ring-teal-200/50',
    iconBg: 'bg-teal-100 group-hover:bg-teal-200',
    iconText: 'text-teal-700',
    button: 'bg-teal-600 hover:bg-teal-700',
    borderTop: 'border-t-teal-500'
  },
  orange: {
    cardHover: 'hover:shadow-lg focus:ring-orange-200/50',
    iconBg: 'bg-orange-100 group-hover:bg-orange-200',
    iconText: 'text-orange-700',
    button: 'bg-orange-600 hover:bg-orange-700',
    borderTop: 'border-t-orange-500'
  }
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
      {/* Updated grid layout with better gap (Gemini) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {algorithms.map((algorithm) => {
          // Use custom color if set, otherwise auto-detect from icon
          const category = categoryMap[algorithm.iconType] || 'neuro'
          const styles = algorithm.cardColor && algorithm.cardColor !== 'auto'
            ? customColorStyles[algorithm.cardColor]
            : colorStyles[category]

          return (
            <button
              key={algorithm.id}
              onClick={() => openLightbox(algorithm)}
              // Gemini's border-t-4 for category indication + subtle side/bottom border
              className={`group flex flex-col h-full items-center pt-5 pb-4 px-4 rounded-xl border-b border-x border-silver-200 border-t-4 bg-white shadow-md transition-all duration-300 focus:outline-none focus:ring-4 ${styles.cardHover} ${styles.borderTop}`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-colors ${styles.iconBg} ${styles.iconText}`}>
                <div>
                  {icons[algorithm.iconType]}
                </div>
              </div>

              {/* Title - flex-grow ensures buttons align at bottom */}
              <h3 className="text-sm font-semibold text-navy-800 text-center leading-snug mb-4 flex-grow">
                {algorithm.shortTitle}
              </h3>

              {/* View button */}
              <span className={`text-xs px-4 py-1.5 rounded-full text-white transition-all shadow-sm ${styles.button}`}>
                View Flowchart
              </span>
            </button>
          )
        })}
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
