# Hostinger Deployment - Large File Upload Fix

## Quick Start on Hostinger

### Step 1: Update Your Project Files

Replace these files with the new versions (all are included in your updated project):
- ✅ `app/api/content/route.ts` - Optimized for large files
- ✅ `app/api/upload/route.ts` - Image compression
- ✅ `lib/content-context.tsx` - Better retry logic
- ✅ `lib/data-sync.ts` - New sync utility
- ✅ `package.json` - Added `sharp` dependency

### Step 2: Ensure Data Directory Permissions

SSH into your Hostinger server and run:
```bash
# Create data directory if it doesn't exist
mkdir -p /home/YOUR_USERNAME/public_html/data

# Make it writable by the Node.js process
chmod 755 /home/YOUR_USERNAME/public_html/data

# Verify it exists
ls -la /home/YOUR_USERNAME/public_html/data
```

### Step 3: Install Dependencies

In your Hostinger Node.js environment:
```bash
cd /home/YOUR_USERNAME/public_html

# Install dependencies including sharp
npm install
# or if using pnpm
pnpm install

# Verify sharp is installed
npm list sharp
```

### Step 4: Rebuild and Restart

```bash
# Build the Next.js app
npm run build

# Restart your Node.js application (method depends on your Hostinger setup)
pm2 restart YOUR_APP_NAME
# or
systemctl restart node-YOUR_APP_NAME
```

### Step 5: Test Upload

1. Access your admin panel
2. Go to Hero section
3. Upload a test image
4. Check browser console for: `[v0] ✓ Content PERMANENTLY saved to server disk`
5. Refresh page - image should still be there

## Troubleshooting on Hostinger

### Problem: "File cannot be written"
**Root Cause**: Data directory doesn't exist or isn't writable  
**Solution**:
```bash
# SSH to server
ssh YOUR_USERNAME@YOUR_DOMAIN.com

# Create and fix permissions
mkdir -p /home/YOUR_USERNAME/public_html/data
chmod 755 /home/YOUR_USERNAME/public_html/data

# Test write permission
touch /home/YOUR_USERNAME/public_html/data/test.txt
rm /home/YOUR_USERNAME/public_html/data/test.txt
```

### Problem: "sharp: not installed"
**Root Cause**: Sharp dependency missing  
**Solution**:
```bash
cd /home/YOUR_USERNAME/public_html
npm install sharp

# Verify
npm list sharp
```

### Problem: "Timeout after 60 seconds"
**Root Cause**: Large file or slow server response  
**Solution**:
1. Upload smaller images first (test with <2MB)
2. Check Hostinger disk usage: `df -h`
3. If nearly full, delete old backups: `rm /home/YOUR_USERNAME/public_html/data/content-backup-*.json`
4. Restart Node.js process: `pm2 restart YOUR_APP_NAME`

### Problem: "Cannot find module 'sharp'"
**Root Cause**: Sharp native bindings failed to compile  
**Solution**:
```bash
# Hostinger may need rebuild
npm rebuild sharp

# If that fails, try from source
npm install sharp --build-from-source

# If still fails, as fallback remove image compression in upload route
# The app will still work, just without compression
```

### Problem: Old uploads still showing errors
**Root Cause**: Cache issue  
**Solution**:
```bash
# Clear server-side cache (in Node.js admin panel if available)
# or restart the app
pm2 restart YOUR_APP_NAME

# In browser, clear cache
# Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
```

## Performance Monitoring on Hostinger

### Check File Size
```bash
# SSH to server
ls -lh /home/YOUR_USERNAME/public_html/data/content.json

# Example output:
# -rw-r--r-- 1 username username 4.2M Jan 10 15:30 content.json
```

If file grows past 15MB, consider archiving old images.

### Monitor Disk Space
```bash
df -h

# Shows free space. If <10% free, start removing old backups
rm /home/YOUR_USERNAME/public_html/data/content-backup-*.json
```

### Check Recent Errors
```bash
# View Node.js application logs (method varies by Hostinger setup)
pm2 logs YOUR_APP_NAME | tail -n 50

# or check Hostinger error logs
tail -n 50 /home/YOUR_USERNAME/logs/error.log
```

## Preventing Future Issues

### 1. Regular Backups
```bash
# Create monthly backup
cd /home/YOUR_USERNAME/public_html/data
cp content.json content-backup-$(date +%Y%m%d).json

# Keep only last 3 backups
ls -t content-backup-*.json | tail -n +4 | xargs rm
```

### 2. Monitor Upload Frequency
- Track when your data file last changed
```bash
stat /home/YOUR_USERNAME/public_html/data/content.json | grep Modify
```

### 3. Set Upload Limits (Optional)
In `app/api/upload/route.ts`, you can reduce limits if needed:
```typescript
const maxImageSize = 3 * 1024 * 1024 // Reduced from 5MB to 3MB
```

## Rollback If Issues Occur

If you experience problems after deploying:

```bash
# SSH to server
cd /home/YOUR_USERNAME/public_html

# Restore from your latest backup
cp data/content-backup-LATEST.json data/content.json

# Rebuild and restart
npm run build
pm2 restart YOUR_APP_NAME
```

## Support Resources

### Check Logs
```bash
# View all recent errors
pm2 logs YOUR_APP_NAME

# Or check Hostinger panel for "Error Logs"
```

### Verify Connectivity
```bash
# Test Node.js is running
curl http://YOUR_DOMAIN.com/api/content

# Should return JSON with your content
```

### Test From Browser Console
```javascript
// In browser console (F12), test the save endpoint
fetch('/api/content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: { test: 'data' } })
}).then(r => r.json()).then(console.log)
```

## Key Improvements Summary

| Issue | Before | After |
|-------|--------|-------|
| Upload size limit | 3MB | 5MB |
| Max stored data | ~5MB | 20MB |
| Image optimization | None | Automatic |
| Save retries | 3 | 4 |
| Timeout handling | None | ✓ Handled |
| Concurrent writes | Possible corruption | Queued safely |
| Write persistence | Unreliable | Atomic writes |

## Next Steps

1. ✅ Deploy the updated files
2. ✅ Verify data directory permissions
3. ✅ Install dependencies with `npm install`
4. ✅ Rebuild with `npm run build`
5. ✅ Restart Node.js process
6. ✅ Test by uploading an image
7. ✅ Monitor first 24 hours for issues
8. ✅ Create regular backups

You're all set! Your uploads should now work reliably with multiple images across different sections.
