import { NextRequest, NextResponse } from "next/server"
import { recordFuelLog, checkEligibility } from "@/lib/fuel"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== "manager") {
    return NextResponse.json({ error: "Unauthorized. Only pump managers can log fuel." }, { status: 401 })
  }

  try {
    const { vehicleId, amountBdt, fuelType } = await request.json()

    if (!vehicleId || !amountBdt || !fuelType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const eligibility = await checkEligibility(vehicleId)
    if (!eligibility.eligible) {
      return NextResponse.json(
        {
          error: "Vehicle is currently blocked",
          eligibility,
        },
        { status: 403 }
      )
    }

    const stationId = user.stationId || "default-station"

    const log = await recordFuelLog(vehicleId, stationId, parseInt(amountBdt), fuelType, user.id)

    return NextResponse.json({
      success: true,
      log,
      eligibility: await checkEligibility(vehicleId),
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: "Failed to record fuel log" }, { status: 500 })
  }
}
