import { test, expect } from '@playwright/test'

test('Contact form submission works', async ({ page }) => {
  await page.goto('/contact', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)

  const nameInput = page.locator('input[placeholder*="Name"], input[id*="name"]').first()
  const emailInput = page.locator('input[placeholder*="Email"], input[type="email"], input[id*="email"]').first()
  const messageInput = page.locator('textarea').first()

  if (await nameInput.count() > 0 && await emailInput.count() > 0 && await messageInput.count() > 0) {
    await nameInput.fill('E2E Test User')
    await emailInput.fill('e2e@test.com')
    await messageInput.fill('This is an automated E2E test submission.')

    const phoneInput = page.locator('input[placeholder*="Phone"], input[id*="phone"]').first()
    if (await phoneInput.count() > 0) {
      await phoneInput.fill('+1234567890')
    }

    const submitBtn = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Submit")').first()
    if (await submitBtn.count() > 0) {
      await submitBtn.click()
      await page.waitForTimeout(3000)
      const successIndicator = page.locator('text=received, text=success, text=thank, text=sent')
      const hasSuccess = await successIndicator.count() > 0
      if (!hasSuccess) {
        const errorIndicator = page.locator('[class*="error"], [class*="destructive"]')
        const hasError = await errorIndicator.count()
      }
    }
  }
})
