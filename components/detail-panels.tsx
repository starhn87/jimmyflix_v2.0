import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ErrorState } from '@/components/error-state'
import { SearchIcon } from '@/components/icons'
import { LoadingCardImage } from '@/components/loading-card-image'
import { Gallery } from '@/components/gallery'
import { DetailCardRail } from '@/components/detail-card-rail'
import { PeopleSection } from '@/components/people-section'
import { getCastPeople, getCrewPeople } from '@/lib/detail-people'
import { MediaCard } from '@/components/media-card'
import { VideoEmbed } from '@/components/video-embed'
import { getImageUrl, imageSkeletonPlaceholder } from '@/lib/media'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import { getTrailer } from '@/lib/videos'
import type { GalleryImage } from '@/lib/gallery'
import type {
  CastMember,
  CrewMember,
  Episode,
  MediaDetail,
  MediaItem,
  ProductionCompany,
  ProductionCountry,
  Season,
  SeasonDetail,
  WatchProvider,
  WatchProviderRegion,
} from '@/types/tmdb'

const panelHeading = 'text-lg font-semibold tracking-tight text-ink sm:text-xl'
const responsiveCardGrid =
  'mt-5 flex flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-5 lg:justify-start'
const centeredItem = 'w-[47%] max-w-[180px] text-center sm:w-[180px]'

function EmptyPanel({ message }: { message: string }) {
  return (
    <p className="mt-7 rounded-2xl border border-tone/8 bg-tone/4 p-7 text-center text-sm text-subtle">
      {message}
    </p>
  )
}

export function TrailerPanel({ detail, locale }: { detail: MediaDetail; locale: Locale }) {
  const dictionary = getDictionary(locale)
  const title = detail.title || detail.name || dictionary.common.untitled
  const trailer = getTrailer(detail.videos?.results)

  if (!trailer) {
    const artwork = getImageUrl(detail.backdrop_path, 'w1280')
      || getImageUrl(detail.poster_path, 'w780')
    const searchQuery = locale === 'ko' ? `${title} 예고편` : `${title} official trailer`

    return (
      <section
        aria-labelledby="trailer-fallback-title"
        className="relative mx-auto mt-7 flex min-h-[280px] w-full max-w-[1100px] items-center justify-center overflow-hidden rounded-2xl border border-tone/10 bg-surface px-6 py-10 text-center shadow-media sm:aspect-video sm:min-h-0"
      >
        {artwork ? (
          <Image
            src={artwork}
            alt=""
            fill
            placeholder={imageSkeletonPlaceholder}
            quality={85}
            sizes="(max-width: 768px) 100vw, 1100px"
            className="scale-[1.02] object-cover object-center opacity-35 blur-[1px]"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/45 via-canvas/80 to-canvas/95" />
        <div className="relative z-10 flex max-w-lg flex-col items-center">
          <span className="grid size-14 place-items-center rounded-full border border-tone/12 bg-overlay text-accent-strong shadow-panel backdrop-blur-md">
            <SearchIcon className="size-6" />
          </span>
          <h2 id="trailer-fallback-title" className="mt-5 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {dictionary.detail.noTrailer}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            {dictionary.detail.trailerSearchHint}
          </p>
          <Link
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
            target="_blank"
            rel="noreferrer"
            aria-label={dictionary.detail.searchTrailerLabel(title)}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-action px-5 text-sm font-bold text-on-action shadow-panel outline-none transition hover:bg-action-hover focus-visible:ring-4 focus-visible:ring-accent/40"
          >
            <SearchIcon className="size-4" />
            {dictionary.detail.searchTrailer}
          </Link>
        </div>
      </section>
    )
  }
  return (
    <VideoEmbed
      videoKey={trailer.key}
      frameTitle={dictionary.detail.trailerFrameTitle(title)}
      playLabel={dictionary.detail.playTrailer(title)}
    />
  )
}

export function GalleryPanel({
  images,
  title,
  locale,
}: {
  images: GalleryImage[]
  title: string
  locale: Locale
}) {
  const dictionary = getDictionary(locale)

  return (
    <Gallery images={images} title={title} heading={dictionary.detail.galleryHeading} messages={dictionary.detail.galleryUi} />
  )
}

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

function CompanyCard({ company }: { company: ProductionCompany }) {
  return (
    <li className="w-60 shrink-0 snap-start">
      <div className="flex h-24 items-center gap-3 rounded-xl border border-tone/10 bg-tone/3 p-3">
        <LoadingCardImage
          src={getImageUrl(company.logo_path, 'w300') || '/images/defaultProduction.png'}
          alt={company.name}
          sizes="64px"
          imageClassName="object-contain object-center p-2"
          containerClassName="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100"
        />
        <p className="line-clamp-3 text-sm leading-5 font-medium text-muted" title={company.name}>{company.name}</p>
      </div>
    </li>
  )
}

function CountryCard({ country, flagAlt }: { country: ProductionCountry; flagAlt: string }) {
  return (
    <li className="inline-flex min-h-10 items-center gap-2 rounded-full border border-tone/10 bg-tone/3 px-3 py-2">
      <LoadingCardImage
        src={`https://flagcdn.com/w80/${country.iso_3166_1.toLowerCase()}.png`}
        alt={flagAlt}
        sizes="24px"
        imageClassName="object-contain object-center"
        containerClassName="relative aspect-5/3 w-6 shrink-0 overflow-hidden rounded-xs bg-surface"
      />
      <span className="text-sm leading-5 text-muted">{country.name}</span>
    </li>
  )
}

const uniqueProviders = (providers: WatchProvider[]) => {
  const seen = new Set<number>()
  return providers.filter((provider) => {
    if (seen.has(provider.provider_id)) return false
    seen.add(provider.provider_id)
    return true
  })
}

function ProviderGroup({
  title,
  providers,
  link,
  locale,
}: {
  title: string
  providers: WatchProvider[]
  link: string
  locale: Locale
}) {
  const dictionary = getDictionary(locale)
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-3">
        {uniqueProviders(providers).map((provider) => (
          <li key={provider.provider_id} className="w-20 text-center sm:w-24">
            <Link
              href={link}
              target="_blank"
              rel="noreferrer"
              aria-label={dictionary.detail.watchOn(provider.provider_name)}
              className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-accent/50"
            >
              <LoadingCardImage
                src={getImageUrl(provider.logo_path, 'w300') || '/images/defaultProduction.png'}
                alt={provider.provider_name}
                sizes="96px"
                imageClassName="object-cover object-center"
                containerClassName="relative mx-auto aspect-square w-16 overflow-hidden rounded-2xl border border-tone/10 bg-surface shadow-panel sm:w-20"
              />
              <p className="mt-2 line-clamp-2 text-xs leading-4 text-muted transition-colors group-hover:text-accent-strong">
                {provider.provider_name}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function WatchProvidersPanel({ providers, locale }: { providers?: WatchProviderRegion | null; locale: Locale }) {
  const dictionary = getDictionary(locale)
  const groups = providers ? [
    {
      title: dictionary.detail.stream,
      providers: [...(providers.flatrate || []), ...(providers.free || []), ...(providers.ads || [])],
    },
    { title: dictionary.detail.rent, providers: providers.rent || [] },
    { title: dictionary.detail.buy, providers: providers.buy || [] },
  ].filter((group) => group.providers.length > 0) : []

  if (!providers || !groups.length) return null
  return (
    <section aria-labelledby="watch-providers-title">
      <h2 id="watch-providers-title" className={panelHeading}>{dictionary.detail.streamingAvailability}</h2>
      <div className="mt-5 grid gap-7 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {groups.map((group) => <ProviderGroup key={group.title} title={group.title} providers={group.providers} link={providers.link} locale={locale} />)}
      </div>
      <Link href="https://www.justwatch.com/" target="_blank" rel="noreferrer" className="mt-5 inline-flex text-xs text-faint underline decoration-tone/30 underline-offset-4 transition hover:text-ink">
        {dictionary.detail.justWatchAttribution}
      </Link>
    </section>
  )
}

export function ProductionEmptyPanel({ locale }: { locale: Locale }) {
  return <EmptyPanel message={getDictionary(locale).detail.noProduction} />
}

export function ProductionPanel({ detail, crewPanel, providersPanel, emptyPanel, locale }: {
  detail: MediaDetail
  crewPanel: ReactNode
  providersPanel: ReactNode
  emptyPanel: ReactNode
  locale: Locale
}) {
  const dictionary = getDictionary(locale)
  const companies = detail.production_companies || []
  const countries = detail.production_countries || []
  return (
    <div className="min-w-0 space-y-8 pt-7">
      {crewPanel}
      {companies.length > 0 ? (
        <DetailCardRail title={dictionary.detail.productionCompanies} count={companies.length} previousLabel={`${dictionary.detail.productionCompanies}: ${dictionary.detail.peopleUi.previous}`} nextLabel={`${dictionary.detail.productionCompanies}: ${dictionary.detail.peopleUi.next}`}>
          {companies.map((company) => <CompanyCard key={company.id} company={company} />)}
        </DetailCardRail>
      ) : null}
      {countries.length > 0 ? (
        <section aria-labelledby="countries-title">
          <h2 id="countries-title" className={panelHeading}>{dictionary.detail.productionCountries}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {countries.map((country) => <CountryCard key={country.iso_3166_1} country={country} flagAlt={dictionary.detail.flagAlt(country.name)} />)}
          </ul>
        </section>
      ) : null}
      {providersPanel}
      {emptyPanel}
    </div>
  )
}

const formatEpisodeDate = (date: string | null | undefined, locale: Locale) => {
  if (!date) return null
  const parsed = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date

  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed)
}

function EpisodeImage({ episode, sizes }: { episode: Episode; sizes: string }) {
  const still = getImageUrl(episode.still_path, 'w780')

  if (!still) {
    return (
      <div className="grid aspect-video place-items-center bg-gradient-to-br from-accent/16 via-surface to-canvas text-xl font-bold text-accent-strong">
        E{episode.episode_number}
      </div>
    )
  }

  return (
    <LoadingCardImage
      src={still}
      alt=""
      sizes={sizes}
      imageClassName="object-cover object-center"
      containerClassName="relative aspect-video overflow-hidden bg-surface"
    />
  )
}

function EpisodeMeta({ episode, locale }: { episode: Episode; locale: Locale }) {
  const dictionary = getDictionary(locale)
  const date = formatEpisodeDate(episode.air_date, locale)

  return (
    <p className="mt-1.5 text-xs text-faint">
      {dictionary.detail.episodeNumber(episode.season_number, episode.episode_number)}
      {date ? ` · ${date}` : ''}
      {episode.runtime ? ` · ${dictionary.detail.minutes(episode.runtime)}` : ''}
    </p>
  )
}

export function SeasonsPanel({
  seasons,
  latestSeason,
  featuredEpisode,
  locale,
}: {
  seasons: Season[]
  latestSeason?: SeasonDetail | null
  featuredEpisode?: Episode | null
  locale: Locale
}) {
  const dictionary = getDictionary(locale)
  if (seasons.length === 0) return <EmptyPanel message={dictionary.detail.noSeasons} />

  const regularSeasons = seasons.filter((season) => season.season_number > 0).slice(-12).reverse()

  return (
    <div className="space-y-10 pt-7">
      {featuredEpisode ? (
        <section aria-labelledby="featured-episode-title">
          <p className="text-xs font-bold tracking-[0.16em] text-accent-strong uppercase">
            {featuredEpisode.air_date && featuredEpisode.air_date > new Date().toISOString().slice(0, 10)
              ? dictionary.detail.upcomingEpisode
              : dictionary.detail.latestEpisode}
          </p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-tone/10 bg-tone/4 shadow-panel sm:grid sm:grid-cols-[minmax(240px,42%)_1fr]">
            <EpisodeImage episode={featuredEpisode} sizes="(max-width: 639px) 100vw, 420px" />
            <div className="p-5 sm:p-6">
              <h2 id="featured-episode-title" className="text-lg font-semibold text-ink sm:text-xl">
                {featuredEpisode.name}
              </h2>
              <EpisodeMeta episode={featuredEpisode} locale={locale} />
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted">
                {featuredEpisode.overview || dictionary.detail.noEpisodeOverview}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {latestSeason?.episodes?.length ? (
        <section aria-labelledby="latest-season-title">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="latest-season-title" className={panelHeading}>
              {dictionary.detail.latestSeason} · {latestSeason.name}
            </h2>
            <p className="text-xs text-faint">
              {dictionary.detail.episodeCount(latestSeason.episodes.length)}
            </p>
          </div>
          <ul className="mt-5 grid gap-4 xl:grid-cols-2">
            {latestSeason.episodes.slice(0, 12).map((episode) => (
              <li key={episode.id} className="overflow-hidden rounded-xl border border-tone/8 bg-tone/4 sm:grid sm:grid-cols-[180px_1fr]">
                <EpisodeImage episode={episode} sizes="(max-width: 639px) 100vw, 180px" />
                <div className="p-4">
                  <h3 className="line-clamp-1 text-sm font-semibold text-ink">{episode.name}</h3>
                  <EpisodeMeta episode={episode} locale={locale} />
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-subtle">
                    {episode.overview || dictionary.detail.noEpisodeOverview}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {regularSeasons.length > 0 ? (
        <section aria-labelledby="seasons-title">
          <h2 id="seasons-title" className={panelHeading}>{dictionary.detail.allSeasons}</h2>
          <ul className={responsiveCardGrid}>
            {regularSeasons.map((season) => (
              <li key={season.id} className={centeredItem}>
                <div className="relative mx-auto aspect-2/3 w-full overflow-hidden rounded-xl border border-tone/8 bg-surface">
                  <Image
                    src={getImageUrl(season.poster_path, 'w500') || '/images/defaultPoster.png'}
                    alt={dictionary.common.posterAlt(season.name)}
                    fill
                    placeholder={imageSkeletonPlaceholder}
                    quality={85}
                    sizes="180px"
                    className="object-cover object-center"
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-ink">{season.name}</p>
                {season.episode_count ? (
                  <p className="mt-1 text-xs text-faint">{dictionary.detail.episodeCount(season.episode_count)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

export function CollectionPanel({
  items,
  error,
  locale,
}: {
  items: MediaItem[]
  error: boolean
  locale: Locale
}) {
  const dictionary = getDictionary(locale)
  if (error) {
    return (
      <ErrorState
        compact
        title={dictionary.detail.collectionErrorTitle}
        message={dictionary.detail.collectionErrorMessage}
        retryLabel={dictionary.common.retry}
        retryingLabel={dictionary.common.retrying}
      />
    )
  }

  if (items.length === 0) return <EmptyPanel message={dictionary.detail.noCollection} />

  return (
    <section className="pt-7" aria-labelledby="collection-title">
      <h2 id="collection-title" className={panelHeading}>{dictionary.detail.collectionTitles}</h2>
      <ul className="mt-5 flex flex-wrap justify-center gap-4 sm:gap-5 lg:justify-start">
        {items.map((item) => (
          <li key={item.id} className="w-[47%] max-w-[180px] sm:w-[180px]">
            <MediaCard item={item} mediaType="movie" locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  )
}
