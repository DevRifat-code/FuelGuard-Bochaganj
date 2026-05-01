import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
}

let adminDb: ReturnType<typeof getFirestore>

function getAdminDb() {
  if (!adminDb) {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert(serviceAccount as any)
      })
    }
    adminDb = getFirestore()
  }
  return adminDb
}

export interface FirestoreUser {
  id: string
  username: string
  passwordHash: string
  role: "admin" | "manager" | "owner"
  fullName: string | null
  phone: string | null
  stationId: string | null
  stationName?: string
}

export async function getUsersByField(field: string, value: string): Promise<FirestoreUser[]> {
  const db = getAdminDb()
  const q = db.collection("users").where(field, "==", value)
  const snap = await q.get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as FirestoreUser[]
}

export async function getUserById(id: string): Promise<FirestoreUser | null> {
  const db = getAdminDb()
  const snap = await db.doc("users/" + id).get()
  if (!snap.exists) return null
  return { id: snap.id, ...snap.data() } as FirestoreUser
}