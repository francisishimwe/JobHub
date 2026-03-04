const fs = require('fs');
const path = require('path');

const dbUrl = 'postgresql://neondb_owner:npg_mabQenpJ35yN@ep-fragrant-glitter-agu94zx1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const envContent = `DATABASE_URL=${dbUrl}
NEON_DATABASE_URL=${dbUrl}
POSTGRES_URL=${dbUrl}
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CRON_SECRET=jobhub_secure_secret_2024`;

fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
console.log('.env.local file created successfully!');
console.log('Database URL:', dbUrl);
