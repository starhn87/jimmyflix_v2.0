import { ErrorState } from '@/components/error-state'
import { MediaCard } from '@/components/media-card'
import { panelHeading, EmptyPanel } from '@/components/detail/panel-primitives'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import type { MediaItem } from '@/types/tmdb'

export function CollectionPanel({
  items,
  error,
  locale,
}: {
  items: MediaItem[]
  error: boolean
  locale: Locale
}) {
  const dictionary = getDictionary(locale)
  if (error) {
    return (
      <ErrorState
        compact
        title={dictionary.detail.collectionErrorTitle}
        message={dictionary.detail.collectionErrorMessage}
        retryLabel={dictionary.common.retry}
        retryingLabel={dictionary.common.retrying}
      />
    )
  }

  if (items.length === 0) return <EmptyPanel message={dictionary.detail.noCollection} />

  return (
    <section className="pt-7" aria-labelledby="collection-title">
      <h2 id="collection-title" className={panelHeading}>{dictionary.detail.collectionTitles}</h2>
      <ul className="mt-5 flex flex-wrap justify-center gap-4 sm:gap-5 lg:justify-start">
        {items.map((item) => (
          <li key={item.id} className="w-[47%] max-w-[180px] sm:w-[180px]">
            <MediaCard item={item} mediaType="movie" locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  )
}
