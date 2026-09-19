import assert from 'node:assert/strict'
import test from 'node:test'
import { getResponsiveTmdbImageUrl } from '../lib/tmdb-image-loader.ts'

const image = 'https://image.tmdb.org/t/p/original/example.jpg'

test('maps responsive widths to supported TMDB poster sizes', () => {
  assert.equal(getResponsiveTmdbImageUrl(image, 384, 'poster'), 'https://image.tmdb.org/t/p/w500/example.jpg')
  assert.equal(getResponsiveTmdbImageUrl(image, 768, 'poster'), 'https://image.tmdb.org/t/p/w780/example.jpg')
  assert.equal(getResponsiveTmdbImageUrl(image, 1280, 'poster'), image)
})

test('uses larger TMDB sources only for artwork that needs them', () => {
  assert.equal(getResponsiveTmdbImageUrl(image, 384, 'backdrop'), 'https://image.tmdb.org/t/p/w780/example.jpg')
  assert.equal(getResponsiveTmdbImageUrl(image, 1280, 'backdrop'), 'https://image.tmdb.org/t/p/w1280/example.jpg')
  assert.equal(getResponsiveTmdbImageUrl(image, 1920, 'backdrop'), image)
  assert.equal(getResponsiveTmdbImageUrl(image, 384, 'profile'), 'https://image.tmdb.org/t/p/h632/example.jpg')
  assert.equal(getResponsiveTmdbImageUrl(image, 768, 'profile'), image)
  assert.equal(getResponsiveTmdbImageUrl(image, 300, 'still'), 'https://image.tmdb.org/t/p/w300/example.jpg')
})

test('leaves non-TMDB and malformed sources unchanged', () => {
  assert.equal(getResponsiveTmdbImageUrl('/images/defaultPoster.png', 384, 'poster'), '/images/defaultPoster.png')
  assert.equal(getResponsiveTmdbImageUrl('https://example.com/t/p/original/example.jpg', 384, 'poster'), 'https://example.com/t/p/original/example.jpg')
  assert.equal(getResponsiveTmdbImageUrl('https://image.tmdb.org/example.jpg', 384, 'poster'), 'https://image.tmdb.org/example.jpg')
})
