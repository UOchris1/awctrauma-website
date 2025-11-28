import { supabase, FileRecord, AlgorithmRecord } from '@/lib/supabase'
import AlgorithmsSection from '@/components/AlgorithmsSection'
import TabbedDocuments from '@/components/TabbedDocuments'
import GlobalSearch from '@/components/GlobalSearch'

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
    iconType: algo.icon_type
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Global Search */}
      <div className="bg-gradient-to-b from-navy-800 to-navy-700 text-white py-10">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              Trauma Center Resources
            </h2>
            <p className="text-white/80">
              Quick access to clinical guidelines and decision algorithms for Level 1 Trauma care.
            </p>
          </div>

          {/* Global Search */}
          <GlobalSearch files={files} algorithms={algorithmsForDisplay} />
        </div>
      </div>

      {/* Quick Reference Algorithms */}
      <div id="algorithms" className="bg-white py-10 border-b border-gray-200">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Reference Algorithms & Charts</h2>
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
      <div id="guidelines" className="bg-gray-50 py-10">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Guidelines & Documents</h2>
          <TabbedDocuments files={categorizedFiles} />
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
