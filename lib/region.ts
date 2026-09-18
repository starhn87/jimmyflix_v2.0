import type { Locale } from '@/lib/i18n'

export const regions = ['KR', 'US'] as const

export type Region = (typeof regions)[number]

export const regionCookieName = 'jimmyflix-region-v1'
export const regionCookieMaxAge = 60 * 60 * 24 * 400

export const isRegion = (value: string | null | undefined): value is Region =>
  regions.some((region) => region === value)

export const getDefaultRegion = (locale: Locale): Region => locale === 'ko' ? 'KR' : 'US'

export const getRegionTimeZone = (region: Region) => region === 'KR'
  ? 'Asia/Seoul'
  : 'America/New_York'
