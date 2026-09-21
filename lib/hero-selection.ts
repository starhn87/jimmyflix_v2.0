import type { Locale } from '@/lib/i18n'
import type { MediaItem } from '@/types/tmdb'

const getCatalogItemTitle = (item: MediaItem) => item.title?.trim() || item.name?.trim() || ''

export const hasLocalizedHeroCopy = (item: MediaItem, locale: Locale) => {
  const title = getCatalogItemTitle(item)
  const overview = item.overview?.trim() || ''
  if (!title || !overview) return false

  const script = locale === 'ko' ? /\p{Script=Hangul}/u : /\p{Script=Latin}/u
  return script.test(title) && script.test(overview)
}

export const getLocalizedHeroCandidates = (items: MediaItem[], locale: Locale) => (
  items.filter((item) => item.backdrop_path && hasLocalizedHeroCopy(item, locale)).slice(0, 12)
)
