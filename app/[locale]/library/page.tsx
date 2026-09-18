import type { Metadata } from 'next'
import { LibraryPageContent } from '@/components/library-page-content'
import { getLibraryCopy } from '@/lib/library'
import { isLocale } from '@/lib/i18n'
import { createPageMetadata } from '@/lib/seo'

interface LibraryPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: LibraryPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const copy = getLibraryCopy(locale)
  return createPageMetadata({
    locale,
    path: '/library',
    title: copy.pageTitle,
    description: copy.pageDescription,
    noIndex: true,
  })
}

export default async function LibraryPage({ params }: LibraryPageProps) {
  const { locale } = await params
  if (!isLocale(locale)) return null
  return <LibraryPageContent locale={locale} />
}
