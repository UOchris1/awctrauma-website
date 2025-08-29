import { supabase, FileCategory, FileRecord } from '@/lib/supabase'
import FileCard from '@/components/FileCard'

// Revalidate cache every 5 minutes
export const revalidate = 300

interface CategorySection {
  title: string
  category: FileCategory
  files: FileRecord[]
  icon: string
  color: string
}

async function getFiles() {
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      // Silently return empty array if database is not configured
      // This is expected when Supabase is not set up yet
      return []
    }

    return data as FileRecord[]
  } catch (err) {
    // Silently handle connection errors (expected when Supabase not configured)
    return []
  }
}

export default async function HomePage() {
  const files = await getFiles()

  const categories: CategorySection[] = [
    {
      title: 'Resident Guidelines',
      category: 'resident_guidelines',
      files: files.filter(f => f.category === 'resident_guidelines'),
      icon: '📚',
      color: 'from-navy-700 to-navy-600'
    },
    {
      title: 'Clinical Practice Guidelines',
      category: 'cpgs',
      files: files.filter(f => f.category === 'cpgs'),
      icon: '🏥',
      color: 'from-primary-700 to-primary-600'
    },
    {
      title: 'Trauma Policies',
      category: 'trauma_policies',
      files: files.filter(f => f.category === 'trauma_policies'),
      icon: '📋',
      color: 'from-navy-800 to-navy-700'
    },
    {
      title: 'Useful Links & Resources',
      category: 'resources',
      files: files.filter(f => f.category === 'resources'),
      icon: '🔗',
      color: 'from-primary-800 to-primary-700'
    }
  ]

  return (
    <div className="min-h-screen bg-silver-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-silver-50 to-silver-200 py-16 border-b border-silver-300">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
              Trauma Center Resources
            </h2>
            <p className="text-lg text-primary-700 max-w-2xl mx-auto">
              Access essential guidelines, policies, and educational materials for our Level 1 Trauma Center medical staff.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((section) => (
            <section 
              key={section.category} 
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-silver-300">
                {/* Section Header */}
                <div className={`bg-gradient-to-r ${section.color} p-5 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl opacity-90">{section.icon}</span>
                      <h3 className="text-xl font-semibold text-silver-300">
                        {section.title}
                      </h3>
                    </div>
                    <span className="bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
                      {section.files.length} {section.files.length === 1 ? 'file' : 'files'}
                    </span>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-5 bg-white">
                  {section.files.length > 0 ? (
                    <div className="space-y-2">
                      {section.files.slice(0, 3).map((file) => (
                        <div 
                          key={file.id}
                          className="border border-silver-300 rounded p-3 hover:bg-silver-50 hover:border-primary-300 transition-all duration-200"
                        >
                          <FileCard file={file} />
                        </div>
                      ))}
                      {section.files.length > 3 && (
                        <p className="text-sm text-primary-600 text-center pt-2">
                          + {section.files.length - 3} more {section.files.length - 3 === 1 ? 'file' : 'files'}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <svg 
                        className="mx-auto h-10 w-10 text-silver-400 mb-3"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1.5} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        />
                      </svg>
                      <p className="text-silver-600 text-sm">
                        No files available yet
                      </p>
                      <p className="text-silver-500 text-xs mt-1">
                        Check back soon for updates
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-gradient-to-r from-navy-900 via-navy-800 to-primary-800 rounded-lg p-6 text-white shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{files.length}</div>
              <div className="text-white/70 text-xs mt-1">Total Resources</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-white/70 text-xs mt-1">Availability</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Level 1</div>
              <div className="text-white/70 text-xs mt-1">Trauma Center</div>
            </div>
            <div>
              <div className="text-2xl font-bold">4</div>
              <div className="text-white/70 text-xs mt-1">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}