'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
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
  const track = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ previous: false, next: false })

  useEffect(() => {
    const element = track.current
    if (!element) return
    const update = () => {
      const previous = element.scrollLeft > 2
      const next = element.scrollLeft + element.clientWidth < element.scrollWidth - 2
      setEdges((current) => current.previous === previous && current.next === next ? current : { previous, next })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    element.addEventListener('scroll', update, { passive: true })
    return () => {
      observer.disconnect()
      element.removeEventListener('scroll', update)
    }
  }, [count])

  const scroll = (direction: number) => {
    const element = track.current
    element?.scrollBy({
      left: direction * element.clientWidth * 0.85,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

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
