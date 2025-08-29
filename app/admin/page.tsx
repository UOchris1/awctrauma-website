'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FileCategory } from '@/lib/supabase'

export default function AdminPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<FileCategory>('resident_guidelines')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
    router.refresh()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setMessage({ type: '', text: '' })
    } else {
      setMessage({ type: 'error', text: 'Please upload a PDF file' })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setMessage({ type: '', text: '' })
    } else {
      setMessage({ type: 'error', text: 'Please upload a PDF file' })
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

      if (response.ok) {
        setMessage({ type: 'success', text: 'File uploaded successfully!' })
        // Reset form
        setFile(null)
        setTitle('')
        setDescription('')
        setCategory('resident_guidelines')
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Upload Portal</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Logout
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded mb-6 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

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
              <p className="mb-2 text-gray-600">Drag and drop a PDF file here, or</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:underline font-medium"
              >
                browse files
              </button>
              <p className="text-xs text-gray-500 mt-2">PDF files only, max 10MB</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
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
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={uploading}
          >
            <option value="resident_guidelines">Resident Guidelines</option>
            <option value="cpgs">Clinical Practice Guidelines</option>
            <option value="trauma_policies">Trauma Policies</option>
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

      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Upload Guidelines:</h2>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Only PDF files are accepted</li>
          <li>• Maximum file size: 10MB</li>
          <li>• Ensure documents are properly categorized</li>
          <li>• Use clear, descriptive titles</li>
          <li>• Add descriptions for better searchability</li>
        </ul>
      </div>
    </main>
  )
}