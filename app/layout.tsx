import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Level 1 Trauma Center Resources',
  description: 'Access resident guidelines, clinical practice guidelines, and trauma policies for Level 1 Trauma Center.',
  keywords: 'trauma center, medical resources, clinical guidelines, resident guidelines, CPGs, trauma policies, Level 1 trauma',
  icons: {
    icon: [
      { url: '/logo.jpg', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/logo.jpg' },
    ],
  },
  openGraph: {
    title: 'Level 1 Trauma Center Resources',
    description: 'Professional resource portal for Level 1 Trauma Center medical staff. Access clinical guidelines, algorithms, and policies.',
    type: 'website',
    siteName: 'Level 1 Trauma Resources',
    images: [
      {
        url: '/logo.jpg',
        width: 512,
        height: 512,
        alt: 'Level 1 Trauma Center Resources',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Level 1 Trauma Center Resources',
    description: 'Professional resource portal for Level 1 Trauma Center medical staff.',
    images: ['/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded z-50"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}