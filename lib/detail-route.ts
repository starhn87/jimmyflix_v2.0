import 'server-only'

import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n'
import { getMovieDetail, getPersonDetail, getTvDetail, TmdbNotFoundError } from '@/lib/tmdb'
import type { MediaType } from '@/types/tmdb'

export function parseDetailRoute(locale: string, rawId: string) {
  const id = Number(rawId)
  if (!isLocale(locale) || !/^[1-9]\d*$/.test(rawId) || !Number.isSafeInteger(id)) notFound()
  return { locale, id }
}

export async function getMediaDetailRoute(rawLocale: string, rawId: string, mediaType: MediaType) {
  const { locale, id } = parseDetailRoute(rawLocale, rawId)
  try {
    const detail = await (mediaType === 'movie' ? getMovieDetail(id, locale) : getTvDetail(id, locale))
    return { locale, id, detail }
  } catch (error) {
    if (error instanceof TmdbNotFoundError) notFound()
    throw error
  }
}

export async function getPersonDetailRoute(rawLocale: string, rawId: string) {
  const { locale, id } = parseDetailRoute(rawLocale, rawId)
  try {
    const person = await getPersonDetail(id, locale)
    return { locale, id, person }
  } catch (error) {
    if (error instanceof TmdbNotFoundError) notFound()
    throw error
  }
}
