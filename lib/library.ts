import type { Locale } from '@/lib/i18n'
import type { MediaItem, MediaType } from '@/types/tmdb'

export const LIBRARY_STORAGE_KEY = 'jimmyflix-library-v1'
export const LIBRARY_LIMIT = 300

export const libraryStatuses = ['watchlist', 'watched', 'hidden'] as const
export type LibraryStatus = (typeof libraryStatuses)[number]

export interface LibraryMediaItem extends Pick<
  MediaItem,
  | 'id'
  | 'title'
  | 'name'
  | 'poster_path'
  | 'backdrop_path'
  | 'vote_average'
  | 'release_date'
  | 'first_air_date'
  | 'genre_ids'
> {
  media_type: MediaType
}

export interface LibraryEntry {
  item: LibraryMediaItem
  status: LibraryStatus
  updatedAt: string
}

export const libraryKey = (item: Pick<LibraryMediaItem, 'id' | 'media_type'>) =>
  `${item.media_type}-${item.id}`

export function toLibraryMediaItem(item: MediaItem, fallback: MediaType): LibraryMediaItem {
  return {
    id: item.id,
    title: item.title,
    name: item.name,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    vote_average: item.vote_average,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
    genre_ids: item.genre_ids,
    media_type: item.media_type === 'tv' || item.media_type === 'movie' ? item.media_type : fallback,
  }
}

const isLibraryStatus = (value: unknown): value is LibraryStatus =>
  typeof value === 'string' && libraryStatuses.some((status) => status === value)

const isLibraryMediaItem = (value: unknown): value is LibraryMediaItem => {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<LibraryMediaItem>
  return Number.isSafeInteger(item.id)
    && Number(item.id) > 0
    && (item.media_type === 'movie' || item.media_type === 'tv')
    && (typeof item.title === 'string' || typeof item.name === 'string')
    && (typeof item.poster_path === 'string' || item.poster_path === null)
    && Number.isFinite(item.vote_average)
}

export function parseLibraryEntries(value: unknown): LibraryEntry[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  return value.filter((entry): entry is LibraryEntry => {
    if (!entry || typeof entry !== 'object') return false
    const candidate = entry as Partial<LibraryEntry>
    if (!isLibraryMediaItem(candidate.item) || !isLibraryStatus(candidate.status)) return false
    if (typeof candidate.updatedAt !== 'string' || Number.isNaN(Date.parse(candidate.updatedAt))) return false
    const key = libraryKey(candidate.item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, LIBRARY_LIMIT)
}

export function updateLibraryEntries(
  entries: readonly LibraryEntry[],
  item: LibraryMediaItem,
  status: LibraryStatus | null,
  updatedAt = new Date().toISOString(),
) {
  const key = libraryKey(item)
  const rest = entries.filter((entry) => libraryKey(entry.item) !== key)
  return status ? [{ item, status, updatedAt }, ...rest].slice(0, LIBRARY_LIMIT) : rest
}

export const getLibraryCopy = (locale: Locale) => locale === 'ko' ? {
  watchlist: '찜',
  watched: '봤어요',
  hidden: '관심 없음',
  addWatchlist: (title: string) => `${title} 찜하기`,
  removeWatchlist: (title: string) => `${title} 찜 취소`,
  setStatus: (title: string, status: string) => `${title}: ${status}`,
  clearStatus: (title: string, status: string) => `${title}: ${status} 취소`,
  pageTitle: '나의 Jimmyflix',
  pageDescription: '찜한 작품과 시청 기록을 한곳에서 관리하세요.',
  discoverTitle: '오늘 볼 작품이 고민된다면',
  discoverDescription: 'OTT, 장르, 러닝타임을 조합해 후보를 좁혀보세요.',
  discoverAction: '조건으로 찾아보기',
  emptyTitle: '아직 저장한 작품이 없습니다',
  emptyByStatus: (status: string) => `${status} 작품이 없습니다.`,
  emptyDescription: '카드의 북마크 버튼이나 상세 화면의 상태 버튼으로 작품을 모아보세요.',
  browseAction: '영화 둘러보기',
  count: (count: number) => `${count}개`,
} : {
  watchlist: 'Watchlist',
  watched: 'Watched',
  hidden: 'Not interested',
  addWatchlist: (title: string) => `Add ${title} to watchlist`,
  removeWatchlist: (title: string) => `Remove ${title} from watchlist`,
  setStatus: (title: string, status: string) => `Mark ${title} as ${status}`,
  clearStatus: (title: string, status: string) => `Clear ${status} for ${title}`,
  pageTitle: 'My Jimmyflix',
  pageDescription: 'Keep your watchlist and viewing history together.',
  discoverTitle: 'Need help choosing what to watch?',
  discoverDescription: 'Narrow the options by streaming service, genre, and runtime.',
  discoverAction: 'Find by preferences',
  emptyTitle: 'Your library is empty',
  emptyByStatus: (status: string) => `No titles marked ${status.toLowerCase()}.`,
  emptyDescription: 'Use the bookmark on a card or the status buttons on a title page to build your library.',
  browseAction: 'Browse movies',
  count: (count: number) => `${count} titles`,
}
