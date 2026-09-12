import { createSitemap } from '@/lib/sitemap'
import { getSitemapPaths } from '@/lib/tmdb'

// Match the shortest catalog cache (daily/weekly trends). Keep this literal for Next.js.
export const revalidate = 600

export default async function sitemap() {
  return createSitemap([
    { path: '/' }, { path: '/tv' }, { path: '/trend' },
    ...await getSitemapPaths(),
  ])
}
