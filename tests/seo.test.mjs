import assert from 'node:assert/strict'
import test from 'node:test'
import { createPageMetadata, summarizeDescription } from '../lib/seo.ts'
import { createSitemap } from '../lib/sitemap.ts'
import { getMediaJsonLd, getItemListJsonLd, serializeJsonLd } from '../lib/structured-data.ts'

const metadata = (overrides = {}) => createPageMetadata({
  locale: 'ko', path: '/tv', title: '시리즈', description: '새로운 시리즈', ...overrides,
})
const movie = { id: 42, title: 'A story', poster_path: '/poster.jpg', runtime: 120, vote_average: 8.5, vote_count: 300 }

test('filtered catalog URLs use clean, reciprocal locale canonical and hreflang URLs', () => {
  const ko = metadata({ path: '/tv?provider=8#popular' })
  const en = metadata({ locale: 'en' })
  assert.equal(ko.alternates.canonical, 'https://jimmyflix.vercel.app/ko/tv')
  assert.equal(ko.alternates.languages['en-US'], en.alternates.canonical)
  assert.equal(en.alternates.languages['ko-KR'], ko.alternates.canonical)
  assert.equal(en.alternates.languages['x-default'], en.alternates.canonical)
  assert.equal(ko.openGraph.url, ko.alternates.canonical)
  assert.equal(ko.openGraph.locale, 'ko_KR')
})

test('internal search stays crawlable but not indexable and is excluded from language alternates', () => {
  const search = metadata({ path: '/search?query=actor', noIndex: true })
  assert.deepEqual(search.robots, { index: false, follow: true })
  assert.equal(search.alternates.languages, undefined)
})

test('share metadata has a brand image fallback and compact whitespace-normalized descriptions', () => {
  const result = metadata({ description: 'One\n\n two   three' })
  assert.equal(result.description, 'One two three')
  assert.equal(result.twitter.card, 'summary_large_image')
  assert.equal(result.openGraph.images[0].url, 'https://jimmyflix.vercel.app/social-image?v=2')
  assert.equal(summarizeDescription('x'.repeat(300)).length, 170)
  assert.ok(summarizeDescription('x'.repeat(300)).endsWith('…'))
})

test('both home locales advertise a full-size brand card without overriding title-specific images', () => {
  for (const locale of ['ko', 'en']) {
    const home = metadata({ path: '/', locale })
    const image = home.openGraph.images[0]
    assert.equal(image.width, 1200)
    assert.equal(image.height, 630)
    assert.equal(image.type, 'image/png')
    assert.match(image.alt, /Jimmyflix/)
    assert.deepEqual(home.twitter.images, [{ url: image.url, alt: image.alt }])
  }
  const detail = metadata({ path: '/movies/42', image: 'https://image.tmdb.org/t/p/original/poster.jpg' })
  assert.equal(detail.openGraph.images[0].url, 'https://image.tmdb.org/t/p/original/poster.jpg')
  assert.equal(detail.openGraph.images[0].width, undefined)
})

test('sitemap merges repeated titles and preserves both localized images without inventing lastmod', () => {
  const sitemap = createSitemap([
    { path: '/movies/42', images: { en: 'https://example.com/en.jpg' } },
    { path: '/movies/42', images: { ko: 'https://example.com/ko.jpg' } },
    { path: '/' },
  ])
  assert.equal(sitemap.length, 4)
  assert.equal(new Set(sitemap.map(({ url }) => url)).size, 4)
  assert.deepEqual(sitemap[0].images, ['https://example.com/en.jpg'])
  assert.deepEqual(sitemap[1].images, ['https://example.com/ko.jpg'])
  assert.equal(sitemap[0].lastModified, undefined)
  assert.equal(sitemap[0].alternates.languages['ko-KR'], sitemap[1].url)
})

test('JSON-LD neutralizes script-breaking API text while retaining its decoded content', () => {
  const data = { name: '</script><script>alert("x")</script>', description: '<b>Story</b>' }
  const serialized = serializeJsonLd(data)
  assert.ok(!serialized.includes('<'))
  assert.deepEqual(JSON.parse(serialized), data)
})

test('title schemas distinguish film and series, and do not claim third-party ratings as own reviews', () => {
  const film = getMediaJsonLd(movie, 'movie', 'ko')
  assert.equal(film['@type'], 'Movie')
  assert.equal(film.duration, 'PT120M')
  assert.equal(film.aggregateRating, undefined)
  assert.equal(film.review, undefined)
  const show = getMediaJsonLd({ ...movie, media_type: 'tv' }, 'tv', 'en')
  assert.equal(show['@type'], 'TVSeries')
  assert.equal(show.duration, undefined)
  assert.equal(show.url, 'https://jimmyflix.vercel.app/en/tv/42')
})

test('video schema uses the displayed trailer and requires a real upload date and video key', () => {
  const video = { key: 'abcdefghijk', site: 'YouTube', type: 'Trailer', official: true, name: 'Official trailer', published_at: '2025-01-01T12:00:00Z' }
  const detail = (overrides) => ({ ...movie, videos: { results: [{ ...video, ...overrides }] } })
  assert.equal(getMediaJsonLd(detail(), 'movie', 'en').trailer.uploadDate, video.published_at)
  assert.equal(getMediaJsonLd(detail({ published_at: undefined }), 'movie', 'en').trailer, undefined)
  assert.equal(getMediaJsonLd(detail({ key: 'invalid' }), 'movie', 'en').trailer, undefined)
})

test('carousel structured data lists each canonical title once in visible order', () => {
  const data = getItemListJsonLd([movie, movie, { ...movie, id: 43 }], 'movie', 'Movies', 'en')
  assert.equal(data.numberOfItems, 2)
  assert.deepEqual(data.itemListElement.map(({ position }) => position), [1, 2])
  assert.equal(data.itemListElement[1].url, 'https://jimmyflix.vercel.app/en/movies/43')
})
