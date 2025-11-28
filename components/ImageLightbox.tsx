'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import Image from 'next/image'

interface ImageLightboxProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

interface TouchState {
  scale: number
  translateX: number
  translateY: number
  lastDistance: number
  lastX: number
  lastY: number
  isPinching: boolean
  isPanning: boolean
}

export default function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const [touchState, setTouchState] = useState<TouchState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
    lastDistance: 0,
    lastX: 0,
    lastY: 0,
    isPinching: false,
    isPanning: false
  })

  const resetTransform = useCallback(() => {
    setTouchState({
      scale: 1,
      translateX: 0,
      translateY: 0,
      lastDistance: 0,
      lastX: 0,
      lastY: 0,
      isPinching: false,
      isPanning: false
    })
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      resetTransform()
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown, resetTransform])

  // Calculate distance between two touch points
  const getDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Get center point between two touches
  const getCenter = (touches: React.TouchList) => {
    if (touches.length < 2) {
      return { x: touches[0].clientX, y: touches[0].clientY }
    }
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()

    if (e.touches.length === 2) {
      // Pinch start
      const distance = getDistance(e.touches)
      setTouchState(prev => ({
        ...prev,
        lastDistance: distance,
        isPinching: true,
        isPanning: false
      }))
    } else if (e.touches.length === 1 && touchState.scale > 1) {
      // Pan start (only when zoomed in)
      setTouchState(prev => ({
        ...prev,
        lastX: e.touches[0].clientX,
        lastY: e.touches[0].clientY,
        isPanning: true,
        isPinching: false
      }))
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation()

    if (e.touches.length === 2 && touchState.isPinching) {
      // Pinch zoom
      const distance = getDistance(e.touches)
      const delta = distance / touchState.lastDistance

      setTouchState(prev => {
        const newScale = Math.min(Math.max(prev.scale * delta, 0.5), 5)
        return {
          ...prev,
          scale: newScale,
          lastDistance: distance
        }
      })
    } else if (e.touches.length === 1 && touchState.isPanning && touchState.scale > 1) {
      // Pan when zoomed
      const deltaX = e.touches[0].clientX - touchState.lastX
      const deltaY = e.touches[0].clientY - touchState.lastY

      setTouchState(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY,
        lastX: e.touches[0].clientX,
        lastY: e.touches[0].clientY
      }))
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation()

    if (e.touches.length === 0) {
      setTouchState(prev => ({
        ...prev,
        isPinching: false,
        isPanning: false
      }))

      // Reset if zoomed out too much
      if (touchState.scale < 1) {
        resetTransform()
      }
    } else if (e.touches.length === 1) {
      // Switched from pinch to potential pan
      setTouchState(prev => ({
        ...prev,
        isPinching: false,
        isPanning: prev.scale > 1,
        lastX: e.touches[0].clientX,
        lastY: e.touches[0].clientY
      }))
    }
  }

  // Double-tap to zoom/reset
  const lastTapRef = useRef<number>(0)
  const handleDoubleTap = (e: React.TouchEvent) => {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      e.preventDefault()
      if (touchState.scale > 1) {
        resetTransform()
      } else {
        setTouchState(prev => ({
          ...prev,
          scale: 2.5,
          translateX: 0,
          translateY: 0
        }))
      }
    }
    lastTapRef.current = now
  }

  // Mouse wheel zoom for desktop
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setTouchState(prev => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * delta, 0.5), 5)
    }))
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Top bar with close button and title */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white text-lg font-medium truncate pr-4 max-w-[70%]">
          {alt}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white flex-shrink-0"
          aria-label="Close"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Image container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden flex items-center justify-center touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={imageRef}
          className="transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${touchState.translateX}px, ${touchState.translateY}px) scale(${touchState.scale})`,
            transformOrigin: 'center center'
          }}
          onTouchEnd={handleDoubleTap}
        >
          <Image
            src={src}
            alt={alt}
            width={1920}
            height={1080}
            className="max-w-[95vw] max-h-[80vh] w-auto h-auto object-contain select-none"
            style={{ pointerEvents: 'none' }}
            draggable={false}
            priority
          />
        </div>
      </div>

      {/* Bottom instructions */}
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Pinch to zoom
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            Double-tap to zoom
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
            Drag to pan
          </span>
        </div>
        {touchState.scale !== 1 && (
          <div className="flex justify-center mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                resetTransform()
              }}
              className="text-xs px-3 py-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
            >
              Reset zoom ({Math.round(touchState.scale * 100)}%)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
