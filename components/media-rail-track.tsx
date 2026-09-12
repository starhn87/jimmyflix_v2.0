'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MediaRailControls } from '@/components/media-rail-controls'
import { MEDIA_RAIL_ITEM_CLASS_NAME, MEDIA_RAIL_LIST_CLASS_NAME } from '@/components/media-rail-styles'

interface MediaRailTrackProps {
  railId: string
  label: string
  items: ReactNode[]
  backwardLabel: string
  forwardLabel: string
}

export function MediaRailTrack({ railId, label, items, backwardLabel, forwardLabel }: MediaRailTrackProps) {
  const railRef = useRef<HTMLUListElement>(null)
  const [copyCount, setCopyCount] = useState(0)
  const loopCopyCount = items.length >= 20 ? copyCount : 0

  useEffect(() => {
    const rail = railRef.current
    if (!rail || items.length < 20) return

    let frame = 0
    const measure = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const item = rail.firstElementChild
        if (!item) return
        const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap) || 0
        const stride = item.getBoundingClientRect().width + gap
        if (stride <= 0) return
        // One viewport plus overscan bridges the loop, including ultrawide screens.
        setCopyCount(Math.min(items.length, Math.ceil(rail.clientWidth / stride) + 2))
      })
    }
    const resizeObserver = new ResizeObserver(measure)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        resizeObserver.observe(rail)
        measure()
      } else {
        resizeObserver.disconnect()
        window.cancelAnimationFrame(frame)
      }
    }, { rootMargin: '400px 0px' })

    visibilityObserver.observe(rail.closest('section') || rail)
    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
    }
  }, [items.length])

  return (
    <div className="relative">
      <ul ref={railRef} id={railId} aria-label={label} className={MEDIA_RAIL_LIST_CLASS_NAME}>
        {items.map((child, index) => (
          <li
            key={`original-${index}`}
            data-loop-origin={index === 0 ? '' : undefined}
            className={MEDIA_RAIL_ITEM_CLASS_NAME}
          >
            {child}
          </li>
        ))}
        {items.slice(0, loopCopyCount).map((child, index) => (
          <li
            key={`copy-${index}`}
            data-loop-copy={index === 0 ? '' : undefined}
            aria-hidden="true"
            inert
            className={MEDIA_RAIL_ITEM_CLASS_NAME}
          >
            {child}
          </li>
        ))}
      </ul>
      <MediaRailControls
        railId={railId}
        loopCopyCount={loopCopyCount}
        backwardLabel={backwardLabel}
        forwardLabel={forwardLabel}
      />
    </div>
  )
}
