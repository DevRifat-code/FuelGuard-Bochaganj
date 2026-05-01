import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { fuelLogs } from "@/db/schema";
import { recordFuelLog, checkEligibility } from "@/lib/fuel";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "manager") {
    return NextResponse.json({ error: "Unauthorized. Only pump managers can log fuel." }, { status: 401 });
  }

  try {
    const { vehicleId, amountBdt, fuelType } = await request.json();

    if (!vehicleId || !amountBdt || !fuelType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check eligibility first
    const eligibility = await checkEligibility(vehicleId);
    if (!eligibility.eligible) {
      return NextResponse.json({ 
        error: "Vehicle is currently blocked", 
        eligibility 
      }, { status: 403 });
    }

    // Use manager's station if assigned
    const stationId = user.stationId || 1; // fallback

    const log = await recordFuelLog(
      vehicleId,
      stationId,
      parseInt(amountBdt),
      fuelType,
      user.id
    );

    return NextResponse.json({ success: true, log, eligibility: await checkEligibility(vehicleId) });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to record fuel log" }, { status: 500 });
  }
}
