import { expect, Page } from '@playwright/test'

export async function loginAsAdmin(page: Page) {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3000)

  const loginForm = page.locator('#username')
  const isLoginVisible = await loginForm.isVisible({ timeout: 3000 }).catch(() => false)

  if (isLoginVisible) {
    await page.fill('#username', 'admin')
    await page.fill('#password', 'amaal2024')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(8000)
    await page.waitForLoadState('domcontentloaded')
  }

  await expect(page.locator('text=Content Management System')).toBeVisible({ timeout: 20000 })
}

export async function clickTab(page: Page, tabValue: string): Promise<boolean> {
  const tabList = page.locator('[role="tablist"]').first()
  if (await tabList.count() > 0) {
    await tabList.evaluate((el, val) => {
      const tab = el.querySelector(`[data-value="${val}"], button[value="${val}"]`)
      if (tab) {
        tab.scrollIntoView({ inline: 'center' })
      }
    }, tabValue)
    await page.waitForTimeout(200)
  }

  const trigger = page.locator(`[role="tab"][data-value="${tabValue}"], button[value="${tabValue}"]`).first()
  if (await trigger.count() > 0) {
    await trigger.click({ force: true })
    await page.waitForTimeout(500)
    return true
  }

  if (await tabList.count() > 0) {
    await tabList.evaluate(el => el.scrollLeft = el.scrollWidth)
    await page.waitForTimeout(300)
  }

  if (await trigger.count() > 0) {
    await trigger.click({ force: true })
    await page.waitForTimeout(500)
    return true
  }

  return false
}
