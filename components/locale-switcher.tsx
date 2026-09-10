'use client'

import { usePathname } from 'next/navigation'
import {
  getLocalePath,
  localeCookieMaxAge,
  localeCookieName,
  type Locale,
} from '@/lib/i18n'

interface LocaleSwitcherProps {
  locale: Locale
  label: string
  buttonLabel: string
}

export function LocaleSwitcher({ locale, label, buttonLabel }: LocaleSwitcherProps) {
  const pathname = usePathname()
  const nextLocale: Locale = locale === 'en' ? 'ko' : 'en'
  const nextPath = getLocalePath(nextLocale, pathname)

  const rememberLocale = (link: HTMLAnchorElement) => {
    const expires = new Date(Date.now() + localeCookieMaxAge * 1000).toUTCString()
    const secure = window.location.protocol === 'https:' ? '; secure' : ''
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=${localeCookieMaxAge}; expires=${expires}; samesite=lax; priority=medium${secure}`
    link.href = `${nextPath}${window.location.search}${window.location.hash}`
  }

  return (
    <a
      href={nextPath}
      hrefLang={nextLocale}
      lang={nextLocale}
      onClick={(event) => rememberLocale(event.currentTarget)}
      aria-label={label}
      title={label}
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-tone/15 bg-tone/5 font-mono text-xs font-bold tracking-wide text-ink outline-none transition-colors hover:bg-tone/10 focus-visible:ring-3 focus-visible:ring-accent/50"
    >
      {buttonLabel}
    </a>
  )
}
