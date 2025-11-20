# Webhook Troubleshooting Guide

If users are created in Clerk but not in your database, follow these steps to diagnose and fix the issue.

## 🚀 Quick Fix: Manual Sync

**Immediate solution to get unblocked:**

1. Sign in to your app at `/sign-in`
2. Go to `/sync-test`
3. Click "Sync User to Database"
4. You should now be in the database!

This will manually sync your Clerk user to the database while you fix the webhook.

---

## 🔍 Diagnosing the Issue

### Step 1: Check Environment Variables

Verify these are set in your `.env` file:

```bash
# Required Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://...
```

**Important:** `CLERK_WEBHOOK_SECRET` is different from `CLERK_SECRET_KEY`!

### Step 2: Verify Webhook is Configured in Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Click **Webhooks** in the left sidebar
4. Check if there's an endpoint configured

**Should see:**
- Endpoint URL: `https://your-domain.com/api/webhooks/clerk` (or ngrok URL for dev)
- Status: Active
- Events subscribed: `user.created`, `user.updated`, `user.deleted`

### Step 3: Test Your Webhook Endpoint

#### For Development (Localhost):

**You CANNOT use localhost directly!** Clerk needs a public URL.

**Solution: Use ngrok**

```bash
# 1. Install ngrok
npm install -g ngrok

# 2. Start your Next.js app
npm run dev

# 3. In a NEW terminal, start ngrok
ngrok http 3000

# You'll see output like:
# Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

Now use the `https://abc123.ngrok.io` URL in Clerk webhook settings.

### Step 4: Update Clerk Webhook URL

1. In Clerk Dashboard → Webhooks
2. Click your webhook (or create new one)
3. Update Endpoint URL to: `https://abc123.ngrok.io/api/webhooks/clerk`
4. Make sure these events are checked:
   - ✅ user.created
   - ✅ user.updated
   - ✅ user.deleted
5. Copy the **Signing Secret** and add to `.env`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

### Step 5: Restart Everything

```bash
# Kill your dev server (Ctrl+C)
# Restart it
npm run dev
```

**Important:** Always restart after changing `.env`!

### Step 6: Test User Creation

1. Go to `/sign-up`
2. Create a new test account
3. Watch your terminal for logs:

**You should see:**
```
🔔 Webhook received
✅ Svix headers present
📦 Payload received: user.created
✅ Webhook verified
📌 Event type: user.created
👤 Creating new user...
📝 User data: { clerkId: 'user_...', email: 'test@example.com', ... }
✅ User created in database: test@example.com
```

**If you DON'T see these logs**, the webhook isn't reaching your app!

---

## ❌ Common Issues & Fixes

### Issue 1: No Logs at All

**Problem:** Webhook isn't reaching your endpoint

**Fix:**
- If using localhost: You MUST use ngrok
- Verify ngrok is running: `ngrok http 3000`
- Update Clerk webhook URL to ngrok URL
- Make sure ngrok URL includes `/api/webhooks/clerk`

### Issue 2: "Error verifying webhook"

**Problem:** Wrong webhook secret

**Fix:**
```bash
# 1. Go to Clerk Dashboard → Webhooks
# 2. Click your webhook
# 3. Find "Signing Secret"
# 4. Copy it EXACTLY (including whsec_ prefix)
# 5. Update .env:
CLERK_WEBHOOK_SECRET=whsec_abc123...

# 6. Restart dev server
```

### Issue 3: "Missing svix headers"

**Problem:** Webhook not configured properly in Clerk

**Fix:**
- Delete the webhook in Clerk Dashboard
- Create a new one
- Make sure URL is correct
- Subscribe to user events
- Copy the new signing secret

### Issue 4: "Database error" in logs

**Problem:** Database connection or schema issue

**Check:**
```bash
# 1. Test database connection
npm run db:studio

# 2. Verify users table exists and has correct columns
# Should have: id, clerk_id, email, full_name, phone, role, created_at, updated_at

# 3. Check migrations ran
npm run db:migrate
```

### Issue 5: Webhook works but user has wrong data

**Problem:** Field mapping issue

**Check logs for:**
```
📝 User data: { clerkId: 'user_...', email: 'test@example.com', fullName: 'Test User', phone: '+1234567890' }
```

If data looks wrong, the issue is in the webhook handler.

---

## 🧪 Testing Checklist

- [ ] `.env` has all required keys
- [ ] `CLERK_WEBHOOK_SECRET` is set correctly
- [ ] Ngrok is running (development)
- [ ] Webhook URL in Clerk points to ngrok or production URL
- [ ] Webhook events are subscribed: user.created, user.updated, user.deleted
- [ ] Dev server restarted after changing `.env`
- [ ] Database migrations have run
- [ ] Sign up creates logs in terminal
- [ ] User appears in database after signup

---

## 🔧 Manual Verification

### Check if User is in Database

```sql
SELECT * FROM users WHERE clerk_id = 'user_...';
```

Replace `user_...` with your Clerk user ID (visible at `/sync-test`).

### Manually Create User (Emergency)

If webhook isn't working and you need to get unblocked:

1. Sign in
2. Go to `/sync-test`
3. Click "Sync User to Database"

Or use SQL directly:
```sql
INSERT INTO users (clerk_id, email, full_name, role)
VALUES ('user_YOUR_CLERK_ID', 'your@email.com', 'Your Name', 'user');
```

---

## 📞 For Production

When deploying to production:

1. **Update Webhook URL**
   - Change from ngrok to: `https://yourdomain.com/api/webhooks/clerk`
   - Get new signing secret
   - Update production environment variable

2. **Test Immediately**
   - Create a test account
   - Verify it appears in database
   - Check production logs

3. **Monitor Webhook**
   - Clerk Dashboard → Webhooks → Your endpoint
   - Check "Recent Deliveries"
   - Should show successful deliveries (200 status)

---

## 🆘 Still Not Working?

1. **Check Clerk Webhook Logs**
   - Clerk Dashboard → Webhooks → Click your endpoint
   - Check "Recent Deliveries"
   - Look for errors or failed deliveries

2. **Enable Verbose Logging**
   - Webhook handler already has extensive logging
   - Check your terminal/console for logs

3. **Test Manually**
   - Use `/sync-test` page to manually sync
   - This bypasses webhooks entirely

4. **Database Connection**
   ```bash
   # Verify you can connect to database
   npm run db:studio
   ```

5. **Check Firewall/Network**
   - Make sure your server can receive POST requests
   - Check if ngrok tunnel is stable

---

## ✅ Success Indicators

When everything is working:

1. **Sign up flow:**
   - User signs up → Clerk creates account
   - Webhook fires → Your endpoint receives it
   - User created in database → Logs confirm
   - User can access app immediately

2. **Terminal shows:**
   ```
   🔔 Webhook received
   ✅ Webhook verified
   👤 Creating new user...
   ✅ User created in database: user@example.com
   ```

3. **Database check:**
   - User exists in `users` table
   - Has correct `clerk_id`
   - Has role = 'user'

4. **/sync-test shows:**
   - ✅ Synced to Database
   - Shows user data from database

---

## 📋 Quick Reference

| Problem | Solution |
|---------|----------|
| Localhost not working | Use ngrok |
| No logs appearing | Check webhook URL in Clerk |
| Verification failed | Copy signing secret again |
| User not in DB | Use /sync-test to manually sync |
| ngrok URL changed | Update webhook URL in Clerk |
| Still broken | Use manual sync at /sync-test |

---

Need more help? Check the terminal logs - they're very verbose and will tell you exactly what's wrong!
