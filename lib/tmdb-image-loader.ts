import type { ImageLoader } from 'next/image'

export type TmdbImageKind = 'backdrop' | 'poster' | 'profile' | 'still'

const TMDB_IMAGE_ORIGIN = 'https://image.tmdb.org'
const TMDB_SIZE_SEGMENT = /\/t\/p\/(?:w\d+|h\d+|original)\//

const selectTmdbSize = (kind: TmdbImageKind, width: number) => {
  switch (kind) {
    case 'backdrop':
      if (width <= 300) return 'w300'
      if (width <= 780) return 'w780'
      if (width <= 1280) return 'w1280'
      return 'original'
    case 'poster':
      if (width <= 92) return 'w92'
      if (width <= 154) return 'w154'
      if (width <= 185) return 'w185'
      if (width <= 342) return 'w342'
      if (width <= 500) return 'w500'
      if (width <= 780) return 'w780'
      return 'original'
    case 'profile':
      if (width <= 45) return 'w45'
      if (width <= 185) return 'w185'
      if (width <= 421) return 'h632'
      return 'original'
    case 'still':
      if (width <= 92) return 'w92'
      if (width <= 185) return 'w185'
      if (width <= 300) return 'w300'
      return 'original'
  }
}

export const getResponsiveTmdbImageUrl = (
  src: string,
  width: number,
  kind: TmdbImageKind,
) => {
  if (!src.startsWith(`${TMDB_IMAGE_ORIGIN}/t/p/`) || !TMDB_SIZE_SEGMENT.test(src)) {
    return src
  }

  return src.replace(TMDB_SIZE_SEGMENT, `/t/p/${selectTmdbSize(kind, width)}/`)
}

const createTmdbLoader = (kind: TmdbImageKind): ImageLoader => ({ src, width }) => (
  getResponsiveTmdbImageUrl(src, width, kind)
)

export const tmdbImageLoaders: Record<TmdbImageKind, ImageLoader> = {
  backdrop: createTmdbLoader('backdrop'),
  poster: createTmdbLoader('poster'),
  profile: createTmdbLoader('profile'),
  still: createTmdbLoader('still'),
}
