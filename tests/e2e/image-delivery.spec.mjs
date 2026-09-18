import { test, expect } from '@playwright/test'

const picture = '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="#31234d"/></svg>'

async function expectCdnImage(image) {
  await image.scrollIntoViewIfNeeded()
  await expect.poll(() => image.evaluate((element) => (
    element.complete && element.naturalWidth > 0 && /^https:\/\/(image\.tmdb\.org|i\.ytimg\.com)\//.test(element.currentSrc)
  ))).toBe(true)
}

test('an unavailable image optimizer falls back to CDN sources across media views', async ({ page, isMobile }) => {
  await page.route('**/_next/image?**', (route) => route.fulfill({ status: 402, body: 'OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED' }))
  await page.route(/^https:\/\/(image\.tmdb\.org|i\.ytimg\.com)\//, (route) => route.fulfill({ contentType: 'image/svg+xml', body: picture }))

  await page.goto('/en')
  await expectCdnImage(page.locator('section[aria-labelledby="featured-title"] img'))
  await expectCdnImage(page.getByAltText('Movie 1 poster', { exact: true }).first())

  await page.goto('/en/tv/1')
  await expectCdnImage(page.getByAltText('Series 1 poster', { exact: true }).first())
  if (!isMobile) await expectCdnImage(page.locator('main picture img'))
  await expectCdnImage(page.locator('img[src*="ytimg"]'))
  await page.getByRole('tab', { name: 'Credits', exact: true }).click()
  const actor = page.getByAltText('Actor 1', { exact: true }).first()
  await expectCdnImage(actor)
  await expect(actor.locator('..')).toHaveAttribute('data-image-state', 'loaded')

  await page.goto('/en/people/1000')
  await expectCdnImage(page.locator('main img').first())
})

test('a failed CDN fallback settles on the existing error UI without repeated requests', async ({ page }) => {
  let sourceRequests = 0
  await page.route('**/_next/image?**', (route) => route.fulfill({ status: 402, body: 'OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED' }))
  await page.route(/^https:\/\/(image\.tmdb\.org|i\.ytimg\.com)\//, (route) => {
    if (route.request().url().endsWith('/fixture-1000.jpg')) {
      sourceRequests++
      return route.fulfill({ status: 404, body: 'Not found' })
    }
    return route.fulfill({ contentType: 'image/svg+xml', body: picture })
  })
  await page.goto('/en/tv/1')
  await expectCdnImage(page.getByAltText('Series 1 poster', { exact: true }).first())
  await page.getByRole('tab', { name: 'Credits', exact: true }).click()
  const fallback = page.locator('[data-image-state="error"] [role="img"][aria-label="Actor 1"]')
  await expect(fallback).toBeVisible()
  await expect(fallback.locator('..')).toHaveAttribute('aria-busy', 'false')
  expect(sourceRequests).toBe(1)
})

test('detail images match their columns and hidden mobile backdrops make no image request', async ({ browser, isMobile }) => {
  const context = await browser.newContext({ viewport: { width: isMobile ? 390 : 1440, height: 1000 }, deviceScaleFactor: isMobile ? 3 : 2 })
  const page = await context.newPage()
  const requests = []
  await page.route(/\/_next\/image\?|https:\/\/(image\.tmdb\.org|i\.ytimg\.com|flagcdn\.com)\//, (route) => {
    requests.push(decodeURIComponent(route.request().url()))
    return route.fulfill({ contentType: 'image/svg+xml', body: picture })
  })
  try {
    await page.goto('http://localhost:3100/en/tv/1')
    const trailer = page.locator('img[src*="ytimg"]')
    await trailer.scrollIntoViewIfNeeded()
    await expect.poll(async () => trailer.evaluate((image) => new URL(image.currentSrc).searchParams.get('w'))).toBe(isMobile ? '1280' : '1920')
    if (isMobile) {
      await expect.poll(() => page.locator('main picture img').evaluate((image) => image.currentSrc.startsWith('data:image/svg+xml'))).toBe(true)
      expect(requests.some((url) => url.includes('/backdrop-1.jpg'))).toBe(false)
    }
    await page.getByRole('tab', { name: 'Production', exact: true }).click()
    await expect(page.getByAltText('Studio One')).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w185/studio.jpg')
    expect(requests.filter((url) => url.includes('/_next/image')).every((url) => !url.includes('flagcdn.com') && !url.includes('/studio.jpg'))).toBe(true)
  } finally {
    await context.close()
  }
})
