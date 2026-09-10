import Link from 'next/link'
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
  return (
    <nav aria-label={label} className="mt-7 inline-flex rounded-full border border-tone/10 bg-tone/5 p-1">
      {(['day', 'week'] as const).map((window) => {
        const active = window === selected
        return (
          <Link
            key={window}
            href={`${getLocalePath(locale, '/trend')}?window=${window}`}
            prefetch={false}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex min-h-10 min-w-24 items-center justify-center rounded-full px-5 text-sm font-semibold capitalize outline-none transition focus-visible:ring-3 focus-visible:ring-accent/40 ${
              active ? 'bg-action text-on-action shadow-lg shadow-black/30' : 'text-subtle hover:bg-tone/6 hover:text-ink'
            }`}
          >
            {window === 'day' ? todayLabel : weekLabel}
          </Link>
        )
      })}
    </nav>
  )
}
