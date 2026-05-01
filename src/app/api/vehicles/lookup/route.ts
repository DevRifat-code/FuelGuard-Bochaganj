import { NextRequest, NextResponse } from "next/server"
import { getVehicleByRegNo, getFuelLogsForVehicle } from "@/lib/firestore"
import { checkEligibility } from "@/lib/fuel"
import { getDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const regNo = searchParams.get("regNo")
  const id = searchParams.get("id")

  if (!regNo && !id) {
    return NextResponse.json({ error: "Provide regNo or id" }, { status: 400 })
  }

  try {
    let vehicle
    if (id) {
      const snap = await getDoc(doc(db, "vehicles", id))
      if (snap.exists()) {
        vehicle = { id: snap.id, ...snap.data() }
      }
    } else {
      vehicle = await getVehicleByRegNo(regNo!.toUpperCase())
    }

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    const vehicleId = vehicle.id as string
    const eligibility = await checkEligibility(vehicleId)

    const recentLogs = await getFuelLogsForVehicle(vehicleId)
    const logs = recentLogs.slice(0, 5).map(log => ({
      ...log,
      timestamp: log.timestamp?.toDate(),
    }))

    return NextResponse.json({
      vehicle,
      eligibility,
      recentLogs: logs,
    })
  } catch (error) {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 })
  }
}
