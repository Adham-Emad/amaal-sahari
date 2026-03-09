# Change Password "Invalid Username" Error - FIXED

## Problem
When trying to change the password from within the admin panel, users received an "Invalid username" error even though they were already logged in and the password reset via email worked fine.

## Root Cause
The credential file (`.admin-credentials.json`) was missing the `username` field when:
1. Password was reset via the reset-password email flow
2. The `savePasswordGlobally()` function only saved `password` and `updatedAt`, but NOT the `username` field
3. When change-password API tried to validate the username, it failed because the field didn't exist

## Solution Applied

### 1. **Fixed reset-password API** (`app/api/auth/reset-password/route.ts`)
- Modified `savePasswordGlobally()` to include the `username` field
- Now saves both `password` and `hashedPassword` fields for compatibility
- Ensures credentials file always has username = 'admin'

```javascript
const credentials = {
  username: 'admin', // NOW INCLUDED
  password: hashedPassword,
  hashedPassword: hashedPassword,
  updatedAt: new Date().toISOString(),
}
```

### 2. **Made change-password API more resilient** (`app/api/auth/change-password/route.ts`)
- Added fallback logic: if `credentials.username` is missing, default to 'admin'
- This ensures old credentials files still work
- Better error logging to debug future issues

```javascript
const storedUsername = credentials.username || 'admin'
if (username !== storedUsername) {
  // Handle error with debug info
}
```

### 3. **Ensured consistent initialization** (`app/api/auth/login/route.ts`)
- Login API already initializes with username field (no changes needed)
- Works correctly as fallback if credentials file is missing

## How It Works Now

1. **Password Reset via Email:**
   - User clicks reset link
   - Admin approves
   - User sets new password
   - `savePasswordGlobally()` saves: `{username: 'admin', password: hash, hashedPassword: hash}`

2. **Change Password from Admin Panel:**
   - User enters current password
   - API reads credentials file with username field present
   - Validates: username matches 'admin' ✓
   - Verifies current password against hashed version ✓
   - Saves new hashed password with username field preserved ✓

3. **Login:**
   - User logs in with new password
   - Login API reads credentials file
   - Compares provided password against stored hash ✓

## Testing Steps

1. Reset password via email flow → Note new password
2. Login with new password → Should work ✓
3. Click "Change Password" in admin panel
4. Enter current password (the one you just set)
5. Enter new password
6. Click "Change Password" → Should succeed ✓
7. Logout and login with the NEW password → Should work ✓
8. Try change password again → Should work ✓

## Password Flow Diagram

```
Initial State: password = 'amaal2024'

Email Reset Flow:
Request → Approval → Set new password → savePasswordGlobally()
↓
credentials.json: {username: 'admin', password: HASH1, hashedPassword: HASH1}

Change Password Flow:
currentPass (HASH1) → newPass → savePasswordGlobally()
↓
credentials.json: {username: 'admin', password: HASH2, hashedPassword: HASH2}

Login:
password → compare with HASH2 → Success ✓
```

## Files Modified
- `app/api/auth/reset-password/route.ts` - Added username to savePasswordGlobally
- `app/api/auth/change-password/route.ts` - Made username validation resilient
- `lib/admin-context.tsx` - Already updated to call change-password API

## Status: ✅ COMPLETE
The "Invalid username" error should no longer occur. All password operations (reset, change, login) now use the same credential file format with consistent fields.
