# TEST PASSWORD FEATURES NOW - Step by Step

Follow this guide to test both password features immediately in v0 preview.

---

## TEST 1: Change Password Feature

### Setup
- Time needed: 2 minutes
- No setup required
- Works in v0 preview

### Step-by-Step

**Step 1: Login to Admin Panel**
```
Go to: http://localhost:3000/admin (or your v0 preview URL)

Fill in:
  Username: admin
  Password: amaal2024

Click: Sign In
```

**Expected Result:**
- ✅ Lands on admin dashboard
- ✅ Sees lots of content tabs
- ✅ "Change Password" button visible in top right (next to "Logout")

---

**Step 2: Click Change Password Button**
```
Look for: Lock icon button labeled "Change Password"
Location: Top right header, between "View Site" and "Logout"
Click: The button
```

**Expected Result:**
- ✅ Dialog opens
- ✅ Shows 3 password fields:
   1. Current Password
   2. New Password
   3. Confirm New Password

---

**Step 3: Test Valid Password Change**
```
Fill in:
  Current Password: amaal2024
  New Password: testpass123
  Confirm New Password: testpass123

Click: "Change Password" button
```

**Expected Result:**
- ✅ Green checkmark appears
- ✅ Message shows: "Password changed successfully"
- ✅ Dialog closes automatically after 1-2 seconds

---

**Step 4: Test New Password Works**
```
Click: Logout button (red button in header)
```

**Expected Result:**
- ✅ Redirected to login page
- ✅ Admin session cleared

```
Try to login with OLD password:
  Username: admin
  Password: amaal2024
  Click: Sign In
```

**Expected Result:**
- ❌ Should FAIL with error: "Invalid username or password"
- ❌ Does NOT login

```
Now try with NEW password:
  Username: admin
  Password: testpass123
  Click: Sign In
```

**Expected Result:**
- ✅ Login SUCCEEDS
- ✅ Back in admin dashboard
- ✅ New password works!

---

**Step 5: Test Validation Errors**

**Test 5a: Wrong Current Password**
```
Click: Change Password button again
Fill in:
  Current Password: wrongpassword
  New Password: another123
  Confirm: another123
Click: Change Password
```

**Expected Result:**
- ❌ Red error message: "Current password is incorrect"
- ❌ Dialog stays open
- Password NOT changed

---

**Test 5b: Passwords Don't Match**
```
Fill in:
  Current Password: testpass123
  New Password: password123
  Confirm: password456  (different!)
Click: Change Password
```

**Expected Result:**
- ❌ Red error message: "New passwords do not match"
- Password NOT changed

---

**Test 5c: Password Too Short**
```
Fill in:
  Current Password: testpass123
  New Password: short
  Confirm: short
Click: Change Password
```

**Expected Result:**
- ❌ Red error message: "must be at least 6 characters"
- Password NOT changed

---

**Step 6: Change Back to Original (Optional)**
```
Click: Change Password again
Fill in:
  Current: testpass123
  New: amaal2024
  Confirm: amaal2024
Click: Change Password
```

**Expected Result:**
- ✅ Password reverted to original
- Now can login with: admin / amaal2024

---

## TEST 2: Forgot Password Feature

### Setup
- Time needed: 2 minutes
- No setup required
- Works in v0 preview

### Step-by-Step

**Step 1: Go to Forgot Password Page**
```
Option A: Click "Forgot your password?" link on login page
Option B: Go directly to: /admin/forgot-password

You should see:
- Reset Password heading
- Lock icon
- Email input field
```

**Expected Result:**
- ✅ Page loads
- ✅ Step 1 shown: "Email Address" field

---

**Step 2: Enter Email and Request Reset**
```
Fill in:
  Email Address: admin@amalsahari.com

Click: "Send Reset Email" button
```

**Expected Result:**
- ✅ Page advances to Step 2
- ✅ Shows message: "Reset email has been sent to admin@amalsahari.com"
- ✅ Now shows 2 password fields:
   1. New Password
   2. Confirm Password

---

**Step 3: Reset Password**
```
Fill in:
  New Password: newresetpass456
  Confirm Password: newresetpass456

Click: "Reset Password" button
```

**Expected Result:**
- ✅ Page advances to Step 3: Success page
- ✅ Green checkmark icon displayed
- ✅ Message: "Your password has been successfully reset"
- ✅ "Back to Login" button available

---

**Step 4: Test Reset Password Works**
```
Click: "Back to Login" button
```

**Expected Result:**
- ✅ Redirected to login page
- ✅ Ready to login again

```
Try to login with NEW password:
  Username: admin
  Password: newresetpass456
  Click: Sign In
```

**Expected Result:**
- ✅ Login SUCCEEDS!
- ✅ In admin dashboard
- ✅ Reset password works!

---

**Step 5: Test That Old Password Fails**
```
Click: Logout
```

```
Try to login with PREVIOUS password:
  Username: admin
  Password: testpass123  (or whatever you changed it to)
  Click: Sign In
```

**Expected Result:**
- ❌ Should FAIL: "Invalid username or password"

---

**Step 6: Test Validation Errors**

**Test 6a: Invalid Email**
```
Go to: /admin/forgot-password
Fill in:
  Email: notanemail
Click: "Send Reset Email"
```

**Expected Result:**
- ❌ Error message: "Please enter a valid email address"
- Stays on Step 1

---

**Test 6b: Passwords Don't Match**
```
Go through Steps 1-2 normally
On Step 3, fill in:
  New Password: password123
  Confirm: password456
Click: "Reset Password"
```

**Expected Result:**
- ❌ Error message: "Passwords do not match"
- Stays on Step 2

---

**Test 6c: Password Too Short**
```
Go through Steps 1-2 normally
Fill in:
  New Password: short
  Confirm: short
Click: "Reset Password"
```

**Expected Result:**
- ❌ Error message: "Password must be at least 6 characters"
- Stays on Step 2

---

## Test Results Summary

### Change Password Tests
- [ ] Can open dialog
- [ ] Can change password
- [ ] Old password fails after change
- [ ] New password works after change
- [ ] Wrong current password shows error
- [ ] Mismatched passwords show error
- [ ] Short passwords show error
- [ ] All validation works

### Forgot Password Tests
- [ ] Can access forgot password page
- [ ] Can request reset email
- [ ] Can set new password
- [ ] New password works for login
- [ ] Old password fails after reset
- [ ] Invalid email shows error
- [ ] Mismatched passwords show error
- [ ] Short passwords show error
- [ ] All validation works

### Overall Assessment
- [ ] All features work as expected
- [ ] No errors in browser console
- [ ] Password persistence works
- [ ] Ready for Hostinger testing

---

## What to Check After Testing

### In Browser Console (F12)
- ✅ No red errors
- ✅ No warning messages
- ✅ localStorage shows `admin_credentials` key

### In v0 Preview
- ✅ Change password button visible
- ✅ Forgot password link visible
- ✅ Both flows work completely
- ✅ Navigation between pages works

### Password Persistence
- ✅ After changing password and logout, new password works
- ✅ Browser localStorage has the password saved
- ✅ Session is properly managed

---

## If Something Doesn't Work

### Issue: Password changes don't stick
**Solution:**
1. Open DevTools (F12)
2. Go to Application > LocalStorage
3. Look for `admin_credentials` key
4. Check if it contains your new password
5. If not, localStorage is disabled - enable it in browser settings

### Issue: Getting "Current password is incorrect"
**Solution:**
1. Make sure you're typing current password EXACTLY
2. Passwords are case-sensitive (abc ≠ ABC)
3. No extra spaces
4. Check you're on the right password before attempting change

### Issue: Dialog won't close after password change
**Solution:**
1. Wait 2 seconds (has auto-close timer)
2. Or click Cancel button manually
3. Refresh page (F5)
4. Should still be changed (check with new password)

### Issue: Forgot password page shows blank
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh page (Ctrl+F5)
3. Try in new incognito window
4. Check browser console for errors

---

## Ready to Test?

**Start here:**
1. Open your v0 preview
2. Go to `/admin`
3. Follow "TEST 1: Change Password" above
4. Then follow "TEST 2: Forgot Password" above
5. Check all boxes in "Test Results Summary"
6. You're done!

---

## Next: Test on Hostinger

Once all tests pass in v0 preview:
1. Deploy to Hostinger
2. Follow the same tests
3. Everything should work identically
4. No additional setup needed!

**Optional:** If you want email sending, see `QUICK_PASSWORD_SETUP.md` for SMTP setup.

---

**Questions while testing?** Check the error troubleshooting section above.
