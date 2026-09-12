import type { ReactNode } from 'react'
import { getMediaDetailRoute } from '@/lib/detail-route'

export default async function MovieDetailLayout({ children, params }: {
  children: ReactNode
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  // Validate outside this segment's loading boundary, before a 200 response is streamed.
  await getMediaDetailRoute(locale, id, 'movie')
  return children
}
