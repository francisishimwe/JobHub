/**
 * Security Verification Script
 * Run this to verify your security setup is correct
 * 
 * Usage: node scripts/verify-security.js
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'CRON_SECRET',
  'NEXT_PUBLIC_SITE_URL'
];

const SENSITIVE_PATTERNS = [
  /supabase\.co\/auth\/v1\/token/gi,
  /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
  /sk_live_[a-zA-Z0-9]+/g,
  /pk_live_[a-zA-Z0-9]+/g,
];

console.log('🔒 Security Verification\n');

// Check 1: Environment Variables
console.log('1. Checking environment variables...');
try {
  require('dotenv').config({ path: '.env.local' });
  let allPresent = true;
  
  REQUIRED_ENV_VARS.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName} is set`);
    } else {
      console.log(`   ❌ ${varName} is MISSING`);
      allPresent = false;
    }
  });
  
  if (allPresent) {
    console.log('   ✅ All required environment variables are set\n');
  } else {
    console.log('   ⚠️  Some environment variables are missing\n');
  }
} catch (error) {
  console.log('   ⚠️  Could not load .env.local file\n');
}

// Check 2: .gitignore
console.log('2. Checking .gitignore...');
try {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  
  const requiredIgnores = ['.env', '.env*.local', '*.pem', '*.key'];
  let allIgnored = true;
  
  requiredIgnores.forEach(pattern => {
    if (gitignore.includes(pattern)) {
      console.log(`   ✅ ${pattern} is ignored`);
    } else {
      console.log(`   ❌ ${pattern} is NOT ignored`);
      allIgnored = false;
    }
  });
  
  if (allIgnored) {
    console.log('   ✅ .gitignore is properly configured\n');
  } else {
    console.log('   ⚠️  .gitignore needs updates\n');
  }
} catch (error) {
  console.log('   ❌ Could not read .gitignore\n');
}

// Check 3: No hardcoded secrets in code
console.log('3. Scanning for hardcoded secrets...');
const filesToCheck = [
  'lib/supabase.ts',
  'lib/supabase/server.ts',
  'lib/supabase/admin.ts',
];

let secretsFound = false;
filesToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    SENSITIVE_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches && !content.includes('placeholder')) {
        console.log(`   ⚠️  Potential secret found in ${file}`);
        secretsFound = true;
      }
    });
  } catch (error) {
    // File doesn't exist, skip
  }
});

if (!secretsFound) {
  console.log('   ✅ No hardcoded secrets detected\n');
} else {
  console.log('   ⚠️  Review flagged files for secrets\n');
}

// Check 4: API route security
console.log('4. Checking API route security...');
const apiRoutes = [
  'app/api/track-application/route.ts',
  'app/api/job-stats/route.ts',
  'app/api/collect-email/route.ts',
  'app/api/cleanup-expired-jobs/route.ts',
];

let allProtected = true;
apiRoutes.forEach(route => {
  try {
    const content = fs.readFileSync(route, 'utf8');
    
    const hasRateLimit = content.includes('withRateLimit');
    const hasValidation = content.includes('isValidOrigin') || content.includes('verifyCronSecret');
    
    if (hasRateLimit || hasValidation) {
      console.log(`   ✅ ${path.basename(path.dirname(route))} is protected`);
    } else {
      console.log(`   ⚠️  ${path.basename(path.dirname(route))} may need protection`);
      allProtected = false;
    }
  } catch (error) {
    console.log(`   ⚠️  Could not check ${route}`);
  }
});

if (allProtected) {
  console.log('   ✅ All API routes are protected\n');
} else {
  console.log('   ⚠️  Some routes may need additional protection\n');
}

// Check 5: .env.example exists
console.log('5. Checking template files...');
if (fs.existsSync('.env.example')) {
  console.log('   ✅ .env.example exists');
} else {
  console.log('   ❌ .env.example is missing');
}

if (fs.existsSync('SECURITY.md')) {
  console.log('   ✅ SECURITY.md exists');
} else {
  console.log('   ⚠️  SECURITY.md is missing');
}

console.log('\n✅ Security verification complete!\n');
console.log('📚 Next steps:');
console.log('   1. Review SECURITY.md for detailed guidelines');
console.log('   2. Configure Supabase RLS policies');
console.log('   3. Add environment variables to Vercel');
console.log('   4. Test API endpoints in production\n');
