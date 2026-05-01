import bcrypt from 'bcryptjs'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount)
  })
}

const db = getFirestore()

async function seed() {
  try {
    console.log('Seeding demo data...')
    
    const adminHash = await bcrypt.hash('admin123', 10)
    const managerHash = await bcrypt.hash('manager123', 10)
    const ownerHash = await bcrypt.hash('owner123', 10)
    
    console.log('Passwords hashed')
    
    // Check if admin exists
    const adminSnap = await db.collection('users').where('username', '==', 'uno_admin@gmail.com').get()
    
    if (adminSnap.empty) {
      console.log('Creating admin user...')
      await db.collection('users').add({
        username: 'uno_admin@gmail.com',
        passwordHash: adminHash,
        role: 'admin',
        fullName: 'UNO Admin',
        phone: '01700000000',
        stationId: null,
        createdAt: new Date()
      })
      console.log('✓ Admin user created')
    } else {
      console.log('Admin user already exists')
    }
    
    const managerSnap = await db.collection('users').where('username', '==', 'manager_bakultala').get()
    
    if (managerSnap.empty) {
      console.log('Creating manager user...')
      await db.collection('users').add({
        username: 'manager_bakultala',
        passwordHash: managerHash,
        role: 'manager',
        fullName: 'Manager Bakultala',
        phone: '01711111111',
        stationId: 'bakultala-station',
        createdAt: new Date()
      })
      console.log('✓ Manager user created')
    } else {
      console.log('Manager user already exists')
    }
    
    const ownerSnap = await db.collection('users').where('username', '==', 'owner_karim').get()
    
    let ownerId
    if (ownerSnap.empty) {
      console.log('Creating owner user...')
      const ownerRef = await db.collection('users').add({
        username: 'owner_karim',
        passwordHash: ownerHash,
        role: 'owner',
        fullName: 'Karim Uddin',
        phone: '01722222222',
        stationId: null,
        createdAt: new Date()
      })
      ownerId = ownerRef.id
      console.log('✓ Owner user created:', ownerId)
    } else {
      ownerId = ownerSnap.docs[0].id
      console.log('Owner user already exists:', ownerId)
    }
    
    const stationSnap = await db.collection('stations').where('name', '==', 'Bakultala Fuel Station').get()
    
    if (stationSnap.empty) {
      console.log('Creating station...')
      await db.collection('stations').add({
        name: 'Bakultala Fuel Station',
        createdAt: new Date()
      })
      console.log('✓ Station created')
    } else {
      console.log('Station already exists')
    }
    
    const vehicleSnap = await db.collection('vehicles').where('regNo', '==', 'DHA-123456').get()
    
    if (vehicleSnap.empty) {
      console.log('Creating vehicle...')
      await db.collection('vehicles').add({
        ownerUserId: ownerId,
        regNo: 'DHA-123456',
        ownerName: 'Karim Uddin',
        phone: '01722222222',
        nid: '1234567890123',
        licenseNo: 'DL-789012',
        vehicleType: 'motorcycle',
        taxToken: 'TXN-12345',
        passportPhoto: null,
        nidPhoto: null,
        licensePhoto: null,
        taxTokenPhoto: null,
        qrCodeData: JSON.stringify({ regNo: 'DHA-123456', vehicleType: 'motorcycle' }),
        createdAt: new Date()
      })
      console.log('✓ Vehicle created')
    } else {
      console.log('Vehicle already exists')
    }
    
    console.log('\n✅ Demo data seeding complete!')
    console.log('\nDemo Credentials:')
    console.log('1. uno_admin@gmail.com / admin123 - UNO Admin')
    console.log('2. manager_bakultala / manager123 - Manager')
    console.log('3. owner_karim / owner123 - Vehicle Owner')
    console.log('   Vehicle: DHA-123456 (Motorcycle)')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

seed()
