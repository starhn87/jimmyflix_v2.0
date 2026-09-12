import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale, locales } from '@/lib/i18n'
import { themeScript } from '@/lib/theme'
import '../globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const dictionary = getDictionary(locale)

  return {
    metadataBase: new URL('https://jimmyflix.vercel.app'),
    title: {
      default: dictionary.metadata.title,
      template: '%s | Jimmyflix',
    },
    description: dictionary.metadata.description,
    applicationName: 'Jimmyflix',
    openGraph: {
      title: 'Jimmyflix',
      description: dictionary.metadata.openGraphDescription,
      type: 'website',
      siteName: 'Jimmyflix',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: '#0b0912',
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dictionary = getDictionary(locale)

  return (
    <html lang={locale} className={geist.variable} suppressHydrationWarning>
      <body>
        <SiteHeader locale={locale} messages={dictionary.header} />
        {children}
        <Script
          id="jimmyflix-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
