const { execSync } = require('child_process');
const fs = require('fs');

const key = fs.readFileSync('.vercel-key.txt', 'utf8');

try {
  execSync(`vercel env add FIREBASE_PRIVATE_KEY production --value "${key}" --yes`, {
    stdio: 'inherit',
    shell: true
  });
  console.log('Private key added successfully!');
} catch (e) {
  console.log('Failed to add private key via CLI');
  console.log('Please add FIREBASE_PRIVATE_KEY manually in Vercel dashboard');
  console.log('The key is in .vercel-key.txt file');
}