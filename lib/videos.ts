import type { Video } from '@/types/tmdb'

export const getTrailer = (videos: Video[] | undefined) =>
  videos?.find((video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official)
  || videos?.find((video) => video.site === 'YouTube' && video.type === 'Trailer')
  || videos?.find((video) => video.site === 'YouTube' && video.type === 'Teaser' && video.official)
  || videos?.find((video) => video.site === 'YouTube' && video.type === 'Teaser')
