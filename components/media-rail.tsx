'use client'

import { Children, type ReactNode, useRef } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons'

interface MediaRailProps {
  title: string
  description: string
  children: ReactNode
}

export function MediaRail({ title, description, children }: MediaRailProps) {
  const railRef = useRef<HTMLUListElement>(null)

  const scroll = (direction: -1 | 1) => {
    const rail = railRef.current
    if (!rail) return

    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.82, 280),
      behavior: 'smooth',
    })
  }

  return (
    <section aria-labelledby={`${title.replaceAll(' ', '-').toLowerCase()}-title`}>
      <div className="mb-5 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div>
          <h2
            id={`${title.replaceAll(' ', '-').toLowerCase()}-title`}
            className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
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
      </div>

      <ul
        ref={railRef}
        aria-label={`${title} carousel`}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-7 sm:gap-4 sm:px-6 lg:gap-5 lg:px-10"
      >
        {Children.toArray(children).map((child, index) => (
          <li
            key={index}
            className="w-[42vw] min-w-[136px] max-w-[190px] shrink-0 snap-start sm:w-[27vw] md:w-[20vw] lg:w-[15vw] xl:w-[13vw]"
          >
            {child}
          </li>
        ))}
      </ul>
    </section>
  )
}
