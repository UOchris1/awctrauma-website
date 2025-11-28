'use client'

import { useState, useEffect, useRef } from 'react'
import { FileRecord } from '@/lib/supabase'

interface Algorithm {
  id: string
  title: string
  shortTitle: string
  imageSrc: string
  iconType: string
}

interface GlobalSearchProps {
  files: FileRecord[]
  algorithms: Algorithm[]
}

interface SearchResult {
  type: 'file' | 'algorithm'
  id: string
  title: string
  category?: string
  url: string
}

export default function GlobalSearch({ files, algorithms }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchQuery = query.toLowerCase()
    const matchedResults: SearchResult[] = []

    // Search algorithms
    algorithms.forEach(algo => {
      if (
        algo.title.toLowerCase().includes(searchQuery) ||
        algo.shortTitle.toLowerCase().includes(searchQuery)
      ) {
        matchedResults.push({
          type: 'algorithm',
          id: algo.id,
          title: algo.title,
          url: `#${algo.id}`
        })
      }
    })

    // Search files
    files.forEach(file => {
      if (
        file.title.toLowerCase().includes(searchQuery) ||
        (file.description && file.description.toLowerCase().includes(searchQuery))
      ) {
        matchedResults.push({
          type: 'file',
          id: file.id,
          title: file.title,
          category: file.category,
          url: `/viewer/${file.id}`
        })
      }
    })

    setResults(matchedResults.slice(0, 8))
    setIsOpen(matchedResults.length > 0)
    setSelectedIndex(0)
  }, [query, files, algorithms])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          navigateToResult(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  const navigateToResult = (result: SearchResult) => {
    if (result.type === 'algorithm') {
      // Scroll to algorithm section and trigger lightbox
      const element = document.getElementById('algorithms')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      window.location.href = result.url
    }
    setQuery('')
    setIsOpen(false)
  }

  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      resident_guidelines: 'Guidelines',
      cpgs: 'CPGs',
      trauma_policies: 'Policies',
      resources: 'Resources'
    }
    return category ? labels[category] || category : ''
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search algorithms, guidelines, policies..."
          className="w-full px-4 py-3 pl-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
        >
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => navigateToResult(result)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                index === selectedIndex ? 'bg-navy-50' : 'hover:bg-gray-50'
              }`}
            >
              {/* Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                result.type === 'algorithm' ? 'bg-navy-100 text-navy-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {result.type === 'algorithm' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {result.title}
                </p>
                <p className="text-xs text-gray-500">
                  {result.type === 'algorithm' ? 'Quick Reference Algorithm' : getCategoryLabel(result.category)}
                </p>
              </div>

              {/* Arrow */}
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
