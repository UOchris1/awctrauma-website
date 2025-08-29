import FileCard from '@/components/FileCard'
import { FileRecord } from '@/lib/supabase'

export default function TestPage() {
  const mockFiles: FileRecord[] = [
    {
      id: '1',
      created_at: new Date().toISOString(),
      title: 'Trauma Protocol Guidelines 2024',
      description: 'Updated guidelines for trauma patient management',
      file_url: '#',
      category: 'resident_guidelines'
    },
    {
      id: '2',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      title: 'CPG: Massive Transfusion Protocol',
      description: 'Clinical practice guidelines for massive transfusion',
      file_url: '#',
      category: 'cpgs'
    },
    {
      id: '3',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      title: 'Emergency Department Trauma Policy',
      file_url: '#',
      category: 'trauma_policies'
    }
  ]

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Component Test Page</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-dark mb-6">
          FileCard Components (Mock Data)
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockFiles.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-dark mb-6">
          Color Palette Test
        </h2>
        <div className="flex gap-4 flex-wrap">
          <div className="p-4 bg-primary text-white rounded">Primary</div>
          <div className="p-4 bg-neutral-light text-neutral-dark rounded">Neutral Light</div>
          <div className="p-4 bg-neutral-dark text-white rounded">Neutral Dark</div>
          <div className="p-4 bg-white text-neutral-dark border rounded">White</div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-dark mb-6">
          Responsive Grid Test
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 bg-white rounded-lg shadow-md border border-neutral-light">
              <h3 className="text-lg font-semibold">Card {i}</h3>
              <p className="text-sm text-gray-600">Test responsive layout</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}