'use client'

import { FileRecord } from '@/lib/supabase'
import Link from 'next/link'
import SkeletonCard from './SkeletonCard'

interface FileCardProps {
  file: FileRecord
}

export default function FileCard({ file }: FileCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Link
      href={`/viewer/${file.id}`}
      className="block p-3 bg-white rounded hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 group"
      aria-label={`View ${file.title} PDF document`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-primary-900 mb-1 group-hover:text-primary-700">
            {file.title}
          </h3>
          {file.description && (
            <p className="text-sm text-primary-700 mb-2">{file.description}</p>
          )}
          <div className="flex items-center space-x-4 text-xs text-primary-600">
            <span aria-label="File type" className="font-medium">PDF</span>
            <time dateTime={file.created_at} aria-label="Upload date">
              {formatDate(file.created_at)}
            </time>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <svg 
            className="w-5 h-5 text-primary-400 group-hover:text-primary-600 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export function FileCardSkeleton() {
  return <SkeletonCard />
}