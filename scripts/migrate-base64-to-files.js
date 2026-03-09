#!/usr/bin/env node
/**
 * Migration Script: Convert Base64 Images to Files
 * 
 * This script converts all base64-encoded images in content.json to actual files
 * stored in public/uploads/, and updates the JSON to reference the file paths.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const CONTENT_BACKUP_FILE = path.join(DATA_DIR, 'content-backup-pre-migration.json');

console.log('[Migration] Starting base64 to file conversion...\n');

// Ensure directories exist
function ensureDirs() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log('[Migration] Created uploads directory:', UPLOADS_DIR);
  }
}

// Generate unique filename
function generateFilename(mimeType) {
  const ext = mimeType === 'image/jpeg' ? 'jpg' : mimeType.split('/')[1] || 'jpg';
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  return `${timestamp}-${random}.${ext}`;
}

// Convert base64 to file
function convertBase64ToFile(base64Data, mimeType) {
  try {
    // Remove data URL prefix if present
    let cleanBase64 = base64Data;
    if (base64Data.startsWith('data:')) {
      cleanBase64 = base64Data.split(',')[1];
    }

    // Convert to buffer
    const buffer = Buffer.from(cleanBase64, 'base64');

    // Generate filename and save
    const filename = generateFilename(mimeType);
    const filepath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filepath, buffer);

    console.log('[Migration] Converted image:', filename, `(${(buffer.length / 1024).toFixed(1)}KB)`);
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('[Migration] Error converting base64:', error.message);
    return null;
  }
}

// Find all base64 images in object recursively
function findBase64Images(obj, path = '') {
  const images = [];

  if (typeof obj !== 'object' || obj === null) {
    return images;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      images.push(...findBase64Images(item, `${path}[${index}]`));
    });
  } else {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      // Check if this is a base64 image
      if (typeof value === 'string' && value.startsWith('data:image/')) {
        images.push({
          path: currentPath,
          value: value,
          mimeType: value.match(/data:(image\/\w+)/)?.[1] || 'image/jpeg'
        });
      } else if (typeof value === 'object' && value !== null) {
        images.push(...findBase64Images(value, currentPath));
      }
    });
  }

  return images;
}

// Set value in nested object by path
function setValueByPath(obj, path, value) {
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

// Main migration
function migrate() {
  try {
    // Read content.json
    if (!fs.existsSync(CONTENT_FILE)) {
      console.error('[Migration] content.json not found!');
      process.exit(1);
    }

    console.log('[Migration] Reading content.json...');
    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));

    // Create backup
    fs.writeFileSync(CONTENT_BACKUP_FILE, JSON.stringify(content, null, 2));
    console.log('[Migration] Backup created:', path.basename(CONTENT_BACKUP_FILE));

    // Find all base64 images
    const images = findBase64Images(content);
    console.log(`\n[Migration] Found ${images.length} base64 images to migrate\n`);

    if (images.length === 0) {
      console.log('[Migration] No base64 images found. Your content is already optimized!');
      process.exit(0);
    }

    // Convert each image
    let converted = 0;
    images.forEach((image, index) => {
      console.log(`[${index + 1}/${images.length}] Converting: ${image.path}`);
      const fileUrl = convertBase64ToFile(image.value, image.mimeType);
      
      if (fileUrl) {
        setValueByPath(content, image.path, fileUrl);
        converted++;
      }
    });

    // Calculate size reduction
    const originalSize = fs.statSync(CONTENT_FILE).size;
    const newSize = JSON.stringify(content, null, 2).length;
    const saved = originalSize - newSize;
    const reduction = ((saved / originalSize) * 100).toFixed(1);

    console.log(`\n[Migration] Conversion complete!`);
    console.log(`[Migration] ${converted}/${images.length} images converted successfully`);
    console.log(`\n[Migration] Size reduction:`);
    console.log(`  Before: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  After:  ${(newSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Saved:  ${(saved / 1024 / 1024).toFixed(2)}MB (${reduction}% reduction)\n`);

    // Save updated content
    console.log('[Migration] Saving updated content.json...');
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));

    console.log('[Migration] Migration complete!');
    console.log('[Migration] ✓ Old backup: ' + path.basename(CONTENT_BACKUP_FILE));
    console.log('[Migration] ✓ Image files: ' + UPLOADS_DIR);
    console.log('[Migration] ✓ Updated JSON: ' + path.basename(CONTENT_FILE));
    console.log('\n[Migration] Next steps:');
    console.log('  1. Test your website - all images should still display');
    console.log('  2. Check public/uploads/ folder for migrated images');
    console.log('  3. You can now upload unlimited new images!');
    console.log('  4. Keep backup file for reference');

  } catch (error) {
    console.error('[Migration] Error during migration:', error);
    process.exit(1);
  }
}

// Run migration
ensureDirs();
migrate();
