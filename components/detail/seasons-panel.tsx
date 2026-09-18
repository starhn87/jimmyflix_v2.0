import { MediaImage } from '@/components/media-image'
import { LoadingCardImage } from '@/components/loading-card-image'
import { panelHeading, responsiveCardGrid, centeredItem, EmptyPanel } from '@/components/detail/panel-primitives'
import { getImageUrl, getPosterUrl, imageSkeletonPlaceholder } from '@/lib/media'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import type { Episode, Season, SeasonDetail } from '@/types/tmdb'

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
                  <MediaImage
                    src={getPosterUrl(season.poster_path)}
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
