'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileCategory, IconType, CardColor } from '@/lib/supabase'

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
  { value: 'default', label: 'Default' },
]

const COLOR_OPTIONS: { value: CardColor; label: string; dot: string }[] = [
  { value: 'auto', label: 'Auto (by icon)', dot: 'bg-gradient-to-br from-slate-400 to-slate-300' },
  { value: 'blue', label: 'Blue', dot: 'bg-blue-600' },
  { value: 'rose', label: 'Rose', dot: 'bg-rose-500' },
  { value: 'emerald', label: 'Emerald', dot: 'bg-emerald-500' },
  { value: 'amber', label: 'Amber', dot: 'bg-amber-500' },
  { value: 'sky', label: 'Sky', dot: 'bg-sky-500' },
  { value: 'indigo', label: 'Indigo', dot: 'bg-indigo-600' },
  { value: 'purple', label: 'Purple', dot: 'bg-purple-600' },
  { value: 'teal', label: 'Teal', dot: 'bg-teal-500' },
  { value: 'orange', label: 'Orange', dot: 'bg-orange-500' },
]

const CATEGORY_OPTIONS: { value: FileCategory; label: string; short: string }[] = [
  { value: 'cpgs', label: 'Clinical Practice Guidelines', short: 'CPGs' },
  { value: 'resident_guidelines', label: 'Resident Guidelines', short: 'Resident' },
  { value: 'trauma_policies', label: 'Trauma Policies', short: 'Policies' },
  { value: 'medical_student', label: 'Medical Student Resources', short: 'Med Student' },
  { value: 'resources', label: 'Useful Links & Resources', short: 'Resources' },
]

const ICON_DOT: Record<string, string> = {
  ribs: 'bg-slate-500', pelvis: 'bg-slate-500', ortho: 'bg-slate-500',
  vascular: 'bg-rose-500', heme: 'bg-rose-500',
  spleen: 'bg-emerald-500', liver: 'bg-emerald-500', kidney: 'bg-emerald-500',
  endocrine: 'bg-amber-500', airway: 'bg-sky-500',
  brain: 'bg-indigo-500', default: 'bg-indigo-500',
}
const COLOR_DOT: Record<string, string> = {
  blue: 'bg-blue-600', rose: 'bg-rose-500', emerald: 'bg-emerald-500',
  amber: 'bg-amber-500', sky: 'bg-sky-500', indigo: 'bg-indigo-600',
  purple: 'bg-purple-600', teal: 'bg-teal-500', orange: 'bg-orange-500',
}

interface Algorithm {
  id: string
  title: string
  short_title: string
  icon_type: IconType
  card_color: CardColor
  image_url: string | null
  html_url: string | null
  sort_order: number
  is_active: boolean
}

interface FileRow {
  id: string
  title: string
  description?: string
  file_url: string
  category: FileCategory
  file_type?: string
  created_at: string
}

type Toast = { id: number; type: 'success' | 'error'; text: string }
type PushToast = (type: 'success' | 'error', text: string) => void

/* ----------------------------- Toasts ----------------------------- */
function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-soft text-sm font-medium animate-slide-up min-w-[240px] ${
            t.type === 'success' ? 'bg-navy-900 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          <span className={`grid place-items-center w-5 h-5 rounded-full flex-shrink-0 ${t.type === 'success' ? 'bg-emerald-500' : 'bg-white/20'}`}>
            {t.type === 'success' ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
          </span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  )
}

/* --------------------------- Delete confirm --------------------------- */
function ConfirmDelete({ label, onConfirm, onCancel }: { label: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5">
      <span className="text-xs text-rose-800">Delete {label}?</span>
      <button onClick={onConfirm} className="px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-600 text-white hover:bg-rose-700">Delete</button>
      <button onClick={onCancel} className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-silver-300 text-silver-700 hover:bg-silver-100">Cancel</button>
    </div>
  )
}

/* --------------------------- Search input --------------------------- */
function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative flex-1 min-w-[180px]">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 rounded-lg border border-silver-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
    </div>
  )
}

/* ============================ ALGORITHMS ============================ */
function AlgorithmsManager({ pushToast }: { pushToast: PushToast }) {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Algorithm | null>(null)
  const [editImage, setEditImage] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newImage, setNewImage] = useState<File | null>(null)
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null)
  const [newAlgo, setNewAlgo] = useState({ title: '', short_title: '', icon_type: 'default' as IconType, card_color: 'auto' as CardColor })

  const dragId = useRef<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const fetchAlgorithms = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/algorithms')
      if (res.ok) {
        const data = await res.json()
        setAlgorithms((data as Algorithm[]).map((a) => ({
          ...a,
          card_color: (a.card_color || 'auto') as CardColor,
          image_url: a.image_url ?? null,
          html_url: a.html_url ?? null,
        })))
      }
    } catch {
      pushToast('error', 'Failed to load charts')
    } finally {
      setLoading(false)
    }
  }, [pushToast])

  useEffect(() => { fetchAlgorithms() }, [fetchAlgorithms])

  useEffect(() => {
    if (!newImage) { setNewImagePreview(null); return }
    const url = URL.createObjectURL(newImage)
    setNewImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [newImage])

  const dotClass = (a: Algorithm) =>
    (a.card_color && a.card_color !== 'auto' && COLOR_DOT[a.card_color]) || ICON_DOT[a.icon_type] || 'bg-slate-400'

  const uploadImage = async (algorithmId: string, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('algorithmId', algorithmId)
    const res = await fetch('/api/algorithms/upload-image', { method: 'POST', body: fd })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      throw new Error(d.error || 'Image upload failed')
    }
    return res.json()
  }

  const handleCreate = async () => {
    if (!newAlgo.title || !newAlgo.short_title) { pushToast('error', 'Title and card label are required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/algorithms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAlgo, sort_order: algorithms.length }),
      })
      if (!res.ok) throw new Error('Create failed')
      const created = await res.json()
      if (newImage && created.id) await uploadImage(created.id, newImage)
      pushToast('success', `Added “${newAlgo.short_title}”`)
      setShowNew(false)
      setNewAlgo({ title: '', short_title: '', icon_type: 'default', card_color: 'auto' })
      setNewImage(null)
      fetchAlgorithms()
    } catch (e) {
      pushToast('error', e instanceof Error ? e.message : 'Failed to add chart')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editing) return
    setSaving(true)
    try {
      let imageUrl = editing.image_url
      if (editImage) {
        const up = await uploadImage(editing.id, editImage)
        imageUrl = up.imageUrl || up.image_url || imageUrl
      }
      const res = await fetch(`/api/algorithms/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editing, image_url: imageUrl }),
      })
      if (!res.ok) throw new Error('Update failed')
      pushToast('success', `Saved “${editing.short_title}”`)
      setEditing(null)
      setEditImage(null)
      fetchAlgorithms()
    } catch {
      pushToast('error', 'Failed to save chart')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (a: Algorithm) => {
    try {
      const res = await fetch(`/api/algorithms/${a.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...a, is_active: !a.is_active }),
      })
      if (!res.ok) throw new Error()
      setAlgorithms((prev) => prev.map((x) => (x.id === a.id ? { ...x, is_active: !x.is_active } : x)))
      pushToast('success', `${a.short_title} is now ${!a.is_active ? 'visible' : 'hidden'}`)
    } catch {
      pushToast('error', 'Could not change visibility')
    }
  }

  const handleDelete = async (id: string) => {
    setConfirmId(null)
    try {
      const res = await fetch(`/api/algorithms/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setAlgorithms((prev) => prev.filter((a) => a.id !== id))
      pushToast('success', 'Chart deleted')
    } catch {
      pushToast('error', 'Failed to delete chart')
    }
  }

  const persistOrder = async (ordered: Algorithm[]) => {
    try {
      const res = await fetch('/api/algorithms/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: ordered.map((a) => a.id) }),
      })
      if (!res.ok) throw new Error()
      pushToast('success', 'Order saved')
    } catch {
      pushToast('error', 'Could not save order')
      fetchAlgorithms()
    }
  }

  const onDrop = (targetId: string) => {
    const from = dragId.current
    setDragOverId(null)
    dragId.current = null
    if (!from || from === targetId) return
    const arr = [...algorithms]
    const fi = arr.findIndex((a) => a.id === from)
    const ti = arr.findIndex((a) => a.id === targetId)
    if (fi < 0 || ti < 0) return
    const [moved] = arr.splice(fi, 1)
    arr.splice(ti, 0, moved)
    setAlgorithms(arr)
    persistOrder(arr)
  }

  const q = query.trim().toLowerCase()
  const visible = q
    ? algorithms.filter((a) => (a.title + ' ' + a.short_title + ' ' + a.icon_type).toLowerCase().includes(q))
    : algorithms
  const liveCount = algorithms.filter((a) => a.is_active).length

  return (
    <div>
      {/* summary + add */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-silver-200 px-3 py-1 text-navy-800 font-semibold tabular-nums">
            {algorithms.length} charts
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-emerald-700 font-semibold tabular-nums">
            {liveCount} live
          </span>
          {algorithms.length - liveCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-silver-100 border border-silver-200 px-3 py-1 text-silver-600 font-semibold tabular-nums">
              {algorithms.length - liveCount} hidden
            </span>
          )}
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setShowNew((s) => !s)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition"
        >
          {showNew ? (
            <>Cancel</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg> Add chart</>
          )}
        </button>
      </div>

      {/* new chart form */}
      {showNew && (
        <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50/60 p-5">
          <h3 className="font-semibold text-navy-900 mb-4">New chart</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-silver-700 mb-1.5">Full title *</label>
              <input value={newAlgo.title} onChange={(e) => setNewAlgo({ ...newAlgo, title: e.target.value })} placeholder="Rib Fracture Management" className="w-full p-2.5 rounded-lg border border-silver-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-silver-700 mb-1.5">Card label *</label>
              <input value={newAlgo.short_title} onChange={(e) => setNewAlgo({ ...newAlgo, short_title: e.target.value })} placeholder="Rib Fracture" className="w-full p-2.5 rounded-lg border border-silver-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-silver-700 mb-1.5">Icon / category</label>
              <select value={newAlgo.icon_type} onChange={(e) => setNewAlgo({ ...newAlgo, icon_type: e.target.value as IconType })} className="w-full p-2.5 rounded-lg border border-silver-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                {ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-silver-700 mb-1.5">Chart image</label>
              <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files?.[0] || null)} className="w-full text-sm text-silver-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary-100 file:text-primary-700 file:text-sm file:font-medium" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-silver-700 mb-1.5">Card color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((o) => (
                <button key={o.value} type="button" onClick={() => setNewAlgo({ ...newAlgo, card_color: o.value })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-sm transition ${newAlgo.card_color === o.value ? 'border-navy-800 bg-white' : 'border-transparent bg-white/70 hover:border-silver-300'}`}>
                  <span className={`w-3.5 h-3.5 rounded-full ${o.dot}`} />{o.label}
                </button>
              ))}
            </div>
          </div>
          {newImagePreview && (
            <div className="mb-4 flex items-center gap-3">
              <img src={newImagePreview} alt="preview" className="w-16 h-20 object-contain rounded-lg border border-silver-200 bg-white" />
              <span className="text-xs text-emerald-700 font-medium">{newImage?.name}</span>
            </div>
          )}
          <button onClick={handleCreate} disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Create chart'}
          </button>
        </div>
      )}

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBox value={query} onChange={setQuery} placeholder="Search charts…" />
        <span className="inline-flex items-center gap-2 text-xs text-silver-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
          {q ? 'Clear search to reorder' : 'Drag handles to set homepage order'}
        </span>
      </div>

      {/* list */}
      {loading ? (
        <div className="py-16 text-center text-silver-500">Loading charts…</div>
      ) : visible.length === 0 ? (
        <div className="py-16 text-center text-silver-500">{q ? `Nothing matches “${query}”.` : 'No charts yet.'}</div>
      ) : (
        <div className="space-y-2.5">
          {visible.map((a) => {
            const isEditing = editing?.id === a.id
            return (
              <div
                key={a.id}
                draggable={!q && !isEditing}
                onDragStart={() => { dragId.current = a.id }}
                onDragOver={(e) => { e.preventDefault(); if (dragOverId !== a.id) setDragOverId(a.id) }}
                onDrop={(e) => { e.preventDefault(); onDrop(a.id) }}
                onDragEnd={() => { dragId.current = null; setDragOverId(null) }}
                className={`rounded-xl border bg-white shadow-card transition ${a.is_active ? 'border-silver-200' : 'border-rose-200 bg-rose-50/40'} ${dragOverId === a.id ? 'ring-2 ring-primary-400' : ''}`}
              >
                {isEditing ? (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-silver-700 mb-1.5">Full title</label>
                        <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full p-2.5 rounded-lg border border-silver-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-silver-700 mb-1.5">Card label</label>
                        <input value={editing.short_title} onChange={(e) => setEditing({ ...editing, short_title: e.target.value })} className="w-full p-2.5 rounded-lg border border-silver-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-silver-700 mb-1.5">Icon / category</label>
                        <select value={editing.icon_type} onChange={(e) => setEditing({ ...editing, icon_type: e.target.value as IconType })} className="w-full p-2.5 rounded-lg border border-silver-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                          {ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-silver-700 mb-1.5">Replace image</label>
                        <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files?.[0] || null)} className="w-full text-sm text-silver-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary-100 file:text-primary-700 file:text-sm file:font-medium" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-silver-700 mb-1.5">Card color</label>
                      <div className="flex flex-wrap gap-2">
                        {COLOR_OPTIONS.map((o) => (
                          <button key={o.value} type="button" onClick={() => setEditing({ ...editing, card_color: o.value })}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-sm transition ${editing.card_color === o.value ? 'border-navy-800 bg-white' : 'border-transparent bg-silver-50 hover:border-silver-300'}`}>
                            <span className={`w-3.5 h-3.5 rounded-full ${o.dot}`} />{o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-silver-700 mb-1.5">Interactive HTML URL (optional)</label>
                      <input value={editing.html_url || ''} onChange={(e) => setEditing({ ...editing, html_url: e.target.value || null })} placeholder="/flowcharts/d2/chart_name.html" className="w-full p-2.5 rounded-lg border border-silver-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      <p className="text-xs text-silver-400 mt-1">If set, the card opens the interactive HTML version instead of the image.</p>
                    </div>
                    {editImage && <p className="text-xs text-emerald-700 mb-3">New image: {editImage.name}</p>}
                    <div className="flex gap-2">
                      <button onClick={handleUpdate} disabled={saving} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
                      <button onClick={() => { setEditing(null); setEditImage(null) }} className="rounded-lg bg-silver-200 px-4 py-2 text-sm font-medium text-silver-700 hover:bg-silver-300">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3">
                    <span className={`flex-shrink-0 grid place-items-center w-6 text-silver-400 ${q ? 'opacity-30' : 'cursor-grab active:cursor-grabbing'}`} title={q ? 'Clear search to reorder' : 'Drag to reorder'}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" /><circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" /><circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" /></svg>
                    </span>
                    <div className="flex-shrink-0 w-16 h-20 rounded-lg border border-silver-200 bg-white grid place-items-center overflow-hidden">
                      {a.image_url ? (
                        <img src={a.image_url} alt={a.short_title} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-silver-400">no image</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotClass(a)}`} />
                        <h3 className="font-semibold text-navy-900 truncate">{a.short_title}</h3>
                        {a.html_url && <span className="flex-shrink-0 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded px-1.5 py-0.5">HTML</span>}
                      </div>
                      <p className="text-sm text-silver-500 truncate mt-0.5">{a.title}</p>
                    </div>
                    {confirmId === a.id ? (
                      <ConfirmDelete label="chart" onConfirm={() => handleDelete(a.id)} onCancel={() => setConfirmId(null)} />
                    ) : (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => handleToggle(a)} className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${a.is_active ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-silver-100 border-silver-300 text-silver-600 hover:bg-silver-200'}`}>
                          {a.is_active ? 'Live' : 'Hidden'}
                        </button>
                        <button onClick={() => { setEditing(a); setEditImage(null) }} className="grid place-items-center w-8 h-8 rounded-md border border-silver-200 text-silver-500 hover:bg-silver-100 hover:text-navy-800" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4L18.5 9.5a2.1 2.1 0 00-3-3L5 17v3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.5l3 3" /></svg>
                        </button>
                        <button onClick={() => setConfirmId(a.id)} className="grid place-items-center w-8 h-8 rounded-md border border-silver-200 text-silver-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ============================ DOCUMENTS ============================ */
function DocumentsManager({ pushToast }: { pushToast: PushToast }) {
  const [files, setFiles] = useState<FileRow[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FileCategory | 'all'>('all')
  const [editing, setEditing] = useState<FileRow | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [showUpload, setShowUpload] = useState(false)

  const [upFile, setUpFile] = useState<File | null>(null)
  const [upTitle, setUpTitle] = useState('')
  const [upDesc, setUpDesc] = useState('')
  const [upCat, setUpCat] = useState<FileCategory>('cpgs')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/files')
      if (res.ok) setFiles(await res.json())
    } catch {
      pushToast('error', 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }, [pushToast])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!upFile || !upTitle) { pushToast('error', 'Choose a file and enter a title'); return }
    setUploading(true)
    const fd = new FormData()
    fd.append('file', upFile)
    fd.append('title', upTitle)
    fd.append('description', upDesc)
    fd.append('category', upCat)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Upload failed')
      pushToast('success', `Uploaded “${upTitle}”`)
      setUpFile(null); setUpTitle(''); setUpDesc(''); setUpCat('cpgs'); setShowUpload(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchFiles()
    } catch (e) {
      pushToast('error', e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch(`/api/files/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editing.title, description: editing.description, category: editing.category }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Update failed') }
      pushToast('success', 'Document updated')
      setEditing(null)
      fetchFiles()
    } catch (e) {
      pushToast('error', e instanceof Error ? e.message : 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setConfirmId(null)
    try {
      const res = await fetch(`/api/files/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setFiles((prev) => prev.filter((f) => f.id !== id))
      pushToast('success', 'Document deleted')
    } catch {
      pushToast('error', 'Failed to delete document')
    }
  }

  const catLabel = (c: FileCategory) => CATEGORY_OPTIONS.find((o) => o.value === c)?.short || c
  const q = query.trim().toLowerCase()
  const visible = files.filter((f) =>
    (filter === 'all' || f.category === filter) &&
    (!q || (f.title + ' ' + (f.description || '')).toLowerCase().includes(q))
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-silver-200 px-3 py-1 text-navy-800 font-semibold text-sm tabular-nums">
          {files.length} documents
        </span>
        <div className="flex-1" />
        <button onClick={() => setShowUpload((s) => !s)} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition">
          {showUpload ? 'Cancel' : (<><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg> Add document</>)}
        </button>
      </div>

      {showUpload && (
        <form onSubmit={handleUpload} className="mb-6 rounded-xl border border-primary-200 bg-primary-50/60 p-5">
          <h3 className="font-semibold text-navy-900 mb-4">Upload a document</h3>
          <div
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setUpFile(f) }}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-silver-300 rounded-lg p-6 text-center mb-4 bg-white hover:border-primary-400 transition"
          >
            {upFile ? (
              <div>
                <svg className="w-9 h-9 mx-auto mb-1.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm text-emerald-700 font-medium">{upFile.name}</p>
                <p className="text-xs text-silver-500">{(upFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-silver-600 mb-1">Drag a file here, or</p>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-primary-600 font-semibold hover:underline">browse files</button>
                <p className="text-xs text-silver-400 mt-1">PDF, DOCX, DOC · max 10 MB</p>
              </>
            )}
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc" onChange={(e) => setUpFile(e.target.files?.[0] || null)} className="hidden" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-silver-700 mb-1.5">Title *</label>
              <input value={upTitle} onChange={(e) => setUpTitle(e.target.value)} className="w-full p-2.5 rounded-lg border border-silver-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-silver-700 mb-1.5">Category *</label>
              <select value={upCat} onChange={(e) => setUpCat(e.target.value as FileCategory)} className="w-full p-2.5 rounded-lg border border-silver-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-silver-700 mb-1.5">Description</label>
            <textarea value={upDesc} onChange={(e) => setUpDesc(e.target.value)} rows={2} className="w-full p-2.5 rounded-lg border border-silver-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button type="submit" disabled={uploading || !upFile || !upTitle} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </form>
      )}

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBox value={query} onChange={setQuery} placeholder="Search documents…" />
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${filter === 'all' ? 'bg-navy-900 text-white border-navy-900' : 'bg-white border-silver-200 text-silver-600 hover:border-silver-400'}`}>
          All <span className="opacity-60 tabular-nums">{files.length}</span>
        </button>
        {CATEGORY_OPTIONS.map((o) => {
          const n = files.filter((f) => f.category === o.value).length
          return (
            <button key={o.value} onClick={() => setFilter(o.value)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${filter === o.value ? 'bg-navy-900 text-white border-navy-900' : 'bg-white border-silver-200 text-silver-600 hover:border-silver-400'}`}>
              {o.short} <span className="opacity-60 tabular-nums">{n}</span>
            </button>
          )
        })}
      </div>

      {/* list */}
      {loading ? (
        <div className="py-16 text-center text-silver-500">Loading documents…</div>
      ) : visible.length === 0 ? (
        <div className="py-16 text-center text-silver-500">{q || filter !== 'all' ? 'No documents match.' : 'No documents yet.'}</div>
      ) : (
        <div className="space-y-2.5">
          {visible.map((f) => (
            <div key={f.id} className="rounded-xl border border-silver-200 bg-white shadow-card">
              {editing?.id === f.id ? (
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-silver-700 mb-1.5">Title</label>
                      <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full p-2.5 rounded-lg border border-silver-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-silver-700 mb-1.5">Description</label>
                      <textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} className="w-full p-2.5 rounded-lg border border-silver-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-silver-700 mb-1.5">Category</label>
                      <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as FileCategory })} className="w-full p-2.5 rounded-lg border border-silver-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                        {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleUpdate} disabled={saving} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
                    <button onClick={() => setEditing(null)} className="rounded-lg bg-silver-200 px-4 py-2 text-sm font-medium text-silver-700 hover:bg-silver-300">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3.5">
                  <div className={`flex-shrink-0 grid place-items-center w-9 h-9 rounded-lg ${f.file_type === 'pdf' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-navy-900 truncate">{f.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-silver-100 text-silver-600">{catLabel(f.category)}</span>
                      {f.file_type && <span className="text-[11px] text-silver-400 uppercase">{f.file_type}</span>}
                      {f.description && <span className="text-xs text-silver-500 truncate">· {f.description}</span>}
                    </div>
                  </div>
                  {confirmId === f.id ? (
                    <ConfirmDelete label="document" onConfirm={() => handleDelete(f.id)} onCancel={() => setConfirmId(null)} />
                  ) : (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="grid place-items-center w-8 h-8 rounded-md border border-silver-200 text-silver-500 hover:bg-silver-100 hover:text-navy-800" title="Open">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M10 14 21 3" /></svg>
                      </a>
                      <button onClick={() => setEditing(f)} className="grid place-items-center w-8 h-8 rounded-md border border-silver-200 text-silver-500 hover:bg-silver-100 hover:text-navy-800" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4L18.5 9.5a2.1 2.1 0 00-3-3L5 17v3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.5l3 3" /></svg>
                      </button>
                      <button onClick={() => setConfirmId(f.id)} className="grid place-items-center w-8 h-8 rounded-md border border-silver-200 text-silver-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ============================== SHELL ============================== */
export default function AdminPage() {
  const router = useRouter()
  const [section, setSection] = useState<'algorithms' | 'documents'>('algorithms')
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  const pushToast = useCallback<PushToast>((type, text) => {
    const id = ++toastId.current
    setToasts((prev) => [...prev, { id, type, text }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
    router.refresh()
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Admin Portal</h1>
          <p className="text-sm text-silver-500 mt-0.5">Manage the charts and documents shown on the site.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/handouts" className="rounded-lg border border-silver-300 bg-white px-3.5 py-2 text-sm font-medium text-silver-700 hover:bg-silver-100 transition">Handout Editor</Link>
          <Link href="/" target="_blank" className="rounded-lg border border-silver-300 bg-white px-3.5 py-2 text-sm font-medium text-silver-700 hover:bg-silver-100 transition">View site</Link>
          <button onClick={handleLogout} className="rounded-lg bg-navy-800 px-3.5 py-2 text-sm font-medium text-white hover:bg-navy-900 transition">Logout</button>
        </div>
      </div>

      {/* section switcher */}
      <div className="inline-flex rounded-xl border border-silver-200 bg-silver-100 p-1 mb-6">
        <button onClick={() => setSection('algorithms')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${section === 'algorithms' ? 'bg-white text-navy-900 shadow-sm' : 'text-silver-600 hover:text-navy-800'}`}>
          Algorithms &amp; Charts
        </button>
        <button onClick={() => setSection('documents')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${section === 'documents' ? 'bg-white text-navy-900 shadow-sm' : 'text-silver-600 hover:text-navy-800'}`}>
          Guidelines &amp; Documents
        </button>
      </div>

      {section === 'algorithms' ? <AlgorithmsManager pushToast={pushToast} /> : <DocumentsManager pushToast={pushToast} />}

      <ToastStack toasts={toasts} />
    </main>
  )
}
