import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PersonView } from '@/components/person-view'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale } from '@/lib/i18n'
import { parsePositiveInteger } from '@/lib/params'
import { getPersonDetail, TmdbNotFoundError } from '@/lib/tmdb'

interface PersonPageProps {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { locale, id: rawId } = await params
  if (!isLocale(locale)) return {}
  const dictionary = getDictionary(locale)
  const id = parsePositiveInteger(rawId)
  if (!id) return { title: dictionary.person.notFound }

  try {
    const person = await getPersonDetail(id, locale)
    return {
      title: person.name,
      description: person.biography || dictionary.person.descriptionFallback,
    }
  } catch {
    return { title: dictionary.person.metadataFallback }
  }
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { locale, id: rawId } = await params
  if (!isLocale(locale)) notFound()
  const id = parsePositiveInteger(rawId)
  if (!id) notFound()

  let person
  try {
    person = await getPersonDetail(id, locale)
  } catch (error) {
    if (error instanceof TmdbNotFoundError) notFound()
    throw error
  }

  return <PersonView person={person} locale={locale} />
}
