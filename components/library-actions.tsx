'use client'

import { BookmarkIcon, CheckIcon, EyeOffIcon } from '@/components/icons'
import { useLibraryEntries, setLibraryStatus } from '@/components/use-library'
import { getLibraryCopy, libraryKey, toLibraryMediaItem, type LibraryStatus } from '@/lib/library'
import { getMediaTitle } from '@/lib/media'
import type { Locale } from '@/lib/i18n'
import type { MediaItem, MediaType } from '@/types/tmdb'

interface LibraryActionProps {
  item: MediaItem
  mediaType: MediaType
  locale: Locale
}

const statusIcons = {
  watchlist: BookmarkIcon,
  watched: CheckIcon,
  hidden: EyeOffIcon,
}

export function LibraryQuickAction({ item, mediaType, locale }: LibraryActionProps) {
  const entries = useLibraryEntries()
  const stored = toLibraryMediaItem(item, mediaType)
  const entry = entries.find((candidate) => libraryKey(candidate.item) === libraryKey(stored))
  const selected = entry?.status === 'watchlist'
  const title = getMediaTitle(item, locale)
  const copy = getLibraryCopy(locale)

  return (
    <button
      type="button"
      aria-label={selected ? copy.removeWatchlist(title) : copy.addWatchlist(title)}
      aria-pressed={selected}
      title={selected ? copy.removeWatchlist(title) : copy.addWatchlist(title)}
      onClick={() => setLibraryStatus(stored, selected ? null : 'watchlist')}
      className={`absolute top-2 right-2 z-10 grid size-10 place-items-center rounded-full border shadow-lg backdrop-blur-md transition-all focus-visible:ring-3 focus-visible:ring-accent/60 ${
        selected
          ? 'border-accent/70 bg-action text-action-ink opacity-100'
          : 'border-white/18 bg-black/65 text-white sm:opacity-0 sm:group-hover/library:opacity-100 sm:focus-visible:opacity-100'
      }`}
    >
      <BookmarkIcon className={`size-[1.125rem] ${selected ? 'fill-current' : ''}`} />
    </button>
  )
}

export function LibraryActions({ item, mediaType, locale }: LibraryActionProps) {
  const entries = useLibraryEntries()
  const stored = toLibraryMediaItem(item, mediaType)
  const current = entries.find((candidate) => libraryKey(candidate.item) === libraryKey(stored))?.status
  const title = getMediaTitle(item, locale)
  const copy = getLibraryCopy(locale)
  const labels: Record<LibraryStatus, string> = {
    watchlist: copy.watchlist,
    watched: copy.watched,
    hidden: copy.hidden,
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2" aria-label={locale === 'ko' ? '나의 콘텐츠 상태' : 'My title status'}>
      {(['watchlist', 'watched', 'hidden'] as const).map((status) => {
        const selected = current === status
        const Icon = statusIcons[status]
        return (
          <button
            key={status}
            type="button"
            aria-pressed={selected}
            aria-label={selected ? copy.clearStatus(title, labels[status]) : copy.setStatus(title, labels[status])}
            onClick={() => setLibraryStatus(stored, selected ? null : status)}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold outline-none transition focus-visible:ring-3 focus-visible:ring-accent/50 ${
              selected
                ? 'border-accent/60 bg-accent/18 text-ink shadow-panel'
                : 'border-tone/12 bg-tone/4 text-subtle hover:border-accent/30 hover:bg-tone/8 hover:text-ink'
            }`}
          >
            <Icon className={`size-4 ${status === 'watchlist' && selected ? 'fill-current' : ''}`} />
            {labels[status]}
          </button>
        )
      })}
    </div>
  )
}
