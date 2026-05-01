import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
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
  const jwt = await import('jsonwebtoken')
  const token = jwt.default.sign(
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
  return data.access_token
}

async function createFirestoreDatabase(accessToken) {
  const projectId = serviceAccount.projectId
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `projects/${projectId}/databases/(default)`,
      locationId: 'us-central1',
      type: 'FIRESTORE_NATIVE'
    })
  })
  
  return response.json()
}

async function setup() {
  try {
    console.log('Setting up Firestore database...')
    
    const accessToken = await getAccessToken()
    console.log('Got access token')
    
    const result = await createFirestoreDatabase(accessToken)
    console.log('Firestore database creation result:', result)
    
    if (result.error) {
      console.error('Error creating database:', result.error)
    } else {
      console.log('✓ Firestore database created successfully')
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Setup error:', error)
    process.exit(1)
  }
}

setup()
