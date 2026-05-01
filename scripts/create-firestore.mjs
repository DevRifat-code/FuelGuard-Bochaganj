import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
}

// Get access token from service account
async function getAccessToken() {
  const token = jwt.sign(
    {
      iss: serviceAccount.clientEmail,
      sub: serviceAccount.clientEmail,
      aud: 'https://oauth2.googleapis.com/token',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      scope: 'https://www.googleapis.com/auth/cloud-platform'
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
  if (data.error) {
    throw new Error(`Token error: ${data.error_description}`)
  }
  return data.access_token
}

async function createFirestore(accessToken) {
  const projectId = serviceAccount.projectId
  
  // Try to create Firestore database using v1 API
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases?databaseId=(default)`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'FIRESTORE_NATIVE',
      locationId: 'asia-south1'
    })
  })
  
  const result = await response.json()
  return { status: response.status, data: result }
}

async function checkFirestore(accessToken) {
  const projectId = serviceAccount.projectId
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  
  return response.json()
}

async function setup() {
  try {
    console.log('Checking if Firestore exists...')
    
    const accessToken = await getAccessToken()
    
    // Check if database already exists
    const checkResult = await checkFirestore(accessToken)
    
    if (checkResult.databases && checkResult.databases.length > 0) {
      console.log('✓ Firestore database already exists!')
      console.log('Databases:', checkResult.databases)
      process.exit(0)
    }
    
    console.log('Firestore not found. Creating database...')
    const result = await createFirestore(accessToken)
    
    console.log('Status:', result.status)
    console.log('Response:', JSON.stringify(result.data, null, 2))
    
    if (result.status === 200 || result.status === 201) {
      console.log('\n✅ Firestore database created successfully!')
    } else if (result.data.error) {
      console.error('\n❌ Error:', result.data.error.message)
      if (result.data.error.status === 'PERMISSION_DENIED') {
        console.log('\n⚠️  The service account needs additional permissions.')
        console.log('Please go to Firebase Console and create the database manually:')
        console.log('https://console.firebase.google.com/project/fuelguard-bochaganj/firestore')
      }
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Setup error:', error.message)
    process.exit(1)
  }
}

setup()
