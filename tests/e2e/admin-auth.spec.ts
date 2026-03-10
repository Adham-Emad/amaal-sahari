import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers'

test('Admin page shows login form when not authenticated', async ({ page }) => {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('text=Admin Panel')).toBeVisible({ timeout: 10000 })
  await expect(page.locator('#username')).toBeVisible()
  await expect(page.locator('#password')).toBeVisible()
})

test('Admin login with wrong credentials shows error', async ({ page }) => {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' })
  await page.fill('#username', 'admin')
  await page.fill('#password', 'wrongpassword')
  await page.click('button[type="submit"]')
  await expect(page.locator('text=Invalid username or password')).toBeVisible({ timeout: 10000 })
})

test('Admin login with correct credentials shows dashboard', async ({ page }) => {
  await loginAsAdmin(page)
  await expect(page.locator('text=Content Management System')).toBeVisible()
})

test('Admin dashboard has expected elements', async ({ page }) => {
  await loginAsAdmin(page)
  await expect(page.locator('text=Logout')).toBeVisible({ timeout: 5000 })
  await expect(page.locator('button:has-text("Save")').first()).toBeVisible({ timeout: 5000 })
  await expect(page.locator('button:has-text("Hero")').first()).toBeVisible({ timeout: 5000 })
})

test('Admin forgot-password page loads', async ({ page }) => {
  const response = await page.goto('/admin/forgot-password', { waitUntil: 'domcontentloaded' })
  expect(response?.status()).toBe(200)
})
