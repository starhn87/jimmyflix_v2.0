import type { TmdbImage } from '@/types/tmdb'

export type GalleryImage = Pick<TmdbImage, 'file_path' | 'width' | 'height'>

export interface GalleryMessages {
  photo: string
  photos: string
  hint: string
  open: string
  original: string
  close: string
  previous: string
  next: string
  scrollPrevious: string
  scrollNext: string
  viewAll: string
  loading: string
  error: string
}

export const GALLERY_PREVIEW_LIMIT = 12

export function getGalleryImages(images: TmdbImage[]): GalleryImage[] {
  const seen = new Set<string>()
  return images.filter((image) => {
    if (!image.file_path || seen.has(image.file_path)
      || !Number.isFinite(image.width) || !Number.isFinite(image.height)
      || image.width <= 0 || image.height <= 0) return false
    seen.add(image.file_path)
    return true
  }).map(({ file_path, width, height }) => ({ file_path, width, height }))
}

export const getGalleryIndex = (index: number, count: number) => (
  count > 0 ? ((index % count) + count) % count : 0
)
