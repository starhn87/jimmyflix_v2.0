import { locale as getRootLocale } from 'next/root-params'
import { CatalogSkeleton } from '@/components/loading-skeletons'
import { getDictionary } from '@/lib/dictionaries'
import { defaultLocale, isLocale } from '@/lib/i18n'

export default async function TvLoading() {
  const value = await getRootLocale()
  const locale = isLocale(value) ? value : defaultLocale
  return <CatalogSkeleton label={getDictionary(locale).tv.loadingCatalog} />
}
