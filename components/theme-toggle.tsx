'use client'

import { useSyncExternalStore } from 'react'
import { MoonIcon, SunIcon } from '@/components/icons'
import { THEME_CHANGE_EVENT, THEME_COLORS, THEME_STORAGE_KEY, type Theme } from '@/lib/theme'

let inMemoryChoice: Theme | null = null

function getSavedTheme(): Theme | null {
  if (inMemoryChoice) return inMemoryChoice
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return saved === 'dark' || saved === 'light' ? saved : null
  } catch {
    return inMemoryChoice
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function getServerSnapshot(): Theme {
  return 'dark'
}

function subscribe(onChange: () => void) {
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  const syncPreference = () => {
    applyTheme(getSavedTheme() ?? (systemTheme.matches ? 'dark' : 'light'))
    onChange()
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      inMemoryChoice = null
      syncPreference()
    }
  }

  window.addEventListener(THEME_CHANGE_EVENT, onChange)
  window.addEventListener('storage', onStorage)
  systemTheme.addEventListener('change', syncPreference)

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onStorage)
    systemTheme.removeEventListener('change', syncPreference)
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggleTheme = () => {
    const nextTheme = getSnapshot() === 'dark' ? 'light' : 'dark'
    inMemoryChoice = nextTheme
    try { localStorage.setItem(THEME_STORAGE_KEY, nextTheme) } catch { /* Still works without storage. */ }
    applyTheme(nextTheme)
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
  }

  return (
    <button
      type="button"
      aria-label="Dark mode"
      aria-pressed={theme === 'dark'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-tone/15 bg-tone/5 text-ink outline-none transition-colors hover:bg-tone/10 focus-visible:ring-3 focus-visible:ring-accent/50"
    >
      <SunIcon className="theme-sun size-5" />
      <MoonIcon className="theme-moon size-5" />
    </button>
  )
}
