import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seed() {
  try {
    console.log('Seeding demo data using Firebase client SDK...\n')
    
    const adminHash = await bcrypt.hash('admin123', 10)
    const managerHash = await bcrypt.hash('manager123', 10)
    const ownerHash = await bcrypt.hash('owner123', 10)
    
    console.log('✓ Passwords hashed')
    
    // Check and create admin
    const adminQuery = query(collection(db, 'users'), where('username', '==', 'uno_admin@gmail.com'))
    const adminSnap = await getDocs(adminQuery)
    
    if (adminSnap.empty) {
      console.log('Creating admin user...')
      await addDoc(collection(db, 'users'), {
        username: 'uno_admin@gmail.com',
        passwordHash: adminHash,
        role: 'admin',
        fullName: 'UNO Admin',
        phone: '01700000000',
        stationId: null,
        createdAt: serverTimestamp()
      })
      console.log('✓ Admin user created')
    } else {
      console.log('✓ Admin user already exists')
    }
    
    // Check and create manager
    const managerQuery = query(collection(db, 'users'), where('username', '==', 'manager_bakultala'))
    const managerSnap = await getDocs(managerQuery)
    
    if (managerSnap.empty) {
      console.log('Creating manager user...')
      await addDoc(collection(db, 'users'), {
        username: 'manager_bakultala',
        passwordHash: managerHash,
        role: 'manager',
        fullName: 'Manager Bakultala',
        phone: '01711111111',
        stationId: 'bakultala-station',
        createdAt: serverTimestamp()
      })
      console.log('✓ Manager user created')
    } else {
      console.log('✓ Manager user already exists')
    }
    
    // Check and create owner
    const ownerQuery = query(collection(db, 'users'), where('username', '==', 'owner_karim'))
    const ownerSnap = await getDocs(ownerQuery)
    
    let ownerId
    if (ownerSnap.empty) {
      console.log('Creating owner user...')
      const ownerRef = await addDoc(collection(db, 'users'), {
        username: 'owner_karim',
        passwordHash: ownerHash,
        role: 'owner',
        fullName: 'Karim Uddin',
        phone: '01722222222',
        stationId: null,
        createdAt: serverTimestamp()
      })
      ownerId = ownerRef.id
      console.log('✓ Owner user created:', ownerId)
    } else {
      ownerId = ownerSnap.docs[0].id
      console.log('✓ Owner user already exists:', ownerId)
    }
    
    // Check and create station
    const stationQuery = query(collection(db, 'stations'), where('name', '==', 'Bakultala Fuel Station'))
    const stationSnap = await getDocs(stationQuery)
    
    if (stationSnap.empty) {
      console.log('Creating station...')
      await addDoc(collection(db, 'stations'), {
        name: 'Bakultala Fuel Station',
        createdAt: serverTimestamp()
      })
      console.log('✓ Station created')
    } else {
      console.log('✓ Station already exists')
    }
    
    // Check and create vehicle
    const vehicleQuery = query(collection(db, 'vehicles'), where('regNo', '==', 'DHA-123456'))
    const vehicleSnap = await getDocs(vehicleQuery)
    
    if (vehicleSnap.empty) {
      console.log('Creating vehicle...')
      await addDoc(collection(db, 'vehicles'), {
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
        createdAt: serverTimestamp()
      })
      console.log('✓ Vehicle created')
    } else {
      console.log('✓ Vehicle already exists')
    }
    
    console.log('\n✅ Seed complete! Demo credentials:')
    console.log('1. uno_admin@gmail.com / admin123')
    console.log('2. manager_bakultala / manager123')
    console.log('3. owner_karim / owner123 (Vehicle: DHA-123456)')
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

seed()
