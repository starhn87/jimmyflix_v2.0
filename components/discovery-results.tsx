'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'
import { MediaGrid } from '@/components/media-grid'
import { RefreshIcon } from '@/components/icons'
import { useLibraryEntries } from '@/components/use-library'
import { getDiscoveryCopy } from '@/lib/discovery'
import { libraryKey } from '@/lib/library'
import type { Locale } from '@/lib/i18n'
import type { MediaItem, MediaType } from '@/types/tmdb'

const subscribeToNothing = () => () => {}

function PicksSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label} className="grid grid-cols-2 gap-x-4 gap-y-8 sm:max-w-2xl sm:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="animate-pulse motion-reduce:animate-none">
          <div className="aspect-2/3 rounded-xl bg-tone/7" />
          <div className="mt-3 h-4 w-4/5 rounded bg-tone/7" />
          <div className="mt-2 h-3 w-12 rounded bg-tone/5" />
        </div>
      ))}
    </div>
  )
}

export function DiscoveryResults({
  items,
  mediaType,
  locale,
}: {
  items: MediaItem[]
  mediaType: MediaType
  locale: Locale
}) {
  const copy = getDiscoveryCopy(locale)
  const entries = useLibraryEntries()
  const hydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false)
  const [excludeWatched, setExcludeWatched] = useState(true)
  const [offset, setOffset] = useState(0)
  const excluded = useMemo(() => new Set(entries
    .filter((entry) => entry.status === 'hidden' || (excludeWatched && entry.status === 'watched'))
    .map((entry) => libraryKey(entry.item))), [entries, excludeWatched])
  const eligible = items.filter((item) => !excluded.has(`${mediaType}-${item.id}`))
  const picks = Array.from({ length: Math.min(3, eligible.length) }, (_, index) => (
    eligible[(offset + index) % eligible.length]
  ))

  if (items.length === 0) {
    return (
      <section className="mx-auto mt-9 max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-tone/10 bg-tone/4 px-5 py-12 text-center">
          <h2 className="text-xl font-semibold text-ink">{copy.emptyTitle}</h2>
          <p className="mt-3 text-sm text-muted">{copy.emptyDescription}</p>
        </div>
      </section>
    )
  }

  return (
    <div className="mx-auto mt-10 max-w-[1600px] space-y-14 px-4 sm:px-6 lg:px-10">
      <section aria-labelledby="discovery-picks-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="discovery-picks-title" className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{copy.picksTitle}</h2>
            <p className="mt-1 text-sm text-faint">{copy.picksDescription}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-tone/10 bg-tone/4 px-3 text-sm text-subtle">
              <input
                type="checkbox"
                checked={excludeWatched}
                onChange={(event) => {
                  setExcludeWatched(event.target.checked)
                  setOffset(0)
                }}
                className="size-4 accent-[var(--accent)]"
              />
              {copy.excludeWatched}
            </label>
            <button
              type="button"
              disabled={eligible.length <= 3}
              onClick={() => setOffset((current) => eligible.length ? (current + 3) % eligible.length : 0)}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-accent/35 bg-accent/8 px-4 text-sm font-semibold text-accent-strong outline-none transition hover:bg-accent/15 focus-visible:ring-3 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RefreshIcon className="size-4" />
              {copy.reroll}
            </button>
          </div>
        </div>
        {!hydrated ? <PicksSkeleton label={copy.loadingPicks} /> : picks.length ? (
          <div className="max-w-2xl">
            <MediaGrid items={picks} mediaType={mediaType} label={copy.picksTitle} locale={locale} />
          </div>
        ) : (
          <p className="rounded-2xl border border-tone/10 bg-tone/4 p-6 text-sm text-muted">{copy.emptyDescription}</p>
        )}
      </section>

      <section aria-labelledby="discovery-results-title">
        <div className="mb-5">
          <h2 id="discovery-results-title" className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{copy.allMatches}</h2>
          <p className="mt-1 text-sm text-faint">{copy.resultCount(items.length)}</p>
        </div>
        <MediaGrid items={items} mediaType={mediaType} label={copy.allMatches} locale={locale} />
      </section>
    </div>
  )
}
