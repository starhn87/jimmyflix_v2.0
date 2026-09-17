import { Gallery } from '@/components/gallery'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import type { GalleryImage } from '@/lib/gallery'

export function GalleryPanel({
  images,
  title,
  locale,
}: {
  images: GalleryImage[]
  title: string
  locale: Locale
}) {
  const dictionary = getDictionary(locale)

  return (
    <Gallery images={images} title={title} heading={dictionary.detail.galleryHeading} messages={dictionary.detail.galleryUi} />
  )
}
