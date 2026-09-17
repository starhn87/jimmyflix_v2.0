// Loaded only by Playwright's Node process option. Production code has no fixture switch.
import { readFileSync } from 'node:fs'
const fixtureImage = readFileSync(new URL('../../public/images/defaultPoster.png', import.meta.url))
const originalFetch = globalThis.fetch
const poster = (id) => `/fixture-${id}.jpg`
const item = (id, kind = 'movie') => ({
  id, title: kind === 'movie' ? `Movie ${id}` : undefined, name: kind === 'tv' ? `Series ${id}` : undefined,
  media_type: kind, poster_path: poster(id), backdrop_path: `/backdrop-${id}.jpg`,
  release_date: '2020-01-01', first_air_date: '2020-01-01', vote_average: 8, vote_count: 1000,
  popularity: 100, overview: 'A story about friendship, discovery and the journey home.',
})
const videos = { results: [{ id: 'video-1', key: 'abcdefghijk', site: 'YouTube', type: 'Trailer', official: true, name: 'Official trailer', published_at: '2020-01-01T00:00:00Z' }] }
const credits = {
  cast: Array.from({ length: 65 }, (_, i) => ({ id: 1000 + i, name: `Actor ${i + 1}`, original_name: `Actor ${i + 1}`, character: `Character ${i + 1}`, profile_path: poster(1000 + i), order: i })),
  crew: Array.from({ length: 45 }, (_, i) => ({ id: 2000 + i, name: `Crew ${i + 1}`, original_name: `Crew ${i + 1}`, job: i % 2 ? 'Producer' : 'Director', department: i % 2 ? 'Production' : 'Directing', profile_path: poster(2000 + i) })),
}
const detail = (id, kind) => ({
  ...item(id, kind), runtime: 120, genres: [{ id: 12, name: 'Adventure' }], videos: id === 997 ? { results: [] } : videos,
  images: { backdrops: Array.from({ length: 20 }, (_, i) => ({ file_path: `/gallery-${i + 1}.jpg`, width: 1920, height: 1080 })) },
  keywords: { keywords: [] }, production_companies: [{ id: 1, name: 'Studio One', logo_path: '/studio.jpg' }],
  production_countries: [{ iso_3166_1: 'KR', name: 'South Korea' }],
  seasons: kind === 'tv' ? [{ id: 1, season_number: 1, name: 'Season 1', poster_path: poster(1), episode_count: 12 }] : [],
})
const list = (url, kind) => ({ results: Array.from({ length: 20 }, (_, i) => item((Number(url.searchParams.get('page') || 1) - 1) * 20 + i + 1, kind)) })

globalThis.fetch = async (input, options) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url)
  if (['image.tmdb.org', 'i.ytimg.com', 'flagcdn.com'].includes(url.hostname)) return new Response(fixtureImage, { headers: { 'content-type': 'image/png' } })
  if (url.hostname !== 'api.themoviedb.org') return originalFetch(input, options)
  const path = url.pathname.replace('/3/', '')
  const parts = path.split('/')
  const id = Number(parts[1])
  if (id === 999 && /credits|recommendations|similar|watch\/providers/.test(path)) return new Response('', { status: 503 })
  if (path.startsWith('watch/providers/')) return Response.json({ results: [8,337,356,97,119,15,9,350].map((provider_id) => ({ provider_id, provider_name: ({8:'Netflix',337:'Disney+'})[provider_id] || `Provider ${provider_id}`, logo_path: '/provider.jpg', display_priority: 1 })) })
  if (path.endsWith('/watch/providers')) return Response.json({ results: {} })
  if (path.endsWith('/combined_credits')) return Response.json({ cast: [item(1), item(2, 'tv')], crew: [] })
  if (path.endsWith('/credits')) return Response.json(credits)
  if (path.endsWith('/videos')) {
    if (id === 997) await new Promise((resolve) => setTimeout(resolve, 2500))
    return Response.json(videos)
  }
  if (parts[0] === 'person' && Number.isFinite(id)) return Response.json({ id, name: `Actor ${id - 999}`, profile_path: poster(id), biography: 'An actor with an extensive filmography.', known_for_department: 'Acting', birthday: '1980-01-01', deathday: null, place_of_birth: 'Seoul', also_known_as: [], combined_credits: { cast: [item(1), item(2)], crew: [] } })
  if (parts[0] === 'trending' && parts[1] === 'person') return Response.json({ total_pages: 2, results: Array.from({ length: 20 }, (_, i) => { const offset = (Number(url.searchParams.get('page') || 1) - 1) * 20 + i; return { id: 1000 + offset, name: `Actor ${offset + 1}`, profile_path: offset < 2 ? null : poster(1000 + offset), known_for_department: 'Acting' } }) })
  if (parts[2] === 'season') return Response.json({ id: 1, name: 'Season 1', episodes: [] })
  if (parts.length === 2 && ['movie','tv'].includes(parts[0]) && Number.isFinite(id)) return Response.json(detail(id, parts[0]))
  return Response.json(list(url, parts.includes('tv') ? 'tv' : 'movie'))
}
