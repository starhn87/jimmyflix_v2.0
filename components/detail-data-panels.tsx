import 'server-only'

import { CollectionPanel, CreditsPanel } from '@/components/detail-panels'
import type { CastMember, MediaItem } from '@/types/tmdb'

export async function CreditsDataPanel({ request }: { request: Promise<CastMember[]> }) {
  let cast: CastMember[] = []
  let error = false

  try {
    cast = await request
  } catch {
    error = true
  }

  return <CreditsPanel cast={cast} error={error} />
}

export async function CollectionDataPanel({ request }: { request: Promise<MediaItem[]> }) {
  let items: MediaItem[] = []
  let error = false

  try {
    items = await request
  } catch {
    error = true
  }

  return <CollectionPanel items={items} error={error} />
}
