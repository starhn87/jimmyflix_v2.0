'use client'

import { useSyncExternalStore, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setRegionPreference } from '@/app/actions/preferences'
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
  const [isPending, startTransition] = useTransition()

  const nextRegion: Region = region === 'KR' ? 'US' : 'KR'
  const label = nextRegion === 'KR' ? messages.switchRegionKorea : messages.switchRegionUnitedStates

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-busy={isPending}
      disabled={isPending}
      onClick={() => {
        const expires = new Date(Date.now() + regionCookieMaxAge * 1000).toUTCString()
        const secure = window.location.protocol === 'https:' ? '; secure' : ''
        document.cookie = `${regionCookieName}=${nextRegion}; path=/; max-age=${regionCookieMaxAge}; expires=${expires}; samesite=lax; priority=medium${secure}`
        window.dispatchEvent(new Event(regionChangeEvent))
        startTransition(async () => {
          await setRegionPreference(nextRegion)
          const url = new URL(window.location.href)
          const hadProvider = url.searchParams.has('provider')
          url.searchParams.delete('provider')
          const href = `${url.pathname}${url.search}${url.hash}`

          if (hadProvider) router.replace(href, { scroll: false })
          else router.refresh()
        })
      }}
      className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-tone/15 bg-tone/5 px-3 text-sm font-semibold whitespace-nowrap text-ink outline-none transition-colors hover:bg-tone/10 focus-visible:ring-3 focus-visible:ring-accent/50 disabled:cursor-wait disabled:opacity-70"
    >
      {region === 'KR' ? messages.regionKorea : messages.regionUnitedStates}
    </button>
  )
}
