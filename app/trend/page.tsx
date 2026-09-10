import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AsyncMediaSection } from '@/components/catalog-content'
import { MediaSectionSkeleton } from '@/components/loading-skeletons'
import { TimeWindowSwitch } from '@/components/time-window-switch'
import { getTrendingSectionRequests } from '@/lib/tmdb'
import type { TimeWindow } from '@/types/tmdb'

export const metadata: Metadata = {
  title: 'Trending',
  description: 'See the movies and TV shows gaining attention today and this week.',
}

interface TrendPageProps {
  searchParams: Promise<{ window?: string | string[] }>
}

export default async function TrendPage({ searchParams }: TrendPageProps) {
  const params = await searchParams
  const rawWindow = Array.isArray(params.window) ? params.window[0] : params.window
  const window: TimeWindow = rawWindow === 'week' ? 'week' : 'day'
  const sections = getTrendingSectionRequests(window)

  return (
    <main className="pb-20">
      <header className="mx-auto max-w-[1600px] px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:px-10">
        <p className="text-xs font-semibold tracking-[0.24em] text-accent uppercase">
          Live discovery
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.035em] text-ink sm:text-6xl">
          What’s trending
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-subtle sm:text-base">
          Follow the movies and shows attracting the most attention right now.
        </p>
        <TimeWindowSwitch selected={window} />
      </header>
      <div className="space-y-10 sm:space-y-14">
        {sections.map((section) => (
          <Suspense
            key={`${window}-${section.id}`}
            fallback={<MediaSectionSkeleton label={`Loading ${section.title}`} />}
          >
            <AsyncMediaSection request={section.request} />
          </Suspense>
        ))}
      </div>
    </main>
  )
}
