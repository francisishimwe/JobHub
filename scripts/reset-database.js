const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Read the SQL file
const sqlFile = path.join(__dirname, 'delete-all-jobs.sql');
const sqlCommands = fs.readFileSync(sqlFile, 'utf8');

console.log('Database Reset Script');
console.log('===================');
console.log();
console.log('SQL commands to execute:');
console.log(sqlCommands);
console.log();
console.log('To execute these commands, you have several options:');
console.log();
console.log('1. If using Supabase Dashboard:');
console.log('   - Go to Supabase Dashboard > SQL Editor');
console.log('   - Copy and paste the SQL commands above');
console.log('   - Click "Run" to execute');
console.log();
console.log('2. If using psql command line:');
console.log('   psql -f scripts/delete-all-jobs.sql');
console.log();
console.log('3. If using another database client:');
console.log('   - Connect to your database');
console.log('   - Execute the SQL commands from the file');
console.log();
console.log('WARNING: This will delete ALL job-related data including:');
console.log('- All job applications');
console.log('- All CV profiles');
console.log('- All jobs');
console.log('- All companies');
console.log('- All exam data');
console.log('- All email subscribers');
console.log('- All analytics data');
console.log();
console.log('Make sure you have a backup if needed before proceeding!');
