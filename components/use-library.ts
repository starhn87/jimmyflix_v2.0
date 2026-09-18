'use client'

import { useSyncExternalStore } from 'react'
import {
  LIBRARY_STORAGE_KEY,
  parseLibraryEntries,
  updateLibraryEntries,
  type LibraryEntry,
  type LibraryMediaItem,
  type LibraryStatus,
} from '@/lib/library'

const emptyEntries: LibraryEntry[] = []
let cachedEntries: LibraryEntry[] = emptyEntries
let loaded = false
const subscribers = new Set<() => void>()
let listening = false

function readStorage() {
  try {
    cachedEntries = parseLibraryEntries(JSON.parse(window.localStorage.getItem(LIBRARY_STORAGE_KEY) || '[]'))
  } catch {
    cachedEntries = emptyEntries
  }
  loaded = true
  return cachedEntries
}

function notify() {
  subscribers.forEach((subscriber) => subscriber())
}

function handleStorage(event: StorageEvent) {
  if (event.key !== LIBRARY_STORAGE_KEY) return
  readStorage()
  notify()
}

function subscribe(callback: () => void) {
  subscribers.add(callback)
  if (!listening) {
    window.addEventListener('storage', handleStorage)
    listening = true
  }
  return () => {
    subscribers.delete(callback)
    if (subscribers.size === 0 && listening) {
      window.removeEventListener('storage', handleStorage)
      listening = false
    }
  }
}

function getSnapshot() {
  return loaded ? cachedEntries : readStorage()
}

export function useLibraryEntries() {
  return useSyncExternalStore(subscribe, getSnapshot, () => emptyEntries)
}

export function setLibraryStatus(item: LibraryMediaItem, status: LibraryStatus | null) {
  const current = getSnapshot()
  cachedEntries = updateLibraryEntries(current, item, status)
  loaded = true
  try {
    window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(cachedEntries))
  } catch {
    // Keep the in-memory library usable when browser storage is unavailable.
  }
  notify()
}
