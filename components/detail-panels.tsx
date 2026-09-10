import Image from 'next/image'
import { ErrorState } from '@/components/error-state'
import { MediaCard } from '@/components/media-card'
import { VideoEmbed } from '@/components/video-embed'
import { getImageUrl, getProfileUrl } from '@/lib/media'
import type {
  CastMember,
  MediaDetail,
  MediaItem,
  ProductionCompany,
  ProductionCountry,
  Season,
  Video,
} from '@/types/tmdb'

const panelHeading = 'text-lg font-semibold tracking-tight text-white sm:text-xl'
const centeredGrid =
  'mt-5 flex flex-wrap justify-center gap-x-4 gap-y-8 sm:gap-5'
const centeredItem = 'w-[47%] max-w-[180px] text-center sm:w-[180px]'

function EmptyPanel({ message }: { message: string }) {
  return (
    <p className="mt-7 rounded-2xl border border-white/8 bg-white/4 p-7 text-center text-sm text-slate-400">
      {message}
    </p>
  )
}

const getTrailer = (videos: Video[] | undefined) =>
  videos?.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official,
  ) || videos?.find((video) => video.site === 'YouTube' && video.type === 'Trailer')

export function TrailerPanel({ detail }: { detail: MediaDetail }) {
  const title = detail.title || detail.name || 'This title'
  const trailer = getTrailer(detail.videos?.results)

  if (!trailer) return <EmptyPanel message="No trailer is available for this title." />
  return <VideoEmbed videoKey={trailer.key} title={title} />
}

export function CreditsPanel({
  cast,
  error,
}: {
  cast: CastMember[]
  error: boolean
}) {
  if (error) {
    return (
      <ErrorState
        compact
        title="Couldn't load credits"
        message="The cast list is temporarily unavailable."
      />
    )
  }

  if (cast.length === 0) return <EmptyPanel message="No cast information is available." />

  return (
    <section className="pt-7" aria-labelledby="cast-title">
      <h2 id="cast-title" className={panelHeading}>Cast</h2>
      <ul className={centeredGrid}>
        {cast.slice(0, 30).map((person) => (
          <li key={`${person.id}-${person.character || person.name}`} className={centeredItem}>
            <div className="relative mx-auto aspect-2/3 w-full overflow-hidden rounded-xl border border-white/8 bg-slate-900 shadow-lg shadow-black/25">
              <Image
                src={getProfileUrl(person.profile_path)}
                alt={person.name || person.original_name}
                fill
                sizes="(max-width: 480px) 42vw, 180px"
                className="object-cover object-center"
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-white">{person.name || person.original_name}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {person.character || 'Cast member'}
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
      <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-slate-100 shadow-lg shadow-black/20">
        <Image
          src={logo}
          alt={company.name}
          fill
          sizes="180px"
          className="object-contain object-center p-4"
        />
      </div>
      <p className="mt-3 text-sm leading-5 font-medium text-slate-200">{company.name}</p>
    </li>
  )
}

function CountryCard({ country }: { country: ProductionCountry }) {
  return (
    <li className={centeredItem}>
      <div className="relative mx-auto aspect-5/3 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-lg shadow-black/20">
        <Image
          src={`https://flagcdn.com/w320/${country.iso_3166_1.toLowerCase()}.png`}
          alt={`${country.name} flag`}
          fill
          sizes="180px"
          className="object-cover object-center"
        />
      </div>
      <p className="mt-3 text-sm leading-5 font-medium text-slate-200">{country.name}</p>
    </li>
  )
}

export function ProductionPanel({ detail }: { detail: MediaDetail }) {
  const companies = detail.production_companies || []
  const countries = detail.production_countries || []

  if (companies.length === 0 && countries.length === 0) {
    return <EmptyPanel message="No production information is available." />
  }

  return (
    <div className="space-y-10 pt-7">
      {companies.length > 0 ? (
        <section aria-labelledby="companies-title">
          <h2 id="companies-title" className={panelHeading}>Production companies</h2>
          <ul className={centeredGrid}>
            {companies.map((company) => <CompanyCard key={company.id} company={company} />)}
          </ul>
        </section>
      ) : null}
      {countries.length > 0 ? (
        <section aria-labelledby="countries-title">
          <h2 id="countries-title" className={panelHeading}>Production countries</h2>
          <ul className={centeredGrid}>
            {countries.map((country) => (
              <CountryCard key={country.iso_3166_1} country={country} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

export function SeasonsPanel({ seasons }: { seasons: Season[] }) {
  if (seasons.length === 0) return <EmptyPanel message="No season information is available." />

  return (
    <section className="pt-7" aria-labelledby="seasons-title">
      <h2 id="seasons-title" className={panelHeading}>Seasons</h2>
      <ul className={centeredGrid}>
        {seasons.map((season) => (
          <li key={season.id} className={centeredItem}>
            <div className="relative mx-auto aspect-2/3 w-full overflow-hidden rounded-xl border border-white/8 bg-slate-900">
              <Image
                src={getImageUrl(season.poster_path, 'w342') || '/images/defaultPoster.png'}
                alt={`${season.name} poster`}
                fill
                sizes="180px"
                className="object-cover object-center"
              />
            </div>
            <p className="mt-3 text-sm font-medium text-white">{season.name}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function CollectionPanel({
  items,
  error,
}: {
  items: MediaItem[]
  error: boolean
}) {
  if (error) {
    return (
      <ErrorState
        compact
        title="Couldn't load this collection"
        message="The collection titles are temporarily unavailable."
      />
    )
  }

  if (items.length === 0) return <EmptyPanel message="No collection titles are available." />

  return (
    <section className="pt-7" aria-labelledby="collection-title">
      <h2 id="collection-title" className={panelHeading}>Collection titles</h2>
      <ul className="mt-5 flex flex-wrap justify-center gap-4 sm:gap-5">
        {items.map((item) => (
          <li key={item.id} className="w-[47%] max-w-[180px] sm:w-[180px]">
            <MediaCard item={item} mediaType="movie" />
          </li>
        ))}
      </ul>
    </section>
  )
}
