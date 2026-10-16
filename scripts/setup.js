const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('============================================================');
console.log('   RAG AGENTS - Pre-Flight System Setup & Health Check');
console.log('============================================================');

let hasErrors = false;

try {
  console.log('[1/4] Node.js Runtime: ' + process.version);
} catch (e) {
  console.error('Node check failed');
  hasErrors = true;
}

try {
  if (fs.existsSync(path.join(__dirname, '..', 'node_modules'))) {
    console.log('[2/4] Dependencies: node_modules present');
  } else {
    console.log('[2/4] Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
} catch (e) {
  console.error('Dependency error:', e.message);
  hasErrors = true;
}

try {
  console.log('[3/4] Synchronizing Prisma Client and SQLite Schema...');
  execSync('npx prisma generate', { stdio: 'ignore' });
  execSync('npx prisma db push --skip-generate', { stdio: 'ignore' });
  console.log('      Database & Prisma Client ready');
} catch (e) {
  console.error('Prisma setup error:', e.message);
  hasErrors = true;
}

try {
  console.log('[4/4] Validating TypeScript compilation...');
  execSync('npx tsc --noEmit', { stdio: 'ignore' });
  console.log('      Typecheck clean (0 errors)');
} catch (e) {
  console.error('TypeScript validation error');
  hasErrors = true;
}

console.log('============================================================');
if (hasErrors) {
  console.log('Setup finished with warnings.');
  process.exit(1);
} else {
  console.log('Setup complete! Run "npm run dev" to start the dev server.');
}
