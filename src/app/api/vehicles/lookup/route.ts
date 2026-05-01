import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { vehicles, fuelLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { checkEligibility } from "@/lib/fuel";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const regNo = searchParams.get("regNo");
  const id = searchParams.get("id");

  if (!regNo && !id) {
    return NextResponse.json({ error: "Provide regNo or id" }, { status: 400 });
  }

  try {
    let vehicle;
    if (id) {
      vehicle = await db.query.vehicles.findFirst({ where: eq(vehicles.id, parseInt(id)) });
    } else {
      vehicle = await db.query.vehicles.findFirst({ where: eq(vehicles.regNo, regNo!.toUpperCase()) });
    }

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const eligibility = await checkEligibility(vehicle.id);

    // Get recent logs
    const recentLogs = await db.query.fuelLogs.findMany({
      where: eq(fuelLogs.vehicleId, vehicle.id),
      orderBy: desc(fuelLogs.timestamp),
      limit: 5,
      with: { station: true },
    });

    return NextResponse.json({
      vehicle,
      eligibility,
      recentLogs,
    });
  } catch (error) {
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
