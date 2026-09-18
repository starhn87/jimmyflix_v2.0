import { test, expect } from '@playwright/test'

const picture = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="400" height="600" fill="#31234d"/></svg>'

test.beforeEach(async ({ page }) => {
  await page.route(/\/_next\/image\?|https:\/\/(image\.tmdb\.org|i\.ytimg\.com|flagcdn\.com)\//, (route) => (
    route.fulfill({ contentType: 'image/svg+xml', body: picture })
  ))
})

async function expectAligned(picker, link) {
  await expect.poll(async () => {
    const indicator = await picker.locator('.streaming-provider-indicator').boundingBox()
    const target = await link.boundingBox()
    if (!indicator || !target) return Infinity
    return Math.max(Math.abs(indicator.x - target.x), Math.abs(indicator.width - target.width), Math.abs(indicator.height - target.height))
  }).toBeLessThanOrEqual(1)
}

for (const kind of ['movie', 'tv']) {
  test(`${kind} provider selection shows matching skeletons once and reuses visited lists`, async ({ page }) => {
    const path = kind === 'movie' ? '/en' : '/en/tv'
    let releaseResults
    const gate = new Promise((resolve) => { releaseResults = resolve })
    await page.route((url) => url.pathname === '/api/streaming' && url.searchParams.get('kind') === kind && url.searchParams.get('provider') === '350', async (route) => {
      await gate
      await route.continue()
    })
    await page.goto(path)
    const picker = page.getByRole('navigation', { name: 'Choose a streaming service' })
    const target = picker.getByRole('link', { name: 'Apple TV', exact: true })
    const title = page.locator(`#streaming-${kind}-title`)
    const track = page.locator(`#streaming-${kind}-rail`)
    await expect(track.locator('[data-loop-origin]')).toHaveCount(40)
    await picker.scrollIntoViewIfNeeded()
    await expectAligned(picker, picker.getByRole('link', { name: 'Netflix', exact: true }))
    const before = await track.boundingBox()
    const skeleton = page.locator('[data-streaming-skeleton]')

    try {
      await target.click()
      await expect(picker).toHaveAttribute('data-selected', '350')
      await expect(picker).toHaveAttribute('aria-busy', 'true')
      await expect(target).toHaveAttribute('aria-current', 'true')
      await expectAligned(picker, target)
      await expect(title).toContainText('Apple TV')
      await expect(track).toHaveCount(0)
      await expect(skeleton).toBeVisible()
      const after = await skeleton.locator('ul').boundingBox()
      expect(Math.abs(before.height - after.height)).toBeLessThanOrEqual(1)
      expect(Math.abs(before.width - after.width)).toBeLessThanOrEqual(1)
      await expect(skeleton.locator('li')).toHaveCount(40)
    } finally {
      releaseResults()
    }

    await expect(page).toHaveURL(new RegExp(`${path}\\?provider=350#streaming-${kind}$`))
    await expect(title).toContainText('Apple TV')
    await expect(picker).toHaveAttribute('aria-busy', 'false')
    await expectAligned(picker, target)
    await expect(track.locator('[data-loop-origin]')).toHaveCount(40)
    await expect(page.locator('.media-rail-transition')).toHaveCSS('opacity', '1')

    await page.goBack()
    await expect(title).toContainText('Netflix')
    await expect(picker).toHaveAttribute('data-selected', '8')
    await expectAligned(picker, picker.getByRole('link', { name: 'Netflix', exact: true }))

    let duplicateRequests = 0
    page.on('request', (request) => { if (request.url().includes('/api/streaming')) duplicateRequests++ })
    await page.evaluate(() => {
      window.streamingSkeletonFlashes = 0
      new MutationObserver(() => { if (document.querySelector('[data-streaming-skeleton]')) window.streamingSkeletonFlashes++ }).observe(document.querySelector('.streaming-provider-section'), { childList: true, subtree: true })
    })
    await target.click()
    await expect(title).toContainText('Apple TV')
    await expect(track.locator('[data-loop-origin]')).toHaveCount(40)
    await expect(skeleton).toHaveCount(0)
    expect(await page.evaluate(() => window.streamingSkeletonFlashes)).toBe(0)
    expect(duplicateRequests).toBe(0)
  })
}

test('the latest provider choice wins when requests complete out of order', async ({ page }) => {
  let releaseApple
  const appleGate = new Promise((resolve) => { releaseApple = resolve })
  await page.route((url) => url.pathname === '/api/streaming' && url.searchParams.get('provider') === '350', async (route) => {
    await appleGate
    await route.continue()
  })
  await page.goto('/en')
  const picker = page.getByRole('navigation', { name: 'Choose a streaming service' })
  try {
    await picker.getByRole('link', { name: 'Apple TV', exact: true }).click()
    await expect(picker).toHaveAttribute('data-selected', '350')
    await picker.getByRole('link', { name: 'Disney+', exact: true }).click()
    await expect(picker).toHaveAttribute('data-selected', '337')
    await expect(page.locator('#streaming-movie-title')).toHaveText('Movies on Disney+')
  } finally {
    releaseApple()
  }
  await expect(picker).toHaveAttribute('aria-busy', 'false')
  await expect(page).toHaveURL(/provider=337#streaming-movie$/)
  await expectAligned(picker, picker.getByRole('link', { name: 'Disney+', exact: true }))
  await page.reload()
  await expect(picker).toHaveAttribute('data-selected', '337')
  await expect(page.locator('#streaming-movie-title')).toHaveText('Movies on Disney+')
})

test('the provider highlight follows horizontally scrolled tabs and respects reduced motion', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/ko/tv')
  const picker = page.getByRole('navigation', { name: '스트리밍 서비스 선택' })
  const list = picker.locator('ul')
  const last = picker.getByRole('link', { name: 'Prime Video', exact: true })
  await last.scrollIntoViewIfNeeded()
  if (isMobile) expect(await list.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0)
  const before = await list.evaluate((element) => element.scrollLeft)
  await last.click()
  await expect(page.locator('#streaming-tv-title')).toHaveText('Prime Video 시리즈')
  await expectAligned(picker, last)
  expect(Math.abs(await list.evaluate((element) => element.scrollLeft) - before)).toBeLessThanOrEqual(1)
  const durations = await picker.locator('.streaming-provider-indicator').evaluate((element) => getComputedStyle(element).transitionDuration)
  expect(durations.split(',').every((duration) => parseFloat(duration) < 0.001)).toBe(true)
  const viewport = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }))
  expect(viewport.content).toBeLessThanOrEqual(viewport.width)
})

test('a failed list keeps its tabs usable and retries instead of caching the error', async ({ page }) => {
  let fail = true
  await page.route((url) => url.pathname === '/api/streaming' && url.searchParams.get('provider') === '350', (route) => (
    fail ? route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"Unavailable"}' }) : route.continue()
  ))
  await page.goto('/en')
  const picker = page.getByRole('navigation', { name: 'Choose a streaming service' })
  await expect(picker.locator('ul')).toHaveAttribute('data-indicator-ready', '')
  await picker.getByRole('link', { name: 'Apple TV', exact: true }).click()
  const section = page.locator('.streaming-provider-section')
  await expect(section.getByRole('alert')).toBeVisible()
  await expect(picker).toBeVisible()
  fail = false
  await section.getByRole('button', { name: 'Try again', exact: true }).click()
  await expect(section.getByRole('alert')).toHaveCount(0)
  await expect(section.locator('[data-loop-origin]')).toHaveCount(40)
  await expect(picker).toHaveAttribute('aria-busy', 'false')
})
