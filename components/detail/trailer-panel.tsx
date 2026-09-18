import { MediaImage } from '@/components/media-image'
import Link from 'next/link'
import { SearchIcon } from '@/components/icons'
import { VideoEmbed } from '@/components/video-embed'
import { getImageUrl, imageSkeletonPlaceholder } from '@/lib/media'
import { DETAIL_CONTENT_IMAGE_SIZES } from '@/components/detail-view-styles'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import { getTrailer } from '@/lib/videos'
import type { MediaDetail } from '@/types/tmdb'

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
          <MediaImage
            src={artwork}
            alt=""
            fill
            placeholder={imageSkeletonPlaceholder}
            quality={85}
            sizes={DETAIL_CONTENT_IMAGE_SIZES}
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
