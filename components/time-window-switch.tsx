import Link from 'next/link'
import type { TimeWindow } from '@/types/tmdb'

export function TimeWindowSwitch({ selected }: { selected: TimeWindow }) {
  return (
    <nav aria-label="Trending time window" className="mt-7 inline-flex rounded-full border border-tone/10 bg-tone/5 p-1">
      {(['day', 'week'] as const).map((window) => {
        const active = window === selected
        return (
          <Link
            key={window}
            href={`/trend?window=${window}`}
            prefetch={false}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex min-h-10 min-w-24 items-center justify-center rounded-full px-5 text-sm font-semibold capitalize outline-none transition focus-visible:ring-3 focus-visible:ring-accent/40 ${
              active ? 'bg-action text-on-action shadow-lg shadow-cyan-950/30' : 'text-subtle hover:bg-tone/6 hover:text-ink'
            }`}
          >
            {window === 'day' ? 'Today' : 'This week'}
          </Link>
        )
      })}
    </nav>
  )
}
