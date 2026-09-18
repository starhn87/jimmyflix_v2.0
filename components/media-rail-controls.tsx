'use client'

import { useEffect, useState } from 'react'
import { getScrollBehavior } from '@/lib/browser-motion'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons'

interface MediaRailControlsProps {
  railId: string
  backwardLabel: string
  forwardLabel: string
  onLoopScroll?: (direction: -1 | 1) => void
}

function useNativeNavigation(railId: string, looping: boolean) {
  const [navigation, setNavigation] = useState({ backward: false, forward: false })

  useEffect(() => {
    const rail = document.getElementById(railId)
    if (!rail || looping) return
    let frame = 0
    const update = () => {
      const backward = rail.scrollLeft > 2
      const forward = rail.scrollLeft < rail.scrollWidth - rail.clientWidth - 2
      setNavigation((current) => current.backward === backward && current.forward === forward
        ? current : { backward, forward })
    }
    const schedule = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(update)
    }
    rail.addEventListener('scroll', schedule, { passive: true })
    const resizeObserver = new ResizeObserver(schedule)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        resizeObserver.observe(rail)
        schedule()
      } else {
        resizeObserver.disconnect()
        window.cancelAnimationFrame(frame)
      }
    }, { rootMargin: '400px 0px' })
    visibilityObserver.observe(rail.closest('section') || rail)
    return () => {
      window.cancelAnimationFrame(frame)
      rail.removeEventListener('scroll', schedule)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
    }
  }, [railId, looping])

  return navigation
}

export function MediaRailControls({ railId, backwardLabel, forwardLabel, onLoopScroll }: MediaRailControlsProps) {
  const navigation = useNativeNavigation(railId, Boolean(onLoopScroll))
  const scroll = (direction: -1 | 1) => {
    if (onLoopScroll) return onLoopScroll(direction)
    const rail = document.getElementById(railId)
    if (!rail) return
    rail.scrollBy({ left: direction * Math.max(rail.clientWidth * 0.82, 280), behavior: getScrollBehavior() })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => scroll(-1)}
        disabled={!onLoopScroll && !navigation.backward}
        aria-controls={railId}
        aria-label={backwardLabel}
        className="absolute inset-y-0 left-0 z-10 hidden w-20 cursor-pointer items-center justify-center bg-gradient-to-r from-canvas/95 via-canvas/80 to-transparent text-ink opacity-0 outline-none transition-opacity duration-300 ease-in-out hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-0 sm:flex lg:w-24"
      >
        <ArrowLeftIcon className="size-9 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] lg:size-10" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        disabled={!onLoopScroll && !navigation.forward}
        aria-controls={railId}
        aria-label={forwardLabel}
        className="absolute inset-y-0 right-0 z-10 hidden w-20 cursor-pointer items-center justify-center bg-gradient-to-l from-canvas/95 via-canvas/80 to-transparent text-ink opacity-0 outline-none transition-opacity duration-300 ease-in-out hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-0 sm:flex lg:w-24"
      >
        <ArrowRightIcon className="size-9 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] lg:size-10" />
      </button>
    </>
  )
}
