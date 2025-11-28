'use client'

import { useState, useMemo } from 'react'
import { FileCategory, FileRecord } from '@/lib/supabase'
import FileCard from './FileCard'

interface CategorySection {
  title: string
  category: FileCategory
  files: FileRecord[]
  icon: string
  color: string
}

interface SearchableDocumentsProps {
  categories: CategorySection[]
}

export default function SearchableDocuments({ categories }: SearchableDocumentsProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter files based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories
    }

    const query = searchQuery.toLowerCase()
    return categories.map(category => ({
      ...category,
      files: category.files.filter(file =>
        file.title.toLowerCase().includes(query) ||
        (file.description && file.description.toLowerCase().includes(query))
      )
    }))
  }, [categories, searchQuery])

  // Count total matching files
  const totalMatches = useMemo(() => {
    return filteredCategories.reduce((sum, cat) => sum + cat.files.length, 0)
  }, [filteredCategories])

  const totalFiles = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.files.length, 0)
  }, [categories])

  return (
    <div>
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Guidelines & Documents</h2>
            <p className="text-sm text-gray-500">Detailed clinical practice guidelines and policies</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-6 text-sm text-gray-600">
          {totalMatches === 0 ? (
            <p>No documents found for &quot;{searchQuery}&quot;</p>
          ) : (
            <p>Found {totalMatches} document{totalMatches !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;</p>
          )}
        </div>
      )}

      {/* Category Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredCategories.map((section) => {
          // Hide empty categories when searching
          if (searchQuery && section.files.length === 0) {
            return null
          }

          return (
            <section
              key={section.category}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
                {/* Section Header */}
                <div className={`bg-gradient-to-r ${section.color} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{section.icon}</span>
                      <h3 className="text-lg font-semibold">
                        {section.title}
                      </h3>
                    </div>
                    <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                      {section.files.length}
                    </span>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-4">
                  {section.files.length > 0 ? (
                    <div className="space-y-2">
                      {section.files.slice(0, searchQuery ? 10 : 4).map((file) => (
                        <div
                          key={file.id}
                          className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 hover:border-primary-200 transition-all duration-200"
                        >
                          <FileCard file={file} />
                        </div>
                      ))}
                      {!searchQuery && section.files.length > 4 && (
                        <p className="text-sm text-primary-600 text-center pt-2 font-medium">
                          + {section.files.length - 4} more
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <svg
                        className="mx-auto h-10 w-10 text-gray-300 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-gray-500 text-sm">
                        No files available yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* No Results State */}
      {searchQuery && totalMatches === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500">No documents found matching your search.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}
