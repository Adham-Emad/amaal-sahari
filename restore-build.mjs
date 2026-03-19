/**
 * restore-build.mjs
 * Called by `npm run build` on the production server (Hostinger).
 *
 * If a pre-built backup exists (.next-build-backup/) AND the .hostinger-deploy
 * sentinel is present, the backup is restored to .next/ so the server uses our
 * verified local build instead of a fresh Hostinger build (which may produce
 * incomplete chunks due to Node version / memory differences on shared hosting).
 *
 * Without the sentinel or backup, falls back to `next build` normally.
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

if (existsSync('.hostinger-deploy') && existsSync(join(BACKUP, 'BUILD_ID'))) {
  console.log('=== Hostinger: restoring pre-built .next from backup ===')
  if (existsSync(NEXT)) rmSync(NEXT, { recursive: true, force: true })
  copyDir(BACKUP, NEXT)
  const chunks  = readdirSync(join(NEXT, 'static', 'chunks')).length
  const buildId = readFileSync(join(NEXT, 'BUILD_ID'), 'utf8').trim()
  console.log(`=== Restored: ${chunks} chunks, Build ID: ${buildId} ===`)
} else {
  console.log('Running next build...')
  execSync('next build', { stdio: 'inherit' })
}
