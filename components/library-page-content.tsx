'use client'

import Link from 'next/link'
import { useState, useSyncExternalStore } from 'react'
import { MediaGrid } from '@/components/media-grid'
import { useLibraryEntries } from '@/components/use-library'
import { SlidersIcon } from '@/components/icons'
import { getLocalePath, type Locale } from '@/lib/i18n'
import { getLibraryCopy, libraryStatuses, type LibraryStatus } from '@/lib/library'

const subscribeToNothing = () => () => {}

function LibraryGridSkeleton() {
  return (
    <div role="status" aria-label="Loading library" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {Array.from({ length: 7 }, (_, index) => (
        <div key={index} className="min-w-0 animate-pulse motion-reduce:animate-none">
          <div className="aspect-2/3 rounded-xl bg-tone/7" />
          <div className="mt-3 h-4 w-4/5 rounded bg-tone/7" />
          <div className="mt-2 h-3 w-12 rounded bg-tone/5" />
        </div>
      ))}
    </div>
  )
}

export function LibraryPageContent({ locale }: { locale: Locale }) {
  const entries = useLibraryEntries()
  const hydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false)
  const [status, setStatus] = useState<LibraryStatus>('watchlist')
  const copy = getLibraryCopy(locale)
  const labels: Record<LibraryStatus, string> = {
    watchlist: copy.watchlist,
    watched: copy.watched,
    hidden: copy.hidden,
  }
  const items = entries.filter((entry) => entry.status === status).map((entry) => entry.item)

  return (
    <main className="min-h-[calc(100vh-4.5rem)] pb-20">
      <header className="mx-auto max-w-[1600px] px-4 pt-10 sm:px-6 sm:pt-14 lg:px-10">
        <p className="text-xs font-bold tracking-[0.18em] text-accent-strong uppercase">Jimmyflix</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-ink sm:text-5xl">{copy.pageTitle}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">{copy.pageDescription}</p>
      </header>

      <section className="mx-auto mt-8 max-w-[1600px] px-4 sm:px-6 lg:px-10" aria-labelledby="discover-library-title">
        <div className="flex flex-col gap-5 rounded-3xl border border-accent/18 bg-gradient-to-br from-accent/14 via-tone/4 to-transparent p-5 shadow-panel sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <h2 id="discover-library-title" className="text-xl font-semibold text-ink">{copy.discoverTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{copy.discoverDescription}</p>
          </div>
          <Link
            href={getLocalePath(locale, '/discover')}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-action px-5 text-sm font-bold text-action-ink shadow-action outline-none transition hover:brightness-105 focus-visible:ring-3 focus-visible:ring-accent/50"
          >
            <SlidersIcon className="size-4" />
            {copy.discoverAction}
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-[1600px] px-4 sm:px-6 lg:px-10" aria-labelledby="library-list-title">
        <h2 id="library-list-title" className="sr-only">{copy.pageDescription}</h2>
        <div role="tablist" aria-label={copy.pageTitle} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {libraryStatuses.map((value) => {
            const count = entries.filter((entry) => entry.status === value).length
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={status === value}
                onClick={() => setStatus(value)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold outline-none transition focus-visible:ring-3 focus-visible:ring-accent/50 ${
                  status === value
                    ? 'border-accent/55 bg-accent/18 text-ink shadow-panel'
                    : 'border-tone/10 bg-tone/4 text-subtle hover:border-accent/25 hover:bg-tone/8 hover:text-ink'
                }`}
              >
                {labels[value]}
                <span className="text-xs tabular-nums text-faint">{count}</span>
              </button>
            )
          })}
        </div>

        <div role="tabpanel" className="mt-7">
          {!hydrated ? <LibraryGridSkeleton /> : items.length ? (
            <MediaGrid items={items} mediaType="movie" label={`${labels[status]} · ${copy.count(items.length)}`} locale={locale} />
          ) : (
            <div className="rounded-3xl border border-tone/10 bg-tone/4 px-5 py-12 text-center sm:px-8">
              <h3 className="text-xl font-semibold text-ink">{entries.length ? copy.emptyByStatus(labels[status]) : copy.emptyTitle}</h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">{copy.emptyDescription}</p>
              <Link href={getLocalePath(locale)} className="mt-6 inline-flex min-h-11 items-center rounded-full border border-accent/40 px-5 text-sm font-semibold text-accent-strong outline-none transition hover:bg-accent/10 focus-visible:ring-3 focus-visible:ring-accent/40">
                {copy.browseAction}
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
