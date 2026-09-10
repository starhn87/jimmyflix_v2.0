import { locale as getRootLocale } from 'next/root-params'
import { TrendSkeleton } from '@/components/loading-skeletons'
import { getDictionary } from '@/lib/dictionaries'
import { defaultLocale, isLocale } from '@/lib/i18n'

export default async function TrendLoading() {
  const value = await getRootLocale()
  const locale = isLocale(value) ? value : defaultLocale
  return <TrendSkeleton label={getDictionary(locale).trend.loading} />
}
