# Hostinger Diagnostic Guide - "Saves Work in v0 but Not Live" Issue

## The Problem You're Experiencing

✗ **In v0 Preview**: Updates save correctly, every change works
✗ **On Hostinger Live**: First few updates work, then **stops saving completely**

This is typically caused by **file permission issues, orphaned temp files, or disk space problems** unique to the Hostinger environment.

---

## Why v0 Preview Works But Hostinger Doesn't

### v0 Preview Environment
- Fresh memory state on each deploy
- Serverless auto-scaling
- Automatic file cleanup
- Full read/write permissions by default

### Hostinger Live Environment
- Persistent file system with potential permission drift
- Shared hosting with permission restrictions
- Orphaned temp files accumulate over time
- Disk space may become limited

---

## Step 1: Run the Diagnostic Tool (2 minutes)

This is the fastest way to identify the exact problem.

### Option A: Browser-Based (Easiest)
1. Visit: `https://yourdomain.com/api-health`
2. You'll see:
   - ✓ Green indicators = everything works
   - ✗ Red indicators = problems found
   - Recommendations = exact fixes needed

### Option B: API Call (Alternative)
```bash
curl https://yourdomain.com/api/diagnose
```

You'll see a JSON response showing:
- File permissions
- Directory access
- File sizes
- Disk space
- Specific issues

---

## Step 2: Fix Common Issues

### Issue #1: Directory Not Writable

**Symptom**: Diagnostic shows "Data directory is NOT writable"

**Fix via SSH** (5 minutes):

```bash
# SSH into Hostinger
ssh username@your-domain.com

# Navigate to your app directory
cd public_html/your-app-folder

# Fix permissions (allow owner to read/write/execute)
chmod 755 data/

# Verify it worked
ls -la | grep data
# Should show: drwxr-xr-x

# Double-check content.json
chmod 644 data/content.json
```

### Issue #2: Orphaned Temp Files

**Symptom**: Diagnostic shows "Temp directory has 50+ files"

**Fix via SSH**:

```bash
# SSH into Hostinger
ssh username@your-domain.com

# Navigate to app
cd public_html/your-app-folder

# Remove old temp files
rm -f data/.tmp/*

# Verify
ls -la data/.tmp/
# Should be empty or show only recent files
```

### Issue #3: content.json Corrupted

**Symptom**: Diagnostic shows "corrupted or is invalid"

**Fix via SSH**:

```bash
# SSH into Hostinger
ssh username@your-domain.com

cd public_html/your-app-folder

# Check file size (very important!)
ls -lh data/content.json
# If over 100MB, it's too large

# Restore from backup
cp data/content-backup.json data/content.json

# If no backup exists, start fresh with minimal data
echo '{}' > data/content.json
```

### Issue #4: Disk Space Full

**Symptom**: Diagnostic shows very low available space (< 500MB)

**Fix via SSH**:

```bash
# Check disk usage
df -h
# Look for root filesystem at 100% or >95%

# Find large files/folders
du -sh data/*
du -sh node_modules/

# Clean node_modules if needed (will be rebuilt)
rm -rf node_modules/
npm install

# Or delete old backups if safe
rm -f data/content-backup-*.json
```

---

## Step 3: Verify the Fix

### Method 1: Use Diagnostic Page Again
1. Visit `https://yourdomain.com/api-health`
2. Should show all green checkmarks
3. Click "Run Save Test" button
4. Should show "✓ Save test successful"

### Method 2: Test in Admin
1. Log into admin panel
2. Make a small change (1-2 sentences)
3. Click Save
4. Check admin console (F12 → Console)
5. Should see: `[v0] ✓ Content PERMANENTLY saved`

### Method 3: Manual API Test
```bash
# Test save
curl -X POST https://yourdomain.com/api/content \
  -H "Content-Type: application/json" \
  -d '{"data":{"test":true,"timestamp":"2024-01-01"}}'

# Should return:
# {"success":true,"message":"Content saved..."}

# Test read
curl https://yourdomain.com/api/content

# Should return the data you just saved
```

---

## Advanced Troubleshooting

### Issue: Permission Says OK But Saves Still Fail

**Root cause**: File ownership mismatch (file owned by different user)

**Fix**:

```bash
# Check current user
whoami
# Output should be like: username

# Check file ownership
ls -l data/content.json
# Should show: username username

# Fix ownership if different
chown username:username data/content.json
chown -R username:username data/

# Verify
ls -la data/
```

### Issue: Saves Work After Restart But Fail After Few Hours

**Root cause**: Process running out of file descriptors or hitting limits

**Fix**: Contact Hostinger support with this info:
- "Our app reaches the per-process file descriptor limit"
- Request: "Increase PHP-FPM file descriptors for this account"
- Or: "Increase Node.js process limits"

### Issue: Large Files (>20MB) Won't Save

**Root cause**: Hostinger has upload/post size limits

**Check**:
```bash
# Check PHP limits (if using PHP-FPM)
php -i | grep "upload_max_filesize"
php -i | grep "post_max_size"
```

**Fix via SSH** (edit .htaccess or php.ini):
```apache
# Add to .htaccess in public_html
php_value upload_max_filesize 100M
php_value post_max_size 100M
php_value max_execution_time 300
```

---

## Understanding the Logs

### Good Logs (Saves Working)
```
[v0] Starting save operation - File size: 4.25 MB
[v0] Large file detected - using stream-based write
[v0] Large file saved successfully via stream
[v0] ✓ Content PERMANENTLY saved to server disk in 2847ms
[v0] Save VERIFIED - server returned saved content
```

### Bad Logs (Saves Failing)
```
[v0] Write operation timed out after 45000 ms
[v0] Rename after stream failed: EACCES permission denied
[v0] All write methods failed: ENOSPC (no space left on device)
[v0] Failed to create data directory: EACCES
```

---

## Prevention Going Forward

### Add This to Your Hostinger Cron Jobs

**Login to Hostinger Panel → Cron Jobs → Add New**

```bash
# Clean up temp files daily
0 2 * * * rm -f /home/username/public_html/data/.tmp/* 2>/dev/null

# Check permissions daily
0 3 * * * chmod 755 /home/username/public_html/data/ 2>/dev/null

# Backup data weekly
0 4 * * 0 cp /home/username/public_html/data/content.json /home/username/public_html/data/content-backup-$(date +\%Y\%m\%d).json 2>/dev/null
```

---

## Quick Reference Commands

| Problem | Command | Duration |
|---------|---------|----------|
| Fix directory permissions | `chmod 755 data/` | 1 second |
| Fix file permissions | `chmod 644 data/content.json` | 1 second |
| Clean temp files | `rm -f data/.tmp/*` | 1 second |
| Check disk space | `df -h` | 1 second |
| Check file ownership | `ls -l data/` | 1 second |
| Fix ownership | `chown -R user:user data/` | 2 seconds |
| Restore from backup | `cp data/content-backup.json data/content.json` | 1 second |
| Verify save works | Visit `/api-health` tab "Test Save" | 5 seconds |

---

## When to Contact Hostinger Support

Use this **exact message**:

> "My Node.js application creates files in `/home/username/public_html/data/` directory. After the first few file writes succeed, subsequent writes fail with permission or ENOSPC errors. The application works perfectly on other platforms. Can you verify:
> 1. File descriptor limits for my account
> 2. Disk space availability
> 3. Any file locking mechanisms active
> 4. PHP-FPM or Node.js process limits"

---

## Final Checklist Before Going Live Again

- [ ] Run `/api-health` diagnostic
- [ ] All indicators are GREEN ✓
- [ ] Click "Run Save Test" and it succeeds
- [ ] Make small test change in admin panel
- [ ] See `[v0] ✓ Content PERMANENTLY saved` in console
- [ ] Verify change appears on frontend
- [ ] Check `df -h` shows >1GB available
- [ ] Check `ls -la data/` shows correct permissions (755)
- [ ] Set up cron jobs for maintenance

---

## Still Not Working?

1. **Screenshot the `/api-health` page** showing the errors
2. **Share the recommendation text** it provides
3. **Provide the exact error message** from browser console
4. **SSH output** from any commands you ran

This will help quickly identify the root cause!
