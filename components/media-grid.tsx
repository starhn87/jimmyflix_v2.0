import { MediaCard } from '@/components/media-card'
import type { MediaItem, MediaType } from '@/types/tmdb'

interface MediaGridProps {
  items: MediaItem[]
  mediaType: MediaType
  label: string
}

export function MediaGrid({ items, mediaType, label }: MediaGridProps) {
  return (
    <ul
      aria-label={label}
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
    >
      {items.map((item) => (
        <li key={item.id} className="min-w-0">
          <MediaCard item={item} mediaType={mediaType} />
        </li>
      ))}
    </ul>
  )
}
