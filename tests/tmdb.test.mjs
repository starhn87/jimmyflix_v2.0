import assert from 'node:assert/strict'
import test from 'node:test'
import { tmdbFetch, sitemapFetchScope, TmdbNotFoundError, TmdbRequestError } from '../lib/tmdb/client.ts'
import { getMovieDetail, getRelatedTitles } from '../lib/tmdb/detail.ts'
import { getPagedMediaItems } from '../lib/tmdb/lists.ts'
import { getStreamingDiscovery } from '../lib/tmdb/streaming.ts'
import { getTrendingPeople, getTrendingRankingRequests, getTrendingRediscovery } from '../lib/tmdb/trending.ts'

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

test('streaming choices keep Korean movie and TV availability separate from US services', async (t) => {
  const requests = []
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (url.pathname.includes('/discover/')) requests.push(url)
    return Response.json({ results: url.pathname.includes('/discover/') ? [movie(1)] : [] })
  })
  for (const [kind, provider, expected] of [['movie', 350, 350], ['movie', 1883, 1883], ['tv', 1881, 1881], ['movie', 1881, 8], ['tv', 2303, 8]]) {
    const result = await getStreamingDiscovery(kind, provider, 'ko', 20)
    assert.equal(result.selectedProviderId, expected)
    assert.equal(result.section.items.length, 1)
    assert.ok(!result.providers.some(({ provider_id }) => provider_id === 2303))
    assert.equal(result.providers.some(({ provider_id }) => provider_id === 1881), kind === 'tv')
    const request = requests.at(-1)
    assert.equal(request.pathname, `/3/discover/${kind}`)
    assert.equal(request.searchParams.get('watch_region'), 'KR')
    assert.equal(request.searchParams.get('with_watch_providers'), String(expected))
    assert.equal(request.searchParams.get('with_watch_monetization_types'), 'flatrate')
  }
})

test('US subscription tiers share one tab and use OR discovery without channel add-ons', async (t) => {
  const requests = []
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (url.pathname.includes('/discover/')) {
      requests.push(url)
      return Response.json({ results: [movie(1)] })
    }
    // If the primary tier's metadata is absent, use the sibling tier's logo.
    return Response.json({ results: [
      { provider_id: 2616, provider_name: 'Paramount Plus Essential', logo_path: '/paramount.jpg', display_priority: 1 },
      { provider_id: 387, provider_name: 'Peacock Premium Plus', logo_path: '/peacock.jpg', display_priority: 2 },
    ] })
  })
  for (const kind of ['movie', 'tv']) {
    for (const [id, name, tiers, logo] of [[2303, 'Paramount+', '2303|2616', '/paramount.jpg'], [386, 'Peacock', '386|387', '/peacock.jpg']]) {
      const result = await getStreamingDiscovery(kind, id, 'en', 20)
      const selected = result.providers.filter(({ selected }) => selected)
      assert.equal(selected.length, 1)
      assert.equal(selected[0].provider_id, id)
      assert.equal(selected[0].provider_name, name)
      assert.equal(selected[0].logo_path, logo)
      assert.ok(!result.providers.some(({ provider_id }) => [2616, 387].includes(provider_id)))
      assert.equal(requests.at(-1).searchParams.get('watch_region'), 'US')
      assert.equal(requests.at(-1).searchParams.get('with_watch_providers'), tiers)
      assert.match(result.section.title, new RegExp(name.replace('+', '\\+')))
    }
  }
})

test('new streaming tabs and title results survive unavailable provider metadata', async (t) => {
  t.mock.method(console, 'warn', () => {})
  t.mock.method(globalThis, 'fetch', async (url) => url.pathname.includes('/watch/providers/')
    ? new Response('', { status: 503 }) : Response.json({ results: [movie(1)] }))
  for (const [locale, id, name] of [['ko', 350, 'Apple TV'], ['en', 2303, 'Paramount+']]) {
    const result = await getStreamingDiscovery('movie', id, locale, 20)
    assert.equal(result.providers.find(({ selected }) => selected).provider_name, name)
    assert.deepEqual(result.section.items, [movie(1)])
    assert.equal(result.section.error, false)
  }
})

test('Top 20 rankings load just the first page independently of supplemental sections', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ results: Array.from({ length: 20 }, (_, i) => movie(i + 1)) }))
  const sections = await Promise.all(getTrendingRankingRequests('day', 'en').map(({ request }) => request))
  assert.deepEqual(sections.map(({ items }) => items.length), [20, 20])
  assert.equal(fetch.mock.callCount(), 2)
  assert.ok(fetch.mock.calls.every(({ arguments: [url] }) => url.searchParams.get('page') === '1'))
})

test('rediscovery reaches older titles beyond page two and caps the mixed selection at forty', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async (url) => {
    const page = Number(url.searchParams.get('page'))
    const date = page <= 2 ? '2099-01-01' : '2000-01-01'
    return Response.json({ total_pages: 10, results: Array.from({ length: 20 }, (_, i) => ({ ...movie((page - 1) * 20 + i + 1), release_date: date, first_air_date: date })) })
  })
  const result = await getTrendingRediscovery('week', 'ko')
  assert.equal(result.items.length, 40)
  assert.deepEqual(result.items.slice(0, 4).map(({ id, media_type }) => [id, media_type]), [[41, 'movie'], [41, 'tv'], [42, 'movie'], [42, 'tv']])
  assert.equal(result.partial, false)
  assert.equal(fetch.mock.callCount(), 10)
  assert.ok(fetch.mock.calls.every(({ arguments: [url] }) => Number(url.searchParams.get('page')) <= 5))
})

test('rediscovery retains one successful category and respects the available page count', async (t) => {
  t.mock.method(console, 'warn', () => {})
  const fetch = t.mock.method(globalThis, 'fetch', async (url) => url.pathname.includes('/movie/')
    ? new Response('', { status: 503 })
    : Response.json({ total_pages: 1, results: [{ ...movie(1), first_air_date: '2000-01-01' }] }))
  const result = await getTrendingRediscovery('day', 'en')
  assert.equal(result.items.length, 1)
  assert.equal(result.items[0].media_type, 'tv')
  assert.equal(result.partial, true)
  assert.equal(result.error, false)
  assert.equal(fetch.mock.callCount(), 2)
})

test('people backfill missing profiles from page two without requesting their filmographies', async (t) => {
  const requested = []
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (url.pathname.endsWith('/combined_credits')) {
      const id = Number(url.pathname.split('/')[3])
      requested.push(id)
      return Response.json({ cast: [{ ...movie(id), poster_path: '/poster.jpg', vote_count: 1000, media_type: 'movie' }], crew: [] })
    }
    const page = Number(url.searchParams.get('page'))
    return Response.json({ results: Array.from({ length: 20 }, (_, i) => ({
      id: (page - 1) * 20 + i + 1, name: `Person ${i}`, adult: page === 1 && i < 2,
      profile_path: page === 1 && i >= 2 && i < 6 ? [null, '', undefined, '  '][i - 2] : '/profile.jpg',
      known_for_department: 'Acting',
    })) })
  })
  const result = await getTrendingPeople('day', 'en')
  assert.deepEqual(result.people.map(({ id }) => id), Array.from({ length: 20 }, (_, i) => i + 7))
  assert.deepEqual(requested, Array.from({ length: 20 }, (_, i) => i + 7))
  assert.equal(result.partial, false)
})
