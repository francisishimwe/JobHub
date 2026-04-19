// Simple test to verify new pages are accessible
const testUrls = [
  'https://rwandajobhub.vercel.app/admin',
  'https://rwandajobhub.vercel.app/view-exams', 
  'https://rwandajobhub.vercel.app/interview-prep'
];

console.log('Testing new pages deployment...');
console.log('Visit these URLs to verify the secure document system is working:');
console.log('');

testUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log('');
console.log('Expected features:');
console.log('✅ Admin Dashboard at /admin');
console.log('✅ Secure Exam Viewer at /view-exams');
console.log('✅ Interview Prep at /interview-prep');
console.log('✅ Dynamic routing to /prep/[id]');
console.log('✅ Security features (watermark, focus mode, etc.)');
console.log('');
console.log('Note: You need to set DATABASE_URL in Vercel environment variables for full functionality.');
