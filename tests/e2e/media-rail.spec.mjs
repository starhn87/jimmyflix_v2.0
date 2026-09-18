import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route(/\/_next\/image\?|https:\/\/image\.tmdb\.org\//, (route) => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="400" height="600" fill="#31234d"/></svg>',
  }))
})

async function openRail(page) {
  await page.goto('/en/trend')
  const rail = page.locator('#top-movie-day-rail')
  await rail.scrollIntoViewIfNeeded()
  await expect(rail).toHaveAttribute('data-looping', 'true')
  return rail
}

// Observe actual screen coordinates on every frame, including the wrap itself.
async function auditMotion(rail, direction) {
  await rail.evaluate((element, direction) => {
    const audit = { frames: 0, seams: 0, reversed: 0, gaps: 0, blanks: 0, maxSpeed: 0, stopped: false }
    window.railAudit = audit
    const gap = parseFloat(getComputedStyle(element).columnGap)
    const padding = parseFloat(getComputedStyle(element).paddingLeft)
    let previous = new Map(), previousTime = 0, previousFirst = null
    function sample(time) {
      if (audit.stopped) return
      const viewport = element.getBoundingClientRect()
      const visible = [...element.children].map((card) => ({
        index: Number(card.dataset.loopOrigin), box: card.getBoundingClientRect(),
      })).filter(({ box }) => box.right > viewport.left && box.left < viewport.right)
        .sort((a, b) => a.box.left - b.box.left)
      if (!visible.length || visible[0].box.left > viewport.left + padding + 1
        || visible.at(-1).box.right < viewport.right - padding - 1) audit.blanks++
      for (let i = 0; i < visible.length; i++) {
        const current = visible[i]
        const before = previous.get(current.index)
        if (before) {
          const change = current.box.left - before.left
          if (change * direction > 1) audit.reversed++
          audit.maxSpeed = Math.max(audit.maxSpeed, Math.abs(change) / Math.max(1, time - previousTime))
        }
        if (i && (Math.abs(current.box.left - visible[i - 1].box.right - gap) > 1
          || current.index !== (visible[i - 1].index + 1) % element.children.length)) audit.gaps++
      }
      const first = visible[0]?.index
      if (previousFirst !== null && Math.abs(first - previousFirst) > element.children.length / 2) audit.seams++
      previousFirst = first
      previous = new Map(visible.map(({ index, box }) => [index, box]))
      previousTime = time
      audit.frames++
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  }, direction)
}

async function finishAudit(page) {
  const result = await page.evaluate(() => {
    window.railAudit.stopped = true
    return window.railAudit
  })
  await test.info().attach('motion-audit', { body: JSON.stringify(result), contentType: 'application/json' })
  expect(result.frames).toBeGreaterThan(50)
  expect(result.seams).toBeGreaterThanOrEqual(2)
  expect(result.reversed).toBe(0)
  expect(result.gaps).toBe(0)
  expect(result.blanks).toBe(0)
  expect(result.maxSpeed).toBeLessThan(20)
}

test('buttons keep cards moving continuously over multiple loops in both directions', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop hover controls')
  const rail = await openRail(page)
  for (const direction of [1, -1]) {
    await auditMotion(rail, direction)
    const button = page.getByRole('button', { name: new RegExp(`Scroll .* ${direction === 1 ? 'forward' : 'backward'}$`) })
      .filter({ has: page.locator('svg') })
    const control = page.locator(`[aria-controls="top-movie-day-rail"]`).and(button)
    for (let i = 0; i < 10; i++) {
      await control.click()
      await page.waitForTimeout(i % 3 === 0 ? 120 : 400)
    }
    await page.waitForTimeout(850)
    await finishAudit(page)
  }
  await expect(rail.locator('a')).toHaveCount(20)
})

test('horizontal wheel and mouse dragging work while vertical wheel still scrolls the page', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Mouse and trackpad input')
  const rail = await openRail(page)
  const box = await rail.boundingBox()
  await page.mouse.move(box.width / 2, box.y + 100)
  const before = await rail.locator('[data-loop-origin="0"]').boundingBox()
  await page.mouse.wheel(500, 0)
  await expect.poll(async () => (await rail.locator('[data-loop-origin="0"]').boundingBox()).x).not.toBe(before.x)
  await page.waitForTimeout(800)
  await page.mouse.move(box.width / 2, box.y + 100)
  await page.mouse.down()
  await page.mouse.move(box.width / 2 - 300, box.y + 100, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(800)
  await expect(page).toHaveURL(/\/en\/trend$/)
  const scrollY = await page.evaluate(() => window.scrollY)
  await page.mouse.wheel(0, 350)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollY + 100)
})

test('touch swipes cross both seams repeatedly without blank frames or opening a card', async ({ page, context, isMobile }) => {
  test.skip(!isMobile, 'Touch gestures')
  test.setTimeout(90_000)
  const rail = await openRail(page)
  const client = await context.newCDPSession(page)
  const box = await rail.boundingBox()
  const y = box.y + 80
  for (const direction of [-1, 1]) {
    await auditMotion(rail, direction)
    for (let swipe = 0; swipe < 26; swipe++) {
      const start = direction === 1 ? box.width - 30 : 30
      const trackFinger = direction === -1 && swipe === 0
      const firstCard = rail.locator('[data-loop-origin="0"]')
      const startX = trackFinger ? (await firstCard.boundingBox()).x : 0
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start, y }] })
      for (let step = 1; step <= 6; step++) {
        await page.waitForTimeout(16)
        await client.send('Input.dispatchTouchEvent', {
          type: 'touchMove', touchPoints: [{ x: start - direction * step * (box.width - 60) / 6, y }],
        })
        if (trackFinger) {
          const expectedX = startX - direction * step * (box.width - 60) / 6
          await expect.poll(async () => Math.abs((await firstCard.boundingBox()).x - expectedX)).toBeLessThan(1)
        }
      }
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await page.waitForTimeout(700)
      if (await page.evaluate(() => window.railAudit.seams >= 2)) break
    }
    await finishAudit(page)
  }
  // A vertical gesture must continue to scroll the document, and a later tap remains a link.
  const scrollY = await page.evaluate(() => window.scrollY)
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: y + 100 }] })
  for (let step = 1; step <= 5; step++) {
    await page.waitForTimeout(20)
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y: y + 100 - step * 35 }] })
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollY + 60)
  await client.detach()
  await expect(page).toHaveURL(/\/en\/trend$/)
  await rail.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  const index = await rail.evaluate((element) => [...element.children].findIndex((card) => {
    const box = card.getBoundingClientRect()
    return box.left >= 16 && box.right <= window.innerWidth - 16
  }))
  const link = rail.locator(`[data-loop-origin="${index}"] a`)
  const href = await link.getAttribute('href')
  await link.tap()
  await expect(page).toHaveURL(new RegExp(`${href}$`))
})

test('diagonal carousel swipes lock horizontally without moving the page', async ({ page, context, isMobile }) => {
  test.skip(!isMobile, 'Touch gestures')
  const rail = await openRail(page)
  const client = await context.newCDPSession(page)
  const box = await rail.boundingBox()
  const firstCard = rail.locator('[data-loop-origin="0"]')
  const initialCardX = (await firstCard.boundingBox()).x
  const initialScrollY = await page.evaluate(() => window.scrollY)
  const start = { x: box.width - 30, y: box.y + 100 }

  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] })
  for (let step = 1; step <= 7; step++) {
    await page.waitForTimeout(20)
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: start.x - step * 35, y: start.y - step * 40 }],
    })
  }
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await page.waitForTimeout(500)

  expect(await page.evaluate(() => window.scrollY)).toBe(initialScrollY)
  expect(Math.abs((await firstCard.boundingBox()).x - initialCardX)).toBeGreaterThan(100)
  await client.detach()
})

test('resizing and reduced motion preserve the visible cards and keyboard navigation', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Viewport and keyboard checks')
  const rail = await openRail(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await rail.locator('[data-loop-origin="0"] a').focus()
  await page.keyboard.press('ArrowLeft')
  const last = rail.locator('[data-loop-origin="19"] a')
  await expect(last).toBeInViewport({ ratio: 0.99 })
  for (const width of [390, 2560, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await rail.scrollIntoViewIfNeeded()
    await expect(rail).toHaveAttribute('data-looping', 'true')
    // Keyboard focus must reveal the real card even after it has been recycled.
    await last.focus()
    await expect(last).toBeInViewport({ ratio: 0.99 })
  }
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/en\/movies\/20$/)
})
