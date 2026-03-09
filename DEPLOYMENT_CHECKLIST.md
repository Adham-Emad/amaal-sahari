# Deployment Checklist - Large File Upload Fix

## Pre-Deployment (Before You Start)

### Code Files
- [x] ✅ `app/api/content/route.ts` - Optimized with queue & streaming
- [x] ✅ `app/api/upload/route.ts` - Image compression enabled
- [x] ✅ `lib/content-context.tsx` - Better retry logic
- [x] ✅ `package.json` - Sharp dependency added
- [ ] Backup current code (git commit recommended)

### Environment
- [ ] Hostinger credentials available
- [ ] SSH access to server ready
- [ ] pnpm/npm command line access
- [ ] File backup location identified

---

## Step 1: Prepare (5 minutes)

### 1.1 Backup Current Data
```bash
# On Hostinger server
cd /home/YOUR_USERNAME/public_html
mkdir -p backups
cp data/content.json backups/content-pre-fix-$(date +%Y%m%d-%H%M%S).json
echo "Backup created ✓"
```

**Verification:**
- [ ] Backup file exists: `ls -lh backups/`
- [ ] File size reasonable (should match current content.json)

### 1.2 Verify Current Setup
```bash
# Check current Node.js version
node --version
# Should be v16+ (ideally v18+)

# Check npm installed
npm --version

# Check data directory exists
ls -la data/
```

**Verification:**
- [ ] Node.js version ≥ v16
- [ ] npm installed
- [ ] data/ directory exists and writable

---

## Step 2: Deploy Files (2 minutes)

### 2.1 Update Code Files
Replace these files with updated versions:
```bash
# These files are already updated in your project
# Just push to Hostinger
```

**Files to Deploy:**
- [ ] `app/api/content/route.ts`
- [ ] `app/api/upload/route.ts`
- [ ] `lib/content-context.tsx`
- [ ] `package.json` (includes sharp)

**Verification:**
```bash
# Verify files deployed
grep -l "Write Queue" app/api/content/route.ts
grep -l "sharp" app/api/upload/route.ts
grep -l "Dynamic timeout" lib/content-context.tsx
```

---

## Step 3: Install Dependencies (3-5 minutes)

### 3.1 Install NPM Packages
```bash
cd /home/YOUR_USERNAME/public_html
npm install
```

**What happens:**
- npm reads package.json
- Installs/updates all dependencies
- Installs sharp (image compression library)
- Creates node_modules/ folder

**Verification:**
```bash
# Verify sharp installed
npm list sharp
# Should show: sharp@^0.33.0

# Verify size (should be at least 50MB with native bindings)
du -sh node_modules/sharp/

# Verify build process
npm list
# Should show no errors
```

### 3.2 Check Installation
```bash
# If sharp fails to install:
npm rebuild sharp

# If still fails:
npm install sharp --build-from-source

# Verify again
npm list sharp
```

**Verification:**
- [ ] `npm list sharp` shows version
- [ ] No error messages
- [ ] `node_modules/sharp/` directory exists

---

## Step 4: Build Application (2-3 minutes)

### 4.1 Build Next.js App
```bash
npm run build
```

**What happens:**
- Next.js compiles all code
- Optimizes for production
- Creates .next/ folder
- Validates all imports

**Verification:**
```bash
# Build should complete with:
# ✓ Route (ssg)
# ✓ Route (ssr)
# ✓ Total duration
# NO errors

# Check build output
ls -la .next/
# Should have: server, static, etc.
```

### 4.2 Check for Errors
```bash
# If build fails, common issues:
# 1. Missing dependencies
npm install

# 2. TypeScript errors
npm run build -- --debug

# 3. Permission issues
chmod 755 data/
```

**Verification:**
- [ ] Build completes without errors
- [ ] `.next/` directory created
- [ ] No "ERROR" messages in output

---

## Step 5: Restart Application (2 minutes)

### 5.1 Restart via PM2 (if using PM2)
```bash
# List running apps
pm2 list

# Restart your app
pm2 restart your-app-name
# Or restart all apps
pm2 restart all

# Verify it restarted
pm2 logs your-app-name | head -20
```

**Verification:**
```bash
# Should see in logs:
# ✓ Ready on 0.0.0.0:3000
# ✓ compiled successfully
```

### 5.2 Alternative: Manual Restart (if not using PM2)
```bash
# Kill existing process
ps aux | grep node
# Find your Node.js PID

kill [PID]

# Start app again
npm run start
# Or use: node .next/standalone/server.js
```

### 5.3 Restart via Hostinger Control Panel
1. Log in to Hostinger
2. Go to "Node.js Applications"
3. Find your app
4. Click "Restart"
5. Wait for green status light

**Verification:**
- [ ] App shows as running (green status)
- [ ] No errors in console output

---

## Step 6: Verify Deployment (3-5 minutes)

### 6.1 Health Check
```bash
# Test if server is responding
curl http://localhost:3000/

# Should return HTML (admin dashboard loads)
```

### 6.2 API Test
```bash
# Test content API
curl -X GET http://localhost:3000/api/content \
  -H "Content-Type: application/json"

# Should return JSON with your content
# Should include: { "success": true, "data": {...} }
```

### 6.3 Upload Test
```bash
# Create test image
convert -size 100x100 xc:red test.jpg 2>/dev/null || \
  dd if=/dev/zero of=test.jpg bs=1K count=100

# Test upload endpoint
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test.jpg"

# Should return: { "url": "data:image/jpeg;base64,..." }

# Cleanup
rm test.jpg
```

**Verification:**
- [ ] API endpoints respond (no 404 errors)
- [ ] Content endpoint returns data
- [ ] Upload endpoint accepts files

---

## Step 7: First Upload Test (5-10 minutes)

### 7.1 Test in Admin Panel
1. Open browser: `https://yourdomain.com/admin`
2. Login with admin credentials
3. Navigate to "Hero" section
4. Upload a test image
5. Watch browser console (F12)

**Expected in Console:**
```
[v0] Upload endpoint called
[v0] Processing file: test.jpg Type: image/jpeg Size: XXXXX
[v0] File converted to base64, payload size: XXXXX
[v0] Attempting server save (attempt 1/4) - Payload: X.XXMB...
[v0] ✓ Content PERMANENTLY saved to server disk in XXXXms
```

**Verification:**
- [ ] No errors in console
- [ ] Console shows "PERMANENTLY saved"
- [ ] Admin page shows the image

### 7.2 Verify Persistence
1. Refresh the page (F5)
2. Image should still be there
3. Open browser DevTools (F12)
4. Clear cache and reload (Ctrl+Shift+Delete)
5. Page reloads
6. Image still visible?

**Verification:**
- [ ] Image visible after normal refresh
- [ ] Image visible after cache clear
- [ ] Image visible after multiple page reloads

---

## Step 8: Multi-Section Test (10 minutes)

### 8.1 Upload to Multiple Sections
1. Hero section → Upload image → Save
2. Services section → Upload image → Save
3. Case Studies section → Upload image → Save
4. About section → Upload image → Save

**Expected Behavior:**
- Each save completes independently
- Console shows "PERMANENTLY saved" for each
- No errors occur

**Verification:**
- [ ] All 4 sections save independently
- [ ] Console clean (no errors)
- [ ] All images visible

### 8.2 Refresh Test
1. Refresh page (F5)
2. All 4 images still visible?

**Verification:**
- [ ] All images persist
- [ ] Page loads normally
- [ ] No broken images

---

## Step 9: Large Batch Test (15 minutes)

### 9.1 Upload Many Images
1. Go to different sections
2. Upload 10-15 images total
3. Click Save
4. Monitor console

**Expected Behavior:**
```
[v0] Attempting server save (attempt 1/4) - Payload: 8.5MB...
[v0] Starting save operation - File size: 8.5 MB
[v0] ✓ Content PERMANENTLY saved in 4234ms
```

**Verification:**
- [ ] Save completes successfully
- [ ] Console shows success
- [ ] No timeout errors

### 9.2 Wait 2 Minutes
- Let server stabilize
- Check disk space: `df -h`
- Verify no background processes struggling

**Verification:**
- [ ] Server responsive
- [ ] Disk space adequate (>10% free)
- [ ] No load spikes

---

## Step 10: Monitor (First 24 Hours)

### 10.1 Daily Checks
```bash
# Check file size growth
du -h data/content.json

# Check for errors
pm2 logs your-app-name | tail -50 | grep ERROR

# Verify backups created
ls -la data/content-backup*.json
```

**Verification Checklist:**
- [ ] No error logs after 1 hour
- [ ] File size reasonable (<20MB)
- [ ] Backups exist and updated

### 10.2 User Acceptance Testing
Have your team:
- [ ] Upload images in admin
- [ ] Verify saves work
- [ ] Refresh and verify persistence
- [ ] Report any issues

**Sign-Off:**
- [ ] Project manager approves
- [ ] Users report success
- [ ] No critical issues found

---

## Rollback Plan (If Needed)

### If Something Goes Wrong

#### Option 1: Restore Backup
```bash
# Restore data from backup
cp data/content-backup-LATEST.json data/content.json

# Rebuild
npm run build

# Restart
pm2 restart your-app-name
```

#### Option 2: Revert Code
```bash
# If you use git
git revert HEAD

# If manual:
# Restore original files from backup
# Rebuild
npm run build

# Restart
pm2 restart your-app-name
```

#### Option 3: Emergency Restart
```bash
# Simple restart often fixes issues
pm2 restart your-app-name

# Or
systemctl restart node-your-app-name
```

**Verification After Rollback:**
- [ ] App starts successfully
- [ ] Old data visible
- [ ] System responsive

---

## Success Criteria ✅

Your deployment is successful if:

- [x] Files deployed without errors
- [x] Dependencies installed (npm install)
- [x] Application builds (npm run build)
- [x] App restarts successfully
- [x] API endpoints respond
- [x] Single image uploads work
- [x] Multiple images save independently
- [x] Images persist after refresh
- [x] Large batch saves work (10+ images)
- [x] No errors in console
- [x] Server disk has space (>10% free)
- [x] No timeout/failure messages
- [x] All users confirm working

---

## Common Issues & Quick Fixes

| Issue | Solution | Verify |
|-------|----------|--------|
| "Module not found: sharp" | `npm install sharp` | `npm list sharp` |
| Build fails | `npm install` then `npm run build` | No ERROR in output |
| App won't start | Check ports free: `lsof -i :3000` | Status: running |
| Uploads timeout | Increase server wait time | Watch console (60+ sec) |
| File permission error | `chmod 755 data/` | `ls -la data/` |
| Old data showing | Clear cache: Ctrl+Shift+Delete | Refresh shows new data |

---

## Post-Deployment (Week 1)

### Daily
- [ ] Check error logs: `pm2 logs`
- [ ] Verify disk space: `df -h`
- [ ] Test upload: Upload 1-2 images

### Weekly
- [ ] Archive old backups
- [ ] Check file size: `du -h data/`
- [ ] Review performance metrics

### Monthly
- [ ] Create full backup
- [ ] Document any issues
- [ ] Plan optimizations if needed

---

## Documentation References

Need help? Check these files:

- **Quick issues**: `QUICK_START.md`
- **Technical details**: `LARGE_FILE_FIX.md`
- **Hostinger-specific**: `HOSTINGER_LARGE_FILE_FIX.md`
- **Architecture**: `ARCHITECTURE_IMPROVEMENTS.md`
- **Visual guide**: `VISUAL_GUIDE.md`

---

## Sign-Off

- Deployment Date: ________________
- Deployed By: ____________________
- Tested By: ______________________
- Approved By: ____________________

### Final Checklist
- [ ] All steps completed
- [ ] All verifications passed
- [ ] No blockers or issues
- [ ] System stable (24+ hours)
- [ ] Users confirmed working
- [ ] Documentation updated

---

**Congratulations!** 🎉 Your application is now ready to handle large file uploads reliably!
