import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import bcrypt from 'bcryptjs'
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

async function getAccessToken() {
  const token = jwt.sign(
    {
      iss: serviceAccount.clientEmail,
      sub: serviceAccount.clientEmail,
      aud: 'https://oauth2.googleapis.com/token',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      scope: 'https://www.googleapis.com/auth/datastore'
    },
    serviceAccount.privateKey,
    { algorithm: 'RS256' }
  )
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token
    })
  })
  
  const data = await response.json()
  if (data.error) throw new Error(data.error_description)
  return data.access_token
}

async function firestoreRequest(accessToken, path, method = 'GET', body = null) {
  const url = `https://firestore.googleapis.com/v1/projects/${serviceAccount.projectId}/databases/default/documents${path}`
  
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }
  
  if (body) options.body = JSON.stringify(body)
  
  const response = await fetch(url, options)
  return response.json()
}

async function seed() {
  try {
    console.log('Seeding via Firestore REST API...\n')
    
    const accessToken = await getAccessToken()
    console.log('✓ Got access token')
    
    const adminHash = await bcrypt.hash('admin123', 10)
    const managerHash = await bcrypt.hash('manager123', 10)
    const ownerHash = await bcrypt.hash('owner123', 10)
    
    // Create admin user
    console.log('Creating admin...')
    await firestoreRequest(accessToken, '/users/uno_admin', 'PATCH', {
      fields: {
        username: { stringValue: 'uno_admin@gmail.com' },
        passwordHash: { stringValue: adminHash },
        role: { stringValue: 'admin' },
        fullName: { stringValue: 'UNO Admin' },
        phone: { stringValue: '01700000000' },
        stationId: { nullValue: null },
        createdAt: { timestampValue: new Date().toISOString() }
      }
    })
    console.log('✓ Admin created')
    
    // Create manager
    console.log('Creating manager...')
    await firestoreRequest(accessToken, '/users/manager_bakultala', 'PATCH', {
      fields: {
        username: { stringValue: 'manager_bakultala' },
        passwordHash: { stringValue: managerHash },
        role: { stringValue: 'manager' },
        fullName: { stringValue: 'Manager Bakultala' },
        phone: { stringValue: '01711111111' },
        stationId: { stringValue: 'bakultala-station' },
        createdAt: { timestampValue: new Date().toISOString() }
      }
    })
    console.log('✓ Manager created')
    
    // Create owner
    console.log('Creating owner...')
    const ownerResult = await firestoreRequest(accessToken, '/users/owner_karim', 'PATCH', {
      fields: {
        username: { stringValue: 'owner_karim' },
        passwordHash: { stringValue: ownerHash },
        role: { stringValue: 'owner' },
        fullName: { stringValue: 'Karim Uddin' },
        phone: { stringValue: '01722222222' },
        stationId: { nullValue: null },
        createdAt: { timestampValue: new Date().toISOString() }
      }
    })
    console.log('✓ Owner created')
    
    // Create station
    console.log('Creating station...')
    await firestoreRequest(accessToken, '/stations/bakultala-station', 'PATCH', {
      fields: {
        name: { stringValue: 'Bakultala Fuel Station' },
        createdAt: { timestampValue: new Date().toISOString() }
      }
    })
    console.log('✓ Station created')
    
    // Create vehicle
    console.log('Creating vehicle...')
    await firestoreRequest(accessToken, '/vehicles/DHA-123456', 'PATCH', {
      fields: {
        ownerUserId: { stringValue: 'owner_karim' },
        regNo: { stringValue: 'DHA-123456' },
        ownerName: { stringValue: 'Karim Uddin' },
        phone: { stringValue: '01722222222' },
        nid: { stringValue: '1234567890123' },
        licenseNo: { stringValue: 'DL-789012' },
        vehicleType: { stringValue: 'motorcycle' },
        taxToken: { stringValue: 'TXN-12345' },
        passportPhoto: { nullValue: null },
        nidPhoto: { nullValue: null },
        licensePhoto: { nullValue: null },
        taxTokenPhoto: { nullValue: null },
        qrCodeData: { stringValue: JSON.stringify({ regNo: 'DHA-123456', vehicleType: 'motorcycle' }) },
        createdAt: { timestampValue: new Date().toISOString() }
      }
    })
    console.log('✓ Vehicle created')
    
    console.log('\n✅ Seed complete!')
    console.log('Demo Credentials:')
    console.log('1. uno_admin@gmail.com / admin123')
    console.log('2. manager_bakultala / manager123')
    console.log('3. owner_karim / owner123')
    console.log('   Vehicle: DHA-123456')
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

seed()
