import 'server-only'

import { AsyncLocalStorage } from 'node:async_hooks'
import { cache } from 'react'
import { tmdbLanguage, type Locale } from '@/lib/i18n'

export const CACHE_SECONDS = { catalog: 1800, search: 300, trending: 600, reference: 86400 } as const
export const REQUEST_TIMEOUT_MS = { default: 8000, supplemental: 4000, search: 5000 } as const
export const sitemapFetchScope = new AsyncLocalStorage<boolean>()
export type QueryValue = string | number | boolean | undefined
export interface TmdbFetchOptions { revalidate?: number; timeoutMs?: number; locale?: Locale }

export class TmdbNotFoundError extends Error {
  constructor() { super('The requested title was not found.'); this.name = 'TmdbNotFoundError' }
}

export class TmdbRequestError extends Error {
  readonly reason: 'timeout' | 'network' | 'http' | 'payload'
  readonly status?: number
  constructor(reason: TmdbRequestError['reason'], status?: number) {
    super(`TMDB request failed (${reason}${status ? ` ${status}` : ''}).`)
    this.name = 'TmdbRequestError'
    this.reason = reason
    this.status = status
  }
}

// Primitive arguments retain per-render deduplication when AbortSignal opts fetch out
// of automatic request memoization. Fresh sitemap requests have a separate cache key.
const request = cache(async (path: string, query: string, locale: Locale, revalidate: number, timeoutMs: number, fresh: boolean) => {
  const key = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_API_KEY
  if (!key) throw new Error('TMDB_API_KEY is not configured.')
  const url = new URL(path.replace(/^\//, ''), 'https://api.themoviedb.org/3/')
  url.search = query
  url.searchParams.set('api_key', key)
  url.searchParams.set('language', tmdbLanguage[locale])
  const signal = AbortSignal.timeout(timeoutMs)
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      ...(fresh ? { cache: 'no-store' as const } : { next: { revalidate } }),
      signal,
    })
    if (response.status === 404) throw new TmdbNotFoundError()
    if (!response.ok) throw new TmdbRequestError('http', response.status)
    return await response.json() as unknown
  } catch (error) {
    if (error instanceof TmdbNotFoundError) throw error
    const failure = error instanceof TmdbRequestError ? error : new TmdbRequestError(
      signal.aborted ? 'timeout' : error instanceof SyntaxError ? 'payload' : 'network',
    )
    // Never log URLs, query values, credentials, response bodies or raw upstream errors.
    console.warn('TMDB request failed', { endpoint: url.pathname, reason: failure.reason, status: failure.status })
    throw failure
  }
})

export async function tmdbFetch<T>(path: string, query: Record<string, QueryValue> = {}, {
  revalidate = CACHE_SECONDS.catalog, timeoutMs = REQUEST_TIMEOUT_MS.default, locale = 'en',
}: TmdbFetchOptions = {}): Promise<T> {
  const params = new URLSearchParams()
  Object.entries(query).sort(([a], [b]) => a.localeCompare(b)).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value))
  })
  return await request(path, params.toString(), locale, revalidate, timeoutMs, Boolean(sitemapFetchScope.getStore())) as T
}
