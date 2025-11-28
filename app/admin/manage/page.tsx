'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FileRecord, FileCategory } from '@/lib/supabase'
import AdminNav from '@/components/AdminNav'

const CATEGORY_LABELS: Record<FileCategory, string> = {
  resident_guidelines: 'Resident Guidelines',
  cpgs: 'Clinical Practice Guidelines',
  trauma_policies: 'Trauma Policies',
  resources: 'Useful Links & Resources'
}

const FILE_TYPE_LABELS: Record<string, string> = {
  pdf: 'PDF',
  docx: 'DOCX',
  doc: 'DOC'
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

type SortField = 'created_at' | 'title' | 'updated_at'
type SortOrder = 'asc' | 'desc'

export default function ManageFilesPage() {
  const router = useRouter()
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [categoryFilter, setCategoryFilter] = useState<FileCategory | ''>('')
  const [sortBy, setSortBy] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // Modal states
  const [editingFile, setEditingFile] = useState<FileRecord | null>(null)
  const [deletingFile, setDeletingFile] = useState<FileRecord | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Edit form state
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState<FileCategory>('resident_guidelines')

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder
      })
      if (categoryFilter) {
        params.append('category', categoryFilter)
      }

      const response = await fetch(`/api/admin/files?${params}`)
      if (response.status === 401) {
        router.push('/login')
        return
      }

      const data = await response.json()
      if (response.ok) {
        setFiles(data.files)
        setPagination(prev => ({ ...prev, ...data.pagination }))
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to load files' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load files' })
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, categoryFilter, sortBy, sortOrder, router])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
    router.refresh()
  }

  const openEditModal = (file: FileRecord) => {
    setEditingFile(file)
    setEditTitle(file.title)
    setEditDescription(file.description || '')
    setEditCategory(file.category)
    setMessage({ type: '', text: '' })
  }

  const closeEditModal = () => {
    setEditingFile(null)
    setEditTitle('')
    setEditDescription('')
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFile) return

    setSaving(true)
    try {
      const response = await fetch(`/api/files/${editingFile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          category: editCategory
        })
      })

      const data = await response.json()
      if (response.ok) {
        setFiles(prev => prev.map(f => f.id === editingFile.id ? data.file : f))
        closeEditModal()
        setMessage({ type: 'success', text: 'File updated successfully' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update file' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update file' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingFile) return

    setSaving(true)
    try {
      const response = await fetch(`/api/files/${deletingFile.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFiles(prev => prev.filter(f => f.id !== deletingFile.id))
        setDeletingFile(null)
        setMessage({ type: 'success', text: 'File deleted successfully' })
        // Refresh to update pagination
        fetchFiles()
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Failed to delete file' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete file' })
    } finally {
      setSaving(false)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return null
    return (
      <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {sortOrder === 'asc' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        )}
      </svg>
    )
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Files</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <AdminNav />
      </div>

      {message.text && (
        <div className={`p-4 rounded mb-6 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
              Category:
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as FileCategory | '')
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {pagination.total} file{pagination.total !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : files.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No files found. Upload some files to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('title')}
                  >
                    Title <SortIcon field="title" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('created_at')}
                  >
                    Uploaded <SortIcon field="created_at" />
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900 truncate max-w-xs" title={file.title}>
                        {file.title}
                      </div>
                      {file.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs" title={file.description}>
                          {file.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                        {CATEGORY_LABELS[file.category]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {FILE_TYPE_LABELS[file.file_type || 'pdf'] || file.file_type?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatFileSize(file.file_size)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDate(file.created_at)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/viewer/${file.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                        >
                          View
                        </a>
                        <button
                          onClick={() => openEditModal(file)}
                          className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingFile(file)}
                          className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit File</h2>
            <form onSubmit={handleEdit}>
              <div className="mb-4">
                <label htmlFor="edit-title" className="block text-sm font-medium mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="edit-description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="edit-category" className="block text-sm font-medium mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit-category"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as FileCategory)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={saving || !editTitle}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete File</h2>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this file?
            </p>
            <p className="font-medium text-gray-900 mb-4">
              &quot;{deletingFile.title}&quot;
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The file will be permanently removed from storage.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingFile(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
