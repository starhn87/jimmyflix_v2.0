import type { Metadata } from 'next'
import {
  getMediaDetailMetadata,
  MediaDetailPage,
  type MediaDetailRouteParams,
} from '@/components/media-detail-page'

interface MovieDetailPageProps {
  params: Promise<MediaDetailRouteParams>
}

export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  return getMediaDetailMetadata(params, 'movie')
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  return <MediaDetailPage params={params} mediaType="movie" />
}
