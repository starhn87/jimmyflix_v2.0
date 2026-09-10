import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { CollectionDataPanel, CreditsDataPanel } from '@/components/detail-data-panels'
import { DetailView } from '@/components/detail-view'
import { DetailPanelSkeleton } from '@/components/loading-skeletons'
import { getCollection, getCredits, getMovieDetail, TmdbNotFoundError } from '@/lib/tmdb'
import { getMediaTitle } from '@/lib/media'

interface MovieDetailPageProps {
  params: Promise<{ id: string }>
}

const parseId = (value: string) => {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  const { id: rawId } = await params
  const id = parseId(rawId)
  if (!id) return { title: 'Movie not found' }

  try {
    const detail = await getMovieDetail(id)
    return {
      title: getMediaTitle(detail),
      description: detail.overview || 'Movie details on Jimmyflix.',
    }
  } catch {
    return { title: 'Movie details' }
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id: rawId } = await params
  const id = parseId(rawId)
  if (!id) notFound()

  let detail
  try {
    detail = await getMovieDetail(id)
  } catch (error) {
    if (error instanceof TmdbNotFoundError) notFound()
    throw error
  }

  const creditsRequest = getCredits('movie', id)
  const collectionRequest = detail.belongs_to_collection
    ? getCollection(detail.belongs_to_collection.id)
    : undefined

  return (
    <DetailView
      detail={detail}
      mediaType="movie"
      creditsPanel={(
        <Suspense fallback={<DetailPanelSkeleton label="Loading credits" />}>
          <CreditsDataPanel request={creditsRequest} />
        </Suspense>
      )}
      collectionPanel={collectionRequest ? (
        <Suspense fallback={<DetailPanelSkeleton label="Loading collection" />}>
          <CollectionDataPanel request={collectionRequest} />
        </Suspense>
      ) : undefined}
    />
  )
}
