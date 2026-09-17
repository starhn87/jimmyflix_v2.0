import { ErrorState } from '@/components/error-state'
import { PeopleSection } from '@/components/people-section'
import { EmptyPanel } from '@/components/detail/panel-primitives'
import { getCastPeople, getCrewPeople } from '@/lib/detail-people'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import type { CastMember, CrewMember } from '@/types/tmdb'

export function CreditsPanel({
  cast,
  error,
  locale,
}: {
  cast: CastMember[]
  error: boolean
  locale: Locale
}) {
  const dictionary = getDictionary(locale)
  if (error) {
    return (
      <ErrorState
        compact
        title={dictionary.detail.creditsErrorTitle}
        message={dictionary.detail.creditsErrorMessage}
        retryLabel={dictionary.common.retry}
        retryingLabel={dictionary.common.retrying}
      />
    )
  }

  const people = getCastPeople(cast, dictionary.detail.castMember)
  if (people.length === 0) return <EmptyPanel message={dictionary.detail.noCast} />

  return (
    <div className="pt-7">
      <PeopleSection people={people} title={dictionary.detail.cast} kind="cast" locale={locale} messages={dictionary.detail.peopleUi} />
    </div>
  )
}

export function CrewPanel({ crew, locale }: { crew: CrewMember[]; locale: Locale }) {
  const dictionary = getDictionary(locale)
  const people = getCrewPeople(crew, locale)
  if (!people.length) return null
  return <PeopleSection people={people} title={dictionary.detail.keyCrew} kind="crew" locale={locale} messages={dictionary.detail.peopleUi} />
}
