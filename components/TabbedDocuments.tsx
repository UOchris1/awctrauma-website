'use client'

import { useState } from 'react'
import { FileRecord } from '@/lib/supabase'

interface TabbedDocumentsProps {
  files: {
    cpgs: FileRecord[]
    resident_guidelines: FileRecord[]
    trauma_policies: FileRecord[]
    medical_student: FileRecord[]
    resources: FileRecord[]
  }
}

const tabs = [
  { id: 'cpgs', label: 'Clinical Practice Guidelines', icon: 'clipboard' },
  { id: 'resident_guidelines', label: 'Resident Guidelines', icon: 'book' },
  { id: 'trauma_policies', label: 'Trauma Policies', icon: 'shield' },
  { id: 'medical_student', label: 'Medical Student', icon: 'student' },
  { id: 'resources', label: 'Resources', icon: 'folder' }
] as const

type TabId = typeof tabs[number]['id']

const TabIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'book':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case 'clipboard':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    case 'shield':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    case 'folder':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    case 'student':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      )
    default:
      return null
  }
}

const FileTypeIcon = ({ fileType }: { fileType?: string }) => {
  if (fileType === 'docx' || fileType === 'doc') {
    return (
      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
        <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 17v-1h2v1H8zm0-3v-1h2v1H8zm0-3v-1h2v1H8zm8 6v-1h-4v1h4zm0-3v-1h-4v1h4z"/>
        </svg>
      </div>
    )
  }
  return (
    <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center">
      <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 17v-2h3v2H8zm0-4v-2h8v2H8z"/>
      </svg>
    </div>
  )
}

export default function TabbedDocuments({ files }: TabbedDocumentsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('cpgs')
  const [searchQuery, setSearchQuery] = useState('')

  const currentFiles = files[activeTab].filter(file =>
    file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-navy-600 text-navy-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TabIcon type={tab.icon} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-navy-100 text-navy-700'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {files[tab.id].length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search within tab */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-navy-200 focus:border-navy-400 text-sm"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
        </div>
      </div>

      {/* File List */}
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {currentFiles.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-sm">
              {searchQuery ? 'No documents match your search' : 'No documents in this category'}
            </p>
          </div>
        ) : (
          currentFiles.map((file) => (
            <a
              key={file.id}
              href={`/viewer/${file.id}`}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
            >
              <FileTypeIcon fileType={file.file_type} />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-navy-600 transition-colors">
                  {file.title}
                </h4>
                {file.description && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {file.description}
                  </p>
                )}
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-navy-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))
        )}
      </div>
    </div>
  )
}
