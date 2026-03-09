import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const maxDuration = 30

export async function GET(request: NextRequest) {
  try {
    const DATA_DIR = path.join(process.cwd(), 'data')
    const CONTENT_FILE = path.join(DATA_DIR, 'content.json')
    const BACKUP_FILE = path.join(DATA_DIR, 'content-backup.json')
    const TEMP_DIR = path.join(DATA_DIR, '.tmp')

    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      cwd: process.cwd(),
      directories: {},
      files: {},
      permissions: {},
      issues: []
    }

    // Check data directory
    try {
      const stat = fs.statSync(DATA_DIR)
      diagnostics.directories.data = {
        exists: true,
        isDirectory: stat.isDirectory(),
        mode: '0o' + stat.mode.toString(8),
        sizeBytes: stat.size
      }

      // Check write access
      try {
        fs.accessSync(DATA_DIR, fs.constants.W_OK)
        diagnostics.permissions.dataWrite = 'OK'
      } catch {
        diagnostics.permissions.dataWrite = 'DENIED'
        diagnostics.issues.push('Data directory is NOT writable - this will prevent saves')
      }

      // Check read access
      try {
        fs.accessSync(DATA_DIR, fs.constants.R_OK)
        diagnostics.permissions.dataRead = 'OK'
      } catch {
        diagnostics.permissions.dataRead = 'DENIED'
        diagnostics.issues.push('Data directory is NOT readable')
      }
    } catch (err) {
      diagnostics.directories.data = {
        exists: false,
        error: err instanceof Error ? err.message : String(err)
      }
      diagnostics.issues.push('Data directory does not exist or cannot be accessed')
    }

    // Check content.json
    try {
      const stat = fs.statSync(CONTENT_FILE)
      const sizeMB = (stat.size / 1024 / 1024).toFixed(2)
      const content = fs.readFileSync(CONTENT_FILE, 'utf-8')
      const parsed = JSON.parse(content)

      diagnostics.files.content = {
        exists: true,
        sizeBytes: stat.size,
        sizeMB: parseFloat(sizeMB as string),
        lastModified: new Date(stat.mtime).toISOString(),
        isValid: true,
        keys: Object.keys(parsed || {})
      }

      // Check write access to file
      try {
        fs.accessSync(CONTENT_FILE, fs.constants.W_OK)
        diagnostics.permissions.contentWrite = 'OK'
      } catch {
        diagnostics.permissions.contentWrite = 'DENIED'
        diagnostics.issues.push('content.json is NOT writable')
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      diagnostics.files.content = {
        exists: fs.existsSync(CONTENT_FILE),
        error: errMsg,
        isValid: false
      }
      diagnostics.issues.push('content.json cannot be read or is corrupted: ' + errMsg)
    }

    // Check backup file
    try {
      if (fs.existsSync(BACKUP_FILE)) {
        const stat = fs.statSync(BACKUP_FILE)
        diagnostics.files.backup = {
          exists: true,
          sizeBytes: stat.size,
          sizeMB: (stat.size / 1024 / 1024).toFixed(2),
          lastModified: new Date(stat.mtime).toISOString()
        }
      } else {
        diagnostics.files.backup = { exists: false }
      }
    } catch (err) {
      diagnostics.files.backup = {
        exists: false,
        error: err instanceof Error ? err.message : String(err)
      }
    }

    // Check temp directory
    try {
      if (fs.existsSync(TEMP_DIR)) {
        const stat = fs.statSync(TEMP_DIR)
        const files = fs.readdirSync(TEMP_DIR)
        
        diagnostics.directories.temp = {
          exists: true,
          fileCount: files.length,
          mode: '0o' + stat.mode.toString(8),
          files: files.slice(0, 10) // Show first 10 files
        }

        if (files.length > 20) {
          diagnostics.issues.push('Temp directory has ' + files.length + ' files - should be cleaned up')
        }
      } else {
        diagnostics.directories.temp = { exists: false }
      }
    } catch (err) {
      diagnostics.directories.temp = {
        exists: false,
        error: err instanceof Error ? err.message : String(err)
      }
    }

    // Disk space check (Node.js 18.17+)
    try {
      const { execSync } = require('child_process')
      const dfOutput = execSync('df -h ' + DATA_DIR, { encoding: 'utf-8' })
      diagnostics.diskSpace = dfOutput.split('\n')[1] // Get the relevant line
    } catch {
      diagnostics.diskSpace = 'Could not determine disk space'
    }

    // System info
    diagnostics.system = {
      platform: process.platform,
      nodeVersion: process.version,
      uptime: process.uptime()
    }

    return NextResponse.json({
      success: true,
      diagnostics,
      recommendations: getDiagnosticRecommendations(diagnostics.issues)
    }, { status: 200 })
  } catch (error) {
    console.error('[v0] Diagnostic error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Diagnostic failed'
    }, { status: 500 })
  }
}

function getDiagnosticRecommendations(issues: string[]): string[] {
  const recommendations: string[] = []

  if (issues.some(i => i.includes('NOT writable'))) {
    recommendations.push('FIX: SSH into Hostinger and run: chmod 755 /home/username/public_html/data')
    recommendations.push('FIX: Check file ownership: chown -R username:username /home/username/public_html/data')
  }

  if (issues.some(i => i.includes('corrupted'))) {
    recommendations.push('ACTION: Restore from backup file (content-backup.json) or start fresh')
  }

  if (issues.some(i => i.includes('Temp directory'))) {
    recommendations.push('ACTION: Connect via SSH and run: rm -f /path/to/data/.tmp/*')
  }

  if (issues.length === 0) {
    recommendations.push('✓ All systems operational - saves should work correctly')
  }

  return recommendations
}
