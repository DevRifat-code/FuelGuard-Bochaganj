import {
  getVehicleByRegNo,
  getRecentHighFuelLogs,
  createFuelLog,
  getFuelLogsForVehicle,
  type FirestoreVehicle,
  type FirestoreFuelLog,
} from "./firestore"
import { differenceInDays } from "date-fns"

export interface EligibilityResult {
  eligible: boolean
  daysRemaining: number
  message: string
  threshold: number
  lastHighFuel?: {
    amountBdt: number
    timestamp: Date
    fuelType: string
  }
  vehicleType: string
  vehicleId?: string
}

export async function checkEligibility(vehicleId: string): Promise<EligibilityResult> {
  const vehicle = await getVehicleById(vehicleId)

  if (!vehicle) {
    return {
      eligible: false,
      daysRemaining: 0,
      message: "যানবাহন খুঁজে পাওয়া যায়নি।",
      threshold: 0,
      vehicleType: "",
    }
  }

  const threshold = vehicle.vehicleType === "motorcycle" ? 500 : 2000
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const recentLogs = await getRecentHighFuelLogs(vehicleId, threshold, sevenDaysAgo)
  const recentHighLog = recentLogs.length > 0 ? recentLogs[0] : null

  if (recentHighLog && recentHighLog.timestamp) {
    const logDate = recentHighLog.timestamp.toDate()
    const daysSince = differenceInDays(new Date(), logDate)
    const daysRemaining = Math.max(0, 7 - daysSince)

    const banglaMessage = `এই ${vehicle.vehicleType === "motorcycle" ? "মোটরসাইকেল" : "মোটর ভেহিকল"}টি গত ${daysSince} দিন আগে ${recentHighLog.amountBdt} টাকার জ্বালানি নিয়েছে। বর্তমানে ${daysRemaining} দিনের ব্লক চলছে।`

    return {
      eligible: false,
      daysRemaining,
      message: banglaMessage,
      threshold,
      lastHighFuel: {
        amountBdt: recentHighLog.amountBdt,
        timestamp: logDate,
        fuelType: recentHighLog.fuelType,
      },
      vehicleType: vehicle.vehicleType,
      vehicleId: vehicle.id,
    }
  }

  return {
    eligible: true,
    daysRemaining: 0,
    message: `যানবাহনটি জ্বালানি নেওয়ার জন্য যোগ্য। (সীমা: ${threshold} টাকা)`,
    threshold,
    vehicleType: vehicle.vehicleType,
    vehicleId: vehicle.id,
  }
}

async function getVehicleById(id: string): Promise<FirestoreVehicle | null> {
  const { doc, getDoc } = await import("firebase/firestore")
  const { db } = await import("./firebase")
  const snap = await getDoc(doc(db, "vehicles", id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as FirestoreVehicle
}

export async function recordFuelLog(
  vehicleId: string,
  stationId: string,
  amountBdt: number,
  fuelType: "petrol" | "octane",
  managerId: string
) {
  const id = await createFuelLog({
    vehicleId,
    stationId,
    amountBdt,
    fuelType,
    managerId,
  })

  const { doc, getDoc } = await import("firebase/firestore")
  const { db } = await import("./firebase")
  const logSnap = await getDoc(doc(db, "fuelLogs", id))

  return { id, ...logSnap.data() }
}
