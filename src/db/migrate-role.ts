import * as dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as schema from './schema';

async function migrateRole() {
  console.log('Running role migration...');

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client, { schema });

  try {
    // Create enum type
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'superadmin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✓ Created user_role enum');

    // Make password optional
    await db.execute(sql`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
    console.log('✓ Made password optional');

    // Make phone optional
    await db.execute(sql`ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL`);
    console.log('✓ Made phone optional');

    // Add clerk_id column
    await db.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "users" ADD COLUMN "clerk_id" varchar(255);
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);
    console.log('✓ Added clerk_id column');

    // Add role column
    await db.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);
    console.log('✓ Added role column');

    // Add unique constraint
    await db.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "users" ADD CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id");
      EXCEPTION
        WHEN duplicate_table THEN null;
      END $$;
    `);
    console.log('✓ Added unique constraint on clerk_id');

    console.log('✅ Migration completed successfully!');
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await client.end();
    process.exit(1);
  }
}

migrateRole();
