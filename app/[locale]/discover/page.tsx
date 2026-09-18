import type { Metadata } from 'next'
import Link from 'next/link'
import { DiscoveryForm } from '@/components/discovery-form'
import { DiscoveryResults } from '@/components/discovery-results'
import { ErrorState } from '@/components/error-state'
import {
  discoveryGenres,
  discoveryProviders,
  getDiscoveryCopy,
  type DiscoveryFilters,
} from '@/lib/discovery'
import { getFirstSearchParam, type SearchParamValue } from '@/lib/params'
import { isLocale } from '@/lib/i18n'
import { getRequestRegion } from '@/lib/server-region'
import { createPageMetadata } from '@/lib/seo'
import { getDiscoveryResults } from '@/lib/tmdb/discover'
import type { MediaType } from '@/types/tmdb'

interface DiscoverPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, SearchParamValue>>
}

const parseNumber = (value: SearchParamValue) => {
  const parsed = Number(getFirstSearchParam(value))
  return Number.isSafeInteger(parsed) ? parsed : null
}

function parseFilters(
  query: Record<string, SearchParamValue>,
  region: 'KR' | 'US',
): DiscoveryFilters {
  const mediaType: MediaType = getFirstSearchParam(query.kind) === 'tv' ? 'tv' : 'movie'
  const genre = parseNumber(query.genre)
  const provider = parseNumber(query.provider)
  const runtime = parseNumber(query.runtime)
  const rating = parseNumber(query.rating)
  const sortValue = getFirstSearchParam(query.sort)
  const sort: DiscoveryFilters['sort'] = sortValue === 'rated' || sortValue === 'recent'
    ? sortValue
    : 'popular'

  return {
    mediaType,
    genre: discoveryGenres[mediaType].some((option) => option.id === genre) ? genre : null,
    provider: discoveryProviders[region].some((option) => option.id === provider) ? provider : null,
    runtime: runtime === 90 || runtime === 120 || runtime === 150 ? runtime : null,
    minimumRating: rating === 6 || rating === 7 || rating === 8 ? rating : null,
    sort,
  }
}

export async function generateMetadata({ params }: DiscoverPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const copy = getDiscoveryCopy(locale)
  return createPageMetadata({
    locale,
    path: '/discover',
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    noIndex: true,
  })
}

export default async function DiscoverPage({ params, searchParams }: DiscoverPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams])
  if (!isLocale(locale)) return null
  const region = await getRequestRegion(locale)
  const filters = parseFilters(query, region)
  const copy = getDiscoveryCopy(locale)

  let result: Awaited<ReturnType<typeof getDiscoveryResults>> | null
  try {
    result = await getDiscoveryResults(filters, locale, region)
  } catch {
    result = null
  }

  return (
    <main className="pb-20">
      <header className="mx-auto max-w-[1600px] px-4 pt-10 sm:px-6 sm:pt-14 lg:px-10">
        <p className="text-xs font-bold tracking-[0.18em] text-accent-strong uppercase">{copy.eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-[-0.035em] text-balance text-ink sm:text-5xl">{copy.title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base">{copy.description}</p>
        <div className="mt-8">
          <DiscoveryForm locale={locale} region={region} filters={filters} />
        </div>
        {filters.provider ? (
          <Link href="https://www.justwatch.com/" target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs text-faint underline decoration-tone/30 underline-offset-4 transition hover:text-ink">
            {copy.justWatch}
          </Link>
        ) : null}
      </header>

      {result ? (
        <DiscoveryResults items={result.items} mediaType={filters.mediaType} locale={locale} />
      ) : (
        <div className="mx-auto mt-9 max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <ErrorState
            title={locale === 'ko' ? '작품을 불러오지 못했습니다' : 'Could not load titles'}
            message={locale === 'ko' ? '조건을 유지한 채 다시 시도해 주세요.' : 'Try the same preferences again.'}
            retryLabel={locale === 'ko' ? '다시 시도' : 'Try again'}
            retryingLabel={locale === 'ko' ? '다시 시도 중…' : 'Trying again…'}
          />
        </div>
      )}
    </main>
  )
}
