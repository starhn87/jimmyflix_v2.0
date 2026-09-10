'use client'

import { useEffect, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons'

interface MediaRailControlsProps {
  railId: string
  title: string
}

export function MediaRailControls({ railId, title }: MediaRailControlsProps) {
  const [navigation, setNavigation] = useState({ backward: false, forward: false })

  useEffect(() => {
    const rail = document.getElementById(railId)
    if (!rail) return

    const updateNavigation = () => {
      const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0)
      const nextNavigation = {
        backward: rail.scrollLeft > 2,
        forward: rail.scrollLeft < maxScrollLeft - 2,
      }

      setNavigation((current) =>
        current.backward === nextNavigation.backward &&
        current.forward === nextNavigation.forward
          ? current
          : nextNavigation,
      )
    }

    updateNavigation()
    rail.addEventListener('scroll', updateNavigation, { passive: true })

    const resizeObserver = new ResizeObserver(updateNavigation)
    resizeObserver.observe(rail)

    return () => {
      rail.removeEventListener('scroll', updateNavigation)
      resizeObserver.disconnect()
    }
  }, [railId])

  const scroll = (direction: -1 | 1) => {
    const rail = document.getElementById(railId)
    if (!rail) return

    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.82, 280),
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
        aria-label={`Scroll ${title} backward`}
        className="absolute inset-y-0 left-0 z-10 hidden w-14 items-center justify-center bg-gradient-to-r from-[#080b12]/95 via-[#080b12]/80 to-transparent text-white opacity-0 outline-none transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-cyan-300/50 disabled:pointer-events-none disabled:opacity-0 sm:flex"
      >
        <ArrowLeftIcon className="size-7 drop-shadow-lg" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        disabled={!navigation.forward}
        aria-controls={railId}
        aria-label={`Scroll ${title} forward`}
        className="absolute inset-y-0 right-0 z-10 hidden w-14 items-center justify-center bg-gradient-to-l from-[#080b12]/95 via-[#080b12]/80 to-transparent text-white opacity-0 outline-none transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-cyan-300/50 disabled:pointer-events-none disabled:opacity-0 sm:flex"
      >
        <ArrowRightIcon className="size-7 drop-shadow-lg" />
      </button>
    </>
  )
}
