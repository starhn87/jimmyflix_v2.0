import type { Metadata } from 'next'
import { CatalogPage, getCatalogMetadata } from '@/components/catalog-page'
import { isLocale } from '@/lib/i18n'
import { parsePositiveInteger } from '@/lib/params'
import { getRequestRegion } from '@/lib/server-region'

export const revalidate = 1800

interface MoviesPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ provider?: string | string[] }>
}

export async function generateMetadata({ params }: MoviesPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return getCatalogMetadata(locale, 'movie')
}

export default async function MoviesPage({ params, searchParams }: MoviesPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams])
  if (!isLocale(locale)) return null
  const region = await getRequestRegion(locale)
  return (
    <CatalogPage
      locale={locale}
      mediaType="movie"
      requestedProviderId={parsePositiveInteger(query.provider)}
      region={region}
    />
  )
}
