# Admin Dashboard Setup Guide

Complete guide for setting up Clerk authentication and admin dashboard in SmileCare.

## 🚀 Features Implemented

✅ **Clerk Authentication** - Secure user authentication with Clerk
✅ **Role-Based Access Control** - Three roles: User, Admin, SuperAdmin
✅ **Admin Dashboard** - Manage appointments and users
✅ **SuperAdmin Panel** - Promote/demote admins
✅ **Automatic User Sync** - Clerk users automatically synced to database

---

## 📋 Prerequisites

Before starting, make sure you have:
- Clerk account created at [clerk.com](https://clerk.com)
- Database migration completed
- Clerk API keys in `.env` file

---

## 🔧 Step 1: Configure Clerk

### 1.1 Add Environment Variables

Add these to your `.env` file:

```env
# Clerk Keys (get from clerk.com dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Webhook Secret (we'll set this up in step 1.3)
CLERK_WEBHOOK_SECRET=whsec_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### 1.2 Get Your Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **API Keys** in the left sidebar
4. Copy `Publishable Key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
5. Copy `Secret Key` → `CLERK_SECRET_KEY`

### 1.3 Set Up Webhook

Clerk webhooks sync users to your database automatically when they sign up.

#### For Production:
1. In Clerk Dashboard, go to **Webhooks**
2. Click **+ Add Endpoint**
3. Enter your production URL: `https://yourdomain.com/api/webhooks/clerk`
4. Subscribe to these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the **Signing Secret** → `CLERK_WEBHOOK_SECRET` in `.env`

#### For Development (using ngrok):
1. Install ngrok: `npm install -g ngrok`
2. Start your app: `npm run dev`
3. In a new terminal: `ngrok http 3000`
4. Copy the https URL (e.g., `https://abc123.ngrok.io`)
5. In Clerk Dashboard, add webhook endpoint: `https://abc123.ngrok.io/api/webhooks/clerk`
6. Copy the signing secret to `.env`

---

## 👑 Step 2: Create the First SuperAdmin

### 2.1 Sign Up

1. Start your application: `npm run dev`
2. Go to `/sign-up`
3. Create an account with your email (e.g., `admin@smilecare.com`)
4. Complete the sign-up process

### 2.2 Upgrade to SuperAdmin

After signing up, run this command with YOUR email:

```bash
npm run create-superadmin admin@smilecare.com
```

Replace `admin@smilecare.com` with the email you used to sign up.

You should see:
```
✅ Successfully upgraded admin@smilecare.com to superadmin!
🎉 You can now access the admin panel at /admin
```

---

## 🎯 Step 3: Access Admin Dashboard

### As SuperAdmin:
1. Sign in at `/sign-in`
2. Click **Admin** in the header
3. You'll see:
   - **Dashboard** - Overview and statistics
   - **Appointments** - View all bookings
   - **Manage Admins** - Promote users to admin

### As Admin:
- Access to Dashboard and Appointments
- Cannot manage other admins

### As User:
- No access to `/admin` routes
- Redirected to home page

---

## 🔐 User Roles Explained

### 👤 User (Default)
- Can book appointments
- Can view dentists
- No admin access

### ⚙️ Admin
- All user permissions
- Can view admin dashboard
- Can manage all appointments
- Cannot promote other users

### 👑 SuperAdmin
- All admin permissions
- Can promote users to admin
- Can demote admins to user
- Cannot be demoted (system protects last superadmin)

---

## 📊 Admin Features

### Dashboard (`/admin`)
- Total appointments count
- Total users count
- Total dentists count
- Recent appointments list

### Appointments Management (`/admin/appointments`)
- View all appointments in a table
- See patient details
- View dentist assignments
- Check contact information
- Review appointment notes

### User Management (`/admin/users`) - SuperAdmin Only
- View all users
- See user roles
- Promote users to admin
- Demote admins to user
- Statistics: Total users, admins, superadmins

---

## 🔄 How It Works

### User Sign Up Flow:
1. User goes to `/sign-up`
2. Enters email and creates password in Clerk
3. Clerk webhook fires `user.created` event
4. Webhook handler creates user in database with role = 'user'
5. User can now sign in and book appointments

### Role Check Flow:
1. User tries to access `/admin`
2. Middleware checks if user is authenticated (Clerk)
3. Gets user from database to check role
4. If admin or superadmin → Allow access
5. If user → Redirect to home

### Promoting to Admin:
1. SuperAdmin goes to `/admin/users`
2. Selects new role from dropdown
3. API endpoint `/api/admin/users/[id]/role` called
4. Checks if requester is superadmin
5. Updates user role in database
6. User now has admin access

---

## 🛠️ Troubleshooting

### "User not found in database after sign up"
- Check webhook is configured correctly
- Check `CLERK_WEBHOOK_SECRET` is set
- Check ngrok tunnel is active (development)
- View logs in Clerk Dashboard → Webhooks

### "Cannot access admin panel"
- Run `npm run create-superadmin your-email@example.com`
- Sign out and sign in again
- Check database: `SELECT * FROM users WHERE email = 'your-email';`

### "Webhook verification failed"
- Ensure `CLERK_WEBHOOK_SECRET` matches Clerk Dashboard
- Restart your development server after adding the secret

### "Role not updating"
- Check browser console for errors
- Verify you're logged in as superadmin
- Refresh the page after updating

---

## 📱 Testing the System

### 1. Test User Sign Up
```bash
# Sign up at /sign-up with: user@test.com
# Check database:
# User should exist with role = 'user'
```

### 2. Test Admin Access
```bash
# Try to access /admin with user account
# Should redirect to home page
```

### 3. Test SuperAdmin Creation
```bash
npm run create-superadmin admin@test.com
# Should upgrade the user to superadmin
```

### 4. Test Role Promotion
```bash
# Sign in as superadmin
# Go to /admin/users
# Promote a user to admin
# Sign in as that user
# Should now see Admin link in header
```

---

## 🎨 Customization

### Change Role Options
Edit `/src/db/schema.ts`:
```typescript
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'superadmin', 'your-role']);
```

### Add Admin Routes
1. Create new page in `/src/app/admin/`
2. Add link in `/src/components/admin/AdminSidebar.tsx`
3. Protected automatically by admin layout

### Customize Permissions
Edit `/src/middleware.ts` to add custom route protection logic

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `/src/middleware.ts` | Route protection and role checking |
| `/src/app/api/webhooks/clerk/route.ts` | Syncs Clerk users to database |
| `/src/lib/clerk-auth.ts` | Helper functions for auth checks |
| `/src/app/admin/layout.tsx` | Admin dashboard layout |
| `/src/components/admin/AdminSidebar.tsx` | Admin navigation sidebar |
| `/src/db/seed-superadmin.ts` | Creates first superadmin |

---

## 🚀 Going to Production

1. **Update Clerk Webhook URL**
   - Change from ngrok to your production domain
   - `https://yourdomain.com/api/webhooks/clerk`

2. **Environment Variables**
   - Set all Clerk keys in production
   - Update `DATABASE_URL` for production database

3. **Create SuperAdmin**
   - Sign up in production
   - SSH into server and run: `npm run create-superadmin your-email`

4. **Test Everything**
   - Sign up as new user
   - Verify role-based access
   - Test admin dashboard

---

## 🎉 You're Done!

Your admin dashboard is now fully set up with:
- ✅ Secure authentication via Clerk
- ✅ Role-based access control
- ✅ SuperAdmin capabilities
- ✅ Appointment management
- ✅ User management

For questions or issues, check the troubleshooting section above.
