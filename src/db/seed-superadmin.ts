import * as dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

async function seedSuperAdmin() {
  console.log('🚀 Creating superadmin user...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client, { schema });

  try {
    // Check if superadmin already exists
    const existingSuperAdmin = await db
      .select()
      .from(users)
      .where(eq(users.role, 'superadmin'))
      .limit(1);

    if (existingSuperAdmin.length > 0) {
      console.log('ℹ️  Superadmin already exists:');
      console.log('   Email:', existingSuperAdmin[0].email);
      console.log('   Name:', existingSuperAdmin[0].fullName);
      console.log('\n⚠️  To create the superadmin, you need to:');
      console.log('   1. Sign up at /sign-up with your email');
      console.log('   2. After signing up, run this script again');
      console.log('   3. Your account will be upgraded to superadmin');
      await client.end();
      process.exit(0);
    }

    // For the first run, we'll create a placeholder that will be
    // upgraded when someone signs up
    console.log('\n📝 No superadmin found.');
    console.log('\n✅ Setup Instructions:');
    console.log('   1. Go to /sign-up and create an account');
    console.log('   2. Use this email: admin@smilecare.com (or any email you prefer)');
    console.log('   3. After signing up through Clerk, manually update the role in database:');
    console.log('\n   Run this SQL command in your database:');
    console.log('   UPDATE users SET role = \'superadmin\' WHERE email = \'your-email@example.com\';');
    console.log('\n   OR use this script after signup:');
    console.log('   npm run create-superadmin -- your-email@example.com');
    console.log('\n💡 Alternatively, if you provide an email as argument:');
    console.log('   npm run create-superadmin -- admin@example.com');

    // Check if email was provided as argument
    const email = process.argv[2];

    if (email) {
      console.log(`\n🔍 Searching for user with email: ${email}`);

      const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (user.length === 0) {
        console.log(`\n❌ No user found with email: ${email}`);
        console.log('   Please sign up first at /sign-up');
      } else if (user[0].role === 'superadmin') {
        console.log(`\n✅ User ${email} is already a superadmin!`);
      } else {
        // Upgrade user to superadmin
        await db
          .update(users)
          .set({ role: 'superadmin' })
          .where(eq(users.email, email));

        console.log(`\n✅ Successfully upgraded ${email} to superadmin!`);
        console.log('   Name:', user[0].fullName);
        console.log('   Email:', user[0].email);
        console.log('\n🎉 You can now access the admin panel at /admin');
      }
    }

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await client.end();
    process.exit(1);
  }
}

seedSuperAdmin();
