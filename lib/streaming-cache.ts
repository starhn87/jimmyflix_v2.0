import { STREAMING_CACHE_SECONDS } from '@/lib/streaming'
import type { MediaSectionData } from '@/types/tmdb'

export interface StreamingCacheEntry {
  data?: MediaSectionData
  updatedAt: number
  error?: boolean
}

// Bounded to the locale × region × media type × provider combinations. This cache
// lives in the browser; the API and TMDB fetches supply the shared server caches.
export function createStreamingCache(limit = 64) {
  const entries = new Map<string, StreamingCacheEntry>()
  const requests = new Map<string, Promise<void>>()
  const listeners = new Map<string, Set<() => void>>()

  function publish(key: string, entry: StreamingCacheEntry) {
    entries.delete(key)
    entries.set(key, entry)
    if (entries.size > limit) entries.delete(entries.keys().next().value!)
    listeners.get(key)?.forEach((listener) => listener())
  }

  return {
    read: (key: string) => entries.get(key),
    subscribe(key: string, listener: () => void) {
      const subscribers = listeners.get(key) ?? new Set()
      subscribers.add(listener)
      listeners.set(key, subscribers)
      return () => {
        subscribers.delete(listener)
        if (!subscribers.size) listeners.delete(key)
      }
    },
    seed(key: string, entry: StreamingCacheEntry) {
      if (entry.data?.error) return
      if (!entries.has(key) || entries.get(key)!.updatedAt < entry.updatedAt) publish(key, entry)
    },
    load(key: string, force = false): Promise<void> {
      const pending = requests.get(key)
      if (pending) return pending
      const previous = entries.get(key)
      if (!force && !previous?.error && previous?.data && Date.now() - previous.updatedAt < STREAMING_CACHE_SECONDS * 1000) {
        // Touch the entry without changing its identity or freshness.
        entries.delete(key)
        entries.set(key, previous)
        return Promise.resolve()
      }
      if (previous?.error) publish(key, { data: previous.data, updatedAt: previous.updatedAt })
      const request = (async () => {
        try {
          const response = await fetch(key, { signal: AbortSignal.timeout(12_000) })
          if (!response.ok) throw new Error('Streaming request failed.')
          const data: MediaSectionData = await response.json()
          if (data.error) throw new Error('Streaming titles are unavailable.')
          publish(key, { data, updatedAt: data.partial ? 0 : Date.now() })
        } catch {
          // A failed refresh retains usable cards, but never becomes a fresh cache hit.
          publish(key, { data: previous?.data, updatedAt: previous?.updatedAt ?? 0, error: true })
        } finally {
          requests.delete(key)
        }
      })()
      requests.set(key, request)
      return request
    },
  }
}

export const streamingCache = createStreamingCache()
