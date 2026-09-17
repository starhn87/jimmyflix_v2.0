import { test, expect } from '@playwright/test'

const picture = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="400" height="600" fill="#31234d"/><circle cx="200" cy="230" r="90" fill="#a78bfa"/></svg>'
const imageRoute = /\/_next\/image\?|https:\/\/(image\.tmdb\.org|i\.ytimg\.com|flagcdn\.com)\//
const errors = new WeakMap()

test.beforeEach(async ({ page }) => {
  const failures = []
  errors.set(page, failures)
  page.on('pageerror', (error) => failures.push(error.message))
  await page.route(imageRoute, (route) => route.fulfill({ contentType: 'image/svg+xml', body: picture }))
})
test.afterEach(async ({ page }) => { expect(errors.get(page)).toEqual([]) })

async function tab(page, name) {
  const button = page.getByRole('tab', { name, exact: true })
  await expect(async () => {
    await button.click()
    await expect(button).toHaveAttribute('aria-selected', 'true')
  }).toPass({ timeout: 15_000 })
}

async function preferences(page, isMobile) {
  if (isMobile) await page.getByRole('button', { name: /^(Settings|설정)$/ }).click()
}

test('system theme is the default, explicit theme and locale survive a return visit', async ({ page, context, isMobile }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/en')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await preferences(page, isMobile)
  await page.getByRole('button', { name: 'Dark mode', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByRole('link', { name: 'Switch to Korean', exact: true }).click()
  await expect(page).toHaveURL(/\/ko$/)
  await page.goto('/')
  await expect(page).toHaveURL(/\/ko$/)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  expect((await context.cookies()).find(({ name }) => name === 'jimmyflix-locale-v1')?.value).toBe('ko')
})

test('looped cards remain real links after reaching the end of the rail', async ({ page }) => {
  await page.goto('/en')
  const rail = page.locator('#now-playing-rail')
  await rail.scrollIntoViewIfNeeded()
  await expect(rail.locator('[data-loop-copy="0"]')).toBeAttached()
  await rail.evaluate((element) => {
    const copy = element.querySelector('[data-loop-copy="0"]')
    element.scrollLeft = copy.offsetLeft - element.offsetLeft - element.clientWidth / 2
  })
  const link = rail.locator('[data-loop-copy="0"] a')
  await expect(link).toBeInViewport()
  await link.click()
  await expect(page).toHaveURL(/\/en\/movies\/1$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Movie 1')
})

test('people modal supports search, pagination, focus restoration and navigation', async ({ page }) => {
  await page.goto('/en/movies/1')
  await tab(page, 'Credits')
  const opener = page.getByRole('button', { name: 'Cast: View all', exact: true })
  await opener.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(page.locator('html')).toHaveCSS('overflow', 'hidden')
  await expect(dialog.locator('ul a')).toHaveCount(40)
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('button', { name: /Show more/ })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', { name: 'Close people list' })).toBeFocused()
  await dialog.getByRole('button', { name: /Show more/ }).click()
  await expect(dialog.locator('ul a')).toHaveCount(65)
  await dialog.getByRole('searchbox').fill('Actor 65')
  await expect(dialog.locator('ul a')).toHaveCount(1)
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(opener).toBeFocused()
  await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden')
  await opener.click()
  await page.getByRole('dialog').getByRole('searchbox').fill('Actor 65')
  await page.getByRole('dialog').locator('ul a').click()
  await expect(page).toHaveURL(/\/en\/people\/1064$/)
})

test('production crew role filter retains matching people and clears on reopen', async ({ page }) => {
  await page.goto('/en/movies/1')
  await tab(page, 'Production')
  await page.getByRole('button', { name: /View all/ }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('combobox').selectOption({ label: 'Director' })
  await expect(dialog.locator('ul a')).toHaveCount(23)
  await dialog.getByRole('searchbox').fill('Crew 45')
  await expect(dialog.locator('ul a')).toHaveCount(1)
  await dialog.getByRole('button', { name: 'Close people list' }).click()
  await page.getByRole('button', { name: /View all/ }).click()
  await expect(page.getByRole('dialog').getByRole('searchbox')).toHaveValue('')
})

test('gallery supports original-image loading, navigation, keyboard and mobile swipes', async ({ page, context, isMobile }) => {
  await page.goto('/en/movies/1')
  await tab(page, 'Gallery')
  let releaseImage
  const gate = new Promise((resolve) => { releaseImage = resolve })
  await page.route('https://image.tmdb.org/t/p/original/gallery-*.jpg', async (route) => {
    await gate
    await route.fulfill({ contentType: 'image/svg+xml', body: picture })
  })
  const opener = page.getByRole('button', { name: /View full size.*Photo 1$/i })
  await opener.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.locator('[aria-busy="true"]')).toBeVisible()
  await expect(dialog.locator('.animate-spin')).toBeVisible()
  releaseImage()
  await expect(dialog.locator('[aria-busy="true"]')).toHaveCount(0)
  await page.keyboard.press('ArrowRight')
  await expect(dialog.locator('footer [aria-live]')).toContainText('2')
  if (isMobile) {
    const surface = dialog.locator('[style*="touch-action"]')
    const box = await surface.boundingBox()
    const client = await context.newCDPSession(page)
    const y = box.y + box.height / 2
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width * 0.8, y }] })
    for (const fraction of [0.65, 0.5, 0.35, 0.2]) await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + box.width * fraction, y }] })
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect(dialog.locator('footer [aria-live]')).toContainText('3')
    await client.detach()
  }
  await dialog.getByRole('button', { name: 'Close gallery' }).click()
  await expect(opener).toBeFocused()
})

test('modal image failures settle into a stable fallback without endless loading', async ({ page }) => {
  await page.route(imageRoute, (route) => route.abort())
  await page.goto('/en/movies/1')
  await tab(page, 'Credits')
  await page.getByRole('button', { name: 'Cast: View all', exact: true }).click()
  const image = page.getByRole('dialog').locator('[data-image-state]').first()
  await expect(image).toHaveAttribute('data-image-state', 'error')
  await expect(image).toHaveAttribute('aria-busy', 'false')
  await expect(image.locator('svg')).toBeVisible()
  const box = await image.boundingBox()
  expect(box.width).toBe(56)
  expect(box.height).toBe(84)
})

test('failed production and related requests display errors instead of an empty result', async ({ page }) => {
  await page.goto('/en/movies/999')
  await tab(page, 'Production')
  await expect(page.getByRole('main').getByRole('alert')).toHaveCount(3)
  await expect(page.getByText('No production information is available.')).toHaveCount(0)
})

test('trends show twenty ranked titles and people, forty rediscoveries and compact rank markers', async ({ page }) => {
  await page.goto('/en/trend')
  for (const window of ['day', 'week']) {
    if (window === 'week') await page.getByRole('link', { name: 'This week', exact: true }).click()
    for (const kind of ['movie', 'tv']) {
      const rail = page.locator(`#top-${kind}-${window}-rail`)
      await expect(rail.locator('[data-loop-origin]')).toHaveCount(20)
      const last = rail.locator('[data-loop-origin="19"] a')
      await expect(last).toHaveAttribute('aria-label', /^Rank 20,/)
      const marker = rail.locator('[data-loop-origin="0"] .media-card-poster > span[aria-hidden]')
      await expect(marker).toHaveText('1st')
      await expect(marker).toHaveCSS('height', '24px')
      await expect(marker).toHaveCSS('font-size', '12px')
      for (const [rank, label] of [[2, '2nd'], [3, '3rd'], [4, '4th'], [11, '11th'], [12, '12th'], [13, '13th'], [20, '20th']]) {
        await expect(rail.locator(`[data-loop-origin="${rank - 1}"] .media-card-poster > span[aria-hidden]`)).toHaveText(label)
      }
    }
    await expect(page.locator('#trending-people-rail [data-loop-origin]')).toHaveCount(20)
    await expect(page.locator('#trending-people-rail [data-loop-origin="0"] h3')).toHaveText('Actor 3')
    await expect(page.locator('#trending-people-rail [data-loop-origin="19"] h3')).toHaveText('Actor 22')
    await expect(page.locator(`#rediscovery-${window}-rail [data-loop-origin]`)).toHaveCount(40)
  }
  await page.locator('#top-movie-week-rail [data-loop-origin="19"] a').click()
  await expect(page).toHaveURL(/\/en\/movies\/20$/)
  await page.goto('/ko/trend')
  for (const rank of [1, 3, 11, 20]) {
    await expect(page.locator(`#top-movie-day-rail [data-loop-origin="${rank - 1}"] .media-card-poster > span[aria-hidden]`)).toHaveText(`${rank}위`)
  }
})
