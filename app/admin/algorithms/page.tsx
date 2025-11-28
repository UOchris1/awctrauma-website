'use client'

import { useState, useEffect } from 'react'
import AdminNav from '@/components/AdminNav'
import { AlgorithmRecord, IconType } from '@/lib/supabase'

const ICON_OPTIONS: { value: IconType; label: string }[] = [
  { value: 'ribs', label: 'Ribs' },
  { value: 'pelvis', label: 'Pelvis' },
  { value: 'vascular', label: 'Vascular' },
  { value: 'spleen', label: 'Spleen' },
  { value: 'liver', label: 'Liver' },
  { value: 'kidney', label: 'Kidney' },
  { value: 'airway', label: 'Airway' },
  { value: 'brain', label: 'Brain' },
  { value: 'endocrine', label: 'Endocrine' },
  { value: 'heme', label: 'Heme/Blood' },
  { value: 'ortho', label: 'Ortho/Bone' },
  { value: 'default', label: 'Default' }
]

export default function AlgorithmsManagePage() {
  const [algorithms, setAlgorithms] = useState<AlgorithmRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmRecord | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    short_title: '',
    icon_type: 'default' as IconType,
    is_active: true
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchAlgorithms = async () => {
    try {
      const res = await fetch('/api/admin/algorithms')
      const data = await res.json()
      if (data.algorithms) {
        setAlgorithms(data.algorithms)
      }
    } catch (err) {
      setError('Failed to load algorithms')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlgorithms()
  }, [])

  const handleAdd = async () => {
    setSubmitting(true)
    try {
      // Create algorithm
      const res = await fetch('/api/admin/algorithms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Upload image if provided
      if (imageFile && data.algorithm) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', imageFile)
        formDataUpload.append('algorithmId', data.algorithm.id)

        await fetch('/api/upload-algorithm-image', {
          method: 'POST',
          body: formDataUpload
        })
      }

      setShowAddModal(false)
      resetForm()
      fetchAlgorithms()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add algorithm')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedAlgorithm) return
    setSubmitting(true)

    try {
      const res = await fetch(`/api/admin/algorithms/${selectedAlgorithm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Upload new image if provided
      if (imageFile) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', imageFile)
        formDataUpload.append('algorithmId', selectedAlgorithm.id)

        await fetch('/api/upload-algorithm-image', {
          method: 'POST',
          body: formDataUpload
        })
      }

      setShowEditModal(false)
      resetForm()
      fetchAlgorithms()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update algorithm')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedAlgorithm) return
    setSubmitting(true)

    try {
      const res = await fetch(`/api/admin/algorithms/${selectedAlgorithm.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      setShowDeleteModal(false)
      setSelectedAlgorithm(null)
      fetchAlgorithms()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete algorithm')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      short_title: '',
      icon_type: 'default',
      is_active: true
    })
    setImageFile(null)
    setSelectedAlgorithm(null)
  }

  const openEditModal = (algorithm: AlgorithmRecord) => {
    setSelectedAlgorithm(algorithm)
    setFormData({
      title: algorithm.title,
      short_title: algorithm.short_title,
      icon_type: algorithm.icon_type,
      is_active: algorithm.is_active
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (algorithm: AlgorithmRecord) => {
    setSelectedAlgorithm(algorithm)
    setShowDeleteModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Algorithms</h1>
          <button
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Algorithm
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
            <button onClick={() => setError('')} className="ml-2 text-red-500 hover:text-red-700">×</button>
          </div>
        )}

        {/* Algorithms Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Short Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Icon</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Image</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {algorithms.map((algo) => (
                <tr key={algo.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{algo.sort_order}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{algo.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{algo.short_title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{algo.icon_type}</td>
                  <td className="px-4 py-3">
                    {algo.image_url ? (
                      <span className="text-green-600 text-sm">Uploaded</span>
                    ) : (
                      <span className="text-gray-400 text-sm">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      algo.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {algo.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEditModal(algo)}
                      className="text-navy-600 hover:text-navy-800 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(algo)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {algorithms.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No algorithms found. Add your first algorithm to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Algorithm</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-200 focus:border-navy-400"
                  placeholder="e.g., Rib Fracture Management (CWITS)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Title</label>
                <input
                  type="text"
                  value={formData.short_title}
                  onChange={(e) => setFormData({ ...formData, short_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-200 focus:border-navy-400"
                  placeholder="e.g., Rib Fracture"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Type</label>
                <select
                  value={formData.icon_type}
                  onChange={(e) => setFormData({ ...formData, icon_type: e.target.value as IconType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-200 focus:border-navy-400"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flowchart Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-200 focus:border-navy-400"
                />
                <p className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF, or WebP. Max 10MB.</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-navy-600 focus:ring-navy-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Active (visible on homepage)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={submitting || !formData.title || !formData.short_title}
                className="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Adding...' : 'Add Algorithm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAlgorithm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Algorithm</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-200 focus:border-navy-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Title</label>
                <input
                  type="text"
                  value={formData.short_title}
                  onChange={(e) => setFormData({ ...formData, short_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-200 focus:border-navy-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Type</label>
                <select
                  value={formData.icon_type}
                  onChange={(e) => setFormData({ ...formData, icon_type: e.target.value as IconType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-200 focus:border-navy-400"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Replace Flowchart Image
                  {selectedAlgorithm.image_url && (
                    <span className="text-green-600 ml-2">(Current image uploaded)</span>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-200 focus:border-navy-400"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit_is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-navy-600 focus:ring-navy-500 border-gray-300 rounded"
                />
                <label htmlFor="edit_is_active" className="ml-2 text-sm text-gray-700">
                  Active (visible on homepage)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  resetForm()
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={submitting || !formData.title || !formData.short_title}
                className="px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAlgorithm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Algorithm</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedAlgorithm.title}</strong>?
              This will also remove the associated flowchart image. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedAlgorithm(null)
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
