import { test, expect } from '@playwright/test'

test('meals pagination and load more', async ({ page }) => {
  await page.goto('/meals')
  const beforeRows = await page.locator('table tbody tr').count()
  await page.click('button:text("Load more")')
  await page.waitForTimeout(300)
  const afterRows = await page.locator('table tbody tr').count()
  expect(afterRows).toBeGreaterThan(beforeRows)
})

test('meals inline filter validation messages', async ({ page }) => {
  await page.goto('/meals')
  await page.fill('input[name="limit"]', '1000')
  await page.click('button:text("Apply")')
  await expect(page.locator('text=Limit must be 1-100')).toBeVisible()

  await page.fill('input[name="offset"]', '-1')
  await page.click('button:text("Apply")')
  await expect(page.locator('text=Offset must be >=0')).toBeVisible()

  await page.fill('input[name="min_calories"]', '500')
  await page.fill('input[name="max_calories"]', '100')
  await page.click('button:text("Apply")')
  await expect(page.locator('text=Min cannot exceed max')).toBeVisible()
})

test('meals filter reduces row count and navigates to detail', async ({ page }) => {
  await page.goto('/meals')
  const totalRows = await page.locator('table tbody tr').count()
  await page.fill('input[name="q"]', 'Meal 1')
  await page.click('button:text("Apply")')
  await page.waitForTimeout(200)
  const filteredRows = await page.locator('table tbody tr').count()
  expect(filteredRows).toBeLessThanOrEqual(totalRows)
  // navigate via first row link
  const firstLink = page.locator('table tbody tr td a').first()
  const href = await firstLink.getAttribute('href')
  await firstLink.click()
  await expect(page).toHaveURL(new RegExp('/meals/\\d+$'))
  await expect(page.locator('h2')).toHaveText('Meal Detail')
})

test('workouts navigation from table to detail', async ({ page }) => {
  await page.goto('/workouts')
  const firstLink = page.locator('table tbody tr td a').first()
  await firstLink.click()
  await expect(page).toHaveURL(new RegExp('/workouts/\\d+$'))
  await expect(page.locator('h2')).toHaveText('Workout Detail')
})

test('conditions list reflects updates (cache invalidated)', async ({ page, request }) => {
  const res = await request.post((process.env.API_URL || 'http://localhost:8080') + '/api/v1/conditions', {
    data: { name: 'CacheCond', type: 'disease' },
  })
  const body = await res.json()
  const id = body.id
  await request.put((process.env.API_URL || 'http://localhost:8080') + '/api/v1/conditions/' + id, {
    data: { name: 'CacheCond+', type: 'disease' },
  })
  const list = await request.get((process.env.API_URL || 'http://localhost:8080') + '/api/v1/conditions')
  const listJson = await list.json()
  expect(JSON.stringify(listJson)).toContain('CacheCond+')
})
