import 'server-only'
import { get, put } from '@vercel/blob'
import { unstable_cache } from 'next/cache'
import { emptySitemapRegistry, parseSitemapRegistry, type SitemapRegistry } from '@/lib/sitemap-registry'

export const SITEMAP_CACHE_TAG = 'sitemap-registry-v1'
const storage = { storeId: process.env.SITEMAP_STORE_ID, token: process.env.SITEMAP_READ_WRITE_TOKEN }
// The override isolates local integration checks from the production registry.
const pathname = process.env.SITEMAP_REGISTRY_PATH || 'seo/sitemap-registry.json'

export async function readSitemapSnapshot() {
  const blob = await get(pathname, {
    ...storage, access: 'private', useCache: false, abortSignal: AbortSignal.timeout(10_000),
    // Preserve the strong origin ETag used by conditional writes.
    headers: { 'Accept-Encoding': 'identity' },
  })
  if (!blob) return { registry: emptySitemapRegistry(), etag: undefined }
  if (blob.statusCode !== 200 || !blob.stream) throw new Error('Sitemap registry could not be read')
  return { registry: parseSitemapRegistry(await new Response(blob.stream).json()), etag: blob.blob.etag }
}

export async function writeSitemapSnapshot(registry: SitemapRegistry, etag?: string) {
  return put(pathname, JSON.stringify(parseSitemapRegistry(registry)), {
    ...storage, access: 'private', addRandomSuffix: false, allowOverwrite: Boolean(etag), ifMatch: etag,
    contentType: 'application/json', cacheControlMaxAge: 60, abortSignal: AbortSignal.timeout(10_000),
  })
}

export const getSitemapRegistry = unstable_cache(async () => {
  if (!process.env.SITEMAP_STORE_ID && !process.env.SITEMAP_READ_WRITE_TOKEN) {
    if (process.env.VERCEL_ENV === 'production') throw new Error('Sitemap storage is not configured')
    return emptySitemapRegistry()
  }
  const { registry, etag } = await readSitemapSnapshot()
  // Never replace an existing sitemap with an empty response during an outage.
  if (!etag) throw new Error('Sitemap registry has not been initialized')
  return registry
}, [SITEMAP_CACHE_TAG, pathname, process.env.SITEMAP_STORE_ID || 'default'], {
  revalidate: 86400, tags: [SITEMAP_CACHE_TAG],
})
