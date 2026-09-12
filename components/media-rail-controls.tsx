'use client'

import { useEffect, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons'

interface MediaRailControlsProps {
  railId: string
  backwardLabel: string
  forwardLabel: string
}

export function MediaRailControls({ railId, backwardLabel, forwardLabel }: MediaRailControlsProps) {
  const [scrollable, setScrollable] = useState(false)

  useEffect(() => {
    const rail = document.getElementById(railId)
    if (!rail) return

    const updateNavigation = () => setScrollable(rail.scrollWidth - rail.clientWidth > 2)

    updateNavigation()

    const resizeObserver = new ResizeObserver(updateNavigation)
    resizeObserver.observe(rail)

    return () => {
      resizeObserver.disconnect()
    }
  }, [railId])

  const scroll = (direction: -1 | 1) => {
    const rail = document.getElementById(railId)
    if (!rail) return

    const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0)
    const atStart = rail.scrollLeft <= 2
    const atEnd = rail.scrollLeft >= maxScrollLeft - 2
    const distance = Math.max(rail.clientWidth * 0.82, 280)
    const left = direction === 1
      ? (atEnd ? 0 : Math.min(rail.scrollLeft + distance, maxScrollLeft))
      : (atStart ? maxScrollLeft : Math.max(rail.scrollLeft - distance, 0))

    rail.scrollTo({
      left,
      behavior: 'smooth',
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => scroll(-1)}
        disabled={!scrollable}
        aria-controls={railId}
        aria-label={backwardLabel}
        className="absolute inset-y-0 left-0 z-10 hidden w-20 cursor-pointer items-center justify-center bg-gradient-to-r from-canvas/95 via-canvas/80 to-transparent text-ink opacity-0 outline-none transition-opacity duration-300 ease-in-out hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-0 sm:flex lg:w-24"
      >
        <ArrowLeftIcon className="size-9 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] lg:size-10" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        disabled={!scrollable}
        aria-controls={railId}
        aria-label={forwardLabel}
        className="absolute inset-y-0 right-0 z-10 hidden w-20 cursor-pointer items-center justify-center bg-gradient-to-l from-canvas/95 via-canvas/80 to-transparent text-ink opacity-0 outline-none transition-opacity duration-300 ease-in-out hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-0 sm:flex lg:w-24"
      >
        <ArrowRightIcon className="size-9 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] lg:size-10" />
      </button>
    </>
  )
}
