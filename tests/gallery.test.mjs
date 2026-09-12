import assert from 'node:assert/strict'
import test from 'node:test'
import { getGalleryImages, getGalleryIndex, GALLERY_PREVIEW_LIMIT } from '../lib/gallery.ts'

const image = (id, overrides = {}) => ({
  file_path: `/scene-${id}.jpg`, width: 1920, height: 1080,
  aspect_ratio: 16 / 9, iso_639_1: null, vote_average: 5, ...overrides,
})

test('the full gallery preserves image order beyond the preview limit, without duplicate slides', () => {
  const images = Array.from({ length: 50 }, (_, index) => image(index))
  const gallery = getGalleryImages([images[0], ...images, images[2]])
  assert.equal(gallery.length, 50)
  assert.ok(gallery.length > GALLERY_PREVIEW_LIMIT)
  assert.equal(gallery.at(-1).file_path, '/scene-49.jpg')
  assert.deepEqual(gallery[0], { file_path: '/scene-0.jpg', width: 1920, height: 1080 })
})

test('invalid images cannot become empty slides, and different original aspect ratios are retained', () => {
  const gallery = getGalleryImages([
    image(0, { file_path: '' }), image(1, { width: 0 }), image(2, { height: NaN }),
    image(3, { width: 1080, height: 1920 }), image(4, { width: 2400, height: 1000 }),
  ])
  assert.deepEqual(gallery.map(({ width, height }) => [width, height]), [[1080, 1920], [2400, 1000]])
})

test('navigation wraps in both directions and handles single or empty galleries', () => {
  assert.equal(getGalleryIndex(50, 50), 0)
  assert.equal(getGalleryIndex(-1, 50), 49)
  assert.equal(getGalleryIndex(7, 50), 7)
  assert.equal(getGalleryIndex(-1, 1), 0)
  assert.equal(getGalleryIndex(1, 1), 0)
  assert.equal(getGalleryIndex(1, 0), 0)
})
