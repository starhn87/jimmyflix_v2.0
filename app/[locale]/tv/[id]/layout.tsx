import type { ReactNode } from 'react'
import { getMediaDetailRoute } from '@/lib/detail-route'

export default async function TvDetailLayout({ children, params }: {
  children: ReactNode
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  await getMediaDetailRoute(locale, id, 'tv')
  return children
}
