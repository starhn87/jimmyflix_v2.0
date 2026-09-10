'use client'

import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons'

interface MediaRailControlsProps {
  railId: string
  title: string
}

export function MediaRailControls({ railId, title }: MediaRailControlsProps) {
  const scroll = (direction: -1 | 1) => {
    const rail = document.getElementById(railId)
    if (!rail) return

    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.82, 280),
      behavior: 'smooth',
    })
  }

  return (
    <div className="hidden shrink-0 items-center gap-2 sm:flex">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label={`Scroll ${title} backward`}
        className="grid size-10 place-items-center rounded-full border border-white/12 bg-white/5 text-slate-300 outline-none transition hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-cyan-300/35"
      >
        <ArrowLeftIcon className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label={`Scroll ${title} forward`}
        className="grid size-10 place-items-center rounded-full border border-white/12 bg-white/5 text-slate-300 outline-none transition hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:ring-3 focus-visible:ring-cyan-300/35"
      >
        <ArrowRightIcon className="size-5" />
      </button>
    </div>
  )
}
