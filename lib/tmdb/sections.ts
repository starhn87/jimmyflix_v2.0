import 'server-only'
import type { MediaSectionData, MediaType } from '@/types/tmdb'
import type { MediaListResult } from '@/lib/tmdb/lists'

interface SectionDefinition {
  id: string
  title: string
  description: string
  mediaType: MediaType
  load: () => Promise<MediaListResult>
}

export interface MediaSectionRequest {
  id: string
  title: string
  request: Promise<MediaSectionData>
}

const loadSection = async (
  definition: SectionDefinition,
): Promise<MediaSectionData> => {
  try {
    const { items, partial } = await definition.load()
    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      mediaType: definition.mediaType,
      items,
      partial,
      error: false,
    }
  } catch {
    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      mediaType: definition.mediaType,
      items: [],
      error: true,
    }
  }
}

export const createSectionRequests = (
  definitions: SectionDefinition[],
): MediaSectionRequest[] =>
  definitions.map((definition) => ({
    id: definition.id,
    title: definition.title,
    request: loadSection(definition),
  }))

