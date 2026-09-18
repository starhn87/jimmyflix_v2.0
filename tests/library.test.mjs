import test from 'node:test'
import assert from 'node:assert/strict'
import { parseLibraryEntries, updateLibraryEntries } from '../lib/library.ts'

const movie = {
  id: 1,
  title: 'Movie 1',
  poster_path: '/movie.jpg',
  vote_average: 8,
  media_type: 'movie',
}

const show = {
  id: 1,
  name: 'Series 1',
  poster_path: '/series.jpg',
  vote_average: 7,
  media_type: 'tv',
}

test('library parsing keeps valid movie and TV entries distinct and rejects malformed data', () => {
  const entries = parseLibraryEntries([
    { item: movie, status: 'watchlist', updatedAt: '2026-01-01T00:00:00.000Z' },
    { item: show, status: 'watched', updatedAt: '2026-01-02T00:00:00.000Z' },
    { item: movie, status: 'hidden', updatedAt: '2026-01-03T00:00:00.000Z' },
    { item: { ...movie, id: 0 }, status: 'watchlist', updatedAt: '2026-01-01T00:00:00.000Z' },
    { item: movie, status: 'unknown', updatedAt: '2026-01-01T00:00:00.000Z' },
  ])

  assert.equal(entries.length, 2)
  assert.deepEqual(entries.map(({ item, status }) => [item.media_type, status]), [
    ['movie', 'watchlist'],
    ['tv', 'watched'],
  ])
})

test('updating a title moves it between mutually exclusive states and clearing removes it', () => {
  const first = updateLibraryEntries([], movie, 'watchlist', '2026-01-01T00:00:00.000Z')
  const second = updateLibraryEntries(first, movie, 'watched', '2026-01-02T00:00:00.000Z')
  assert.equal(second.length, 1)
  assert.equal(second[0].status, 'watched')
  assert.equal(second[0].updatedAt, '2026-01-02T00:00:00.000Z')
  assert.deepEqual(updateLibraryEntries(second, movie, null), [])
})
