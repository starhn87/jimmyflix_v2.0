import Image from 'next/image'
import Link from 'next/link'
import { StarIcon } from '@/components/icons'
import {
  formatRating,
  getMediaHref,
  getMediaTitle,
  getMediaType,
  getMediaYear,
  getPosterUrl,
  imageSkeletonPlaceholder,
} from '@/lib/media'
import type { MediaItem, MediaType } from '@/types/tmdb'
import type { Locale } from '@/lib/i18n'

interface MediaCardProps {
  item: MediaItem
  mediaType?: MediaType
  highPriority?: boolean
  locale: Locale
}

export function MediaCard({ item, mediaType, highPriority = false, locale }: MediaCardProps) {
  const title = getMediaTitle(item, locale)
  const type = getMediaType(item, mediaType)
  const year = getMediaYear(item, locale)
  const rating = formatRating(item.vote_average, locale)
  const typeLabel = type === 'movie'
    ? (locale === 'ko' ? '영화' : 'Movie')
    : (locale === 'ko' ? 'TV 프로그램' : 'TV show')

  return (
    <Link
      href={getMediaHref(item, type, locale)}
      prefetch={false}
      aria-label={[title, typeLabel, year, rating?.label].filter(Boolean).join(', ')}
      className="group block min-w-0 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
    >
      <article className="min-w-0">
        <div className="relative aspect-2/3 overflow-hidden rounded-xl border border-tone/8 bg-surface shadow-media">
          <Image
            src={getPosterUrl(item.poster_path)}
            alt={locale === 'ko' ? `${title} 포스터` : `${title} poster`}
            fill
            fetchPriority={highPriority ? 'high' : undefined}
            placeholder={imageSkeletonPlaceholder}
            quality={85}
            sizes="(max-width: 480px) 42vw, (max-width: 768px) 27vw, (max-width: 1200px) 20vw, 190px"
            className="object-cover object-center transition duration-300 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035] motion-reduce:transition-none"
          />
          {rating ? (
            <>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent" />
              <span
                aria-label={rating.label}
                className="absolute right-2 bottom-2 inline-flex min-h-7 items-center gap-1 rounded-full border border-tone/15 bg-black/80 px-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
              >
                <StarIcon className="size-3 text-amber-300" />
                {rating.value}
              </span>
            </>
          ) : null}
        </div>
        <h3 className="mt-3 line-clamp-2 text-[0.92rem] leading-[1.35] font-semibold text-ink transition-colors group-hover:text-accent-strong">
          {title}
        </h3>
        <p className="mt-1 truncate text-xs text-faint">{year}</p>
      </article>
    </Link>
  )
}
