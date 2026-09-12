import { createSitemap } from '@/lib/sitemap'
import { getSitemapPaths } from '@/lib/tmdb'

export const revalidate = 3600

export default async function sitemap() {
  return createSitemap([
    { path: '/' }, { path: '/tv' }, { path: '/trend' },
    ...await getSitemapPaths(),
  ])
}
