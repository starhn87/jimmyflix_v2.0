import { ErrorState } from '@/components/error-state'
import { MediaCard } from '@/components/media-card'
import { MediaRail } from '@/components/media-rail'
import type { MediaSectionData } from '@/types/tmdb'
import { getDictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'

interface MediaSectionProps {
  section: MediaSectionData
  prioritizeFirst?: boolean
  locale: Locale
}

export function MediaSection({ section, prioritizeFirst = false, locale }: MediaSectionProps) {
  const dictionary = getDictionary(locale)
  if (section.error) {
    return (
      <div className="px-4 sm:px-6 lg:px-10">
        <ErrorState
          compact
          title={dictionary.common.sectionUnavailableTitle(section.title)}
          message={dictionary.common.sectionUnavailableMessage}
          retryLabel={dictionary.common.retry}
          retryingLabel={dictionary.common.retrying}
        />
      </div>
    )
  }

  if (section.items.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-10" aria-labelledby={`${section.id}-title`}>
        <h2 id={`${section.id}-title`} className="text-xl font-semibold text-ink sm:text-2xl">
          {section.title}
        </h2>
        <p className="mt-4 rounded-2xl border border-tone/8 bg-tone/4 p-6 text-sm text-subtle">
          {dictionary.common.sectionEmpty}
        </p>
      </section>
    )
  }

  return (
    <MediaRail title={section.title} description={section.description} locale={locale}>
      {section.items.map((item, index) => (
        <MediaCard
          key={item.id}
          item={item}
          mediaType={section.mediaType}
          highPriority={prioritizeFirst && index < 4}
          locale={locale}
        />
      ))}
    </MediaRail>
  )
}
