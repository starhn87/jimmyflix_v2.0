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
import { ProgressiveBackdrop } from '@/components/progressive-backdrop'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import {
  formatRating,
  getImageUrl,
  getMediaTitle,
  getMediaYear,
  getPosterUrl,
  imageSkeletonPlaceholder,
} from '@/lib/media'
import type { MediaDetail, MediaType } from '@/types/tmdb'

interface DetailViewProps {
  detail: MediaDetail
  mediaType: MediaType
  creditsPanel: ReactNode
  collectionPanel?: ReactNode
  locale: Locale
}

export function DetailView({
  detail,
  mediaType,
  creditsPanel,
  collectionPanel,
  locale,
}: DetailViewProps) {
  const dictionary = getDictionary(locale)
  const title = getMediaTitle(detail, locale)
  const rating = formatRating(detail.vote_average, locale)
  const duration = detail.runtime || detail.episode_run_time?.find((time) => time > 0)
  const backdrop = getImageUrl(detail.backdrop_path, 'original')
  const tabs: DetailTab[] = [
    { id: 'trailer', label: dictionary.detail.trailer, content: <TrailerPanel detail={detail} locale={locale} /> },
    {
      id: 'credits',
      label: dictionary.detail.credits,
      content: creditsPanel,
    },
    {
      id: 'production',
      label: dictionary.detail.production,
      content: <ProductionPanel detail={detail} locale={locale} />,
    },
  ]

  if (detail.belongs_to_collection && collectionPanel) {
    tabs.push({
      id: 'collection',
      label: dictionary.detail.collection,
      content: collectionPanel,
    })
  }

  if (mediaType === 'tv' && detail.seasons?.length) {
    tabs.push({
      id: 'seasons',
      label: dictionary.detail.seasons,
      content: <SeasonsPanel seasons={detail.seasons} locale={locale} />,
    })
  }

  return (
    <main aria-labelledby="detail-title" className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-canvas">
      {backdrop ? (
        <div className="absolute inset-x-0 top-0 -z-30 hidden aspect-video overflow-hidden md:block">
          <div className="absolute inset-0 opacity-55">
            <ProgressiveBackdrop
              path={detail.backdrop_path!}
              sourceSize="w1280"
              className="object-cover object-center"
            />
          </div>
          <div className="detail-backdrop-fade absolute inset-0" />
        </div>
      ) : null}

      <div className="mx-auto grid max-w-[1480px] grid-cols-[112px_minmax(0,1fr)] items-start gap-x-4 gap-y-6 px-4 py-8 sm:grid-cols-[150px_minmax(0,1fr)] sm:px-6 md:py-12 lg:grid-cols-[minmax(340px,min(40vw,480px))_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-8 lg:px-10">
        <div className="relative aspect-2/3 w-full overflow-hidden rounded-2xl border border-tone/10 bg-surface shadow-media lg:row-span-3">
          <Image
            src={getImageUrl(detail.poster_path, 'w780') || getPosterUrl(detail.poster_path)}
            alt={dictionary.common.posterAlt(title)}
            fill
            loading="eager"
            fetchPriority="high"
            placeholder={imageSkeletonPlaceholder}
            unoptimized
            sizes="(max-width: 639px) 112px, (max-width: 1023px) 150px, (max-width: 1279px) 40vw, 480px"
            className="object-cover object-center"
          />
        </div>

        <header className="min-w-0 pt-1 lg:pt-4">
          <div className="flex flex-wrap items-start gap-3">
            <h1 id="detail-title" className="min-w-0 text-2xl leading-[1.1] font-bold tracking-[-0.03em] text-balance text-ink sm:text-4xl lg:text-6xl">
              {title}
            </h1>
            {detail.imdb_id ? (
              <Link
                href={`https://www.imdb.com/title/${detail.imdb_id}`}
                target="_blank"
                rel="noreferrer"
                aria-label={dictionary.detail.imdbLabel(title)}
                className="inline-flex min-h-8 shrink-0 items-center rounded-md bg-[#f5c518] px-2 font-mono text-xs font-black text-black outline-none focus-visible:ring-3 focus-visible:ring-white/60 sm:mt-1"
              >
                IMDb
              </Link>
            ) : null}
          </div>

          <ul aria-label={dictionary.detail.titleDetails} className="mt-4 flex flex-wrap gap-2">
            {rating ? (
              <li
                aria-label={rating.label}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-tone/14 bg-overlay px-3 text-xs text-ink backdrop-blur-sm sm:text-sm"
              >
                <StarIcon className="size-3.5 text-warning" />
                {rating.value}/10
              </li>
            ) : null}
            <li className="inline-flex min-h-8 items-center rounded-full border border-tone/14 bg-overlay px-3 text-xs text-ink backdrop-blur-sm sm:text-sm">
              {getMediaYear(detail, locale)}
            </li>
            {duration ? (
              <li className="inline-flex min-h-8 items-center rounded-full border border-tone/14 bg-overlay px-3 text-xs text-ink backdrop-blur-sm sm:text-sm">
                {dictionary.detail.minutes(duration)}
              </li>
            ) : null}
            {detail.genres?.length ? (
              <li className="inline-flex min-h-8 items-center rounded-full border border-accent/25 bg-accent/7 px-3 text-xs text-accent-strong sm:text-sm">
                {detail.genres.map((genre) => genre.name).join(' · ')}
              </li>
            ) : null}
          </ul>
        </header>

        <p className="col-span-2 max-w-[76ch] text-[0.95rem] leading-7 text-muted lg:col-span-1 lg:col-start-2 lg:text-base lg:leading-8">
          {detail.overview || dictionary.detail.noOverview}
        </p>

        <div className="col-span-2 min-w-0 pb-16 lg:col-span-1 lg:col-start-2">
          <DetailTabs tabs={tabs} label={dictionary.detail.tabListLabel} />
        </div>
      </div>
    </main>
  )
}
