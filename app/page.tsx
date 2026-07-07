import { supabase, FileRecord, AlgorithmRecord } from '@/lib/supabase'
import AlgorithmsSection from '@/components/AlgorithmsSection'
import TabbedDocuments from '@/components/TabbedDocuments'
import GlobalSearch from '@/components/GlobalSearch'
import Link from 'next/link'

// Revalidate cache every 60 seconds
export const revalidate = 60

// External resource links
const externalResources = [
  {
    title: 'EAST Guidelines',
    url: 'https://www.east.org/education-resources/practice-management-guidelines'
  },
  {
    title: 'Western Trauma',
    url: 'https://www.westerntrauma.org/western-trauma-association-algorithms/'
  },
  {
    title: 'OpenEvidence',
    url: 'https://www.openevidence.com/'
  },
  {
    title: 'ACS TQIP',
    url: 'https://www.facs.org/quality-programs/trauma/quality/best-practices-guidelines/'
  }
]

async function getFiles() {
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return []
    }

    return data as FileRecord[]
  } catch (err) {
    return []
  }
}

async function getAlgorithms() {
  try {
    const { data, error } = await supabase
      .from('algorithms')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching algorithms:', error)
      return []
    }

    return data as AlgorithmRecord[]
  } catch (err) {
    return []
  }
}

export default async function HomePage() {
  const [files, algorithms] = await Promise.all([getFiles(), getAlgorithms()])

  const categorizedFiles = {
    cpgs: files.filter(f => f.category === 'cpgs'),
    resident_guidelines: files.filter(f => f.category === 'resident_guidelines'),
    trauma_policies: files.filter(f => f.category === 'trauma_policies'),
    medical_student: files.filter(f => f.category === 'medical_student'),
    resources: files.filter(f => f.category === 'resources')
  }

  // Transform algorithms for components
  const algorithmsForDisplay = algorithms.map(algo => ({
    id: algo.id,
    title: algo.title,
    shortTitle: algo.short_title,
    imageSrc: algo.image_url || '/flowcharts/placeholder.png',
    htmlSrc: algo.html_url || undefined,
    iconType: algo.icon_type,
    cardColor: algo.card_color || 'auto'
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Global Search */}
      <div className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-700 text-white py-14 md:py-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.04]" aria-hidden="true" />
        <div className="container mx-auto max-w-4xl px-4 relative">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-gold/90 mb-3">
              Level 1 Trauma Center
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white text-balance">
              Trauma Center Resources
            </h2>
            <p className="mt-3 text-base md:text-lg text-white/75 max-w-2xl mx-auto">
              Quick access to clinical guidelines and decision algorithms at the point of care.
            </p>
          </div>

          {/* Global Search */}
          <GlobalSearch files={files} algorithms={algorithmsForDisplay} />
        </div>
      </div>

      {/* Quick Reference Algorithms */}
      <div id="algorithms" className="bg-white py-12 border-b border-silver-200">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Quick Reference Algorithms &amp; Charts</h2>
            <p className="text-sm text-silver-500 mt-1">Tap any card to open the full flowchart.</p>
          </div>
          {algorithmsForDisplay.length > 0 ? (
            <AlgorithmsSection algorithms={algorithmsForDisplay} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No algorithms configured yet.</p>
              <p className="text-sm mt-1">Add algorithms in the admin panel.</p>
            </div>
          )}
        </div>
      </div>

      {/* Guidelines & Documents with Tabs */}
      <div id="documents" className="bg-silver-50 py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Guidelines &amp; Documents</h2>
            <p className="text-sm text-silver-500 mt-1">Browse by category, or search within a tab.</p>
          </div>
          <TabbedDocuments files={categorizedFiles} />
        </div>
      </div>

      {/* ICU Handouts Callout */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="rounded-xl border border-primary-200 bg-primary-50 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Resident ICU Quick Guides</h2>
              <p className="text-sm text-navy-700 mt-1">
                Access condensed CAUTI/VAP/UE/VTE and perioperative quick guides designed for fast resident use, with preview before download.
              </p>
            </div>
            <Link
              href="/sicu-deliverables"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
            >
              Open Handouts
            </Link>
          </div>
        </div>
      </div>

      {/* External Resources */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="text-sm text-gray-500">External Resources:</span>
            {externalResources.map((resource) => (
              <a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-navy-600 hover:text-navy-800 hover:underline flex items-center gap-1"
              >
                {resource.title}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
