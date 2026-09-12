import { Children, type ReactNode } from 'react'
import { MediaRailTrack } from '@/components/media-rail-track'
import { MEDIA_RAIL_HEADER_CLASS_NAME } from '@/components/media-rail-styles'
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

  return (
    <section
      aria-labelledby={titleId}
      className={toolbar ? undefined : 'render-later'}
    >
      <div className={MEDIA_RAIL_HEADER_CLASS_NAME}>
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

      <MediaRailTrack
        railId={railId}
        label={dictionary.common.carouselLabel(title)}
        items={items}
        backwardLabel={dictionary.common.scrollBackward(title)}
        forwardLabel={dictionary.common.scrollForward(title)}
      />
    </section>
  )
}
