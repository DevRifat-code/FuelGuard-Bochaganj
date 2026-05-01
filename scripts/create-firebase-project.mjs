import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '../.env.local') })

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

async function createProject() {
  try {
    console.log('Creating new Firebase project...\n')
    
    const response = await fetch(`https://firebase.googleapis.com/v1beta1/projects?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: 'FuelGuard Bochaganj',
        projectId: 'fuelguard-bochaganj-v2'
      })
    })
    
    const result = await response.json()
    console.log('Response:', JSON.stringify(result, null, 2))
    
    if (result.error) {
      console.log('\n⚠️  Could not create project via API.')
      console.log('Project ID "fuelguard-bochaganj" already exists.')
      console.log('\nLet me fix the current project instead...')
    } else {
      console.log('\n✅ New project created!')
      console.log('Project ID:', result.projectId)
    }
    
    return result
  } catch (error) {
    console.error('Error:', error.message)
  }
}

createProject()
