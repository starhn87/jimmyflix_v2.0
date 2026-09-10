import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DetailView } from '@/components/detail-view'
import { getMediaTitle } from '@/lib/media'
import { getCredits, getTvDetail, TmdbNotFoundError } from '@/lib/tmdb'

interface TvDetailPageProps {
  params: Promise<{ id: string }>
}

const parseId = (value: string) => {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export async function generateMetadata({ params }: TvDetailPageProps): Promise<Metadata> {
  const { id: rawId } = await params
  const id = parseId(rawId)
  if (!id) return { title: 'TV show not found' }

  try {
    const detail = await getTvDetail(id)
    return {
      title: getMediaTitle(detail),
      description: detail.overview || 'TV show details on Jimmyflix.',
    }
  } catch {
    return { title: 'TV show details' }
  }
}

export default async function TvDetailPage({ params }: TvDetailPageProps) {
  const { id: rawId } = await params
  const id = parseId(rawId)
  if (!id) notFound()

  let detail
  try {
    detail = await getTvDetail(id)
  } catch (error) {
    if (error instanceof TmdbNotFoundError) notFound()
    throw error
  }

  const creditsResult = await Promise.allSettled([getCredits('tv', id)])
  const castResult = creditsResult[0]

  return (
    <DetailView
      detail={detail}
      mediaType="tv"
      cast={castResult.status === 'fulfilled' ? castResult.value : []}
      creditsError={castResult.status === 'rejected'}
      collection={[]}
      collectionError={false}
    />
  )
}
