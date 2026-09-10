import Link from 'next/link'
import type { TimeWindow } from '@/types/tmdb'

export function TimeWindowSwitch({ selected }: { selected: TimeWindow }) {
  return (
    <nav aria-label="Trending time window" className="mt-7 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
      {(['day', 'week'] as const).map((window) => {
        const active = window === selected
        return (
          <Link
            key={window}
            href={`/trend?window=${window}`}
            prefetch={false}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex min-h-10 min-w-24 items-center justify-center rounded-full px-5 text-sm font-semibold capitalize outline-none transition focus-visible:ring-3 focus-visible:ring-cyan-300/40 ${
              active ? 'bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-950/30' : 'text-slate-400 hover:bg-white/6 hover:text-white'
            }`}
          >
            {window === 'day' ? 'Today' : 'This week'}
          </Link>
        )
      })}
    </nav>
  )
}
