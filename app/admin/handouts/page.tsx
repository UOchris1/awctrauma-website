'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import MarkdownRenderer from '@/components/MarkdownRenderer'

type PreviewType = 'markdown' | 'docx' | 'pdf'

interface HandoutAssetApi {
  label: string
  path: string
  exists: boolean
  sizeBytes: number | null
  lastModified: string | null
}

interface FileStatsApi {
  exists: boolean
  sizeBytes: number | null
  lastModified: string | null
}

interface AdminHandout {
  slug: string
  group: string
  title: string
  summary: string
  previewType: PreviewType
  previewPath: string
  markdownPath: string | null
  docxPath: string | null
  previewStats: FileStatsApi
  markdownStats: FileStatsApi | null
  docxStats: FileStatsApi | null
  assets: HandoutAssetApi[]
}

interface HandoutListResponse {
  handouts: AdminHandout[]
}

interface MarkdownResponse {
  slug: string
  markdownPath: string
  content: string
  stats: FileStatsApi
}

const GROUP_ORDER = [
  'Ventilator Care',
  'Infection Prevention',
  'VTE and Anticoagulation',
  'Perioperative',
  'Special Populations',
  'Orthopaedic Trauma'
]

function formatDate(iso: string | null): string {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleString()
}

function formatSize(sizeBytes: number | null): string {
  if (sizeBytes === null) return 'N/A'
  if (sizeBytes < 1024) return `${sizeBytes} B`
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(1)} KB`
  return `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function HandoutsAdminPage() {
  const router = useRouter()
  const [handouts, setHandouts] = useState<AdminHandout[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSlug, setSelectedSlug] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [markdownLoading, setMarkdownLoading] = useState(false)
  const [markdownContent, setMarkdownContent] = useState('')
  const [savedMarkdownContent, setSavedMarkdownContent] = useState('')
  const [savingMarkdown, setSavingMarkdown] = useState(false)
  const [docxUploading, setDocxUploading] = useState(false)
  const [docxFile, setDocxFile] = useState<File | null>(null)
  const [generatingDocx, setGeneratingDocx] = useState(false)
  const [editorMode, setEditorMode] = useState<'split' | 'write' | 'preview'>('split')

  const selectedHandout = handouts.find((item) => item.slug === selectedSlug) ?? null
  const markdownDirty = markdownContent !== savedMarkdownContent

  const sortedHandouts = useMemo(() => {
    const rankedGroups = new Map(GROUP_ORDER.map((group, index) => [group, index]))
    return [...handouts].sort((a, b) => {
      const aGroupRank = rankedGroups.get(a.group) ?? 999
      const bGroupRank = rankedGroups.get(b.group) ?? 999
      if (aGroupRank !== bGroupRank) return aGroupRank - bGroupRank
      return a.title.localeCompare(b.title)
    })
  }, [handouts])

  const filteredHandouts = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return sortedHandouts
    return sortedHandouts.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.group}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }, [search, sortedHandouts])

  async function fetchHandouts(keepSelection = true) {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/handouts')
      if (response.status === 401) {
        router.push('/login')
        return
      }

      const data = (await response.json()) as HandoutListResponse
      const fetched = data.handouts ?? []
      setHandouts(fetched)

      if (!keepSelection || !selectedSlug || !fetched.some((item) => item.slug === selectedSlug)) {
        setSelectedSlug(fetched[0]?.slug ?? '')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load handouts.' })
    } finally {
      setLoading(false)
    }
  }

  async function loadMarkdown(slug: string) {
    try {
      setMarkdownLoading(true)
      const response = await fetch(`/api/admin/handouts/${slug}/markdown`)
      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        throw new Error(data.error || 'Failed to load markdown')
      }

      const data = (await response.json()) as MarkdownResponse
      setMarkdownContent(data.content)
      setSavedMarkdownContent(data.content)
    } catch (error) {
      setMarkdownContent('')
      setSavedMarkdownContent('')
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to load markdown.' })
    } finally {
      setMarkdownLoading(false)
    }
  }

  useEffect(() => {
    fetchHandouts(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handout = handouts.find((item) => item.slug === selectedSlug)
    setDocxFile(null)
    setMessage(null)

    if (!handout?.markdownPath) {
      setMarkdownContent('')
      setSavedMarkdownContent('')
      return
    }

    loadMarkdown(selectedSlug)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug])

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
    router.refresh()
  }

  const handleSaveMarkdown = async () => {
    if (!selectedHandout?.markdownPath) return

    try {
      setSavingMarkdown(true)
      const response = await fetch(`/api/admin/handouts/${selectedHandout.slug}/markdown`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: markdownContent })
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        throw new Error(data.error || 'Failed to save markdown')
      }

      setSavedMarkdownContent(markdownContent)
      setMessage({ type: 'success', text: 'Markdown saved.' })
      await fetchHandouts()
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save markdown.' })
    } finally {
      setSavingMarkdown(false)
    }
  }

  const handleGenerateDocx = async () => {
    if (!selectedHandout?.markdownPath || !selectedHandout.docxPath) return

    try {
      setGeneratingDocx(true)
      const response = await fetch(`/api/admin/handouts/${selectedHandout.slug}/generate-docx`, {
        method: 'POST'
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        throw new Error(data.error || 'Failed to generate DOCX')
      }

      setMessage({ type: 'success', text: 'DOCX regenerated from markdown.' })
      await fetchHandouts()
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to generate DOCX.' })
    } finally {
      setGeneratingDocx(false)
    }
  }

  const handleReplaceDocx = async () => {
    if (!selectedHandout?.docxPath || !docxFile) return

    try {
      setDocxUploading(true)
      const formData = new FormData()
      formData.append('file', docxFile)

      const response = await fetch(`/api/admin/handouts/${selectedHandout.slug}/docx`, {
        method: 'POST',
        body: formData
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        throw new Error(data.error || 'Failed to replace DOCX')
      }

      setDocxFile(null)
      setMessage({ type: 'success', text: 'DOCX replaced.' })
      await fetchHandouts()
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to replace DOCX.' })
    } finally {
      setDocxUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-silver-100">
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Handout Editor</h1>
            <p className="text-silver-300 text-sm">Edit markdown, regenerate DOCX, or replace DOCX files.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <AdminNav />
      </div>

      {message && (
        <div className="max-w-7xl mx-auto px-4">
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-rose-300 bg-rose-50 text-rose-700'
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <aside className="lg:col-span-4 bg-white rounded-xl border border-silver-200 shadow-card">
            <div className="p-4 border-b border-silver-200">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search handouts..."
                className="w-full rounded-lg border border-silver-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div className="max-h-[70vh] overflow-auto p-2 space-y-1.5">
              {loading ? (
                <div className="p-4 text-sm text-slate-500">Loading handouts...</div>
              ) : filteredHandouts.length === 0 ? (
                <div className="p-4 text-sm text-slate-500">No handouts match the current search.</div>
              ) : (
                filteredHandouts.map((item) => {
                  const isSelected = item.slug === selectedSlug
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => setSelectedSlug(item.slug)}
                      className={`w-full text-left rounded-lg border px-3 py-3 transition-colors ${
                        isSelected
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-transparent bg-silver-50 hover:border-silver-300 hover:bg-white'
                      }`}
                    >
                      <div className="text-xs uppercase tracking-wide text-slate-500">{item.group}</div>
                      <div className="font-semibold text-slate-900 mt-0.5">{item.title}</div>
                      <div className="text-xs text-slate-600 mt-1 line-clamp-2">{item.summary}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.markdownPath && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">Markdown</span>
                        )}
                        {item.docxPath && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">DOCX</span>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </aside>

          <section className="lg:col-span-8">
            {!selectedHandout ? (
              <div className="bg-white rounded-xl border border-silver-200 shadow-card p-6 text-slate-600">
                Select a handout to begin editing.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-silver-200 shadow-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{selectedHandout.group}</p>
                      <h2 className="text-xl font-bold text-slate-900">{selectedHandout.title}</h2>
                      <p className="text-sm text-slate-600 mt-1">{selectedHandout.summary}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/sicu-deliverables/preview/${selectedHandout.slug}`}
                        target="_blank"
                        className="px-3 py-2 rounded-md bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                      >
                        Open Public Preview
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-lg border border-silver-200 bg-silver-50 px-3 py-2">
                      <div className="text-slate-500">Preview file</div>
                      <div className="font-medium text-slate-800">{selectedHandout.previewPath}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Updated: {formatDate(selectedHandout.previewStats.lastModified)}
                      </div>
                    </div>
                    <div className="rounded-lg border border-silver-200 bg-silver-50 px-3 py-2">
                      <div className="text-slate-500">Markdown</div>
                      <div className="font-medium text-slate-800">{selectedHandout.markdownPath ?? 'N/A'}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Size: {formatSize(selectedHandout.markdownStats?.sizeBytes ?? null)}
                      </div>
                    </div>
                    <div className="rounded-lg border border-silver-200 bg-silver-50 px-3 py-2">
                      <div className="text-slate-500">DOCX</div>
                      <div className="font-medium text-slate-800">{selectedHandout.docxPath ?? 'N/A'}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Size: {formatSize(selectedHandout.docxStats?.sizeBytes ?? null)}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedHandout.docxPath && (
                  <div className="bg-white rounded-xl border border-silver-200 shadow-card p-5">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">DOCX Replace</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="file"
                        accept=".docx"
                        onChange={(event) => setDocxFile(event.target.files?.[0] || null)}
                        className="text-sm text-slate-700"
                      />
                      <button
                        type="button"
                        onClick={handleReplaceDocx}
                        disabled={docxUploading || !docxFile}
                        className="px-3 py-2 rounded-md bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {docxUploading ? 'Replacing...' : 'Replace DOCX'}
                      </button>
                      <a
                        href={selectedHandout.docxPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-700 hover:text-primary-800 underline"
                      >
                        Open Current DOCX
                      </a>
                    </div>
                    {selectedHandout.markdownPath && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={handleGenerateDocx}
                          disabled={generatingDocx}
                          className="px-3 py-2 rounded-md bg-navy-700 text-white text-sm font-medium hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {generatingDocx ? 'Generating DOCX...' : 'Regenerate DOCX from Markdown'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {selectedHandout.markdownPath && (
                  <div className="bg-white rounded-xl border border-silver-200 shadow-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">Markdown Editor</h3>
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:flex rounded-lg border border-silver-300 overflow-hidden">
                          {(['write', 'split', 'preview'] as const).map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setEditorMode(mode)}
                              className={`px-3 py-1.5 text-sm ${
                                editorMode === mode
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-white text-slate-700 hover:bg-silver-100'
                              }`}
                            >
                              {mode[0].toUpperCase() + mode.slice(1)}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setMarkdownContent(savedMarkdownContent)}
                          disabled={!markdownDirty || savingMarkdown}
                          className="px-3 py-2 rounded-md border border-silver-300 text-sm text-slate-700 hover:bg-silver-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Revert
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveMarkdown}
                          disabled={!markdownDirty || savingMarkdown}
                          className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {savingMarkdown ? 'Saving...' : 'Save Markdown'}
                        </button>
                      </div>
                    </div>

                    {markdownLoading ? (
                      <div className="py-10 text-center text-slate-500">Loading markdown...</div>
                    ) : (
                      <div
                        className={`grid gap-4 ${
                          editorMode === 'split'
                            ? 'grid-cols-1 xl:grid-cols-2'
                            : editorMode === 'write'
                              ? 'grid-cols-1'
                              : 'grid-cols-1'
                        }`}
                      >
                        {editorMode !== 'preview' && (
                          <textarea
                            value={markdownContent}
                            onChange={(event) => setMarkdownContent(event.target.value)}
                            className="min-h-[420px] w-full rounded-lg border border-silver-300 p-3 font-mono text-sm leading-6 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                          />
                        )}
                        {editorMode !== 'write' && (
                          <div className="min-h-[420px] rounded-lg border border-silver-300 bg-silver-50/40 p-4 overflow-auto">
                            <MarkdownRenderer content={markdownContent} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
