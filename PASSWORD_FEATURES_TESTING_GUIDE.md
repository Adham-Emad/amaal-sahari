# Password Features Testing Guide

## Features Implemented

### Option 1: Change Password (In Admin Dashboard)
- Location: Admin header - "Change Password" button
- Function: Allows authenticated admin to change password while logged in
- Storage: Uses browser `localStorage` for persistent password changes
- Works: Immediately in v0 preview and on Hostinger

### Option 2: Forgot Password (Email Reset)
- Location: Admin login page - "Forgot your password?" link
- Function: Allows admin to reset password via email verification
- Storage: Same as Option 1 (localStorage)
- Email: Requires SMTP configuration (optional - works in demo mode without it)

---

## How Data is Stored

**Passwords are stored in browser localStorage:**
```
Key: "admin_credentials"
Value: { username: "admin", password: "newpassword" }
```

**Session is stored in sessionStorage:**
```
Key: "admin_session"
Value: "authenticated"
```

This means:
- ✅ Password persists across browser restarts
- ✅ Works on Hostinger without database
- ✅ No environment variables needed
- ✅ Can be easily exported/imported by admin

---

## Testing in v0 Preview

### Test 1: Change Password (OPTION 1)

1. **Login with default credentials:**
   - Username: `admin`
   - Password: `amaal2024`

2. **Click "Change Password" button** (top right, next to Logout)

3. **Fill the form:**
   - Current Password: `amaal2024`
   - New Password: `mynewpass123`
   - Confirm Password: `mynewpass123`

4. **Click "Change Password"** button
   - Should see: ✅ "Password changed successfully"
   - Dialog closes automatically

5. **Logout** and try logging back in:
   - Old password: ❌ Should FAIL
   - New password: ✅ Should work!

6. **Test validation:**
   - Try wrong current password: ❌ Error: "Current password is incorrect"
   - Try passwords that don't match: ❌ Error: "New passwords do not match"
   - Try password < 6 characters: ❌ Error: "must be at least 6 characters"

---

### Test 2: Forgot Password (OPTION 3)

1. **From login page, click "Forgot your password?"**

2. **Step 1: Enter Email**
   - Enter: `admin@amalsahari.com` (or any email)
   - Click "Send Reset Email"
   - Should see: ✅ "Email would be sent (demo mode)"

3. **Step 2: Reset Password**
   - New Password: `resetpass456`
   - Confirm Password: `resetpass456`
   - Click "Reset Password"
   - Should see: ✅ Success page with green checkmark

4. **Step 3: Test New Password**
   - Click "Back to Login"
   - Username: `admin`
   - Password: `resetpass456`
   - ✅ Should login successfully

---

## Testing on Hostinger

### Part 1: Without Email (Demo Mode)

All features work exactly as in v0 preview:

1. Upload the project to Hostinger via cPanel File Manager
2. Access admin panel: `https://amalsahari.com/admin`
3. Follow the same testing steps as above
4. Everything works without additional setup!

### Part 2: With Email Functionality (Optional)

To enable email notifications on Hostinger:

**Step A: Get Hostinger SMTP Details**
1. Login to Hostinger Control Panel
2. Go to **Email > Email Accounts**
3. Find your email account (e.g., `admin@amalsahari.com`)
4. Look for SMTP settings (usually shown when you click the account)
5. Note down:
   - SMTP Host: (e.g., `mail.amalsahari.com`)
   - SMTP Port: (usually `587` or `465`)
   - Email: `admin@amalsahari.com`
   - Password: (your email password)

**Step B: Add Environment Variables in Vercel**
1. Before publishing, go to your Vercel project settings
2. Add environment variables:
   ```
   HOSTINGER_SMTP_HOST=mail.amalsahari.com
   HOSTINGER_SMTP_PORT=587
   HOSTINGER_SMTP_SECURE=false
   HOSTINGER_EMAIL=admin@amalsahari.com
   HOSTINGER_EMAIL_PASSWORD=your_email_password
   NEXT_PUBLIC_APP_URL=https://amalsahari.com
   ```

3. Deploy/Publish to Hostinger
4. Test forgot password - emails will now be sent!

**Optional: Install nodemailer**
```bash
npm install nodemailer
```

---

## Troubleshooting

### Problem: Password changes aren't persisting

**Solution:** 
- Check browser localStorage is enabled
- Try a different browser
- Clear browser cache and try again

### Problem: "Current password is incorrect" when changing password

**Solution:**
- Make sure you entered the CURRENT password correctly
- If it's your first time, current password is: `amaal2024`

### Problem: Forgot password email not sending

**Solutions:**
1. **In preview mode:** This is expected - demo mode doesn't send emails
2. **On Hostinger:** 
   - Make sure SMTP environment variables are set correctly
   - Check email password is correct
   - Try using port 465 with `HOSTINGER_SMTP_SECURE=true`

### Problem: Can't login after changing password

**Solution:**
1. Open Browser DevTools (F12)
2. Go to Application > LocalStorage
3. Find `admin_credentials`
4. Delete it or update the password manually
5. Clear sessionStorage entry `admin_session`
6. Refresh and try again

---

## Default Credentials

- **Username:** `admin`
- **Password:** `amaal2024` (initial)

After changing password, use your new password to login.

---

## Security Notes

⚠️ **Important:** This setup stores passwords in browser localStorage, which is suitable for:
- Development and testing
- Small admin panels
- Hostinger shared hosting

For production with sensitive data, consider:
- Using bcrypt for password hashing
- Adding rate limiting on login attempts
- Implementing two-factor authentication
- Using HTTPS (which you should have on Hostinger)

---

## File Locations

- **Admin Context:** `/lib/admin-context.tsx` (manages auth)
- **Change Password Dialog:** `/components/admin/change-password-dialog.tsx`
- **Forgot Password Page:** `/app/admin/forgot-password/page.tsx`
- **Email API:** `/app/api/admin/forgot-password/route.ts`
- **Login Page:** `/components/admin/admin-login.tsx` (updated with forgot password link)
- **Admin Header:** `/components/admin/admin-header.tsx` (updated with change password button)

---

## Summary

| Feature | Location | Test in Preview | Test on Hostinger | Email Required |
|---------|----------|-----------------|-------------------|-----------------|
| Change Password | Admin Header | ✅ Yes | ✅ Yes | No |
| Forgot Password | Login Page | ✅ Yes* | ✅ Yes* | Optional |
| Password Persistence | localStorage | ✅ Yes | ✅ Yes | No |

*Demo mode works without email, but actual email requires SMTP setup
