import { notFound, permanentRedirect } from 'next/navigation'
import { getLocalePath, isLocale } from '@/lib/i18n'

export default async function LegacyTvRedirect({
  params,
}: {
  params: Promise<{ locale: string; path?: string[] }>
}) {
  const { locale, path = [] } = await params
  if (!isLocale(locale)) notFound()

  const suffix = path.length > 0
    ? `/${path.map((segment) => encodeURIComponent(segment)).join('/')}`
    : ''

  permanentRedirect(getLocalePath(locale, `/tv${suffix}`))
}
