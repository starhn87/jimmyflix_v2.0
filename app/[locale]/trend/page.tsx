import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AsyncMediaSection } from '@/components/catalog-content'
import { MediaSectionSkeleton } from '@/components/loading-skeletons'
import { TimeWindowSwitch } from '@/components/time-window-switch'
import { getDictionary } from '@/lib/dictionaries'
import { isLocale } from '@/lib/i18n'
import { getTrendingSectionRequests } from '@/lib/tmdb'
import type { TimeWindow } from '@/types/tmdb'

interface TrendPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ window?: string | string[] }>
}

export async function generateMetadata({ params }: TrendPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dictionary = getDictionary(locale)
  return {
    title: dictionary.trend.metadataTitle,
    description: dictionary.trend.metadataDescription,
  }
}

export default async function TrendPage({ params, searchParams }: TrendPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams])
  if (!isLocale(locale)) return null
  const dictionary = getDictionary(locale)
  const rawWindow = Array.isArray(query.window) ? query.window[0] : query.window
  const window: TimeWindow = rawWindow === 'week' ? 'week' : 'day'
  const sections = getTrendingSectionRequests(window, locale)

  return (
    <main className="pb-20">
      <header className="mx-auto max-w-[1600px] px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:px-10">
        <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">
          {dictionary.trend.eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.035em] text-ink sm:text-6xl">
          {dictionary.trend.heading}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-subtle sm:text-base">
          {dictionary.trend.description}
        </p>
        <TimeWindowSwitch
          selected={window}
          locale={locale}
          label={dictionary.trend.timeWindowLabel}
          todayLabel={dictionary.trend.today}
          weekLabel={dictionary.trend.week}
        />
      </header>
      <div className="space-y-10 sm:space-y-14">
        {sections.map((section) => (
          <Suspense
            key={`${window}-${section.id}`}
            fallback={<MediaSectionSkeleton label={locale === 'ko' ? `${section.title} 불러오는 중` : `Loading ${section.title}`} />}
          >
            <AsyncMediaSection request={section.request} locale={locale} />
          </Suspense>
        ))}
      </div>
    </main>
  )
}
