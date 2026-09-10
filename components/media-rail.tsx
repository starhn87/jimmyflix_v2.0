import { Children, type ReactNode } from 'react'
import { MediaRailControls } from '@/components/media-rail-controls'

interface MediaRailProps {
  title: string
  description: string
  children: ReactNode
}

export function MediaRail({ title, description, children }: MediaRailProps) {
  const slug = title.replaceAll(' ', '-').toLowerCase()
  const titleId = `${slug}-title`
  const railId = `${slug}-rail`

  return (
    <section aria-labelledby={titleId} className="render-later">
      <div className="mb-5 px-5 sm:px-8 lg:px-12">
        <div>
          <h2
            id={titleId}
            className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <div className="relative">
        <ul
          id={railId}
          aria-label={`${title} carousel`}
          className="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-7 sm:scroll-px-8 sm:gap-4 sm:px-8 lg:scroll-px-12 lg:gap-5 lg:px-12"
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
        <MediaRailControls railId={railId} title={title} />
      </div>
    </section>
  )
}
