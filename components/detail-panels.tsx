import Image from 'next/image'
import { ErrorState } from '@/components/error-state'
import { LoadingCardImage } from '@/components/loading-card-image'
import { MediaCard } from '@/components/media-card'
import { VideoEmbed } from '@/components/video-embed'
import { getImageUrl, getProfileUrl, imageSkeletonPlaceholder } from '@/lib/media'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import type {
  CastMember,
  MediaDetail,
  MediaItem,
  ProductionCompany,
  ProductionCountry,
  Season,
  Video,
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

const getTrailer = (videos: Video[] | undefined) =>
  videos?.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official,
  ) || videos?.find((video) => video.site === 'YouTube' && video.type === 'Trailer')

export function TrailerPanel({ detail, locale }: { detail: MediaDetail; locale: Locale }) {
  const dictionary = getDictionary(locale)
  const title = detail.title || detail.name || dictionary.common.untitled
  const trailer = getTrailer(detail.videos?.results)

  if (!trailer) return <EmptyPanel message={dictionary.detail.noTrailer} />
  return (
    <VideoEmbed
      videoKey={trailer.key}
      frameTitle={dictionary.detail.trailerFrameTitle(title)}
      playLabel={dictionary.detail.playTrailer(title)}
    />
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

  if (cast.length === 0) return <EmptyPanel message={dictionary.detail.noCast} />

  return (
    <section className="pt-7" aria-labelledby="cast-title">
      <h2 id="cast-title" className={panelHeading}>{dictionary.detail.cast}</h2>
      <ul className={responsiveCardGrid}>
        {cast.slice(0, 30).map((person) => (
          <li key={`${person.id}-${person.character || person.name}`} className={centeredItem}>
            <div className="relative mx-auto aspect-2/3 w-full overflow-hidden rounded-xl border border-tone/8 bg-surface shadow-lg shadow-black/25">
              <Image
                src={getProfileUrl(person.profile_path)}
                alt={person.name || person.original_name}
                fill
                placeholder={imageSkeletonPlaceholder}
                quality={85}
                sizes="(max-width: 480px) 42vw, 180px"
                className="object-cover object-center"
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink">{person.name || person.original_name}</p>
            <p className="mt-1 text-xs leading-5 text-faint">
              {person.character || dictionary.detail.castMember}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CompanyCard({ company }: { company: ProductionCompany }) {
  const logo = getImageUrl(company.logo_path, 'w300') || '/images/defaultProduction.png'
  return (
    <li className={centeredItem}>
      <LoadingCardImage
        src={logo}
        alt={company.name}
        sizes="180px"
        imageClassName="object-contain object-center p-4"
        containerClassName="relative mx-auto aspect-square w-full overflow-hidden rounded-xl border border-tone/10 bg-slate-100 shadow-panel"
      />
      <p className="mt-3 text-sm leading-5 font-medium text-muted">{company.name}</p>
    </li>
  )
}

function CountryCard({ country, flagAlt }: {
  country: ProductionCountry
  flagAlt: string
}) {
  return (
    <li className={centeredItem}>
      <LoadingCardImage
        src={`https://flagcdn.com/w640/${country.iso_3166_1.toLowerCase()}.png`}
        alt={flagAlt}
        sizes="180px"
        imageClassName="object-cover object-center"
        containerClassName="relative mx-auto aspect-5/3 w-full overflow-hidden rounded-xl border border-tone/10 bg-surface shadow-panel"
      />
      <p className="mt-3 text-sm leading-5 font-medium text-muted">{country.name}</p>
    </li>
  )
}

export function ProductionPanel({ detail, locale }: { detail: MediaDetail; locale: Locale }) {
  const dictionary = getDictionary(locale)
  const companies = detail.production_companies || []
  const countries = detail.production_countries || []

  if (companies.length === 0 && countries.length === 0) {
    return <EmptyPanel message={dictionary.detail.noProduction} />
  }

  return (
    <div className="space-y-10 pt-7">
      {companies.length > 0 ? (
        <section aria-labelledby="companies-title">
          <h2 id="companies-title" className={panelHeading}>{dictionary.detail.productionCompanies}</h2>
          <ul className={responsiveCardGrid}>
            {companies.map((company) => <CompanyCard key={company.id} company={company} />)}
          </ul>
        </section>
      ) : null}
      {countries.length > 0 ? (
        <section aria-labelledby="countries-title">
          <h2 id="countries-title" className={panelHeading}>{dictionary.detail.productionCountries}</h2>
          <ul className={responsiveCardGrid}>
            {countries.map((country) => (
              <CountryCard
                key={country.iso_3166_1}
                country={country}
                flagAlt={dictionary.detail.flagAlt(country.name)}
              />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

export function SeasonsPanel({ seasons, locale }: { seasons: Season[]; locale: Locale }) {
  const dictionary = getDictionary(locale)
  if (seasons.length === 0) return <EmptyPanel message={dictionary.detail.noSeasons} />

  return (
    <section className="pt-7" aria-labelledby="seasons-title">
      <h2 id="seasons-title" className={panelHeading}>{dictionary.detail.seasons}</h2>
      <ul className={responsiveCardGrid}>
        {seasons.map((season) => (
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
          </li>
        ))}
      </ul>
    </section>
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
