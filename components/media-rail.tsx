import { Children, type ReactNode } from 'react'
import { MediaRailControls } from '@/components/media-rail-controls'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'

interface MediaRailProps {
  title: string
  description: string
  children: ReactNode
  locale: Locale
}

export function MediaRail({ title, description, children, locale }: MediaRailProps) {
  const dictionary = getDictionary(locale)
  const slug = title.replaceAll(' ', '-').toLowerCase()
  const titleId = `${slug}-title`
  const railId = `${slug}-rail`

  return (
    <section aria-labelledby={titleId} className="render-later">
      <div className="mb-5 px-4 sm:px-8 lg:px-12">
        <div>
          <h2
            id={titleId}
            className="text-xl font-semibold tracking-tight text-ink sm:text-2xl"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-faint">{description}</p>
        </div>
      </div>

      <div className="relative">
        <ul
          id={railId}
          aria-label={dictionary.common.carouselLabel(title)}
          className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-7 sm:scroll-px-8 sm:gap-4 sm:px-8 lg:scroll-px-12 lg:gap-5 lg:px-12"
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
        <MediaRailControls
          railId={railId}
          backwardLabel={dictionary.common.scrollBackward(title)}
          forwardLabel={dictionary.common.scrollForward(title)}
        />
      </div>
    </section>
  )
}
