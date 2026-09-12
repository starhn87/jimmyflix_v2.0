import type { Metadata } from 'next'
import { PersonView } from '@/components/person-view'
import { getDictionary } from '@/lib/dictionaries'
import { getPersonDetailRoute } from '@/lib/detail-route'
import { getImageUrl } from '@/lib/media'
import { createPageMetadata } from '@/lib/seo'

interface PersonPageProps {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { locale: rawLocale, id } = await params
  const { locale, person } = await getPersonDetailRoute(rawLocale, id)
  const dictionary = getDictionary(locale)
  return createPageMetadata({
    locale, path: `/people/${person.id}`, title: person.name,
    description: person.biography || dictionary.person.descriptionFallback,
    image: getImageUrl(person.profile_path, 'original'), type: 'profile',
  })
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { locale: rawLocale, id } = await params
  const { locale, person } = await getPersonDetailRoute(rawLocale, id)
  return <PersonView person={person} locale={locale} />
}
