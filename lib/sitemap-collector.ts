import type { SitemapPath } from '@/lib/sitemap'
import { mergeSitemapRegistry, selectSitemapChecks, type SitemapRegistry, type SitemapCheck } from '@/lib/sitemap-registry'

interface Snapshot { registry: SitemapRegistry; etag?: string }
interface CollectorDependencies {
  read: () => Promise<Snapshot>
  write: (registry: SitemapRegistry, etag?: string) => Promise<unknown>
  discover: () => Promise<SitemapPath[]>
  check: (path: string) => Promise<SitemapCheck['status']>
}

const koreaDate = (date: string) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date(date))

export async function collectSitemap(dependencies: CollectorDependencies, now = new Date().toISOString()) {
  let snapshot = await dependencies.read()
  const alreadyCollected = (registry: SitemapRegistry) => registry.collectedAt
    && koreaDate(registry.collectedAt) >= koreaDate(now)
  if (alreadyCollected(snapshot.registry)) return { updated: false, registry: snapshot.registry, checked: 0 }

  // A discovery outage aborts the refresh; old entries are never replaced by an empty list.
  const discoveries = await dependencies.discover()
  if (discoveries.length === 0) throw new Error('No sitemap discoveries returned')
  const candidates = selectSitemapChecks(snapshot.registry, discoveries, now)
  const checks: SitemapCheck[] = []
  for (let index = 0; index < candidates.length; index += 5) {
    checks.push(...await Promise.all(candidates.slice(index, index + 5).map(async ({ path }) => ({
      path, checkedAt: now, status: await dependencies.check(path).catch(() => 'unknown' as const),
    }))))
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    if (alreadyCollected(snapshot.registry)) return { updated: false, registry: snapshot.registry, checked: checks.length }
    const registry = mergeSitemapRegistry(snapshot.registry, discoveries, checks, now)
    try {
      await dependencies.write(registry, snapshot.etag)
      return { updated: true, registry, checked: checks.length }
    } catch (error) {
      // Re-merge only when another writer actually changed the snapshot.
      const latest = await dependencies.read()
      if (!latest.etag || latest.etag === snapshot.etag) throw error
      snapshot = latest
    }
  }
  throw new Error('Sitemap registry remained busy after concurrent writes')
}
