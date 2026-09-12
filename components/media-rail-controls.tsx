'use client'

import { useEffect, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons'

interface MediaRailControlsProps {
  railId: string
  backwardLabel: string
  forwardLabel: string
}

interface LoopBounds {
  start: number
  end: number
  width: number
}

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

export function MediaRailControls({ railId, backwardLabel, forwardLabel }: MediaRailControlsProps) {
  const [navigation, setNavigation] = useState({ backward: false, forward: false })

  useEffect(() => {
    const rail = document.getElementById(railId)
    if (!rail) return

    let normalizeTimer = 0
    let loopBounds = getLoopBounds(rail)

    const updateNavigation = () => {
      const loop = loopBounds
      const loops = Boolean(loop && loop.width - rail.clientWidth > 2)
      const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0)
      const nextNavigation = loop
        ? {
            backward: loops,
            forward: loops,
          }
        : {
            backward: rail.scrollLeft > 2,
            forward: rail.scrollLeft < maxScrollLeft - 2,
          }

      setNavigation((current) => (
        current.backward === nextNavigation.backward && current.forward === nextNavigation.forward
          ? current
          : nextNavigation
      ))
    }

    const normalizeLoopPosition = () => {
      const loop = loopBounds
      if (!loop || loop.width - rail.clientWidth <= 2) return

      if (rail.scrollLeft >= loop.end - 2) {
        rail.scrollTo({ left: rail.scrollLeft - loop.width, behavior: 'auto' })
      }
    }

    const handleScroll = () => {
      if (!loopBounds) updateNavigation()
      window.clearTimeout(normalizeTimer)
      normalizeTimer = window.setTimeout(normalizeLoopPosition, 160)
    }

    const handleResize = () => {
      loopBounds = getLoopBounds(rail)
      updateNavigation()
    }

    updateNavigation()
    rail.addEventListener('scroll', handleScroll, { passive: true })

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(rail)

    return () => {
      window.clearTimeout(normalizeTimer)
      rail.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
    }
  }, [railId])

  const scroll = (direction: -1 | 1) => {
    const rail = document.getElementById(railId)
    if (!rail) return

    const distance = Math.max(rail.clientWidth * 0.82, 280)
    const loop = getLoopBounds(rail)

    if (loop && loop.width - rail.clientWidth > 2) {
      if (rail.scrollLeft >= loop.end - 2) {
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
        disabled={!navigation.backward}
        aria-controls={railId}
        aria-label={backwardLabel}
        className="absolute inset-y-0 left-0 z-10 hidden w-20 cursor-pointer items-center justify-center bg-gradient-to-r from-canvas/95 via-canvas/80 to-transparent text-ink opacity-0 outline-none transition-opacity duration-300 ease-in-out hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-0 sm:flex lg:w-24"
      >
        <ArrowLeftIcon className="size-9 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] lg:size-10" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
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
