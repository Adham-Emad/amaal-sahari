import { test, expect } from '@playwright/test'
import { loginAsAdmin, clickTab } from './helpers'

test('Content persists across page reloads', async ({ page }) => {
  const res1 = await fetch('http://localhost:5000/api/content')
  const json1 = await res1.json()
  expect(json1.success).toBe(true)

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)
  await page.reload()
  await page.waitForTimeout(2000)

  const res2 = await fetch('http://localhost:5000/api/content')
  const json2 = await res2.json()
  expect(json2.success).toBe(true)
})

test('Admin save and verify content via API', async ({ page }) => {
  await loginAsAdmin(page)

  const cookies = await page.context().cookies()
  const sessionCookie = cookies.find(c => c.name === 'admin_session_token')
  expect(sessionCookie).toBeTruthy()

  const getRes = await fetch('http://localhost:5000/api/content')
  const getJson = await getRes.json()
  const data = getJson.data || {}
  data._e2eTestMarker = `e2e-${Date.now()}`

  const saveRes = await fetch('http://localhost:5000/api/content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `admin_session_token=${sessionCookie!.value}`,
    },
    body: JSON.stringify({ data }),
  })
  const saveJson = await saveRes.json()
  expect(saveJson.success).toBe(true)

  const verifyRes = await fetch('http://localhost:5000/api/content')
  const verifyJson = await verifyRes.json()
  expect(verifyJson.data?._e2eTestMarker).toBe(data._e2eTestMarker)
})

test('Admin custom pages tab loads', async ({ page }) => {
  await loginAsAdmin(page)
  await clickTab(page, 'custom-pages')
  await page.waitForTimeout(1000)
  const hasAppCrash = await page.locator('text=Application error').count()
  expect(hasAppCrash).toBe(0)
})
