import { test, expect } from '@playwright/test'

test('a missing Korean biography shows the English text with its language noted', async ({ page }) => {
  await page.goto('/ko/people/1001')
  await expect(page.getByRole('heading', { name: '소개', exact: true })).toBeVisible()
  await expect(page.getByText('영문으로 제공되는 소개입니다')).toBeVisible()
  await expect(page.getByText('An actor with an extensive filmography.')).toBeVisible()
  await expect(page.getByRole('heading', { name: '인물 정보' })).toBeVisible()
})

test('a person with no biography in either language does not show an empty section', async ({ page }) => {
  await page.goto('/ko/people/1002')
  await expect(page.getByRole('heading', { name: '소개', exact: true })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: '인물 정보' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '출연작' })).toBeVisible()
})
