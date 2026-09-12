import { getLocalePath, type Locale } from '@/lib/i18n'
import { getImageUrl, getMediaHref, getMediaTitle } from '@/lib/media'
import { absoluteUrl, SITE_NAME, SITE_URL } from '@/lib/seo'
import { getTrailer } from '@/lib/videos'
import type { MediaDetail, MediaItem, MediaType, PersonDetail } from '@/types/tmdb'

export const serializeJsonLd = (data: Record<string, unknown>) =>
  JSON.stringify(data).replace(/</g, '\\u003c')

export const websiteJsonLd = {
  '@context': 'https://schema.org', '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME,
  inLanguage: ['ko-KR', 'en-US'],
}

export function getMediaJsonLd(detail: MediaDetail, mediaType: MediaType, locale: Locale) {
  const url = absoluteUrl(getMediaHref(detail, mediaType, locale))
  const trailer = getTrailer(detail.videos?.results)
  const uploadDate = trailer?.published_at
  const hasVideoMetadata = trailer && /^[\w-]{11}$/.test(trailer.key)
    && uploadDate && Number.isFinite(Date.parse(uploadDate))

  return {
    '@context': 'https://schema.org',
    '@type': mediaType === 'movie' ? 'Movie' : 'TVSeries',
    '@id': `${url}#title`, url, name: getMediaTitle(detail, locale),
    image: getImageUrl(detail.poster_path || detail.backdrop_path, 'original') || undefined,
    description: detail.overview || undefined,
    datePublished: (mediaType === 'movie' ? detail.release_date : detail.first_air_date) || undefined,
    genre: detail.genres?.map(({ name }) => name),
    ...(mediaType === 'movie' && detail.runtime && detail.runtime > 0
      ? { duration: `PT${detail.runtime}M` } : {}),
    productionCompany: detail.production_companies?.map(({ name }) => ({ '@type': 'Organization', name })),
    // TMDB ratings are third-party ratings, not reviews collected by Jimmyflix.
    ...(hasVideoMetadata ? { trailer: {
      '@type': 'VideoObject', name: trailer.name, uploadDate,
      description: trailer.name,
      thumbnailUrl: `https://i.ytimg.com/vi/${trailer.key}/hqdefault.jpg`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${trailer.key}`,
    } } : {}),
  }
}

export function getPersonJsonLd(person: PersonDetail, locale: Locale) {
  const url = absoluteUrl(getLocalePath(locale, `/people/${person.id}`))
  return {
    '@context': 'https://schema.org', '@type': 'Person', '@id': `${url}#person`, url,
    name: person.name,
    image: getImageUrl(person.profile_path, 'original') || undefined,
    description: person.biography || undefined,
    birthDate: person.birthday || undefined,
    deathDate: person.deathday || undefined,
    birthPlace: person.place_of_birth ? { '@type': 'Place', name: person.place_of_birth } : undefined,
    alternateName: person.also_known_as?.slice(0, 6),
  }
}

export function getItemListJsonLd(items: MediaItem[], mediaType: MediaType, name: string, locale: Locale) {
  const urls = [...new Set(items.map((item) => absoluteUrl(getMediaHref(item, mediaType, locale))))]
  return {
    '@context': 'https://schema.org', '@type': 'ItemList', name,
    numberOfItems: urls.length,
    itemListElement: urls.map((url, index) => ({ '@type': 'ListItem', position: index + 1, url })),
  }
}

export interface BreadcrumbItem {
  name: string
  href: string
}

export const getBreadcrumbJsonLd = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(({ name, href }, index) => ({
    '@type': 'ListItem', position: index + 1, name, item: absoluteUrl(href),
  })),
})
