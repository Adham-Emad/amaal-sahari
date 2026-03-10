import { test, expect } from '@playwright/test'
import { loginAsAdmin, clickTab } from './helpers'

const adminTabs = [
  'hero', 'navbar', 'value-highlights', 'services', 'kpis',
  'why-choose-us', 'testimonials', 'case-studies', 'about',
  'blog', 'news', 'careers', 'faqs', 'contact', 'footer',
  'seo', 'whatsapp', 'social-media', 'homepage-sections',
  'service-details', 'privacy-policy', 'terms-of-service',
  'kpis-advanced', 'subpage-seo', 'submissions', 'job-applications',
  'blog-details', 'case-studies-details', 'custom-pages',
]

test.describe('Admin Editor Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  for (const tab of adminTabs) {
    test(`Tab "${tab}" loads without crash`, async ({ page }) => {
      await clickTab(page, tab)
      await page.waitForTimeout(1000)
      const hasAppCrash = await page.locator('text=Application error').count()
      expect(hasAppCrash).toBe(0)
    })
  }
})

test('Admin hero editor has save button', async ({ page }) => {
  await loginAsAdmin(page)
  const saveBtn = page.locator('button:has-text("Save")')
  await expect(saveBtn.first()).toBeVisible({ timeout: 5000 })
})

test('Admin contact editor shows form fields', async ({ page }) => {
  await loginAsAdmin(page)
  await clickTab(page, 'contact')
  await page.waitForTimeout(1000)
  expect(await page.locator('input, textarea').count()).toBeGreaterThan(0)
})

test('Admin SEO editor has input fields', async ({ page }) => {
  await loginAsAdmin(page)
  await clickTab(page, 'seo')
  await page.waitForTimeout(1000)
  expect(await page.locator('input, textarea').count()).toBeGreaterThan(0)
})
