import type { ReactNode } from 'react'
import { getPersonDetailRoute } from '@/lib/detail-route'

export default async function PersonDetailLayout({ children, params }: {
  children: ReactNode
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  await getPersonDetailRoute(locale, id)
  return children
}
