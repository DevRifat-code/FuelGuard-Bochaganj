import { db } from "./firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type QueryConstraint,
} from "firebase/firestore"
import { Timestamp } from "firebase/firestore"

// ============ USERS ============
export interface FirestoreUser {
  id?: string
  username: string
  passwordHash: string
  role: "admin" | "manager" | "owner"
  fullName: string | null
  phone: string | null
  stationId: string | null
  stationName?: string
  createdAt?: Timestamp
}

export async function getUsersByField(field: string, value: string): Promise<FirestoreUser[]> {
  const q = query(collection(db, "users"), where(field, "==", value))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as FirestoreUser)
}

export async function getUserById(id: string): Promise<FirestoreUser | null> {
  const snap = await getDoc(doc(db, "users", id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as FirestoreUser
}

export async function createUser(data: Omit<FirestoreUser, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "users"), {
    ...data,
    createdAt: Timestamp.now(),
  })
  return ref.id
}

export async function updateUser(id: string, data: Partial<FirestoreUser>): Promise<void> {
  await updateDoc(doc(db, "users", id), data)
}

// ============ VEHICLES ============
export interface FirestoreVehicle {
  id?: string
  ownerUserId: string
  regNo: string
  ownerName: string
  phone: string
  nid: string
  licenseNo: string
  vehicleType: "motorcycle" | "motor_vehicle"
  taxToken: string | null
  passportPhoto: string | null
  nidPhoto: string | null
  licensePhoto: string | null
  taxTokenPhoto: string | null
  qrCodeData: string
  createdAt?: Timestamp
}

export async function getVehicleByRegNo(regNo: string): Promise<FirestoreVehicle | null> {
  const q = query(collection(db, "vehicles"), where("regNo", "==", regNo.toUpperCase().trim()))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as FirestoreVehicle
}

export async function createVehicle(data: Omit<FirestoreVehicle, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "vehicles"), {
    ...data,
    createdAt: Timestamp.now(),
  })
  return ref.id
}

// ============ FUEL LOGS ============
export interface FirestoreFuelLog {
  id?: string
  vehicleId: string
  stationId: string
  amountBdt: number
  fuelType: "petrol" | "octane"
  managerId: string
  timestamp?: Timestamp
}

export async function createFuelLog(data: Omit<FirestoreFuelLog, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "fuelLogs"), {
    ...data,
    timestamp: Timestamp.now(),
  })
  return ref.id
}

export async function getRecentHighFuelLogs(
  vehicleId: string,
  threshold: number,
  since: Date
): Promise<FirestoreFuelLog[]> {
  const q = query(
    collection(db, "fuelLogs"),
    where("vehicleId", "==", vehicleId),
    orderBy("amountBdt", "desc"),
    orderBy("timestamp", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }) as FirestoreFuelLog)
    .filter(log => log.amountBdt >= threshold && log.timestamp && log.timestamp.toDate() >= since)
    .slice(0, 1)
}

export async function getFuelLogsForVehicle(vehicleId: string): Promise<FirestoreFuelLog[]> {
  const q = query(
    collection(db, "fuelLogs"),
    where("vehicleId", "==", vehicleId),
    orderBy("timestamp", "desc")
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as FirestoreFuelLog)
}

// ============ STATIONS ============
export interface FirestoreStation {
  id?: string
  name: string
  createdAt?: Timestamp
}

export async function getStations(): Promise<FirestoreStation[]> {
  const snap = await getDocs(collection(db, "stations"))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as FirestoreStation)
}

export async function createStation(data: Omit<FirestoreStation, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "stations"), {
    ...data,
    createdAt: Timestamp.now(),
  })
  return ref.id
}
