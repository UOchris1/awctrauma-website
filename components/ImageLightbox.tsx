'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'

interface ImageLightboxProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export default function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Title */}
      <div className="absolute top-4 left-4 text-white text-lg font-medium bg-black/50 px-4 py-2 rounded-lg">
        {alt}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-4 py-2 rounded-lg">
        Pinch to zoom | Click anywhere to close | Press ESC
      </div>

      {/* Image container with overflow scroll for zoom */}
      <div
        className="w-full h-full overflow-auto flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative min-w-full min-h-full flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            width={1920}
            height={1080}
            className="max-w-none w-auto h-auto max-h-[90vh] object-contain cursor-zoom-in active:cursor-grabbing touch-pinch-zoom"
            style={{ touchAction: 'pinch-zoom' }}
            onClick={onClose}
            priority
          />
        </div>
      </div>
    </div>
  )
}
