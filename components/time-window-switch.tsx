'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { TimeWindow } from '@/types/tmdb'
import { getLocalePath, type Locale } from '@/lib/i18n'

export function TimeWindowSwitch({
  selected,
  locale,
  label,
  todayLabel,
  weekLabel,
}: {
  selected: TimeWindow
  locale: Locale
  label: string
  todayLabel: string
  weekLabel: string
}) {
  const [pendingSelection, setPendingSelection] = useState<{ from: TimeWindow; to: TimeWindow } | null>(null)
  const displayedWindow = pendingSelection?.from === selected ? pendingSelection.to : selected

  return (
    <nav
      aria-label={label}
      aria-busy={displayedWindow !== selected}
      data-selected={displayedWindow}
      className="relative isolate mt-7 inline-grid grid-cols-2 overflow-hidden rounded-full border border-tone/10 bg-tone/5"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 z-0 w-1/2 rounded-full bg-action shadow-lg shadow-black/30 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          displayedWindow === 'week' ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      {(['day', 'week'] as const).map((window) => {
        const active = window === displayedWindow
        return (
          <Link
            key={window}
            href={{ pathname: getLocalePath(locale, '/trend'), query: { window } }}
            prefetch={window === selected ? false : true}
            replace
            scroll={false}
            onNavigate={() => setPendingSelection({ from: selected, to: window })}
            aria-current={window === selected ? 'page' : undefined}
            className={`relative z-10 inline-flex min-h-11 min-w-24 items-center justify-center rounded-full px-5 text-sm font-semibold capitalize outline-none transition-colors focus-visible:ring-3 focus-visible:ring-accent/40 ${
              active ? 'text-on-action' : 'text-subtle hover:bg-tone/6 hover:text-ink'
            }`}
          >
            {window === 'day' ? todayLabel : weekLabel}
          </Link>
        )
      })}
    </nav>
  )
}
