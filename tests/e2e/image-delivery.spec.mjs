import { test, expect } from '@playwright/test'

const picture = '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="#31234d"/></svg>'

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
