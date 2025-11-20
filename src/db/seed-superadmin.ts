async function seedSuperAdmin() {
  console.log('ℹ️  Role-based authentication is currently disabled.');
  console.log('📝 The user role field is commented out in the schema.');
  console.log('\n💡 To enable roles:');
  console.log('   1. Uncomment the userRoleEnum and role field in src/db/schema.ts');
  console.log('   2. Run database migration: npm run db:push');
  console.log('   3. Re-run this script');
  console.log('\n✅ For now, all users have the same access level.');
  process.exit(0);
}

seedSuperAdmin();
