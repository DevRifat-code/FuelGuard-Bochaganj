const { execSync } = require('child_process');
const fs = require('fs');

const key = fs.readFileSync('./key.txt', 'utf8').trim();

const envVars = [
  { name: 'FIREBASE_PRIVATE_KEY', value: key }
];

for (const env of envVars) {
  try {
    const cmd = `vercel env add ${env.name} production --value "${env.value}" --yes`;
    console.log(`Adding ${env.name}...`);
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✓ ${env.name} added`);
  } catch (e) {
    console.log(`✗ Failed to add ${env.name}`);
  }
}