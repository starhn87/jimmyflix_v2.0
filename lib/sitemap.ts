import type { MetadataRoute } from 'next'
import { getLocalePath, locales, type Locale } from '@/lib/i18n'
import { absoluteUrl, getLanguageAlternates } from '@/lib/seo'

export interface SitemapPath {
  path: string
  images?: Partial<Record<Locale, string>>
}

export function createSitemap(paths: SitemapPath[]): MetadataRoute.Sitemap {
  const unique = new Map<string, SitemapPath>()
  for (const entry of paths) {
    const previous = unique.get(entry.path)
    unique.set(entry.path, { path: entry.path, images: { ...previous?.images, ...entry.images } })
  }

  return [...unique.values()].flatMap(({ path, images }) => locales.map((locale) => ({
    url: absoluteUrl(getLocalePath(locale, path)),
    alternates: { languages: getLanguageAlternates(path) },
    ...(images?.[locale] ? { images: [images[locale]] } : {}),
    // A release date is not a page modification date; omit lastmod without a reliable source.
  })))
}
