import Link from 'next/link'
import { sicuHandouts } from '@/lib/sicuHandouts'

export const metadata = {
  title: 'Resident ICU Quick Guides',
  description: 'Condensed resident-facing ICU quick guides with in-browser preview and download options.'
}

export default function ICUHandoutsPage() {
  const groupOrder = [
    'Ventilator Care',
    'Infection Prevention',
    'VTE and Anticoagulation',
    'Perioperative',
    'Special Populations',
    'Orthopaedic Trauma'
  ] as const

  const grouped = groupOrder
    .map((group) => ({
      group,
      items: sicuHandouts.filter((item) => item.group === group)
    }))
    .filter((section) => section.items.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-navy-800 to-navy-700 text-white py-10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Resident ICU Quick Guides</h1>
              <p className="text-white/85 mt-2 max-w-3xl">
                Condensed, high-yield references for rounds and call. This page is intentionally focused on quick-use guidance, not full policy manuals.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 transition-colors"
            >
              <span>Back to Portal</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h2 className="text-sm font-semibold text-amber-900 mb-2">Use and Scope</h2>
          <p className="text-sm text-amber-900/90">
            These are generic quick guides derived from active internal workflows. For full policy text, use formal guideline repositories. Hard-stop statements in CAUTI materials are quote-backed.
          </p>
        </div>

        <div className="space-y-8">
          {grouped.map((section) => (
            <section key={section.group}>
              <h2 className="text-lg font-bold text-navy-900 mb-3">{section.group}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {section.items.map((item) => (
                  <article key={item.slug} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="text-base font-semibold text-navy-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.summary}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Link
                        href={`/sicu-deliverables/preview/${item.slug}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        Preview
                      </Link>
                      {item.assets.map((asset) => (
                        <a
                          key={asset.path}
                          href={asset.path}
                          download
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 transition-colors text-sm font-medium"
                        >
                          Download {asset.label}
                        </a>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
