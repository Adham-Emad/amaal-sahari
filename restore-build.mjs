/**
 * restore-build.mjs
 * Called by `npm run build` on the production server (Hostinger).
 *
 * Strategy:
 *   1. If .next-build-backup/BUILD_ID exists → restore it to .next/
 *   2. Install a next-binary wrapper so any SUBSEQUENT call to `next build`
 *      (e.g. from Hostinger's own build detection) is intercepted and skipped,
 *      preventing Hostinger from overwriting our server manifests with its own
 *      broken build output (which consistently fails to produce certain chunks).
 *
 *   If no backup is found → fall back to `next build` normally.
 *
 * To update the pre-built backup: run `npx next build` locally in Replit,
 * then copy .next → .next-build-backup, re-create the deployment zip.
 */

import {
  existsSync, mkdirSync, readdirSync, copyFileSync, rmSync,
  readFileSync, writeFileSync, chmodSync, statSync
} from 'fs'
import { join, resolve } from 'path'
import { execSync } from 'child_process'

const BACKUP = '.next-build-backup'
const NEXT   = '.next'

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Next-binary interceptor ──────────────────────────────────────────────────
// Replaces node_modules/.bin/next with a wrapper that skips `next build` when
// .next/BUILD_ID already exists, but passes everything else through unchanged.

function installNextWrapper() {
  const binDir   = resolve('node_modules/.bin')
  const wrapperPath = join(binDir, 'next')
  const realBinPath = resolve('node_modules/next/dist/bin/next')

  if (!existsSync(realBinPath)) {
    console.log('  [wrapper] next binary not found, skipping wrapper install')
    return
  }

  // Store real path so the wrapper can find it
  const wrapperCode = `#!/usr/bin/env node
// next-build-interceptor — installed by restore-build.mjs
// Skips 'next build' if .next/BUILD_ID already exists (pre-built deployment).
// All other next commands (start, lint, etc.) are passed through unchanged.
const fs   = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const args    = process.argv.slice(2)
const command = args[0] || ''

if (command === 'build' && fs.existsSync(path.join(process.cwd(), '.next', 'BUILD_ID'))) {
  console.log('=== next build intercepted: pre-built .next is already in place — skipping rebuild ===')
  process.exit(0)
}

// Pass through to the real next binary
const realNext = ${JSON.stringify(realBinPath)}
const child = spawn(process.execPath, [realNext, ...args], { stdio: 'inherit' })
child.on('exit', code => process.exit(code == null ? 0 : code))
child.on('error', err => { console.error(err); process.exit(1) })
`

  // Must remove the symlink first — writeFileSync on a symlink follows it
  // and would corrupt the real binary. rmSync removes the symlink itself.
  try { if (existsSync(wrapperPath)) rmSync(wrapperPath) } catch (_) {}
  writeFileSync(wrapperPath, wrapperCode, 'utf8')
  chmodSync(wrapperPath, 0o755)
  console.log('  [wrapper] installed next-build interceptor at', wrapperPath)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

if (existsSync(join(BACKUP, 'BUILD_ID'))) {
  console.log('=== Pre-built backup found — restoring .next from backup ===')
  if (existsSync(NEXT)) rmSync(NEXT, { recursive: true, force: true })
  copyDir(BACKUP, NEXT)
  const chunks  = readdirSync(join(NEXT, 'static', 'chunks')).length
  const buildId = readFileSync(join(NEXT, 'BUILD_ID'), 'utf8').trim()
  console.log(`=== Restored: ${chunks} chunks, Build ID: ${buildId} ===`)

  // Install the interceptor AFTER restoring so any later `next build` is blocked
  installNextWrapper()
  console.log('=== Deployment ready — next build will be intercepted if called again ===')
} else {
  console.log('No pre-built backup found — running next build...')
  execSync('next build', { stdio: 'inherit' })
}
