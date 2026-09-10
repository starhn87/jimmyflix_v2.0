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
  const backdrop = getImageUrl(item.backdrop_path, 'original')

  return (
    <section aria-labelledby="featured-title" className="relative isolate min-h-[520px] overflow-hidden sm:min-h-[600px] lg:min-h-[680px]">
      {backdrop ? (
        <Image
          src={backdrop}
          alt=""
          fill
          preload
          sizes="100vw"
          className="-z-30 object-cover object-center"
        />
      ) : null}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_76%_28%,rgba(8,11,18,0.05),rgba(8,11,18,0.72)_55%,#080b12_86%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080b12] via-[#080b12]/35 to-[#080b12]/15" />
      <div className="mx-auto flex min-h-[520px] max-w-[1600px] items-end px-4 pb-20 sm:min-h-[600px] sm:px-6 sm:pb-24 lg:min-h-[680px] lg:px-10 lg:pb-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase sm:text-sm">
            {eyebrow}
          </p>
          <h1 id="featured-title" className="mt-4 text-4xl leading-[1.04] font-bold tracking-[-0.035em] text-balance text-white drop-shadow-2xl sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-200">
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/16 bg-black/35 px-3 backdrop-blur-sm">
              {rating.value === 'NR' ? null : <StarIcon className="size-3.5 text-amber-300" />}
              {rating.value === 'NR' ? 'Not rated' : `${rating.value}/10`}
            </span>
            <span className="inline-flex min-h-8 items-center rounded-full border border-white/16 bg-black/35 px-3 backdrop-blur-sm">
              {getMediaYear(item)}
            </span>
          </div>
          {item.overview ? (
            <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-6 text-slate-200/90 drop-shadow-lg sm:text-base sm:leading-7">
              {item.overview}
            </p>
          ) : null}
          <Link
            href={getMediaHref(item, mediaType)}
            className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-slate-950 shadow-xl shadow-black/25 outline-none transition hover:bg-cyan-100 focus-visible:ring-4 focus-visible:ring-cyan-300/40"
          >
            <PlayIcon className="size-4" />
            View details
          </Link>
        </div>
      </div>
    </section>
  )
}
