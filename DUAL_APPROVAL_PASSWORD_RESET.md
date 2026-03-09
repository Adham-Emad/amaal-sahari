# Dual Approval Password Reset System

## Overview
This system implements a **two-factor admin approval** process for password resets, ensuring that only authorized personnel with access to BOTH the user email AND admin email (admin@amaalsahari.com) can reset the admin password.

## Security Architecture

### How It Works

#### Step 1: User Requests Reset
- User enters email address at `/admin/forgot-password`
- **CRITICAL**: Only `admin@amaalsahari.com` is accepted
- If user enters ANY other email, request is rejected with `403 Forbidden`

```
User enters: admin@amaalsahari.com
↓
System accepts request
↓
Two emails are sent:
  1. Reset link → User's email (admin@amaalsahari.com)
  2. Approval request → Admin email (admin@amaalsahari.com)
```

#### Step 2: Admin Approval Required
Two separate tokens are generated:
- **Reset Token**: Allows user to set new password
- **Admin Approval Token**: Allows admin to approve the request

The approval email to admin contains a button to approve. Admin MUST click this before user can proceed.

```
Admin receives email with subject:
"Admin Approval Required: Password Reset Request"

Email contains:
- When reset was requested
- Approval button (clickable link)
- Security warnings not to approve unauthorized requests
```

#### Step 3: Admin Approves
Admin clicks "Approve Password Reset" button in their email. This:
- Validates the approval token
- Marks the reset as approved in backend
- Sends confirmation email to user saying "Your reset has been approved"
- Sets flag: `adminApproved: true`

#### Step 4: User Can Now Reset
User clicks the reset link from Step 1. The frontend:
- Verifies the reset token
- **NEW**: Checks if `adminApproved: true`
- If not approved yet: Shows error "Admin approval is still pending"
- If approved: Allows user to set new password

#### Step 5: Password Reset Complete
Once user sets new password:
- Password is hashed with bcrypt
- Stored globally in `.admin-credentials.json`
- Both user and admin receive confirmation emails
- All sessions must re-authenticate

## Security Features

### 1. Email-Based Identity Verification
- Request can only come from: `admin@amaalsahari.com`
- No exceptions (checked server-side)
- Prevents unauthorized password reset requests

### 2. Dual Approval
- **User must have access to**: admin account email
- **Admin must have access to**: admin approval email
- Attack requires compromising BOTH email accounts
- 2x security compared to single-email systems

### 3. Single-Use Tokens
- Reset token can only be used once
- Approval token can only be used once
- Attempting reuse: `"This reset link has already been used"`
- Prevents token replay attacks

### 4. Time-Limited Links
- Reset tokens expire in **1 hour**
- Approval tokens expire in **1 hour**
- Expired tokens: `"Invalid or expired reset token"`
- Forces users to request new reset if they wait too long

### 5. Password Hashing
- Uses bcrypt with 10 salt rounds
- Industry-standard hashing algorithm
- Even if database is compromised, passwords are unreadable

### 6. Global Password Storage
- Password stored in `.admin-credentials.json` on server
- NOT in localStorage (which is browser-specific)
- All devices must use same password
- Prevents device-specific password issues

### 7. Full Audit Trail
Emails sent at each stage provide accountability:
- **Request initiation**: Alerts admin immediately
- **Approval**: Confirms approval happened
- **Completion**: Documents when password was changed
- All emails include timestamps

## Email Flow

### User receives 3 emails:

**Email 1: Reset Request Initiated**
- Contains reset link with token
- Valid for 1 hour
- Instructions to click link

**Email 2: Reset Approved** (after admin clicks approve)
- Confirms admin approved the request
- Tells user to proceed with password reset

**Email 3: Password Reset Successful** (after user sets new password)
- Confirms password was changed
- Warns to contact support if unauthorized

### Admin (admin@amaalsahari.com) receives 3 emails:

**Email 1: Approval Request**
- Security alert in orange/yellow
- Contains "Approve" button (clickable link)
- Tells admin NOT to approve unless they initiated request
- Link expires in 1 hour

**Email 2: Approval Confirmed**
- Green success notification
- Documents when approval was clicked
- Shows which email initiated the request

**Email 3: Password Change Confirmed**
- Green success notification
- Documents when password was actually changed
- States all sessions need to re-authenticate

## Testing Checklist

### Test Case 1: Valid Reset Flow
1. Go to `/admin/forgot-password`
2. Enter `admin@amaalsahari.com`
3. Click "Send Reset Link"
4. Check email for:
   - Reset link email to admin@amaalsahari.com
   - Approval request email to admin@amaalsahari.com
5. Click approval button in admin email
6. Check for "Reset Approved" email to admin@amaalsahari.com
7. Click reset link from first email
8. Set new password
9. Verify login works with new password on ALL devices/browsers

### Test Case 2: Unauthorized Email
1. Go to `/admin/forgot-password`
2. Enter `attacker@example.com`
3. Error should show: "Password reset can only be initiated from admin email: admin@amaalsahari.com"
4. No emails should be sent

### Test Case 3: Without Admin Approval
1. Request reset from admin@amaalsahari.com
2. DO NOT click approval button
3. Click reset link before admin approves
4. Error should show: "Admin has not yet approved this password reset request"
5. Form should not allow password entry

### Test Case 4: Expired Tokens
1. Request reset
2. Wait 1 hour+ (or modify system time)
3. Click reset link
4. Error should show: "Invalid or expired reset token"

### Test Case 5: Reused Tokens
1. Request reset
2. Admin approves
3. User sets password (token marked as used)
4. Try to use same reset link again
5. Error should show: "This reset link has already been used"

### Test Case 6: Multi-Device Password Sync
1. On Device A: Reset password to "NewPass123"
2. On Device B: Try to login with old password → Should fail
3. On Device B: Login with "NewPass123" → Should succeed
4. On Device C (different browser): Login with "NewPass123" → Should succeed
5. **Result**: All devices now require new password (password is global)

## Configuration

### Required Environment Variables
```
HOSTINGER_SMTP_HOST=mail.hostinger.com
HOSTINGER_SMTP_PORT=465
HOSTINGER_SMTP_USER=your-email@domain.com
HOSTINGER_SMTP_PASS=your-smtp-password
HOSTINGER_FROM_EMAIL=noreply@amaalsahari.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com (for reset links)
```

### Admin Email (Hardcoded)
```typescript
const ADMIN_EMAIL = 'admin@amaalsahari.com'
```

Change this in `/app/api/auth/reset-password/route.ts` if needed.

## Files Modified

- `/app/api/auth/reset-password/route.ts` - New approval logic
- `/components/admin/forgot-password-client.tsx` - New approval UI
- `/lib/admin-context.tsx` - Removed localStorage
- `/package.json` - Added bcrypt

## Advantages Over Previous System

| Feature | Before | After |
|---------|--------|-------|
| Email requirement | None checked | Only admin email allowed |
| Approval needed | No | Yes, from admin |
| Password scope | Browser-specific | Global (all devices) |
| Audit trail | Limited | Full email trail |
| Single-use tokens | No | Yes |
| Token expiration | 1 hour | 1 hour |
| Hashing | None | Bcrypt |
| Multi-device sync | No | Yes |

## Security Incident Response

### If unauthorized reset is detected:
1. Check admin email approval log
2. See which email initiated request
3. Review all password change timestamps
4. Reset password immediately if needed
5. Review admin account for unauthorized access

## Future Enhancements

- [ ] Database logging of reset attempts
- [ ] IP address logging for resets
- [ ] SMS OTP as third factor
- [ ] Reset history dashboard
- [ ] Rate limiting on reset requests
- [ ] Require old password for confirmation
