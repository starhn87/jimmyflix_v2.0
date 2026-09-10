import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { DetailTabs, type DetailTab } from '@/components/detail-tabs'
import {
  ProductionPanel,
  SeasonsPanel,
  TrailerPanel,
} from '@/components/detail-panels'
import { StarIcon } from '@/components/icons'
import { formatRating, getImageUrl, getMediaTitle, getMediaYear, getPosterUrl } from '@/lib/media'
import type { MediaDetail, MediaType } from '@/types/tmdb'

interface DetailViewProps {
  detail: MediaDetail
  mediaType: MediaType
  creditsPanel: ReactNode
  collectionPanel?: ReactNode
}

export function DetailView({
  detail,
  mediaType,
  creditsPanel,
  collectionPanel,
}: DetailViewProps) {
  const title = getMediaTitle(detail)
  const rating = formatRating(detail.vote_average)
  const duration = detail.runtime || detail.episode_run_time?.find((time) => time > 0)
  const backdrop = getImageUrl(detail.backdrop_path, 'original')
  const tabs: DetailTab[] = [
    { id: 'trailer', label: 'Trailer', content: <TrailerPanel detail={detail} /> },
    {
      id: 'credits',
      label: 'Credits',
      content: creditsPanel,
    },
    {
      id: 'production',
      label: 'Production',
      content: <ProductionPanel detail={detail} />,
    },
  ]

  if (detail.belongs_to_collection && collectionPanel) {
    tabs.push({
      id: 'collection',
      label: 'Collection',
      content: collectionPanel,
    })
  }

  if (mediaType === 'tv' && detail.seasons?.length) {
    tabs.push({
      id: 'seasons',
      label: 'Seasons',
      content: <SeasonsPanel seasons={detail.seasons} />,
    })
  }

  return (
    <main aria-labelledby="detail-title" className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-[#080b12]">
      {backdrop ? (
        <div className="absolute inset-x-0 top-0 -z-30 hidden h-[780px] md:block">
          <Image
            src={backdrop}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[center_20%] opacity-45 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080b12]/20 via-[#080b12]/75 to-[#080b12]" />
        </div>
      ) : null}

      <div className="mx-auto grid max-w-[1480px] grid-cols-[112px_minmax(0,1fr)] items-start gap-x-4 gap-y-6 px-4 py-8 sm:grid-cols-[150px_minmax(0,1fr)] sm:px-6 md:py-12 lg:grid-cols-[minmax(280px,390px)_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-8 lg:px-10">
        <div className="relative aspect-2/3 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-[0_24px_70px_rgba(0,0,0,0.4)] lg:row-span-3">
          <Image
            src={getPosterUrl(detail.poster_path)}
            alt={`${title} poster`}
            fill
            preload
            sizes="(max-width: 640px) 150px, (max-width: 1024px) 24vw, 390px"
            className="object-cover object-center"
          />
        </div>

        <header className="min-w-0 pt-1 lg:pt-4">
          <div className="flex flex-wrap items-start gap-3">
            <h1 id="detail-title" className="min-w-0 text-2xl leading-[1.1] font-bold tracking-[-0.03em] text-balance text-white sm:text-4xl lg:text-6xl">
              {title}
            </h1>
            {detail.imdb_id ? (
              <Link
                href={`https://www.imdb.com/title/${detail.imdb_id}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${title} on IMDb (opens in a new tab)`}
                className="inline-flex min-h-8 shrink-0 items-center rounded-md bg-[#f5c518] px-2 font-mono text-xs font-black text-black outline-none focus-visible:ring-3 focus-visible:ring-white/60 sm:mt-1"
              >
                IMDb
              </Link>
            ) : null}
          </div>

          <ul aria-label="Title details" className="mt-4 flex flex-wrap gap-2">
            <li
              aria-label={rating.label}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/14 bg-black/35 px-3 text-xs text-slate-100 backdrop-blur-sm sm:text-sm"
            >
              {rating.value === 'NR' ? null : <StarIcon className="size-3.5 text-amber-300" />}
              {rating.value === 'NR' ? 'Not rated' : `${rating.value}/10`}
            </li>
            <li className="inline-flex min-h-8 items-center rounded-full border border-white/14 bg-black/35 px-3 text-xs text-slate-100 backdrop-blur-sm sm:text-sm">
              {getMediaYear(detail)}
            </li>
            {duration ? (
              <li className="inline-flex min-h-8 items-center rounded-full border border-white/14 bg-black/35 px-3 text-xs text-slate-100 backdrop-blur-sm sm:text-sm">
                {duration} min
              </li>
            ) : null}
            {detail.genres?.length ? (
              <li className="inline-flex min-h-8 items-center rounded-full border border-cyan-300/25 bg-cyan-300/7 px-3 text-xs text-cyan-100 sm:text-sm">
                {detail.genres.map((genre) => genre.name).join(' · ')}
              </li>
            ) : null}
          </ul>
        </header>

        <p className="col-span-2 max-w-[76ch] text-[0.95rem] leading-7 text-slate-300 lg:col-span-1 lg:col-start-2 lg:text-base lg:leading-8">
          {detail.overview || 'No overview is available for this title.'}
        </p>

        <div className="col-span-2 min-w-0 pb-16 lg:col-span-1 lg:col-start-2">
          <DetailTabs tabs={tabs} />
        </div>
      </div>
    </main>
  )
}
