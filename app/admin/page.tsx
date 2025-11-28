'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileCategory, IconType } from '@/lib/supabase'

const ICON_OPTIONS: { value: IconType; label: string }[] = [
  { value: 'ribs', label: 'Ribs (Ortho)' },
  { value: 'pelvis', label: 'Pelvis (Ortho)' },
  { value: 'ortho', label: 'Orthopedic' },
  { value: 'vascular', label: 'Vascular' },
  { value: 'heme', label: 'Hematology' },
  { value: 'spleen', label: 'Spleen' },
  { value: 'liver', label: 'Liver' },
  { value: 'kidney', label: 'Kidney' },
  { value: 'airway', label: 'Airway' },
  { value: 'brain', label: 'Brain/Neuro' },
  { value: 'endocrine', label: 'Endocrine' },
  { value: 'default', label: 'Default' }
]

interface Algorithm {
  id: string
  title: string
  short_title: string
  icon_type: IconType
  image_url: string | null
  sort_order: number
  is_active: boolean
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'documents' | 'algorithms'>('documents')

  // Document upload state
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<FileCategory>('cpgs')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Algorithm state
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([])
  const [loadingAlgorithms, setLoadingAlgorithms] = useState(false)
  const [editingAlgorithm, setEditingAlgorithm] = useState<Algorithm | null>(null)
  const [algorithmImage, setAlgorithmImage] = useState<File | null>(null)
  const algorithmImageRef = useRef<HTMLInputElement>(null)
  const [savingAlgorithm, setSavingAlgorithm] = useState(false)

  // New algorithm form
  const [newAlgorithm, setNewAlgorithm] = useState({
    title: '',
    short_title: '',
    icon_type: 'default' as IconType,
    sort_order: 0
  })
  const [showNewForm, setShowNewForm] = useState(false)
  const newAlgorithmImageRef = useRef<HTMLInputElement>(null)
  const [newAlgorithmImage, setNewAlgorithmImage] = useState<File | null>(null)

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
    router.refresh()
  }

  // Fetch algorithms
  useEffect(() => {
    if (activeTab === 'algorithms') {
      fetchAlgorithms()
    }
  }, [activeTab])

  const fetchAlgorithms = async () => {
    setLoadingAlgorithms(true)
    try {
      const res = await fetch('/api/algorithms')
      if (res.ok) {
        const data = await res.json()
        setAlgorithms(data)
      }
    } catch (error) {
      console.error('Failed to fetch algorithms:', error)
    } finally {
      setLoadingAlgorithms(false)
    }
  }

  // Document upload handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'application/pdf' ||
        droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        droppedFile.type === 'application/msword')) {
      setFile(droppedFile)
      setMessage({ type: '', text: '' })
    } else {
      setMessage({ type: 'error', text: 'Please upload a PDF or Word document' })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMessage({ type: '', text: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'File uploaded successfully!' })
        setFile(null)
        setTitle('')
        setDescription('')
        setCategory('cpgs')
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Upload failed. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  // Algorithm handlers
  const handleUpdateAlgorithm = async (algorithm: Algorithm) => {
    setSavingAlgorithm(true)
    try {
      let imageUrl = algorithm.image_url

      // Upload new image if selected
      if (algorithmImage) {
        const formData = new FormData()
        formData.append('file', algorithmImage)
        formData.append('algorithmId', algorithm.id)

        const uploadRes = await fetch('/api/algorithms/upload-image', {
          method: 'POST',
          body: formData
        })

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          imageUrl = uploadData.imageUrl
        }
      }

      const res = await fetch(`/api/algorithms/${algorithm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...algorithm, image_url: imageUrl })
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Algorithm updated successfully!' })
        setEditingAlgorithm(null)
        setAlgorithmImage(null)
        fetchAlgorithms()
      } else {
        throw new Error('Update failed')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update algorithm' })
    } finally {
      setSavingAlgorithm(false)
    }
  }

  const handleCreateAlgorithm = async () => {
    if (!newAlgorithm.title || !newAlgorithm.short_title) {
      setMessage({ type: 'error', text: 'Please fill in title and short title' })
      return
    }

    setSavingAlgorithm(true)
    try {
      let imageUrl = null

      // Upload image if selected
      if (newAlgorithmImage) {
        const formData = new FormData()
        formData.append('file', newAlgorithmImage)
        formData.append('filename', newAlgorithm.short_title.toLowerCase().replace(/\s+/g, '_'))

        const uploadRes = await fetch('/api/algorithms/upload-image', {
          method: 'POST',
          body: formData
        })

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          imageUrl = uploadData.imageUrl
        }
      }

      const res = await fetch('/api/algorithms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAlgorithm, image_url: imageUrl })
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Algorithm created successfully!' })
        setShowNewForm(false)
        setNewAlgorithm({ title: '', short_title: '', icon_type: 'default', sort_order: 0 })
        setNewAlgorithmImage(null)
        fetchAlgorithms()
      } else {
        throw new Error('Create failed')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create algorithm' })
    } finally {
      setSavingAlgorithm(false)
    }
  }

  const handleDeleteAlgorithm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this algorithm?')) return

    try {
      const res = await fetch(`/api/algorithms/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Algorithm deleted' })
        fetchAlgorithms()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete algorithm' })
    }
  }

  const handleToggleActive = async (algorithm: Algorithm) => {
    try {
      const res = await fetch(`/api/algorithms/${algorithm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...algorithm, is_active: !algorithm.is_active })
      })
      if (res.ok) {
        fetchAlgorithms()
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to toggle algorithm' })
    }
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Portal</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'documents'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upload Documents
        </button>
        <button
          onClick={() => setActiveTab('algorithms')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'algorithms'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Manage Algorithms
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded mb-6 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-primary transition cursor-pointer"
          >
            {file ? (
              <div>
                <svg className="w-12 h-12 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-600 font-medium">Selected: {file.name}</p>
                <p className="text-sm text-gray-500 mt-1">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <>
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-gray-600">Drag and drop a file here, or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline font-medium"
                >
                  browse files
                </button>
                <p className="text-xs text-gray-500 mt-2">PDF, DOCX, DOC files, max 10MB</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter document title"
              required
              disabled={uploading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Optional: Add a brief description"
              rows={3}
              disabled={uploading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as FileCategory)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={uploading}
            >
              <option value="cpgs">Clinical Practice Guidelines</option>
              <option value="resident_guidelines">Resident Guidelines</option>
              <option value="trauma_policies">Trauma Policies</option>
              <option value="medical_student">Medical Student Resources</option>
              <option value="resources">Useful Links & Resources</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={uploading || !file || !title}
            className="w-full bg-primary text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      )}

      {/* Algorithms Tab */}
      {activeTab === 'algorithms' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Flowchart Algorithms</h2>
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              {showNewForm ? 'Cancel' : '+ Add New'}
            </button>
          </div>

          {/* New Algorithm Form */}
          {showNewForm && (
            <div className="border border-green-200 bg-green-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-4">Create New Algorithm</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Title *</label>
                  <input
                    type="text"
                    value={newAlgorithm.title}
                    onChange={(e) => setNewAlgorithm({ ...newAlgorithm, title: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Rib Fracture Management (CWITS)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Short Title *</label>
                  <input
                    type="text"
                    value={newAlgorithm.short_title}
                    onChange={(e) => setNewAlgorithm({ ...newAlgorithm, short_title: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Rib Fracture"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Icon/Category</label>
                  <select
                    value={newAlgorithm.icon_type}
                    onChange={(e) => setNewAlgorithm({ ...newAlgorithm, icon_type: e.target.value as IconType })}
                    className="w-full p-2 border rounded"
                  >
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={newAlgorithm.sort_order}
                    onChange={(e) => setNewAlgorithm({ ...newAlgorithm, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Flowchart Image</label>
                <input
                  ref={newAlgorithmImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewAlgorithmImage(e.target.files?.[0] || null)}
                  className="w-full p-2 border rounded"
                />
                {newAlgorithmImage && (
                  <p className="text-sm text-green-600 mt-1">Selected: {newAlgorithmImage.name}</p>
                )}
              </div>
              <button
                onClick={handleCreateAlgorithm}
                disabled={savingAlgorithm}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {savingAlgorithm ? 'Creating...' : 'Create Algorithm'}
              </button>
            </div>
          )}

          {/* Algorithm List */}
          {loadingAlgorithms ? (
            <div className="text-center py-8 text-gray-500">Loading algorithms...</div>
          ) : (
            <div className="space-y-4">
              {algorithms.map((algo) => (
                <div
                  key={algo.id}
                  className={`border rounded-lg p-4 ${algo.is_active ? 'border-gray-200' : 'border-red-200 bg-red-50'}`}
                >
                  {editingAlgorithm?.id === algo.id ? (
                    // Edit mode
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Full Title</label>
                          <input
                            type="text"
                            value={editingAlgorithm.title}
                            onChange={(e) => setEditingAlgorithm({ ...editingAlgorithm, title: e.target.value })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Short Title</label>
                          <input
                            type="text"
                            value={editingAlgorithm.short_title}
                            onChange={(e) => setEditingAlgorithm({ ...editingAlgorithm, short_title: e.target.value })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Icon/Category</label>
                          <select
                            value={editingAlgorithm.icon_type}
                            onChange={(e) => setEditingAlgorithm({ ...editingAlgorithm, icon_type: e.target.value as IconType })}
                            className="w-full p-2 border rounded"
                          >
                            {ICON_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Sort Order</label>
                          <input
                            type="number"
                            value={editingAlgorithm.sort_order}
                            onChange={(e) => setEditingAlgorithm({ ...editingAlgorithm, sort_order: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Update Flowchart Image</label>
                        <input
                          ref={algorithmImageRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => setAlgorithmImage(e.target.files?.[0] || null)}
                          className="w-full p-2 border rounded"
                        />
                        {algorithmImage && (
                          <p className="text-sm text-green-600 mt-1">New image: {algorithmImage.name}</p>
                        )}
                        {editingAlgorithm.image_url && !algorithmImage && (
                          <p className="text-sm text-gray-500 mt-1">Current: {editingAlgorithm.image_url}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateAlgorithm(editingAlgorithm)}
                          disabled={savingAlgorithm}
                          className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {savingAlgorithm ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingAlgorithm(null)
                            setAlgorithmImage(null)
                          }}
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {algo.image_url && (
                          <img
                            src={algo.image_url}
                            alt={algo.short_title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{algo.short_title}</h3>
                          <p className="text-sm text-gray-500">{algo.title}</p>
                          <p className="text-xs text-gray-400">Order: {algo.sort_order} | Icon: {algo.icon_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(algo)}
                          className={`px-3 py-1 text-xs rounded ${
                            algo.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {algo.is_active ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => setEditingAlgorithm(algo)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAlgorithm(algo.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
