/**
 * create-zip.mjs
 * Creates the deployment zip for Hostinger.
 *
 * Key behavior:
 *  - data/content.json is NOT included as content.json (prevents overwriting
 *    production admin-panel data on each redeploy).
 *  - data/content.json IS included as data/content-init.json so that a
 *    fresh first-time deployment gets seeded with the current CMS structure.
 *    restore-build.mjs will copy content-init.json → content.json only when
 *    content.json doesn't already exist on the server.
 */

import archiver from 'archiver'
import { existsSync, statSync, createWriteStream, readdirSync, readFileSync, copyFileSync } from 'fs'
import path from 'path'

const OUTPUT = 'public/amaalsahari-deploy.zip'
const ROOT   = process.cwd()

const SKIP_DIRS = new Set([
  'node_modules', '.git', '.cache',
  '.next/dev', '.next/cache',
  'attached_assets', 'tests',
])
const SKIP_FILES = new Set([
  'amaalsahari-deploy.zip',
  '.env.local',
  '.DS_Store',
  '.hostinger-deploy',
  'data/content.json',   // ← do NOT ship as content.json; see content-init.json below
])

function shouldSkip(rel) {
  if (SKIP_FILES.has(rel)) return true
  if (SKIP_FILES.has(path.basename(rel))) return true
  for (const d of SKIP_DIRS) {
    if (rel === d || rel.startsWith(d + '/')) return true
  }
  return false
}

function addDir(archive, dir, prefix) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel  = prefix ? `${prefix}/${entry.name}` : entry.name
    const full = path.join(dir, entry.name)
    if (shouldSkip(rel)) continue
    if (entry.isSymbolicLink()) continue
    if (entry.isDirectory()) addDir(archive, full, rel)
    else if (entry.isFile()) archive.file(full, { name: rel })
  }
}

// ── Build ────────────────────────────────────────────────────────────────────
const out     = createWriteStream(OUTPUT)
const archive = archiver('zip', { zlib: { level: 6 } })

archive.on('error', err => { throw err })
archive.pipe(out)

addDir(archive, ROOT, '')

// Ship current content.json as content-init.json (seed for first deploy)
const contentSrc = path.join(ROOT, 'data', 'content.json')
if (existsSync(contentSrc)) {
  archive.file(contentSrc, { name: 'data/content-init.json' })
  console.log('  Added data/content.json → data/content-init.json (seed)')
}

archive.finalize()

out.on('close', () => {
  const mb  = (statSync(OUTPUT).size / 1024 / 1024).toFixed(2)
  const bid = readFileSync('.next-build-backup/BUILD_ID', 'utf8').trim()
  console.log(`\nZip ready: ${OUTPUT}`)
  console.log(`Size: ${mb} MB | Build ID: ${bid}`)
  console.log('\nVerification:')

  const pages = ['contact', 'blog', 'careers', 'faqs', 'news', 'privacy', 'terms', 'about']
  pages.forEach(p => {
    const src = readFileSync(`app/${p}/page.tsx`, 'utf8')
    const ok  = !src.includes('use client') && src.includes('force-dynamic') && src.includes('generateMetadata')
    console.log(`  ${ok ? 'OK' : 'FAIL'} /${p} server wrapper`)
  })

  const dynamicPages = [
    ['blog/[id]', 'getBlogPostMetadata'],
    ['news/[id]', 'getNewsItemMetadata'],
    ['case-studies/[id]', 'getCaseStudyMetadata'],
  ]
  dynamicPages.forEach(([p, fn]) => {
    const src = readFileSync(`app/${p}/page.tsx`, 'utf8')
    const ok  = !src.includes('use client') && src.includes(fn)
    console.log(`  ${ok ? 'OK' : 'FAIL'} /${p} server wrapper`)
  })

  const meta = readFileSync('lib/metadata.ts', 'utf8')
  console.log(`  ${meta.includes('noStore()') ? 'OK' : 'FAIL'} noStore() in metadata.ts`)
  console.log(`  ${existsSync('data/content-init.json') ? 'WARN (cleanup)' : 'OK'} content-init.json local cleanup`)
  console.log('\nDeploy this zip to Hostinger. content.json on the server is preserved across deploys.')
})
