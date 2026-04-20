const { neon } = require('@neondatabase/serverless');

async function addSampleUsers() {
  console.log('Adding sample users for testing User Management...\n');
  
  try {
    const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
    
    await sql`SELECT 1 as test`;
    console.log('Database connection successful');
    
    // Clear existing users (optional - comment out if you want to keep existing users)
    console.log('Clearing existing sample users...');
    await sql`DELETE FROM users WHERE email LIKE '%test%' OR email LIKE '%example%'`;
    
    // Add sample users
    console.log('Adding sample users...');
    
    const sampleUsers = [
      {
        email: 'admin@test.com',
        name: 'Test Admin',
        role: 'admin',
        has_quiz_access: true,
        quiz_access_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        email: 'user1@example.com',
        name: 'John User',
        role: 'user',
        has_quiz_access: false,
        quiz_access_expiry: null
      },
      {
        email: 'user2@example.com',
        name: 'Jane Doe',
        role: 'user',
        has_quiz_access: true,
        quiz_access_expiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        email: 'expired@example.com',
        name: 'Expired User',
        role: 'user',
        has_quiz_access: true,
        quiz_access_expiry: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // Expired 5 days ago
      },
      {
        email: 'employer@test.com',
        name: 'Test Employer',
        role: 'employer',
        has_quiz_access: false,
        quiz_access_expiry: null
      }
    ];
    
    for (const user of sampleUsers) {
      await sql`
        INSERT INTO users (email, name, role, has_quiz_access, quiz_access_expiry)
        VALUES (${user.email}, ${user.name}, ${user.role}, ${user.has_quiz_access}, ${user.quiz_access_expiry})
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          has_quiz_access = EXCLUDED.has_quiz_access,
          quiz_access_expiry = EXCLUDED.quiz_access_expiry
      `;
      console.log(`Added/Updated user: ${user.email}`);
    }
    
    // Verify users were added
    console.log('\nVerifying users...');
    const users = await sql`
      SELECT email, name, role, has_quiz_access, quiz_access_expiry
      FROM users 
      ORDER BY created_at DESC
    `;
    
    console.log('\nCurrent users in database:');
    users.forEach(user => {
      const accessStatus = user.has_quiz_access ? 
        (user.quiz_access_expiry && new Date(user.quiz_access_expiry) > new Date() ? 'Active' : 'Expired') : 
        'No Access';
      console.log(`  - ${user.email} (${user.name}) - Role: ${user.role} - Access: ${accessStatus}`);
    });
    
    console.log('\nSample users added successfully!');
    console.log('You can now test the User Management panel.');
    
  } catch (error) {
    console.error('Error adding sample users:', error.message);
    process.exit(1);
  }
}

addSampleUsers().then(() => {
  console.log('\nSample users script completed!');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
