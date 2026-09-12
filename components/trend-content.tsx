import Link from 'next/link'
import { ErrorState } from '@/components/error-state'
import { LoadingCardImage } from '@/components/loading-card-image'
import { MediaSectionSkeleton } from '@/components/loading-skeletons'
import { MediaRail } from '@/components/media-rail'
import { MediaSection } from '@/components/media-section'
import { TimeWindowSwitch } from '@/components/time-window-switch'
import { getDictionary } from '@/lib/dictionaries'
import { getLocalePath, type Locale } from '@/lib/i18n'
import { getMediaHref, getMediaTitle, getProfileUrl } from '@/lib/media'
import type { MediaSectionRequest } from '@/lib/tmdb'
import type { TimeWindow, TrendingPeopleData } from '@/types/tmdb'

// The rail itself includes 28px of bottom clearance: 12 + 28 = 40, 36 + 28 = 64.
export const TREND_STACK_CLASS_NAME = 'space-y-3 lg:space-y-9'

export function TrendHeader({ locale, window = 'day' }: {
  locale: Locale
  window?: TimeWindow
}) {
  const dictionary = getDictionary(locale).trend
  return (
    <header className="mx-auto max-w-[1600px] px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:px-10">
      <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">{dictionary.eyebrow}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-[-0.035em] text-ink sm:text-6xl">{dictionary.heading}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 break-keep text-pretty text-subtle sm:text-base">{dictionary.description}</p>
      <TimeWindowSwitch selected={window} locale={locale}
        label={dictionary.timeWindowLabel} todayLabel={dictionary.today} weekLabel={dictionary.week} />
    </header>
  )
}

export async function TrendingRankingSection({ request, locale, prioritizeFirst = false }: {
  request: MediaSectionRequest['request']
  locale: Locale
  prioritizeFirst?: boolean
}) {
  return <MediaSection section={await request} locale={locale} ranked prioritizeFirst={prioritizeFirst} />
}

export async function TrendingPeopleSection({ request, locale, window }: {
  request: Promise<TrendingPeopleData>
  locale: Locale
  window: TimeWindow
}) {
  const data = await request
  const dictionary = getDictionary(locale)
  if (data.error) return (
    <div className="px-4 sm:px-8 lg:px-12">
      <ErrorState compact title={dictionary.common.sectionUnavailableTitle(dictionary.trend.people)}
        message={dictionary.common.sectionUnavailableMessage} retryLabel={dictionary.common.retry} retryingLabel={dictionary.common.retrying} />
    </div>
  )
  if (data.people.length === 0) return (
    <section className="px-4 sm:px-8 lg:px-12" aria-labelledby="trending-people-title">
      <h2 id="trending-people-title" className="text-xl font-semibold text-ink sm:text-2xl">{dictionary.trend.people}</h2>
      <p className="mt-4 text-sm text-subtle">{dictionary.common.sectionEmpty}</p>
    </section>
  )
  return (
    <MediaRail id="trending-people" title={dictionary.trend.people}
      description={dictionary.trend.peopleDescription(window)} locale={locale}>
      {data.people.map((person) => (
        <article key={person.id} className="min-w-0">
          <Link href={getLocalePath(locale, `/people/${person.id}`)} prefetch={false}
            className="media-card group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-accent/60">
            <LoadingCardImage src={getProfileUrl(person.profile_path)} alt={dictionary.person.profileAlt(person.name)}
              sizes="(max-width: 639px) 42vw, 190px" imageClassName="object-cover object-top"
              containerClassName="media-card-poster relative aspect-2/3 overflow-hidden rounded-xl border border-tone/8 bg-surface shadow-media" />
            <h3 className="mt-3 truncate text-[0.92rem] leading-5 font-semibold text-ink group-hover:text-accent-strong">{person.name}</h3>
          </Link>
          <div className="mt-1 h-9">
            <Link href={getMediaHref(person.known_for[0], undefined, locale)} prefetch={false}
              className="line-clamp-2 rounded-sm text-xs leading-4 text-faint underline decoration-tone/20 underline-offset-3 outline-none hover:text-accent-strong focus-visible:ring-2 focus-visible:ring-accent/60">
              {getMediaTitle(person.known_for[0], locale)}
            </Link>
          </div>
        </article>
      ))}
    </MediaRail>
  )
}

export function TrendSkeleton({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale)
  return (
    <main aria-busy="true" aria-label={dictionary.trend.loading} className="pb-20">
      <TrendHeader locale={locale} />
      <div className={TREND_STACK_CLASS_NAME}>
        <MediaSectionSkeleton label={dictionary.trend.topMovies} title={dictionary.trend.topMovies} description={dictionary.trend.rankingDescription('day')} itemCount={10} />
        <MediaSectionSkeleton label={dictionary.trend.topShows} title={dictionary.trend.topShows} description={dictionary.trend.rankingDescription('day')} itemCount={10} />
        <MediaSectionSkeleton label={dictionary.trend.people} title={dictionary.trend.people} description={dictionary.trend.peopleDescription('day')} itemCount={10} />
        <MediaSectionSkeleton label={dictionary.trend.rediscovery} title={dictionary.trend.rediscovery} description={dictionary.trend.rediscoveryDescription('day')} itemCount={20} />
      </div>
    </main>
  )
}
