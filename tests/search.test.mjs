import assert from 'node:assert/strict'
import test from 'node:test'
import { runCatalogSearch } from '../lib/search.ts'

const movie = (id, overrides = {}) => ({ id, title: `Movie ${id}`, poster_path: null, vote_average: 7, media_type: 'movie', ...overrides })
const tv = (id, overrides = {}) => ({ id, name: `Show ${id}`, poster_path: null, vote_average: 8, media_type: 'tv', ...overrides })
const sources = (overrides = {}) => ({
  movies: async () => [], tv: async () => [], people: async () => [], keywords: async () => [],
  credits: async () => ({ cast: [], crew: [] }), discover: async () => [], ...overrides,
})

test('actor credits and topics add titles; repeated roles and direct hits do not duplicate cards', async () => {
  const direct = movie(1, { title: 'Direct title', popularity: 1 })
  const result = await runCatalogSearch('  Tom Hanks  ', sources({
    movies: async (query) => { assert.equal(query, 'Tom Hanks'); return [direct] },
    people: async () => [{ id: 31, name: 'Tom Hanks', known_for: [] }],
    credits: async () => ({ cast: [movie(1), movie(2), movie(2), tv(1)], crew: [movie(3)] }),
    keywords: async () => [{ id: 5, name: 'Tom Hanks' }],
    discover: async (type, ids) => { assert.deepEqual(ids, [5]); return type === 'movie' ? [movie(2), movie(4)] : [tv(1), tv(2)] },
  }))
  assert.deepEqual(result.movies.map((item) => item.id), [1, 2, 3, 4])
  assert.equal(result.movies[0].title, 'Direct title')
  assert.deepEqual(result.tvShows.map((item) => item.id), [1, 2])
  assert.deepEqual(result.people, [{ id: 31, name: 'Tom Hanks' }])
  assert.deepEqual(result.unavailable, [])
})

test('exact person and topic names win over partial matches; adult people and titles stay excluded', async () => {
  const requested = []
  const result = await runCatalogSearch('TIME TRAVEL', sources({
    movies: async () => [movie(1, { adult: true })],
    people: async () => [
      { id: 1, name: 'Time Traveller', known_for: [] },
      { id: 2, name: 'Time Travel', adult: true, known_for: [] },
      { id: 3, name: 'Time Travel', known_for: [] },
    ],
    credits: async (id) => { requested.push(id); return { cast: [movie(2), tv(3, { adult: true })], crew: [] } },
    keywords: async () => [{ id: 11, name: 'time travel machine' }, { id: 12, name: 'time travel' }],
    discover: async (type, ids) => { assert.deepEqual(ids, [12]); return type === 'movie' ? [movie(4, { adult: true }), movie(5)] : [] },
  }))
  assert.deepEqual(requested, [3])
  assert.deepEqual(result.movies.map((item) => item.id), [2, 5])
  assert.deepEqual(result.tvShows, [])
})

test('failed sources preserve successful results and known-for fallback, and remain distinguishable from no matches', async () => {
  const fail = async () => { throw new Error('unavailable') }
  const result = await runCatalogSearch('actor', sources({
    movies: fail, tv: async () => [tv(1)],
    people: async () => [{ id: 3, name: 'Actor', known_for: [movie(2)] }],
    credits: fail, keywords: fail,
  }))
  assert.deepEqual(result.movies.map((item) => item.id), [2])
  assert.deepEqual(result.tvShows.map((item) => item.id), [1])
  assert.deepEqual(new Set(result.unavailable), new Set(['Movie titles', 'Topics', 'Credits for Actor']))
  const empty = await runCatalogSearch('no matches', sources())
  assert.deepEqual(empty.unavailable, [])
  assert.equal(empty.movies.length + empty.tvShows.length, 0)
})

test('broad searches limit person expansion, keyword filters, and rendered results', async () => {
  const ids = []
  const result = await runCatalogSearch('broad', sources({
    people: async () => Array.from({ length: 20 }, (_, id) => ({ id: id + 1, name: `Person ${id}`, known_for: [] })),
    credits: async (id) => { ids.push(id); return { cast: Array.from({ length: 100 }, (_, index) => movie(index + 1)), crew: [] } },
    keywords: async () => Array.from({ length: 20 }, (_, id) => ({ id: id + 1, name: `Topic ${id}` })),
    discover: async (_type, keywordIds) => { assert.equal(keywordIds.length, 3); return [] },
  }))
  assert.equal(ids.length, 3)
  assert.equal(result.movies.length, 60)
})

test('search branches run together and people expand without waiting for title searches', async () => {
  const started = []
  let releaseMovies
  const pendingMovies = new Promise((resolve) => { releaseMovies = resolve })
  const result = runCatalogSearch('actor', sources({
    movies: () => { started.push('movies'); return pendingMovies },
    tv: async () => { started.push('tv'); return [] },
    people: async () => { started.push('people'); return [{ id: 3, name: 'Actor', known_for: [] }] },
    keywords: async () => { started.push('keywords'); return [] },
    credits: async () => { started.push('credits'); return { cast: [movie(1)], crew: [] } },
  }))
  await new Promise((resolve) => setImmediate(resolve))
  assert.deepEqual(started, ['movies', 'tv', 'people', 'keywords', 'credits'])
  releaseMovies([])
  assert.equal((await result).movies.length, 1)
})

test('blank and oversized queries make no requests', async () => {
  const unexpected = async () => { assert.fail('should not search') }
  const provider = sources({ movies: unexpected, tv: unexpected, people: unexpected, keywords: unexpected })
  assert.deepEqual((await runCatalogSearch('   ', provider)).movies, [])
  await assert.rejects(runCatalogSearch('x'.repeat(201), provider), RangeError)
})
