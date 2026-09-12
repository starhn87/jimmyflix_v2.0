'use client'

import { useEffect, useState } from 'react'
import { MediaCard } from '@/components/media-card'
import { MediaRailControls } from '@/components/media-rail-controls'
import {
  MEDIA_RAIL_HEADER_CLASS_NAME,
  MEDIA_RAIL_ITEM_CLASS_NAME,
  MEDIA_RAIL_LIST_CLASS_NAME,
} from '@/components/media-rail-styles'
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
      <div className={MEDIA_RAIL_HEADER_CLASS_NAME}>
        <h2 id="recently-viewed-title" className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-faint">{description}</p>
      </div>
      <div className="relative">
        <ul
          id="recently-viewed-rail"
          aria-label={title}
          className={MEDIA_RAIL_LIST_CLASS_NAME}
        >
          {items.map((item) => (
            <li
              key={`${item.media_type}-${item.id}`}
              className={MEDIA_RAIL_ITEM_CLASS_NAME}
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
