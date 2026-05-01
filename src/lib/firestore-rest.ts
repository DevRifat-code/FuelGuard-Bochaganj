import { SignJWT, jwtVerify } from "jose"
import * as bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fuelguard-uno-setabganj-secret-key-2026"
)

const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/default/documents`

interface FirestoreUser {
  id: string
  username: string
  passwordHash: string
  role: "admin" | "manager" | "owner"
  fullName: string | null
  phone: string | null
  stationId: string | null
}

async function firestoreQuery(collection: string, field: string, value: string): Promise<any[]> {
  const url = `${FIRESTORE_URL}/${collection}?where=${encodeURIComponent(field+'=='+value)}`
  
  const res = await fetch(url, {
    headers: { 
      'Authorization': 'Bearer ' + process.env.FIREBASE_API_KEY,
      'Content-Type': 'application/json'
    }
  })
  
  if (!res.ok) {
    console.log('Firestore query error:', await res.text())
    return []
  }
  
  const data = await res.json()
  return data.documents || []
}

export async function getUsersByField(field: string, value: string): Promise<FirestoreUser[]> {
  const docs = await firestoreQuery('users', field, value)
  return docs.map((doc: any) => ({
    id: doc.name.split('/').pop(),
    username: doc.fields?.username?.stringValue,
    passwordHash: doc.fields?.passwordHash?.stringValue,
    role: doc.fields?.role?.stringValue,
    fullName: doc.fields?.fullName?.stringValue || null,
    phone: doc.fields?.phone?.stringValue || null,
    stationId: doc.fields?.stationId?.stringValue || null
  }))
}

export async function getUserById(id: string): Promise<FirestoreUser | null> {
  const res = await fetch(`${FIRESTORE_URL}/users/${id}`, {
    headers: { 
      'Authorization': 'Bearer ' + process.env.FIREBASE_API_KEY,
      'Content-Type': 'application/json'
    }
  })
  
  if (!res.ok) return null
  
  const doc = await res.json()
  return {
    id: doc.name.split('/').pop(),
    username: doc.fields?.username?.stringValue,
    passwordHash: doc.fields?.passwordHash?.stringValue,
    role: doc.fields?.role?.stringValue,
    fullName: doc.fields?.fullName?.stringValue || null,
    phone: doc.fields?.phone?.stringValue || null,
    stationId: doc.fields?.stationId?.stringValue || null
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
  return token
}

export async function getUserFromToken(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string
    const user = await getUserById(userId)
    if (!user) return null
    return { id: user.id, username: user.username, role: user.role, fullName: user.fullName, phone: user.phone, stationId: user.stationId }
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<any | null> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) return null
  return getUserFromToken(token)
}

export async function login(username: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
  const users = await getUsersByField("username", username.toLowerCase().trim())
  if (users.length === 0) {
    return { success: false, error: "Invalid username or password" }
  }

  const user = users[0]
  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return { success: false, error: "Invalid username or password" }
  }

  const token = await createSession(user.id)
  return {
    success: true,
    user: { id: user.id, username: user.username, role: user.role, fullName: user.fullName, phone: user.phone, stationId: user.stationId }
  }
}