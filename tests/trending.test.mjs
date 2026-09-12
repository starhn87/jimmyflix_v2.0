import assert from 'node:assert/strict'
import test from 'node:test'
import { selectRankedTitles, selectRediscoveredTitles, selectRepresentativeCredits } from '../lib/trending.ts'

const movie = (id, overrides = {}) => ({
  id, title: `Movie ${id}`, media_type: 'movie', poster_path: `/${id}.jpg`,
  vote_average: 7, vote_count: 100, popularity: id * 10, ...overrides,
})

test('rediscovery uses the five-year cutoff, valid dates and actual trends, preserving distinct film and series IDs', () => {
  const movies = [movie(1, { release_date: '2021-09-13' }), movie(2, { release_date: '2021-09-14' }),
    movie(3, { release_date: '' }), movie(4, { release_date: 'invalid' }),
    movie(5, { release_date: '2000-01-01', adult: true }), movie(6, { release_date: '1990-01-01' })]
  const shows = [movie(1, { media_type: 'tv', first_air_date: '2000-01-01' })]
  assert.deepEqual(selectRediscoveredTitles(movies, shows, new Date('2026-09-13T00:00:00Z'))
    .map(({ id, media_type }) => [media_type, id]), [['movie', 1], ['tv', 1], ['movie', 6]])
  assert.equal(movies[0].media_type, 'movie')
  assert.deepEqual(selectRediscoveredTitles([], [], new Date('2026-09-13T00:00:00Z')), [])
})

test('Top 10 preserves the trend response order rather than re-sorting by popularity or rating', () => {
  const source = Array.from({ length: 20 }, (_, index) => movie(index + 1))
  const ranked = selectRankedTitles(source, 'movie')
  assert.deepEqual(ranked.map(({ id }) => id), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  assert.equal(source.length, 20)
})

test('rankings remove duplicates, adult entries and wrong media types without excluding missing artwork', () => {
  const source = [movie(1), movie(1), movie(2, { adult: true }), movie(3, { media_type: 'tv' }),
    movie(4, { poster_path: null }), movie(0), movie(5, { media_type: undefined })]
  assert.deepEqual(selectRankedTitles(source, 'movie').map(({ id }) => id), [1, 4, 5])
  assert.deepEqual(selectRankedTitles([], 'tv'), [])
})

test('representative works merge cast and crew duplicates while retaining distinct movie and TV IDs', () => {
  const credits = [movie(1), movie(1), movie(2, { adult: true }), movie(3, { poster_path: null }),
    movie(1, { media_type: 'tv', name: 'A series', popularity: 100 })]
  const result = selectRepresentativeCredits(credits)
  assert.deepEqual(result.map(({ id, media_type }) => [media_type, id]), [['tv', 1], ['movie', 1]])
  assert.equal(credits[0].media_type, 'movie')
})

test('representative works exclude talk shows, self appearances and barely rated titles', () => {
  const credits = [movie(1, { genre_ids: [10767] }), movie(2, { character: 'Self - Guest' }),
    movie(3, { vote_count: 2 }), movie(4, { character: 'Ethan Hunt', vote_count: 1000 }),
    movie(5, { job: 'Thanks', vote_count: 2000 }), movie(6, { character: 'Jack', vote_count: 500 })]
  assert.deepEqual(selectRepresentativeCredits(credits, 'Acting').map(({ id }) => id), [4, 6])
})

test('a director is represented by directed films rather than popular cameo appearances', () => {
  const credits = [movie(1, { character: 'Passenger', vote_count: 10000 }),
    movie(2, { job: 'Director', vote_count: 5000 }), movie(3, { job: 'Thanks', vote_count: 8000 })]
  assert.deepEqual(selectRepresentativeCredits(credits, 'Directing').map(({ id }) => id), [2])
})
