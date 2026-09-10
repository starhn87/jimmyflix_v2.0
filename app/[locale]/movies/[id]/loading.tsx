import { locale as getRootLocale } from 'next/root-params'
import { DetailSkeleton } from '@/components/loading-skeletons'
import { getDictionary } from '@/lib/dictionaries'
import { defaultLocale, isLocale } from '@/lib/i18n'

export default async function MovieDetailLoading() {
  const value = await getRootLocale()
  const locale = isLocale(value) ? value : defaultLocale
  return <DetailSkeleton label={getDictionary(locale).detail.loadingMovie} />
}
