'use client'

import { useEffect, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons'

interface MediaRailControlsProps {
  railId: string
  backwardLabel: string
  forwardLabel: string
  loopCopyCount?: number
}

interface LoopBounds {
  start: number
  end: number
  width: number
}

interface NavigationState {
  backward: boolean
  forward: boolean
}

type ScrollDirection = -1 | 1

const EDGE_TOLERANCE = 2
const LOOP_NORMALIZE_DELAY_MS = 160
const MIN_SCROLL_DISTANCE = 280
const VIEWPORT_SCROLL_RATIO = 0.82
const DISABLED_NAVIGATION: NavigationState = { backward: false, forward: false }

const getLoopBounds = (rail: HTMLElement): LoopBounds | null => {
  const origin = rail.querySelector<HTMLElement>('[data-loop-origin]')
  const copy = rail.querySelector<HTMLElement>('[data-loop-copy]')
  if (!origin || !copy) return null

  const railLeft = rail.getBoundingClientRect().left
  const paddingLeft = Number.parseFloat(window.getComputedStyle(rail).paddingLeft) || 0
  const position = (element: HTMLElement) => (
    element.getBoundingClientRect().left - railLeft + rail.scrollLeft - paddingLeft
  )
  const start = position(origin)
  const end = position(copy)
  const width = end - start

  return width > 0 ? { start, end, width } : null
}

const isLoopEnabled = (rail: HTMLElement, loop: LoopBounds | null) => (
  Boolean(loop && loop.width - rail.clientWidth > EDGE_TOLERANCE)
)

const getNavigationState = (
  rail: HTMLElement,
  loop: LoopBounds | null,
): NavigationState => {
  if (loop) {
    const enabled = isLoopEnabled(rail, loop)
    return { backward: enabled, forward: enabled }
  }

  const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0)
  return {
    backward: rail.scrollLeft > EDGE_TOLERANCE,
    forward: rail.scrollLeft < maxScrollLeft - EDGE_TOLERANCE,
  }
}

const navigationMatches = (left: NavigationState, right: NavigationState) => (
  left.backward === right.backward && left.forward === right.forward
)

const normalizeLoopPosition = (rail: HTMLElement, loop: LoopBounds | null) => {
  if (!isLoopEnabled(rail, loop) || !loop) return

  if (rail.scrollLeft >= loop.end - EDGE_TOLERANCE) {
    rail.scrollTo({ left: rail.scrollLeft - loop.width, behavior: 'auto' })
  }
}

function useMediaRailNavigation(railId: string, loopCopyCount: number) {
  const [navigation, setNavigation] = useState<NavigationState>(DISABLED_NAVIGATION)

  useEffect(() => {
    const rail = document.getElementById(railId)
    if (!rail) return

    let normalizeTimer = 0
    let frame = 0
    let loopBounds: LoopBounds | null = null

    const updateNavigation = () => {
      const nextNavigation = getNavigationState(rail, loopBounds)
      setNavigation((current) => navigationMatches(current, nextNavigation) ? current : nextNavigation)
    }

    const handleScroll = () => {
      if (!loopBounds) updateNavigation()
      window.clearTimeout(normalizeTimer)
      normalizeTimer = window.setTimeout(
        () => normalizeLoopPosition(rail, loopBounds),
        LOOP_NORMALIZE_DELAY_MS,
      )
    }

    const handleResize = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        loopBounds = getLoopBounds(rail)
        updateNavigation()
      })
    }

    rail.addEventListener('scroll', handleScroll, { passive: true })

    const resizeObserver = new ResizeObserver(handleResize)
    // Measuring every offscreen rail would force layout inside content-visibility.
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        resizeObserver.observe(rail)
        handleResize()
      } else {
        resizeObserver.disconnect()
        window.cancelAnimationFrame(frame)
      }
    }, { rootMargin: '400px 0px' })
    visibilityObserver.observe(rail.closest('section') || rail)

    return () => {
      window.clearTimeout(normalizeTimer)
      window.cancelAnimationFrame(frame)
      rail.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
    }
  }, [railId, loopCopyCount])

  return navigation
}

const scrollRail = (railId: string, direction: ScrollDirection) => {
  const rail = document.getElementById(railId)
  if (!rail) return

  const distance = Math.max(rail.clientWidth * VIEWPORT_SCROLL_RATIO, MIN_SCROLL_DISTANCE)
  const loop = getLoopBounds(rail)

  if (isLoopEnabled(rail, loop) && loop) {
    if (rail.scrollLeft >= loop.end - EDGE_TOLERANCE) {
      rail.scrollTo({ left: rail.scrollLeft - loop.width, behavior: 'auto' })
    }
    if (direction === -1 && rail.scrollLeft - distance < loop.start) {
      rail.scrollTo({ left: rail.scrollLeft + loop.width, behavior: 'auto' })
    }

    rail.scrollBy({ left: direction * distance, behavior: 'smooth' })
    return
  }

  if (loop) return

  const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0)
  const left = Math.min(Math.max(rail.scrollLeft + direction * distance, 0), maxScrollLeft)
  rail.scrollTo({ left, behavior: 'smooth' })
}

export function MediaRailControls({ railId, backwardLabel, forwardLabel, loopCopyCount = 0 }: MediaRailControlsProps) {
  const navigation = useMediaRailNavigation(railId, loopCopyCount)

  return (
    <>
      <button
        type="button"
        onClick={() => scrollRail(railId, -1)}
        disabled={!navigation.backward}
        aria-controls={railId}
        aria-label={backwardLabel}
        className="absolute inset-y-0 left-0 z-10 hidden w-20 cursor-pointer items-center justify-center bg-gradient-to-r from-canvas/95 via-canvas/80 to-transparent text-ink opacity-0 outline-none transition-opacity duration-300 ease-in-out hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-0 sm:flex lg:w-24"
      >
        <ArrowLeftIcon className="size-9 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] lg:size-10" />
      </button>
      <button
        type="button"
        onClick={() => scrollRail(railId, 1)}
        disabled={!navigation.forward}
        aria-controls={railId}
        aria-label={forwardLabel}
        className="absolute inset-y-0 right-0 z-10 hidden w-20 cursor-pointer items-center justify-center bg-gradient-to-l from-canvas/95 via-canvas/80 to-transparent text-ink opacity-0 outline-none transition-opacity duration-300 ease-in-out hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-0 sm:flex lg:w-24"
      >
        <ArrowRightIcon className="size-9 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] lg:size-10" />
      </button>
    </>
  )
}
