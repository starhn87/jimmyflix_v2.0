import Image from 'next/image'
import { DETAIL_LAYOUT, DETAIL_TITLE_HEADER, DETAIL_TITLE } from '@/components/detail-view-styles'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { DetailTabs, type DetailTab } from '@/components/detail-tabs'
import { GalleryPanel } from '@/components/detail/gallery-panel'
import { StarIcon } from '@/components/icons'
import { RecentMediaTracker } from '@/components/recently-viewed'
import { LibraryActions } from '@/components/library-actions'
import { JsonLd } from '@/components/json-ld'
import { getBreadcrumbJsonLd, getMediaJsonLd } from '@/lib/structured-data'
import { getDictionary } from '@/lib/dictionaries'
import { getGalleryImages } from '@/lib/gallery'
import { getLocalePath, type Locale } from '@/lib/i18n'
import {
  formatRating,
  getImageUrl,
  getMediaTitle,
  getMediaYear,
  getPosterUrl,
  imageSkeletonPlaceholder,
  transparentImage,
} from '@/lib/media'
import type { MediaDetail, MediaType } from '@/types/tmdb'

interface DetailViewProps {
  detail: MediaDetail
  trailerPanel: ReactNode
  mediaType: MediaType
  creditsPanel: ReactNode
  productionPanel: ReactNode
  collectionPanel?: ReactNode
  seasonsPanel?: ReactNode
  relatedSection?: ReactNode
  locale: Locale
}

export function DetailView({
  detail,
  trailerPanel,
  mediaType,
  creditsPanel,
  productionPanel,
  collectionPanel,
  seasonsPanel,
  relatedSection,
  locale,
}: DetailViewProps) {
  const dictionary = getDictionary(locale)
  const title = getMediaTitle(detail, locale)
  const rating = formatRating(detail.vote_average, locale)
  const duration = detail.runtime || detail.episode_run_time?.find((time) => time > 0)
  const backdrop = getImageUrl(detail.backdrop_path, 'original')
  const keywords = (detail.keywords?.keywords || detail.keywords?.results || []).slice(0, 6)
  const galleryImages = getGalleryImages(detail.images?.backdrops || [])
  const tabs: DetailTab[] = [
    { id: 'trailer', label: dictionary.detail.trailer, content: trailerPanel },
  ]

  if (galleryImages.length > 0) {
    tabs.push({
      id: 'gallery',
      label: dictionary.detail.gallery,
      content: <GalleryPanel images={galleryImages} title={title} locale={locale} />,
    })
  }

  tabs.push(
    {
      id: 'credits',
      label: dictionary.detail.credits,
      content: creditsPanel,
    },
    {
      id: 'production',
      label: dictionary.detail.production,
      content: productionPanel,
    },
  )

  if (detail.belongs_to_collection && collectionPanel) {
    tabs.push({
      id: 'collection',
      label: dictionary.detail.collection,
      content: collectionPanel,
    })
  }

  if (mediaType === 'tv' && seasonsPanel) {
    tabs.push({
      id: 'seasons',
      label: dictionary.detail.seasons,
      content: seasonsPanel,
    })
  }

  return (
    <main aria-labelledby="detail-title" className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-canvas">
      <JsonLd data={getMediaJsonLd(detail, mediaType, locale)} />
      <JsonLd data={getBreadcrumbJsonLd([
        { name: 'Jimmyflix', href: getLocalePath(locale) },
        ...(mediaType === 'tv' ? [{ name: 'TV', href: getLocalePath(locale, '/tv') }] : []),
        { name: title, href: getLocalePath(locale, `/${mediaType === 'movie' ? 'movies' : 'tv'}/${detail.id}`) },
      ])} />
      <RecentMediaTracker
        locale={locale}
        item={{
          id: detail.id,
          title: detail.title,
          name: detail.name,
          poster_path: detail.poster_path,
          backdrop_path: detail.backdrop_path,
          vote_average: detail.vote_average,
          release_date: detail.release_date,
          first_air_date: detail.first_air_date,
          media_type: mediaType,
        }}
      />
      {backdrop ? (
        <div className="absolute inset-x-0 top-0 -z-30 h-px overflow-hidden bg-surface opacity-0 md:aspect-video md:h-auto md:opacity-100">
          <picture className="absolute inset-0 block">
            <source media="(max-width: 767px)" srcSet={transparentImage} />
            <Image
              src={backdrop}
              alt=""
              fill
              loading="eager"
              fetchPriority="high"
              placeholder={imageSkeletonPlaceholder}
              quality={85}
              sizes="100vw"
              className="object-cover object-center opacity-55"
            />
          </picture>
          <div className="detail-backdrop-fade absolute inset-0" />
        </div>
      ) : null}

      <div className={DETAIL_LAYOUT}>
        <div className="relative -mx-4 aspect-2/3 w-[calc(100%+2rem)] overflow-hidden border-tone/10 bg-surface shadow-media sm:mx-0 sm:w-full sm:rounded-2xl sm:border-x sm:border-t lg:row-span-3">
          <Image
            src={getPosterUrl(detail.poster_path)}
            alt={dictionary.common.posterAlt(title)}
            fill
            loading="eager"
            fetchPriority="high"
            placeholder={imageSkeletonPlaceholder}
            quality={85}
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 150px, (max-width: 1279px) 40vw, 480px"
            className="object-cover object-center"
          />
        </div>

        <header className={DETAIL_TITLE_HEADER}>
          <h1 id="detail-title" className={DETAIL_TITLE}>
            {title}
          </h1>

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
          <LibraryActions item={detail} mediaType={mediaType} locale={locale} />
        </header>

        <div className="mt-6 min-w-0 sm:col-span-2 sm:mt-0 lg:col-span-1 lg:col-start-2">
          <p className="max-w-[76ch] text-[0.95rem] leading-7 text-muted lg:text-base lg:leading-8">
            {detail.overview || dictionary.detail.noOverview}
          </p>
          {keywords.length > 0 ? (
            <section className="mt-5" aria-labelledby="detail-themes-title">
              <h2 id="detail-themes-title" className="text-xs font-bold tracking-[0.14em] text-faint uppercase">
                {dictionary.detail.themes}
              </h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <li key={keyword.id}>
                    <Link
                      href={`${getLocalePath(locale, '/search')}?q=${encodeURIComponent(keyword.name)}`}
                      prefetch={false}
                      aria-label={dictionary.detail.searchTheme(keyword.name)}
                      className="inline-flex min-h-8 items-center rounded-full border border-tone/10 bg-tone/5 px-3 text-xs text-subtle outline-none transition hover:border-accent/35 hover:bg-accent/10 hover:text-ink focus-visible:ring-3 focus-visible:ring-accent/40"
                    >
                      #{keyword.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <div className="mt-6 min-w-0 pb-16 sm:col-span-2 sm:mt-0 lg:col-span-1 lg:col-start-2">
          <DetailTabs
            tabs={tabs}
            label={dictionary.detail.tabListLabel}
            scrollBackwardLabel={dictionary.detail.scrollTabsBackward}
            scrollForwardLabel={dictionary.detail.scrollTabsForward}
          />
        </div>
      </div>
      {relatedSection ? <div className="relative z-10 pb-20">{relatedSection}</div> : null}
    </main>
  )
}
