import type { Metadata } from 'next'
import {
  getMediaDetailMetadata,
  MediaDetailPage,
  type MediaDetailRouteParams,
} from '@/components/media-detail-page'

interface TvDetailPageProps {
  params: Promise<MediaDetailRouteParams>
}

export async function generateMetadata({ params }: TvDetailPageProps): Promise<Metadata> {
  return getMediaDetailMetadata(params, 'tv')
}

export default function TvDetailPage({ params }: TvDetailPageProps) {
  return <MediaDetailPage params={params} mediaType="tv" />
}
