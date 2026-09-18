'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MediaRailControls } from '@/components/media-rail-controls'
import { MEDIA_RAIL_ITEM_CLASS_NAME, MEDIA_RAIL_LIST_CLASS_NAME } from '@/components/media-rail-styles'
import { createLoopingRail } from '@/lib/looping-rail'

interface MediaRailTrackProps {
  railId: string
  label: string
  items: ReactNode[]
  backwardLabel: string
  forwardLabel: string
}

export function MediaRailTrack({ railId, label, items, backwardLabel, forwardLabel }: MediaRailTrackProps) {
  const railRef = useRef<HTMLUListElement>(null)
  const loopRef = useRef<ReturnType<typeof createLoopingRail> | null>(null)
  const [looping, setLooping] = useState(false)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    setLooping(false)
    const loop = createLoopingRail(rail, setLooping)
    loopRef.current = loop
    return () => {
      loop.destroy()
      loopRef.current = null
    }
  }, [items])

  return (
    <div className="relative">
      <ul ref={railRef} id={railId} aria-label={label} className={MEDIA_RAIL_LIST_CLASS_NAME}>
        {items.map((child, index) => (
          <li
            key={index}
            data-loop-origin={index}
            aria-posinset={index + 1}
            aria-setsize={items.length}
            className={MEDIA_RAIL_ITEM_CLASS_NAME}
          >
            {child}
          </li>
        ))}
      </ul>
      <MediaRailControls
        railId={railId}
        onLoopScroll={looping ? (direction) => loopRef.current?.scroll(direction) : undefined}
        backwardLabel={backwardLabel}
        forwardLabel={forwardLabel}
      />
    </div>
  )
}
