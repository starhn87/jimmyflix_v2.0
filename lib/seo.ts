import type { Metadata } from 'next'
import { defaultLocale, getLocalePath, locales, tmdbLanguage, type Locale } from '@/lib/i18n'

export const SITE_URL = 'https://jimmyflix.vercel.app'
export const SITE_NAME = 'Jimmyflix'

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href

export const getLanguageAlternates = (path: string) => ({
  ...Object.fromEntries(locales.map((locale) => [
    tmdbLanguage[locale], absoluteUrl(getLocalePath(locale, path)),
  ])),
  'x-default': absoluteUrl(getLocalePath(defaultLocale, path)),
})

export const summarizeDescription = (description: string, limit = 170) => {
  const text = description.replace(/\s+/g, ' ').trim()
  return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text
}

interface PageMetadataOptions {
  locale: Locale
  path: string
  title: string
  description: string
  image?: string | null
  type?: 'website' | 'video.movie' | 'video.tv_show' | 'profile'
  noIndex?: boolean
}

export function createPageMetadata({
  locale, path, title, description, image, type = 'website', noIndex = false,
}: PageMetadataOptions): Metadata {
  const cleanPath = path.split(/[?#]/, 1)[0]
  const url = absoluteUrl(getLocalePath(locale, cleanPath))
  const summary = summarizeDescription(description)
  const shareTitle = `${title} | ${SITE_NAME}`
  const shareImage = image || absoluteUrl('/social-image')

  return {
    title,
    description: summary,
    alternates: noIndex ? { canonical: url } : {
      canonical: url,
      languages: getLanguageAlternates(cleanPath),
    },
    robots: noIndex ? { index: false, follow: true } : {
      index: true, follow: true, googleBot: { 'max-image-preview': 'large' },
    },
    openGraph: {
      title: shareTitle,
      description: summary,
      url,
      siteName: SITE_NAME,
      locale: tmdbLanguage[locale].replace('-', '_'),
      alternateLocale: locales.filter((value) => value !== locale)
        .map((value) => tmdbLanguage[value].replace('-', '_')),
      type,
      images: [{ url: shareImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image', title: shareTitle, description: summary, images: [shareImage],
    },
  }
}
