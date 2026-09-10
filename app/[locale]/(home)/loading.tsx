import { locale as getRootLocale } from 'next/root-params'
import { CatalogSkeleton } from '@/components/loading-skeletons'
import { getDictionary } from '@/lib/dictionaries'
import { defaultLocale, isLocale } from '@/lib/i18n'

export default async function MoviesLoading() {
  const value = await getRootLocale()
  const locale = isLocale(value) ? value : defaultLocale
  return <CatalogSkeleton label={getDictionary(locale).movies.loadingCatalog} />
}
