import assert from 'node:assert/strict'
import test from 'node:test'
import { emptySitemapRegistry, mergeSitemapRegistry, parseSitemapRegistry, selectSitemapChecks, sitemapPageCount, sitemapPagePaths, SITEMAP_RECORDS_PER_PAGE } from '../lib/sitemap-registry.ts'
import { collectSitemap } from '../lib/sitemap-collector.ts'
import { sitemapIndexXml, sitemapPageXml } from '../lib/sitemap-xml.ts'
import { isCronAuthorized } from '../lib/cron-auth.ts'

const day1 = '2026-09-01T00:00:00.000Z'
const day2 = '2026-09-02T00:00:00.000Z'
const day3 = '2026-09-03T00:00:00.000Z'
const film = { path: '/movies/42', images: { en: 'https://image.tmdb.org/t/p/original/en.jpg' } }
const seeded = () => mergeSitemapRegistry(emptySitemapRegistry(), [film], [], day1)

test('discovery is additive across restarts and lists, preserving IDs and localized images', () => {
  const previous = parseSitemapRegistry(JSON.parse(JSON.stringify(seeded())))
  const next = mergeSitemapRegistry(previous, [{ path: '/tv/42' }], [], day2)
  assert.deepEqual(next.entries.map(({ path }) => path), ['/movies/42', '/tv/42'])
  assert.equal(next.entries[0].lastSeenAt, day1)
  const localized = mergeSitemapRegistry(next, [{ path: '/movies/42', images: { en: undefined, ko: 'https://image.tmdb.org/t/p/original/ko.jpg' } }], [], day3)
  assert.equal(localized.entries[0].images.en, film.images.en)
  assert.match(localized.entries[0].images.ko, /ko.jpg$/)
  assert.equal(localized.entries[0].firstSeenAt, day1)
  assert.equal(previous.entries[0].lastSeenAt, day1)
})

test('only repeated 404s at least a day apart exclude a URL; errors and retries cannot', () => {
  const check = (status, checkedAt) => ({ path: film.path, status, checkedAt })
  const first = mergeSitemapRegistry(seeded(), [], [check('missing', day1)], day1)
  assert.equal(first.entries[0].excludedAt, undefined)
  const retry = mergeSitemapRegistry(first, [], [check('missing', '2026-09-01T01:00:00.000Z')], day1)
  assert.equal(retry.entries[0].excludedAt, undefined)
  const outage = mergeSitemapRegistry(retry, [], [check('unknown', day2)], day2)
  assert.equal(outage.entries[0].excludedAt, undefined)
  const excluded = mergeSitemapRegistry(outage, [], [check('missing', day3)], day3)
  assert.equal(excluded.entries[0].excludedAt, day3)
  assert.ok(!sitemapPagePaths(excluded, 0).some(({ path }) => path === film.path))
  const restored = mergeSitemapRegistry(excluded, [film], [], day3)
  assert.equal(restored.entries[0].excludedAt, undefined)
  assert.equal(restored.entries[0].firstSeenAt, day1)
})

test('validation skips currently visible titles and rotates through old entries with a bounded batch', () => {
  const registry = mergeSitemapRegistry(emptySitemapRegistry(), Array.from({ length: 60 }, (_, i) => ({ path: `/movies/${i + 1}` })), [], day1)
  const found = [{ path: '/movies/1' }]
  assert.equal(selectSitemapChecks(registry, found, day2).length, 0)
  const candidates = selectSitemapChecks(registry, found, '2026-09-09T00:00:00.000Z')
  assert.equal(candidates.length, 20)
  assert.equal(candidates[0].path, '/movies/2')
})

test('invalid or duplicate persistent data fails instead of silently replacing the sitemap', () => {
  assert.throws(() => parseSitemapRegistry({ version: 2, entries: [] }))
  assert.throws(() => parseSitemapRegistry({ ...seeded(), entries: [seeded().entries[0], seeded().entries[0]] }))
  assert.throws(() => parseSitemapRegistry({ ...seeded(), entries: [{ ...seeded().entries[0], path: '/search?query=x' }] }))
})

test('sitemap chunks retain stable record positions, locales and proper XML escaping without artificial lastmod', () => {
  const registry = mergeSitemapRegistry(emptySitemapRegistry(), Array.from({ length: SITEMAP_RECORDS_PER_PAGE + 1 }, (_, i) => ({ path: `/movies/${i + 1}` })), [], day1)
  assert.equal(sitemapPageCount(registry), 2)
  registry.entries[0].excludedAt = day2
  assert.deepEqual(sitemapPagePaths(registry, 1).map(({ path }) => path), [`/movies/${SITEMAP_RECORDS_PER_PAGE + 1}`])
  assert.equal(sitemapPagePaths(registry, 2).length, 0)
  assert.match(sitemapIndexXml(registry), /sitemaps\/1.xml/)
  const image = 'https://image.tmdb.org/t/p/original/image.jpg?a=1&b=2'
  const simple = mergeSitemapRegistry(emptySitemapRegistry(), [{ path: film.path, images: { en: image } }], [], day1)
  const xml = sitemapPageXml(simple, 0)
  assert.equal((xml.match(/<url>/g) || []).length, 8)
  assert.match(xml, /hreflang="ko-KR"/)
  assert.match(xml, /a=1&amp;b=2/)
  assert.ok(!xml.includes('<lastmod>'))
})

test('duplicate daily invocations skip network work and failed discovery preserves storage', async () => {
  const registry = seeded()
  const forbidden = async () => { assert.fail('This operation must not run') }
  const result = await collectSitemap({ read: async () => ({ registry, etag: 'a' }), write: forbidden, discover: forbidden, check: forbidden }, day1)
  assert.equal(result.updated, false)
  await assert.rejects(collectSitemap({ read: async () => ({ registry, etag: 'a' }), write: forbidden,
    discover: async () => { throw new Error('TMDB outage') }, check: forbidden }, day2), /TMDB outage/)
})

test('a conflicting write re-reads and merges without losing addresses saved by another writer', async () => {
  let snapshot = { registry: seeded(), etag: 'a' }
  let writes = 0
  const result = await collectSitemap({
    read: async () => snapshot,
    discover: async () => [{ path: '/tv/9' }], check: async () => 'available',
    write: async (registry, etag) => {
      writes++
      if (writes === 1) {
        snapshot = { registry: mergeSitemapRegistry(snapshot.registry, [{ path: '/people/7' }], [], day1), etag: 'b' }
        throw new Error('ETag conflict')
      }
      assert.equal(etag, 'b')
      snapshot = { registry, etag: 'c' }
    },
  }, day2)
  assert.equal(result.updated, true)
  assert.deepEqual(snapshot.registry.entries.map(({ path }) => path), ['/movies/42', '/people/7', '/tv/9'])
})

test('cron authentication fails closed when the secret is missing or credentials are wrong', () => {
  assert.equal(isCronAuthorized('Bearer undefined', undefined), false)
  assert.equal(isCronAuthorized(null, 'secret'), false)
  assert.equal(isCronAuthorized('Bearer wrong!', 'secret'), false)
  assert.equal(isCronAuthorized('Bearer secret', 'secret'), true)
})
