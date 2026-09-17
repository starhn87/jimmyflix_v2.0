'use client'

import { useEffect, useRef, useState } from 'react'
import { getScrollBehavior } from '@/lib/browser-motion'

export function useHorizontalScroll<T extends HTMLElement>(itemCount: number) {
  const track = useRef<T>(null)
  const [edges, setEdges] = useState({ previous: false, next: false })
  useEffect(() => {
    const element = track.current
    if (!element) return
    let frame = 0
    const update = () => {
      const previous = element.scrollLeft > 2
      const next = element.scrollLeft + element.clientWidth < element.scrollWidth - 2
      setEdges((current) => current.previous === previous && current.next === next ? current : { previous, next })
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    const observer = new ResizeObserver(schedule)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    if (element.lastElementChild) observer.observe(element.lastElementChild)
    element.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      element.removeEventListener('scroll', schedule)
    }
  }, [itemCount])

  const scroll = (direction: number, ratio = 0.85, minimum = 0) => {
    const element = track.current
    if (!element) return
    element.scrollBy({ left: direction * Math.max(element.clientWidth * ratio, minimum), behavior: getScrollBehavior() })
  }
  return { track, edges, scroll }
}
