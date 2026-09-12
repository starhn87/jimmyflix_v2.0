import type { SitemapPath } from '@/lib/sitemap'

export interface SitemapRecord extends SitemapPath {
  firstSeenAt: string
  lastSeenAt: string
  lastCheckedAt?: string
  missingSince?: string
  excludedAt?: string
}

export interface SitemapRegistry {
  version: 1
  collectedAt: string | null
  entries: SitemapRecord[]
}

export type SitemapCheck = { path: string; status: 'available' | 'missing' | 'unknown'; checkedAt: string }
export const emptySitemapRegistry = (): SitemapRegistry => ({ version: 1, collectedAt: null, entries: [] })
export const isSitemapDetailPath = (path: string) => /^\/(movies|tv|people)\/[1-9]\d*$/.test(path)

export function parseSitemapRegistry(value: unknown): SitemapRegistry {
  if (!value || typeof value !== 'object') throw new Error('Invalid sitemap registry')
  const data = value as SitemapRegistry
  const timestamp = (date: unknown) => typeof date === 'string' && Number.isFinite(Date.parse(date))
  if (data.version !== 1 || !Array.isArray(data.entries) || (data.collectedAt !== null && !timestamp(data.collectedAt))) {
    throw new Error('Invalid sitemap registry version or timestamp')
  }
  const seen = new Set<string>()
  for (const entry of data.entries) {
    if (!entry || !isSitemapDetailPath(entry.path) || seen.has(entry.path)
      || !timestamp(entry.firstSeenAt) || !timestamp(entry.lastSeenAt)
      || [entry.lastCheckedAt, entry.missingSince, entry.excludedAt].some((date) => date !== undefined && !timestamp(date))) {
      throw new Error('Invalid sitemap registry entry')
    }
    if (entry.images && (typeof entry.images !== 'object' || Object.entries(entry.images).some(([locale, url]) =>
      !['ko', 'en'].includes(locale) || typeof url !== 'string' || !/^https:\/\/image\.tmdb\.org\/t\/p\//.test(url)))) {
      throw new Error('Invalid sitemap registry image')
    }
    seen.add(entry.path)
  }
  return data
}

export function mergeSitemapRegistry(
  previous: SitemapRegistry, discoveries: SitemapPath[], checks: SitemapCheck[], collectedAt: string,
): SitemapRegistry {
  const records = new Map(previous.entries.map((entry) => [entry.path, { ...entry, images: { ...entry.images } }]))
  // Update in place and append new records so page boundaries remain stable.
  for (const discovery of discoveries) {
    if (!isSitemapDetailPath(discovery.path)) continue
    const existing = records.get(discovery.path)
    const images = Object.fromEntries(Object.entries(discovery.images || {}).filter(([, url]) => Boolean(url)))
    records.set(discovery.path, {
      ...existing, path: discovery.path, images: { ...existing?.images, ...images },
      firstSeenAt: existing?.firstSeenAt || collectedAt, lastSeenAt: collectedAt,
      missingSince: undefined, excludedAt: undefined,
    })
  }
  const found = new Set(discoveries.map(({ path }) => path))
  for (const check of checks) {
    const entry = records.get(check.path)
    if (!entry || found.has(check.path) || (entry.lastCheckedAt && entry.lastCheckedAt >= check.checkedAt)) continue
    entry.lastCheckedAt = check.checkedAt
    if (check.status === 'available') {
      entry.missingSince = undefined
      entry.excludedAt = undefined
    } else if (check.status === 'missing') {
      if (entry.missingSince && Date.parse(check.checkedAt) - Date.parse(entry.missingSince) >= 86_400_000) {
        entry.excludedAt ||= check.checkedAt
      }
      entry.missingSince ||= check.checkedAt
    }
    // Timeouts, 429 and 5xx never remove a URL or erase previous evidence.
  }
  return { version: 1, collectedAt, entries: [...records.values()] }
}

export function selectSitemapChecks(registry: SitemapRegistry, discoveries: SitemapPath[], now: string, limit = 50) {
  const found = new Set(discoveries.map(({ path }) => path))
  return registry.entries.filter((entry) => !found.has(entry.path)
    && Date.parse(now) - Date.parse(entry.lastCheckedAt || entry.lastSeenAt) >= (entry.missingSince ? 1 : 7) * 86_400_000)
    .toSorted((a, b) => (a.lastCheckedAt || a.lastSeenAt).localeCompare(b.lastCheckedAt || b.lastSeenAt))
    .slice(0, limit)
}

// Two locales per record, safely below the 50,000 URL limit per sitemap.
export const SITEMAP_RECORDS_PER_PAGE = 10_000
export const sitemapPageCount = (registry: SitemapRegistry) => Math.max(1, Math.ceil(registry.entries.length / SITEMAP_RECORDS_PER_PAGE))
export function sitemapPagePaths(registry: SitemapRegistry, page: number): SitemapPath[] {
  if (!Number.isInteger(page) || page < 0 || page >= sitemapPageCount(registry)) return []
  return [
    ...(page === 0 ? [{ path: '/' }, { path: '/tv' }, { path: '/trend' }] : []),
    ...registry.entries.slice(page * SITEMAP_RECORDS_PER_PAGE, (page + 1) * SITEMAP_RECORDS_PER_PAGE)
      .filter((entry) => !entry.excludedAt).map(({ path, images }) => ({ path, images })),
  ]
}
