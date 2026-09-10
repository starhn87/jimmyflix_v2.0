import Image from 'next/image'
import Link from 'next/link'
import { PlayIcon, StarIcon } from '@/components/icons'
import {
  formatRating,
  getImageUrl,
  getMediaHref,
  getMediaTitle,
  getMediaYear,
} from '@/lib/media'
import type { MediaItem, MediaType } from '@/types/tmdb'

interface HeroProps {
  item: MediaItem
  mediaType: MediaType
  eyebrow: string
}

export function Hero({ item, mediaType, eyebrow }: HeroProps) {
  const title = getMediaTitle(item)
  const rating = formatRating(item.vote_average)
  const backdrop = getImageUrl(item.backdrop_path, 'w1280')

  return (
    <section aria-labelledby="featured-title" className="relative isolate min-h-[520px] overflow-hidden sm:min-h-[600px] lg:min-h-[680px]">
      {backdrop ? (
        <Image
          src={backdrop}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="-z-30 object-cover object-center"
        />
      ) : null}
      <div className="absolute inset-0 -z-20 hero-vignette" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-canvas via-canvas/35 to-canvas/15" />
      <div className="mx-auto flex min-h-[520px] max-w-[1600px] items-end px-4 pb-20 sm:min-h-[600px] sm:px-6 sm:pb-24 lg:min-h-[680px] lg:px-10 lg:pb-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase sm:text-sm">
            {eyebrow}
          </p>
          <h1 id="featured-title" className="mt-4 text-4xl leading-[1.04] font-bold tracking-[-0.035em] text-balance text-ink sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted">
            {rating ? (
              <span aria-label={rating.label} className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-tone/16 bg-overlay px-3 backdrop-blur-sm">
                <StarIcon className="size-3.5 text-warning" />
                {rating.value}/10
              </span>
            ) : null}
            <span className="inline-flex min-h-8 items-center rounded-full border border-tone/16 bg-overlay px-3 backdrop-blur-sm">
              {getMediaYear(item)}
            </span>
          </div>
          {item.overview ? (
            <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-6 text-muted/90 sm:text-base sm:leading-7">
              {item.overview}
            </p>
          ) : null}
          <Link
            href={getMediaHref(item, mediaType)}
            prefetch={false}
            className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-action px-6 text-sm font-bold text-on-action shadow-panel outline-none transition hover:bg-action-hover focus-visible:ring-4 focus-visible:ring-accent/40"
          >
            <PlayIcon className="size-4" />
            View details
          </Link>
        </div>
      </div>
    </section>
  )
}
