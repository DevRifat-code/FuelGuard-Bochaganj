import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDocs, query, orderBy, limit, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 401 })
  }

  const q = query(collection(db, "fuelLogs"), orderBy("timestamp", "desc"), limit(100))
  const snap = await getDocs(q)

  const logs = snap.docs.map(d => {
    const data = d.data()
    return {
      id: d.id,
      amountBdt: data.amountBdt,
      fuelType: data.fuelType,
      timestamp: data.timestamp?.toDate(),
      vehicleId: data.vehicleId,
      stationId: data.stationId,
      managerId: data.managerId,
    }
  })

  return NextResponse.json({ logs })
}
