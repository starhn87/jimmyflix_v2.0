import { locale as getRootLocale } from 'next/root-params'
import { PersonSkeleton } from '@/components/loading-skeletons'
import { getDictionary } from '@/lib/dictionaries'
import { defaultLocale, isLocale } from '@/lib/i18n'

export default async function PersonLoading() {
  const value = await getRootLocale()
  const locale = isLocale(value) ? value : defaultLocale
  return <PersonSkeleton label={getDictionary(locale).person.loading} />
}
