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
      <div className="mb-5 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div>
          <h2
            id={titleId}
            className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <MediaRailControls railId={railId} title={title} />
      </div>

      <ul
        id={railId}
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
