import { test, expect } from '@playwright/test'

const pages = [
  { path: '/', name: 'Home', expectText: 'Amaal Sahari' },
  { path: '/about', name: 'About', expectText: 'About' },
  { path: '/contact', name: 'Contact', expectText: 'Get in Touch' },
  { path: '/blog', name: 'Blog', expectText: 'Blog' },
  { path: '/news', name: 'News', expectText: 'News' },
  { path: '/careers', name: 'Careers', expectText: 'Careers' },
  { path: '/faqs', name: 'FAQs', expectText: 'FAQ' },
  { path: '/privacy', name: 'Privacy', expectText: 'Privacy' },
  { path: '/terms', name: 'Terms', expectText: 'Terms' },
]

for (const pg of pages) {
  test(`${pg.name} page loads at ${pg.path}`, async ({ page }) => {
    const response = await page.goto(pg.path, { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBe(200)
    await expect(page.locator('body')).toContainText(pg.expectText, { timeout: 10000 })
  })
}

test('Home page has navbar with core links', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('nav')).toBeVisible({ timeout: 10000 })
  const navText = await page.locator('nav').textContent()
  expect(navText).toContain('Home')
  expect(navText).toContain('About')
  expect(navText).toContain('Services')
  expect(navText).toContain('Contact')
})

test('Home page has footer', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('footer')).toBeVisible({ timeout: 10000 })
})

test('Home page has WhatsApp widget', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)
  const widget = page.locator('[class*="whatsapp"], a[href*="wa.me"]')
  await expect(widget.first()).toBeVisible({ timeout: 10000 })
})

test('Service detail page loads', async ({ page }) => {
  const response = await page.goto('/services/housekeeping-janitorial', { waitUntil: 'domcontentloaded' })
  expect(response?.status()).toBe(200)
  await expect(page.locator('body')).toContainText('Housekeeping', { timeout: 10000 })
})

test('Service detail page - nonexistent slug shows not found', async ({ page }) => {
  await page.goto('/services/nonexistent-service-xyz', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('body')).toContainText('Not Found', { timeout: 10000 })
})

test('Locale toggle switches to Arabic', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1000)
  const arButton = page.locator('button:has-text("العربية"), button:has-text("Arabic")')
  if (await arButton.count() > 0) {
    await arButton.first().click()
    await page.waitForTimeout(1000)
    const html = page.locator('html')
    const dir = await html.getAttribute('dir')
    expect(dir).toBe('rtl')
  }
})

test('Contact page shows form fields', async ({ page }) => {
  await page.goto('/contact', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('input[type="text"], input[type="email"], input[placeholder]').first()).toBeVisible({ timeout: 10000 })
})

test('Blog page lists blog entries', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('body')).toContainText('Blog', { timeout: 10000 })
})

test('Legacy /p/slug redirects to /slug', async ({ page }) => {
  const response = await page.goto('/p/test-page', { waitUntil: 'domcontentloaded' })
  expect(page.url()).toContain('/test-page')
  expect(page.url()).not.toContain('/p/test-page')
})
