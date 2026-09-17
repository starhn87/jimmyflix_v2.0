import assert from 'node:assert/strict'
import test from 'node:test'
import { tmdbFetch, sitemapFetchScope, TmdbNotFoundError, TmdbRequestError } from '../lib/tmdb/client.ts'
import { getMovieDetail, getRelatedTitles } from '../lib/tmdb/detail.ts'
import { getPagedMediaItems } from '../lib/tmdb/lists.ts'

process.env.TMDB_API_KEY = 'test-credential-do-not-log'
const movie = (id) => ({ id, title: `Movie ${id}`, poster_path: null, vote_average: 7 })

test('every request has a deadline and fresh sitemap requests do not change catalog caching', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ results: [] }))
  await tmdbFetch('movie/popular', { page: 1 }, { locale: 'ko' })
  await sitemapFetchScope.run(true, () => tmdbFetch('movie/popular'))
  await tmdbFetch('movie/popular')
  const calls = fetch.mock.calls.map(({ arguments: [url, options] }) => ({ url, options }))
  assert.ok(calls.every(({ options }) => options.signal instanceof AbortSignal))
  assert.equal(calls[0].options.next.revalidate, 1800)
  assert.equal(calls[0].url.searchParams.get('language'), 'ko-KR')
  assert.equal(calls[1].options.cache, 'no-store')
  assert.equal(calls[2].options.next.revalidate, 1800)
})

test('timeouts are bounded and logged without credentials, queries or raw upstream errors', async (t) => {
  const logs = t.mock.method(console, 'warn', () => {})
  t.mock.method(globalThis, 'fetch', (_url, { signal }) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(Response.json({})), 200)
    signal.addEventListener('abort', () => { clearTimeout(timer); reject(new Error('raw upstream secret')) }, { once: true })
  }))
  await assert.rejects(tmdbFetch('search/movie', { query: 'private query' }, { timeoutMs: 10 }), (error) => error instanceof TmdbRequestError && error.reason === 'timeout')
  const output = JSON.stringify(logs.mock.calls.map(({ arguments: args }) => args))
  assert.match(output, /timeout/)
  for (const secret of ['test-credential-do-not-log', 'private query', 'raw upstream secret', 'api_key']) assert.ok(!output.includes(secret))
})

test('404 remains distinguishable from service failure and invalid JSON', async (t) => {
  const logs = t.mock.method(console, 'warn', () => {})
  const responses = [new Response('', { status: 404 }), new Response('', { status: 429 }), new Response('invalid json')]
  t.mock.method(globalThis, 'fetch', async () => responses.shift())
  await assert.rejects(tmdbFetch('movie/1'), TmdbNotFoundError)
  await assert.rejects(tmdbFetch('movie/2'), (error) => error.status === 429)
  await assert.rejects(tmdbFetch('movie/3'), (error) => error.reason === 'payload')
  assert.equal(logs.mock.callCount(), 2)
})

test('Korean detail and poster data do not request or await supplemental English videos', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ ...movie(2), videos: { results: [] } }))
  assert.equal((await getMovieDetail(2, 'ko')).title, 'Movie 2')
  assert.equal(fetch.mock.callCount(), 1)
  assert.equal(fetch.mock.calls[0].arguments[0].pathname, '/3/movie/2')
})

test('recommendation failures never masquerade as an empty successful list', async (t) => {
  t.mock.method(console, 'warn', () => {})
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }))
  await assert.rejects(getRelatedTitles('movie', 1, 'en'), TmdbRequestError)
})

test('successful related titles survive a partial outage and carry a partial flag', async (t) => {
  t.mock.method(console, 'warn', () => {})
  t.mock.method(globalThis, 'fetch', async (url) => url.pathname.endsWith('/similar')
    ? new Response('', { status: 503 }) : Response.json({ results: [movie(1), movie(2), movie(2)] }))
  assert.deepEqual(await getRelatedTitles('movie', 1, 'en'), { items: [movie(2)], partial: true })
})

test('a successful empty catalog and a missing second page have different result states', async (t) => {
  t.mock.method(console, 'warn', () => {})
  let failSecond = false
  t.mock.method(globalThis, 'fetch', async (url) => failSecond && url.searchParams.get('page') === '2'
    ? new Response('', { status: 503 }) : Response.json({ results: [] }))
  assert.deepEqual(await getPagedMediaItems('movie/popular', {}, {}), { items: [], partial: false })
  failSecond = true
  assert.deepEqual(await getPagedMediaItems('movie/popular', {}, {}), { items: [], partial: true })
})
