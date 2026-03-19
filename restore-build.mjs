/**
 * restore-build.mjs
 * Called by `npm run build` on the production server (Hostinger).
 *
 * Strategy:
 *   If .next-build-backup/BUILD_ID exists → restore it to .next/ immediately.
 *   This avoids Hostinger running Turbopack (Node 22) which consistently
 *   produces 3 missing chunks due to memory/environment constraints.
 *
 *   If no backup is found → fall back to `next build` normally.
 *
 * To update the pre-built backup: run `node build-and-backup.mjs` locally in
 * Replit, then re-create the deployment zip.
 */

import { existsSync, mkdirSync, readdirSync, copyFileSync, rmSync, readFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const BACKUP = '.next-build-backup'
const NEXT   = '.next'

function copyDir(src, dst) {
  mkdirSync(dst, { recursive: true })
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, entry.name)
    const d = join(dst, entry.name)
    if (entry.isSymbolicLink()) continue
    if (entry.isDirectory()) copyDir(s, d)
    else if (entry.isFile()) copyFileSync(s, d)
  }
}

if (existsSync(join(BACKUP, 'BUILD_ID'))) {
  console.log('=== Pre-built backup found — restoring .next from backup ===')
  if (existsSync(NEXT)) rmSync(NEXT, { recursive: true, force: true })
  copyDir(BACKUP, NEXT)
  const chunks  = readdirSync(join(NEXT, 'static', 'chunks')).length
  const buildId = readFileSync(join(NEXT, 'BUILD_ID'), 'utf8').trim()
  console.log(`=== Restored: ${chunks} chunks, Build ID: ${buildId} ===`)
} else {
  console.log('No pre-built backup found — running next build...')
  execSync('next build', { stdio: 'inherit' })
}
