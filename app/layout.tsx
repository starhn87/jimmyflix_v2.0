import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'
import { themeScript } from '@/lib/theme'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://jimmyflix.vercel.app'),
  title: {
    default: 'Jimmyflix — Discover movies and TV shows',
    template: '%s | Jimmyflix',
  },
  description:
    'Browse popular, trending, top-rated, and upcoming movies and TV shows.',
  applicationName: 'Jimmyflix',
  openGraph: {
    title: 'Jimmyflix',
    description: 'Discover movies and TV shows worth watching.',
    type: 'website',
    siteName: 'Jimmyflix',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: '#080b12',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <head>
        <script id="jimmyflix-theme" dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
