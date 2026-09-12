import Image from 'next/image'
import Link from 'next/link'
import { BackButton } from '@/components/back-button'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { getPersonJsonLd } from '@/lib/structured-data'
import { MediaSection } from '@/components/media-section'
import { getDictionary } from '@/lib/dictionaries'
import { getLocalePath, type Locale } from '@/lib/i18n'
import { getProfileUrl, imageSkeletonPlaceholder } from '@/lib/media'
import type { MediaItem, PersonCredit, PersonDetail } from '@/types/tmdb'

const departmentLabels: Record<Locale, Record<string, string>> = {
  en: {},
  ko: {
    Acting: '연기',
    Directing: '연출',
    Production: '제작',
    Writing: '각본',
    Camera: '촬영',
    Sound: '음악·음향',
  },
}

const formatDate = (value: string | null, locale: Locale) => {
  if (!value) return null
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: locale === 'ko' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

const selectCredits = (credits: PersonCredit[] | undefined) => {
  const seen = new Set<string>()
  return [...(credits || [])]
    .filter((item) => (
      (item.media_type === 'movie' || item.media_type === 'tv') &&
      item.poster_path &&
      !item.adult
    ))
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .filter((item) => {
      const key = `${item.media_type}-${item.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 30) as MediaItem[]
}

export function PersonView({ person, locale }: { person: PersonDetail; locale: Locale }) {
  const dictionary = getDictionary(locale)
  const actingCredits = selectCredits(person.combined_credits?.cast)
  const crewCredits = selectCredits(person.combined_credits?.crew)
  const born = formatDate(person.birthday, locale)
  const died = formatDate(person.deathday, locale)
  const department = departmentLabels[locale][person.known_for_department] || person.known_for_department
  const biography = person.biography.replaceAll('**', '')

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-canvas pb-20">
      <JsonLd data={getPersonJsonLd(person, locale)} />
      <div className="mx-auto grid max-w-[1480px] gap-8 px-4 py-8 sm:px-6 md:grid-cols-[minmax(240px,340px)_minmax(0,1fr)] md:gap-12 md:py-14 lg:px-10">
        <div className="mx-auto w-full max-w-[340px] md:mx-0">
          <div className="relative aspect-2/3 overflow-hidden rounded-2xl border border-tone/10 bg-surface shadow-media">
            <Image
              src={getProfileUrl(person.profile_path)}
              alt={dictionary.person.profileAlt(person.name)}
              fill
              loading="eager"
              fetchPriority="high"
              placeholder={imageSkeletonPlaceholder}
              quality={85}
              sizes="(max-width: 767px) min(87vw, 340px), 340px"
              className="object-cover object-center"
            />
          </div>
        </div>

        <div className="min-w-0 md:pt-3">
          <BackButton fallbackHref={getLocalePath(locale)} label={dictionary.common.goBack} />
          <div className="mt-7 flex flex-wrap items-start gap-3">
            <Breadcrumbs locale={locale} items={[
              { name: 'Jimmyflix', href: getLocalePath(locale) },
              { name: person.name, href: getLocalePath(locale, `/people/${person.id}`) },
            ]} />
            <h1 className="text-4xl leading-[1.05] font-bold tracking-[-0.035em] text-balance text-ink sm:text-5xl lg:text-6xl">
              {person.name}
            </h1>
            {person.imdb_id ? (
              <Link
                href={`https://www.imdb.com/name/${person.imdb_id}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex min-h-8 items-center rounded-md bg-[#f5c518] px-2 font-mono text-xs font-black text-black outline-none focus-visible:ring-3 focus-visible:ring-white/60"
              >
                IMDb
              </Link>
            ) : null}
          </div>
          {department ? (
            <p className="mt-4 inline-flex min-h-8 items-center rounded-full border border-accent/25 bg-accent/7 px-3 text-sm text-accent-strong">
              {department}
            </p>
          ) : null}

          <section className="mt-9" aria-labelledby="biography-title">
            <h2 id="biography-title" className="text-xl font-semibold text-ink sm:text-2xl">
              {dictionary.person.biography}
            </h2>
            <p className="mt-4 max-w-[76ch] whitespace-pre-line text-sm leading-7 text-muted sm:text-base sm:leading-8">
              {biography || dictionary.person.noBiography}
            </p>
          </section>

          <section className="mt-9" aria-labelledby="personal-details-title">
            <h2 id="personal-details-title" className="text-xl font-semibold text-ink sm:text-2xl">
              {dictionary.person.personalDetails}
            </h2>
            <dl className="mt-4 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
              {department ? (
                <div>
                  <dt className="text-faint">{dictionary.person.knownForDepartment}</dt>
                  <dd className="mt-1 text-muted">{department}</dd>
                </div>
              ) : null}
              {born ? (
                <div>
                  <dt className="text-faint">{dictionary.person.born}</dt>
                  <dd className="mt-1 text-muted">{born}</dd>
                </div>
              ) : null}
              {died ? (
                <div>
                  <dt className="text-faint">{dictionary.person.died}</dt>
                  <dd className="mt-1 text-muted">{died}</dd>
                </div>
              ) : null}
              {person.place_of_birth ? (
                <div>
                  <dt className="text-faint">{dictionary.person.placeOfBirth}</dt>
                  <dd className="mt-1 text-muted">{person.place_of_birth}</dd>
                </div>
              ) : null}
              {person.also_known_as.length > 0 ? (
                <div className="sm:col-span-2">
                  <dt className="text-faint">{dictionary.person.alsoKnownAs}</dt>
                  <dd className="mt-1 text-muted">{person.also_known_as.slice(0, 6).join(' · ')}</dd>
                </div>
              ) : null}
            </dl>
          </section>
        </div>
      </div>

      <div className="space-y-10 sm:space-y-14">
        {actingCredits.length > 0 ? (
          <MediaSection
            locale={locale}
            section={{
              id: `person-${person.id}-acting`,
              title: dictionary.person.actingCredits,
              description: dictionary.person.actingCreditsDescription,
              mediaType: 'movie',
              items: actingCredits,
              error: false,
            }}
          />
        ) : null}
        {crewCredits.length > 0 ? (
          <MediaSection
            locale={locale}
            section={{
              id: `person-${person.id}-crew`,
              title: dictionary.person.crewCredits,
              description: dictionary.person.crewCreditsDescription,
              mediaType: 'movie',
              items: crewCredits,
              error: false,
            }}
          />
        ) : null}
      </div>
    </main>
  )
}
