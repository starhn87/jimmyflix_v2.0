import type { MediaItem, MediaType, PersonCredit } from '@/types/tmdb'

export const TREND_RANKING_LIMIT = 10

// Preserve TMDB's order: its daily/weekly trend order is not popularity order.
export function selectRankedTitles(items: MediaItem[], mediaType: MediaType, limit = TREND_RANKING_LIMIT) {
  const seen = new Set<number>()
  return items.filter((item) => {
    if (item.adult || !Number.isInteger(item.id) || item.id <= 0 || seen.has(item.id)) return false
    if (item.media_type && item.media_type !== mediaType) return false
    seen.add(item.id)
    return true
  }).slice(0, limit)
}

export function selectRepresentativeCredits(credits: PersonCredit[], department?: string) {
  const seen = new Set<string>()
  return credits
    .filter((item) => {
      if (item.adult || !item.poster_path || (item.vote_count || 0) < 100) return false
      if (item.media_type !== 'movie' && item.media_type !== 'tv') return false
      if (item.genre_ids?.some((id) => id === 10767 || id === 10763)) return false
      if (/^(self|himself|herself|themselves)\b/i.test(item.character?.trim() || '')) return false
      if (department === 'Acting' && item.job) return false
      if (department === 'Directing' && item.job !== 'Director') return false
      return true
    })
    .toSorted((a, b) => (b.vote_count || 0) - (a.vote_count || 0) || (b.popularity || 0) - (a.popularity || 0))
    .filter((item) => {
      const key = `${item.media_type}-${item.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).slice(0, 2)
}
