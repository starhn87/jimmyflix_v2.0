import { Children, type ReactNode } from 'react'
import { MediaRailControls } from '@/components/media-rail-controls'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'

interface MediaRailProps {
  id?: string
  title: string
  description: ReactNode
  children: ReactNode
  locale: Locale
  toolbar?: ReactNode
}

const LOOP_COPY_ITEM_COUNT = 24

export function MediaRail({
  id,
  title,
  description,
  children,
  locale,
  toolbar,
}: MediaRailProps) {
  const dictionary = getDictionary(locale)
  const slug = id || title.replaceAll(' ', '-').toLowerCase()
  const titleId = `${slug}-title`
  const railId = `${slug}-rail`
  const items = Children.toArray(children)
  const shouldLoop = items.length >= 20
  const loopCopy = items.slice(0, LOOP_COPY_ITEM_COUNT)
  const itemClassName = 'w-[42vw] min-w-[136px] max-w-[190px] shrink-0 snap-start sm:w-[27vw] md:w-[20vw] lg:w-[15vw] xl:w-[13vw]'

  return (
    <section
      aria-labelledby={titleId}
      className={toolbar ? undefined : 'render-later'}
    >
      <div className="mb-5 px-4 sm:px-8 lg:px-12">
        <div>
          <h2
            id={titleId}
            className="text-xl font-semibold tracking-tight text-ink sm:text-2xl"
          >
            {title}
          </h2>
          {description ? <div className="mt-1 text-sm text-faint">{description}</div> : null}
        </div>
        {toolbar ? <div className="mt-4">{toolbar}</div> : null}
      </div>

      <div className="relative">
        <ul
          id={railId}
          aria-label={dictionary.common.carouselLabel(title)}
          className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-7 sm:scroll-px-8 sm:gap-4 sm:px-8 lg:scroll-px-12 lg:gap-5 lg:px-12"
        >
          {items.map((child, index) => (
            <li
              key={`original-${index}`}
              data-loop-origin={index === 0 ? '' : undefined}
              className={itemClassName}
            >
              {child}
            </li>
          ))}
          {shouldLoop ? loopCopy.map((child, index) => (
            <li
              key={`copy-${index}`}
              data-loop-copy={index === 0 ? '' : undefined}
              aria-hidden="true"
              inert
              className={itemClassName}
            >
              {child}
            </li>
          )) : null}
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
