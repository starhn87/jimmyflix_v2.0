import { MediaCard } from '@/components/media-card'
import { getMediaType } from '@/lib/media'
import type { MediaItem, MediaType } from '@/types/tmdb'
import type { Locale } from '@/lib/i18n'

interface MediaGridProps {
  items: MediaItem[]
  mediaType: MediaType
  label: string
  locale: Locale
}

export function MediaGrid({ items, mediaType, label, locale }: MediaGridProps) {
  return (
    <ul
      aria-label={label}
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
    >
      {items.map((item) => (
        <li key={`${getMediaType(item, mediaType)}-${item.id}`} className="min-w-0">
          <MediaCard item={item} mediaType={mediaType} locale={locale} imageSizes="(max-width: 639px) calc((100vw - 48px) / 2), (max-width: 767px) calc((100vw - 80px) / 3), (max-width: 1023px) calc((100vw - 96px) / 4), (max-width: 1279px) calc((100vw - 144px) / 5), (max-width: 1535px) calc((100vw - 160px) / 6), 204px" />
        </li>
      ))}
    </ul>
  )
}
