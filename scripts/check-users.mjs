import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
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

async function getToken() {
  const token = jwt.sign(
    { iss: serviceAccount.clientEmail, sub: serviceAccount.clientEmail, aud: 'https://oauth2.googleapis.com/token', iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000)+3600, scope: 'https://www.googleapis.com/auth/datastore' },
    serviceAccount.privateKey, { algorithm: 'RS256' }
  )
  const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: {'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({ grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion:token }) })
  return (await res.json()).access_token
}

async function check() {
  const token = await getToken()
  const res = await fetch('https://firestore.googleapis.com/v1/projects/fuelguard-bochaganj/databases/default/documents/users', { headers:{Authorization:'Bearer '+token} })
  const data = await res.json()
  
  if (data.documents) {
    console.log('Users in database:')
    for (const doc of data.documents) {
      const fields = doc.fields
      console.log('- Username:', fields.username?.stringValue)
      console.log('  Role:', fields.role?.stringValue)
      console.log('  FullName:', fields.fullName?.stringValue)
    }
  } else {
    console.log('No users found or error:', data)
  }
}

check()