'use client'

import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import { streamingCache, type StreamingCacheEntry } from '@/lib/streaming-cache'
import type { MediaSectionData } from '@/types/tmdb'

export function useStreamingSection(key: string, initialKey: string, initialData: MediaSectionData, updatedAt: number) {
  const initialEntry = useMemo<StreamingCacheEntry>(() => ({
    data: initialData.error ? undefined : initialData,
    updatedAt: initialData.partial ? 0 : updatedAt,
    error: initialData.error,
  }), [initialData, updatedAt])
  const serverEntry = key === initialKey ? initialEntry : undefined
  const entry = useSyncExternalStore(
    useCallback((listener) => streamingCache.subscribe(key, listener), [key]),
    useCallback(() => streamingCache.read(key) ?? serverEntry, [key, serverEntry]),
    () => serverEntry,
  )

  useEffect(() => {
    streamingCache.seed(initialKey, initialEntry)
  }, [initialKey, initialEntry])

  useEffect(() => {
    const refresh = () => { void streamingCache.load(key) }
    refresh()
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [key])

  return { data: entry?.data, error: entry?.error, retry: () => streamingCache.load(key, true) }
}
