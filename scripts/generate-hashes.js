const bcrypt = require('bcryptjs');

async function generateHashes() {
  console.log('Generating password hashes for Firebase Console...\n')
  
  const passwords = [
    { role: 'Admin', username: 'uno_admin@gmail.com', password: 'admin123' },
    { role: 'Manager', username: 'manager_bakultala', password: 'manager123' },
    { role: 'Owner', username: 'owner_karim', password: 'owner123' },
  ]

  for (const user of passwords) {
    const hash = await bcrypt.hash(user.password, 10)
    console.log(`${user.role} (${user.username}):`)
    console.log(`Password: ${user.password}`)
    console.log(`Hash: ${hash}\n`)
  }
  
  console.log('Copy these hashes and paste in Firebase Console > Firestore > users collection\n')
  console.log('Also create users in Firebase Console > Authentication > Add user\n')
}

generateHashes()
