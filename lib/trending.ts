import type { MediaItem, MediaType, PersonCredit, PersonCredits, TrendingPerson, TrendingPersonWithCredits } from '@/types/tmdb'

export const TREND_RANKING_LIMIT = 20
export const TREND_PEOPLE_LIMIT = 20
export const TREND_REDISCOVERY_LIMIT = 40

// Fill in billing order and only expand further candidates when needed.
export async function loadTrendingPeople(candidates: TrendingPerson[], load: (id: number) => Promise<PersonCredits>) {
  const people: TrendingPersonWithCredits[] = []
  let requested = 0
  let failed = 0
  for (let offset = 0; offset < candidates.length && people.length < TREND_PEOPLE_LIMIT;) {
    const batch = candidates.slice(offset, offset + TREND_PEOPLE_LIMIT - people.length)
    const credits = await Promise.allSettled(batch.map(({ id }) => load(id)))
    offset += batch.length
    requested += batch.length
    credits.forEach((result, index) => {
      if (result.status === 'rejected') { failed++; return }
      const person = batch[index]
      const known_for = selectRepresentativeCredits([...result.value.cast, ...result.value.crew], person.known_for_department)
      if (known_for.length) people.push({ ...person, known_for })
    })
  }
  return { people, error: requested > 0 && failed === requested, partial: failed > 0 }
}

// This is a selection from the actual trend response, not a historical ranking.
export function selectRediscoveredTitles(movies: MediaItem[], shows: MediaItem[], now = new Date()) {
  const cutoff = new Date(Date.UTC(now.getUTCFullYear() - 5, now.getUTCMonth(), now.getUTCDate()))
    .toISOString().slice(0, 10)
  const olderTitles = (items: MediaItem[], type: MediaType) => selectRankedTitles(items, type, items.length)
    .filter((item) => {
      const date = type === 'movie' ? item.release_date : item.first_air_date
      return date && /^\d{4}-\d{2}-\d{2}$/.test(date)
        && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date && date <= cutoff
    }).map((item) => ({ ...item, media_type: type }))
  const films = olderTitles(movies, 'movie')
  const series = olderTitles(shows, 'tv')
  // Alternate categories, preserving each TMDB list's order without comparing their scores.
  return Array.from({ length: Math.max(films.length, series.length) }, (_, index) =>
    [films[index], series[index]].filter((item): item is MediaItem & { media_type: MediaType } => Boolean(item)),
  ).flat().slice(0, TREND_REDISCOVERY_LIMIT)
}

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
