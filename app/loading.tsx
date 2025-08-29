import { FileCardSkeleton } from '@/components/FileCard'

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-neutral-dark">
        <div className="h-10 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </h1>

      {['', '', '', ''].map((_, categoryIndex) => (
        <section key={categoryIndex} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-primary">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <FileCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}