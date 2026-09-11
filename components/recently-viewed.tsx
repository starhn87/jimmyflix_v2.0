'use client'

import { useEffect, useState } from 'react'
import { MediaCard } from '@/components/media-card'
import { MediaRailControls } from '@/components/media-rail-controls'
import type { Locale } from '@/lib/i18n'
import type { MediaItem, MediaType } from '@/types/tmdb'

const storageKey = 'jimmyflix-recently-viewed-v1'
const updateEvent = 'jimmyflix:recently-viewed'
const maximumItems = 16

export type RecentMediaItem = Pick<
  MediaItem,
  | 'id'
  | 'title'
  | 'name'
  | 'poster_path'
  | 'backdrop_path'
  | 'vote_average'
  | 'release_date'
  | 'first_air_date'
> & { media_type: MediaType }

const isRecentMediaItem = (value: unknown): value is RecentMediaItem => {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<RecentMediaItem>
  return (
    Number.isSafeInteger(item.id) &&
    (item.media_type === 'movie' || item.media_type === 'tv') &&
    (typeof item.title === 'string' || typeof item.name === 'string') &&
    (typeof item.poster_path === 'string' || item.poster_path === null) &&
    typeof item.vote_average === 'number'
  )
}

const readItems = (locale: Locale) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(`${storageKey}-${locale}`) || '[]') as unknown
    return Array.isArray(value) ? value.filter(isRecentMediaItem).slice(0, maximumItems) : []
  } catch {
    return []
  }
}

export function RecentMediaTracker({ item, locale }: { item: RecentMediaItem; locale: Locale }) {
  useEffect(() => {
    const next = [
      item,
      ...readItems(locale).filter((entry) => (
        entry.id !== item.id || entry.media_type !== item.media_type
      )),
    ].slice(0, maximumItems)

    try {
      window.localStorage.setItem(`${storageKey}-${locale}`, JSON.stringify(next))
      window.dispatchEvent(new Event(updateEvent))
    } catch {
      // Browsing still works when storage is unavailable.
    }
  }, [item, locale])

  return null
}

export function RecentlyViewedSection({
  locale,
  title,
  description,
  backwardLabel,
  forwardLabel,
}: {
  locale: Locale
  title: string
  description: string
  backwardLabel: string
  forwardLabel: string
}) {
  const [items, setItems] = useState<RecentMediaItem[]>([])

  useEffect(() => {
    const update = () => setItems(readItems(locale))
    update()
    window.addEventListener('storage', update)
    window.addEventListener(updateEvent, update)
    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener(updateEvent, update)
    }
  }, [locale])

  if (items.length === 0) return null

  return (
    <section aria-labelledby="recently-viewed-title" className="render-later">
      <div className="mb-5 px-4 sm:px-8 lg:px-12">
        <h2 id="recently-viewed-title" className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-faint">{description}</p>
      </div>
      <div className="relative">
        <ul
          id="recently-viewed-rail"
          aria-label={title}
          className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-7 sm:scroll-px-8 sm:gap-4 sm:px-8 lg:scroll-px-12 lg:gap-5 lg:px-12"
        >
          {items.map((item) => (
            <li
              key={`${item.media_type}-${item.id}`}
              className="w-[42vw] min-w-[136px] max-w-[190px] shrink-0 snap-start sm:w-[27vw] md:w-[20vw] lg:w-[15vw] xl:w-[13vw]"
            >
              <MediaCard item={item} mediaType={item.media_type} locale={locale} />
            </li>
          ))}
        </ul>
        <MediaRailControls
          railId="recently-viewed-rail"
          backwardLabel={backwardLabel}
          forwardLabel={forwardLabel}
        />
      </div>
    </section>
  )
}
