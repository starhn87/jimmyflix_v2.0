'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { MenuIcon } from '@/components/icons'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { RegionSwitcher } from '@/components/region-switcher'
import type { HeaderMessages, Locale } from '@/lib/i18n'

export function PreferencesMenu({
  locale,
  messages,
}: {
  locale: Locale
  messages: HeaderMessages
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? messages.closeSettings : messages.settings}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-tone/15 bg-tone/5 px-3 text-ink outline-none transition-colors hover:bg-tone/10 focus-visible:ring-3 focus-visible:ring-accent/50 sm:px-4"
      >
        <MenuIcon className="size-5" />
        <span className="hidden text-sm font-medium sm:inline">{messages.settings}</span>
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={messages.settings}
          className="absolute top-[calc(100%+0.625rem)] right-0 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-tone/12 bg-canvas/96 p-3 shadow-media backdrop-blur-xl"
        >
          <p className="px-1 text-xs font-semibold tracking-[0.16em] text-faint uppercase">
            {messages.settings}
          </p>
          <div className="mt-2 flex min-h-14 items-center justify-between gap-3 rounded-xl px-2 hover:bg-tone/5">
            <span className="text-sm font-medium text-muted">{messages.language}</span>
            <LocaleSwitcher
              locale={locale}
              label={messages.switchLanguage}
              buttonLabel={messages.languageButton}
            />
          </div>
          <div className="flex min-h-14 items-center justify-between gap-3 rounded-xl px-2 hover:bg-tone/5">
            <span className="text-sm font-medium text-muted">{messages.theme}</span>
            <ThemeToggle messages={messages} />
          </div>
          <div className="flex min-h-14 items-center justify-between gap-3 rounded-xl px-2 hover:bg-tone/5">
            <span className="text-sm font-medium text-muted">{messages.region}</span>
            <RegionSwitcher locale={locale} messages={messages} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
