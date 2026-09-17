'use client'

import { useId, type ReactNode } from 'react'
import { useHorizontalScroll } from '@/components/use-horizontal-scroll'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons'
import { DETAIL_RAIL_HEADER, DETAIL_RAIL_TRACK } from '@/components/detail-rail-styles'

interface DetailCardRailProps {
  title: string
  count: number
  previousLabel: string
  nextLabel: string
  action?: ReactNode
  children: ReactNode
}

const control = 'grid size-11 cursor-pointer place-items-center rounded-full border border-tone/15 bg-overlay text-ink outline-none transition hover:bg-tone/10 focus-visible:ring-3 focus-visible:ring-accent/50 disabled:cursor-default disabled:opacity-30 motion-reduce:transition-none'

export function DetailCardRail({ title, count, previousLabel, nextLabel, action, children }: DetailCardRailProps) {
  const id = useId()
  const { track, edges, scroll } = useHorizontalScroll<HTMLUListElement>(count)

  return (
    <section className="min-w-0" aria-labelledby={`${id}-title`}>
      <div className={DETAIL_RAIL_HEADER}>
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <h2 id={`${id}-title`} className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{title}</h2>
          <span className="text-sm tabular-nums text-faint">{count}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {action}
          <div className="hidden gap-2 sm:flex">
            <button type="button" aria-label={previousLabel} aria-controls={`${id}-track`} disabled={!edges.previous} onClick={() => scroll(-1)} className={control}>
              <ArrowLeftIcon className="size-5" />
            </button>
            <button type="button" aria-label={nextLabel} aria-controls={`${id}-track`} disabled={!edges.next} onClick={() => scroll(1)} className={control}>
              <ArrowRightIcon className="size-5" />
            </button>
          </div>
        </div>
      </div>
      <ul ref={track} id={`${id}-track`} aria-labelledby={`${id}-title`} tabIndex={0} className={`${DETAIL_RAIL_TRACK} outline-none focus-visible:ring-3 focus-visible:ring-accent/40`}>
        {children}
      </ul>
    </section>
  )
}
