import assert from 'node:assert/strict'
import test from 'node:test'
import { createStreamingCache } from '../lib/streaming-cache.ts'
import { getStreamingUrl, STREAMING_CACHE_SECONDS } from '../lib/streaming.ts'
import { GET } from '../app/api/streaming/route.ts'

const section = (title = 'Netflix') => ({ id: 'streaming-movie', title, description: '', mediaType: 'movie', items: [{ id: 1, title }] })
const key = getStreamingUrl('en', 'US', 'movie', 8)

test('server-rendered results are reused without a duplicate request', async (t) => {
  const cache = createStreamingCache()
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected request') })
  const data = section()
  cache.seed(key, { data, updatedAt: Date.now() })
  await cache.load(key)
  assert.equal(cache.read(key).data, data)
  assert.equal(fetch.mock.callCount(), 0)
})

test('prefetch and selection share one request; locale, region, kind and provider have distinct keys', async (t) => {
  const cache = createStreamingCache()
  let release
  const fetch = t.mock.method(globalThis, 'fetch', () => new Promise((resolve) => { release = resolve }))
  const first = cache.load(key)
  assert.equal(cache.load(key), first)
  release(Response.json(section()))
  await first
  await cache.load(key)
  assert.equal(fetch.mock.callCount(), 1)
  for (const alternate of [getStreamingUrl('ko', 'US', 'movie', 8), getStreamingUrl('en', 'KR', 'movie', 8), getStreamingUrl('en', 'US', 'tv', 8), getStreamingUrl('en', 'US', 'movie', 350)]) {
    assert.equal(cache.read(alternate), undefined)
  }
})

test('expired data stays visible during refresh and failures can be retried', async (t) => {
  const cache = createStreamingCache()
  const old = section('Old')
  cache.seed(key, { data: old, updatedAt: Date.now() - STREAMING_CACHE_SECONDS * 1000 - 1 })
  let fail = true
  const fetch = t.mock.method(globalThis, 'fetch', async () => fail ? new Response('', { status: 503 }) : Response.json(section('Fresh')))
  await cache.load(key)
  assert.equal(cache.read(key).data, old)
  assert.equal(cache.read(key).error, true)
  fail = false
  await cache.load(key)
  assert.equal(fetch.mock.callCount(), 2)
  assert.equal(cache.read(key).data.title, 'Fresh')
  assert.equal(cache.read(key).error, undefined)
})

test('late requests stay scoped to their keys and cache size remains bounded', async (t) => {
  const cache = createStreamingCache(2)
  const other = getStreamingUrl('en', 'US', 'movie', 350)
  let release
  t.mock.method(globalThis, 'fetch', async (url) => url === key ? new Promise((resolve) => { release = resolve }) : Response.json(section('Apple')))
  const slow = cache.load(key)
  await cache.load(other)
  release(Response.json(section('Netflix')))
  await slow
  assert.equal(cache.read(other).data.title, 'Apple')
  assert.equal(cache.read(key).data.title, 'Netflix')
  await cache.load(other)
  cache.seed('third', { data: section(), updatedAt: Date.now() })
  assert.equal(cache.read(key), undefined)
  assert.ok(cache.read(other))
})

test('streaming API rejects invalid scopes without calling TMDB', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', () => { throw new Error('Unexpected TMDB request') })
  for (const query of ['locale=fr&region=US&kind=movie&provider=8', 'locale=en&region=XX&kind=movie&provider=8', 'locale=ko&region=KR&kind=movie&provider=2303', 'locale=en&region=US&kind=person&provider=8']) {
    const response = await GET(new Request(`http://localhost/api/streaming?${query}`))
    assert.equal(response.status, 400)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  }
  assert.equal(fetch.mock.callCount(), 0)
})

test('streaming API caches complete results, but not failures or partial lists', async (t) => {
  process.env.TMDB_API_KEY = 'fixture'
  t.mock.method(console, 'warn', () => {})
  let failure = ''
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (url.pathname.includes('/discover/') && (failure === 'all' || (failure === 'partial' && url.searchParams.get('page') === '2'))) return new Response('', { status: 503 })
    return Response.json({ results: url.pathname.includes('/discover/') ? [{ id: Number(url.searchParams.get('page')), title: 'Movie' }] : [] })
  })
  const request = () => GET(new Request(`http://localhost${key}`))
  const complete = await request()
  assert.equal(complete.status, 200)
  assert.match(complete.headers.get('cache-control'), /max-age=1800/)
  assert.match(complete.headers.get('vercel-cdn-cache-control'), /s-maxage=1800/)
  failure = 'partial'
  const partial = await request()
  assert.equal(partial.status, 200)
  assert.equal(partial.headers.get('cache-control'), 'no-store')
  assert.equal((await partial.json()).partial, true)
  failure = 'all'
  const error = await request()
  assert.equal(error.status, 503)
  assert.equal(error.headers.get('cache-control'), 'no-store')
})
