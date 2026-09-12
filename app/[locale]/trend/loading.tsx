import { locale as getRootLocale } from 'next/root-params'
import { TrendSkeleton } from '@/components/trend-content'
import { defaultLocale, isLocale } from '@/lib/i18n'

export default async function TrendLoading() {
  const value = await getRootLocale()
  const locale = isLocale(value) ? value : defaultLocale
  return <TrendSkeleton locale={locale} />
}
