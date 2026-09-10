import 'server-only'

import { CollectionPanel, CreditsPanel } from '@/components/detail-panels'
import type { CastMember, MediaItem } from '@/types/tmdb'
import type { Locale } from '@/lib/i18n'

export async function CreditsDataPanel({ request, locale }: {
  request: Promise<CastMember[]>
  locale: Locale
}) {
  let cast: CastMember[] = []
  let error = false

  try {
    cast = await request
  } catch {
    error = true
  }

  return <CreditsPanel cast={cast} error={error} locale={locale} />
}

export async function CollectionDataPanel({ request, locale }: {
  request: Promise<MediaItem[]>
  locale: Locale
}) {
  let items: MediaItem[] = []
  let error = false

  try {
    items = await request
  } catch {
    error = true
  }

  return <CollectionPanel items={items} error={error} locale={locale} />
}
