export const locales = ['en', 'ko'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'
export const localeCookieName = 'jimmyflix-locale-v1'
export const localeCookieMaxAge = 60 * 60 * 24 * 400

export const isLocale = (value: string | undefined): value is Locale =>
  locales.some((locale) => locale === value)

export const getLocalePath = (locale: Locale, href = '/') => {
  const normalized = href.startsWith('/') ? href : `/${href}`
  const withoutLocale = normalized.replace(/^\/(?:en|ko)(?=\/|$)/, '') || '/'

  return withoutLocale === '/' ? `/${locale}` : `/${locale}${withoutLocale}`
}

export const getPathLocale = (pathname: string): Locale | null => {
  const segment = pathname.split('/')[1]
  return isLocale(segment) ? segment : null
}

export const tmdbLanguage: Record<Locale, string> = {
  en: 'en-US',
  ko: 'ko-KR',
}

export interface HeaderMessages {
  home: string
  primaryNavigation: string
  movies: string
  tv: string
  trend: string
  openSearch: string
  closeSearch: string
  searchLabel: string
  searchPlaceholder: string
  searchButton: string
  searchEmptyError: string
  darkMode: string
  switchToLight: string
  switchToDark: string
  switchLanguage: string
  languageButton: string
}
