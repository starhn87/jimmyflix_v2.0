'use client'

import { useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import type { HeaderMessages, Locale } from '@/lib/i18n'
import {
  getDefaultRegion,
  isRegion,
  regionCookieMaxAge,
  regionCookieName,
  type Region,
} from '@/lib/region'

function readRegion(fallback: Region) {
  const value = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${regionCookieName}=`))
    ?.split('=')[1]
  return isRegion(value) ? value : fallback
}

const regionChangeEvent = 'jimmyflix:region-change'
const subscribe = (callback: () => void) => {
  window.addEventListener(regionChangeEvent, callback)
  return () => window.removeEventListener(regionChangeEvent, callback)
}

export function RegionSwitcher({ locale, messages }: { locale: Locale; messages: HeaderMessages }) {
  const fallback = getDefaultRegion(locale)
  const region = useSyncExternalStore(
    subscribe,
    () => readRegion(fallback),
    () => fallback,
  )
  const router = useRouter()

  const nextRegion: Region = region === 'KR' ? 'US' : 'KR'
  const label = nextRegion === 'KR' ? messages.switchRegionKorea : messages.switchRegionUnitedStates

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        const expires = new Date(Date.now() + regionCookieMaxAge * 1000).toUTCString()
        const secure = window.location.protocol === 'https:' ? '; secure' : ''
        document.cookie = `${regionCookieName}=${nextRegion}; path=/; max-age=${regionCookieMaxAge}; expires=${expires}; samesite=lax; priority=medium${secure}`
        window.dispatchEvent(new Event(regionChangeEvent))
        const url = new URL(window.location.href)
        const hadProviderFilter = url.searchParams.has('provider')
        url.searchParams.delete('provider')
        if (hadProviderFilter) {
          router.replace(`${url.pathname}${url.search}${url.hash}`)
        } else {
          router.refresh()
        }
      }}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-tone/15 bg-tone/5 font-mono text-xs font-bold tracking-wide text-ink outline-none transition-colors hover:bg-tone/10 focus-visible:ring-3 focus-visible:ring-accent/50"
    >
      {region}
    </button>
  )
}
